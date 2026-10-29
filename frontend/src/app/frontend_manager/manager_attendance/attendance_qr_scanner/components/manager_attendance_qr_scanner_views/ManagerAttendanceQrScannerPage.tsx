'use client';
import type { ManagerAttendanceQrScannerMainProps } from '@/app/frontend_manager/manager_attendance/attendance_qr_scanner/types/ManagerAttendanceQrScannerMainTypes';
import { useTranslations } from 'next-intl';

import Link from 'next/link';
import { CameraOff, ChevronRight, QrCode } from 'lucide-react';
import { MANAGER_ATTENDANCE_QR_SCANNER_ROUTES } from '@/app/frontend_manager/manager_attendance/attendance_qr_scanner/config/manager_attendance_qr_scanner.url_config';

// RESPONSIBILITY: Render the attendance_qr_scanner feature while preserving supported deep-link query state.
// DATA FLOW: Route searchParams -> Main props -> this view's route context.
export default function ManagerAttendanceQrScannerPage({ view, id, name, phone, smartId }: ManagerAttendanceQrScannerMainProps) {
  const tManagerUi = useTranslations('manager.manager_qr_scanner.ui');
  return (
    <div className="eng-page" data-route-view={view} data-route-id={id} data-route-name={name} data-route-phone={phone} data-route-smart-id={smartId}>
      <div className="eng-breadcrumb">
        <Link href={MANAGER_ATTENDANCE_QR_SCANNER_ROUTES.attendance}>{tManagerUi('engagement')}</Link>
        <ChevronRight size={12} className="eng-breadcrumb-sep" />
        <span>{tManagerUi('qr_scanner')}</span>
      </div>

      <div className="eng-page-header">
        <h1 className="eng-page-title">{tManagerUi('qr_scanner')}</h1>
        <p className="eng-page-subtitle">{tManagerUi('student_qr_verification_requires_a_real_camera_decoder_i_9222b3')}</p>
        <p className="eng-input-hint eng-text-warning" data-testid="manager-engagement-attendance-contract-warning" role="status">
          {tManagerUi('scanning_is_unavailable_in_this_supplied_frontend_snapsh_df2a0c')}
        </p>
      </div>

      <div className="eng-qr-page">
        <section className="eng-card eng-mb-4" aria-labelledby="manager-engagement-qr-unavailable-title">
          <div className="eng-card-header">
            <div>
              <h2 className="eng-card-title" id="manager-engagement-qr-unavailable-title">{tManagerUi('camera_and_qr_decoding_unavailable')}</h2>
              <p className="eng-card-desc">{tManagerUi('connect_an_approved_camera_qr_decoder_and_verify_the_dec_1aa5be')}</p>
            </div>
            <CameraOff size={22} aria-hidden="true" />
          </div>

          <div className="eng-qr-viewport" aria-disabled="true" data-testid="manager-engagement-qr-camera-unavailable">
            <div className="eng-qr-feed">
              <div className="eng-qr-feed-icon"><QrCode size={38} aria-hidden="true" /></div>
              <p className="eng-qr-feed-label">{tManagerUi('live_scanning_not_connected')}</p>
              <p className="eng-qr-feed-hint">{tManagerUi('no_scan_will_be_reported_until_real_decoding_is_availabl_7ccc37')}</p>
            </div>
            <div className="eng-corner eng-corner--tl" aria-hidden="true" />
            <div className="eng-corner eng-corner--tr" aria-hidden="true" />
            <div className="eng-corner eng-corner--bl" aria-hidden="true" />
            <div className="eng-corner eng-corner--br" aria-hidden="true" />
          </div>

          <button type="button" disabled title={tManagerUi('camera_qr_decoding_integration_and_authoritative_student_20eab2')} className="eng-btn eng-btn--primary eng-qr-start-btn cursor-not-allowed" data-testid="manager-engagement-qr-start-disabled">
            {tManagerUi('start_scanning_unavailable')}
          </button>
        </section>
      </div>
    </div>
  );
}
