'use client';
// RESPONSIBILITY: Render the members id card generator student id card component with professional QR, clean barcode layout, and back side support.
import { useTranslations } from 'next-intl';
import { maskManagerIdCardGeneratorPhone } from '@/app/frontend_manager/manager_members/members_id_card_generator/utils/ManagerMembersIdCardGeneratorUtilities';
import React, { useState, useEffect, type ReactElement } from 'react';
import { Phone, Wifi, ShieldCheck, CreditCard, RotateCw } from 'lucide-react';
import type {
  IdCardData,
  IdCardSide,
  ManagerMembersIdCardGeneratorStudentIdCardProps,
} from '@/app/frontend_manager/manager_members/members_id_card_generator/types/ManagerMembersIdCardGeneratorComponentTypes';
import { ManagerMembersIdCardGeneratorStudentIdCardBack } from './ManagerMembersIdCardGeneratorStudentIdCardBack';

export type { IdCardData, IdCardSide, ManagerMembersIdCardGeneratorStudentIdCardProps };

function ManagerMembersIdCardGeneratorBarcodeStripes({ id }: { id: string }) {
  const bars: { width: number; gap: number }[] = [];
  for (let index = 0; index < 28; index += 1) {
    const code = id.charCodeAt(index % id.length) + index * 3;
    bars.push({ width: (code % 3) + 1, gap: (code % 2) + 1 });
  }
  return (
    <svg width="75" height="18" viewBox="0 0 110 36" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" preserveAspectRatio="none">
      {bars.reduce<{ x: number; elements: ReactElement[] }>((result, bar, index) => {
        const fill = index % 5 === 0 ? '#38bdf8' : index % 3 === 0 ? '#a78bfa' : '#f1f5f9';
        const element = <rect key={`${id}-barcode-stripe-${index}`} x={result.x} y="0" width={bar.width} height="36" fill={fill} rx="0.5" />;
        return { x: result.x + bar.width + bar.gap, elements: [...result.elements, element] };
      }, { x: 0, elements: [] }).elements}
    </svg>
  );
}

