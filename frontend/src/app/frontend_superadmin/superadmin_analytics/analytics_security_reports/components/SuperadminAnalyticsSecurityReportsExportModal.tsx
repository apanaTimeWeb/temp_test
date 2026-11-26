'use client';
// RESPONSIBILITY: Modal dialog providing 5 export modes (Excel, PDF, CSV, Print, Download) for Security Reports.

import React from 'react';
import { X, FileSpreadsheet, FileText, Printer, Download } from 'lucide-react';
import { toast } from 'sonner';
import type { SecurityReportTableRecord, SecurityReportsOverviewData } from '@/app/frontend_superadmin/superadmin_analytics/analytics_security_reports/types/SuperadminAnalyticsSecurityReportsTypes';
import {
  exportSecurityRecordsAsCsv,
  exportSecurityRecordsAsExcel,
  downloadSecurityReportJson,
  printSecurityReportsRoster,
} from '@/app/frontend_superadmin/superadmin_analytics/analytics_security_reports/utils/SuperadminAnalyticsSecurityReportsFormatters';

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
    printSecurityReportsRoster(records);
    onClose();
  };

  const handlePdfExport = () => {
    toast.info('Preparing formatted PDF document for security audit...', { id: 'pdf-security' });
    printSecurityReportsRoster(records);
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="export-security-title"
      data-testid="security-reports-export-modal"
    >
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 rounded-3xl border border-indigo-500/30 bg-[#0a0d24]/95 text-white shadow-2xl shadow-indigo-950/60 backdrop-blur-xl space-y-5 animate-in fade-in-50 zoom-in-95">
        <div className="flex items-center justify-between border-b border-indigo-500/20 pb-3">
          <div>
            <h2 id="export-security-title" className="text-base font-bold text-white tracking-tight">
              Export & Download Security Audit Reports
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Target dataset: <span className="text-rose-400 font-semibold">{records.length}</span> security events & anomalies
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.08] cursor-pointer transition-colors"
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
            className="flex items-center gap-3 p-3.5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-left motion-safe:transition-all cursor-pointer group active:scale-95 shadow-xs"
          >
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 group-hover:scale-105 transition-transform">
              <FileSpreadsheet size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Excel Export</p>
              <p className="text-[11px] text-slate-400">Formatted audit log workbook</p>
            </div>
          </button>

          {/* 2. CSV Export */}
          <button
            type="button"
            onClick={handleCsvExport}
            data-testid="security-export-csv-btn"
            className="flex items-center gap-3 p-3.5 rounded-2xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-left motion-safe:transition-all cursor-pointer group active:scale-95 shadow-xs"
          >
            <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 group-hover:scale-105 transition-transform">
              <FileText size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-white">CSV Export</p>
              <p className="text-[11px] text-slate-400">Raw security log values</p>
            </div>
          </button>

          {/* 3. PDF Export */}
          <button
            type="button"
            onClick={handlePdfExport}
            data-testid="security-export-pdf-btn"
            className="flex items-center gap-3 p-3.5 rounded-2xl border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 text-left motion-safe:transition-all cursor-pointer group active:scale-95 shadow-xs"
          >
            <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400 group-hover:scale-105 transition-transform">
              <FileText size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-white">PDF Document</p>
              <p className="text-[11px] text-slate-400">Compliance audit report view</p>
            </div>
          </button>

          {/* 4. Print */}
          <button
            type="button"
            onClick={handlePrint}
            data-testid="security-export-print-btn"
            className="flex items-center gap-3 p-3.5 rounded-2xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-left motion-safe:transition-all cursor-pointer group active:scale-95 shadow-xs"
          >
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 group-hover:scale-105 transition-transform">
              <Printer size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Print View</p>
              <p className="text-[11px] text-slate-400">Direct printer output</p>
            </div>
          </button>
        </div>

        {/* 5. Download Raw JSON */}
        <div className="border-t border-indigo-500/20 pt-4 flex items-center justify-between">
          <button
            type="button"
            onClick={handleJsonDownload}
            data-testid="security-export-download-btn"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 hover:text-white motion-safe:transition-all cursor-pointer shadow-xs active:scale-95"
          >
            <Download size={14} />
            <span>Download Raw Dataset</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-indigo-500/20 cursor-pointer motion-safe:transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
