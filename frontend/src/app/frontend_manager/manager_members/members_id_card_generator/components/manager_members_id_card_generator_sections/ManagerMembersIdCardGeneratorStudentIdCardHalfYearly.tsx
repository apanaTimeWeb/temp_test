'use client';
// RESPONSIBILITY: Render the HALF-YEARLY plan front ID card — Signature Edition with mini-chip, guilloche, and inline holo seal.
import { ManagerMembersIdCardGeneratorBarcodeStripes, ManagerMembersIdCardGeneratorQrSvg } from '@/app/frontend_manager/manager_members/members_id_card_generator/components/manager_members_id_card_generator_sections/ManagerMembersIdCardGeneratorQrSvgs';
import { ManagerMembersIdCardGeneratorStudentIdCardHalfYearlyBack } from '@/app/frontend_manager/manager_members/members_id_card_generator/components/manager_members_id_card_generator_sections/ManagerMembersIdCardGeneratorStudentIdCardHalfYearlyBack';
import type { IdCardSide, ManagerMembersIdCardGeneratorStudentIdCardProps } from '@/app/frontend_manager/manager_members/members_id_card_generator/types/ManagerMembersIdCardGeneratorComponentTypes';
import { CreditCard, RotateCw } from 'lucide-react';
import { useEffect, useState } from 'react';

function maskPhone(phone?: string | null): string {
  if (!phone) return '—';
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 4) return phone;
  return '•••••• ' + digits.slice(-4);
}

const HyQrSvg = ({ code }: { code: string }) => <ManagerMembersIdCardGeneratorQrSvg code={code} darkColor="#05080F" />;
const HyBarcode = ({ id }: { id: string }) => <ManagerMembersIdCardGeneratorBarcodeStripes id={id} count={36} palette={['#f4d35e', '#a78bfa', '#e8eaed']} prefix="hy-bar" />;

