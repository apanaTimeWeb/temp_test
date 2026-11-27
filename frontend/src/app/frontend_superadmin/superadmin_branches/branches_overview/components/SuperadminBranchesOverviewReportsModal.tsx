'use client';
// RESPONSIBILITY: Display branch-level analytics and reports.
import { X, BarChart2, IndianRupee, Users, Armchair } from 'lucide-react';
import type { SuperadminBranchRecord } from '@/app/frontend_superadmin/superadmin_branches/branches_overview/types/SuperadminBranchesOverviewTypes';

interface SuperadminBranchesOverviewReportsModalProps {
  branch: SuperadminBranchRecord;
  onClose: () => void;
}

export default function SuperadminBranchesOverviewReportsModal({ branch, onClose }: SuperadminBranchesOverviewReportsModalProps) {
  const occupancyPercent = branch.capacity > 0 ? Math.round((branch.activeMembers / branch.capacity) * 100) : 0;
  const estMonthlyRev = branch.activeMembers * 1200;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-overlay-backdrop backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-2xl border border-border bg-overlay p-6 shadow-dialog text-foreground">
        <button type="button" onClick={onClose} className="absolute top-4 right-4 text-muted hover:text-foreground">
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 pb-4 border-b border-border">
          <div className="p-2.5 rounded-xl bg-info-bg border border-info-border text-info">
            <BarChart2 size={22} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">Branch-Wise Performance Analytics</h2>
            <p className="text-xs text-secondary">{branch.name} ({branch.code})</p>
          </div>
        </div>

        <div className="my-5 space-y-3.5">
          {/* Revenue */}
          <div className="p-3.5 rounded-xl border border-warning-border bg-warning-bg flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <IndianRupee size={16} className="text-warning" />
              <div>
                <p className="text-xs font-semibold text-foreground">Monthly Member Subscriptions</p>
                <p className="text-[11px] text-secondary">Estimated current run rate</p>
              </div>
            </div>
            <span className="text-sm font-bold text-warning">₹{estMonthlyRev.toLocaleString()}</span>
          </div>

          {/* Seat Occupancy */}
          <div className="p-3.5 rounded-xl border border-info-border bg-info-bg flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Armchair size={16} className="text-info" />
              <div>
                <p className="text-xs font-semibold text-foreground">Real-Time Seat Occupancy</p>
                <p className="text-[11px] text-secondary">{branch.activeMembers} of {branch.capacity} seats occupied</p>
              </div>
            </div>
            <span className="text-sm font-bold text-info">{occupancyPercent}%</span>
          </div>

          {/* Active Members */}
          <div className="p-3.5 rounded-xl border border-success-border bg-success-bg flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Users size={16} className="text-success" />
              <div>
                <p className="text-xs font-semibold text-foreground">Active Enrolled Students</p>
                <p className="text-[11px] text-secondary">Checked-in & registered members</p>
              </div>
            </div>
            <span className="text-sm font-bold text-success">{branch.activeMembers}</span>
          </div>

          {/* Configured Study Units */}
          <div className="p-3.5 rounded-xl border border-border bg-card flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Armchair size={16} className="text-primary" />
              <div>
                <p className="text-xs font-semibold text-foreground">Study Desks & Operational Units</p>
                <p className="text-[11px] text-muted">Configured study hall infrastructure</p>
              </div>
            </div>
            <span className="text-sm font-bold text-primary">{branch.capacity} seats</span>
          </div>
        </div>

        <div className="flex justify-end pt-3 border-t border-border">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-surface hover:bg-surface-elevated border border-border text-xs font-bold text-foreground transition-colors cursor-pointer"
          >
            Close Analytics
          </button>
        </div>
      </div>
    </div>
  );
}
