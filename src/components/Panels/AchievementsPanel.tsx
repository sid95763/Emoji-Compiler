import React, { useState } from 'react';
import { Award, Flame, Trophy, RotateCcw, Check, Lock, AlertTriangle } from 'lucide-react';
import { ACHIEVEMENTS_LIST, type Achievement } from '../../data/achievements';
import { useEmojiCompilerStore } from '../../app/store/emojiCompilerStore';

export const AchievementsPanel: React.FC = () => {
  const { userStats, resetStats, showToast } = useEmojiCompilerStore();
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const unlockedSet = new Set(userStats.unlockedAchievementIds);

  const getProgress = (ach: Achievement): { current: number; target: number; pct: number } => {
    let current = 0;
    const target = ach.targetCount || 1;

    switch (ach.id) {
      case 'first_compile':
        current = Math.min(1, userStats.totalRuns);
        break;
      case 'first_segfault':
        current = Math.min(1, userStats.errorsCountByType['segfault'] || 0);
        break;
      case 'zero_error_run':
        current = Math.min(1, userStats.bestStreak >= 1 ? 1 : 0);
        break;
      case 'semicolon_ten':
        current = Math.min(10, userStats.errorsCountByType['missing_semicolon'] || 0);
        break;
      case 'streak_five':
        current = Math.min(5, userStats.currentStreak);
        break;
      case 'ghost_hunter':
        current = Math.min(10, userStats.fixesCountByType['undeclared_variable'] || 0);
        break;
      case 'night_owl':
        current = unlockedSet.has('night_owl') ? 1 : 0;
        break;
      case 'humor_connoisseur':
        current = Math.min(3, userStats.triedHumorLevels.length);
        break;
      default:
        current = unlockedSet.has(ach.id) ? target : 0;
    }

    const pct = Math.min(100, Math.round((current / target) * 100));
    return { current, target, pct };
  };

  const handleConfirmReset = () => {
    resetStats();
    setShowConfirmReset(false);
    showToast('Stats and achievements have been reset.');
  };

  return (
    <div className="achievements-panel-container" role="region" aria-label="Achievements and Streaks">
      {/* Top Stats Overview */}
      <div className="achievements-stats-header">
        <div className="stats-metric-card">
          <div className="metric-icon-wrap">
            <Flame size={16} className="text-orange-400" />
          </div>
          <div className="metric-details">
            <span className="metric-number">{userStats.currentStreak}</span>
            <span className="metric-label">Clean Streak</span>
          </div>
        </div>

        <div className="stats-metric-card">
          <div className="metric-icon-wrap">
            <Trophy size={16} className="text-amber-400" />
          </div>
          <div className="metric-details">
            <span className="metric-number">{userStats.bestStreak}</span>
            <span className="metric-label">Best Streak</span>
          </div>
        </div>

        <div className="stats-metric-card">
          <div className="metric-icon-wrap">
            <Award size={16} className="text-emerald-400" />
          </div>
          <div className="metric-details">
            <span className="metric-number">
              {userStats.unlockedAchievementIds.length} / {ACHIEVEMENTS_LIST.length}
            </span>
            <span className="metric-label">Unlocked</span>
          </div>
        </div>
      </div>

      {/* Reset Stats Bar */}
      <div className="achievements-actions-bar">
        {!showConfirmReset ? (
          <button
            type="button"
            className="stats-reset-trigger-btn"
            onClick={() => setShowConfirmReset(true)}
          >
            <RotateCcw size={12} />
            <span>Reset stats</span>
          </button>
        ) : (
          <div className="reset-confirm-box" role="dialog" aria-label="Confirm reset stats">
            <AlertTriangle size={13} className="text-amber-400" />
            <span className="confirm-text">Reset all statistics and achievements?</span>
            <button
              type="button"
              className="confirm-yes-btn"
              onClick={handleConfirmReset}
            >
              Yes, reset
            </button>
            <button
              type="button"
              className="confirm-cancel-btn"
              onClick={() => setShowConfirmReset(false)}
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Achievements Grid */}
      <div className="achievements-grid" role="list">
        {ACHIEVEMENTS_LIST.map((ach) => {
          const isUnlocked = unlockedSet.has(ach.id);
          const { current, target, pct } = getProgress(ach);

          return (
            <div
              key={ach.id}
              role="listitem"
              className={`achievement-card ${isUnlocked ? 'is-unlocked' : 'is-locked'}`}
            >
              <div className="ach-card-top">
                <span className="ach-emoji" aria-hidden="true">{ach.emoji}</span>
                <div className="ach-text">
                  <div className="ach-name-row">
                    <span className="ach-name">{ach.name}</span>
                    <span className={`ach-status-badge ${isUnlocked ? 'badge-unlocked' : 'badge-locked'}`}>
                      {isUnlocked ? (
                        <>
                          <Check size={10} />
                          <span>Unlocked</span>
                        </>
                      ) : (
                        <>
                          <Lock size={10} />
                          <span>Locked</span>
                        </>
                      )}
                    </span>
                  </div>
                  <p className="ach-desc">{ach.description}</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="ach-progress-wrap">
                <div className="ach-progress-track">
                  <div
                    className="ach-progress-fill"
                    style={{ width: `${isUnlocked ? 100 : pct}%` }}
                  />
                </div>
                <div className="ach-progress-labels">
                  <span>{isUnlocked ? 'Completed' : `${pct}%`}</span>
                  <span>{isUnlocked ? `${target}/${target}` : `${current}/${target}`}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
