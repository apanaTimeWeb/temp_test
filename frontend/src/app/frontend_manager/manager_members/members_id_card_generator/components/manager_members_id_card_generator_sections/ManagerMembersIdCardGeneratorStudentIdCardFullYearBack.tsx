'use client';
// RESPONSIBILITY: Render the FULL YEAR / ANNUAL plan back ID card — Ultra Pro Champagne Edition with UV pattern, wave holo patch, embossed serial, and gold tier badge.
import type { IdCardData } from '@/app/frontend_manager/manager_members/members_id_card_generator/types/ManagerMembersIdCardGeneratorComponentTypes';

export interface ManagerMembersIdCardGeneratorStudentIdCardFullYearBackProps {
  data: IdCardData;
  className?: string;
}

function FyQrSvgBack({ code }: { code: string }) {
  const safeCode = code || 'LIB-0000';
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 25 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
      aria-label={`Lost card QR for ${safeCode}`}
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
      <rect x="10" y="4" width="1" height="1" fill="#05080F" />
      <rect x="13" y="4" width="1" height="1" fill="#05080F" />
      <rect x="4" y="11" width="1" height="1" fill="#05080F" />
      <rect x="10" y="11" width="2" height="2" fill="#05080F" rx="0.3" />
      <rect x="13" y="11" width="2" height="1" fill="#05080F" rx="0.3" />
      <rect x="16" y="11" width="1" height="2" fill="#05080F" rx="0.3" />
      <rect x="10" y="14" width="2" height="1" fill="#05080F" rx="0.3" />
      <rect x="16" y="14" width="2" height="1" fill="#05080F" rx="0.3" />
      <rect x="10" y="16" width="1" height="2" fill="#05080F" rx="0.3" />
      <rect x="13" y="16" width="2" height="2" fill="#05080F" rx="0.3" />
      <rect x="10" y="19" width="2" height="2" fill="#05080F" rx="0.3" />
      <rect x="16" y="19" width="2" height="2" fill="#05080F" rx="0.8" />
      <rect x="17" y="20" width="1" height="1" fill="#FFFFFF" rx="0.2" />
    </svg>
  );
}

export const DEFAULT_LIBRARY_RULES = [
  'Strict silence in study zones',
  'ID card mandatory for entry',
  'Keep mobile phones on silent',
  'No outside food or drinks',
  'Non-transferable smart pass',
];

const DEFAULT_RULES = DEFAULT_LIBRARY_RULES;

function FyWifiQrSvgBack({ ssid, password }: { ssid?: string; password?: string }) {
  const wifiPayload = `WIFI:S:${ssid || 'Library_5G'};T:WPA;P:${password || 'study2026'};;`;
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 25 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
      aria-label={`Wi-Fi Access QR: ${wifiPayload}`}
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
      <rect x="10" y="4" width="1" height="1" fill="#05080F" />
      <rect x="13" y="4" width="1" height="1" fill="#05080F" />
      <rect x="4" y="11" width="1" height="1" fill="#05080F" />
      <rect x="10" y="11" width="2" height="2" fill="#05080F" rx="0.3" />
      <rect x="13" y="11" width="2" height="1" fill="#05080F" rx="0.3" />
      <rect x="16" y="11" width="1" height="2" fill="#05080F" rx="0.3" />
      <rect x="10" y="14" width="2" height="1" fill="#05080F" rx="0.3" />
      <rect x="16" y="14" width="2" height="1" fill="#05080F" rx="0.3" />
      <rect x="10" y="16" width="1" height="2" fill="#05080F" rx="0.3" />
      <rect x="13" y="16" width="2" height="2" fill="#05080F" rx="0.3" />
      <rect x="10" y="19" width="2" height="2" fill="#05080F" rx="0.3" />
      <rect x="16" y="19" width="2" height="2" fill="#05080F" rx="0.8" />
      <rect x="17" y="20" width="1" height="1" fill="#FFFFFF" rx="0.2" />
    </svg>
  );
}

