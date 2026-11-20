'use client';
// RESPONSIBILITY: Render complete branch profile and operational details.
import { X, Building2, MapPin, Phone, Mail, Clock, Calendar, BookOpen, Armchair, Wallet, ShieldCheck } from 'lucide-react';
import type { SuperadminBranchRecord } from '@/app/frontend_superadmin/superadmin_branches/branches_overview/types/SuperadminBranchesOverviewTypes';

interface SuperadminBranchesOverviewDetailsModalProps {
  branch: SuperadminBranchRecord;
  onClose: () => void;
}

export default function SuperadminBranchesOverviewDetailsModal({ branch, onClose }: SuperadminBranchesOverviewDetailsModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl border border-indigo-500/40 bg-[#0d102b] p-6 shadow-2xl text-white">
        <button type="button" onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 pb-4 border-b border-indigo-500/20">
          <div className="p-2.5 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400">
            <Building2 size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">{branch.name}</h2>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">{branch.code}</span>
            </div>
            <p className="text-xs text-slate-400">Parent Organization: {branch.libraryName} ({branch.libraryId})</p>
          </div>
        </div>

        <div className="my-4 space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          {/* Status and Physical Asset Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl border border-indigo-500/20 bg-card/60">
              <p className="text-[11px] text-slate-400 uppercase font-semibold">Status</p>
              <p className="text-sm font-bold capitalize mt-1 text-emerald-400">{branch.status}</p>
            </div>
            <div className="p-3 rounded-xl border border-indigo-500/20 bg-card/60">
              <p className="text-[11px] text-slate-400 uppercase font-semibold">Seat Capacity</p>
              <p className="text-sm font-bold text-amber-300 mt-1 flex items-center gap-1"><Armchair size={14} />{branch.capacity} seats</p>
            </div>
            <div className="p-3 rounded-xl border border-indigo-500/20 bg-card/60">
              <p className="text-[11px] text-slate-400 uppercase font-semibold">Physical Books</p>
              <p className="text-sm font-bold text-cyan-300 mt-1 flex items-center gap-1"><BookOpen size={14} />{branch.physicalBooks} copies</p>
            </div>
            <div className="p-3 rounded-xl border border-indigo-500/20 bg-card/60">
              <p className="text-[11px] text-slate-400 uppercase font-semibold">Petty Cash</p>
              <p className="text-sm font-bold text-emerald-300 mt-1 flex items-center gap-1"><Wallet size={14} />₹{branch.cashBalance.toLocaleString()}</p>
            </div>
          </div>

          {/* Location & Contact */}
          <div className="p-4 rounded-xl border border-indigo-500/20 bg-card/40 space-y-2 text-xs">
            <p className="text-xs font-bold text-indigo-300 flex items-center gap-1.5"><MapPin size={13} /> Location & Address</p>
            <p className="text-slate-200">{branch.address}, {branch.city}, {branch.state} - {branch.pinCode}</p>
            <div className="flex items-center gap-4 text-slate-400 pt-1">
              <span className="flex items-center gap-1"><Phone size={12} />{branch.phone}</span>
              <span className="flex items-center gap-1"><Mail size={12} />{branch.email}</span>
            </div>
          </div>

          {/* Manager & Admin */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl border border-indigo-500/20 bg-card/40">
              <p className="font-bold text-sky-300 mb-1">Branch Manager</p>
              <p className="font-semibold text-white">{branch.managerName}</p>
              <p className="text-slate-400 mt-0.5">{branch.managerEmail} • {branch.managerPhone}</p>
              <p className="text-[10px] text-slate-400 mt-1">Has operational desk access strictly to this branch.</p>
            </div>
            <div className="p-3.5 rounded-xl border border-indigo-500/20 bg-card/40">
              <p className="font-bold text-indigo-300 mb-1">Authorized Library Admin</p>
              <p className="font-semibold text-white">{branch.adminName}</p>
              <p className="text-slate-400 mt-0.5">{branch.adminEmail}</p>
              <p className="text-[10px] text-slate-400 mt-1">Supervises all branches under {branch.libraryName}.</p>
            </div>
          </div>

          {/* Operational Hours */}
          <div className="p-3.5 rounded-xl border border-indigo-500/20 bg-card/40 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <Clock size={14} className="text-indigo-400" />
              <span>Working Hours: <strong>{branch.workingHours}</strong></span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Calendar size={14} className="text-amber-400" />
              <span>Holidays: <strong>{branch.weeklyHolidays}</strong></span>
            </div>
          </div>

          {/* Allowed Modules */}
          <div>
            <p className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5"><ShieldCheck size={14} className="text-emerald-400" /> Allowed Branch Operational Modules</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {Object.entries(branch.allowedModules || {}).map(([key, enabled]) => (
                <div key={key} className={`p-2 rounded-lg border text-xs flex items-center justify-between ${
                  enabled ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' : 'border-slate-800 bg-card/20 text-slate-400'
                }`}>
                  <span className="capitalize">{key}</span>
                  <span className="text-[10px] font-bold">{enabled ? 'Active' : 'Disabled'}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-3 border-t border-border">
          <button type="button" onClick={onClose} className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white">
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
}
