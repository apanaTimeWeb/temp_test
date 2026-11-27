'use client';

import { CameraOff, QrCode } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function ManagerAttendanceQrCameraPanel() {
  const tManagerUi = useTranslations('manager.manager_qr_scanner.ui');

  return (
    <section className="eng-card" aria-labelledby="manager-engagement-qr-unavailable-title">
      <div className="eng-card-header">
        <div>
          <h2 className="eng-card-title text-base font-bold text-primary" id="manager-engagement-qr-unavailable-title">
            {tManagerUi('camera_and_qr_decoding_unavailable')}
          </h2>
          <p className="eng-card-desc text-xs text-secondary">
            {tManagerUi('connect_an_approved_camera_qr_decoder_and_verify_the_dec_1aa5be')}
          </p>
        </div>
        <CameraOff size={22} className="text-secondary" aria-hidden="true" />
      </div>

      <div className="eng-qr-viewport mt-4" aria-disabled="true" data-testid="manager-engagement-qr-camera-unavailable">
        <div className="eng-qr-feed">
          <div className="eng-qr-feed-icon">
            <QrCode size={38} aria-hidden="true" />
          </div>
          <p className="eng-qr-feed-label font-bold text-primary">{tManagerUi('live_scanning_not_connected')}</p>
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
  );
}
