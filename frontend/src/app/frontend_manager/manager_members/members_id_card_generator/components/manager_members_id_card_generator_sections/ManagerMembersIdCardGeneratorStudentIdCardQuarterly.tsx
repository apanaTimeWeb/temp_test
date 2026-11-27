'use client';
// RESPONSIBILITY: Render the QUARTERLY plan front ID card — Gold/Metallic Foil theme with holographic seal.
import type {
IdCardSide,
ManagerMembersIdCardGeneratorStudentIdCardProps
} from '@/app/frontend_manager/manager_members/members_id_card_generator/types/ManagerMembersIdCardGeneratorComponentTypes';
import { ManagerMembersIdCardGeneratorBarcodeStripes, ManagerMembersIdCardGeneratorQrSvg } from '@/app/frontend_manager/manager_members/members_id_card_generator/components/manager_members_id_card_generator_sections/ManagerMembersIdCardGeneratorQrSvgs';
import { ManagerMembersIdCardGeneratorStudentIdCardQuarterlyBack } from '@/app/frontend_manager/manager_members/members_id_card_generator/components/manager_members_id_card_generator_sections/ManagerMembersIdCardGeneratorStudentIdCardQuarterlyBack';
import { CreditCard,RotateCw } from 'lucide-react';
import { useEffect,useState } from 'react';

function maskPhone(phone?: string | null): string {
  if (!phone) return '—';
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 4) return phone;
  return '••••••' + digits.slice(-4);
}

const QtrQrSvg = ({ code }: { code: string }) => (
  <ManagerMembersIdCardGeneratorQrSvg code={code} darkColor="#0F172A" />
);

const QtrBarcode = ({ id }: { id: string }) => (
  <ManagerMembersIdCardGeneratorBarcodeStripes id={id} count={28} palette={['#fbbf24', '#a78bfa', '#e2e8f0']} prefix="qtr-bar" />
);

