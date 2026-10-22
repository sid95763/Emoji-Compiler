import type { HumorLevel } from '../types/compiler';

export interface ComplexityResult {
  notation: string; // e.g. "O(1)", "O(log n)", "O(n)", "O(n²)", "O(n³)", "O(2ⁿ)"
  maxDepth: number;
  deepestLoopLine: number | null;
  isRecursive: boolean;
  hasMultipleRecursion: boolean;
  warning?: string;
  explanation: string;
}

/**
 * Static heuristic analysis to estimate C++ algorithmic time complexity.
 * Analyzes loop nesting depths, recursive function calls, and binary search step patterns.
 */
export function estimateComplexity(code: string, humorLevel: HumorLevel = 1): ComplexityResult {
  const lines = code.split('\n');

  let currentDepth = 0;
  let maxDepth = 0;
  let deepestLoopLine: number | null = null;
  let hasLogPattern = false;

  // Track function names for recursion detection
  const functionDefs: Array<{ name: string; startLine: number }> = [];
  const funcRegex = /\b(?:void|int|long|double|float|bool|string|auto)\s+([a-zA-Z_]\w*)\s*\([^)]*\)\s*\{/g;

  let match: RegExpExecArray | null;
  while ((match = funcRegex.exec(code)) !== null) {
    const funcName = match[1];
    if (funcName !== 'main') {
      const lineNum = code.slice(0, match.index).split('\n').length;
      functionDefs.push({ name: funcName, startLine: lineNum });
    }
  }

  // Detect recursion
  let isRecursive = false;
  let hasMultipleRecursion = false;

  for (const fn of functionDefs) {
    // Count occurrences of fn.name( in code
    const callRegex = new RegExp(`\\b${fn.name}\\s*\\(`, 'g');
    const calls = (code.match(callRegex) || []).length;
    // 1 is definition, > 1 means it's called
    if (calls > 1) {
      // Check if called inside its own body
      const funcBodyStart = code.indexOf(`{`, code.indexOf(fn.name));
      if (funcBodyStart !== -1) {
        const bodySnippet = code.slice(funcBodyStart);
        const internalCalls = (bodySnippet.match(callRegex) || []).length;
        if (internalCalls >= 1) {
          isRecursive = true;
          if (internalCalls >= 2) {
            hasMultipleRecursion = true;
          }
        }
      }
    }
  }

  // Detect loop nesting
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const lineNum = i + 1;

    // Ignore single line comments
    if (line.startsWith('//') || line.startsWith('/*')) continue;

    const isLoop = /\b(for|while)\s*\(/.test(line) || /\bdo\s*\{/.test(line);

    if (isLoop) {
      currentDepth++;
      if (currentDepth > maxDepth) {
        maxDepth = currentDepth;
        deepestLoopLine = lineNum;
      }
    }

    if (currentDepth > 0 || isLoop) {
      if (
        line.includes('/= 2') ||
        line.includes('/=2') ||
        line.includes('>>= 1') ||
        line.includes('>>=1') ||
        line.includes('/ 2') ||
        line.includes('mid =')
      ) {
        hasLogPattern = true;
      }
    }

    // Rough brace tracking
    const opens = (line.match(/\{/g) || []).length;
    const closes = (line.match(/\}/g) || []).length;
    if (closes > opens && currentDepth > 0) {
      currentDepth = Math.max(0, currentDepth - (closes - opens));
    }
  }

  // Derive estimated notation
  let notation = 'O(1)';
  if (hasMultipleRecursion) {
    notation = 'O(2ⁿ)';
  } else if (isRecursive) {
    notation = maxDepth >= 1 ? 'O(n²)' : 'O(n)';
  } else if (maxDepth === 0) {
    notation = 'O(1)';
  } else if (maxDepth === 1) {
    notation = hasLogPattern ? 'O(log n)' : 'O(n)';
  } else if (maxDepth === 2) {
    notation = hasLogPattern ? 'O(n log n)' : 'O(n²)';
  } else if (maxDepth === 3) {
    notation = 'O(n³)';
  } else {
    notation = `O(n^${maxDepth})`;
  }

  // Warning for high depth or exponential complexity
  let warning: string | undefined = undefined;
  if (maxDepth >= 3 || hasMultipleRecursion) {
    if (humorLevel === 0) {
      warning = `High complexity estimate (${notation}). Review nested loops and recursion for optimization opportunities.`;
    } else if (humorLevel === 1) {
      warning = maxDepth >= 3
        ? `Triple nested loop detected! Your CPU is breaking a sweat. 🐢`
        : `Branching recursion detected! The call stack is doing gymnastics. 🎪`;
    } else {
      warning = maxDepth >= 3
        ? `Nesting depth ${maxDepth}?! Are you trying to heat your house with CPU fans? 🔥`
        : `Exponential recursion! Universe will end before this finishes calculating. 💥`;
    }
  }

  const explanation =
    'ESTIMATE: Static heuristic based on loop nesting depth and recursive branch detection. Real execution time depends on input size, branch prediction, and standard library internals.';

  return {
    notation,
    maxDepth,
    deepestLoopLine,
    isRecursive,
    hasMultipleRecursion,
    warning,
    explanation,
  };
}
