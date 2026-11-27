'use client';

import type {
  EarlyEntryWarningData,
  QrRecentScanLog,
} from '@/app/frontend_manager/manager_attendance/attendance_qr_scanner/utils/ManagerAttendanceQrScannerHelpers';
import { Lock, QrCode, ShieldAlert, Volume2, VolumeX, X } from 'lucide-react';

interface ManagerAttendanceQrKioskOverlayProps {
  manualInput: string;
  onManualInputChange: (val: string) => void;
  isSoundEnabled: boolean;
  onToggleSound: () => void;
  isUnlockModalOpen: boolean;
  onOpenUnlockModal: () => void;
  onCloseUnlockModal: () => void;
  unlockPin: string;
  onUnlockPinChange: (val: string) => void;
  onUnlockKiosk: () => void;
  earlyEntryWarning: EarlyEntryWarningData | null;
  onDismissWarning: () => void;
  recentLog: QrRecentScanLog | null;
  onAction: (action: 'CHECK_IN' | 'CHECK_OUT', overrideEarly?: boolean) => void;
}

export function ManagerAttendanceQrKioskOverlay({
  manualInput,
  onManualInputChange,
  isSoundEnabled,
  onToggleSound,
  isUnlockModalOpen,
  onOpenUnlockModal,
  onCloseUnlockModal,
  unlockPin,
  onUnlockPinChange,
  onUnlockKiosk,
  earlyEntryWarning,
  onDismissWarning,
  recentLog,
  onAction,
}: ManagerAttendanceQrKioskOverlayProps) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Locked Kiosk Scanner Screen"
      className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col justify-between p-6 sm:p-10 select-none overflow-y-auto"
    >
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-bold">
            <QrCode size={22} />
          </div>
          <div>
            <h2 className="text-lg font-black tracking-tight text-white">Central Library Entrance Gate</h2>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 motion-safe:animate-pulse" />
              <span>Kiosk Tablet Mode Active (Locked)</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleSound}
            className="p-2.5 rounded-xl border border-slate-800 bg-slate-900 text-slate-300 hover:text-white cursor-pointer"
            title={isSoundEnabled ? 'Mute Scan Sound' : 'Enable Scan Sound'}
          >
            {isSoundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>

          <button
            type="button"
            onClick={onOpenUnlockModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white cursor-pointer motion-safe:transition-colors"
            title="Unlock Kiosk Mode (Manager PIN Required)"
          >
            <Lock size={14} />
            <span>Exit Kiosk</span>
          </button>
        </div>
      </div>

      <div className="my-auto flex flex-col items-center justify-center text-center py-6 space-y-6">
        <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-3xl border-2 border-emerald-500/60 bg-slate-900/90 shadow-2xl shadow-emerald-500/10 flex flex-col items-center justify-center overflow-hidden">
          <div className="absolute inset-x-0 h-1 bg-emerald-400 shadow-lg shadow-emerald-400/80 motion-safe:animate-pulse top-1/2 -translate-y-1/2" />
          <QrCode size={64} className="text-emerald-500/40 mb-3" />
          <p className="text-sm font-bold text-slate-200">Point QR Code or Tap Card</p>
          <p className="text-xs text-slate-400 mt-1 max-w-[200px]">Keep Smart ID steady within the scanner frame</p>
          <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-emerald-400" />
          <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-emerald-400" />
          <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-emerald-400" />
          <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-emerald-400" />
        </div>

        <div className="w-full max-w-sm space-y-2">
          <input
            maxLength={30}
            id="kiosk-barcode-input"
            type="text"
            placeholder="Scan Card / Enter Smart ID..."
            value={manualInput}
            onChange={(e) => onManualInputChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                onAction('CHECK_IN');
              }
            }}
            className="w-full text-center text-sm font-mono px-4 py-3 rounded-2xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 outline-none focus:border-emerald-500"
            autoFocus
          />

          <div className="flex items-center justify-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => onAction('CHECK_IN')}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold motion-safe:transition-all cursor-pointer shadow-md"
            >
              Simulate QR Scan (Check-In)
            </button>
            <button
              type="button"
              onClick={() => onAction('CHECK_OUT')}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold motion-safe:transition-all cursor-pointer"
            >
              Check-Out
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 pt-2 text-xs">
            <button
              type="button"
              onClick={() => onManualInputChange('LIB-001')}
              className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white cursor-pointer"
            >
              Morning: Rahul (LIB-001)
            </button>
            <button
              type="button"
              onClick={() => onManualInputChange('LIB-005')}
              className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white cursor-pointer"
            >
              Evening: Vikas (LIB-005)
            </button>
          </div>
        </div>

        {earlyEntryWarning && (
          <div className="w-full max-w-lg p-5 rounded-2xl bg-rose-950/80 border-2 border-rose-500 text-left space-y-3 shadow-2xl motion-safe:animate-in motion-safe:zoom-in-95">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-rose-600 text-white shrink-0">
                <ShieldAlert size={26} />
              </div>
              <div>
                <h4 className="text-lg font-black text-white">⛔ ENTRY RESTRICTED: Early Shift Scan</h4>
                <p className="text-xs text-rose-200 mt-1">
                  Student <strong>{earlyEntryWarning.studentName}</strong> ({earlyEntryWarning.smartId}) is enrolled in{' '}
                  <strong>{earlyEntryWarning.shiftName} Shift</strong> ({earlyEntryWarning.shiftWindow}). Scan recorded at{' '}
                  <strong>{earlyEntryWarning.currentTimeStr}</strong>.
                </p>
                <p className="text-xs text-rose-300 font-bold mt-1">
                  Hall gate locked. Early entry is restricted before the designated shift window.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onDismissWarning}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white cursor-pointer"
              >
                Dismiss / Keep Gate Locked
              </button>
              <button
                type="button"
                onClick={() => onAction('CHECK_IN', true)}
                className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white cursor-pointer"
              >
                Manager Override
              </button>
            </div>
          </div>
        )}

        {recentLog && !earlyEntryWarning && (
          <div className="w-full max-w-md p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500 text-left space-y-1.5 shadow-xl motion-safe:animate-in motion-safe:zoom-in-95">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                {recentLog.action === 'CHECK_IN' ? '✓ GATE OPENED: CHECK-IN' : '✓ GATE OPENED: CHECK-OUT'}
              </span>
              <span className="text-xs text-slate-400 font-mono">{recentLog.time}</span>
            </div>
            <h4 className="text-base font-bold text-white">{recentLog.studentName}</h4>
            <div className="flex items-center gap-4 text-xs text-slate-300 font-mono">
              <span>ID: <strong className="text-emerald-400">{recentLog.smartId}</strong></span>
              <span>Seat: <strong className="text-emerald-400">{recentLog.seat}</strong></span>
              <span>Shift: <strong className="text-emerald-400">{recentLog.shift.split(' ')[0]}</strong></span>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 border-t border-slate-800/80 pt-4">
        <span>Central Library Attendance Turnstile System</span>
        <span>Gate Hardware Decoder Connected · Sound Beep Enabled</span>
      </div>

      {isUnlockModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="unlock-kiosk-title"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="w-full max-w-xs rounded-2xl bg-slate-900 border border-slate-700 p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 id="unlock-kiosk-title" className="text-sm font-bold text-white flex items-center gap-2">
                <Lock size={16} className="text-emerald-400" />
                Admin Unlock PIN
              </h3>
              <button type="button" onClick={onCloseUnlockModal} className="text-slate-400 hover:text-white cursor-pointer">
                <X size={16} />
              </button>
            </div>
            <p className="text-xs text-slate-400">Enter Manager PIN to unlock tablet and exit kiosk mode (Default: 1234).</p>
            <input
              maxLength={30}
              id="manager-kiosk-unlock-pin"
              type="password"
              placeholder="Enter PIN (1234)"
              value={unlockPin}
              onChange={(e) => onUnlockPinChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  onUnlockKiosk();
                }
              }}
              className="w-full text-center text-lg tracking-widest font-mono py-2 rounded-xl bg-slate-800 border border-slate-600 text-white outline-none focus:border-emerald-500"
              autoFocus
            />
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onCloseUnlockModal}
                className="flex-1 py-2 text-xs font-semibold rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onUnlockKiosk}
                className="flex-1 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer"
              >
                Unlock
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
