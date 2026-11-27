'use client';

import { ButtonLoader } from '@/app/frontend_manager/components/ManagerLoader';
import { Download, Printer, RefreshCw } from 'lucide-react';

interface ManagerAttendanceDailyHeaderBannerProps {
  title: string;
  subtitle: string;
  isSyncing: boolean;
  onSync: () => void;
  onExportCsv: () => void;
  onPrint: () => void;
}

export function ManagerAttendanceDailyHeaderBanner({
  title,
  subtitle,
  isSyncing,
  onSync,
  onExportCsv,
  onPrint,
}: ManagerAttendanceDailyHeaderBannerProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-xs">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-primary">{title}</h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-500 motion-safe:animate-pulse" />
              Live Attendance Desk
            </span>
          </div>
          <p className="text-sm text-secondary mt-1">{subtitle}</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
          <button
            type="button"
            onClick={onSync}
            disabled={isSyncing}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl border border-border bg-card text-xs font-semibold text-secondary hover:text-primary hover:border-primary hover:bg-surface-hover motion-safe:transition-all shadow-2xs active:scale-95 disabled:opacity-60 cursor-pointer flex-1 sm:flex-initial"
            title="Sync Biometric Turnstiles"
          >
            {isSyncing ? <ButtonLoader icon="calendar-check" /> : <RefreshCw size={14} className="text-primary" />}
            <span>{isSyncing ? 'Syncing...' : 'Sync Turnstiles'}</span>
          </button>
          <button
            type="button"
            onClick={onExportCsv}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-card hover:bg-surface-hover hover:border-primary text-secondary hover:text-primary border border-border shadow-2xs cursor-pointer motion-safe:transition-all active:scale-95 flex-1 sm:flex-initial"
            title="Export Attendance Register CSV"
          >
            <Download size={14} className="text-secondary" />
            <span>Export CSV</span>
          </button>
          <button
            type="button"
            onClick={onPrint}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-card hover:bg-surface-hover hover:border-primary text-secondary hover:text-primary border border-border shadow-2xs cursor-pointer motion-safe:transition-all active:scale-95 flex-1 sm:flex-initial"
            title="Print Daily Attendance Register"
          >
            <Printer size={14} className="text-secondary" />
            <span>Print / PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
}