export default function ManagerMembersIdCardGeneratorStudentIdCardHalfYearly({
  data,
  side = 'front',
  onSideChange,
  scale = '133',
}: ManagerMembersIdCardGeneratorStudentIdCardProps) {
  const [internalSide, setInternalSide] = useState<IdCardSide>(side);

  useEffect(() => { setInternalSide(side); }, [side]);

  const handleSideSelect = (newSide: IdCardSide) => {
    setInternalSide(newSide);
    onSideChange?.(newSide);
  };

  const currentSide = internalSide;
  const initials = data.name.trim().split(/\s+/).map((p) => p[0]).filter(Boolean).join('').slice(0, 2).toUpperCase() || 'ID';
  const validJoinDate = data.joinDate || '01 Oct 2024';
  const validExpiryDate = data.expiryDate && !data.expiryDate.includes('unavailable') ? data.expiryDate : '30 Nov 2026';

  const vClass = data.status === 'Suspended' ? 'hy-status-suspended' : data.status === 'Expired' ? 'hy-status-expired' : 'hy-status-active';
  const vTitle = data.status === 'Suspended' ? '⚠ Suspended' : data.status === 'Expired' ? '✕ Expired' : '🛡️ Verified';
  const vSub = data.status === 'Suspended' ? 'Review' : data.status === 'Expired' ? 'Renew' : 'Authorized';

  const scaleClass = scale === '100' ? 'mgr-scale-100' : scale === '150' ? 'mgr-scale-150' : 'mgr-scale-133';

  const renderFront = () => (
    <div
      className="hy-card hy-card-front mgr-idcard"
      id="student-id-card-print"
      data-testid="student-id-card-front"
    >
      <div className="hy-guilloche" aria-hidden="true" />
      <div className="hy-grain" aria-hidden="true" />

      {/* Foil Band */}
      <div className="hy-foil-band">
        <div className="hy-foil-brand">
          <div className="hy-foil-logo">📚</div>
          <div className="hy-foil-text">
            <div className="hy-foil-name">STUDY LIB OS</div>
            <div className="hy-foil-branch">📍 {data.branch || 'Central Library'}</div>
          </div>
        </div>
        <div className="hy-foil-right">
          <div className="hy-chip-mini" aria-label="EMV chip" />
          <svg className="hy-foil-nfc" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" aria-hidden="true">
            <path d="M5 12.55a11 11 0 0 1 14.08 0" />
            <path d="M1.42 9a16 16 0 0 1 21.16 0" />
            <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
            <circle cx="12" cy="20" r="1" fill="currentColor" />
          </svg>
          <div className="hy-foil-pill">Member</div>
        </div>
      </div>

      {/* Front Body */}
      <div className="hy-front-body">
        {/* Profile Row */}
        <div className="hy-profile-row">
          <div className="hy-photo-frame">
            <div className="hy-photo">{initials}</div>
            <div className="hy-live-dot" aria-hidden="true" />
          </div>
          <div className="hy-identity">
            <div className="hy-identity-name" title={data.name}>{data.name}</div>
            <span className="hy-identity-id" title={`Smart ID: ${data.smartId}`}>#{data.smartId}</span>
            <div className="hy-identity-meta">
              {data.college && <span title={data.college}>🎓 {data.college}</span>}
              <span title={data.phone || undefined}>📱 {maskPhone(data.phone)}</span>
            </div>
          </div>
          <div className="hy-holo-seal">
            <span className="hy-seal-mark">✓</span>
          </div>
        </div>

        {/* Accent Bar */}
        <div className="hy-accent-bar">
          <span className="hy-ac1" /><span className="hy-ac2" /><span className="hy-ac3" /><span className="hy-ac4" />
        </div>

        {/* Details Grid */}
        <div className="hy-details">
          <div className="hy-detail hy-d-shift">
            <div className="hy-detail-label">Shift</div>
            <div className="hy-detail-value" title={data.shift}>{data.shift}</div>
          </div>
          <div className="hy-detail hy-d-seat">
            <div className="hy-detail-label">Seat</div>
            <div className="hy-detail-value" title={data.seat}>{data.seat}</div>
          </div>
          <div className="hy-detail hy-d-plan">
            <div className="hy-detail-label">Plan</div>
            <div className="hy-detail-value">Half-Yearly</div>
          </div>
          <div className="hy-detail hy-d-locker">
            <div className="hy-detail-label">Locker</div>
            <div className="hy-detail-value" title={data.locker || 'None'}>{data.locker || 'None'}</div>
          </div>
        </div>

        {/* Validity */}
        <div className="hy-validity">
          <div className="hy-validity-block">
            <div className="hy-validity-label">Valid From</div>
            <div className="hy-validity-value">{validJoinDate}</div>
          </div>
          <div className="hy-validity-arrow">▶</div>
          <div className="hy-validity-block hy-validity-right">
            <div className="hy-validity-label">Expires</div>
            <div className="hy-validity-value hy-validity-expiry">{validExpiryDate}</div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="hy-front-bottom">
          <div className="hy-qr-box" title="Scan to Verify">
            <HyQrSvg code={data.smartId} />
            <span className="sr-only">Scan to Verify</span>
          </div>
          <div className="hy-barcode-wrap">
            <div className="hy-barcode-strip">
              <HyBarcode id={data.smartId} />
            </div>
            <div className="hy-barcode-id">{data.smartId}</div>
          </div>
          <div className={`hy-status-block ${vClass}`}>
            <div className="hy-status-badge">{vTitle}</div>
            <div className="hy-status-sub">{vSub}</div>
          </div>
        </div>
      </div>

      <div className="hy-micro-border" aria-hidden="true" />
    </div>
  );

  return (
    <div className="flex flex-col items-center w-full overflow-x-auto">
      {/* Side Toggle */}
      <div className="flex flex-wrap items-center justify-center gap-1 p-1 rounded-xl bg-surface border border-border mb-3 no-print w-full sm:w-auto">
        <button
          type="button"
          onClick={() => handleSideSelect('front')}
          data-testid="id-card-side-front-btn"
          className={`flex-1 sm:flex-none justify-center px-3 py-1 rounded-lg text-xs font-semibold motion-safe:transition-colors cursor-pointer flex items-center gap-1.5 ${currentSide === 'front' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-secondary hover:text-foreground'}`}
        >
          <CreditCard size={13} /><span>Front Side</span>
        </button>
        <button
          type="button"
          onClick={() => handleSideSelect('back')}
          data-testid="id-card-side-back-btn"
          className={`flex-1 sm:flex-none justify-center px-3 py-1 rounded-lg text-xs font-semibold motion-safe:transition-colors cursor-pointer flex items-center gap-1.5 ${currentSide === 'back' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-secondary hover:text-foreground'}`}
        >
          <RotateCw size={13} /><span>Back Side</span>
        </button>
        <button
          type="button"
          onClick={() => handleSideSelect('both')}
          data-testid="id-card-side-both-btn"
          className={`flex-1 sm:flex-none justify-center px-3 py-1 rounded-lg text-xs font-semibold motion-safe:transition-colors cursor-pointer flex items-center gap-1.5 ${currentSide === 'both' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-secondary hover:text-foreground'}`}
        >
          <span>Both Sides</span>
        </button>
      </div>

      {currentSide === 'front' && (
        <div className="flex flex-col items-center">
          <div className="side-label no-print"><span className="dot dot--emerald-lg" />Front Side</div>
          <div className={`mgr-idcard-wrap ${scaleClass}`}>{renderFront()}</div>
        </div>
      )}

      {currentSide === 'back' && (
        <div className="flex flex-col items-center">
          <div className="side-label no-print"><span className="dot dot--emerald-lg" />Back Side</div>
          <div className={`mgr-idcard-wrap ${scaleClass}`}>
            <ManagerMembersIdCardGeneratorStudentIdCardHalfYearlyBack data={data} />
          </div>
        </div>
      )}

      {currentSide === 'both' && (
        <div className="flex flex-col lg:flex-row flex-wrap items-center lg:items-start justify-center gap-4 sm:gap-8 w-full">
          <div className="flex flex-col items-center">
            <div className="side-label no-print">
              <span className="dot dot--emerald-lg" />
              <span>Front Side</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface border border-border text-primary font-semibold ml-2 hidden sm:inline-block">85.60 × 53.98 mm</span>
            </div>
            <div className={`mgr-idcard-wrap ${scaleClass}`}>{renderFront()}</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="side-label no-print">
              <span className="dot dot--emerald" />
              <span>Back Side</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface border border-border text-primary font-semibold ml-2 hidden sm:inline-block">85.60 × 53.98 mm</span>
            </div>
            <div className={`mgr-idcard-wrap ${scaleClass}`}>
              <ManagerMembersIdCardGeneratorStudentIdCardHalfYearlyBack data={data} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
