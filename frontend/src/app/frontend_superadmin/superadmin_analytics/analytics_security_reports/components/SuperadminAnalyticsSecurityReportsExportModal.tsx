'use client';
// RESPONSIBILITY: Modal dialog providing 5 export modes (Excel, PDF, CSV, Print, Download) for Security Reports.

import React from 'react';
import { X, FileSpreadsheet, FileText, Printer, Download } from 'lucide-react';
import { toast } from 'sonner';
import type { SecurityReportTableRecord, SecurityReportsOverviewData } from '../types/SuperadminAnalyticsSecurityReportsTypes';
import {
  exportSecurityRecordsAsCsv,
  exportSecurityRecordsAsExcel,
  downloadSecurityReportJson,
} from '../utils/SuperadminAnalyticsSecurityReportsFormatters';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  records: SecurityReportTableRecord[];
  overviewData?: SecurityReportsOverviewData;
}

export function SuperadminAnalyticsSecurityReportsExportModal({
  isOpen,
  onClose,
  records,
  overviewData,
}: Props) {
  if (!isOpen) return null;

  const handleExcelExport = () => {
    exportSecurityRecordsAsExcel(records, `security_audit_report_${new Date().toISOString().slice(0, 10)}.xls`);
    toast.success('Excel security audit report generated and downloaded', { id: 'export-excel-security' });
    onClose();
  };

  const handleCsvExport = () => {
    exportSecurityRecordsAsCsv(records, `security_audit_report_${new Date().toISOString().slice(0, 10)}.csv`);
    toast.success('CSV security audit report generated and downloaded', { id: 'export-csv-security' });
    onClose();
  };

  const handlePrint = () => {
    toast.info('Opening print dialog for security audit reports...', { id: 'print-security' });
    window.print();
    onClose();
  };

  const handlePdfExport = () => {
    toast.info('Preparing formatted PDF document for security audit...', { id: 'pdf-security' });
    window.print();
    onClose();
  };

  const handleJsonDownload = () => {
    if (overviewData) {
      downloadSecurityReportJson(overviewData, `security_audit_summary_${new Date().toISOString().slice(0, 10)}.json`);
      toast.success('Full security overview JSON downloaded', { id: 'download-json-security' });
    } else {
      exportSecurityRecordsAsCsv(records, `security_audit_data_${new Date().toISOString().slice(0, 10)}.csv`);
      toast.success('Security audit dataset downloaded', { id: 'download-csv-security' });
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="export-security-title"
      data-testid="security-reports-export-modal"
    >
      <div className="w-full max-w-lg p-6 rounded-2xl border border-border bg-card shadow-xl space-y-5 animate-in fade-in-50 zoom-in-95">
        <div className="flex items-center justify-between border-b border-border/40 pb-3">
          <div>
            <h2 id="export-security-title" className="text-base font-bold text-foreground">
              Export & Download Security Audit Reports
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Target dataset: {records.length} security events & anomalies
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
            aria-label="Close export modal"
          >
            <X size={18} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* 1. Excel Export */}
          <button
            type="button"
            onClick={handleExcelExport}
            data-testid="security-export-excel-btn"
            className="flex items-center gap-3 p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 text-left transition-all cursor-pointer group active:scale-95"
          >
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:scale-105 transition-transform">
              <FileSpreadsheet size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">Excel Export</p>
              <p className="text-[11px] text-muted-foreground">Formatted audit log workbook</p>
            </div>
          </button>

          {/* 2. CSV Export */}
          <button
            type="button"
            onClick={handleCsvExport}
            data-testid="security-export-csv-btn"
            className="flex items-center gap-3 p-3.5 rounded-xl border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10 text-left transition-all cursor-pointer group active:scale-95"
          >
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 group-hover:scale-105 transition-transform">
              <FileText size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">CSV Export</p>
              <p className="text-[11px] text-muted-foreground">Raw security log values</p>
            </div>
          </button>

          {/* 3. PDF Export */}
          <button
            type="button"
            onClick={handlePdfExport}
            data-testid="security-export-pdf-btn"
            className="flex items-center gap-3 p-3.5 rounded-xl border border-purple-500/20 bg-purple-500/5 hover:bg-purple-500/10 text-left transition-all cursor-pointer group active:scale-95"
          >
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 group-hover:scale-105 transition-transform">
              <FileText size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">PDF Document</p>
              <p className="text-[11px] text-muted-foreground">Compliance audit report view</p>
            </div>
          </button>

          {/* 4. Print */}
          <button
            type="button"
            onClick={handlePrint}
            data-testid="security-export-print-btn"
            className="flex items-center gap-3 p-3.5 rounded-xl border border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/10 text-left transition-all cursor-pointer group active:scale-95"
          >
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 group-hover:scale-105 transition-transform">
              <Printer size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">Print View</p>
              <p className="text-[11px] text-muted-foreground">Direct printer output</p>
            </div>
          </button>
        </div>

        {/* 5. Download Raw JSON */}
        <div className="border-t border-border/40 pt-4 flex items-center justify-between">
          <button
            type="button"
            onClick={handleJsonDownload}
            data-testid="security-export-download-btn"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border border-border bg-background hover:bg-muted text-foreground transition-all cursor-pointer active:scale-95"
          >
            <Download size={14} />
            <span>Download Full JSON Summary</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
