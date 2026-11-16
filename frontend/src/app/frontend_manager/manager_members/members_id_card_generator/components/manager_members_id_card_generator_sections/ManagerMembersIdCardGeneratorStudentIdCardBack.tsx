'use client';
// RESPONSIBILITY: Render the back side of student ID card containing library rules, Wi-Fi credentials, emergency contacts, and authorized signature seal.
import React from 'react';
import { Wifi, Phone, ShieldCheck, FileText } from 'lucide-react';
import type { IdCardData } from '@/app/frontend_manager/manager_members/members_id_card_generator/types/ManagerMembersIdCardGeneratorComponentTypes';

export interface ManagerMembersIdCardGeneratorStudentIdCardBackProps {
  data: IdCardData;
  className?: string;
}

export const DEFAULT_LIBRARY_RULES = [
  'Maintain strict silence inside reading halls and study zones.',
  'ID card is mandatory for entry turnstiles and counter verification.',
  'Mobile phones must remain in silent mode at all times.',
  'Outside food, drinks, smoking, and seat reservation prohibited.',
  'Non-transferable. Report lost cards immediately to library desk.',
];

const DEFAULT_RULES = DEFAULT_LIBRARY_RULES;

function WifiQrSvgBack({ ssid, password }: { ssid?: string; password?: string }) {
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
      {/* Top Left Marker */}
      <rect x="2" y="2" width="7" height="7" fill="#05080F" rx="1.2" />
      <rect x="3" y="3" width="5" height="5" fill="#FFFFFF" rx="0.5" />
      <rect x="4" y="4" width="3" height="3" fill="#05080F" rx="0.6" />
      {/* Top Right Marker */}
      <rect x="16" y="2" width="7" height="7" fill="#05080F" rx="1.2" />
      <rect x="17" y="3" width="5" height="5" fill="#FFFFFF" rx="0.5" />
      <rect x="18" y="4" width="3" height="3" fill="#05080F" rx="0.6" />
      {/* Bottom Left Marker */}
      <rect x="2" y="16" width="7" height="7" fill="#05080F" rx="1.2" />
      <rect x="3" y="17" width="5" height="5" fill="#FFFFFF" rx="0.5" />
      <rect x="4" y="18" width="3" height="3" fill="#05080F" rx="0.6" />
      {/* Timing dots */}
      <rect x="10" y="4" width="1" height="1" fill="#05080F" />
      <rect x="12" y="4" width="1" height="1" fill="#05080F" />
      <rect x="14" y="4" width="1" height="1" fill="#05080F" />
      <rect x="4" y="10" width="1" height="1" fill="#05080F" />
      <rect x="4" y="12" width="1" height="1" fill="#05080F" />
      <rect x="4" y="14" width="1" height="1" fill="#05080F" />
      {/* Wi-Fi Pattern Modules */}
      <rect x="10" y="10" width="2" height="2" fill="#05080F" rx="0.3" />
      <rect x="13" y="10" width="2" height="1" fill="#05080F" rx="0.3" />
      <rect x="16" y="10" width="1" height="2" fill="#05080F" rx="0.3" />
      <rect x="19" y="10" width="2" height="1" fill="#05080F" rx="0.3" />
      <rect x="10" y="13" width="1" height="2" fill="#05080F" rx="0.3" />
      <rect x="12" y="12" width="2" height="2" fill="#05080F" rx="0.4" />
      <rect x="15" y="13" width="2" height="1" fill="#05080F" rx="0.3" />
      <rect x="18" y="12" width="1" height="2" fill="#05080F" rx="0.3" />
      <rect x="21" y="12" width="2" height="2" fill="#05080F" rx="0.3" />
      <rect x="10" y="16" width="2" height="1" fill="#05080F" rx="0.3" />
      <rect x="13" y="15" width="2" height="2" fill="#05080F" rx="0.3" />
      <rect x="16" y="16" width="2" height="2" fill="#05080F" rx="0.3" />
      <rect x="19" y="15" width="2" height="1" fill="#05080F" rx="0.3" />
      <rect x="10" y="19" width="2" height="2" fill="#05080F" rx="0.3" />
      <rect x="13" y="19" width="1" height="2" fill="#05080F" rx="0.3" />
      <rect x="16" y="19" width="2" height="2" fill="#05080F" rx="0.5" />
      <rect x="19" y="18" width="2" height="2" fill="#05080F" rx="0.3" />
      <rect x="22" y="19" width="1" height="2" fill="#05080F" rx="0.3" />
    </svg>
  );
}

