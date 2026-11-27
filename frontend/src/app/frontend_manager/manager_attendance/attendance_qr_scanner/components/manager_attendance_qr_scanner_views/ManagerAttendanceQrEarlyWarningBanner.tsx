'use client';

import type { EarlyEntryWarningData } from '@/app/frontend_manager/manager_attendance/attendance_qr_scanner/utils/ManagerAttendanceQrScannerHelpers';
import { ShieldAlert } from 'lucide-react';

interface ManagerAttendanceQrEarlyWarningBannerProps {
  warning: EarlyEntryWarningData;
  onDismiss: () => void;
  onOverride: () => void;
}

export function ManagerAttendanceQrEarlyWarningBanner({
  warning,
  onDismiss,
  onOverride,
}: ManagerAttendanceQrEarlyWarningBannerProps) {
  return (
    <div
      role="alertdialog"
      aria-labelledby="early-entry-title"
      className="p-4 sm:p-5 rounded-2xl border-2 border-rose-500 bg-rose-500/10 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300 space-y-3 motion-safe:animate-in motion-safe:fade-in"
    >
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-xl bg-rose-600 text-white shrink-0">
          <ShieldAlert size={22} />
        </div>
        <div className="flex-1">
          <h3 id="early-entry-title" className="text-base font-extrabold text-rose-600 dark:text-rose-200">
            Early Shift Entry Restriction Detected
          </h3>
          <p className="text-xs text-secondary mt-1">
            Student <strong className="text-primary font-bold">{warning.studentName}</strong> (
            <span className="font-mono">{warning.smartId}</span>) is enrolled in the{' '}
            <strong className="text-primary font-bold">{warning.shiftName} Shift</strong> (
            {warning.shiftWindow}). Current scan recorded at{' '}
            <strong className="text-primary font-bold">{warning.currentTimeStr}</strong> (
            {warning.hoursEarly} hours early).
          </p>
          <p className="text-xs text-rose-600/90 dark:text-rose-400 font-semibold mt-1">
            Entry is locked before the designated shift window to prevent hall overcrowding and protect morning shift seats.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 pt-1 justify-end">
        <button
          type="button"
          onClick={onDismiss}
          className="px-3.5 py-1.5 rounded-xl border border-border bg-card text-xs font-semibold text-secondary hover:text-primary motion-safe:transition-colors cursor-pointer"
        >
          Reject Entry (Keep Gate Closed)
        </button>
        <button
          type="button"
          onClick={onOverride}
          className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold motion-safe:transition-all cursor-pointer shadow-xs"
        >
          Manager Override (Allow Exceptional Entry)
        </button>
      </div>
    </div>
  );
}
