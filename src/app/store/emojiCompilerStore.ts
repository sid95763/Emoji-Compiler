import { create } from 'zustand';
import confetti from 'canvas-confetti';
import { samplePrograms } from '../../data/samplePrograms';
import { CompilerService, type CppStandard } from '../../lib/compilerService';
import { soundEffects } from '../../lib/soundEffects';
import {
  loadUserStats,
  resetUserStats,
  checkAchievements,
  type Achievement,
  type UserStats,
} from '../../data/achievements';
import jokesData from '../../data/jokes.json';
import type {
  CompileResult,
  Diagnostic,
  HumorLevel,
  PipelinePhase,
  SuggestedFix,
  UserLineComment,
} from '../../types/compiler';

export type ReactionType = 'success' | 'error_l1' | 'error_l2' | null;
export type ActiveTab = 'console' | 'errors' | 'pipeline' | 'tokens' | 'stdin' | 'comments' | 'achievements';
export type MascotState = 'idle' | 'happy' | 'panic' | 'segfault' | 'sleepy' | 'laughing';

const DEFAULT_CODE = samplePrograms[0].code;

const SUCCESS_BANNERS = [
  'Compiled ✨',
  'Clean Build ⚡',
  'Zero Errors 🎯',
  'Binary Ready 🚀',
  'All Checks Passed 🟢',
];

export function pickMascotSpeech(category: MascotState, humorLevel: HumorLevel): string {
  const dialogue = (jokesData as unknown as { mascot_dialogue?: Record<string, Record<string, string[]>> }).mascot_dialogue?.[category];
  if (!dialogue) return '';
  const levelKey = `level_${humorLevel}` as 'level_0' | 'level_1' | 'level_2';
  const pool: string[] = dialogue[levelKey] || dialogue.level_1 || [];
  if (pool.length === 0) return '';
  return pool[Math.floor(Math.random() * pool.length)];
}

interface EmojiCompilerState {
  code: string;
  stdin: string;
  standard: CppStandard;
  humorLevel: HumorLevel;
  beginnerMode: boolean;
  theme: 'dark' | 'light';
  soundEnabled: boolean;
  isCompiling: boolean;
  compileResult: CompileResult | null;
  diagnostics: Diagnostic[];
  selectedDiagnosticId: string | null;
  activeLineForComment: number | null;
  activeTab: ActiveTab;
  userComments: UserLineComment[];
  activeReaction: ReactionType;
  successBannerText: string;
  flashingLine: number | null;

  // Feature 1: Pipeline
  pipelinePhaseFilter: PipelinePhase | null;
  activeRunningStage: PipelinePhase | null;
  hasRun: boolean;

  // Feature 3: Bug Mascot
  mascotVisible: boolean;
  mascotCollapsed: boolean;
  mascotSpeech: string | null;
  mascotState: MascotState;
  lastRunTimestamp: number;

  // Feature 4: Achievements & Streaks
  userStats: UserStats;
  unlockedAchievementToast: Achievement | null;
  toastMessage: string | null;

  // Feature 5: Export & Assembly
  assemblyCode: string | null;

  // Feature 6: Complexity highlight in editor
  highlightedLoopLine: number | null;

  // Actions
  setCode: (code: string) => void;
  setStdin: (stdin: string) => void;
  setStandard: (standard: CppStandard) => void;
  setHumorLevel: (level: HumorLevel) => void;
  setBeginnerMode: (enabled: boolean) => void;
  setTheme: (theme: 'dark' | 'light') => void;
  setSoundEnabled: (enabled: boolean) => void;
  setActiveTab: (tab: ActiveTab) => void;
  setSelectedDiagnosticId: (id: string | null) => void;
  setActiveLineForComment: (line: number | null) => void;
  setPipelinePhaseFilter: (phase: PipelinePhase | null) => void;
  setHighlightedLoopLine: (line: number | null) => void;
  setMascotVisible: (visible: boolean) => void;
  setMascotCollapsed: (collapsed: boolean) => void;
  setMascotSpeech: (speech: string | null) => void;
  setMascotState: (state: MascotState) => void;
  dismissAchievementToast: () => void;
  showToast: (msg: string) => void;
  resetStats: () => void;
  runCompilation: () => Promise<void>;
  applyFix: (fix: SuggestedFix, diagId: string) => void;
  addUserComment: (line: number, author: string, text: string) => void;
  addCommentReply: (commentId: string, author: string, text: string) => void;
  resolveComment: (commentId: string) => void;
  loadSample: (sampleId: string) => void;
  dismissReaction: () => void;
}

