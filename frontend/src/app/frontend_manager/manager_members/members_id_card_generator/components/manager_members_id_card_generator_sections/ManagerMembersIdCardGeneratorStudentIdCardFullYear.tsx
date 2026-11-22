'use client';
// RESPONSIBILITY: Render the FULL YEAR / ANNUAL plan front ID card — Ultra Pro Champagne Edition with silk, woven thread, UV latent, and pulsing NFC rings.
import type {
IdCardSide,
ManagerMembersIdCardGeneratorStudentIdCardProps
} from '@/app/frontend_manager/manager_members/members_id_card_generator/types/ManagerMembersIdCardGeneratorComponentTypes';
import { CreditCard,RotateCw } from 'lucide-react';
import { useEffect,useState } from 'react';
import { ManagerMembersIdCardGeneratorStudentIdCardFullYearBack } from './ManagerMembersIdCardGeneratorStudentIdCardFullYearBack';

function maskPhone(phone?: string | null): string {
  if (!phone) return '—';
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 4) return phone;
  return '•••••• ' + digits.slice(-4);
}

function FyQrSvg({ code }: { code: string }) {
  const safeCode = code || 'LIB-0000';
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 25 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
      aria-label={`QR for ${safeCode}`}
      className="w-full h-full block"
    >
      <rect width="25" height="25" rx="2" fill="#FFFFFF" />
      <rect x="2" y="2" width="7" height="7" fill="#05080F" rx="1.2" />
      <rect x="3" y="3" width="5" height="5" fill="#FFFFFF" rx="0.5" />
      <rect x="4" y="4" width="3" height="3" fill="#05080F" rx="0.6" />
      <rect x="16" y="2" width="7" height="7" fill="#05080F" rx="1.2" />
      <rect x="17" y="3" width="5" height="5" fill="#FFFFFF" rx="0.5" />
      <rect x="18" y="4" width="3" height="3" fill="#05080F" rx="0.6" />
      <rect x="2" y="16" width="7" height="7" fill="#05080F" rx="1.2" />
      <rect x="3" y="17" width="5" height="5" fill="#FFFFFF" rx="0.5" />
      <rect x="4" y="18" width="3" height="3" fill="#05080F" rx="0.6" />
      <rect x="10" y="10" width="2" height="2" fill="#05080F" rx="0.3" />
      <rect x="13" y="10" width="2" height="1" fill="#05080F" rx="0.3" />
      <rect x="16" y="10" width="1" height="2" fill="#05080F" rx="0.3" />
      <rect x="18" y="10" width="2" height="2" fill="#05080F" rx="0.3" />
      <rect x="21" y="10" width="2" height="1" fill="#05080F" rx="0.3" />
      <rect x="10" y="13" width="2" height="1" fill="#05080F" rx="0.3" />
      <rect x="13" y="12" width="2" height="2" fill="#05080F" rx="0.3" />
      <rect x="16" y="13" width="2" height="1" fill="#05080F" rx="0.3" />
      <rect x="19" y="13" width="1" height="2" fill="#05080F" rx="0.3" />
      <rect x="21" y="12" width="2" height="2" fill="#05080F" rx="0.3" />
      <rect x="10" y="15" width="1" height="2" fill="#05080F" rx="0.3" />
      <rect x="12" y="15" width="2" height="2" fill="#05080F" rx="0.3" />
      <rect x="15" y="15" width="2" height="2" fill="#05080F" rx="0.3" />
      <rect x="18" y="16" width="2" height="1" fill="#05080F" rx="0.3" />
      <rect x="21" y="15" width="2" height="2" fill="#05080F" rx="0.3" />
      <rect x="10" y="18" width="2" height="2" fill="#05080F" rx="0.3" />
      <rect x="13" y="18" width="2" height="1" fill="#05080F" rx="0.3" />
      <rect x="16" y="17" width="2" height="2" fill="#05080F" rx="0.3" />
      <rect x="19" y="18" width="4" height="4" fill="#05080F" rx="0.8" />
      <rect x="20" y="19" width="2" height="2" fill="#FFFFFF" rx="0.3" />
      <rect x="10" y="21" width="1" height="2" fill="#05080F" rx="0.3" />
      <rect x="12" y="21" width="2" height="1" fill="#05080F" rx="0.3" />
      <rect x="15" y="20" width="2" height="2" fill="#05080F" rx="0.3" />
      <rect x="18" y="21" width="1" height="2" fill="#05080F" rx="0.3" />
    </svg>
  );
}

