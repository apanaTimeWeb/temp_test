'use client';
// RESPONSIBILITY: Modal dialog providing 5 export modes (Excel, PDF, CSV, Print, Download).

import React from 'react';
import { X, FileSpreadsheet, FileText, Printer, Download, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import type { PlatformReportTableRecord, PlatformReportsOverviewData } from '../types/SuperadminAnalyticsPlatformReportsTypes';
import {
  exportPlatformRecordsAsCsv,
  exportPlatformRecordsAsExcel,
  downloadPlatformReportJson,
} from '../utils/SuperadminAnalyticsPlatformReportsFormatters';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  records: PlatformReportTableRecord[];
  overviewData?: PlatformReportsOverviewData;
}

export function SuperadminAnalyticsPlatformReportsExportModal({
  isOpen,
  onClose,
  records,
  overviewData,
}: Props) {
  if (!isOpen) return null;

  const handleExcelExport = () => {
    exportPlatformRecordsAsExcel(records, `platform_reports_${new Date().toISOString().slice(0, 10)}.xls`);
    toast.success('Excel report generated and downloaded', { id: 'export-excel-platform' });
    onClose();
  };

  const handleCsvExport = () => {
    exportPlatformRecordsAsCsv(records, `platform_reports_${new Date().toISOString().slice(0, 10)}.csv`);
    toast.success('CSV report generated and downloaded', { id: 'export-csv-platform' });
    onClose();
  };

  const handlePrint = () => {
    toast.info('Opening print dialog...', { id: 'print-platform' });
    window.print();
    onClose();
  };

  const handlePdfExport = () => {
    toast.info('Preparing formatted PDF document...', { id: 'pdf-platform' });
    window.print();
    onClose();
  };

  const handleJsonDownload = () => {
    if (overviewData) {
      downloadPlatformReportJson(overviewData, `platform_summary_${new Date().toISOString().slice(0, 10)}.json`);
      toast.success('Full platform summary dataset downloaded', { id: 'download-json-platform' });
    } else {
      exportPlatformRecordsAsCsv(records, `platform_data_${new Date().toISOString().slice(0, 10)}.csv`);
      toast.success('Platform dataset downloaded', { id: 'download-csv-platform' });
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="export-platform-title"
    >
      <div className="w-full max-w-lg p-6 rounded-2xl border border-border bg-card shadow-xl space-y-5 animate-in fade-in-50 zoom-in-95">
        <div className="flex items-center justify-between border-b border-border/40 pb-3">
          <div>
            <h2 id="export-platform-title" className="text-base font-bold text-foreground">
              Export & Download Platform Reports
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Target dataset: {records.length} filtered library accounts
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
            className="flex items-center gap-3 p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 text-left transition-all cursor-pointer group active:scale-95"
          >
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:scale-105 transition-transform">
              <FileSpreadsheet size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">Excel Export</p>
              <p className="text-[11px] text-muted-foreground">Formatted .xlsx/.xls workbook</p>
            </div>
          </button>

          {/* 2. CSV Export */}
          <button
            type="button"
            onClick={handleCsvExport}
            className="flex items-center gap-3 p-3.5 rounded-xl border border-sky-500/20 bg-sky-500/5 hover:bg-sky-500/10 text-left transition-all cursor-pointer group active:scale-95"
          >
            <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400 group-hover:scale-105 transition-transform">
              <FileText size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">CSV Export</p>
              <p className="text-[11px] text-muted-foreground">Standard delimiter raw data</p>
            </div>
          </button>

          {/* 3. PDF Export */}
          <button
            type="button"
            onClick={handlePdfExport}
            className="flex items-center gap-3 p-3.5 rounded-xl border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10 text-left transition-all cursor-pointer group active:scale-95"
          >
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 group-hover:scale-105 transition-transform">
              <FileText size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">PDF Document</p>
              <p className="text-[11px] text-muted-foreground">Formatted report layout</p>
            </div>
          </button>

          {/* 4. Print */}
          <button
            type="button"
            onClick={handlePrint}
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
