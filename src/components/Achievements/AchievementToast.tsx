import React, { useEffect } from 'react';
import { Award, X } from 'lucide-react';
import { useEmojiCompilerStore } from '../../app/store/emojiCompilerStore';

export const AchievementToast: React.FC = () => {
  const { unlockedAchievementToast, dismissAchievementToast, toastMessage } = useEmojiCompilerStore();

  useEffect(() => {
    if (unlockedAchievementToast) {
      const timer = setTimeout(() => {
        dismissAchievementToast();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [unlockedAchievementToast, dismissAchievementToast]);

  return (
    <div className="toasts-portal-container" aria-live="polite" aria-atomic="true">
      {/* Achievement Unlock Toast */}
      {unlockedAchievementToast && (
        <div className="achievement-unlocked-card" role="alert">
          <div className="achievement-icon-frame">
            <span className="achievement-emoji">{unlockedAchievementToast.emoji}</span>
          </div>
          <div className="achievement-info">
            <div className="achievement-sub">
              <Award size={11} className="text-amber-400" />
              <span>Achievement Unlocked!</span>
            </div>
            <strong className="achievement-title">{unlockedAchievementToast.name}</strong>
            <p className="achievement-desc">{unlockedAchievementToast.description}</p>
          </div>
          <button
            type="button"
            className="achievement-close-btn"
            onClick={dismissAchievementToast}
            aria-label="Dismiss toast"
          >
            <X size={13} />
          </button>
        </div>
      )}

      {/* Generic Success / Export Toast */}
      {toastMessage && (
        <div className="generic-success-toast" role="status">
          <span className="toast-bullet">✓</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
