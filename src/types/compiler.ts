export type Severity = 'error' | 'warning' | 'note' | 'runtime' | 'success';

export type ErrorType =
  | 'missing_semicolon'
  | 'undeclared_variable'
  | 'type_mismatch'
  | 'segfault'
  | 'infinite_loop'
  | 'missing_include'
  | 'unused_variable'
  | 'missing_return'
  | 'division_by_zero'
  | 'brace_mismatch'
  | 'general_error'
  | 'general_warning'
  | 'general_note'
  | 'success';

export type HumorLevel = 0 | 1 | 2; // 0: Professional, 1: Light Puns, 2: Full Sarcastic Roast

export interface SuggestedFix {
  description: string;
  originalCode: string;
  replacementCode: string;
  line: number;
  column?: number;
}

export type PipelinePhase = 'lexing' | 'parsing' | 'semantic' | 'optimization' | 'assembly';

export interface Diagnostic {
  id: string;
  line: number;
  column: number;
  severity: Severity;
  errorType: ErrorType;
  emoji: string;
  message: string;
  rawMessage: string;
  codeSnippet?: string;
  suggestedFix?: SuggestedFix;
  funnyJoke: string;
  shortFix: string;
  beginnerExplanation: string;
  plainEnglish?: string;
  phase?: PipelinePhase;
}

export interface CommentReply {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

export interface UserLineComment {
  id: string;
  line: number;
  author: string;
  text: string;
  resolved: boolean;
  createdAt: string;
  replies: CommentReply[];
}

export interface CompileResult {
  success: boolean;
  stdout: string;
  stderr: string;
  compileOutput: string;
  executionTime?: string;
  memory?: number;
  exitCode?: number;
  diagnostics: Diagnostic[];
  isRuntimeError?: boolean;
}

export interface SampleProgram {
  id: string;
  name: string;
  description: string;
  category: 'syntax' | 'runtime' | 'types' | 'logic' | 'clean' | 'algorithm';
  code: string;
  expectedEmoji: string;
}
