import React from 'react';
import { CheckCircle2, XCircle, Clock, AlertCircle, ArrowRight, Filter } from 'lucide-react';
import { useEmojiCompilerStore } from '../../app/store/emojiCompilerStore';
import { PIPELINE_STAGES, computePipelineStatuses, mapDiagnosticToPhase, type PipelinePhase } from '../../lib/pipelinePhases';

interface Props {
  onStageSelect?: (phase: PipelinePhase) => void;
}

export const PipelineStepper: React.FC<Props> = ({ onStageSelect }) => {
  const {
    diagnostics,
    isCompiling,
    hasRun,
    activeRunningStage,
    pipelinePhaseFilter,
    setPipelinePhaseFilter,
    setActiveTab,
  } = useEmojiCompilerStore();

  const stageStatuses = computePipelineStatuses(diagnostics, isCompiling, hasRun, activeRunningStage || undefined);

  // Count errors caught per stage
  const errorCountByPhase: Record<PipelinePhase, number> = {
    lexing: 0,
    parsing: 0,
    semantic: 0,
    optimization: 0,
    assembly: 0,
  };

  diagnostics.forEach((d) => {
    const phase = d.phase || mapDiagnosticToPhase(d.errorType, d.rawMessage);
    errorCountByPhase[phase] = (errorCountByPhase[phase] || 0) + 1;
  });

  const handleStageClick = (phase: PipelinePhase) => {
    if (pipelinePhaseFilter === phase) {
      setPipelinePhaseFilter(null);
    } else {
      setPipelinePhaseFilter(phase);
      setActiveTab('errors');
    }
    if (onStageSelect) {
      onStageSelect(phase);
    }
  };

  return (
    <div className="pipeline-stepper-container" role="region" aria-label="Compilation Pipeline Stages">
      <div className="pipeline-header-bar">
        <div className="pipeline-title-group">
          <span className="pipeline-heading">Compilation Pipeline</span>
          {pipelinePhaseFilter && (
            <button
              type="button"
              className="pipeline-clear-filter-btn"
              onClick={() => setPipelinePhaseFilter(null)}
              title="Clear phase filter"
            >
              <Filter size={11} />
              <span>Filtering: {pipelinePhaseFilter}</span>
              <span className="clear-x">✕</span>
            </button>
          )}
        </div>
        <span className="pipeline-hint-text">
          {isCompiling
            ? 'Compiling through pipeline stages...'
            : hasRun
            ? 'Click any stage to filter diagnostics'
            : 'Stages trigger on Run (Ctrl+Enter)'}
        </span>
      </div>

      <div className="stepper-horizontal-track" role="list">
        {PIPELINE_STAGES.map((stage, idx) => {
          const status = stageStatuses[stage.id];
          const isFilterActive = pipelinePhaseFilter === stage.id;
          const errCount = errorCountByPhase[stage.id];
          const isCurrentRunning = activeRunningStage === stage.id;

          return (
            <React.Fragment key={stage.id}>
              {/* Stage Node */}
              <button
                type="button"
                role="listitem"
                className={`pipeline-stage-node status-${status} ${isFilterActive ? 'is-filtered' : ''} ${
                  isCurrentRunning ? 'is-running-glow' : ''
                }`}
                onClick={() => handleStageClick(stage.id)}
                title={`${stage.name}: ${status.toUpperCase()} (${stage.description}) - Click to filter`}
                aria-label={`${stage.name} stage: ${status}`}
              >
                <div className="stage-icon-circle">
                  {status === 'passed' && <CheckCircle2 size={13} className="stage-icon-passed" />}
                  {status === 'failed' && <XCircle size={13} className="stage-icon-failed" />}
                  {status === 'running' && <span className="stage-spinner" aria-hidden="true" />}
                  {status === 'pending' && <Clock size={12} className="stage-icon-pending" />}
                  {status === 'skipped' && <AlertCircle size={12} className="stage-icon-skipped" />}
                </div>

                <div className="stage-text-block">
                  <span className="stage-step-num">0{idx + 1}</span>
                  <span className="stage-name">{stage.name}</span>
                  <div className="stage-badge-row">
                    <span className={`stage-status-badge badge-${status}`}>
                      {status}
                    </span>
                    {errCount > 0 && (
                      <span className="stage-error-count-badge">
                        {errCount} err
                      </span>
                    )}
                  </div>
                </div>
              </button>

              {/* Connecting Line between stages */}
              {idx < PIPELINE_STAGES.length - 1 && (
                <div
                  className={`pipeline-connector-line ${
                    status === 'passed' ? 'line-passed' : status === 'running' ? 'line-active' : ''
                  }`}
                  aria-hidden="true"
                >
                  <ArrowRight size={10} className="connector-arrow" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
