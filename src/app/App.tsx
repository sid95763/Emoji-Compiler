import { useRef, useState, useEffect } from 'react';
import Split from 'react-split';
import type { editor as MonacoEditorType } from 'monaco-editor';
import { Header } from '../components/Header/Header';
import { EmojiCodeEditor } from '../components/Editor/EmojiCodeEditor';
import { OutputPanel } from '../components/Panels/OutputPanel';
import { ReactionOverlay } from '../components/Reactions/ReactionOverlay';
import { BugMascot } from '../components/Mascot/BugMascot';
import { AchievementToast } from '../components/Achievements/AchievementToast';
import { ComplexityMeter } from '../components/Complexity/ComplexityMeter';
import { LandingPage } from '../components/Landing/LandingPage';
import { useEmojiCompilerStore } from './store/emojiCompilerStore';
import type { Diagnostic } from '../types/compiler';
import './EmojiCompiler.css';

export function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'editor'>('landing');
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 768);
  const editorInstanceRef = useRef<MonacoEditorType.IStandaloneCodeEditor | null>(null);

  const {
    theme,
    runCompilation,
    setSelectedDiagnosticId,
    diagnostics,
    standard,
    activeReaction,
    loadSample,
  } = useEmojiCompilerStore();

  const handleLaunchPlayground = (sampleId?: string) => {
    if (sampleId) {
      loadSample(sampleId);
    }
    setCurrentView('editor');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Global Ctrl+Enter shortcut handler
  useEffect(() => {
    if (currentView !== 'editor') return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        runCompilation();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [runCompilation, currentView]);

  if (currentView === 'landing') {
    return <LandingPage onLaunchPlayground={handleLaunchPlayground} />;
  }

  const handleJumpToLine = (line: number) => {
    if (editorInstanceRef.current) {
      editorInstanceRef.current.revealLineInCenter(line);
      editorInstanceRef.current.setPosition({ lineNumber: line, column: 1 });
      editorInstanceRef.current.focus();
    }
  };

  const handleSelectDiagnostic = (d: Diagnostic) => {
    setSelectedDiagnosticId(d.id);
  };

  const errorCount = diagnostics.filter((d) => d.severity === 'error' || d.severity === 'runtime').length;
  const warnCount = diagnostics.filter((d) => d.severity === 'warning').length;

  return (
    <div
      className={`emojicompiler-app ${activeReaction === 'error_l2' ? 'screen-shake' : ''}`}
      data-theme={theme}
    >
      {/* Sleek Minimal Top Bar */}
      <Header onBackToLanding={() => setCurrentView('landing')} />

      {/* Non-blocking Reaction Overlay */}
      <ReactionOverlay />

      {/* Achievement & Notification Toasts */}
      <AchievementToast />

      {/* Docked Corner Bug Mascot */}
      <BugMascot />

      {/* Main Split Layout */}
      <main className="main-workspace">
        <Split
          className={`split-container ${isMobile ? 'split-vertical' : ''}`}
          sizes={isMobile ? [55, 45] : [55, 45]}
          minSize={isMobile ? 120 : 250}
          gutterSize={4}
          direction={isMobile ? 'vertical' : 'horizontal'}
        >
          {/* Editor Pane (Left) */}
          <section className="editor-pane" aria-label="Code Editor">
            <EmojiCodeEditor
              onEditorReady={(editor) => {
                editorInstanceRef.current = editor;
              }}
            />
          </section>

          {/* Output Pane (Right) */}
          <section className="output-pane" aria-label="Compiler Diagnostics and Output">
            <OutputPanel
              onSelectDiagnostic={handleSelectDiagnostic}
              onJumpToLine={handleJumpToLine}
            />
          </section>
        </Split>
      </main>

      {/* Bottom 22px Terminal Status Line */}
      <footer className="terminal-status-bar" role="status" aria-label="Editor Status Line">
        <div className="status-left">
          <span className="status-item status-branch">main.cpp</span>
          <span className="status-item status-std">{standard}</span>
          <span className="status-item">utf-8</span>
          {/* Feature 6: Code Complexity Meter */}
          <div className="status-item status-complexity">
            <ComplexityMeter />
          </div>
        </div>
        <div className="status-right">
          {errorCount > 0 && (
            <span className="status-item status-errors">
              {errorCount} error{errorCount === 1 ? '' : 's'}
            </span>
          )}
          {warnCount > 0 && (
            <span className="status-item status-warnings">
              {warnCount} warning{warnCount === 1 ? '' : 's'}
            </span>
          )}
          {errorCount === 0 && warnCount === 0 && (
            <span className="status-item status-clean">0 issues</span>
          )}
          <span className="status-item status-ready">emojicompiler</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
