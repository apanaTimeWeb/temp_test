'use client';
// RESPONSIBILITY: Render the HALF-YEARLY plan back ID card — Signature Edition with magnetic stripe, holo patch, tier badge, signature strip, and rules/contacts.
import React from 'react';
import type { IdCardData } from '@/app/frontend_manager/manager_members/members_id_card_generator/types/ManagerMembersIdCardGeneratorComponentTypes';

export interface ManagerMembersIdCardGeneratorStudentIdCardHalfYearlyBackProps {
  data: IdCardData;
  className?: string;
}

function HyQrSvgBack({ code }: { code: string }) {
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

function HyWifiQrSvgBack({ ssid, password }: { ssid?: string; password?: string }) {
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

export function ManagerMembersIdCardGeneratorStudentIdCardHalfYearlyBack({
  data,
  className = '',
}: ManagerMembersIdCardGeneratorStudentIdCardHalfYearlyBackProps) {
  const rules = data.rules && data.rules.length > 0 ? data.rules : DEFAULT_RULES;
  const helpdeskPhone = data.helpdeskPhone || '+91 98765 43210';
  const wifiSsid = data.wifiSsid || 'Central_Library_5G';
  const batch = (data as any).batch || 'BATCH-24-Q4';
  const serial = (data as any).serial || `SN-${data.smartId}`;

  return (
    <div
      className={`hy-card hy-card-back mgr-idcard ${className}`}
      id="student-id-card-back-print"
      data-testid="student-id-card-back"
    >
      <div className="hy-guilloche" aria-hidden="true" />
      <div className="hy-grain" aria-hidden="true" />
      <div className="hy-scan" aria-hidden="true" />
      <div className="hy-watermark" aria-hidden="true">LIB</div>
      <div className="hy-holo-patch" aria-hidden="true" />

      {/* Magnetic Stripe */}
      <div className="hy-mag-stripe" aria-hidden="true">
        <span className="hy-mag-stripe-text">◄ AUTHORIZED MEMBER · SECURITY STRIPE ►</span>
      </div>

      {/* Back Top Row */}
      <div className="hy-back-top">
        <div className="hy-back-brand-small">
          <div className="hy-back-brand-name">STUDY LIB OS</div>
          <div className="hy-back-serial">S/N {serial}</div>
        </div>
        <div className="hy-tier-badge">
          <span className="hy-tier-crown">💎</span>
          <span className="hy-tier-label">EMERALD</span>
        </div>
      </div>

      {/* Signature Strip */}
      <div className="hy-signature-strip">
        <span className="hy-sig-text">R. Sharma</span>
        <span className="hy-sig-label">Authorized Signature</span>
      </div>

      {/* 2-col Content */}
      <div className="hy-back-content">
        <div className="hy-back-card">
          <div className="hy-back-card-title">📋 Library Rules</div>
          <ul className="hy-rules-list">
            {rules.slice(0, 5).map((rule, idx) => (
              <li key={idx}>{rule}</li>
            ))}
          </ul>
        </div>
        {/* Right Card: High-Speed Study Wi-Fi Pass */}
        <div className="hy-back-card flex flex-col justify-between items-center text-center">
          <div className="hy-back-card-title hy-back-card-title-cyan w-full justify-center">
            <span>📶</span>
            <span>Study Wi-Fi Pass</span>
          </div>
          <div className="w-[44px] h-[44px] p-1 bg-white rounded-md shadow-md flex items-center justify-center my-0.5">
            <HyWifiQrSvgBack ssid={wifiSsid} password={(data as any).wifiPassword} />
          </div>
          <div className="flex flex-col items-center gap-0.5 leading-tight">
            <span className="text-[6.5px] font-bold text-sky-300">Scan to Auto-Connect</span>
            <span className="text-[5.5px] text-slate-400 font-mono">Helpline: {helpdeskPhone}</span>
          </div>
        </div>
      </div>

      {/* Back Bottom Footer */}
      <div className="hy-back-bottom">
        <div className="flex items-center gap-2 text-[6.5px] text-slate-400">
          <span className="font-semibold text-slate-300">Desk:</span>
          <span className="font-mono text-emerald-300">{helpdeskPhone}</span>
          <span className="text-slate-600">·</span>
          <span>help@lib.os</span>
        </div>
        <div className="hy-copyright">
          <div><strong>© 2024 STUDY LIB OS</strong></div>
          <div>All Rights Reserved · {batch}</div>
        </div>
      </div>

      <div className="hy-micro-footer" aria-hidden="true" />
    </div>
  );
}

export default ManagerMembersIdCardGeneratorStudentIdCardHalfYearlyBack;
