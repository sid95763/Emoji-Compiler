import React from 'react';
import { useEmojiCompilerStore } from '../../app/store/emojiCompilerStore';

export const ReactionOverlay: React.FC = () => {
  const { activeReaction, successBannerText } = useEmojiCompilerStore();

  if (!activeReaction) return null;

  return (
    <div className="reaction-overlay-container" aria-live="polite" aria-atomic="true">
      {/* Success Slide-in Banner */}
      {activeReaction === 'success' && (
        <div className="reaction-success-chip">
          <span className="success-icon">✓</span>
          <span className="success-text">{successBannerText}</span>
        </div>
      )}

      {/* Level 1 Light Error Reaction */}
      {activeReaction === 'error_l1' && (
        <div className="reaction-l1-pop">
          <span className="reaction-emoji">😄</span>
          <span className="reaction-hint">nice try</span>
        </div>
      )}

      {/* Level 2 Roast Error Reaction */}
      {activeReaction === 'error_l2' && (
        <div className="reaction-l2-roast">
          <div className="roast-emoji-drop">🤣</div>
          <div className="roast-text-burst">HA HA</div>
          <div className="roast-rain" aria-hidden="true">
            <span>😂</span>
            <span>💀</span>
            <span>🤣</span>
            <span>🔥</span>
          </div>
        </div>
      )}
    </div>
  );
};
