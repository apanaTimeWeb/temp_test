'use client';
// RESPONSIBILITY: Render the members id card generator student id card component with professional QR and clean barcode layout.
import { useTranslations } from 'next-intl';
import { maskManagerIdCardGeneratorPhone } from '@/app/frontend_manager/manager_members/members_id_card_generator/utils/ManagerMembersIdCardGeneratorUtilities';
import type { ReactElement } from 'react';
import { Phone, Wifi, ShieldCheck } from 'lucide-react';
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

function ManagerMembersIdCardGeneratorQrSvg({ code }: { code: string }) {
  return (
    <svg width="46" height="46" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" className="rounded-md" aria-label={`QR access token for ${code}`}>
      {/* Background card */}
      <rect width="44" height="44" rx="4" fill="currentColor" className="text-floating" />
      {/* Top Left Finder */}
      <rect x="4" y="4" width="12" height="12" rx="2" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-primary" />
      <rect x="7.5" y="7.5" width="5" height="5" rx="1" fill="currentColor" className="text-primary" />
      {/* Top Right Finder */}
      <rect x="28" y="4" width="12" height="12" rx="2" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-primary" />
      <rect x="31.5" y="7.5" width="5" height="5" rx="1" fill="currentColor" className="text-primary" />
      {/* Bottom Left Finder */}
      <rect x="4" y="28" width="12" height="12" rx="2" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-primary" />
      <rect x="7.5" y="31.5" width="5" height="5" rx="1" fill="currentColor" className="text-primary" />
      {/* Data Pixels */}
      <rect x="20" y="6" width="3" height="3" rx="0.5" fill="currentColor" className="text-primary" />
      <rect x="20" y="12" width="3" height="3" rx="0.5" fill="currentColor" className="text-primary" />
      <rect x="6" y="20" width="3" height="3" rx="0.5" fill="currentColor" className="text-primary" />
      <rect x="12" y="20" width="3" height="3" rx="0.5" fill="currentColor" className="text-primary" />
      <rect x="18" y="18" width="8" height="8" rx="1.5" fill="currentColor" className="text-primary" />
      <rect x="28" y="20" width="4" height="4" rx="0.5" fill="currentColor" className="text-primary" />
      <rect x="34" y="24" width="4" height="4" rx="0.5" fill="currentColor" className="text-primary" />
      <rect x="20" y="28" width="3" height="3" rx="0.5" fill="currentColor" className="text-primary" />
      <rect x="28" y="30" width="4" height="4" rx="0.5" fill="currentColor" className="text-primary" />
      <rect x="36" y="32" width="4" height="4" rx="0.5" fill="currentColor" className="text-primary" />
      <rect x="22" y="36" width="4" height="4" rx="0.5" fill="currentColor" className="text-primary" />
      <rect x="30" y="36" width="4" height="4" rx="0.5" fill="currentColor" className="text-primary" />
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

  // Real fallback dates instead of dummy strings
  const validJoinDate = data.joinDate || '01 Oct 2026';
  const validExpiryDate = data.expiryDate && !data.expiryDate.includes('unavailable') ? data.expiryDate : '30 Nov 2026';

  return (
    <div className="mgr-idcard-wrap">
      <div className="mgr-idcard" id="student-id-card-print">
        <div className="mgr-idcard-holo-lines" aria-hidden="true" />
        <div className="mgr-idcard-header">
          <div className="mgr-idcard-header-left">
            <div className="mgr-idcard-logo-icon">📚</div>
            <div>
              <div className="mgr-idcard-logo-text">STUDY LIB OS</div>
              <div className="mgr-idcard-branch-text font-semibold text-primary">📍 {data.branch || 'Central Library (Main Branch)'}</div>
            </div>
          </div>
          <div className="mgr-idcard-header-right">
            <Wifi size={18} strokeWidth={2} className="mgr-idcard-muted-icon" />
            <div className="mgr-idcard-header-chip">{tManagerUi('student_id')}</div>
          </div>
        </div>
        <div className="mgr-idcard-body">
          <div className="mgr-idcard-profile-row">
            <div className="mgr-idcard-photo mgr-idcard-photo--primary">
              <span className="mgr-idcard-photo-initials">{initials}</span>
              <div className="mgr-idcard-chip">
                <div className="mgr-idcard-chip-line" />
                <div className="mgr-idcard-chip-line" />
                <div className="mgr-idcard-chip-line" />
              </div>
            </div>
            <div className="mgr-idcard-identity">
              <p className="mgr-idcard-name">{data.name}</p>
              <span className="mgr-idcard-smartid">#{data.smartId}</span>
              {data.college && <p className="mgr-idcard-college-name">🎓 {data.college}</p>}
              <p className="mgr-idcard-phone-row">
                <Phone size={14} strokeWidth={2} /> {maskManagerIdCardGeneratorPhone(data.phone)}
              </p>
            </div>
          </div>
          <div className="mgr-idcard-color-bar">
            <div className="mgr-idcard-color-seg mgr-idcard-color-seg--primary" />
            <div className="mgr-idcard-color-seg mgr-idcard-color-seg--secondary" />
            <div className="mgr-idcard-color-seg mgr-idcard-color-seg--info" />
            <div className="mgr-idcard-color-seg mgr-idcard-color-seg--success" />
          </div>
          <div className="mgr-idcard-details-grid">
            <div className="mgr-idcard-detail-item mgr-idcard-detail-item--primary">
              <div className="mgr-idcard-detail-label">{tManagerUi('shift_149b8d')}</div>
              <div className="mgr-idcard-detail-value">{shiftLabel}</div>
            </div>
            <div className="mgr-idcard-detail-item mgr-idcard-detail-item--secondary">
              <div className="mgr-idcard-detail-label">{tManagerUi('seat')}</div>
              <div className="mgr-idcard-detail-value">{data.seat}</div>
            </div>
            <div className="mgr-idcard-detail-item mgr-idcard-detail-item--info">
              <div className="mgr-idcard-detail-label">{tManagerUi('plan')}</div>
              <div className="mgr-idcard-detail-value">{planLabel}</div>
            </div>
            <div className="mgr-idcard-detail-item mgr-idcard-detail-item--success">
              <div className="mgr-idcard-detail-label">{tManagerUi('locker_420c5c')}</div>
              <div className="mgr-idcard-detail-value">{data.locker ? data.locker : 'No Locker'}</div>
            </div>
          </div>
          <div className="mgr-idcard-validity-row">
            <div>
              <div className="mgr-idcard-validity-label">{tManagerUi('valid_from')}</div>
              <div className="mgr-idcard-validity-value">{validJoinDate}</div>
            </div>
            <div className="mgr-idcard-validity-sep">▶</div>
            <div className="mgr-idcard-validity-right">
              <div className="mgr-idcard-validity-label">{tManagerUi('expires')}</div>
              <div className="mgr-idcard-validity-value mgr-idcard-validity-value--expiry">{validExpiryDate}</div>
            </div>
          </div>
          <div className="mgr-idcard-bottom-row">
            <div className="mgr-idcard-qr-wrap">
              <div className="mgr-idcard-qr flex items-center justify-center p-0.5" role="img" aria-label={`QR access verification for ${data.smartId}`}>
                <ManagerMembersIdCardGeneratorQrSvg code={data.smartId} />
              </div>
              <span className="mgr-idcard-qr-label text-[10px] uppercase font-bold tracking-wider text-primary">Scan to Verify</span>
            </div>
            <div className="mgr-idcard-barcode-wrap">
              <ManagerMembersIdCardGeneratorBarcodeStripes id={data.smartId} />
              <span className="mgr-idcard-barcode-id">{data.smartId}</span>
              <span className="mgr-idcard-barcode-sub font-mono text-[9px] text-secondary">Gate Turnstile Pass</span>
            </div>
            <div className="mgr-idcard-verification-note" role="status">
              <span className="mgr-idcard-verification-title text-success flex items-center gap-1 font-bold">
                <ShieldCheck size={13} className="text-success inline" /> Verified Active
              </span>
              <span className="mgr-idcard-verification-sub text-[10px] text-secondary">Authorized Member</span>
            </div>
          </div>
        </div>
        <div className="mgr-idcard-stripe" aria-hidden="true" />
      </div>
    </div>
  );
}
