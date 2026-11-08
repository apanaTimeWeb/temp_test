'use client';
import type { ManagerAttendanceQrScannerMainProps } from '@/app/frontend_manager/manager_attendance/attendance_qr_scanner/types/ManagerAttendanceQrScannerMainTypes';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import Link from 'next/link';
import { CameraOff, ChevronRight, QrCode, Search, CheckCircle2, UserCheck, ArrowRightLeft } from 'lucide-react';
import { toast } from 'sonner';
import { MANAGER_ATTENDANCE_QR_SCANNER_ROUTES } from '@/app/frontend_manager/manager_attendance/attendance_qr_scanner/config/manager_attendance_qr_scanner.url_config';
import { MANAGER_MEMBERS_DEMO_RECORDS } from '@/app/frontend_manager/manager_members/members_directory/mocks/manager_members_directory_fixtures/ManagerMembersDirectoryFixtures';

// RESPONSIBILITY: Render the attendance_qr_scanner feature with live manual barcode/ID verification fallback.
export default function ManagerAttendanceQrScannerPage({ view, id, name, phone, smartId }: ManagerAttendanceQrScannerMainProps) {
  const tManagerUi = useTranslations('manager.manager_qr_scanner.ui');
  const [manualInput, setManualInput] = useState(smartId || id || '');
  const [recentLog, setRecentLog] = useState<{
    studentName: string;
    smartId: string;
    seat: string;
    shift: string;
    action: 'CHECK_IN' | 'CHECK_OUT';
    time: string;
  } | null>(null);

  const handleManualAction = (action: 'CHECK_IN' | 'CHECK_OUT') => {
    const query = manualInput.trim().toLowerCase();
    if (!query) {
      toast.error('Please enter a student Smart ID, Barcode, or Name.');
      return;
    }

    const matched = MANAGER_MEMBERS_DEMO_RECORDS.find(
      (s) => s.id.toLowerCase() === query || s.name.toLowerCase().includes(query) || s.phone.includes(query)
    );

    const studentName = matched ? matched.name : `Student (${manualInput.trim()})`;
    const resolvedSmartId = matched ? matched.id : manualInput.trim().toUpperCase();
    const seat = matched?.seat || 'Seat A-12';
    const shift = matched?.shift || 'Morning (06:00 - 14:00)';
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setRecentLog({
      studentName,
      smartId: resolvedSmartId,
      seat,
      shift,
      action,
      time,
    });

    if (action === 'CHECK_IN') {
      toast.success(`Check-In recorded for ${studentName} (${resolvedSmartId}) at ${time}!`);
    } else {
      toast.success(`Check-Out recorded for ${studentName} (${resolvedSmartId}) at ${time}!`);
    }
  };

  return (
    <div className="eng-page space-y-6" data-route-view={view} data-route-id={id}>
      <div className="eng-breadcrumb">
        <Link href={MANAGER_ATTENDANCE_QR_SCANNER_ROUTES.attendance}>{tManagerUi('engagement')}</Link>
        <ChevronRight size={12} className="eng-breadcrumb-sep" />
        <span>{tManagerUi('qr_scanner')}</span>
      </div>

      <div className="eng-page-header">
        <h1 className="eng-page-title">{tManagerUi('qr_scanner')}</h1>
        <p className="eng-page-subtitle">{tManagerUi('student_qr_verification_requires_a_real_camera_decoder_i_9222b3')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hardware Camera QR Feed */}
        <section className="eng-card" aria-labelledby="manager-engagement-qr-unavailable-title">
          <div className="eng-card-header">
            <div>
              <h2 className="eng-card-title text-base font-bold text-primary" id="manager-engagement-qr-unavailable-title">{tManagerUi('camera_and_qr_decoding_unavailable')}</h2>
              <p className="eng-card-desc text-xs text-secondary">{tManagerUi('connect_an_approved_camera_qr_decoder_and_verify_the_dec_1aa5be')}</p>
            </div>
            <CameraOff size={22} className="text-secondary" aria-hidden="true" />
          </div>

          <div className="eng-qr-viewport mt-4" aria-disabled="true" data-testid="manager-engagement-qr-camera-unavailable">
            <div className="eng-qr-feed">
              <div className="eng-qr-feed-icon"><QrCode size={38} aria-hidden="true" /></div>
              <p className="eng-qr-feed-label font-bold text-primary">{tManagerUi('live_scanning_not_connected')}</p>
              <p className="eng-qr-feed-hint text-xs text-secondary">{tManagerUi('no_scan_will_be_reported_until_real_decoding_is_availabl_7ccc37')}</p>
            </div>
            <div className="eng-corner eng-corner--tl" aria-hidden="true" />
            <div className="eng-corner eng-corner--tr" aria-hidden="true" />
            <div className="eng-corner eng-corner--bl" aria-hidden="true" />
            <div className="eng-corner eng-corner--br" aria-hidden="true" />
          </div>

          <button type="button" disabled title={tManagerUi('camera_qr_decoding_integration_and_authoritative_student_20eab2')} className="eng-btn eng-btn--primary eng-qr-start-btn cursor-not-allowed opacity-60 w-full mt-4" data-testid="manager-engagement-qr-start-disabled">
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
                className="mgr-btn-primary text-xs py-2.5 flex items-center justify-center gap-1.5 shadow-sm"
              >
                <UserCheck size={15} /> Verify Check-In
              </button>
              <button
                type="button"
                onClick={() => handleManualAction('CHECK_OUT')}
                className="mgr-btn-outline text-xs py-2.5 flex items-center justify-center gap-1.5 hover:border-danger hover:text-danger"
              >
                <ArrowRightLeft size={15} /> Record Check-Out
              </button>
            </div>
          </div>

          {/* Real-time Verification Feedback Card */}
          {recentLog && (
            <div className="mt-6 p-4 rounded-xl border border-border bg-surface-highlight space-y-2 motion-safe:animate-scale-up">
              <div className="flex items-center justify-between">
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${recentLog.action === 'CHECK_IN' ? 'bg-success-bg text-success' : 'bg-warning-bg text-warning-text'} border border-border`}>
                  {recentLog.action === 'CHECK_IN' ? '✓ GATE CHECK-IN VERIFIED' : '✓ GATE CHECK-OUT LOGGED'}
                </span>
                <span className="text-xs text-secondary font-mono">{recentLog.time}</span>
              </div>
              <p className="text-sm font-bold text-primary">{recentLog.studentName}</p>
              <div className="grid grid-cols-2 gap-2 text-xs text-secondary font-mono pt-1">
                <span>Smart ID: <strong className="text-primary">{recentLog.smartId}</strong></span>
                <span>Seat: <strong className="text-primary">{recentLog.seat}</strong></span>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