function FyBarcode({ id }: { id: string }) {
  const safeId = id && id.length > 0 ? id : 'LIB-DEFAULT';
  const bars: { w: number; g: number }[] = [];
  for (let i = 0; i < 36; i++) {
    const c = safeId.charCodeAt(i % safeId.length) + i * 7;
    bars.push({ w: (c % 3) + 1, g: (c % 2) + 1 });
  }
  let totalWidth = 0;
  for (const b of bars) totalWidth += b.w + b.g;
  let currentX = 0;
  return (
    <svg
      viewBox={`0 0 ${totalWidth} 36`}
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label={`Barcode for ${safeId}`}
      className="w-full h-full block"
    >
      {bars.map((bar, i) => {
        const fill = i % 5 === 0 ? '#f5e8c8' : i % 3 === 0 ? '#e8b4b8' : '#e2e8f0';
        const xPos = currentX;
        currentX += bar.w + bar.g;
        return <rect key={`${safeId}-fy-bar-${i}`} x={xPos} y="0" width={bar.w} height="36" fill={fill} />;
      })}
    </svg>
  );
}

export default function ManagerMembersIdCardGeneratorStudentIdCardFullYear({
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

  const vClass = data.status === 'Suspended' ? 'fy-status-suspended' : data.status === 'Expired' ? 'fy-status-expired' : 'fy-status-active';
  const vTitle = data.status === 'Suspended' ? '⚠ Suspended' : data.status === 'Expired' ? '✕ Expired' : '🛡️ Verified';
  const vSub = data.status === 'Suspended' ? 'Review' : data.status === 'Expired' ? 'Renew' : 'Authorized';

  const scaleClass = scale === '100' ? 'mgr-scale-100' : scale === '150' ? 'mgr-scale-150' : 'mgr-scale-133';

  const renderFront = () => (
    <div
      className="fy-card fy-card-front mgr-idcard"
      id="student-id-card-print"
      data-testid="student-id-card-front"
    >
      <div className="fy-silk" aria-hidden="true" />
      <div className="fy-guilloche" aria-hidden="true" />
      <div className="fy-thread" aria-hidden="true" />
      <div className="fy-latent" aria-hidden="true">AUTHENTIC</div>

      {/* Foil Band */}
      <div className="fy-foil-band">
        <div className="fy-foil-brand">
          <div className="fy-foil-logo">📚</div>
          <div className="fy-foil-text">
            <div className="fy-foil-name">STUDY LIB OS</div>
            <div className="fy-foil-branch">📍 {data.branch || 'Central Library'}</div>
          </div>
        </div>
        <div className="fy-foil-right">
          <div className="fy-chip-mini" aria-label="EMV chip" />
          <div className="fy-nfc-wrap" aria-label="Contactless">
            <div className="fy-nfc-ring" />
            <div className="fy-nfc-ring" />
            <svg className="fy-nfc-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" aria-hidden="true">
              <path d="M5 12.55a11 11 0 0 1 14.08 0" />
              <path d="M1.42 9a16 16 0 0 1 21.16 0" />
              <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
              <circle cx="12" cy="20" r="1" fill="currentColor" />
            </svg>
          </div>
          <div className="fy-foil-pill">Member</div>
        </div>
      </div>

      {/* Front Body */}
      <div className="fy-front-body">
        {/* Profile Row */}
        <div className="fy-profile-row">
          <div className="fy-photo-frame">
            <div className="fy-photo">{initials}</div>
            <div className="fy-live-dot" aria-hidden="true" />
          </div>
          <div className="fy-identity">
            <div className="fy-identity-name" title={data.name}>{data.name}</div>
            <span className="fy-identity-id" title={`Smart ID: ${data.smartId}`}>#{data.smartId}</span>
            <div className="fy-identity-meta">
              {data.college && <span title={data.college}>🎓 {data.college}</span>}
              <span title={data.phone || undefined}>📱 {maskPhone(data.phone)}</span>
            </div>
          </div>
          <div className="fy-holo-seal">
            <span className="fy-seal-mark">✓</span>
          </div>
        </div>

        {/* Accent Bar */}
        <div className="fy-accent-bar">
          <span className="fy-ac1" /><span className="fy-ac2" /><span className="fy-ac3" /><span className="fy-ac4" />
        </div>

        {/* Details Grid */}
        <div className="fy-details">
          <div className="fy-detail fy-d-shift">
            <div className="fy-detail-label">Shift</div>
            <div className="fy-detail-value" title={data.shift}>{data.shift}</div>
          </div>
          <div className="fy-detail fy-d-seat">
            <div className="fy-detail-label">Seat</div>
            <div className="fy-detail-value" title={data.seat}>{data.seat}</div>
          </div>
          <div className="fy-detail fy-d-plan">
            <div className="fy-detail-label">Plan</div>
            <div className="fy-detail-value">Full Year</div>
          </div>
          <div className="fy-detail fy-d-locker">
            <div className="fy-detail-label">Locker</div>
            <div className="fy-detail-value" title={data.locker || 'None'}>{data.locker || 'None'}</div>
          </div>
        </div>

        {/* Validity */}
        <div className="fy-validity">
          <div className="fy-validity-block">
            <div className="fy-validity-label">Valid From</div>
            <div className="fy-validity-value">{validJoinDate}</div>
          </div>
          <div className="fy-validity-arrow">▶</div>
          <div className="fy-validity-block fy-validity-right">
            <div className="fy-validity-label">Expires</div>
            <div className="fy-validity-value fy-validity-expiry">{validExpiryDate}</div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="fy-front-bottom">
          <div className="fy-qr-box" title="Scan to Verify">
            <FyQrSvg code={data.smartId} />
            <span className="sr-only">Scan to Verify</span>
          </div>
          <div className="fy-barcode-wrap">
            <div className="fy-barcode-strip">
              <FyBarcode id={data.smartId} />
            </div>
            <div className="fy-barcode-id">{data.smartId}</div>
          </div>
          <div className={`fy-status-block ${vClass}`}>
            <div className="fy-status-badge">{vTitle}</div>
            <div className="fy-status-sub">{vSub}</div>
          </div>
        </div>
      </div>

      <div className="fy-micro-border" aria-hidden="true" />
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
          <div className="side-label no-print"><span className="dot" style={{ background: '#e2e8f0', boxShadow: '0 0 12px #ffffff' }} />Front Side</div>
          <div className={`mgr-idcard-wrap ${scaleClass}`}>{renderFront()}</div>
        </div>
      )}

      {currentSide === 'back' && (
        <div className="flex flex-col items-center">
          <div className="side-label no-print"><span className="dot" style={{ background: '#e2e8f0', boxShadow: '0 0 12px #ffffff' }} />Back Side</div>
          <div className={`mgr-idcard-wrap ${scaleClass}`}>
            <ManagerMembersIdCardGeneratorStudentIdCardFullYearBack data={data} />
          </div>
        </div>
      )}

      {currentSide === 'both' && (
        <div className="flex flex-col lg:flex-row flex-wrap items-center lg:items-start justify-center gap-4 sm:gap-8 w-full">
          <div className="flex flex-col items-center">
            <div className="side-label no-print">
              <span className="dot" style={{ background: '#e2e8f0', boxShadow: '0 0 12px #ffffff' }} />
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
              <ManagerMembersIdCardGeneratorStudentIdCardFullYearBack data={data} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
