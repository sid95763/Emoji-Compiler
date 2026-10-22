import jokesData from '../data/jokes.json';
import type { Diagnostic, ErrorType, HumorLevel, Severity, SuggestedFix } from '../types/compiler';
import { mapDiagnosticToPhase } from './pipelinePhases';

type JokeEntry = {
  emoji: string;
  name: string;
  fix: string;
  beginner: string;
  level_0: string[];
  level_1: string[];
  level_2: string[];
};

const jokesMap = jokesData.jokes as Record<string, JokeEntry>;

/**
 * Categorize error messages into defined ErrorTypes
 */
export function categorizeError(msg: string, code?: string): ErrorType {
  const lower = msg
    .toLowerCase()
    .replace(/[‘’`]/g, "'")
    .replace(/[“”]/g, '"');

  // Semicolon
  if (
    lower.includes("expected ';'") ||
    lower.includes("expected ';' before") ||
    lower.includes("missing ';'") ||
    lower.includes("expected ';' after") ||
    lower.includes("';' expected")
  ) {
    return 'missing_semicolon';
  }

  // Missing Include
  if (
    lower.includes('no such file or directory') ||
    lower.includes("did you mean 'std::cout'") ||
    lower.includes("did you forget to '#include") ||
    lower.includes('was not declared in this scope; did you mean') ||
    (lower.includes('cout') && lower.includes('not declared')) ||
    (lower.includes('vector') && lower.includes('not declared')) ||
    (lower.includes('string') && lower.includes('not declared'))
  ) {
    if (
      lower.includes('iostream') ||
      (lower.includes('cout') && (!code || !code.includes('<iostream>'))) ||
      (lower.includes('vector') && (!code || !code.includes('<vector>'))) ||
      (lower.includes('string') && (!code || !code.includes('<string>')))
    ) {
      return 'missing_include';
    }
  }

  // Undeclared variable/identifier
  if (lower.includes('not declared in this scope') || lower.includes('undeclared identifier') || lower.includes('was not declared')) {
    return 'undeclared_variable';
  }

  // Type mismatch
  if (lower.includes('cannot convert') || lower.includes('invalid conversion') || lower.includes('incompatible type') || lower.includes('no viable conversion')) {
    return 'type_mismatch';
  }

  // Unused variable
  if (lower.includes('unused variable') || lower.includes('unused parameter') || lower.includes('defined but not used')) {
    return 'unused_variable';
  }

  // Missing return
  if (lower.includes('control reaches end of non-void function') || lower.includes('no return, in function returning non-void')) {
    return 'missing_return';
  }

  // Division by zero
  if (lower.includes('division by zero') || lower.includes('dividing by zero') || lower.includes('sigfpe') || lower.includes('floating point exception')) {
    return 'division_by_zero';
  }

  // Brace / Bracket mismatch
  if (lower.includes("expected '}'") || lower.includes("expected ')'") || lower.includes("expected ']'") || lower.includes('unmatched') || lower.includes("expected declaration before '}'")) {
    return 'brace_mismatch';
  }

  // Segfault
  if (lower.includes('sigsegv') || lower.includes('segmentation fault') || lower.includes('139')) {
    return 'segfault';
  }

  // Infinite loop
  if (lower.includes('time limit exceeded') || lower.includes('timed out') || lower.includes('137') || lower.includes('sigxcpu')) {
    return 'infinite_loop';
  }

  return 'general_error';
}

/**
 * Pick a joke given errorType and humorLevel
 */
export function getJokeForType(errorType: ErrorType, humorLevel: HumorLevel): { joke: string; emoji: string; fix: string; beginner: string } {
  const entry = jokesMap[errorType] || jokesMap.general_error;
  let pool = entry.level_1;
  if (humorLevel === 0) pool = entry.level_0;
  else if (humorLevel === 2) pool = entry.level_2;

  if (!pool || pool.length === 0) {
    pool = entry.level_1 || [entry.fix];
  }

  const randomIndex = Math.floor(Math.random() * pool.length);
  return {
    joke: pool[randomIndex],
    emoji: entry.emoji,
    fix: entry.fix,
    beginner: entry.beginner || entry.fix,
  };
}

/**
 * Generate a smart code diff patch for recognized errors
 */
export function generateSuggestedFix(
  errorType: ErrorType,
  lineNum: number,
  _columnNum: number,
  code: string
): SuggestedFix | undefined {
  const lines = code.split('\n');
  const targetLineIdx = lineNum - 1;
  if (targetLineIdx < 0 || targetLineIdx >= lines.length) {
    return undefined;
  }

  const currentLine = lines[targetLineIdx];

  if (errorType === 'missing_semicolon') {
    // If the compiler points to the beginning of next line or end of current line
    // Often semicolon is missing on targetLine or previous non-empty line
    let actualLineIdx = targetLineIdx;
    if (
      currentLine.trimEnd().endsWith(';') ||
      currentLine.trim().startsWith('}') ||
      currentLine.trim().startsWith('return')
    ) {
      if (
        targetLineIdx > 0 &&
        !lines[targetLineIdx - 1].trim().endsWith(';') &&
        !lines[targetLineIdx - 1].trim().endsWith('{') &&
        lines[targetLineIdx - 1].trim().length > 0
      ) {
        actualLineIdx = targetLineIdx - 1;
      }
    }

    const lineToPatch = lines[actualLineIdx];
    if (lineToPatch && !lineToPatch.trimEnd().endsWith(';')) {
      return {
        description: `Add missing semicolon ';' at the end of line ${actualLineIdx + 1}`,
        line: actualLineIdx + 1,
        originalCode: lineToPatch,
        replacementCode: lineToPatch.trimEnd() + ';',
      };
    }
  }

  if (errorType === 'missing_include') {
    let header = '<iostream>';
    if (code.includes('vector') && !code.includes('<vector>')) {
      header = '<vector>';
    } else if (code.includes('string') && !code.includes('<string>')) {
      header = '<string>';
    } else if (code.includes('accumulate') && !code.includes('<numeric>')) {
      header = '<numeric>';
    }

    return {
      description: `Add #include ${header} at the top of the file`,
      line: 1,
      originalCode: lines[0] || '',
      replacementCode: `#include ${header}\n${lines[0] || ''}`,
    };
  }

  if (errorType === 'undeclared_variable') {
    // Check if e.g. "score = 100;" or "count = 0;"
    const assignMatch = currentLine.match(/^\s*([a-zA-Z_]\w*)\s*=\s*(.+);?$/);
    if (assignMatch) {
      const varName = assignMatch[1];
      const val = assignMatch[2].trim();
      let inferredType = 'int';
      if (val.startsWith('"')) inferredType = 'std::string';
      else if (val.includes('.')) inferredType = 'double';
      else if (val === 'true' || val === 'false') inferredType = 'bool';

      const indent = currentLine.match(/^\s*/)?.[0] || '';
      return {
        description: `Declare variable '${varName}' as ${inferredType}`,
        line: lineNum,
        originalCode: currentLine,
        replacementCode: `${indent}${inferredType} ${currentLine.trim()}`,
      };
    } else {
      const idMatch = currentLine.match(/\b([a-zA-Z_]\w*)\b/);
      if (idMatch && !['int', 'cout', 'cin', 'return', 'std', 'void'].includes(idMatch[1])) {
        const indent = currentLine.match(/^\s*/)?.[0] || '    ';
        return {
          description: `Declare variable '${idMatch[1]}' before usage`,
          line: lineNum,
          originalCode: currentLine,
          replacementCode: `${indent}int ${idMatch[1]} = 0;\n${currentLine}`,
        };
      }
    }
  }

  if (errorType === 'type_mismatch') {
    // e.g. int age = "twenty-one"; -> std::string age = "twenty-one";
    if (currentLine.includes('int ') && currentLine.includes('"')) {
      return {
        description: 'Change variable type from int to string',
        line: lineNum,
        originalCode: currentLine,
        replacementCode: currentLine.replace(/\bint\b/, 'string'),
      };
    }
  }

  if (errorType === 'segfault') {
    if (currentLine.includes('*ptr') || currentLine.includes('*')) {
      const indent = currentLine.match(/^\s*/)?.[0] || '    ';
      return {
        description: 'Point pointer to valid memory before dereferencing',
        line: lineNum,
        originalCode: currentLine,
        replacementCode: `${indent}int safeValue = 42;\n${indent}ptr = &safeValue;\n${currentLine}`,
      };
    }
  }

  if (errorType === 'division_by_zero') {
    const divMatch = currentLine.match(/(\/\s*0)/);
    if (divMatch) {
      return {
        description: 'Replace zero divisor with a non-zero denominator',
        line: lineNum,
        originalCode: currentLine,
        replacementCode: currentLine.replace(divMatch[1], '/ 1 /* non-zero divisor */'),
      };
    }
  }

  if (errorType === 'brace_mismatch') {
    return {
      description: "Add missing closing brace '}'",
      line: lineNum,
      originalCode: currentLine,
      replacementCode: `${currentLine}\n}`,
    };
  }

  if (errorType === 'missing_return') {
    return {
      description: 'Add return statement before closing brace',
      line: lineNum,
      originalCode: currentLine,
      replacementCode: `    return 0;\n${currentLine}`,
    };
  }

  if (errorType === 'infinite_loop') {
    return {
      description: 'Add loop variable increment to terminate loop',
      line: lineNum,
      originalCode: currentLine,
      replacementCode: `${currentLine}\n        count++;`,
    };
  }

  return undefined;
}

