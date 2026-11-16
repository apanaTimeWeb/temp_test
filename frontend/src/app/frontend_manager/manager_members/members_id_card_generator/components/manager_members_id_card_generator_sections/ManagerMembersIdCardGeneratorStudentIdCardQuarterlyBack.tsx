'use client';
// RESPONSIBILITY: Render the QUARTERLY plan back ID card — Gold foil back with magnetic stripe, holographic patch, tier badge, signature strip, rules & contact grid.
import React from 'react';
import type { IdCardData } from '@/app/frontend_manager/manager_members/members_id_card_generator/types/ManagerMembersIdCardGeneratorComponentTypes';

export interface ManagerMembersIdCardGeneratorStudentIdCardQuarterlyBackProps {
  data: IdCardData;
  className?: string;
}

function QtrQrSvgBack({ code }: { code: string }) {
  const safeCode = code || 'LIB-0000';
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 25 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label={`Lost card QR for ${safeCode}`}
      className="w-full h-full block"
    >
      <rect width="25" height="25" rx="2" fill="#FFFFFF" />
      <rect x="2" y="2" width="7" height="7" fill="#0F172A" rx="1.2" />
      <rect x="3" y="3" width="5" height="5" fill="#FFFFFF" rx="0.5" />
      <rect x="4" y="4" width="3" height="3" fill="#0F172A" rx="0.6" />
      <rect x="16" y="2" width="7" height="7" fill="#0F172A" rx="1.2" />
      <rect x="17" y="3" width="5" height="5" fill="#FFFFFF" rx="0.5" />
      <rect x="18" y="4" width="3" height="3" fill="#0F172A" rx="0.6" />
      <rect x="2" y="16" width="7" height="7" fill="#0F172A" rx="1.2" />
      <rect x="3" y="17" width="5" height="5" fill="#FFFFFF" rx="0.5" />
      <rect x="4" y="18" width="3" height="3" fill="#0F172A" rx="0.6" />
      <rect x="10" y="4" width="1" height="1" fill="#0F172A" />
      <rect x="13" y="4" width="1" height="1" fill="#0F172A" />
      <rect x="4" y="11" width="1" height="1" fill="#0F172A" />
      <rect x="4" y="13" width="1" height="1" fill="#0F172A" />
      <rect x="10" y="11" width="2" height="2" fill="#0F172A" rx="0.3" />
      <rect x="13" y="11" width="2" height="1" fill="#0F172A" rx="0.3" />
      <rect x="16" y="11" width="1" height="2" fill="#0F172A" rx="0.3" />
      <rect x="10" y="14" width="2" height="1" fill="#0F172A" rx="0.3" />
      <rect x="16" y="14" width="2" height="1" fill="#0F172A" rx="0.3" />
      <rect x="10" y="16" width="1" height="2" fill="#0F172A" rx="0.3" />
      <rect x="13" y="16" width="2" height="2" fill="#0F172A" rx="0.3" />
      <rect x="10" y="19" width="2" height="2" fill="#0F172A" rx="0.3" />
      <rect x="16" y="19" width="2" height="2" fill="#0F172A" rx="0.8" />
      <rect x="17" y="20" width="1" height="1" fill="#FFFFFF" rx="0.2" />
    </svg>
  );
}

const DEFAULT_RULES = [
  'Maintain strict silence inside reading halls and study zones.',
  'ID card is mandatory for entry turnstiles and counter verification.',
  'Mobile phones must remain in silent mode at all times.',
  'Outside food, drinks, smoking, and seat reservation prohibited.',
  'Non-transferable. Report lost cards immediately to library desk.',
];

