import type { ErrorType } from '../types/compiler';

/**
 * 5 Standard Compilation Pipeline Stages
 */
export type PipelinePhase = 'lexing' | 'parsing' | 'semantic' | 'optimization' | 'assembly';

export type PhaseStatus = 'pending' | 'running' | 'passed' | 'failed' | 'skipped';

export interface StageInfo {
  id: PipelinePhase;
  name: string;
  description: string;
}

export const PIPELINE_STAGES: StageInfo[] = [
  { id: 'lexing', name: 'Lexing', description: 'Tokenizes source text into terminal symbols' },
  { id: 'parsing', name: 'Parsing', description: 'Constructs the Abstract Syntax Tree (AST)' },
  { id: 'semantic', name: 'Semantic Analysis', description: 'Type checking, scope resolution & symbol tables' },
  { id: 'optimization', name: 'Optimization', description: 'Intermediate representation optimizations' },
  { id: 'assembly', name: 'Assembly', description: 'Machine code generation and binary linking' },
];

import jokesData from '../data/jokes.json';
import type { HumorLevel } from '../types/compiler';

/**
 * Map each compiler diagnostic to the compilation phase that caught it:
 * - Lexing: Invalid characters, unterminated strings or comments
 * - Parsing: Missing semicolons, unmatched brackets, syntax errors
 * - Semantic: Undeclared variables, type mismatches, missing includes, wrong argument counts
 * - Optimization and Assembly: Link errors, and warnings from optimized builds, runtime traps
 */
export function mapDiagnosticToPhase(errorType: ErrorType, rawMessage: string = ''): PipelinePhase {
  const lower = rawMessage
    .toLowerCase()
    .replace(/[‘’`]/g, "'")
    .replace(/[“”]/g, '"');

  // 1. Lexing phase: invalid characters, unterminated strings or comments
  if (
    lower.includes('stray') ||
    lower.includes('invalid character') ||
    lower.includes('unterminated string') ||
    lower.includes('unterminated comment') ||
    lower.includes('missing terminating') ||
    lower.includes('multi-character character constant') ||
    lower.includes('empty character constant')
  ) {
    return 'lexing';
  }

  // 2. Parsing phase: missing semicolons, unmatched brackets, syntax errors
  if (
    errorType === 'missing_semicolon' ||
    errorType === 'brace_mismatch' ||
    lower.includes("expected ';'") ||
    lower.includes("expected '}'") ||
    lower.includes("expected ')'") ||
    lower.includes("expected ']'") ||
    lower.includes('expected declaration') ||
    lower.includes('expected expression') ||
    lower.includes('syntax error') ||
    lower.includes('parse error')
  ) {
    return 'parsing';
  }

  // 3. Semantic Analysis: undeclared variables, type mismatches, missing includes, wrong argument counts
  if (
    errorType === 'undeclared_variable' ||
    errorType === 'type_mismatch' ||
    errorType === 'missing_include' ||
    errorType === 'missing_return' ||
    errorType === 'unused_variable' ||
    lower.includes('not declared') ||
    lower.includes('undeclared') ||
    lower.includes('cannot convert') ||
    lower.includes('incompatible type') ||
    lower.includes('no matching function') ||
    lower.includes('too few arguments') ||
    lower.includes('too many arguments') ||
    lower.includes('wrong number of arguments') ||
    lower.includes('conflicting types') ||
    lower.includes('redefinition of')
  ) {
    return 'semantic';
  }

  // 4. Optimization & Assembly: link errors, and warnings from optimized builds, runtime crashes
  if (
    errorType === 'segfault' ||
    errorType === 'infinite_loop' ||
    errorType === 'division_by_zero' ||
    lower.includes('undefined reference') ||
    lower.includes('cannot find -l') ||
    lower.includes('ld returned') ||
    lower.includes('linker error') ||
    lower.includes('relocation truncated') ||
    lower.includes('optimization') ||
    lower.includes('strict-aliasing') ||
    lower.includes('uninitialized')
  ) {
    return 'assembly';
  }

  return 'parsing';
}

/**
 * Retrieve the active humor-styled phase tag from jokes.json
 * e.g. "Caught at the parsing stage 🧩"
 */
export function getPhaseTag(phase: PipelinePhase, humorLevel: HumorLevel = 1): string {
  const phaseTags = (jokesData as unknown as { phase_tags?: Record<string, Record<string, string>> }).phase_tags;
  if (!phaseTags || !phaseTags[phase]) {
    return `Phase: ${phase}`;
  }
  const levelKey = `level_${humorLevel}` as 'level_0' | 'level_1' | 'level_2';
  return phaseTags[phase][levelKey] || phaseTags[phase].level_1 || `Phase: ${phase}`;
}

/**
 * Compute the status of each pipeline stage given the diagnostics and compilation outcome.
 */
export function computePipelineStatuses(
  diagnostics: Array<{ errorType: ErrorType; rawMessage?: string }>,
  isCompiling: boolean,
  hasRun: boolean,
  activeRunningStage?: PipelinePhase
): Record<PipelinePhase, PhaseStatus> {
  const statuses: Record<PipelinePhase, PhaseStatus> = {
    lexing: 'pending',
    parsing: 'pending',
    semantic: 'pending',
    optimization: 'pending',
    assembly: 'pending',
  };

  if (isCompiling) {
    const stageOrder: PipelinePhase[] = ['lexing', 'parsing', 'semantic', 'optimization', 'assembly'];
    const activeIdx = activeRunningStage ? stageOrder.indexOf(activeRunningStage) : 0;
    stageOrder.forEach((stage, idx) => {
      if (idx < activeIdx) statuses[stage] = 'passed';
      else if (idx === activeIdx) statuses[stage] = 'running';
      else statuses[stage] = 'pending';
    });
    return statuses;
  }

  if (!hasRun) {
    return statuses;
  }

  // Determine earliest failing stage
  const stageOrder: PipelinePhase[] = ['lexing', 'parsing', 'semantic', 'optimization', 'assembly'];
  let earliestFailedStageIdx = -1;

  for (const diag of diagnostics) {
    const phase = mapDiagnosticToPhase(diag.errorType, diag.rawMessage);
    const idx = stageOrder.indexOf(phase);
    if (idx !== -1 && (earliestFailedStageIdx === -1 || idx < earliestFailedStageIdx)) {
      earliestFailedStageIdx = idx;
    }
  }

  if (earliestFailedStageIdx === -1) {
    // All passed!
    stageOrder.forEach((s) => (statuses[s] = 'passed'));
  } else {
    stageOrder.forEach((s, idx) => {
      if (idx < earliestFailedStageIdx) statuses[s] = 'passed';
      else if (idx === earliestFailedStageIdx) statuses[s] = 'failed';
      else statuses[s] = 'skipped';
    });
  }

  return statuses;
}