/**
 * Parse compiler diagnostics from stderr / compile_output string
 */
export function parseCompilerDiagnostics(
  output: string,
  code: string,
  humorLevel: HumorLevel = 1
): Diagnostic[] {
  if (!output || output.trim().length === 0) return [];

  const diagnostics: Diagnostic[] = [];

  // Match GCC / Clang patterns:
  // main.cpp:4:26: error: expected ‘;’ before ‘}’ token
  // <stdin>:5:10: warning: unused variable ‘x’
  // /tmp/code.cpp:12:5: note: previous declaration was here
  const diagRegex = /(?:^|[\r\n])(?:[a-zA-Z0-9_./\\:-]+):(\d+):(\d+):\s*(fatal error|error|warning|note):\s*(.*?)(?=(?:[\r\n](?:[a-zA-Z0-9_./\\:-]+):\d+:\d+:)|$)/gs;

  let match: RegExpExecArray | null;
  let index = 0;

  while ((match = diagRegex.exec(output)) !== null) {
    const line = parseInt(match[1], 10);
    const col = parseInt(match[2], 10);
    const rawSev = match[3].toLowerCase();
    const rawMsg = match[4].trim();

    let severity: Severity = 'error';
    if (rawSev === 'warning') severity = 'warning';
    else if (rawSev === 'note') severity = 'note';

    const errorType = severity === 'note' ? 'general_note' : severity === 'warning' ? (rawMsg.includes('unused') ? 'unused_variable' : 'general_warning') : categorizeError(rawMsg, code);

    const jokeInfo = getJokeForType(errorType, humorLevel);
    const fix = generateSuggestedFix(errorType, line, col, code);

    // Get code snippet if available
    const codeLines = code.split('\n');
    const snippet = codeLines[line - 1] || undefined;

    diagnostics.push({
      id: `diag-${index++}-${line}-${col}`,
      line,
      column: col,
      severity,
      errorType,
      emoji: jokeInfo.emoji,
      message: cleanCompilerMessage(rawMsg),
      rawMessage: rawMsg,
      codeSnippet: snippet,
      suggestedFix: fix,
      funnyJoke: jokeInfo.joke,
      shortFix: jokeInfo.fix,
      beginnerExplanation: jokeInfo.beginner,
      phase: mapDiagnosticToPhase(errorType, rawMsg),
    });
  }

  // Fallback: if output clearly contains error but regex didn't capture line
  if (diagnostics.length === 0 && (output.toLowerCase().includes('error:') || output.toLowerCase().includes('error'))) {
    const errorType = categorizeError(output, code);
    const jokeInfo = getJokeForType(errorType, humorLevel);
    diagnostics.push({
      id: `diag-fallback-1`,
      line: 1,
      column: 1,
      severity: 'error',
      errorType,
      emoji: jokeInfo.emoji,
      message: cleanCompilerMessage(output.split('\n')[0] || 'Compilation error'),
      rawMessage: output,
      codeSnippet: code.split('\n')[0] || '',
      funnyJoke: jokeInfo.joke,
      shortFix: jokeInfo.fix,
      beginnerExplanation: jokeInfo.beginner,
      phase: mapDiagnosticToPhase(errorType, output),
    });
  }

  return diagnostics;
}

