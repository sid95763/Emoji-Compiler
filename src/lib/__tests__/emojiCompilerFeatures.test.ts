import { describe, it, expect } from 'vitest';
import { mapDiagnosticToPhase, getPhaseTag, computePipelineStatuses } from '../pipelinePhases';
import { tokenizeCpp } from '../cppLexer';
import { estimateComplexity } from '../complexityAnalyzer';
import { checkAchievements, getInitialUserStats } from '../../data/achievements';
import { pickMascotSpeech } from '../../app/store/emojiCompilerStore';

describe('1. Compilation Pipeline View', () => {
  it('maps lexing errors correctly', () => {
    expect(mapDiagnosticToPhase('general_error', 'main.cpp:5:10: error: missing terminating " character')).toBe('lexing');
    expect(mapDiagnosticToPhase('general_error', 'stray ‘@’ in program')).toBe('lexing');
    expect(mapDiagnosticToPhase('general_error', 'unterminated comment')).toBe('lexing');
  });

  it('maps parsing errors correctly', () => {
    expect(mapDiagnosticToPhase('missing_semicolon', "expected ';' before '}' token")).toBe('parsing');
    expect(mapDiagnosticToPhase('brace_mismatch', "expected '}' at end of input")).toBe('parsing');
  });

  it('maps semantic errors correctly', () => {
    expect(mapDiagnosticToPhase('undeclared_variable', "‘score’ was not declared in this scope")).toBe('semantic');
    expect(mapDiagnosticToPhase('type_mismatch', "cannot convert ‘const char*’ to ‘int’")).toBe('semantic');
    expect(mapDiagnosticToPhase('missing_include', "‘cout’ was not declared; did you forget ‘<iostream>’")).toBe('semantic');
  });

  it('maps optimization and assembly / runtime errors correctly', () => {
    expect(mapDiagnosticToPhase('segfault', 'Segmentation fault (core dumped)')).toBe('assembly');
    expect(mapDiagnosticToPhase('general_error', 'undefined reference to `main`')).toBe('assembly');
    expect(mapDiagnosticToPhase('general_error', 'warning: optimization flag creates alias')).toBe('assembly');
  });

  it('provides humor-styled phase tags from jokes.json for all 3 humor levels', () => {
    const tagL0 = getPhaseTag('parsing', 0);
    const tagL1 = getPhaseTag('parsing', 1);
    const tagL2 = getPhaseTag('parsing', 2);

    expect(tagL0).toContain('Parsing');
    expect(tagL1).toContain('parsing stage');
    expect(tagL2).toContain('Grammar');
  });

  it('computes pipeline statuses and greys out skipped stages after failure', () => {
    const diags = [{ errorType: 'missing_semicolon' as const, rawMessage: "expected ';'" }];
    const statuses = computePipelineStatuses(diags, false, true);

    expect(statuses.lexing).toBe('passed');
    expect(statuses.parsing).toBe('failed');
    expect(statuses.semantic).toBe('skipped');
    expect(statuses.optimization).toBe('skipped');
    expect(statuses.assembly).toBe('skipped');
  });
});

describe('2. Live Token Visualizer & Lightweight Lexer', () => {
  it('tokenizes C++ keywords, identifiers, literals, operators, punctuation, comments, and preprocessor lines', () => {
    const code = `#include <iostream>
// This is a comment
int main() {
    int count = 42;
    std::string name = "Antigravity";
    return 0;
}`;
    const result = tokenizeCpp(code);

    expect(result.categoryCounts.preprocessor).toBeGreaterThanOrEqual(1);
    expect(result.categoryCounts.comment).toBeGreaterThanOrEqual(1);
    expect(result.categoryCounts.keyword).toBeGreaterThanOrEqual(3); // int, return
    expect(result.categoryCounts.literal).toBeGreaterThanOrEqual(2); // 42, "Antigravity"
    expect(result.categoryCounts.punctuation).toBeGreaterThanOrEqual(4);
    expect(result.totalCount).toBe(result.tokens.length);
  });
});

describe('3. Bug Mascot States & Speech', () => {
  it('retrieves mascot dialogue matching humor levels', () => {
    const idle0 = pickMascotSpeech('idle', 0);
    const idle1 = pickMascotSpeech('idle', 1);
    const idle2 = pickMascotSpeech('idle', 2);

    expect(idle0.length).toBeGreaterThan(0);
    expect(idle1.length).toBeGreaterThan(0);
    expect(idle2.length).toBeGreaterThan(0);

    // Verify word count stays short (max ~8 words)
    expect(idle1.split(' ').length).toBeLessThanOrEqual(12);
  });
});

describe('4. Error Streaks & Achievements', () => {
  it('tracks clean runs and unlocks Zero-Error Run and First Compile', () => {
    const stats = getInitialUserStats();
    stats.totalRuns = 1;
    stats.currentStreak = 1;
    stats.bestStreak = 1;

    const { newlyUnlocked, updatedStats } = checkAchievements(stats);
    const unlockedIds = updatedStats.unlockedAchievementIds;

    expect(unlockedIds).toContain('first_compile');
    expect(unlockedIds).toContain('zero_error_run');
    expect(newlyUnlocked.some((a) => a.id === 'first_compile')).toBe(true);
  });

  it('unlocks 10 Semicolons Forgotten and 5 Clean Runs', () => {
    const stats = getInitialUserStats();
    stats.totalRuns = 10;
    stats.errorsCountByType['missing_semicolon'] = 10;
    stats.currentStreak = 5;

    const { updatedStats } = checkAchievements(stats);
    expect(updatedStats.unlockedAchievementIds).toContain('semicolon_ten');
    expect(updatedStats.unlockedAchievementIds).toContain('streak_five');
  });
});

describe('6. Code Complexity Analyzer Heuristics', () => {
  it('evaluates O(1) for constant code', () => {
    const code = `int main() { int a = 1; return a; }`;
    const res = estimateComplexity(code, 1);
    expect(res.notation).toBe('O(1)');
    expect(res.maxDepth).toBe(0);
  });

  it('evaluates O(n) for single loop and O(n³) for triple loop with warning', () => {
    const code = `int main() {
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            for (int k = 0; k < n; k++) {
                // deep loop
            }
        }
    }
}`;
    const res = estimateComplexity(code, 1);
    expect(res.notation).toBe('O(n³)');
    expect(res.maxDepth).toBe(3);
    expect(res.warning).toBeDefined();
    expect(res.deepestLoopLine).toBeGreaterThan(0);
  });

  it('detects logarithmic pattern (O(log n))', () => {
    const code = `int main() {
    int n = 100;
    while (n > 0) {
        n /= 2;
    }
}`;
    const res = estimateComplexity(code, 1);
    expect(res.notation).toBe('O(log n)');
  });
});
