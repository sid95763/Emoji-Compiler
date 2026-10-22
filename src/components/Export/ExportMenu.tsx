import React, { useState, useRef, useEffect } from 'react';
import { Download, FileCode, Cpu, FileText, ChevronDown } from 'lucide-react';
import { useEmojiCompilerStore } from '../../app/store/emojiCompilerStore';
import { exportSourceCode, exportAssembly, generatePdfErrorReport } from '../../lib/pdfExporter';

export const ExportMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const {
    code,
    assemblyCode,
    diagnostics,
    humorLevel,
    showToast,
  } = useEmojiCompilerStore();

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleExportCpp = () => {
    exportSourceCode(code, 'main.cpp');
    showToast('Exported C++ source as main.cpp');
    setIsOpen(false);
  };

  const handleExportAssembly = () => {
    if (!assemblyCode) return;
    const success = exportAssembly(assemblyCode, 'main.s');
    if (success) {
      showToast('Exported generated assembly as main.s');
    }
    setIsOpen(false);
  };

  const handleExportPdf = () => {
    try {
      generatePdfErrorReport(code, diagnostics, humorLevel);
      showToast('Downloaded PDF Error & Build Report');
    } catch (err) {
      console.error('PDF export failed:', err);
      showToast('Failed to generate PDF report');
    }
    setIsOpen(false);
  };

  const hasAssembly = Boolean(assemblyCode && assemblyCode.trim().length > 0);

  return (
    <div className="export-menu-container" ref={menuRef}>
      <button
        type="button"
        className={`export-menu-btn ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="true"
        aria-expanded={isOpen}
        title="Export code, assembly or PDF report"
      >
        <Download size={13} />
        <span>Export</span>
        <ChevronDown size={11} className={`export-chevron ${isOpen ? 'open' : ''}`} />
      </button>

      {isOpen && (
        <div className="export-dropdown-card" role="menu" aria-label="Export options">
          <div className="export-dropdown-header">
            <span>Export Artifacts</span>
          </div>

          {/* 1. Download .cpp */}
          <button
            type="button"
            role="menuitem"
            className="export-item-btn"
            onClick={handleExportCpp}
          >
            <FileCode size={14} className="text-emerald-400" />
            <div className="export-item-text">
              <span className="export-item-title">Source Code (.cpp)</span>
              <span className="export-item-sub">Download active C++ source file</span>
            </div>
          </button>

          {/* 2. Download .s (assembly) */}
          <button
            type="button"
            role="menuitem"
            className={`export-item-btn ${!hasAssembly ? 'is-disabled' : ''}`}
            onClick={handleExportAssembly}
            disabled={!hasAssembly}
            title={
              hasAssembly
                ? 'Download generated x86-64 assembly'
                : 'Assembly output is only available after a successful, error-free compilation.'
            }
          >
            <Cpu size={14} className={hasAssembly ? 'text-cyan-400' : 'text-slate-500'} />
            <div className="export-item-text">
              <span className="export-item-title">Generated Assembly (.s)</span>
              <span className="export-item-sub">
                {hasAssembly
                  ? 'Binary compiler assembly output'
                  : 'Disabled: requires zero-error build'}
              </span>
            </div>
          </button>

          {/* 3. Download PDF Report */}
          <button
            type="button"
            role="menuitem"
            className="export-item-btn"
            onClick={handleExportPdf}
          >
            <FileText size={14} className="text-rose-400" />
            <div className="export-item-text">
              <span className="export-item-title">Diagnostic Report (.pdf)</span>
              <span className="export-item-sub">Printable build analysis & fixes</span>
            </div>
          </button>
        </div>
      )}
    </div>
  );
};
