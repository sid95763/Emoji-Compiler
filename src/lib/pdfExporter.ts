import { jsPDF } from 'jspdf';
import { mapDiagnosticToPhase, PIPELINE_STAGES } from './pipelinePhases';
import type { Diagnostic, HumorLevel } from '../types/compiler';

/**
 * Download text content as a file via browser blob
 */
export function downloadFile(content: string, filename: string, mimeType: string = 'text/plain') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Export C++ source code as .cpp file
 */
export function exportSourceCode(code: string, filename: string = 'main.cpp') {
  downloadFile(code, filename, 'text/x-c++src');
}

/**
 * Export generated assembly code as .s file
 */
export function exportAssembly(assemblyCode: string | null, filename: string = 'main.s'): boolean {
  if (!assemblyCode || assemblyCode.trim().length === 0) {
    return false;
  }
  downloadFile(assemblyCode, filename, 'text/x-asm');
  return true;
}

/**
 * Generate a printable, professional PDF Error Report using jsPDF
 */
export function generatePdfErrorReport(
  code: string,
  diagnostics: Diagnostic[],
  humorLevel: HumorLevel,
  timestamp: string = new Date().toLocaleString()
) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 40;

  // Header Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(20, 20, 25);
  doc.text('EmojiCompiler — Diagnostic Build Report', 40, y);

  // Timestamp & Metadata
  y += 18;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 110);
  doc.text(`Generated: ${timestamp}  |  Standard: C++17/20  |  Issues Found: ${diagnostics.length}`, 40, y);

  // Divider Line
  y += 12;
  doc.setDrawColor(220, 220, 230);
  doc.setLineWidth(1);
  doc.line(40, y, pageWidth - 40, y);

  // Section 1: Pipeline Summary
  y += 24;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(30, 41, 59);
  doc.text('1. Compilation Pipeline Summary', 40, y);

  y += 14;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(70, 70, 80);

  const phaseCounts: Record<string, number> = {
    lexing: 0,
    parsing: 0,
    semantic: 0,
    optimization: 0,
    assembly: 0,
  };

  diagnostics.forEach((d) => {
    const phase = mapDiagnosticToPhase(d.errorType, d.rawMessage);
    phaseCounts[phase] = (phaseCounts[phase] || 0) + 1;
  });

  const stageText = PIPELINE_STAGES.map((s) => {
    const count = phaseCounts[s.id] || 0;
    return `${s.name}: ${count === 0 ? 'Passed' : `${count} issue(s)`}`;
  }).join('   |   ');

  doc.text(stageText, 40, y);

  // Section 2: Diagnostics Table
  y += 24;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(30, 41, 59);
  doc.text(`2. Flagged Diagnostics (${diagnostics.length})`, 40, y);

  y += 16;

  if (diagnostics.length === 0) {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(9);
    doc.setTextColor(16, 185, 129);
    doc.text('Zero errors detected. All compiler stages completed with exit code 0.', 40, y);
    y += 16;
  } else {
    diagnostics.forEach((d, idx) => {
      if (y > 740) {
        doc.addPage();
        y = 40;
      }

      const phase = mapDiagnosticToPhase(d.errorType, d.rawMessage);
      const isError = d.severity === 'error' || d.severity === 'runtime';

      // Item Box
      doc.setFillColor(isError ? 254 : 255, isError ? 242 : 251, isError ? 242 : 235);
      doc.setDrawColor(isError ? 254 : 251, isError ? 202 : 191, isError ? 202 : 36);
      doc.roundedRect(40, y, pageWidth - 80, humorLevel > 0 ? 54 : 40, 3, 3, 'FD');

      // Line / Col & Severity
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(isError ? 185 : 180, isError ? 28 : 83, isError ? 28 : 9);
      doc.text(
        `#${idx + 1}  Line ${d.line}:${d.column}  [${d.severity.toUpperCase()}]  Phase: ${phase.toUpperCase()}`,
        48,
        y + 14
      );

      // Message
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(40, 40, 40);
      const safeMsg = doc.splitTextToSize(`Message: ${d.message}`, pageWidth - 100);
      doc.text(safeMsg, 48, y + 26);

      // Fix
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(16, 140, 80);
      doc.text(`Actionable Fix: ${d.shortFix}`, 48, y + 36);

      // Humor comment if humorLevel > 0
      if (humorLevel > 0) {
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(8);
        doc.setTextColor(180, 83, 9);
        doc.text(`Witty Note: "${d.funnyJoke}"`, 48, y + 47);
        y += 62;
      } else {
        y += 48;
      }
    });
  }

  // Section 3: Source Code Listing
  if (y > 660) {
    doc.addPage();
    y = 40;
  }

  y += 16;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(30, 41, 59);
  doc.text('3. Source Code (main.cpp)', 40, y);

  y += 14;
  doc.setFont('courier', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(60, 60, 70);

  const codeLines = code.split('\n');
  codeLines.forEach((line, idx) => {
    if (y > 780) {
      doc.addPage();
      y = 40;
    }
    const lineNum = String(idx + 1).padStart(3, ' ');
    doc.text(`${lineNum} | ${line}`, 40, y);
    y += 11;
  });

  // Save PDF
  doc.save('emojicompiler_report.pdf');
}
