'use client';
// RESPONSIBILITY: Modal dialog providing 5 export modes (Excel, PDF, CSV, Print, Download) for Billing Reports.

import React from 'react';
import { X, FileSpreadsheet, FileText, Printer, Download } from 'lucide-react';
import { toast } from 'sonner';
import type { BillingReportTableRecord, BillingReportsOverviewData } from '../types/SuperadminAnalyticsBillingReportsTypes';
import {
  exportBillingRecordsAsCsv,
  exportBillingRecordsAsExcel,
  downloadBillingReportJson,
  printBillingReportsRoster,
} from '../utils/SuperadminAnalyticsBillingReportsFormatters';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  records: BillingReportTableRecord[];
  overviewData?: BillingReportsOverviewData;
}

export function SuperadminAnalyticsBillingReportsExportModal({
  isOpen,
  onClose,
  records,
  overviewData,
}: Props) {
  if (!isOpen) return null;

  const handleExcelExport = () => {
    exportBillingRecordsAsExcel(records, `billing_reports_${new Date().toISOString().slice(0, 10)}.xls`);
    toast.success('Excel billing report generated and downloaded', { id: 'export-excel-billing' });
    onClose();
  };

  const handleCsvExport = () => {
    exportBillingRecordsAsCsv(records, `billing_reports_${new Date().toISOString().slice(0, 10)}.csv`);
    toast.success('CSV billing report generated and downloaded', { id: 'export-csv-billing' });
    onClose();
  };

  const handlePrint = () => {
    toast.info('Opening print dialog for billing reports...', { id: 'print-billing' });
    printBillingReportsRoster(records);
    onClose();
  };

  const handlePdfExport = () => {
    toast.info('Preparing formatted PDF billing report...', { id: 'pdf-billing' });
    printBillingReportsRoster(records);
    onClose();
  };

  const handleJsonDownload = () => {
    if (overviewData) {
      downloadBillingReportJson(overviewData, `billing_summary_${new Date().toISOString().slice(0, 10)}.json`);
      toast.success('Full financial summary dataset downloaded', { id: 'download-json-billing' });
    } else {
      exportBillingRecordsAsCsv(records, `billing_data_${new Date().toISOString().slice(0, 10)}.csv`);
      toast.success('Billing records dataset downloaded', { id: 'download-csv-billing' });
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="export-billing-title"
      data-testid="billing-reports-export-modal"
    >
      <div className="w-full max-w-lg p-6 rounded-3xl border border-indigo-500/30 bg-[#0a0d24]/95 text-white shadow-2xl shadow-indigo-950/60 backdrop-blur-xl space-y-5 animate-in fade-in-50 zoom-in-95">
        <div className="flex items-center justify-between border-b border-indigo-500/20 pb-3">
          <div>
            <h2 id="export-billing-title" className="text-base font-bold text-white tracking-tight">
              Export & Download Billing Reports
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Target financial records: <span className="text-amber-400 font-semibold">{records.length}</span> invoices / transactions
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
            data-testid="billing-export-excel-btn"
            className="flex items-center gap-3 p-3.5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-left transition-all cursor-pointer group active:scale-95 shadow-xs"
          >
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 group-hover:scale-105 transition-transform">
              <FileSpreadsheet size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Excel Export</p>
              <p className="text-[11px] text-slate-400">Formatted .xlsx / .xls sheets</p>
            </div>
          </button>

          {/* 2. CSV Export */}
          <button
            type="button"
            onClick={handleCsvExport}
            data-testid="billing-export-csv-btn"
            className="flex items-center gap-3 p-3.5 rounded-2xl border border-sky-500/30 bg-sky-500/10 hover:bg-sky-500/20 text-left transition-all cursor-pointer group active:scale-95 shadow-xs"
          >
            <div className="p-2.5 rounded-xl bg-sky-500/20 text-sky-400 group-hover:scale-105 transition-transform">
              <FileText size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-white">CSV Export</p>
              <p className="text-[11px] text-slate-400">Standard delimiter raw records</p>
            </div>
          </button>

          {/* 3. PDF Export */}
          <button
            type="button"
            onClick={handlePdfExport}
            data-testid="billing-export-pdf-btn"
            className="flex items-center gap-3 p-3.5 rounded-2xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-left transition-all cursor-pointer group active:scale-95 shadow-xs"
          >
            <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 group-hover:scale-105 transition-transform">
              <FileText size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-white">PDF Document</p>
              <p className="text-[11px] text-slate-400">Printable financial summary</p>
            </div>
          </button>

          {/* 4. Print */}
          <button
            type="button"
            onClick={handlePrint}
            data-testid="billing-export-print-btn"
            className="flex items-center gap-3 p-3.5 rounded-2xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-left transition-all cursor-pointer group active:scale-95 shadow-xs"
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
            data-testid="billing-export-download-btn"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 hover:text-white transition-all cursor-pointer shadow-xs active:scale-95"
          >
            <Download size={14} />
            <span>Download Raw Dataset</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-indigo-500/20 cursor-pointer transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