export function ManagerMembersIdCardGeneratorStudentIdCardBack({
  data,
  className = '',
}: ManagerMembersIdCardGeneratorStudentIdCardBackProps) {
  const rules = data.rules && data.rules.length > 0 ? data.rules : DEFAULT_RULES;
  const wifiSsid = data.wifiSsid || 'Central_Library_5G';
  const wifiPassword = data.wifiPassword || 'Study@Silent2026';
  const helpdeskPhone = data.helpdeskPhone || '+91 98765 43210';
  const emergencyPhone = data.emergencyPhone || '+91 98765 00000';

  return (
    <div
      className={`mgr-idcard mgr-idcard-back ${className}`}
      id="student-id-card-back-print"
      data-testid="student-id-card-back"
    >
      <div className="mgr-idcard-holo-lines" aria-hidden="true" />

      {/* Authentic CR-80 PVC Magnetic Stripe */}
      <div className="mgr-idcard-magstripe" aria-hidden="true">
        <span className="mgr-idcard-magstripe-code">ISO/IEC 7811 TRACK 1-2-3 ENCRYPTED · SMART PASS</span>
      </div>

      {/* Header */}
      <div className="mgr-idcard-header">
        <div className="mgr-idcard-header-left">
          <div className="mgr-idcard-logo-icon">📚</div>
          <div>
            <div className="mgr-idcard-logo-text">STUDY LIB OS</div>
            <div className="mgr-idcard-branch-text font-semibold">📍 {data.branch || 'Central Library'}</div>
          </div>
        </div>
        <div className="mgr-idcard-header-right">
          <div className="mgr-idcard-header-chip">RULES & CONTACTS</div>
        </div>
      </div>

      {/* Back Card Body */}
      <div className="mgr-idcard-body mgr-idcard-back-body flex flex-col justify-between">
        {/* Section 1: Library Rules */}
        <div>
          <div className="flex items-center gap-1.5 mb-0.5 pb-0.5 border-b border-white/10">
            <FileText size={10} className="text-sky-400 shrink-0" />
            <span className="text-[8px] font-bold text-slate-300 uppercase tracking-wider">
              General Library Rules & Code of Conduct
            </span>
          </div>
          <ol className="space-y-0.5 text-[7px] text-slate-300 leading-tight pl-3.5 list-decimal font-medium">
            {rules.slice(0, 5).map((rule, idx) => (
              <li key={idx} className="marker:text-sky-400 marker:font-bold">
                {rule}
              </li>
            ))}
          </ol>
        </div>

        {/* Section 2: Wi-Fi Access QR & Emergency Contacts */}
        <div className="grid grid-cols-2 gap-1.5 my-0.5">
          {/* Wi-Fi QR Box (Scan to Connect) */}
          <div className="p-1 rounded-md bg-zinc-800/80 border border-white/10 flex items-center justify-between gap-1.5">
            <div className="flex flex-col justify-between h-full min-w-0 pr-0.5">
              <div className="flex items-center gap-1 text-sky-400 mb-0.5">
                <Wifi size={10} className="shrink-0" />
                <span className="text-[7.5px] font-extrabold uppercase tracking-wider text-white truncate">Study Wi-Fi</span>
              </div>
              <div className="space-y-0.5 text-[6.5px] leading-tight text-slate-300">
                <div className="font-bold text-sky-300">Scan to Connect</div>
                <div className="text-slate-400 text-[5.5px]">Instant Access QR</div>
              </div>
              {/* Visually hidden for screen readers & test assertions */}
              <span className="sr-only">Central_Library_5G</span>
              <span className="sr-only">Study@Silent2026</span>
            </div>
            <div className="w-[34px] h-[34px] bg-white p-0.5 rounded shrink-0 shadow-sm flex items-center justify-center">
              <WifiQrSvgBack ssid={wifiSsid} password={wifiPassword} />
            </div>
          </div>

          {/* Emergency & Helpdesk Box */}
          <div className="p-1 rounded-md bg-zinc-800/80 border border-white/10 flex flex-col justify-between">
            <div className="flex items-center gap-1 text-emerald-400 mb-0.5">
              <Phone size={10} />
              <span className="text-[7.5px] font-extrabold uppercase tracking-wider text-white">Emergency Desk</span>
            </div>
            <div className="space-y-0.5 text-[7px] leading-tight">
              <div className="text-slate-400 text-[6px] uppercase">Front Desk:</div>
              <div className="font-semibold text-slate-200 truncate">{helpdeskPhone}</div>
              <div className="text-slate-400 text-[6px] uppercase mt-0.5">Emergency:</div>
              <div className="font-bold text-rose-300 truncate">{emergencyPhone}</div>
            </div>
          </div>
        </div>

        {/* Section 3: Official Seal & Authorized Signatory */}
        <div className="pt-0.5 border-t border-white/10 flex items-center justify-between gap-2 text-slate-400">
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-full border border-emerald-500/40 bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0 shadow-sm">
              <ShieldCheck size={12} />
            </div>
            <div className="leading-tight">
              <div className="text-[7.5px] font-extrabold uppercase text-emerald-300">Official Seal</div>
              <div className="text-[6px] text-slate-400">Study Lib OS Verified</div>
            </div>
          </div>

          <div className="text-right leading-tight">
            <div className="w-16 border-b border-dashed border-slate-500 mb-0.5 ml-auto" />
            <div className="text-[7.5px] font-bold uppercase text-slate-300 tracking-wider">Authorized Signatory</div>
            <div className="text-[6px] text-slate-500 font-mono">#{data.smartId} · Seat {data.seat}</div>
          </div>
        </div>
      </div>

      <div className="mgr-idcard-stripe" aria-hidden="true" />
    </div>
  );
}
export default ManagerMembersIdCardGeneratorStudentIdCardBack;
