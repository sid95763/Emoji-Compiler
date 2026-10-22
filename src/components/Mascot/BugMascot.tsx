import React, { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp, EyeOff, Sparkles, Moon } from 'lucide-react';
import { useEmojiCompilerStore, pickMascotSpeech } from '../../app/store/emojiCompilerStore';

export const BugMascot: React.FC = () => {
  const {
    mascotVisible,
    setMascotVisible,
    mascotCollapsed,
    setMascotCollapsed,
    mascotSpeech,
    setMascotSpeech,
    mascotState,
    setMascotState,
    humorLevel,
    lastRunTimestamp,
    activeReaction,
  } = useEmojiCompilerStore();

  const [reducedMotion, setReducedMotion] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false
  );

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // 60-second idle timer: transitions to 'sleepy' if no code runs
  useEffect(() => {
    const checkIdle = setInterval(() => {
      const now = Date.now();
      if (now - lastRunTimestamp >= 60000 && mascotState !== 'sleepy') {
        setMascotState('sleepy');
        setMascotSpeech(pickMascotSpeech('sleepy', humorLevel));
      }
    }, 5000);

    return () => clearInterval(checkIdle);
  }, [lastRunTimestamp, mascotState, humorLevel, setMascotState, setMascotSpeech]);

  // Tie into humor laugh animations
  useEffect(() => {
    if (activeReaction === 'error_l1' || activeReaction === 'error_l2') {
      setMascotState('laughing');
      setMascotSpeech(pickMascotSpeech('laughing', humorLevel));
      const t = setTimeout(() => {
        setMascotState('panic');
      }, 2500);
      return () => clearTimeout(t);
    }
  }, [activeReaction, humorLevel, setMascotState, setMascotSpeech]);

  if (!mascotVisible) return null;

  // Render SVG bug facial expression and eyes based on state
  const renderBugFace = () => {
    switch (mascotState) {
      case 'happy':
        return (
          <g className="mascot-face-happy">
            {/* Sparkle Eyes */}
            <circle cx="16" cy="18" r="3" fill="#10b981" />
            <circle cx="28" cy="18" r="3" fill="#10b981" />
            <circle cx="17" cy="17" r="1" fill="#ffffff" />
            <circle cx="29" cy="17" r="1" fill="#ffffff" />
            {/* Happy Smile */}
            <path d="M 17 24 Q 22 28 27 24" stroke="#10b981" strokeWidth="2" strokeLinecap="round" fill="none" />
            {/* Cheek blush */}
            <circle cx="13" cy="22" r="1.5" fill="#f472b6" opacity="0.6" />
            <circle cx="31" cy="22" r="1.5" fill="#f472b6" opacity="0.6" />
          </g>
        );

      case 'panic':
        return (
          <g className="mascot-face-panic">
            {/* Wide Nervous Eyes */}
            <circle cx="16" cy="18" r="4.5" fill="#ef4444" />
            <circle cx="28" cy="18" r="4.5" fill="#ef4444" />
            <circle cx="16" cy="18" r="2" fill="#ffffff" />
            <circle cx="28" cy="18" r="2" fill="#ffffff" />
            {/* Open Trembling Mouth */}
            <ellipse cx="22" cy="26" rx="3.5" ry="4" fill="#7f1d1d" stroke="#ef4444" strokeWidth="1" />
            {/* Sweat drop */}
            <path d="M 33 13 C 33 13 36 17 33 18 C 31 18 31 15 33 13 Z" fill="#38bdf8" />
          </g>
        );

      case 'segfault':
        return (
          <g className="mascot-face-segfault">
            {/* Knocked out X Eyes */}
            <path d="M 13 15 L 19 21 M 19 15 L 13 21" stroke="#f43f5e" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 25 15 L 31 21 M 31 15 L 25 21" stroke="#f43f5e" strokeWidth="2.5" strokeLinecap="round" />
            {/* Wavy Mouth */}
            <path d="M 16 26 Q 19 23 22 26 T 28 26" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round" fill="none" />
          </g>
        );

      case 'sleepy':
        return (
          <g className="mascot-face-sleepy">
            {/* Closed sleeping eyes */}
            <path d="M 13 19 Q 16 22 19 19" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" fill="none" />
            <path d="M 25 19 Q 28 22 31 19" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" fill="none" />
            {/* O mouth for soft breathing */}
            <circle cx="22" cy="25" r="2" fill="#475569" />
          </g>
        );

      case 'laughing':
        return (
          <g className="mascot-face-laughing">
            {/* Squinting joy eyes */}
            <path d="M 13 19 Q 16 15 19 19" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <path d="M 25 19 Q 28 15 31 19" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            {/* Big Open Laughing Mouth */}
            <path d="M 16 23 Q 22 31 28 23 Z" fill="#b45309" stroke="#fbbf24" strokeWidth="1.5" />
          </g>
        );

      case 'idle':
      default:
        return (
          <g className="mascot-face-idle">
            {/* Normal Calm Eyes */}
            <circle cx="16" cy="18" r="3" fill="#38bdf8" />
            <circle cx="28" cy="18" r="3" fill="#38bdf8" />
            <circle cx="17" cy="17" r="1" fill="#ffffff" />
            <circle cx="29" cy="17" r="1" fill="#ffffff" />
            {/* Gentle Smile */}
            <path d="M 18 24 Q 22 26 26 24" stroke="#38bdf8" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          </g>
        );
    }
  };

  return (
    <aside
      className={`bug-mascot-dock ${mascotCollapsed ? 'is-collapsed' : ''} ${
        reducedMotion ? 'reduced-motion' : ''
      }`}
      aria-label="EmojiCompiler Mascot"
    >
      {/* Speech Bubble (max ~8 words) */}
      {!mascotCollapsed && mascotSpeech && (
        <div className="mascot-speech-bubble" role="status" aria-live="polite">
          <p className="speech-text">{mascotSpeech}</p>
          <div className="bubble-pointer" aria-hidden="true" />
        </div>
      )}

      {/* Mascot Card */}
      <div className={`mascot-avatar-wrapper mood-${mascotState}`}>
        {/* Interactive SVG Bug Avatar */}
        <svg
          viewBox="0 0 44 44"
          className={`mascot-svg ${reducedMotion ? '' : `anim-${mascotState}`}`}
          width="44"
          height="44"
          aria-hidden="true"
        >
          {/* Antennae */}
          <g className="mascot-antennae">
            <path d="M 15 12 Q 10 4 7 6" stroke="#64748b" strokeWidth="2" strokeLinecap="round" fill="none" />
            <circle cx="7" cy="6" r="2" fill="#38bdf8" />
            <path d="M 29 12 Q 34 4 37 6" stroke="#64748b" strokeWidth="2" strokeLinecap="round" fill="none" />
            <circle cx="37" cy="6" r="2" fill="#38bdf8" />
          </g>

          {/* Bug Body */}
          <ellipse cx="22" cy="22" rx="14" ry="13" fill="#1e293b" stroke="#475569" strokeWidth="2" />

          {/* Little Bug Legs */}
          <line x1="6" y1="19" x2="2" y2="17" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
          <line x1="6" y1="24" x2="2" y2="25" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
          <line x1="38" y1="19" x2="42" y2="17" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
          <line x1="38" y1="24" x2="42" y2="25" stroke="#475569" strokeWidth="2" strokeLinecap="round" />

          {/* Reactive Facial Expression */}
          {renderBugFace()}
        </svg>

        {/* State Particle Icons */}
        {mascotState === 'sleepy' && (
          <span className="mascot-floating-icon zzz-icon" aria-hidden="true">
            <Moon size={12} />
          </span>
        )}
        {mascotState === 'happy' && (
          <span className="mascot-floating-icon happy-icon" aria-hidden="true">
            <Sparkles size={13} />
          </span>
        )}

        {/* Collapse and Settings Controls */}
        <div className="mascot-actions-bar">
          <button
            type="button"
            className="mascot-action-btn"
            onClick={() => setMascotCollapsed(!mascotCollapsed)}
            title={mascotCollapsed ? 'Expand mascot' : 'Collapse mascot'}
            aria-label={mascotCollapsed ? 'Expand mascot' : 'Collapse mascot'}
          >
            {mascotCollapsed ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
          </button>
          <button
            type="button"
            className="mascot-action-btn"
            onClick={() => setMascotVisible(false)}
            title="Hide mascot (re-enable in header)"
            aria-label="Hide mascot"
          >
            <EyeOff size={11} />
          </button>
        </div>
      </div>
    </aside>
  );
};
