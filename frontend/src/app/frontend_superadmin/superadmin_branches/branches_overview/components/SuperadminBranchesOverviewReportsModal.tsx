'use client';
// RESPONSIBILITY: Display branch-level analytics and reports.
import { X, BarChart2, IndianRupee, Users, Armchair, BookOpen } from 'lucide-react';
import type { SuperadminBranchRecord } from '@/app/frontend_superadmin/superadmin_branches/branches_overview/types/SuperadminBranchesOverviewTypes';

interface SuperadminBranchesOverviewReportsModalProps {
  branch: SuperadminBranchRecord;
  onClose: () => void;
}

export default function SuperadminBranchesOverviewReportsModal({ branch, onClose }: SuperadminBranchesOverviewReportsModalProps) {
  const occupancyPercent = branch.capacity > 0 ? Math.round((branch.activeMembers / branch.capacity) * 100) : 0;
  const estMonthlyRev = branch.activeMembers * 1200;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-2xl border border-teal-500/40 bg-[#0d102b] p-6 shadow-2xl text-white">
        <button type="button" onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 pb-4 border-b border-teal-500/20">
          <div className="p-2.5 rounded-xl bg-teal-500/15 border border-teal-500/30 text-teal-400">
            <BarChart2 size={22} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Branch-Wise Performance Analytics</h2>
            <p className="text-xs text-slate-400">{branch.name} ({branch.code})</p>
          </div>
        </div>

        <div className="my-5 space-y-3.5">
          {/* Revenue */}
          <div className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-950/20 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <IndianRupee size={16} className="text-amber-400" />
              <div>
                <p className="text-xs font-semibold text-white">Monthly Member Subscriptions</p>
                <p className="text-[11px] text-slate-400">Estimated current run rate</p>
              </div>
            </div>
            <span className="text-sm font-bold text-amber-300">₹{estMonthlyRev.toLocaleString()}</span>
          </div>

          {/* Seat Occupancy */}
          <div className="p-3.5 rounded-xl border border-sky-500/30 bg-sky-950/20 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Armchair size={16} className="text-sky-400" />
              <div>
                <p className="text-xs font-semibold text-white">Real-Time Seat Occupancy</p>
                <p className="text-[11px] text-slate-400">{branch.activeMembers} of {branch.capacity} seats occupied</p>
              </div>
            </div>
            <span className="text-sm font-bold text-sky-300">{occupancyPercent}%</span>
          </div>

          {/* Active Members */}
          <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-950/20 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Users size={16} className="text-emerald-400" />
              <div>
                <p className="text-xs font-semibold text-white">Active Enrolled Students</p>
                <p className="text-[11px] text-slate-400">Checked-in & registered members</p>
              </div>
            </div>
            <span className="text-sm font-bold text-emerald-300">{branch.activeMembers}</span>
          </div>

          {/* Physical Inventory Copies */}
          <div className="p-3.5 rounded-xl border border-indigo-500/30 bg-indigo-950/20 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <BookOpen size={16} className="text-indigo-400" />
              <div>
                <p className="text-xs font-semibold text-white">Physical Book Copies Managed</p>
                <p className="text-[11px] text-slate-400">Stored branch-wise for accurate accounting</p>
              </div>
            </div>
            <span className="text-sm font-bold text-indigo-300">{branch.physicalBooks} copies</span>
          </div>
        </div>

        <div className="flex justify-end pt-3 border-t border-border">
          <button type="button" onClick={onClose} className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-xs font-bold text-white">
            Close Analytics
          </button>
        </div>
      </div>
    </div>
  );
}
