import React, { useMemo, useState } from 'react';
import { Activity, HelpCircle, AlertTriangle } from 'lucide-react';
import { useEmojiCompilerStore } from '../../app/store/emojiCompilerStore';
import { estimateComplexity } from '../../lib/complexityAnalyzer';

export const ComplexityMeter: React.FC = () => {
  const { code, humorLevel, setHighlightedLoopLine } = useEmojiCompilerStore();
  const [showTooltip, setShowTooltip] = useState(false);

  // Compute static heuristic estimate
  const complexity = useMemo(() => {
    return estimateComplexity(code, humorLevel);
  }, [code, humorLevel]);

  const handleMouseEnter = () => {
    setShowTooltip(true);
    if (complexity.deepestLoopLine) {
      setHighlightedLoopLine(complexity.deepestLoopLine);
    }
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
    setHighlightedLoopLine(null);
  };

  // Notation styling color
  const getBadgeClass = (notation: string) => {
    if (notation === 'O(1)') return 'badge-o1';
    if (notation.includes('log') || notation === 'O(n)') return 'badge-on';
    if (notation === 'O(n²)') return 'badge-on2';
    return 'badge-on3';
  };

  return (
    <div
      className="complexity-meter-container"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="status"
      aria-label={`Time Complexity Estimate: ${complexity.notation}`}
    >
      <div className="meter-pill">
        <Activity size={12} className="meter-pulse-icon" />
        <span className="meter-label">ESTIMATE:</span>
        <span className={`meter-notation ${getBadgeClass(complexity.notation)}`}>
          {complexity.notation}
        </span>
        {complexity.warning && (
          <AlertTriangle size={11} className="meter-warning-icon text-amber-400" />
        )}
        <HelpCircle size={10} className="meter-info-icon" />
      </div>

      {/* Info Tooltip Popup */}
      {showTooltip && (
        <div className="complexity-tooltip-card" role="tooltip">
          <div className="tooltip-header">
            <strong>Heuristic Complexity Estimate</strong>
            <span className="tooltip-sub">Static Code Analysis</span>
          </div>

          <div className="tooltip-data-row">
            <span>Estimated Notation:</span>
            <code className="tooltip-code">{complexity.notation}</code>
          </div>

          <div className="tooltip-data-row">
            <span>Max Loop Nesting:</span>
            <span>Depth {complexity.maxDepth}</span>
          </div>

          {complexity.deepestLoopLine && (
            <div className="tooltip-data-row">
              <span>Deepest Loop:</span>
              <span className="text-amber-300">Line {complexity.deepestLoopLine} (Hovering highlights in editor)</span>
            </div>
          )}

          {complexity.warning && (
            <div className="tooltip-warning-box">
              <span className="warn-prefix">⚠️ Humor Note:</span>
              <p className="warn-text">“{complexity.warning}”</p>
            </div>
          )}

          <div className="tooltip-disclaimer">
            <p>
              * Clearly an <strong>ESTIMATE</strong>. Heuristic calculates loop nesting & recursive branches. It cannot predict dynamic input sizes, amortized STL costs, or compiler loop unrolling optimizations.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
