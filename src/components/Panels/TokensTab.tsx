import React, { useState, useEffect, useMemo } from 'react';
import { tokenizeCpp, type CppToken, type TokenCategory } from '../../lib/cppLexer';
import { useEmojiCompilerStore } from '../../app/store/emojiCompilerStore';

interface Props {
  onJumpToLine?: (line: number) => void;
  onHoverToken?: (token: CppToken | null) => void;
}

const CATEGORY_COLORS: Record<TokenCategory, { label: string; bg: string; text: string; border: string }> = {
  keyword: {
    label: 'keyword',
    bg: 'rgba(168, 85, 247, 0.15)',
    text: '#c084fc',
    border: 'rgba(168, 85, 247, 0.35)',
  },
  identifier: {
    label: 'identifier',
    bg: 'rgba(56, 189, 248, 0.15)',
    text: '#38bdf8',
    border: 'rgba(56, 189, 248, 0.35)',
  },
  literal: {
    label: 'literal',
    bg: 'rgba(251, 191, 36, 0.15)',
    text: '#fbbf24',
    border: 'rgba(251, 191, 36, 0.35)',
  },
  operator: {
    label: 'operator',
    bg: 'rgba(52, 211, 153, 0.15)',
    text: '#34d399',
    border: 'rgba(52, 211, 153, 0.35)',
  },
  punctuation: {
    label: 'punctuation',
    bg: 'rgba(148, 163, 184, 0.15)',
    text: '#94a3b8',
    border: 'rgba(148, 163, 184, 0.35)',
  },
  preprocessor: {
    label: 'preprocessor',
    bg: 'rgba(244, 114, 182, 0.15)',
    text: '#f472b6',
    border: 'rgba(244, 114, 182, 0.35)',
  },
  comment: {
    label: 'comment',
    bg: 'rgba(100, 116, 139, 0.15)',
    text: '#64748b',
    border: 'rgba(100, 116, 139, 0.3)',
  },
};

export const TokensTab: React.FC<Props> = ({ onJumpToLine, onHoverToken }) => {
  const { code } = useEmojiCompilerStore();
  const [debouncedCode, setDebouncedCode] = useState(code);
  const [categoryFilter, setCategoryFilter] = useState<TokenCategory | 'all'>('all');

  // Debounce code by 200ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedCode(code);
    }, 200);
    return () => clearTimeout(timer);
  }, [code]);

  // Tokenize using lightweight TS lexer
  const lexerResult = useMemo(() => {
    return tokenizeCpp(debouncedCode);
  }, [debouncedCode]);

  const displayedTokens = useMemo(() => {
    if (categoryFilter === 'all') return lexerResult.tokens;
    return lexerResult.tokens.filter((t) => t.category === categoryFilter);
  }, [lexerResult.tokens, categoryFilter]);

  return (
    <div className="tokens-visualizer-container" role="region" aria-label="Live Token Visualizer">
      {/* Category Legend & Stats Header */}
      <div className="tokens-legend-bar">
        <div className="tokens-stats-summary">
          <span className="tokens-total-count">
            Total Tokens: <strong>{lexerResult.totalCount}</strong>
          </span>
          <button
            type="button"
            className={`legend-pill pill-all ${categoryFilter === 'all' ? 'pill-selected' : ''}`}
            onClick={() => setCategoryFilter('all')}
          >
            <span>all</span>
            <span className="count-tag">[{lexerResult.totalCount}]</span>
          </button>
        </div>

        <div className="tokens-categories-legend" role="group" aria-label="Token categories">
          {(Object.keys(CATEGORY_COLORS) as TokenCategory[]).map((cat) => {
            const count = lexerResult.categoryCounts[cat] || 0;
            const style = CATEGORY_COLORS[cat];
            const isSelected = categoryFilter === cat;

            return (
              <button
                key={cat}
                type="button"
                className={`legend-pill ${isSelected ? 'pill-selected' : ''}`}
                style={{
                  backgroundColor: isSelected ? style.bg : 'transparent',
                  borderColor: isSelected ? style.border : 'rgba(255,255,255,0.08)',
                  color: style.text,
                }}
                onClick={() => setCategoryFilter(isSelected ? 'all' : cat)}
                title={`Filter by ${cat} (${count} tokens)`}
              >
                <span className="legend-dot" style={{ backgroundColor: style.text }} />
                <span>{cat}</span>
                <span className="count-tag">[{count}]</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Chips Stream */}
      <div className="tokens-chips-stream" role="list">
        {displayedTokens.length > 0 ? (
          displayedTokens.map((tok) => {
            const style = CATEGORY_COLORS[tok.category];
            return (
              <button
                key={tok.id}
                type="button"
                role="listitem"
                className="token-chip"
                style={{
                  backgroundColor: style.bg,
                  color: style.text,
                  borderColor: style.border,
                }}
                onClick={() => onJumpToLine?.(tok.line)}
                onMouseEnter={() => onHoverToken?.(tok)}
                onMouseLeave={() => onHoverToken?.(null)}
                title={`[${tok.category}] Line ${tok.line}:${tok.column} — Click to jump`}
              >
                <span className="token-text">{tok.text}</span>
                <span className="token-pos">L{tok.line}</span>
              </button>
            );
          })
        ) : (
          <div className="tokens-empty-state">
            <p>&gt; no tokens match the active filter or empty code.</p>
          </div>
        )}
      </div>
    </div>
  );
};
