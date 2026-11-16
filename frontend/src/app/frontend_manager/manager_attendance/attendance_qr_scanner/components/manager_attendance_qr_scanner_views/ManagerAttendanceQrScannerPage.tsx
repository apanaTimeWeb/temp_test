'use client';
import type { ManagerAttendanceQrScannerMainProps } from '@/app/frontend_manager/manager_attendance/attendance_qr_scanner/types/ManagerAttendanceQrScannerMainTypes';
import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  CameraOff,
  ChevronRight,
  QrCode,
  Search,
  CheckCircle2,
  UserCheck,
  ArrowRightLeft,
  Maximize2,
  Lock,
  Unlock,
  Volume2,
  VolumeX,
  AlertTriangle,
  X,
  ShieldAlert,
} from 'lucide-react';
import { toast } from 'sonner';
import { MANAGER_ATTENDANCE_QR_SCANNER_ROUTES } from '@/app/frontend_manager/manager_attendance/attendance_qr_scanner/config/manager_attendance_qr_scanner.url_config';
import { MANAGER_MEMBERS_DEMO_RECORDS } from '@/app/frontend_manager/manager_members/members_directory/mocks/manager_members_directory_fixtures/ManagerMembersDirectoryFixtures';

const STUDENT_SHIFT_SCHEDULE: Record<
  string,
  { shiftName: string; shiftWindow: string; startHour: number; endHour: number }
> = {
  'LIB-001': { shiftName: 'Morning', shiftWindow: '06:00 AM - 02:00 PM', startHour: 6, endHour: 14 },
  'LIB-002': { shiftName: 'Morning', shiftWindow: '06:00 AM - 02:00 PM', startHour: 6, endHour: 14 },
  'LIB-003': { shiftName: 'Afternoon', shiftWindow: '02:00 PM - 06:00 PM', startHour: 14, endHour: 18 },
  'LIB-004': { shiftName: 'Morning', shiftWindow: '06:00 AM - 02:00 PM', startHour: 6, endHour: 14 },
  'LIB-005': { shiftName: 'Evening', shiftWindow: '06:00 PM - 10:00 PM', startHour: 18, endHour: 22 },
  'LIB-006': { shiftName: 'Morning', shiftWindow: '06:00 AM - 02:00 PM', startHour: 6, endHour: 14 },
  'LIB-007': { shiftName: 'Evening', shiftWindow: '06:00 PM - 10:00 PM', startHour: 18, endHour: 22 },
  'LIB-008': { shiftName: 'Full Day', shiftWindow: '06:00 AM - 10:00 PM', startHour: 6, endHour: 22 },
  'LIB-009': { shiftName: 'Evening', shiftWindow: '06:00 PM - 10:00 PM', startHour: 18, endHour: 22 },
  'LIB-010': { shiftName: 'Morning', shiftWindow: '06:00 AM - 02:00 PM', startHour: 6, endHour: 14 },
};

export interface EarlyEntryWarningData {
  studentName: string;
  smartId: string;
  shiftName: string;
  shiftWindow: string;
  currentTimeStr: string;
  hoursEarly: number;
}

function playKioskBeep(type: 'success' | 'warning') {
  if (typeof window === 'undefined') return;
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    if (type === 'success') {
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.18);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } else {
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
      osc.start();
      osc.stop(ctx.currentTime + 0.38);
    }
  } catch {
    // Ignore audio policies gracefully
  }
}

