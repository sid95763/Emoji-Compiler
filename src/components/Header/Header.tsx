import React from 'react';
import { Volume2, VolumeX, Moon, Sun, Play, Sparkles, Zap, Flame, Award, Bug } from 'lucide-react';
import { useEmojiCompilerStore } from '../../app/store/emojiCompilerStore';
import { samplePrograms } from '../../data/samplePrograms';
import { ExportMenu } from '../Export/ExportMenu';
import type { HumorLevel } from '../../types/compiler';

interface HeaderProps {
  onBackToLanding?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onBackToLanding }) => {
  const {
    humorLevel,
    setHumorLevel,
    beginnerMode,
    setBeginnerMode,
    theme,
    setTheme,
    soundEnabled,
    setSoundEnabled,
    isCompiling,
    runCompilation,
    loadSample,
    userStats,
    setActiveTab,
    mascotVisible,
    setMascotVisible,
  } = useEmojiCompilerStore();

  return (
    <header className="fancy-header">
      {/* Left: Futuristic Brand & Sample Loader */}
      <div className="header-left">
        <div
          className="brand-badge"
          onClick={onBackToLanding}
          role={onBackToLanding ? 'button' : undefined}
          tabIndex={onBackToLanding ? 0 : undefined}
          title={onBackToLanding ? 'Return to Landing Page' : undefined}
          style={{ cursor: onBackToLanding ? 'pointer' : 'default' }}
        >
          <span className="brand-icon">
            <Zap size={18} className="text-emerald-400" />
          </span>
          <div className="brand-title-wrap">
            <span className="brand-name">EmojiCompiler</span>
            <span className="brand-dot animate-pulse"></span>
          </div>
        </div>

        {onBackToLanding && (
          <button
            type="button"
            className="header-home-pill"
            onClick={onBackToLanding}
            title="Return to Landing Page"
            style={{
              padding: '4px 10px',
              borderRadius: '9999px',
              background: 'rgba(34, 211, 238, 0.1)',
              border: '1px solid rgba(34, 211, 238, 0.25)',
              color: '#38bdf8',
              fontSize: '0.72rem',
              fontFamily: 'JetBrains Mono, monospace',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <span>←</span>
            <span>Intro</span>
          </button>
        )}

        {/* Clean Streak Counter (Understated) */}
        <div
          className="header-streak-badge"
          title={`Clean run streak: ${userStats.currentStreak} (Best: ${userStats.bestStreak})`}
          onClick={() => setActiveTab('achievements')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter') setActiveTab('achievements');
          }}
          aria-label={`Clean compilation streak: ${userStats.currentStreak}`}
        >
          <Flame size={13} className="text-orange-400 streak-flame" />
          <span className="streak-count">{userStats.currentStreak}</span>
        </div>

        {/* Fancy Sample Loader Dropdown */}
        <div className="sample-picker-container">
          <select
            className="fancy-select sample-select"
            onChange={(e) => {
              if (e.target.value) {
                loadSample(e.target.value);
                e.target.value = '';
              }
            }}
            defaultValue=""
            aria-label="Load sample C++ program"
          >
            <option value="" disabled>
              ⚡ Load Sample Bugs...
            </option>
            {samplePrograms.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Right: Controls, Export, & Flashy Run Button */}
      <div className="header-right">
        {/* Export Menu */}
        <ExportMenu />

        {/* Achievements Quick Nav */}
        <button
          type="button"
          className="icon-btn"
          onClick={() => setActiveTab('achievements')}
          title="Achievements & Clean Streaks"
          aria-label="View achievements and streaks"
        >
          <Award size={14} className="text-amber-400" />
        </button>

        {/* Mascot Toggle */}
        <button
          type="button"
          className={`icon-btn ${mascotVisible ? 'mascot-toggle-active' : ''}`}
          onClick={() => setMascotVisible(!mascotVisible)}
          title={mascotVisible ? 'Hide mascot' : 'Show mascot'}
          aria-label={mascotVisible ? 'Hide mascot' : 'Show mascot'}
        >
          <Bug size={14} className={mascotVisible ? 'text-sky-400' : 'text-slate-500'} />
        </button>

        {/* Beginner Friendly AI Toggle (ELI5) */}
        <button
          type="button"
          className={`ai-beginner-toggle ${beginnerMode ? 'active' : ''}`}
          onClick={() => setBeginnerMode(!beginnerMode)}
          title="Toggle AI Beginner-Friendly (ELI5) Explanations"
          aria-pressed={beginnerMode}
        >
          <Sparkles size={14} className={beginnerMode ? 'sparkle-spin' : ''} />
          <span>AI Beginner Mode</span>
        </button>

        {/* Humor Level Segmented Slider */}
        <div className="humor-bar" role="group" aria-label="Humor Level">
          <span className="humor-label">humor:</span>
          <button
            type="button"
            className={`humor-segment ${humorLevel === 0 ? 'active' : ''}`}
            onClick={() => setHumorLevel(0 as HumorLevel)}
            title="0: Professional (Factual explanations only)"
          >
            0:pro
          </button>
          <button
            type="button"
            className={`humor-segment ${humorLevel === 1 ? 'active' : ''}`}
            onClick={() => setHumorLevel(1 as HumorLevel)}
            title="1: Light (Gentle puns & metaphors)"
          >
            1:puns
          </button>
          <button
            type="button"
            className={`humor-segment ${humorLevel === 2 ? 'active' : ''}`}
            onClick={() => setHumorLevel(2 as HumorLevel)}
            title="2: Roast (Playful, sharp code roast)"
          >
            2:roast
          </button>
        </div>

        {/* Audio Laugh SFX Toggle */}
        <button
          type="button"
          className={`icon-btn ${soundEnabled ? 'sound-active' : ''}`}
          onClick={() => setSoundEnabled(!soundEnabled)}
          title={soundEnabled ? 'Audio Reactions: ON' : 'Audio Reactions: OFF (Click to unmute)'}
          aria-label={soundEnabled ? 'Mute audio' : 'Unmute audio'}
        >
          {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
        </button>

        {/* Theme Toggle */}
        <button
          type="button"
          className="icon-btn"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
        </button>

        {/* Flashy Electric Run Button */}
        <button
          type="button"
          className={`flashy-run-btn ${isCompiling ? 'is-compiling' : ''}`}
          onClick={runCompilation}
          disabled={isCompiling}
          title="Compile & Run C++ (Ctrl+Enter)"
        >
          <Play size={13} fill="currentColor" />
          <span>{isCompiling ? 'COMPILING...' : 'RUN'}</span>
          <kbd className="run-kbd">Ctrl+↵</kbd>
        </button>
      </div>
    </header>
  );
};
