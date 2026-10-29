'use client';
// RESPONSIBILITY: Render the members id card generator student id card component within the components feature. It does not own backend persistence or cross-feature business logic.
// RESPONSIBILITY: Render the members id card generator student id card component within the components feature. It does not own backend persistence or cross-feature business logic.
import { useTranslations } from 'next-intl';

import { maskManagerIdCardGeneratorPhone } from '@/app/frontend_manager/manager_members/members_id_card_generator/utils/ManagerMembersIdCardGeneratorUtilities';
import type { ReactElement } from 'react';
import { Phone, Wifi } from 'lucide-react';
import type { IdCardData, ManagerMembersIdCardGeneratorStudentIdCardProps } from '@/app/frontend_manager/manager_members/members_id_card_generator/types/ManagerMembersIdCardGeneratorComponentTypes';
export type { IdCardData, ManagerMembersIdCardGeneratorStudentIdCardProps };




function ManagerMembersIdCardGeneratorBarcodeStripes({ id }: { id: string }) {
  const bars: { width: number; gap: number }[] = [];
  for (let index = 0; index < 28; index += 1) {
    const code = id.charCodeAt(index % id.length) + index * 3;
    bars.push({ width: (code % 3) + 1, gap: (code % 2) + 1 });
  }
  return (
    <svg width="110" height="36" viewBox="0 0 110 36" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {bars.reduce<{ x: number; elements: ReactElement[] }>((result, bar, index) => {
        const element = <rect key={`${id}-barcode-stripe-${index}`} x={result.x} y="0" width={bar.width} height="36" className={index % 5 === 0 ? 'mgr-barcode-primary' : index % 3 === 0 ? 'mgr-barcode-secondary' : 'mgr-barcode-muted'} rx="0.5" />;
        return { x: result.x + bar.width + bar.gap, elements: [...result.elements, element] };
      }, { x: 0, elements: [] }).elements}
    </svg>
  );
}

export default function ManagerMembersIdCardGeneratorStudentIdCard({ data }: ManagerMembersIdCardGeneratorStudentIdCardProps) {
  const tManagerUi = useTranslations('manager.manager_id_card_generator.ui');
  const initials = data.name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();
  const shiftLabels: Record<string, string> = {
    Morning: tManagerUi('shift_morning'),
    Afternoon: tManagerUi('shift_afternoon'),
    Evening: tManagerUi('shift_evening'),
    Night: tManagerUi('shift_night'),
    'Full Day': tManagerUi('shift_full_day'),
  };
  const shiftLabel = shiftLabels[data.shift] ?? data.shift;
  const planLabels: Record<string, string> = {
    Monthly: tManagerUi('plan_monthly'),
    Quarterly: tManagerUi('plan_quarterly'),
    'Half-Yearly': tManagerUi('plan_half_yearly'),
    'Full Academic Year': tManagerUi('plan_full_academic_year'),
  };
  const planLabel = planLabels[data.plan] ?? data.plan;
  return (
    <div className="mgr-idcard-wrap">
      <div className="mgr-idcard" id="student-id-card-print">
        <div className="mgr-idcard-holo-lines" aria-hidden="true" />
        <div className="mgr-idcard-header">
          <div className="mgr-idcard-header-left"><div className="mgr-idcard-logo-icon">📚</div><div><div className="mgr-idcard-logo-text">{tManagerUi('library_os')}</div><div className="mgr-idcard-branch-text">{data.branch ?? tManagerUi('not_provided')}</div></div></div>
          <div className="mgr-idcard-header-right"><Wifi size={18} strokeWidth={2} className="mgr-idcard-muted-icon" /><div className="mgr-idcard-header-chip">{tManagerUi('student_id')}</div></div>
        </div>
        <div className="mgr-idcard-body">
          <div className="mgr-idcard-profile-row">
            <div className="mgr-idcard-photo mgr-idcard-photo--primary"><span className="mgr-idcard-photo-initials">{initials}</span><div className="mgr-idcard-chip"><div className="mgr-idcard-chip-line" /><div className="mgr-idcard-chip-line" /><div className="mgr-idcard-chip-line" /></div></div>
            <div className="mgr-idcard-identity"><p className="mgr-idcard-name">{data.name}</p><span className="mgr-idcard-smartid">#{data.smartId}</span>{data.college && <p className="mgr-idcard-college-name">🎓 {data.college}</p>}<p className="mgr-idcard-phone-row"><Phone size={14} strokeWidth={2} /> {maskManagerIdCardGeneratorPhone(data.phone)}</p></div>
          </div>
          <div className="mgr-idcard-color-bar"><div className="mgr-idcard-color-seg mgr-idcard-color-seg--primary" /><div className="mgr-idcard-color-seg mgr-idcard-color-seg--secondary" /><div className="mgr-idcard-color-seg mgr-idcard-color-seg--info" /><div className="mgr-idcard-color-seg mgr-idcard-color-seg--success" /></div>
          <div className="mgr-idcard-details-grid">
            <div className="mgr-idcard-detail-item mgr-idcard-detail-item--primary"><div className="mgr-idcard-detail-label">{tManagerUi('shift_149b8d')}</div><div className="mgr-idcard-detail-value">{shiftLabel}</div></div>
            <div className="mgr-idcard-detail-item mgr-idcard-detail-item--secondary"><div className="mgr-idcard-detail-label">{tManagerUi('seat')}</div><div className="mgr-idcard-detail-value">{data.seat}</div></div>
            <div className="mgr-idcard-detail-item mgr-idcard-detail-item--info"><div className="mgr-idcard-detail-label">{tManagerUi('plan')}</div><div className="mgr-idcard-detail-value">{planLabel}</div></div>
            <div className="mgr-idcard-detail-item mgr-idcard-detail-item--success"><div className="mgr-idcard-detail-label">{tManagerUi('locker_420c5c')}</div><div className="mgr-idcard-detail-value">{data.locker ? data.locker : tManagerUi('not_provided')}</div></div>
          </div>
          <div className="mgr-idcard-validity-row"><div><div className="mgr-idcard-validity-label">{tManagerUi('valid_from')}</div><div className="mgr-idcard-validity-value">{data.joinDate ?? tManagerUi('not_provided')}</div></div><div className="mgr-idcard-validity-sep">▶</div><div className="mgr-idcard-validity-right"><div className="mgr-idcard-validity-label">{tManagerUi('expires')}</div><div className="mgr-idcard-validity-value mgr-idcard-validity-value--expiry">{data.expiryDate ?? tManagerUi('expiry_date_unavailable_from_student_contract')}</div></div></div>
          <div className="mgr-idcard-bottom-row"><div className="mgr-idcard-qr-wrap"><div className="mgr-idcard-qr mgr-idcard-qr--unavailable" role="img" aria-label={tManagerUi('identity_verification_qr_is_unavailable')}><span aria-hidden="true">—</span></div><span className="mgr-idcard-qr-label">{tManagerUi('verification_unavailable')}</span></div><div className="mgr-idcard-barcode-wrap"><ManagerMembersIdCardGeneratorBarcodeStripes id={data.smartId} /><span className="mgr-idcard-barcode-id">{data.smartId}</span><span className="mgr-idcard-barcode-sub">{tManagerUi('decorative_id_pattern')}</span></div><div className="mgr-idcard-verification-note" role="status"><span className="mgr-idcard-verification-title">{tManagerUi('not_verified')}</span><span className="mgr-idcard-verification-sub">{tManagerUi('verification_integration_unavailable')}</span></div></div>
        </div>
        <div className="mgr-idcard-stripe" aria-hidden="true" />
      </div>
    </div>
  );
}
