'use client';

import type { ManagerSettingsBranchInfoDraft } from '@/app/frontend_manager/manager_settings/settings_branch_info/schemas/ManagerSettingsBranchInfoSchema';
import { ArrowUpRight, Calendar, Clock, History, LifeBuoy, Mail, Phone, PhoneCall, User } from 'lucide-react';

/** Branch contact channels and manager administration audit summary cards. */
export function ManagerSettingsBranchInfoContactsAndAudit({ branchData }: { branchData: ManagerSettingsBranchInfoDraft }) {
  return (
    <>
      <div className="mgr-branch-card-surface rounded-xl border p-4 space-y-3.5 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
          <div className="flex items-center gap-2">
            <PhoneCall size={15} className="text-cyan-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Contact &amp; Support Channels
            </h3>
          </div>
          <span className="text-[10px] font-semibold text-emerald-400">Direct Lines</span>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-sky-500/5 border border-sky-500/20 gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-md bg-sky-500/15 text-sky-400 flex items-center justify-center shrink-0">
                <Phone size={13} />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] text-slate-400 block">Branch Contact</span>
                <span className="font-mono font-bold text-white text-xs truncate block">{branchData.phone}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-lg bg-indigo-500/5 border border-indigo-500/20 gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-md bg-indigo-500/15 text-indigo-400 flex items-center justify-center shrink-0">
                <Mail size={13} />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] text-slate-400 block">Branch Email</span>
                <span className="font-medium text-white text-xs truncate block">{branchData.email}</span>
              </div>
            </div>
            <a
              href={`mailto:${branchData.email}`}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 text-[11px] font-semibold motion-safe:transition-all shrink-0 cursor-pointer"
            >
              <span>Email</span>
              <ArrowUpRight size={11} />
            </a>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-lg bg-rose-500/5 border border-rose-500/20 gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-md bg-rose-500/15 text-rose-400 flex items-center justify-center shrink-0">
                <PhoneCall size={13} />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] text-rose-300 font-medium block">Helpline / Support</span>
                <span className="font-mono font-bold text-white text-xs truncate block">{branchData.supportPhone}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-lg bg-teal-500/5 border border-teal-500/20 gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-md bg-teal-500/15 text-teal-400 flex items-center justify-center shrink-0">
                <LifeBuoy size={13} />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] text-teal-300 font-medium block">Support Desk</span>
                <span className="font-medium text-white text-xs truncate block">{branchData.supportEmail}</span>
              </div>
            </div>
            <a
              href={`mailto:${branchData.supportEmail}`}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 text-[11px] font-semibold motion-safe:transition-all shrink-0 cursor-pointer"
            >
              <span>Ticket</span>
              <ArrowUpRight size={11} />
            </a>
          </div>
        </div>
      </div>

      <div className="mgr-branch-card-surface rounded-xl border p-4 space-y-3 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <User size={15} className="text-amber-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Administration &amp; Audit
            </h3>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 font-semibold">Authorized</span>
        </div>

        <div className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-900 border border-slate-800">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-500/20 to-purple-500/20 border border-amber-500/30 text-amber-300 flex items-center justify-center font-bold text-xs shrink-0">
            {branchData.managerName
              ? branchData.managerName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
              : 'M'}
          </div>
          <div className="min-w-0 flex-1 leading-tight">
            <span className="text-xs font-bold text-white block truncate">{branchData.managerName}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Designated Branch Facility Manager</span>
          </div>
        </div>

        <div className="space-y-1.5 text-[11px] pt-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="flex items-center gap-1.5">
              <Calendar size={12} className="text-amber-400" />
              <span>Establishment Date:</span>
            </span>
            <span className="font-semibold text-slate-200">{branchData.establishmentDate || '15 Aug 2021'}</span>
          </div>

          <div className="flex items-center justify-between text-slate-400">
            <span className="flex items-center gap-1.5">
              <History size={12} className="text-purple-400" />
              <span>Profile Created:</span>
            </span>
            <span className="font-semibold text-slate-200">{branchData.profileCreatedDate || '15 Jan 2023'}</span>
          </div>

          <div className="flex items-center justify-between text-slate-400">
            <span className="flex items-center gap-1.5">
              <Clock size={12} className="text-cyan-400" />
              <span>Last System Sync:</span>
            </span>
            <span className="font-semibold text-slate-200">{branchData.lastUpdatedDate || '25 Oct 2026'}</span>
          </div>
        </div>
      </div>
    </>
  );
}