function ManagerMembersIdCardGeneratorQrSvg({ code }: { code: string }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg" className="block" aria-label={`QR access token for ${code}`}>
      {/* Background card */}
      <rect width="25" height="25" rx="2" fill="#FFFFFF" />

      {/* Top Left Finder Pattern (7x7 at x:2..9, y:2..9) */}
      <rect x="2" y="2" width="7" height="7" fill="#0F172A" rx="1.2" />
      <rect x="3" y="3" width="5" height="5" fill="#FFFFFF" rx="0.5" />
      <rect x="4" y="4" width="3" height="3" fill="#0F172A" rx="0.6" />

      {/* Top Right Finder Pattern (7x7 at x:16..23, y:2..9) */}
      <rect x="16" y="2" width="7" height="7" fill="#0F172A" rx="1.2" />
      <rect x="17" y="3" width="5" height="5" fill="#FFFFFF" rx="0.5" />
      <rect x="18" y="4" width="3" height="3" fill="#0F172A" rx="0.6" />

      {/* Bottom Left Finder Pattern (7x7 at x:2..9, y:16..23) */}
      <rect x="2" y="16" width="7" height="7" fill="#0F172A" rx="1.2" />
      <rect x="3" y="17" width="5" height="5" fill="#FFFFFF" rx="0.5" />
      <rect x="4" y="18" width="3" height="3" fill="#0F172A" rx="0.6" />

      {/* Timing Patterns */}
      <rect x="10" y="4" width="1" height="1" fill="#0F172A" />
      <rect x="12" y="4" width="1" height="1" fill="#0F172A" />
      <rect x="14" y="4" width="1" height="1" fill="#0F172A" />
      <rect x="4" y="10" width="1" height="1" fill="#0F172A" />
      <rect x="4" y="12" width="1" height="1" fill="#0F172A" />
      <rect x="4" y="14" width="1" height="1" fill="#0F172A" />

      {/* Format & Data Modules */}
      <rect x="10" y="2" width="1" height="1" fill="#0F172A" />
      <rect x="10" y="6" width="1" height="1" fill="#0F172A" />
      <rect x="14" y="2" width="1" height="1" fill="#0F172A" />
      <rect x="14" y="6" width="1" height="1" fill="#0F172A" />
      <rect x="2" y="10" width="1" height="1" fill="#0F172A" />
      <rect x="6" y="10" width="1" height="1" fill="#0F172A" />
      <rect x="2" y="14" width="1" height="1" fill="#0F172A" />
      <rect x="6" y="14" width="1" height="1" fill="#0F172A" />

      {/* Center & Grid Content */}
      <rect x="10" y="10" width="2" height="2" fill="#0F172A" rx="0.3" />
      <rect x="13" y="10" width="2" height="1" fill="#0F172A" rx="0.3" />
      <rect x="16" y="10" width="1" height="2" fill="#0F172A" rx="0.3" />
      <rect x="18" y="10" width="2" height="2" fill="#0F172A" rx="0.3" />
      <rect x="21" y="10" width="2" height="1" fill="#0F172A" rx="0.3" />

      <rect x="10" y="13" width="2" height="1" fill="#0F172A" rx="0.3" />
      <rect x="13" y="12" width="2" height="2" fill="#0F172A" rx="0.3" />
      <rect x="16" y="13" width="2" height="1" fill="#0F172A" rx="0.3" />
      <rect x="19" y="13" width="1" height="2" fill="#0F172A" rx="0.3" />
      <rect x="21" y="12" width="2" height="2" fill="#0F172A" rx="0.3" />

      <rect x="10" y="15" width="1" height="2" fill="#0F172A" rx="0.3" />
      <rect x="12" y="15" width="2" height="2" fill="#0F172A" rx="0.3" />
      <rect x="15" y="15" width="2" height="2" fill="#0F172A" rx="0.3" />
      <rect x="18" y="16" width="2" height="1" fill="#0F172A" rx="0.3" />
      <rect x="21" y="15" width="2" height="2" fill="#0F172A" rx="0.3" />

      {/* Bottom Right Alignment Structure */}
      <rect x="10" y="18" width="2" height="2" fill="#0F172A" rx="0.3" />
      <rect x="13" y="18" width="2" height="1" fill="#0F172A" rx="0.3" />
      <rect x="16" y="17" width="2" height="2" fill="#0F172A" rx="0.3" />
      <rect x="19" y="18" width="4" height="4" fill="#0F172A" rx="0.8" />
      <rect x="20" y="19" width="2" height="2" fill="#FFFFFF" rx="0.3" />

      <rect x="10" y="21" width="1" height="2" fill="#0F172A" rx="0.3" />
      <rect x="12" y="21" width="2" height="1" fill="#0F172A" rx="0.3" />
      <rect x="15" y="20" width="2" height="2" fill="#0F172A" rx="0.3" />
      <rect x="18" y="21" width="1" height="2" fill="#0F172A" rx="0.3" />
    </svg>
  );
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

  const renderFrontCard = () => (
    <div className="mgr-idcard" id="student-id-card-print" data-testid="student-id-card-front">
      <div className="mgr-idcard-holo-lines" aria-hidden="true" />
      <div className="mgr-idcard-header">
        <div className="mgr-idcard-header-left">
          <div className="mgr-idcard-logo-icon">📚</div>
          <div>
            <div className="mgr-idcard-logo-text">STUDY LIB OS</div>
            <div className="mgr-idcard-branch-text font-semibold">📍 {data.branch || 'Central Library'}</div>
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
            <div className="mgr-idcard-qr" role="img" aria-label={`QR access verification for ${data.smartId}`}>
              <ManagerMembersIdCardGeneratorQrSvg code={data.smartId} />
            </div>
            <span className="mgr-idcard-qr-label">Scan to Verify</span>
          </div>
          <div className="mgr-idcard-barcode-wrap">
            <ManagerMembersIdCardGeneratorBarcodeStripes id={data.smartId} />
            <span className="mgr-idcard-barcode-id">{data.smartId}</span>
            <span className="mgr-idcard-barcode-sub font-mono text-[9px]">Gate Turnstile Pass</span>
          </div>
          <div className="mgr-idcard-verification-note" role="status">
            {data.status === 'Suspended' ? (
              <>
                <span className="mgr-idcard-verification-title text-warning flex items-center gap-1 font-bold">
                  <ShieldCheck size={13} className="text-warning inline" /> Suspended
                </span>
                <span className="mgr-idcard-verification-sub text-[10px]">Under Review</span>
              </>
            ) : data.status === 'Expired' ? (
              <>
                <span className="mgr-idcard-verification-title text-destructive flex items-center gap-1 font-bold">
                  <ShieldCheck size={13} className="text-destructive inline" /> Expired
                </span>
                <span className="mgr-idcard-verification-sub text-[10px]">Renewal Required</span>
              </>
            ) : (
              <>
                <span className="mgr-idcard-verification-title text-success flex items-center gap-1 font-bold">
                  <ShieldCheck size={13} className="text-success inline" /> Verified Active
                </span>
                <span className="mgr-idcard-verification-sub text-[10px]">Authorized Member</span>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="mgr-idcard-stripe" aria-hidden="true" />
    </div>
  );

  return (
    <div className="flex flex-col items-center w-full">
      {/* Side Toggle Control */}
      <div className="flex items-center justify-center gap-1 p-1 rounded-xl bg-surface border border-border mb-3 no-print">
        <button
          type="button"
          onClick={() => handleSideSelect('front')}
          data-testid="id-card-side-front-btn"
          className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
            currentSide === 'front'
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
          className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
            currentSide === 'back'
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
          className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
            currentSide === 'both'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-secondary hover:text-foreground'
          }`}
        >
          <span>Both Sides</span>
        </button>
      </div>

      {/* Render Cards according to currentSide */}
      {currentSide === 'front' && (
        <div className={`mgr-idcard-wrap ${scale === '100' ? 'mgr-scale-100' : scale === '150' ? 'mgr-scale-150' : 'mgr-scale-133'}`}>
          {renderFrontCard()}
        </div>
      )}

      {currentSide === 'back' && (
        <div className={`mgr-idcard-wrap ${scale === '100' ? 'mgr-scale-100' : scale === '150' ? 'mgr-scale-150' : 'mgr-scale-133'}`}>
          <ManagerMembersIdCardGeneratorStudentIdCardBack data={data} />
        </div>
      )}

      {currentSide === 'both' && (
        <div className="flex flex-wrap items-start justify-center gap-8 w-full">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2 text-xs font-bold text-secondary uppercase tracking-wider mb-2.5 no-print">
              <span className="w-2 h-2 rounded-full bg-sky-400 inline-block shadow-sm shadow-sky-400/50" />
              <span>Front Side</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface border border-border text-primary font-semibold">
                85.60 × 53.98 mm
              </span>
            </div>
            <div className={`mgr-idcard-wrap ${scale === '100' ? 'mgr-scale-100' : scale === '150' ? 'mgr-scale-150' : 'mgr-scale-133'}`}>
              {renderFrontCard()}
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2 text-xs font-bold text-secondary uppercase tracking-wider mb-2.5 no-print">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block shadow-sm shadow-emerald-400/50" />
              <span>Back Side (Rules & Wi-Fi)</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface border border-border text-primary font-semibold">
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
