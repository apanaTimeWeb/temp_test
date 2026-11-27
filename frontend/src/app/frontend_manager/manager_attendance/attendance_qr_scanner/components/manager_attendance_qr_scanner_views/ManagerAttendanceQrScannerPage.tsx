'use client';

import { ManagerAttendanceQrCameraPanel } from '@/app/frontend_manager/manager_attendance/attendance_qr_scanner/components/manager_attendance_qr_scanner_views/ManagerAttendanceQrCameraPanel';
import { ManagerAttendanceQrEarlyWarningBanner } from '@/app/frontend_manager/manager_attendance/attendance_qr_scanner/components/manager_attendance_qr_scanner_views/ManagerAttendanceQrEarlyWarningBanner';
import { ManagerAttendanceQrKioskOverlay } from '@/app/frontend_manager/manager_attendance/attendance_qr_scanner/components/manager_attendance_qr_scanner_views/ManagerAttendanceQrKioskOverlay';
import { MANAGER_QR_SCANNER_DEMO_MEMBERS } from '@/app/frontend_manager/manager_attendance/attendance_qr_scanner/config/manager_attendance_qr_scanner.demo_data';
import { MANAGER_ATTENDANCE_QR_SCANNER_ROUTES } from '@/app/frontend_manager/manager_attendance/attendance_qr_scanner/config/manager_attendance_qr_scanner.url_config';
import type { ManagerAttendanceQrScannerMainProps } from '@/app/frontend_manager/manager_attendance/attendance_qr_scanner/types/ManagerAttendanceQrScannerMainTypes';
import {
  evaluateEarlyShiftEntry,
  playKioskBeep,
  STUDENT_SHIFT_SCHEDULE,
  type EarlyEntryWarningData,
  type QrRecentScanLog,
} from '@/app/frontend_manager/manager_attendance/attendance_qr_scanner/utils/ManagerAttendanceQrScannerHelpers';
import { ArrowRightLeft, ChevronRight, Maximize2, Search, UserCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

export type { EarlyEntryWarningData };

export default function ManagerAttendanceQrScannerPage({
  view,
  id,
  smartId,
}: ManagerAttendanceQrScannerMainProps) {
  const tManagerUi = useTranslations('manager.manager_qr_scanner.ui');
  const [manualInput, setManualInput] = useState(smartId || id || '');
  const [isKioskMode, setIsKioskMode] = useState(false);
  const [isUnlockModalOpen, setIsUnlockModalOpen] = useState(false);
  const [unlockPin, setUnlockPin] = useState('');
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [earlyEntryWarning, setEarlyEntryWarning] = useState<EarlyEntryWarningData | null>(null);
  const [recentLog, setRecentLog] = useState<QrRecentScanLog | null>(null);

  const handleManualAction = (action: 'CHECK_IN' | 'CHECK_OUT', overrideEarly = false) => {
    const query = manualInput.trim().toLowerCase();
    if (!query) {
      toast.error('Please enter a student Smart ID, Barcode, or Name.', { id: 'qr-scanner-empty-input' });
      return;
    }

    const matched = MANAGER_QR_SCANNER_DEMO_MEMBERS.find(
      (s) =>
        s.id.toLowerCase() === query ||
        s.name.toLowerCase().includes(query) ||
        s.phone.includes(query)
    );

    const studentName = matched ? matched.name : `Student (${manualInput.trim()})`;
    const resolvedSmartId = matched ? matched.id : manualInput.trim().toUpperCase();
    const seat = matched?.seat || 'Seat A-12';
    const shiftInfo = STUDENT_SHIFT_SCHEDULE[resolvedSmartId];
    const shift = shiftInfo
      ? `${shiftInfo.shiftName} (${shiftInfo.shiftWindow})`
      : matched?.shift || 'Morning (06:00 - 14:00)';
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (action === 'CHECK_IN' && !overrideEarly) {
      const warning = evaluateEarlyShiftEntry(resolvedSmartId, studentName);
      if (warning) {
        if (isSoundEnabled) playKioskBeep('warning');
        setEarlyEntryWarning(warning);
        toast.error(
          `Early Shift Entry Restricted: ${studentName} is assigned to ${warning.shiftName} shift (${warning.shiftWindow}). Scan at ${warning.currentTimeStr} blocked.`,
          { id: `qr-scanner-early-entry-${resolvedSmartId}` }
        );
        return;
      }
    }

    if (isSoundEnabled) playKioskBeep('success');

    setRecentLog({
      studentName,
      smartId: resolvedSmartId,
      seat,
      shift,
      action,
      time,
      warningNote: overrideEarly ? 'Manager Override: Approved Early Entry' : undefined,
    });
    setEarlyEntryWarning(null);
    setManualInput('');

    if (action === 'CHECK_IN') {
      toast.success(`Check-In recorded for ${studentName} (${resolvedSmartId}) at ${time}!`, {
        id: `qr-scanner-checkin-${resolvedSmartId}`,
      });
    } else {
      toast.success(`Check-Out recorded for ${studentName} (${resolvedSmartId}) at ${time}!`, {
        id: `qr-scanner-checkout-${resolvedSmartId}`,
      });
    }
  };

  const handleUnlockKiosk = () => {
    if (unlockPin === '1234') {
      setIsKioskMode(false);
      setIsUnlockModalOpen(false);
      setUnlockPin('');
      toast.success('Kiosk Mode exited successfully.', { id: 'qr-scanner-kiosk-exit' });
    } else {
      toast.error('Incorrect Manager PIN. Kiosk remains locked.', { id: 'qr-scanner-kiosk-wrong-pin' });
    }
  };

  return (
    <div className="eng-page space-y-6" data-route-view={view} data-route-id={id}>
      <div className="eng-breadcrumb">
        <Link href={MANAGER_ATTENDANCE_QR_SCANNER_ROUTES.attendance}>{tManagerUi('engagement')}</Link>
        <ChevronRight size={12} className="eng-breadcrumb-sep" />
        <span>{tManagerUi('qr_scanner')}</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="eng-page-title">{tManagerUi('qr_scanner')}</h1>
          <p className="eng-page-subtitle">
            {tManagerUi('student_qr_verification_requires_a_real_camera_decoder_i_9222b3')}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsKioskMode(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm motion-safe:transition-all cursor-pointer whitespace-nowrap self-start sm:self-auto"
          title="Launch Locked Kiosk Mode for Gate Tablet"
        >
          <Maximize2 size={15} />
          <span>Launch Locked Kiosk Mode</span>
        </button>
      </div>

      {earlyEntryWarning && (
        <ManagerAttendanceQrEarlyWarningBanner
          warning={earlyEntryWarning}
          onDismiss={() => setEarlyEntryWarning(null)}
          onOverride={() => handleManualAction('CHECK_IN', true)}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ManagerAttendanceQrCameraPanel />

        <section className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <UserCheck size={20} className="text-primary" />
                <h2 className="text-base font-bold text-primary">Desk / Barcode Gate Check-In</h2>
              </div>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-success-bg text-success border border-border">
                Live Reception Mode
              </span>
            </div>

            <p className="text-xs text-secondary">
              Use this counter console when the camera hardware is offline, or when scanning students via USB handheld barcode reader or manual Smart ID lookup.
            </p>

            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="text-secondary font-medium">Quick Test:</span>
              <button
                type="button"
                onClick={() => setManualInput('LIB-001')}
                className="px-2 py-1 rounded-lg bg-surface-highlight border border-border hover:bg-surface-hover text-secondary hover:text-primary motion-safe:transition-colors cursor-pointer"
              >
                Morning: Rahul (LIB-001)
              </button>
              <button
                type="button"
                onClick={() => setManualInput('LIB-005')}
                className="px-2 py-1 rounded-lg bg-surface-highlight border border-border hover:bg-surface-hover text-secondary hover:text-primary motion-safe:transition-colors cursor-pointer"
              >
                Evening: Vikas (LIB-005)
              </button>
            </div>

            <div className="space-y-2">
              <label htmlFor="manual-scan-input" className="text-xs font-semibold text-primary block">
                Enter Smart ID / Scan Barcode / Student Name *
              </label>
              <div className="relative">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
                <input
                  maxLength={30}
                  id="manual-scan-input"
                  type="text"
                  placeholder="e.g. LIB-001, Rahul Sharma, 9876543210..."
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleManualAction('CHECK_IN');
                    }
                  }}
                  className="mgr-input pl-9 text-xs w-full font-mono"
                  autoFocus
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => handleManualAction('CHECK_IN')}
                className="mgr-btn-primary text-xs py-2.5 flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
              >
                <UserCheck size={15} /> Verify Check-In
              </button>
              <button
                type="button"
                onClick={() => handleManualAction('CHECK_OUT')}
                className="mgr-btn-outline text-xs py-2.5 flex items-center justify-center gap-1.5 hover:border-danger hover:text-danger cursor-pointer"
              >
                <ArrowRightLeft size={15} /> Record Check-Out
              </button>
            </div>
          </div>

          {recentLog && (
            <div className="mt-6 p-4 rounded-xl border border-border bg-surface-highlight space-y-2 motion-safe:animate-scale-up">
              <div className="flex items-center justify-between">
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    recentLog.action === 'CHECK_IN'
                      ? 'bg-success-bg text-success'
                      : 'bg-warning-bg text-warning-text'
                  } border border-border`}
                >
                  {recentLog.action === 'CHECK_IN' ? '✓ GATE CHECK-IN VERIFIED' : '✓ GATE CHECK-OUT LOGGED'}
                </span>
                <span className="text-xs text-secondary font-mono">{recentLog.time}</span>
              </div>
              <p className="text-sm font-bold text-primary">{recentLog.studentName}</p>
              {recentLog.warningNote && (
                <p className="text-[11px] font-semibold text-amber-500">{recentLog.warningNote}</p>
              )}
              <div className="grid grid-cols-2 gap-2 text-xs text-secondary font-mono pt-1">
                <span>Smart ID: <strong className="text-primary">{recentLog.smartId}</strong></span>
                <span>Seat: <strong className="text-primary">{recentLog.seat}</strong></span>
              </div>
            </div>
          )}
        </section>
      </div>

      {isKioskMode && (
        <ManagerAttendanceQrKioskOverlay
          manualInput={manualInput}
          onManualInputChange={setManualInput}
          isSoundEnabled={isSoundEnabled}
          onToggleSound={() => setIsSoundEnabled((prev) => !prev)}
          isUnlockModalOpen={isUnlockModalOpen}
          onOpenUnlockModal={() => setIsUnlockModalOpen(true)}
          onCloseUnlockModal={() => {
            setIsUnlockModalOpen(false);
            setUnlockPin('');
          }}
          unlockPin={unlockPin}
          onUnlockPinChange={setUnlockPin}
          onUnlockKiosk={handleUnlockKiosk}
          earlyEntryWarning={earlyEntryWarning}
          onDismissWarning={() => setEarlyEntryWarning(null)}
          recentLog={recentLog}
          onAction={handleManualAction}
        />
      )}
    </div>
  );
}
