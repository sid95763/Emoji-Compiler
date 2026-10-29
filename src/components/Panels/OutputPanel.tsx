import React, { useState } from 'react';
import { Check, Filter, Layers, Code2, Award, Terminal, AlertCircle } from 'lucide-react';
import { useEmojiCompilerStore } from '../../app/store/emojiCompilerStore';
import { PipelineStepper } from './PipelineStepper';
import { TokensTab } from './TokensTab';
import { AchievementsPanel } from './AchievementsPanel';
import { mapDiagnosticToPhase, getPhaseTag, PIPELINE_STAGES } from '../../lib/pipelinePhases';
import type { Diagnostic } from '../../types/compiler';

interface Props {
  onSelectDiagnostic: (d: Diagnostic) => void;
  onJumpToLine: (line: number) => void;
}

export const OutputPanel: React.FC<Props> = ({ onSelectDiagnostic, onJumpToLine }) => {
  const {
    activeTab,
    setActiveTab,
    compileResult,
    diagnostics,
    selectedDiagnosticId,
    stdin,
    setStdin,
    userComments,
    addUserComment,
    addCommentReply,
    resolveComment,
    applyFix,
    pipelinePhaseFilter,
    setPipelinePhaseFilter,
    humorLevel,
    isCompiling,
    activeRunningStage,
  } = useEmojiCompilerStore();

  const [commentLineInput, setCommentLineInput] = useState<number>(1);
  const [commentTextInput, setCommentTextInput] = useState<string>('');
  const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});

  const handlePostNewComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentTextInput.trim()) return;
    addUserComment(commentLineInput, 'user', commentTextInput.trim());
    setCommentTextInput('');
  };

  const handlePostReply = (commentId: string) => {
    const text = replyInputs[commentId]?.trim();
    if (!text) return;
    addCommentReply(commentId, 'user', text);
    setReplyInputs({ ...replyInputs, [commentId]: '' });
  };

  // Filter diagnostics by selected pipeline phase if active
  const filteredDiagnostics = pipelinePhaseFilter
    ? diagnostics.filter(
        (d) => (d.phase || mapDiagnosticToPhase(d.errorType, d.rawMessage)) === pipelinePhaseFilter
      )
    : diagnostics;

  return (
    <div className="terminal-panel-container">
      {/* Feature 1: Compilation Pipeline Stepper Header */}
      <PipelineStepper />

      {/* Tab Navigation */}
      <div className="terminal-tabs" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'console'}
          className={`tab-btn ${activeTab === 'console' ? 'active' : ''}`}
          onClick={() => setActiveTab('console')}
        >
          <Terminal size={12} />
          <span>console</span>
          {compileResult && (
            <span className={`tab-status-dot ${compileResult.success ? 'dot-success' : 'dot-error'}`} />
          )}
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'errors'}
          className={`tab-btn ${activeTab === 'errors' ? 'active' : ''}`}
          onClick={() => setActiveTab('errors')}
        >
          <AlertCircle size={12} />
          <span>errors</span>
          {diagnostics.length > 0 && (
            <span className="tab-count-badge">
              [{filteredDiagnostics.length}
              {pipelinePhaseFilter ? `/${diagnostics.length}` : ''}]
            </span>
          )}
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'tokens'}
          className={`tab-btn ${activeTab === 'tokens' ? 'active' : ''}`}
          onClick={() => setActiveTab('tokens')}
        >
          <Code2 size={12} />
          <span>tokens</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'pipeline'}
          className={`tab-btn ${activeTab === 'pipeline' ? 'active' : ''}`}
          onClick={() => setActiveTab('pipeline')}
        >
          <Layers size={12} />
          <span>pipeline</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'achievements'}
          className={`tab-btn ${activeTab === 'achievements' ? 'active' : ''}`}
          onClick={() => setActiveTab('achievements')}
        >
          <Award size={12} />
          <span>achievements</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'stdin'}
          className={`tab-btn ${activeTab === 'stdin' ? 'active' : ''}`}
          onClick={() => setActiveTab('stdin')}
        >
          <span>stdin</span>
          {stdin.length > 0 && <span className="tab-count-badge">[•]</span>}
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'comments'}
          className={`tab-btn ${activeTab === 'comments' ? 'active' : ''}`}
          onClick={() => setActiveTab('comments')}
        >
          <span>comments</span>
          {userComments.length > 0 && (
            <span className="tab-count-badge">[{userComments.length}]</span>
          )}
        </button>
      </div>

      {/* Tab Content Body */}
      <div className="panel-tab-body">
        {/* CONSOLE */}
        {activeTab === 'console' && (
          <div className="console-pane">
            {isCompiling ? (
              <div className="console-compiling-state">
                <div className="compiling-pulse-spinner" />
                <p className="compiling-heading">&gt; compiling and assembling through pipeline...</p>
                <div className="compiling-stage-indicator">
                  <span>Current phase: </span>
                  <span className="compiling-phase-badge">{activeRunningStage || 'lexing'}</span>
                </div>
              </div>
            ) : compileResult ? (
              <div className="console-stream">
                <div className="stream-meta-line">
                  <span className={compileResult.success ? 'meta-success' : 'meta-error'}>
                    process: exited with {compileResult.exitCode ?? (compileResult.success ? 0 : 1)}
                  </span>
                  {compileResult.executionTime && (
                    <span className="meta-dim">time: {compileResult.executionTime}</span>
                  )}
                  {compileResult.memory && (
                    <span className="meta-dim">mem: {compileResult.memory}kb</span>
                  )}
                </div>

                {compileResult.stdout && (
                  <div className="stream-section">
                    <pre className="stdout-text">{compileResult.stdout}</pre>
                  </div>
                )}

                {compileResult.stderr && (
                  <div className="stream-section">
                    <pre className="stderr-text">{compileResult.stderr}</pre>
                  </div>
                )}

                {compileResult.compileOutput && (
                  <div className="stream-section">
                    <pre className="compile-output-text">{compileResult.compileOutput}</pre>
                  </div>
                )}

                {!compileResult.stdout && !compileResult.stderr && !compileResult.compileOutput && (
                  <div className="empty-stream-msg">
                    <span>(process returned no output)</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="console-idle-state">
                <p>&gt; ready. press [ run ] or ctrl+enter to execute.</p>
              </div>
            )}
          </div>
        )}

        {/* ERROR SUMMARY */}
        {activeTab === 'errors' && (
          <div className="errors-pane">
            {pipelinePhaseFilter && (
              <div className="filter-active-banner">
                <Filter size={12} />
                <span>Showing diagnostics caught in the <strong>{pipelinePhaseFilter}</strong> stage</span>
                <button
                  type="button"
                  className="clear-phase-filter-btn"
                  onClick={() => setPipelinePhaseFilter(null)}
                >
                  Show all stages
                </button>
              </div>
            )}

            {isCompiling ? (
              <div className="console-compiling-state">
                <div className="compiling-pulse-spinner" />
                <p className="compiling-heading">&gt; analyzing syntax, semantic trees and diagnostics...</p>
                <span className="compiling-subtext">Phase: {activeRunningStage || 'lexing'}</span>
              </div>
            ) : filteredDiagnostics.length > 0 ? (
              <div className="errors-feed">
                {filteredDiagnostics.map((d) => {
                  const isSelected = selectedDiagnosticId === d.id;
                  const phase = d.phase || mapDiagnosticToPhase(d.errorType, d.rawMessage);
                  const phaseTag = getPhaseTag(phase, humorLevel);

                  return (
                    <div
                      key={d.id}
                      className={`error-row ${isSelected ? 'row-selected' : ''}`}
                      onClick={() => {
                        onSelectDiagnostic(d);
                        onJumpToLine(d.line);
                      }}
                    >
                      <div className="row-header">
                        <span className="row-emoji">{d.emoji}</span>
                        <span className="row-loc">L{d.line}:{d.column}</span>
                        <span className={`row-sev sev-${d.severity}`}>{d.severity}</span>
                        <span className="row-phase-chip" title={`Caught at ${phase} phase`}>
                          {phaseTag}
                        </span>
                        <span className="row-msg">{d.message}</span>
                        {d.suggestedFix && (
                          <button
                            type="button"
                            className="row-fix-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              applyFix(d.suggestedFix!, d.id);
                            }}
                            title="Apply fix"
                          >
                            [fix]
                          </button>
                        )}
                      </div>

                      <div className="row-joke">
                        <span>“{d.funnyJoke}”</span>
                      </div>

                      <div className="row-fix-hint">
                        <span className="fix-tag">fix:</span>
                        <span>{d.shortFix}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : compileResult && !compileResult.success ? (
              <div className="errors-clean-state">
                <p style={{ color: 'var(--sev-error)' }}>&gt; compilation or runtime error occurred.</p>
                {compileResult.stderr && <pre className="stderr-text" style={{ marginTop: '8px' }}>{compileResult.stderr}</pre>}
                {compileResult.compileOutput && <pre className="compile-output-text" style={{ marginTop: '8px' }}>{compileResult.compileOutput}</pre>}
                <button
                  type="button"
                  style={{
                    marginTop: '12px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-main)',
                    padding: '4px 10px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '11px',
                    fontFamily: 'var(--font-mono)',
                  }}
                  onClick={() => setActiveTab('console')}
                >
                  View in console tab →
                </button>
              </div>
            ) : (
              <div className="errors-clean-state">
                {pipelinePhaseFilter ? (
                  <p>&gt; zero diagnostics found in {pipelinePhaseFilter} stage.</p>
                ) : (
                  <p>&gt; zero diagnostics detected. clean build.</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* LIVE TOKEN VISUALIZER */}
        {activeTab === 'tokens' && (
          <div className="tokens-tab-pane">
            <TokensTab onJumpToLine={onJumpToLine} />
          </div>
        )}

        {/* PIPELINE DETAILED VIEW */}
        {activeTab === 'pipeline' && (
          <div className="pipeline-tab-pane">
            <div className="pipeline-overview-list">
              {PIPELINE_STAGES.map((s) => {
                const stageDiags = diagnostics.filter(
                  (d) => (d.phase || mapDiagnosticToPhase(d.errorType, d.rawMessage)) === s.id
                );
                return (
                  <div key={s.id} className="pipeline-detail-card">
                    <div className="detail-card-header">
                      <div className="stage-title-wrap">
                        <span className="stage-card-name">{s.name}</span>
                        <span className="stage-card-desc">{s.description}</span>
                      </div>
                      <button
                        type="button"
                        className="stage-filter-btn"
                        onClick={() => {
                          setPipelinePhaseFilter(s.id);
                          setActiveTab('errors');
                        }}
                      >
                        {stageDiags.length} diagnostic{stageDiags.length === 1 ? '' : 's'}
                      </button>
                    </div>

                    {stageDiags.length > 0 && (
                      <div className="stage-diags-mini-list">
                        {stageDiags.map((d) => (
                          <div
                            key={d.id}
                            className="mini-diag-item"
                            onClick={() => {
                              onSelectDiagnostic(d);
                              onJumpToLine(d.line);
                            }}
                          >
                            <span>{d.emoji}</span>
                            <span className="mini-loc">Line {d.line}</span>
                            <span className="mini-msg">{d.message}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ACHIEVEMENTS & STREAKS */}
        {activeTab === 'achievements' && (
          <div className="achievements-tab-pane">
            <AchievementsPanel />
          </div>
        )}

        {/* STDIN */}
        {activeTab === 'stdin' && (
          <div className="stdin-pane">
            <div className="stdin-caption">
              <span>// standard input stream (std::cin):</span>
            </div>
            <textarea
              className="stdin-editor"
              placeholder="pass input here for cin..."
              value={stdin}
              onChange={(e) => setStdin(e.target.value)}
              rows={8}
            />
          </div>
        )}

        {/* COMMENTS */}
        {activeTab === 'comments' && (
          <div className="comments-pane">
            {/* Add Comment Form */}
            <form onSubmit={handlePostNewComment} className="comment-create-form">
              <div className="form-line-row">
                <label>
                  <span>line:</span>
                  <input
                    type="number"
                    min={1}
                    value={commentLineInput}
                    onChange={(e) => setCommentLineInput(Math.max(1, parseInt(e.target.value) || 1))}
                    className="num-field"
                  />
                </label>
                <input
                  type="text"
                  placeholder="leave a comment or note..."
                  value={commentTextInput}
                  onChange={(e) => setCommentTextInput(e.target.value)}
                  className="text-field"
                  required
                />
                <button type="submit" className="post-btn">[ post ]</button>
              </div>
            </form>

            {/* Comments List */}
            {userComments.length > 0 ? (
              <div className="comments-stream">
                {userComments.map((c) => (
                  <div key={c.id} className={`terminal-comment ${c.resolved ? 'is-resolved' : ''}`}>
                    <div className="comment-top-bar">
                      <button
                        type="button"
                        className="comment-line-btn"
                        onClick={() => onJumpToLine(c.line)}
                      >
                        L{c.line}
                      </button>
                      <span className="comment-author">@{c.author}</span>
                      <span className="comment-date">{c.createdAt}</span>

                      <button
                        type="button"
                        className="comment-resolve-btn"
                        onClick={() => resolveComment(c.id)}
                      >
                        <Check size={11} />
                        <span>{c.resolved ? 'resolved' : 'resolve'}</span>
                      </button>
                    </div>

                    <p className="comment-text-content">{c.text}</p>

                    {/* Replies */}
                    {c.replies.length > 0 && (
                      <div className="replies-block">
                        {c.replies.map((r) => (
                          <div key={r.id} className="reply-entry">
                            <span className="reply-handle">@{r.author}:</span>
                            <span className="reply-content">{r.text}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Reply Form */}
                    {!c.resolved && (
                      <div className="reply-form-row">
                        <input
                          type="text"
                          placeholder="reply..."
                          value={replyInputs[c.id] || ''}
                          onChange={(e) => setReplyInputs({ ...replyInputs, [c.id]: e.target.value })}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handlePostReply(c.id);
                            }
                          }}
                          className="reply-input-box"
                        />
                        <button
                          type="button"
                          className="reply-action-btn"
                          onClick={() => handlePostReply(c.id)}
                        >
                          [reply]
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="comments-empty-state">
                <p>&gt; no comments attached. comments start empty.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
