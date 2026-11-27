'use client';

import { DEFAULT_BRANCH_CURRENCY } from '@/app/frontend_manager/manager_settings/settings_branch_info/config/manager_settings_branch_info.demo_data';
import type { ManagerSettingsBranchInfoDraft } from '@/app/frontend_manager/manager_settings/settings_branch_info/schemas/ManagerSettingsBranchInfoSchema';
import { Check, Clock, Compass, Copy, MapPin, Moon, Sun } from 'lucide-react';

interface ManagerSettingsBranchInfoFacilityCardProps {
  branchData: ManagerSettingsBranchInfoDraft;
  copiedKey: string | null;
  onCopy: (text: string, label: string, key: string) => void;
}

/** Regional parameters, shift breakdown, and physical address panel. */
export function ManagerSettingsBranchInfoFacilityCard({
  branchData,
  copiedKey,
  onCopy,
}: ManagerSettingsBranchInfoFacilityCardProps) {
  return (
    <div className="lg:col-span-7 space-y-4">
      <div className="mgr-branch-card-surface rounded-xl border p-4 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
          <div className="flex items-center gap-2">
            <Compass size={15} className="text-amber-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Facility &amp; Regional Parameters
            </h3>
          </div>
          <span className="text-[10px] font-mono text-slate-400">Read-Only</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
          <div className="p-2.5 rounded-lg bg-amber-500/5 border border-amber-500/20 flex flex-col justify-between">
            <span className="text-[10px] text-amber-300 font-medium">Branch Code</span>
            <div className="flex items-center justify-between mt-1">
              <span className="font-mono font-bold text-amber-300">{branchData.branchCode}</span>
              <button
                type="button"
                onClick={() => onCopy(branchData.branchCode, 'Code', 'inner_code')}
                className="text-amber-400 hover:text-amber-300 cursor-pointer p-0.5"
                title="Copy code"
              >
                {copiedKey === 'inner_code' ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
              </button>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-purple-500/5 border border-purple-500/20 flex flex-col justify-between">
            <span className="text-[10px] text-purple-300 font-medium">Facility Classification</span>
            <span className="font-bold text-purple-200 mt-1">{branchData.libraryType || 'Private Study Hub'}</span>
          </div>

          <div className="p-2.5 rounded-lg bg-cyan-500/5 border border-cyan-500/20 flex flex-col justify-between">
            <span className="text-[10px] text-cyan-300 font-medium">Time Zone (IST)</span>
            <span className="font-semibold text-cyan-200 mt-1">{branchData.timezone || 'Asia/Kolkata (IST)'}</span>
          </div>

          <div className="p-2.5 rounded-lg bg-emerald-500/5 border border-emerald-500/20 flex flex-col justify-between">
            <span className="text-[10px] text-emerald-300 font-medium">Billing Currency</span>
            <span className="font-bold font-mono text-emerald-300 mt-1">{branchData.currency || DEFAULT_BRANCH_CURRENCY}</span>
          </div>
        </div>

        <div className="space-y-2 pt-1 border-t border-slate-800">
          <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
            <Clock size={12} className="text-cyan-400" />
            <span>Operating Shift Slots</span>
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            <div className="p-2.5 rounded-lg bg-amber-500/5 border border-amber-500/20">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-amber-300 uppercase tracking-wide">
                <Sun size={11} /> Morning Shift
              </div>
              <span className="font-bold text-white block text-xs mt-1">06:00 AM – 02:00 PM</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">8h Duration</span>
            </div>

            <div className="p-2.5 rounded-lg bg-purple-500/5 border border-purple-500/20">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-purple-300 uppercase tracking-wide">
                <Moon size={11} /> Evening Shift
              </div>
              <span className="font-bold text-white block text-xs mt-1">02:00 PM – 10:00 PM</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">8h Duration</span>
            </div>

            <div className="p-2.5 rounded-lg bg-cyan-500/5 border border-cyan-500/20">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-cyan-300 uppercase tracking-wide">
                <Clock size={11} /> Full Day (24h)
              </div>
              <span className="font-bold text-white block text-xs mt-1">Dedicated Desks</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Reserved Seat</span>
            </div>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
              <MapPin size={12} className="text-amber-400" />
              <span>Physical Address</span>
            </span>
            <button
              type="button"
              onClick={() => onCopy(branchData.address, 'Address', 'address_btn')}
              className="text-[11px] text-amber-400 hover:text-amber-300 font-medium inline-flex items-center gap-1 cursor-pointer"
            >
              {copiedKey === 'address_btn' ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
              <span>{copiedKey === 'address_btn' ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed font-sans">
            {branchData.address}
          </p>
        </div>
      </div>
    </div>
  );
}
