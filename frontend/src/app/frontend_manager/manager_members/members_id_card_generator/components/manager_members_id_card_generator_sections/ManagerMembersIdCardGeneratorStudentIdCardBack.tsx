'use client';
// RESPONSIBILITY: Render the back side of student ID card containing library rules, Wi-Fi credentials, emergency contacts, and authorized signature seal.
import React from 'react';
import { Wifi, Phone, ShieldCheck, FileText } from 'lucide-react';
import type { IdCardData } from '@/app/frontend_manager/manager_members/members_id_card_generator/types/ManagerMembersIdCardGeneratorComponentTypes';

export interface ManagerMembersIdCardGeneratorStudentIdCardBackProps {
  data: IdCardData;
  className?: string;
}

const DEFAULT_RULES = [
  'Maintain strict silence inside reading halls and study zones.',
  'ID card is mandatory for entry turnstiles and counter verification.',
  'Mobile phones must remain in silent mode; attend calls outside only.',
  'Outside food, smoking, and seat reservation without presence prohibited.',
  'Non-transferable. Report lost cards immediately to library administration.',
];

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
      <div className="mgr-idcard-body mgr-idcard-back-body flex flex-col justify-between" style={{ minHeight: '345px' }}>
        {/* Section 1: Library Rules */}
        <div>
          <div className="flex items-center gap-1.5 mb-2 pb-1 border-b border-white/10">
            <FileText size={13} className="text-sky-400 shrink-0" />
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">
              General Library Rules & Code of Conduct
            </span>
          </div>
          <ol className="space-y-1.5 text-[10px] text-slate-300 leading-snug pl-4 list-decimal font-medium">
            {rules.slice(0, 5).map((rule, idx) => (
              <li key={idx} className="marker:text-sky-400 marker:font-bold">
                {rule}
              </li>
            ))}
          </ol>
        </div>

        {/* Section 2: Wi-Fi Credentials & Emergency Contacts */}
        <div className="grid grid-cols-2 gap-2.5 my-2.5">
          {/* Wi-Fi Box */}
          <div className="p-2.5 rounded-xl bg-zinc-800/90 border border-white/10 flex flex-col justify-between">
            <div className="flex items-center gap-1.5 text-sky-400 mb-1">
              <Wifi size={13} />
              <span className="text-[9.5px] font-extrabold uppercase tracking-wider text-white">Study Wi-Fi</span>
            </div>
            <div className="space-y-0.5 font-mono text-[9.5px]">
              <div className="text-slate-400 text-[8px] uppercase font-sans">SSID:</div>
              <div className="font-bold text-sky-300 truncate" title={wifiSsid}>{wifiSsid}</div>
              <div className="text-slate-400 text-[8px] uppercase font-sans mt-1">Password:</div>
              <div className="font-bold text-amber-300 truncate" title={wifiPassword}>{wifiPassword}</div>
            </div>
          </div>

          {/* Emergency & Helpdesk Box */}
          <div className="p-2.5 rounded-xl bg-zinc-800/90 border border-white/10 flex flex-col justify-between">
            <div className="flex items-center gap-1.5 text-emerald-400 mb-1">
              <Phone size={13} />
              <span className="text-[9.5px] font-extrabold uppercase tracking-wider text-white">Emergency Desk</span>
            </div>
            <div className="space-y-0.5 text-[9.5px]">
              <div className="text-slate-400 text-[8px] uppercase">Front Desk:</div>
              <div className="font-semibold text-slate-200 truncate">{helpdeskPhone}</div>
              <div className="text-slate-400 text-[8px] uppercase mt-1">Emergency:</div>
              <div className="font-bold text-rose-300 truncate">{emergencyPhone}</div>
            </div>
          </div>
        </div>

        {/* Section 3: Official Seal & Authorized Signatory */}
        <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-3 text-slate-400">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full border border-emerald-500/40 bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck size={18} />
            </div>
            <div className="leading-tight">
              <div className="text-[9px] font-extrabold uppercase text-emerald-300">Official Seal</div>
              <div className="text-[8px] text-slate-400">Study Lib OS Verified</div>
            </div>
          </div>

          <div className="text-right">
            <div className="w-24 border-b border-dashed border-slate-500 mb-1 ml-auto" />
            <div className="text-[8.5px] font-bold uppercase text-slate-300 tracking-wider">Authorized Signatory</div>
            <div className="text-[7.5px] text-slate-500 font-mono">#{data.smartId} · Seat {data.seat}</div>
          </div>
        </div>
      </div>

      <div className="mgr-idcard-stripe" aria-hidden="true" />
    </div>
  );
}
export default ManagerMembersIdCardGeneratorStudentIdCardBack;
