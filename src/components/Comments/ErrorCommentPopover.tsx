import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Check, Copy, X, Sparkles, Wrench, MessageSquare, Layers } from 'lucide-react';
import { useEmojiCompilerStore } from '../../app/store/emojiCompilerStore';
import type { Diagnostic } from '../../types/compiler';
import { mapDiagnosticToPhase, getPhaseTag } from '../../lib/pipelinePhases';

interface Props {
  diagnostic: Diagnostic;
  onClose?: () => void;
  onJumpToLine?: (line: number) => void;
}

export const ErrorCommentPopover: React.FC<Props> = ({ diagnostic, onClose, onJumpToLine }) => {
  const [showRaw, setShowRaw] = useState(false);
  const [copied, setCopied] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [showCommentInput, setShowCommentInput] = useState(false);

  const { beginnerMode, applyFix, addUserComment, humorLevel } = useEmojiCompilerStore();
  const phase = diagnostic.phase || mapDiagnosticToPhase(diagnostic.errorType, diagnostic.rawMessage);
  const phaseTag = getPhaseTag(phase, humorLevel);

  const handleCopyRaw = () => {
    navigator.clipboard.writeText(diagnostic.rawMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  const handleApplyFix = () => {
    if (diagnostic.suggestedFix) {
      applyFix(diagnostic.suggestedFix, diagnostic.id);
    }
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addUserComment(diagnostic.line, 'user', commentText.trim());
    setCommentText('');
    setShowCommentInput(false);
  };

  return (
    <div className="flashy-popover-card" role="dialog" aria-label={`Diagnostic on line ${diagnostic.line}`}>
      {/* Popover Top Bar */}
      <div className="popover-top">
        <div className="popover-meta">
          <span className="popover-emoji animate-bounce">{diagnostic.emoji}</span>
          <button
            type="button"
            className="popover-line-link"
            onClick={() => onJumpToLine?.(diagnostic.line)}
            title="Jump to line in editor"
          >
            Line {diagnostic.line}:{diagnostic.column}
          </button>
          <span className={`popover-badge sev-${diagnostic.severity}`}>
            {diagnostic.severity}
          </span>
          <span className="popover-phase-tag" title={`Compilation phase: ${phase}`}>
            <Layers size={11} />
            <span>{phaseTag}</span>
          </span>
        </div>

        {onClose && (
          <button
            type="button"
            className="popover-close-btn"
            onClick={onClose}
            aria-label="Close comment"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Structured Content: Joke Box */}
      <div className="popover-joke-bubble">
        <span className="joke-quote">“</span>
        <p className="joke-text">{diagnostic.funnyJoke}</p>
        <span className="joke-quote">”</span>
      </div>

      {/* AI Beginner Friendly (ELI5) Breakdown */}
      {beginnerMode && (
        <div className="ai-beginner-card">
          <div className="ai-card-header">
            <Sparkles size={13} className="text-pink-400" />
            <span className="ai-title">AI Beginner Mentor (ELI5)</span>
          </div>
          <p className="ai-body-text">{diagnostic.beginnerExplanation}</p>
        </div>
      )}

      {/* Short Actionable Fix Line */}
      <div className="popover-fix-banner">
        <span className="fix-label">Actionable Fix:</span>
        <span className="fix-text">{diagnostic.shortFix}</span>
      </div>

      {/* Suggested Fix Code Diff */}
      {diagnostic.suggestedFix && (
        <div className="popover-diff-card">
          <div className="diff-header">
            <span className="diff-title">
              <Wrench size={12} />
              <span>Suggested Code Patch</span>
            </span>
            <button
              type="button"
              className="apply-fix-glow-btn"
              onClick={handleApplyFix}
              title="Apply patch to editor code"
            >
              Apply Fix ✨
            </button>
          </div>
          <div className="diff-code-lines">
            <div className="diff-row diff-del">
              <span className="diff-sign">-</span>
              <code>{diagnostic.suggestedFix.originalCode}</code>
            </div>
            <div className="diff-row diff-add">
              <span className="diff-sign">+</span>
              <code>{diagnostic.suggestedFix.replacementCode}</code>
            </div>
          </div>
        </div>
      )}

      {/* Raw Diagnostic Accordion */}
      <div className="popover-raw-wrapper">
        <button
          type="button"
          className="raw-toggle"
          onClick={() => setShowRaw(!showRaw)}
          aria-expanded={showRaw}
        >
          <span>Raw Compiler Message</span>
          {showRaw ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        </button>

        {showRaw && (
          <div className="raw-content">
            <button
              type="button"
              className="raw-copy-btn"
              onClick={handleCopyRaw}
              title="Copy diagnostic text"
            >
              {copied ? <Check size={11} /> : <Copy size={11} />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
            <pre>{diagnostic.rawMessage}</pre>
          </div>
        )}
      </div>

      {/* User Peer Comment Trigger */}
      <div className="popover-note-section">
        {!showCommentInput ? (
          <button
            type="button"
            className="add-note-toggle"
            onClick={() => setShowCommentInput(true)}
          >
            <MessageSquare size={12} />
            <span>Add peer comment on Line {diagnostic.line}</span>
          </button>
        ) : (
          <form onSubmit={handlePostComment} className="popover-note-form">
            <input
              type="text"
              placeholder={`Comment on Line ${diagnostic.line}...`}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="popover-note-input"
              autoFocus
            />
            <div className="note-form-actions">
              <button type="submit" className="note-submit-btn">Post</button>
              <button
                type="button"
                className="note-cancel-btn"
                onClick={() => setShowCommentInput(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
