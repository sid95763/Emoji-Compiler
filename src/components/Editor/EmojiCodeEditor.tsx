import React, { useRef, useEffect } from 'react';
import Editor, { type Monaco } from '@monaco-editor/react';
import type { editor as MonacoEditorType } from 'monaco-editor';
import { useEmojiCompilerStore } from '../../app/store/emojiCompilerStore';
import { ErrorCommentPopover } from '../Comments/ErrorCommentPopover';

interface Props {
  onEditorReady?: (editor: MonacoEditorType.IStandaloneCodeEditor) => void;
}

export const EmojiCodeEditor: React.FC<Props> = ({ onEditorReady }) => {
  const editorRef = useRef<MonacoEditorType.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<Monaco | null>(null);
  const decorationsRef = useRef<string[]>([]);

  const {
    code,
    setCode,
    theme,
    diagnostics,
    selectedDiagnosticId,
    setSelectedDiagnosticId,
    runCompilation,
    flashingLine,
    highlightedLoopLine,
  } = useEmojiCompilerStore();

  const selectedDiagnostic = diagnostics.find((d) => d.id === selectedDiagnosticId) || null;

  const handleEditorMount = (
    editorInstance: MonacoEditorType.IStandaloneCodeEditor,
    monacoInstance: Monaco
  ) => {
    editorRef.current = editorInstance;
    monacoRef.current = monacoInstance;

    // Register Ctrl+Enter / Cmd+Enter shortcut
    editorInstance.addCommand(
      monacoInstance.KeyMod.CtrlCmd | monacoInstance.KeyCode.Enter,
      () => {
        runCompilation();
      }
    );

    // Click on glyph margin or line number
    editorInstance.onMouseDown((e) => {
      const targetLine = e.target.position?.lineNumber;
      if (!targetLine) return;

      const diag = diagnostics.find((d) => d.line === targetLine);
      if (diag) {
        setSelectedDiagnosticId(diag.id);
      }
    });

    if (onEditorReady) {
      onEditorReady(editorInstance);
    }
  };

  // Update Monaco decorations for emojis and squiggly lines
  useEffect(() => {
    const editor = editorRef.current;
    const monaco = monacoRef.current;
    if (!editor || !monaco) return;

    const newDecorations: MonacoEditorType.IModelDeltaDecoration[] = [];

    diagnostics.forEach((d) => {
      const line = Math.max(1, d.line);
      const colStart = Math.max(1, d.column || 1);
      const colEnd = colStart + 4;
      const isSelected = d.id === selectedDiagnosticId;
      const isFlashing = flashingLine === d.line;

      newDecorations.push({
        range: new monaco.Range(line, colStart, line, colEnd),
        options: {
          isWholeLine: false,
          className: d.severity === 'warning' ? 'squiggly-warning' : 'squiggly-error',
          glyphMarginClassName: `emoji-glyph-marker ${isSelected ? 'emoji-glyph-selected' : ''}`,
          glyphMarginHoverMessage: {
            value: `**${d.emoji} ${d.message}**\n\n> *“${d.funnyJoke}”*\n\n_${d.shortFix}_`,
          },
          linesDecorationsClassName: isFlashing ? 'line-flash-error' : undefined,
          overviewRuler: {
            color: d.severity === 'warning' ? '#eab308' : '#ef4444',
            position: monaco.editor.OverviewRulerLane.Right,
          },
        },
      });
    });

    if (highlightedLoopLine && highlightedLoopLine > 0) {
      newDecorations.push({
        range: new monaco.Range(highlightedLoopLine, 1, highlightedLoopLine, 1),
        options: {
          isWholeLine: true,
          className: 'deepest-loop-line-highlight',
          linesDecorationsClassName: 'deepest-loop-glyph',
          overviewRuler: {
            color: '#f59e0b',
            position: monaco.editor.OverviewRulerLane.Left,
          },
        },
      });
      try {
        editor.revealLineInCenterIfOutsideViewport(highlightedLoopLine);
      } catch (e) {
        void e;
      }
    }

    decorationsRef.current = editor.deltaDecorations(decorationsRef.current, newDecorations);
  }, [diagnostics, selectedDiagnosticId, flashingLine, highlightedLoopLine]);

  const handleJumpToLine = (line: number) => {
    if (editorRef.current) {
      editorRef.current.revealLineInCenter(line);
      editorRef.current.setPosition({ lineNumber: line, column: 1 });
      editorRef.current.focus();
    }
  };

  return (
    <div className="terminal-editor-container">
      {/* Subtle editor top label */}
      <div className="editor-tab-label">
        <span className="file-name">main.cpp</span>
        {diagnostics.length > 0 && (
          <span className="issues-indicator">
            {diagnostics.map((d) => (
              <button
                key={d.id}
                type="button"
                className={`glyph-dot-btn ${selectedDiagnosticId === d.id ? 'active' : ''}`}
                onClick={() => {
                  setSelectedDiagnosticId(d.id);
                  handleJumpToLine(d.line);
                }}
                title={`Line ${d.line}: ${d.message}`}
              >
                <span>{d.emoji}</span>
                <span className="dot-line">L{d.line}</span>
              </button>
            ))}
          </span>
        )}
      </div>

      <div className="monaco-host-wrapper">
        <Editor
          height="100%"
          language="cpp"
          theme={theme === 'dark' ? 'vs-dark' : 'light'}
          value={code}
          onChange={(val) => setCode(val ?? '')}
          onMount={handleEditorMount}
          options={{
            fontSize: 13.5,
            fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 4,
            wordWrap: 'off',
            lineNumbers: 'on',
            glyphMargin: true,
            renderLineHighlight: 'line',
            padding: { top: 10, bottom: 10 },
            cursorBlinking: 'blink',
            smoothScrolling: false,
          }}
        />

        {/* Floating Anchored Error Popover */}
        {selectedDiagnostic && (
          <div className="anchored-popover-slot">
            <ErrorCommentPopover
              diagnostic={selectedDiagnostic}
              onClose={() => setSelectedDiagnosticId(null)}
              onJumpToLine={handleJumpToLine}
            />
          </div>
        )}
      </div>
    </div>
  );
};