export function ManagerMembersIdCardGeneratorStudentIdCardFullYearBack({
  data,
  className = '',
}: ManagerMembersIdCardGeneratorStudentIdCardFullYearBackProps) {
  const rules = data.rules && data.rules.length > 0 ? data.rules : DEFAULT_RULES;
  const helpdeskPhone = data.helpdeskPhone || '+91 98765 43210';
  const wifiSsid = data.wifiSsid || 'Central_Library_5G';
  const batch = (data as any).batch || 'BATCH-24-Q4';
  const serial = (data as any).serial || `SN-${data.smartId}`;

  return (
    <div
      className={`fy-card fy-card-back mgr-idcard ${className}`}
      id="student-id-card-back-print"
      data-testid="student-id-card-back"
    >
      <div className="fy-guilloche" aria-hidden="true" />
      <div className="fy-silk" aria-hidden="true" />
      <div className="fy-scan" aria-hidden="true" />
      <div className="fy-uv-pattern" aria-hidden="true" />
      <div className="fy-watermark" aria-hidden="true">LIB</div>
      <div className="fy-holo-patch" aria-hidden="true">
        <div className="fy-holo-wave" />
      </div>

      {/* Magnetic Stripe */}
      <div className="fy-mag-stripe" aria-hidden="true">
        <span className="fy-mag-stripe-text">◄ VIP BLACK PLATINUM MEMBER · SECURITY PASS ►</span>
      </div>

      {/* Back Top Row */}
      <div className="fy-back-top">
        <div className="fy-back-brand-small">
          <div className="fy-back-brand-name">STUDY LIB OS</div>
          <div className="fy-back-serial">S/N {serial}</div>
        </div>
        <div className="fy-tier-badge">
          <span className="fy-tier-crown">💎</span>
          <span className="fy-tier-label">BLACK PLATINUM</span>
        </div>
      </div>

      {/* Signature Strip */}
      <div className="fy-signature-strip">
        <span className="fy-sig-text">R. Sharma</span>
        <span className="fy-sig-label">Authorized Signature</span>
      </div>

      {/* 2-col Content */}
      <div className="fy-back-content">
        <div className="fy-back-card">
          <div className="fy-back-card-title">📋 Library Rules</div>
          <ul className="fy-rules-list">
            {rules.slice(0, 5).map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
        </div>
        {/* Right Card: High-Speed Study Wi-Fi Pass */}
        <div className="fy-back-card flex flex-col justify-between items-center text-center">
          <div className="fy-back-card-title fy-back-card-title-cyan w-full justify-center">
            <span>📶</span>
            <span>Study Wi-Fi Pass</span>
          </div>
          <div className="w-[44px] h-[44px] p-1 bg-white rounded-md shadow-md flex items-center justify-center my-0.5">
            <FyWifiQrSvgBack ssid={wifiSsid} password={(data as any).wifiPassword} />
          </div>
          <div className="flex flex-col items-center gap-0.5 leading-tight">
            <span className="text-[6.5px] font-bold text-sky-300">Scan to Auto-Connect</span>
            <span className="text-[5.5px] text-slate-400 font-mono">Helpline: {helpdeskPhone}</span>
          </div>
        </div>
      </div>

      {/* Back Bottom Footer */}
      <div className="fy-back-bottom">
        <div className="flex items-center gap-2 text-[6.5px] text-slate-400">
          <span className="font-semibold text-slate-300">Desk:</span>
          <span className="font-mono text-emerald-300">{helpdeskPhone}</span>
          <span className="text-slate-600">·</span>
          <span>help@lib.os</span>
        </div>
        <div className="fy-copyright">
          <div><strong>© 2024 STUDY LIB OS</strong></div>
          <div>All Rights Reserved · {batch}</div>
        </div>
      </div>

      <div className="fy-micro-footer" aria-hidden="true" />
    </div>
  );
}

export default ManagerMembersIdCardGeneratorStudentIdCardFullYearBack;