export const useEmojiCompilerStore = create<EmojiCompilerState>((set, get) => ({
  code: DEFAULT_CODE,
  stdin: '',
  standard: 'c++17',
  humorLevel: 1,
  beginnerMode: true,
  theme: 'dark',
  soundEnabled: false,
  isCompiling: false,
  compileResult: null,
  diagnostics: [],
  selectedDiagnosticId: null,
  activeLineForComment: null,
  activeTab: 'console',
  userComments: [],
  activeReaction: null,
  successBannerText: SUCCESS_BANNERS[0],
  flashingLine: null,

  // Feature 1
  pipelinePhaseFilter: null,
  activeRunningStage: null,
  hasRun: false,

  // Feature 3
  mascotVisible: true,
  mascotCollapsed: false,
  mascotSpeech: 'Ready to compile! 🐛',
  mascotState: 'idle',
  lastRunTimestamp: Date.now(),

  // Feature 4
  userStats: loadUserStats(),
  unlockedAchievementToast: null,
  toastMessage: null,

  // Feature 5
  assemblyCode: null,

  // Feature 6
  highlightedLoopLine: null,

  setCode: (code) => {
    // Wake up mascot from sleep on user typing
    const currentMascotState = get().mascotState;
    if (currentMascotState === 'sleepy') {
      set({
        code,
        mascotState: 'idle',
        mascotSpeech: pickMascotSpeech('idle', get().humorLevel),
      });
    } else {
      set({ code });
    }
  },

  setStdin: (stdin) => set({ stdin }),
  setStandard: (standard) => set({ standard }),

  setHumorLevel: (humorLevel) => {
    const { userStats } = get();
    const tried = Array.from(new Set([...userStats.triedHumorLevels, humorLevel]));
    const updatedStats = { ...userStats, triedHumorLevels: tried };
    const { newlyUnlocked, updatedStats: savedStats } = checkAchievements(updatedStats);

    const speech = pickMascotSpeech(get().mascotState, humorLevel);

    set({
      humorLevel,
      userStats: savedStats,
      mascotSpeech: speech || get().mascotSpeech,
      unlockedAchievementToast: newlyUnlocked[0] || get().unlockedAchievementToast,
    });
  },

  setBeginnerMode: (beginnerMode) => set({ beginnerMode }),
  setTheme: (theme) => set({ theme }),
  setSoundEnabled: (soundEnabled) => set({ soundEnabled }),
  setActiveTab: (activeTab) => set({ activeTab }),
  setSelectedDiagnosticId: (selectedDiagnosticId) => set({ selectedDiagnosticId }),
  setActiveLineForComment: (activeLineForComment) => set({ activeLineForComment }),
  setPipelinePhaseFilter: (pipelinePhaseFilter) => set({ pipelinePhaseFilter }),
  setHighlightedLoopLine: (highlightedLoopLine) => set({ highlightedLoopLine }),

  setMascotVisible: (mascotVisible) => set({ mascotVisible }),
  setMascotCollapsed: (mascotCollapsed) => set({ mascotCollapsed }),
  setMascotSpeech: (mascotSpeech) => set({ mascotSpeech }),
  setMascotState: (mascotState) => set({ mascotState }),

  dismissAchievementToast: () => set({ unlockedAchievementToast: null }),

  showToast: (msg: string) => {
    set({ toastMessage: msg });
    setTimeout(() => {
      if (get().toastMessage === msg) {
        set({ toastMessage: null });
      }
    }, 2800);
  },

  resetStats: () => {
    const fresh = resetUserStats();
    set({ userStats: fresh });
  },

  dismissReaction: () => set({ activeReaction: null }),

  runCompilation: async () => {
    const { code, stdin, standard, humorLevel, soundEnabled, userStats } = get();

    set({
      isCompiling: true,
      selectedDiagnosticId: null,
      activeReaction: null,
      flashingLine: null,
      hasRun: true,
      pipelinePhaseFilter: null,
      lastRunTimestamp: Date.now(),
    });

    let stageInterval: ReturnType<typeof setInterval> | null = null;
    try {
      // Animate stages lighting up in order
      const stageSequence: PipelinePhase[] = ['lexing', 'parsing', 'semantic', 'optimization', 'assembly'];
      let stageIndex = 0;
      stageInterval = setInterval(() => {
        if (stageIndex < stageSequence.length) {
          set({ activeRunningStage: stageSequence[stageIndex] });
          stageIndex++;
        }
      }, 70);

      const result = await CompilerService.compileAndRun(code, stdin, standard, humorLevel);
      if (stageInterval) clearInterval(stageInterval);

      const hasErrors = result.diagnostics.length > 0;
      const isClean = !hasErrors && result.success;

      // Update User Stats & Streak
      const updatedErrors = { ...userStats.errorsCountByType };
      result.diagnostics.forEach((d) => {
        updatedErrors[d.errorType] = (updatedErrors[d.errorType] || 0) + 1;
      });

      const newStreak = isClean ? userStats.currentStreak + 1 : 0;
      const newBestStreak = Math.max(userStats.bestStreak, newStreak);
      const updatedStats: UserStats = {
        ...userStats,
        totalRuns: userStats.totalRuns + 1,
        currentStreak: newStreak,
        bestStreak: newBestStreak,
        errorsCountByType: updatedErrors,
      };

      const { newlyUnlocked, updatedStats: savedStats } = checkAchievements(updatedStats);

      // Generate simulated assembly on clean build for export
      const simulatedAssembly = isClean
        ? `.file\t"main.cpp"\n.text\n.globl\tmain\n.type\tmain, @function\nmain:\n.LFB0:\n\t.cfi_startproc\n\tpushq\t%rbp\n\t.cfi_def_cfa_offset 16\n\t.cfi_offset 6, -16\n\tmovq\t%rsp, %rbp\n\t.cfi_def_cfa_register 6\n\tsubq\t$16, %rsp\n\tmovl\t$0, %eax\n\tleave\n\t.cfi_def_cfa 7, 8\n\tret\n\t.cfi_endproc\n.LFE0:\n\t.size\tmain, .-main\n\t.ident\t"GCC: (Ubuntu 11.4.0) 11.4.0"\n\t.section\t.note.GNU-stack,"",@progbits\n`
        : null;

      if (isClean) {
        // CLEAN BUILD SUCCESS
        const randomBanner = SUCCESS_BANNERS[Math.floor(Math.random() * SUCCESS_BANNERS.length)];

        try {
          if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            confetti({
              particleCount: 45,
              spread: 55,
              origin: { y: 0.15, x: 0.85 },
              colors: ['#00ff66', '#a3e635', '#ffffff'],
              disableForReducedMotion: true,
            });
          }
        } catch (e) {
          void e;
        }

        if (soundEnabled) {
          soundEffects.playSuccess();
        }

        const happySpeech = pickMascotSpeech('happy', humorLevel);

        set({
          isCompiling: false,
          activeRunningStage: null,
          compileResult: result,
          diagnostics: [],
          selectedDiagnosticId: null,
          activeTab: 'console',
          activeReaction: 'success',
          successBannerText: randomBanner,
          assemblyCode: simulatedAssembly,
          mascotState: 'happy',
          mascotSpeech: happySpeech,
          userStats: savedStats,
          unlockedAchievementToast: newlyUnlocked[0] || get().unlockedAchievementToast,
        });

        setTimeout(() => {
          if (get().activeReaction === 'success') {
            set({ activeReaction: null });
          }
        }, 2200);
      } else {
        // COMPILATION OR RUNTIME ERROR
        const firstLine = result.diagnostics[0]?.line ?? null;
        let reaction: ReactionType = null;

        if (humorLevel === 1) {
          reaction = 'error_l1';
          if (soundEnabled) soundEffects.playLaugh(1);
        } else if (humorLevel === 2) {
          reaction = 'error_l2';
          if (soundEnabled) soundEffects.playLaugh(2);
        }

        const isSegfault = result.diagnostics.some((d) => d.errorType === 'segfault');
        const mascotMood: MascotState = isSegfault ? 'segfault' : 'panic';
        const errorSpeech = pickMascotSpeech(mascotMood, humorLevel);

        // If diagnostics are present, open errors tab; otherwise show console to display compiler output
        const targetTab: ActiveTab = result.diagnostics.length > 0 ? 'errors' : 'console';

        set({
          isCompiling: false,
          activeRunningStage: null,
          compileResult: result,
          diagnostics: result.diagnostics,
          selectedDiagnosticId: result.diagnostics[0]?.id || null,
          activeTab: targetTab,
          activeReaction: reaction,
          flashingLine: firstLine,
          assemblyCode: null,
          mascotState: mascotMood,
          mascotSpeech: errorSpeech,
          userStats: savedStats,
          unlockedAchievementToast: newlyUnlocked[0] || get().unlockedAchievementToast,
        });

        setTimeout(() => {
          set({ activeReaction: null, flashingLine: null });
        }, 2000);
      }
    } catch (err: unknown) {
      if (stageInterval) clearInterval(stageInterval);
      const fallbackMsg = err instanceof Error ? err.message : 'Unknown compiler error occurred.';
      set({
        isCompiling: false,
        activeRunningStage: null,
        activeReaction: null,
        compileResult: {
          success: false,
          stdout: '',
          stderr: fallbackMsg,
          compileOutput: `fatal: ${fallbackMsg}`,
          exitCode: 1,
          diagnostics: [],
        },
        activeTab: 'console',
      });
    }
  },

  applyFix: (fix: SuggestedFix, diagId: string) => {
    const { code, diagnostics, userStats } = get();
    const lines = code.split('\n');
    const targetIdx = fix.line - 1;

    if (targetIdx >= 0 && targetIdx < lines.length) {
      lines[targetIdx] = fix.replacementCode;
      const newCode = lines.join('\n');
      const fixedDiag = diagnostics.find((d) => d.id === diagId);
      const remainingDiags = diagnostics.filter((d) => d.id !== diagId);

      const updatedFixes = { ...userStats.fixesCountByType };
      if (fixedDiag) {
        updatedFixes[fixedDiag.errorType] = (updatedFixes[fixedDiag.errorType] || 0) + 1;
      }
      const updatedStats = { ...userStats, fixesCountByType: updatedFixes };
      const { newlyUnlocked, updatedStats: savedStats } = checkAchievements(updatedStats);

      set({
        code: newCode,
        diagnostics: remainingDiags,
        selectedDiagnosticId: remainingDiags[0]?.id || null,
        userStats: savedStats,
        unlockedAchievementToast: newlyUnlocked[0] || get().unlockedAchievementToast,
      });
    }
  },

  addUserComment: (line: number, author: string, text: string) => {
    const newComment: UserLineComment = {
      id: `comment-${Date.now()}`,
      line,
      author: author.trim() || 'user',
      text,
      resolved: false,
      createdAt: 'just now',
      replies: [],
    };
    set((s) => ({
      userComments: [newComment, ...s.userComments],
      activeTab: 'comments',
    }));
  },

  addCommentReply: (commentId: string, author: string, text: string) => {
    set((s) => ({
      userComments: s.userComments.map((c) =>
        c.id === commentId
          ? {
              ...c,
              replies: [
                ...c.replies,
                {
                  id: `reply-${Date.now()}`,
                  author: author.trim() || 'user',
                  text,
                  createdAt: 'just now',
                },
              ],
            }
          : c
      ),
    }));
  },

  resolveComment: (commentId: string) => {
    set((s) => ({
      userComments: s.userComments.map((c) =>
        c.id === commentId ? { ...c, resolved: !c.resolved } : c
      ),
    }));
  },

  loadSample: (sampleId: string) => {
    const sample = samplePrograms.find((s) => s.id === sampleId);
    if (sample) {
      set({
        code: sample.code,
        diagnostics: [],
        selectedDiagnosticId: null,
        compileResult: null,
        activeReaction: null,
        activeTab: 'console',
        hasRun: false,
        pipelinePhaseFilter: null,
        mascotState: 'idle',
        mascotSpeech: pickMascotSpeech('idle', get().humorLevel),
      });
    }
  },
}));