function QtrWifiQrSvgBack({ ssid, password }: { ssid?: string; password?: string }) {
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

export function ManagerMembersIdCardGeneratorStudentIdCardQuarterlyBack({
  data,
  className = '',
}: ManagerMembersIdCardGeneratorStudentIdCardQuarterlyBackProps) {
  const rules = data.rules && data.rules.length > 0 ? data.rules : DEFAULT_RULES;
  const helpdeskPhone = data.helpdeskPhone || '+91 98765 43210';
  const wifiSsid = data.wifiSsid || 'Central_Library_5G';
  const batch = (data as any).batch || 'BATCH-24-Q4';
  const serial = (data as any).serial || `SN-${data.smartId}`;

  return (
    <div
      className={`qtr-card qtr-card-back mgr-idcard ${className}`}
      id="student-id-card-back-print"
      data-testid="student-id-card-back"
    >
      {/* Grain */}
      <div className="qtr-grain" aria-hidden="true" />
      {/* Watermark */}
      <div className="qtr-watermark" aria-hidden="true">LIB</div>
      {/* Holo Patch */}
      <div className="qtr-holo-patch" aria-hidden="true" />

      {/* Magnetic Stripe */}
      <div className="qtr-mag-stripe" aria-hidden="true">
        <span className="qtr-mag-stripe-text">◄ AUTHORIZED LIBRARY MEMBER · SECURITY STRIPE ►</span>
      </div>

      {/* Back Top Row */}
      <div className="qtr-back-top">
        <div className="qtr-back-brand">
          <div className="qtr-back-brand-name">STUDY LIB OS</div>
          <div className="qtr-back-serial">S/N {serial}</div>
        </div>
        <div className="qtr-tier-badge">
          <span className="qtr-tier-crown">👑</span>
          <span className="qtr-tier-label">GOLD</span>
        </div>
      </div>

      {/* Signature Strip */}
      <div className="qtr-sig-strip">
        <span className="qtr-sig-text">R. Sharma</span>
        <span className="qtr-sig-label">Authorized Signature</span>
      </div>

      {/* 2-col Content */}
      <div className="qtr-back-content">
        {/* Rules */}
        <div className="qtr-back-card">
          <div className="qtr-back-card-title">📋 Library Rules</div>
          <ul className="qtr-rules-list">
            {rules.slice(0, 5).map((rule, idx) => (
              <li key={idx}>{rule}</li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div className="qtr-back-card">
          <div className="qtr-back-card-title qtr-back-card-title-cyan">📞 Emergency &amp; Support</div>
          <div className="qtr-contact-list">
            <div className="qtr-contact-row">
              <span className="qtr-contact-lbl">Helpline</span>
              <span className="qtr-contact-val">{helpdeskPhone}</span>
            </div>
            <div className="qtr-contact-row">
              <span className="qtr-contact-lbl">Email</span>
              <span className="qtr-contact-val">help@lib.os</span>
            </div>
            <div className="qtr-contact-row">
              <span className="qtr-contact-lbl">Network</span>
              <span className="qtr-contact-val">Scan Wi-Fi QR</span>
            </div>
            <div className="qtr-contact-row">
              <span className="qtr-contact-lbl">Batch</span>
              <span className="qtr-contact-val">{batch}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Back Bottom (Wi-Fi Quick Connect QR) */}
      <div className="qtr-back-bottom">
        <div className="qtr-lost-wrap">
          <div className="qtr-lost-qr">
            <QtrWifiQrSvgBack ssid={wifiSsid} password={(data as any).wifiPassword} />
          </div>
          <div className="qtr-lost-label">
            <div className="qtr-lost-title">📶 Wi-Fi Access</div>
            <div className="qtr-lost-sub">Scan to connect instantly</div>
          </div>
        </div>
        <div className="qtr-copyright">
          <div><strong>© 2024 STUDY LIB OS</strong></div>
          <div>All Rights Reserved · {batch}</div>
        </div>
      </div>

      {/* Micro footer */}
      <div className="qtr-micro-footer" aria-hidden="true" />
    </div>
  );
}

export default ManagerMembersIdCardGeneratorStudentIdCardQuarterlyBack;
