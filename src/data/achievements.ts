export interface Achievement {
  id: string;
  name: string;
  emoji: string;
  description: string;
  targetCount?: number;
}

export interface UserStats {
  totalRuns: number;
  currentStreak: number;
  bestStreak: number;
  errorsCountByType: Record<string, number>;
  fixesCountByType: Record<string, number>;
  triedHumorLevels: number[];
  unlockedAchievementIds: string[];
}

export const ACHIEVEMENTS_LIST: Achievement[] = [
  {
    id: 'first_compile',
    name: 'First Compile',
    emoji: '✅',
    description: 'Execute your very first C++ build',
  },
  {
    id: 'first_segfault',
    name: 'First Segfault',
    emoji: '💥',
    description: 'Touch forbidden memory and trigger SIGSEGV',
  },
  {
    id: 'zero_error_run',
    name: 'Zero-Error Run',
    emoji: '🏆',
    description: 'Compile and run cleanly with 0 errors',
  },
  {
    id: 'semicolon_ten',
    name: '10 Semicolons Forgotten',
    emoji: '✂️',
    description: 'Leave 10 lines hanging without semicolons',
    targetCount: 10,
  },
  {
    id: 'streak_five',
    name: '5 Clean Runs in a Row',
    emoji: '🔥',
    description: 'Achieve a streak of 5 flawless compilations',
    targetCount: 5,
  },
  {
    id: 'ghost_hunter',
    name: 'Ghost Hunter',
    emoji: '👻',
    description: 'Fix 10 undeclared-variable errors',
    targetCount: 10,
  },
  {
    id: 'night_owl',
    name: 'Night Owl',
    emoji: '🦉',
    description: 'Compile C++ code after midnight (00:00 - 05:00)',
  },
  {
    id: 'humor_connoisseur',
    name: 'Humor Connoisseur',
    emoji: '🎭',
    description: 'Try all 3 humor levels: 0 (Pro), 1 (Puns), and 2 (Roast)',
    targetCount: 3,
  },
];

const STORAGE_KEY = 'emojicompiler_user_stats_v1';

export function getInitialUserStats(): UserStats {
  return {
    totalRuns: 0,
    currentStreak: 0,
    bestStreak: 0,
    errorsCountByType: {},
    fixesCountByType: {},
    triedHumorLevels: [1],
    unlockedAchievementIds: [],
  };
}

export function loadUserStats(): UserStats {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getInitialUserStats();
    return { ...getInitialUserStats(), ...JSON.parse(raw) };
  } catch {
    return getInitialUserStats();
  }
}

export function saveUserStats(stats: UserStats): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch {
    // Storage quota or sandboxed failure fallback
  }
}

export function resetUserStats(): UserStats {
  const fresh = getInitialUserStats();
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    void e;
  }
  return fresh;
}

/**
 * Check and evaluate newly unlocked achievements
 */
export function checkAchievements(stats: UserStats): { newlyUnlocked: Achievement[]; updatedStats: UserStats } {
  const newlyUnlocked: Achievement[] = [];
  const currentUnlocked = new Set(stats.unlockedAchievementIds);

  const hour = new Date().getHours();

  // 1. First compile
  if (stats.totalRuns >= 1 && !currentUnlocked.has('first_compile')) {
    newlyUnlocked.push(ACHIEVEMENTS_LIST.find((a) => a.id === 'first_compile')!);
    currentUnlocked.add('first_compile');
  }

  // 2. First segfault
  if ((stats.errorsCountByType['segfault'] || 0) >= 1 && !currentUnlocked.has('first_segfault')) {
    newlyUnlocked.push(ACHIEVEMENTS_LIST.find((a) => a.id === 'first_segfault')!);
    currentUnlocked.add('first_segfault');
  }

  // 3. Zero error run
  if (stats.bestStreak >= 1 && !currentUnlocked.has('zero_error_run')) {
    newlyUnlocked.push(ACHIEVEMENTS_LIST.find((a) => a.id === 'zero_error_run')!);
    currentUnlocked.add('zero_error_run');
  }

  // 4. 10 semicolons forgotten
  if ((stats.errorsCountByType['missing_semicolon'] || 0) >= 10 && !currentUnlocked.has('semicolon_ten')) {
    newlyUnlocked.push(ACHIEVEMENTS_LIST.find((a) => a.id === 'semicolon_ten')!);
    currentUnlocked.add('semicolon_ten');
  }

  // 5. 5 clean runs in a row
  if (stats.currentStreak >= 5 && !currentUnlocked.has('streak_five')) {
    newlyUnlocked.push(ACHIEVEMENTS_LIST.find((a) => a.id === 'streak_five')!);
    currentUnlocked.add('streak_five');
  }

  // 6. Ghost hunter: fix 10 undeclared variables
  if ((stats.fixesCountByType['undeclared_variable'] || 0) >= 10 && !currentUnlocked.has('ghost_hunter')) {
    newlyUnlocked.push(ACHIEVEMENTS_LIST.find((a) => a.id === 'ghost_hunter')!);
    currentUnlocked.add('ghost_hunter');
  }

  // 7. Night Owl (00:00 to 05:00)
  if (hour >= 0 && hour < 5 && stats.totalRuns >= 1 && !currentUnlocked.has('night_owl')) {
    newlyUnlocked.push(ACHIEVEMENTS_LIST.find((a) => a.id === 'night_owl')!);
    currentUnlocked.add('night_owl');
  }

  // 8. Humor connoisseur: tried all 3 humor levels
  if (stats.triedHumorLevels.length >= 3 && !currentUnlocked.has('humor_connoisseur')) {
    newlyUnlocked.push(ACHIEVEMENTS_LIST.find((a) => a.id === 'humor_connoisseur')!);
    currentUnlocked.add('humor_connoisseur');
  }

  const updatedStats: UserStats = {
    ...stats,
    unlockedAchievementIds: Array.from(currentUnlocked),
  };

  saveUserStats(updatedStats);

  return { newlyUnlocked, updatedStats };
}