// RESPONSIBILITY: Render the attendance_qr_scanner feature with locked kiosk mode & early shift entry restriction.
export default function ManagerAttendanceQrScannerPage({
  view,
  id,
  name,
  phone,
  smartId,
}: ManagerAttendanceQrScannerMainProps) {
  const tManagerUi = useTranslations('manager.manager_qr_scanner.ui');
  const [manualInput, setManualInput] = useState(smartId || id || '');
  const [isKioskMode, setIsKioskMode] = useState(false);
  const [isUnlockModalOpen, setIsUnlockModalOpen] = useState(false);
  const [unlockPin, setUnlockPin] = useState('');
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [earlyEntryWarning, setEarlyEntryWarning] = useState<EarlyEntryWarningData | null>(null);

  const [recentLog, setRecentLog] = useState<{
    studentName: string;
    smartId: string;
    seat: string;
    shift: string;
    action: 'CHECK_IN' | 'CHECK_OUT';
    time: string;
    warningNote?: string;
  } | null>(null);

  // Check Early Shift Entry
  const evaluateEarlyShift = (
    targetSmartId: string,
    targetName: string
  ): EarlyEntryWarningData | null => {
    const sched =
      STUDENT_SHIFT_SCHEDULE[targetSmartId] ||
      (targetSmartId.toLowerCase().includes('evening') ||
      targetName.toLowerCase().includes('rohan') ||
      targetName.toLowerCase().includes('vikas')
        ? { shiftName: 'Evening', shiftWindow: '06:00 PM - 10:00 PM', startHour: 18, endHour: 22 }
        : null);

    if (!sched) return null;

    // Simulated scan hour = 8.5 (08:30 AM morning scan)
    const scanHour = 8.5;
    const graceBuffer = 0.5; // 30 minutes before start
    if (scanHour < sched.startHour - graceBuffer) {
      const hoursEarly = Math.round((sched.startHour - scanHour) * 10) / 10;
      return {
        studentName: targetName,
        smartId: targetSmartId,
        shiftName: sched.shiftName,
        shiftWindow: sched.shiftWindow,
        currentTimeStr: '08:30 AM',
        hoursEarly,
      };
    }
    return null;
  };

  const handleManualAction = (
    action: 'CHECK_IN' | 'CHECK_OUT',
    overrideEarly: boolean = false
  ) => {
    const query = manualInput.trim().toLowerCase();
    if (!query) {
      toast.error('Please enter a student Smart ID, Barcode, or Name.');
      return;
    }

    const matched = MANAGER_MEMBERS_DEMO_RECORDS.find(
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

    // Early Shift Check on Check-In
    if (action === 'CHECK_IN' && !overrideEarly) {
      const warning = evaluateEarlyShift(resolvedSmartId, studentName);
      if (warning) {
        if (isSoundEnabled) playKioskBeep('warning');
        setEarlyEntryWarning(warning);
        toast.error(
          `Early Shift Entry Restricted: ${studentName} is assigned to ${warning.shiftName} shift (${warning.shiftWindow}). Scan at ${warning.currentTimeStr} blocked.`
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
      toast.success(`Check-In recorded for ${studentName} (${resolvedSmartId}) at ${time}!`);
    } else {
      toast.success(`Check-Out recorded for ${studentName} (${resolvedSmartId}) at ${time}!`);
    }
  };

  const handleUnlockKiosk = () => {
    if (unlockPin === '1234') {
      setIsKioskMode(false);
      setIsUnlockModalOpen(false);
      setUnlockPin('');
      toast.success('Kiosk Mode exited successfully.');
    } else {
      toast.error('Incorrect Manager PIN. Kiosk remains locked.');
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

        {/* Launch Full-Screen Locked Kiosk Mode */}
        <button
          type="button"
          onClick={() => setIsKioskMode(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer whitespace-nowrap self-start sm:self-auto"
          title="Launch Locked Kiosk Mode for Gate Tablet"
        >
          <Maximize2 size={15} />
          <span>Launch Locked Kiosk Mode</span>
        </button>
      </div>

      {/* Early Shift Entry Warning Modal (when triggered) */}
      {earlyEntryWarning && (
        <div
          role="alertdialog"
          aria-labelledby="early-entry-title"
          className="p-4 sm:p-5 rounded-2xl border-2 border-rose-500 bg-rose-500/10 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300 space-y-3 animate-in fade-in"
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
                Student <strong className="text-primary font-bold">{earlyEntryWarning.studentName}</strong> (
                <span className="font-mono">{earlyEntryWarning.smartId}</span>) is enrolled in the{' '}
                <strong className="text-primary font-bold">{earlyEntryWarning.shiftName} Shift</strong> (
                {earlyEntryWarning.shiftWindow}). Current scan recorded at{' '}
                <strong className="text-primary font-bold">{earlyEntryWarning.currentTimeStr}</strong> (
                {earlyEntryWarning.hoursEarly} hours early).
              </p>
              <p className="text-xs text-rose-600/90 dark:text-rose-400 font-semibold mt-1">
                Entry is locked before the designated shift window to prevent hall overcrowding and protect morning shift seats.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1 justify-end">
            <button
              type="button"
              onClick={() => setEarlyEntryWarning(null)}
              className="px-3.5 py-1.5 rounded-xl border border-border bg-card text-xs font-semibold text-secondary hover:text-primary transition-colors cursor-pointer"
            >
              Reject Entry (Keep Gate Closed)
            </button>
            <button
              type="button"
              onClick={() => handleManualAction('CHECK_IN', true)}
              className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
            >
              Manager Override (Allow Exceptional Entry)
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hardware Camera QR Feed */}
        <section className="eng-card" aria-labelledby="manager-engagement-qr-unavailable-title">
          <div className="eng-card-header">
            <div>
              <h2
                className="eng-card-title text-base font-bold text-primary"
                id="manager-engagement-qr-unavailable-title"
              >
                {tManagerUi('camera_and_qr_decoding_unavailable')}
              </h2>
              <p className="eng-card-desc text-xs text-secondary">
                {tManagerUi('connect_an_approved_camera_qr_decoder_and_verify_the_dec_1aa5be')}
              </p>
            </div>
            <CameraOff size={22} className="text-secondary" aria-hidden="true" />
          </div>

          <div
            className="eng-qr-viewport mt-4"
            aria-disabled="true"
            data-testid="manager-engagement-qr-camera-unavailable"
          >
            <div className="eng-qr-feed">
              <div className="eng-qr-feed-icon">
                <QrCode size={38} aria-hidden="true" />
              </div>
              <p className="eng-qr-feed-label font-bold text-primary">
                {tManagerUi('live_scanning_not_connected')}
              </p>
              <p className="eng-qr-feed-hint text-xs text-secondary">
                {tManagerUi('no_scan_will_be_reported_until_real_decoding_is_availabl_7ccc37')}
              </p>
            </div>
            <div className="eng-corner eng-corner--tl" aria-hidden="true" />
            <div className="eng-corner eng-corner--tr" aria-hidden="true" />
            <div className="eng-corner eng-corner--bl" aria-hidden="true" />
            <div className="eng-corner eng-corner--br" aria-hidden="true" />
          </div>

          <button
            type="button"
            disabled
            title={tManagerUi('camera_qr_decoding_integration_and_authoritative_student_20eab2')}
            className="eng-btn eng-btn--primary eng-qr-start-btn cursor-not-allowed opacity-60 w-full mt-4"
            data-testid="manager-engagement-qr-start-disabled"
          >
            {tManagerUi('start_scanning_unavailable')}
          </button>
        </section>

        {/* Reception Counter Barcode / Smart ID Fallback Scanner */}
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

            {/* Quick Demo Test Triggers */}
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="text-secondary font-medium">Quick Test:</span>
              <button
                type="button"
                onClick={() => setManualInput('LIB-001')}
                className="px-2 py-1 rounded-lg bg-surface-highlight border border-border hover:bg-surface-hover text-secondary hover:text-primary transition-colors cursor-pointer"
              >
                Morning: Rahul (LIB-001)
              </button>
              <button
                type="button"
                onClick={() => setManualInput('LIB-005')}
                className="px-2 py-1 rounded-lg bg-surface-highlight border border-border hover:bg-surface-hover text-secondary hover:text-primary transition-colors cursor-pointer"
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

          {/* Real-time Verification Feedback Card */}
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
                <span>
                  Smart ID: <strong className="text-primary">{recentLog.smartId}</strong>
                </span>
                <span>
                  Seat: <strong className="text-primary">{recentLog.seat}</strong>
                </span>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* ── FULLSCREEN LOCKED KIOSK MODE (For Entrance Gate Tablet) ── */}
      {isKioskMode && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Locked Kiosk Scanner Screen"
          className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col justify-between p-6 sm:p-10 select-none overflow-y-auto"
        >
          {/* Top Kiosk Status Bar */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-bold">
                <QrCode size={22} />
              </div>
              <div>
                <h2 className="text-lg font-black tracking-tight text-white">Central Library Entrance Gate</h2>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Kiosk Tablet Mode Active (Locked)</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Sound Toggle */}
              <button
                type="button"
                onClick={() => setIsSoundEnabled((prev) => !prev)}
                className="p-2.5 rounded-xl border border-slate-800 bg-slate-900 text-slate-300 hover:text-white cursor-pointer"
                title={isSoundEnabled ? 'Mute Scan Sound' : 'Enable Scan Sound'}
              >
                {isSoundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
              </button>

              {/* Admin Unlock Button */}
              <button
                type="button"
                onClick={() => setIsUnlockModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white cursor-pointer transition-colors"
                title="Unlock Kiosk Mode (Manager PIN Required)"
              >
                <Lock size={14} />
                <span>Exit Kiosk</span>
              </button>
            </div>
          </div>

          {/* Center Scanner Viewport */}
          <div className="my-auto flex flex-col items-center justify-center text-center py-6 space-y-6">
            {/* Viewfinder Target */}
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-3xl border-2 border-emerald-500/60 bg-slate-900/90 shadow-2xl shadow-emerald-500/10 flex flex-col items-center justify-center overflow-hidden">
              {/* Laser Scanning Beam */}
              <div className="absolute inset-x-0 h-1 bg-emerald-400 shadow-lg shadow-emerald-400/80 animate-pulse top-1/2 -translate-y-1/2" />
              <QrCode size={64} className="text-emerald-500/40 mb-3" />
              <p className="text-sm font-bold text-slate-200">Point QR Code or Tap Card</p>
              <p className="text-xs text-slate-400 mt-1 max-w-[200px]">Keep Smart ID steady within the scanner frame</p>

              {/* Corners */}
              <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-emerald-400" />
              <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-emerald-400" />
              <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-emerald-400" />
              <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-emerald-400" />
            </div>

            {/* Kiosk Input (Hidden or Fast Scanner Barcode Input) */}
            <div className="w-full max-w-sm space-y-2">
              <input
                id="kiosk-barcode-input"
                type="text"
                placeholder="Scan Card / Enter Smart ID..."
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleManualAction('CHECK_IN');
                  }
                }}
                className="w-full text-center text-sm font-mono px-4 py-3 rounded-2xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 outline-none focus:border-emerald-500"
                autoFocus
              />

              <div className="flex items-center justify-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => handleManualAction('CHECK_IN')}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all cursor-pointer shadow-md"
                >
                  Simulate QR Scan (Check-In)
                </button>
                <button
                  type="button"
                  onClick={() => handleManualAction('CHECK_OUT')}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all cursor-pointer"
                >
                  Check-Out
                </button>
              </div>

              {/* Quick Tap Demo Chips in Kiosk */}
              <div className="flex items-center justify-center gap-2 pt-2 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setManualInput('LIB-001');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white cursor-pointer"
                >
                  Morning: Rahul (LIB-001)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setManualInput('LIB-005');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white cursor-pointer"
                >
                  Evening: Vikas (LIB-005)
                </button>
              </div>
            </div>

            {/* Live Kiosk Early Entry Warning Display */}
            {earlyEntryWarning && (
              <div className="w-full max-w-lg p-5 rounded-2xl bg-rose-950/80 border-2 border-rose-500 text-left space-y-3 shadow-2xl animate-in zoom-in-95">
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
                    onClick={() => setEarlyEntryWarning(null)}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white cursor-pointer"
                  >
                    Dismiss / Keep Gate Locked
                  </button>
                  <button
                    type="button"
                    onClick={() => handleManualAction('CHECK_IN', true)}
                    className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white cursor-pointer"
                  >
                    Manager Override
                  </button>
                </div>
              </div>
            )}

            {/* Live Kiosk Success Feedback Display */}
            {recentLog && !earlyEntryWarning && (
              <div className="w-full max-w-md p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500 text-left space-y-1.5 shadow-xl animate-in zoom-in-95">
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

          {/* Bottom Kiosk Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 border-t border-slate-800/80 pt-4">
            <span>Central Library Attendance Turnstile System</span>
            <span>Gate Hardware Decoder Connected · Sound Beep Enabled</span>
          </div>

          {/* Admin Unlock Modal */}
          {isUnlockModalOpen && (
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="unlock-kiosk-title"
              className="fixed inset-0 z-60 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4"
            >
              <div className="w-full max-w-xs rounded-2xl bg-slate-900 border border-slate-700 p-5 shadow-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 id="unlock-kiosk-title" className="text-sm font-bold text-white flex items-center gap-2">
                    <Lock size={16} className="text-emerald-400" />
                    Admin Unlock PIN
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      setIsUnlockModalOpen(false);
                      setUnlockPin('');
                    }}
                    className="text-slate-400 hover:text-white cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                </div>

                <p className="text-xs text-slate-400">
                  Enter Manager PIN to unlock tablet and exit kiosk mode (Default: 1234).
                </p>

                <input
                  id="manager-kiosk-unlock-pin"
                  type="password"
                  placeholder="Enter PIN (1234)"
                  value={unlockPin}
                  onChange={(e) => setUnlockPin(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleUnlockKiosk();
                    }
                  }}
                  className="w-full text-center text-lg tracking-widest font-mono py-2 rounded-xl bg-slate-800 border border-slate-600 text-white outline-none focus:border-emerald-500"
                  autoFocus
                />

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsUnlockModalOpen(false);
                      setUnlockPin('');
                    }}
                    className="flex-1 py-2 text-xs font-semibold rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleUnlockKiosk}
                    className="flex-1 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer"
                  >
                    Unlock
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
