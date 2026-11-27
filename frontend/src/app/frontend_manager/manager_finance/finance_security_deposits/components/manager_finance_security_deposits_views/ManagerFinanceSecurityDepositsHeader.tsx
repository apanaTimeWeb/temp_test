'use client';

import { Download, Printer } from 'lucide-react';

interface ManagerFinanceSecurityDepositsHeaderProps {
  title: string;
  subtitle: string;
  onExportCsv: () => void;
  onPrint: () => void;
}

export default function ManagerFinanceSecurityDepositsHeader({
  title,
  subtitle,
  onExportCsv,
  onPrint,
}: ManagerFinanceSecurityDepositsHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-4 flex-wrap">
      <div>
        <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
          <h1 className="fin-page-title">{title}</h1>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-500 motion-safe:animate-pulse" />
            Active Deposits Desk
          </span>
        </div>
        <p className="fin-page-subtitle">{subtitle}</p>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <button
          type="button"
          onClick={onExportCsv}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-card hover:bg-surface-hover text-primary border border-border shadow-xs cursor-pointer motion-safe:transition-all focus-visible:ring-2 focus-visible:ring-primary outline-none"
          title="Export filtered security deposits to CSV spreadsheet"
        >
          <Download size={13} className="text-secondary" />
          <span>Export CSV</span>
        </button>
        <button
          type="button"
          onClick={onPrint}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-card hover:bg-surface-hover text-primary border border-border shadow-xs cursor-pointer motion-safe:transition-all focus-visible:ring-2 focus-visible:ring-primary outline-none"
          title="Print or Save as PDF"
        >
          <Printer size={13} className="text-secondary" />
          <span>Print / PDF</span>
        </button>
      </div>
    </div>
  );
}