/**
 * Parse runtime errors (e.g. Segfault, TLE, SIGFPE)
 */
export function parseRuntimeError(
  statusDesc: string,
  stderr: string,
  code: string,
  exitCode?: number,
  humorLevel: HumorLevel = 1
): Diagnostic[] {
  const combined = `${statusDesc} ${stderr}`.toLowerCase();
  let errorType: ErrorType = 'general_error';
  let line = 1;

  if (combined.includes('segmentation fault') || combined.includes('sigsegv') || exitCode === 139) {
    errorType = 'segfault';
    // Find nullptr line in code
    const lines = code.split('\n');
    lines.forEach((l, idx) => {
      if (l.includes('nullptr') || l.includes('*ptr') || l.includes('NULL')) {
        line = idx + 1;
      }
    });
  } else if (combined.includes('time limit exceeded') || combined.includes('timed out') || exitCode === 137) {
    errorType = 'infinite_loop';
    const lines = code.split('\n');
    lines.forEach((l, idx) => {
      if (l.includes('while') || l.includes('for')) {
        line = idx + 1;
      }
    });
  } else if (combined.includes('floating point exception') || combined.includes('sigfpe') || exitCode === 136) {
    errorType = 'division_by_zero';
    const lines = code.split('\n');
    lines.forEach((l, idx) => {
      if (l.includes('/ 0') || l.includes('/0')) {
        line = idx + 1;
      }
    });
  } else {
    return [];
  }

  const jokeInfo = getJokeForType(errorType, humorLevel);
  const fix = generateSuggestedFix(errorType, line, 1, code);

  return [
    {
      id: `diag-runtime-${line}`,
      line,
      column: 1,
      severity: 'runtime',
      errorType,
      emoji: jokeInfo.emoji,
      message: statusDesc || 'Runtime Error',
      rawMessage: stderr || statusDesc,
      codeSnippet: code.split('\n')[line - 1],
      suggestedFix: fix,
      funnyJoke: jokeInfo.joke,
      shortFix: jokeInfo.fix,
      beginnerExplanation: jokeInfo.beginner,
      phase: mapDiagnosticToPhase(errorType, stderr || statusDesc),
    },
  ];
}

/**
 * Remove strange non-ASCII curly quotes or file paths from compiler messages for clean readability
 */
function cleanCompilerMessage(msg: string): string {
  return msg
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/main\.cpp:\d+:\d+:\s*/g, '')
    .trim();
}