export default function ManagerMembersIdCardGeneratorStudentIdCardQuarterly({
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

  const vClass = data.status === 'Suspended' ? 'qtr-status-suspended' : data.status === 'Expired' ? 'qtr-status-expired' : 'qtr-status-active';
  const vTitle = data.status === 'Suspended' ? '⚠ Suspended' : data.status === 'Expired' ? '✕ Expired' : '🛡️ Verified';
  const vSub = data.status === 'Suspended' ? 'Under Review' : data.status === 'Expired' ? 'Renew Now' : 'Authorized';

  const scaleClass = scale === '100' ? 'mgr-scale-100' : scale === '150' ? 'mgr-scale-150' : 'mgr-scale-133';

  const renderFront = () => (
    <div
      className="qtr-card qtr-card-front mgr-idcard"
      id="student-id-card-print"
      data-testid="student-id-card-front"
    >
      {/* Grain overlay */}
      <div className="qtr-grain" aria-hidden="true" />

      {/* Metallic Gold Foil Band */}
      <div className="qtr-foil-band">
        <div className="qtr-foil-brand">
          <div className="qtr-foil-logo">📚</div>
          <div className="qtr-foil-text">
            <div className="qtr-foil-name">STUDY LIB OS</div>
            <div className="qtr-foil-branch">📍 {data.branch || 'Central Library'}</div>
          </div>
        </div>
        <div className="qtr-foil-right">
          <svg className="qtr-foil-wifi" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
            <path d="M5 12.55a11 11 0 0 1 14.08 0" />
            <path d="M1.42 9a16 16 0 0 1 21.16 0" />
            <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
            <circle cx="12" cy="20" r="1" fill="currentColor" />
          </svg>
          <div className="qtr-foil-pill">Member</div>
        </div>
      </div>

      {/* Holographic Seal */}
      <div className="qtr-holo-seal" aria-hidden="true" />

      {/* Body */}
      <div className="qtr-front-body">
        {/* Profile Row */}
        <div className="qtr-profile-row">
          <div className="qtr-photo-frame">
            <div className="qtr-photo">{initials}</div>
            <div className="qtr-live-dot" aria-hidden="true" />
          </div>
          <div className="qtr-identity">
            <div className="qtr-identity-name" title={data.name}>{data.name}</div>
            <span className="qtr-identity-id" title={`Smart ID: ${data.smartId}`}>#{data.smartId}</span>
            <div className="qtr-identity-meta">
              {data.college && <span title={data.college}>🎓 {data.college}</span>}
              <span title={data.phone || undefined}>📱 {maskPhone(data.phone)}</span>
            </div>
          </div>
        </div>

        {/* Accent Bar */}
        <div className="qtr-accent-bar">
          <span className="qac1" /><span className="qac2" /><span className="qac3" /><span className="qac4" />
        </div>

        {/* Details Grid */}
        <div className="qtr-details">
          <div className="qtr-detail qd-shift">
            <div className="qtr-detail-label">Shift</div>
            <div className="qtr-detail-value" title={data.shift}>{data.shift}</div>
          </div>
          <div className="qtr-detail qd-seat">
            <div className="qtr-detail-label">Seat</div>
            <div className="qtr-detail-value" title={data.seat}>{data.seat}</div>
          </div>
          <div className="qtr-detail qd-plan">
            <div className="qtr-detail-label">Plan</div>
            <div className="qtr-detail-value">Quarterly</div>
          </div>
          <div className="qtr-detail qd-locker">
            <div className="qtr-detail-label">Locker</div>
            <div className="qtr-detail-value" title={data.locker || 'None'}>{data.locker || 'None'}</div>
          </div>
        </div>

        {/* Validity */}
        <div className="qtr-validity">
          <div className="qtr-validity-block">
            <div className="qtr-validity-label">Valid From</div>
            <div className="qtr-validity-value">{validJoinDate}</div>
          </div>
          <div className="qtr-validity-arrow">▶</div>
          <div className="qtr-validity-block qtr-validity-right">
            <div className="qtr-validity-label">Expires</div>
            <div className="qtr-validity-value qtr-validity-expiry">{validExpiryDate}</div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="qtr-front-bottom">
          <div className="qtr-qr-box" title="Scan to Verify">
            <QtrQrSvg code={data.smartId} />
            <span className="sr-only">Scan to Verify</span>
          </div>
          <div className="qtr-barcode-wrap">
            <div className="qtr-barcode-strip">
              <QtrBarcode id={data.smartId} />
            </div>
            <div className="qtr-barcode-id">{data.smartId}</div>
          </div>
          <div className={`qtr-status-block ${vClass}`}>
            <div className="qtr-status-badge">{vTitle}</div>
            <div className="qtr-status-sub">{vSub}</div>
          </div>
        </div>
      </div>

      {/* Micro border */}
      <div className="qtr-micro-border" aria-hidden="true" />
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
          className={`flex-1 sm:flex-none justify-center px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${currentSide === 'front' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-secondary hover:text-foreground'}`}
        >
          <CreditCard size={13} /><span>Front Side</span>
        </button>
        <button
          type="button"
          onClick={() => handleSideSelect('back')}
          data-testid="id-card-side-back-btn"
          className={`flex-1 sm:flex-none justify-center px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${currentSide === 'back' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-secondary hover:text-foreground'}`}
        >
          <RotateCw size={13} /><span>Back Side</span>
        </button>
        <button
          type="button"
          onClick={() => handleSideSelect('both')}
          data-testid="id-card-side-both-btn"
          className={`flex-1 sm:flex-none justify-center px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${currentSide === 'both' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-secondary hover:text-foreground'}`}
        >
          <span>Both Sides</span>
        </button>
      </div>

      {currentSide === 'front' && (
        <div className="flex flex-col items-center">
          <div className="side-label no-print"><span className="dot" style={{ background: '#fbbf24', boxShadow: '0 0 8px #fbbf24' }} />Front Side</div>
          <div className={`mgr-idcard-wrap ${scaleClass}`}>{renderFront()}</div>
        </div>
      )}

      {currentSide === 'back' && (
        <div className="flex flex-col items-center">
          <div className="side-label no-print"><span className="dot" style={{ background: '#fbbf24', boxShadow: '0 0 8px #fbbf24' }} />Back Side</div>
          <div className={`mgr-idcard-wrap ${scaleClass}`}>
            <ManagerMembersIdCardGeneratorStudentIdCardQuarterlyBack data={data} />
          </div>
        </div>
      )}

      {currentSide === 'both' && (
        <div className="flex flex-col lg:flex-row flex-wrap items-center lg:items-start justify-center gap-4 sm:gap-8 w-full">
          <div className="flex flex-col items-center">
            <div className="side-label no-print">
              <span className="dot" style={{ background: '#fbbf24', boxShadow: '0 0 8px #fbbf24' }} />
              <span>Front Side</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface border border-border text-primary font-semibold ml-2 hidden sm:inline-block">85.60 × 53.98 mm</span>
            </div>
            <div className={`mgr-idcard-wrap ${scaleClass}`}>{renderFront()}</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="side-label no-print">
              <span className="dot" style={{ background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
              <span>Back Side</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface border border-border text-primary font-semibold ml-2 hidden sm:inline-block">85.60 × 53.98 mm</span>
            </div>
            <div className={`mgr-idcard-wrap ${scaleClass}`}>
              <ManagerMembersIdCardGeneratorStudentIdCardQuarterlyBack data={data} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
