'use client';
// RESPONSIBILITY: Render the members id card generator student id card component with premium frontend card UI, clean barcode layout, and back side support.
import { ManagerMembersIdCardGeneratorBarcodeStripes, ManagerMembersIdCardGeneratorQrSvg } from '@/app/frontend_manager/manager_members/members_id_card_generator/components/manager_members_id_card_generator_sections/ManagerMembersIdCardGeneratorQrSvgs';
import { ManagerMembersIdCardGeneratorStudentIdCardBack } from '@/app/frontend_manager/manager_members/members_id_card_generator/components/manager_members_id_card_generator_sections/ManagerMembersIdCardGeneratorStudentIdCardBack';
import type {
  IdCardData,
  IdCardSide,
  ManagerMembersIdCardGeneratorStudentIdCardProps,
} from '@/app/frontend_manager/manager_members/members_id_card_generator/types/ManagerMembersIdCardGeneratorComponentTypes';
import { CreditCard, RotateCw } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

export type { IdCardData, IdCardSide, ManagerMembersIdCardGeneratorStudentIdCardProps };

function maskCardPhone(phone?: string | null): string {
  if (!phone) return '—';
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 4) return phone;
  return '••••••' + digits.slice(-4);
}

export default function ManagerMembersIdCardGeneratorStudentIdCard({
  data,
  side = 'front',
  onSideChange,
  scale = '133',
}: ManagerMembersIdCardGeneratorStudentIdCardProps) {
  const [internalSide, setInternalSide] = useState<IdCardSide>(side);

  useEffect(() => {
    setInternalSide(side);
  }, [side]);

  const handleSideSelect = (newSide: IdCardSide) => {
    setInternalSide(newSide);
    onSideChange?.(newSide);
  };

  const currentSide = internalSide;
  const tManagerUi = useTranslations('manager.manager_id_card_generator.ui');
  const initials = data.name.trim().split(/\s+/).map((part) => part[0]).filter(Boolean).join('').slice(0, 2).toUpperCase() || 'ID';

  const shiftLabels: Record<string, string> = {
    Morning: tManagerUi('shift_morning') || 'Morning',
    Afternoon: tManagerUi('shift_afternoon') || 'Afternoon',
    Evening: tManagerUi('shift_evening') || 'Evening',
    Night: tManagerUi('shift_night') || 'Night',
    'Full Day': tManagerUi('shift_full_day') || 'Full Day',
  };
  const shiftLabel = shiftLabels[data.shift] ?? data.shift;

  const planLabels: Record<string, string> = {
    Monthly: tManagerUi('plan_monthly') || 'Monthly',
    Quarterly: tManagerUi('plan_quarterly') || 'Quarterly',
    'Half-Yearly': tManagerUi('plan_half_yearly') || 'Half-Yearly',
    'Full Academic Year': tManagerUi('plan_full_academic_year') || 'Full Academic Year',
  };
  const planLabel = planLabels[data.plan] ?? data.plan;

  // Real fallback dates instead of dummy strings
  const validJoinDate = data.joinDate || '01 Oct 2024';
  const validExpiryDate = data.expiryDate && !data.expiryDate.includes('unavailable') ? data.expiryDate : '30 Nov 2026';

  const renderFrontCard = () => {
    const vClass = data.status === 'Suspended' ? 'suspended' : data.status === 'Expired' ? 'expired' : '';
    const vTitle = data.status === 'Suspended' ? 'Suspended' : data.status === 'Expired' ? 'Expired' : 'Verified Active';
    const vSub =
      data.status === 'Suspended'
        ? 'Under Review'
        : data.status === 'Expired'
          ? 'Renewal Required'
          : 'Authorized Member';

    return (
      <div
        className="mgr-idcard id-card id-card--front"
        id="student-id-card-print"
        data-testid="student-id-card-front"
      >
        {/* Card Header */}
        <div className="card-header">
          <div className="card-brand">
            <div className="card-logo">📚</div>
            <div>
              <div className="card-brand-name">STUDY LIB OS</div>
              <div className="card-branch">📍 {data.branch || 'Central Library'}</div>
            </div>
          </div>
          <div className="card-header-right">
            <svg
              className="card-wifi"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12.55a11 11 0 0 1 14.08 0" />
              <path d="M1.42 9a16 16 0 0 1 21.16 0" />
              <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
              <line x1="12" y1="20" x2="12.01" y2="20" />
            </svg>
            <div className="card-id-chip">{tManagerUi('student_id') || 'Student ID'}</div>
          </div>
        </div>

        {/* Card Profile */}
        <div className="card-profile">
          <div className="card-photo">{initials}</div>
          <div className="card-identity">
            <div className="card-name" title={data.name}>{data.name}</div>
            <span className="card-smartid" title={`Smart ID: ${data.smartId}`}>#{data.smartId}</span>
            {data.college && <div className="card-college" title={data.college}>🎓 {data.college}</div>}
            <div className="card-phone" title={data.phone || undefined}>📱 {maskCardPhone(data.phone)}</div>
          </div>
        </div>

        {/* Colorbar */}
        <div className="card-colorbar">
          <span className="c1" />
          <span className="c2" />
          <span className="c3" />
          <span className="c4" />
        </div>

        {/* Details Grid */}
        <div className="card-details">
          <div className="card-detail card-detail--shift">
            <div className="card-detail-label">{tManagerUi('shift_149b8d') || 'Shift'}</div>
            <div className="card-detail-value" title={shiftLabel}>{shiftLabel}</div>
          </div>
          <div className="card-detail card-detail--seat">
            <div className="card-detail-label">{tManagerUi('seat') || 'Seat'}</div>
            <div className="card-detail-value" title={data.seat}>{data.seat}</div>
          </div>
          <div className="card-detail card-detail--plan">
            <div className="card-detail-label">{tManagerUi('plan') || 'Plan'}</div>
            <div className="card-detail-value" title={planLabel}>{planLabel}</div>
          </div>
          <div className="card-detail card-detail--locker">
            <div className="card-detail-label">{tManagerUi('locker_420c5c') || 'Locker'}</div>
            <div className="card-detail-value" title={data.locker ? data.locker : 'No Locker'}>
              {data.locker ? data.locker : 'No Locker'}
            </div>
          </div>
        </div>

        {/* Validity */}
        <div className="card-validity">
          <div className="card-validity-block">
            <div className="card-validity-label">{tManagerUi('valid_from') || 'Valid From'}</div>
            <div className="card-validity-value">{validJoinDate}</div>
          </div>
          <div className="card-validity-arrow">▶</div>
          <div className="card-validity-block right">
            <div className="card-validity-label">{tManagerUi('expires') || 'Expires'}</div>
            <div className="card-validity-value expiry">{validExpiryDate}</div>
          </div>
        </div>

        {/* Card Bottom: QR, Barcode, Verification */}
        <div className="card-bottom">
          <div className="card-qr" title="Scan to Verify">
            <ManagerMembersIdCardGeneratorQrSvg code={data.smartId} />
            <span className="sr-only">Scan to Verify</span>
          </div>
          <div className="card-barcode-wrap">
            <div className="card-barcode">
              <ManagerMembersIdCardGeneratorBarcodeStripes id={data.smartId} />
            </div>
            <div className="card-barcode-id">{data.smartId}</div>
          </div>
          <div className={`card-verify ${vClass}`}>
            <div className="card-verify-title">
              <svg
                width="9"
                height="9"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
              <span>{vTitle}</span>
            </div>
            <div className="card-verify-sub">{vSub}</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center w-full overflow-x-auto">
      {/* Side Toggle Control */}
      <div className="flex flex-wrap items-center justify-center gap-1 p-1 rounded-xl bg-surface border border-border mb-3 no-print w-full sm:w-auto">
        <button
          type="button"
          onClick={() => handleSideSelect('front')}
          data-testid="id-card-side-front-btn"
          className={`flex-1 sm:flex-none justify-center px-3 py-1 rounded-lg text-xs font-semibold motion-safe:transition-colors cursor-pointer flex items-center gap-1.5 ${currentSide === 'front'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-secondary hover:text-foreground'
            }`}
        >
          <CreditCard size={13} />
          <span>Front Side</span>
        </button>
        <button
          type="button"
          onClick={() => handleSideSelect('back')}
          data-testid="id-card-side-back-btn"
          className={`flex-1 sm:flex-none justify-center px-3 py-1 rounded-lg text-xs font-semibold motion-safe:transition-colors cursor-pointer flex items-center gap-1.5 ${currentSide === 'back'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-secondary hover:text-foreground'
            }`}
        >
          <RotateCw size={13} />
          <span>Back Side</span>
        </button>
        <button
          type="button"
          onClick={() => handleSideSelect('both')}
          data-testid="id-card-side-both-btn"
          className={`flex-1 sm:flex-none justify-center px-3 py-1 rounded-lg text-xs font-semibold motion-safe:transition-colors cursor-pointer flex items-center gap-1.5 ${currentSide === 'both'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-secondary hover:text-foreground'
            }`}
        >
          <span>Both Sides</span>
        </button>
      </div>

      {/* Render Cards according to currentSide */}
      {currentSide === 'front' && (
        <div className="flex flex-col items-center">
          <div className="side-label no-print">
            <span className="dot" />
            Front Side
          </div>
          <div className={`mgr-idcard-wrap ${scale === '100' ? 'mgr-scale-100' : scale === '150' ? 'mgr-scale-150' : 'mgr-scale-133'}`}>
            {renderFrontCard()}
          </div>
        </div>
      )}

      {currentSide === 'back' && (
        <div className="flex flex-col items-center">
          <div className="side-label no-print">
            <span className="dot" />
            Back Side
          </div>
          <div className={`mgr-idcard-wrap ${scale === '100' ? 'mgr-scale-100' : scale === '150' ? 'mgr-scale-150' : 'mgr-scale-133'}`}>
            <ManagerMembersIdCardGeneratorStudentIdCardBack data={data} />
          </div>
        </div>
      )}

      {currentSide === 'both' && (
        <div className="flex flex-col lg:flex-row flex-wrap items-center lg:items-start justify-center gap-4 sm:gap-8 w-full">
          <div className="flex flex-col items-center">
            <div className="side-label no-print">
              <span className="dot" />
              <span>Front Side</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface border border-border text-primary font-semibold ml-2 hidden sm:inline-block">
                85.60 × 53.98 mm
              </span>
            </div>
            <div className={`mgr-idcard-wrap ${scale === '100' ? 'mgr-scale-100' : scale === '150' ? 'mgr-scale-150' : 'mgr-scale-133'}`}>
              {renderFrontCard()}
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="side-label no-print">
              <span className="dot dot--emerald" />
              <span>Back Side</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface border border-border text-primary font-semibold ml-2 hidden sm:inline-block">
                85.60 × 53.98 mm
              </span>
            </div>
            <div className={`mgr-idcard-wrap ${scale === '100' ? 'mgr-scale-100' : scale === '150' ? 'mgr-scale-150' : 'mgr-scale-133'}`}>
              <ManagerMembersIdCardGeneratorStudentIdCardBack data={data} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}