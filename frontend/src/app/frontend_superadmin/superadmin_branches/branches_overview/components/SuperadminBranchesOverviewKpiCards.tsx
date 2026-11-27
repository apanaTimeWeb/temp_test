'use client';
// RESPONSIBILITY: Display top metrics for Branch Management.
import { GitBranch, CheckCircle2, ShieldAlert, XCircle, Armchair } from 'lucide-react';
import type { SuperadminBranchRecord } from '@/app/frontend_superadmin/superadmin_branches/branches_overview/types/SuperadminBranchesOverviewTypes';

interface SuperadminBranchesOverviewKpiCardsProps {
  branches: SuperadminBranchRecord[];
}

export default function SuperadminBranchesOverviewKpiCards({ branches }: SuperadminBranchesOverviewKpiCardsProps) {
  const total = branches.length;
  const active = branches.filter((b) => b.status === 'active').length;
  const suspended = branches.filter((b) => b.status === 'suspended').length;
  const closed = branches.filter((b) => b.status === 'closed').length;
  const totalSeats = branches.reduce((sum, b) => sum + (b.capacity || 0), 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4" aria-label="Branch Statistics">
      {/* Total Branches */}
      <div className="rounded-xl border border-border bg-card p-4 shadow-card hover:border-border transition-colors">
        <div className="flex items-center justify-between text-secondary mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider">Total Branches</span>
          <GitBranch size={16} className="text-primary" />
        </div>
        <p className="text-2xl font-black text-foreground">{total}</p>
        <p className="text-[11px] text-muted mt-1">Across all registered libraries</p>
      </div>

      {/* Active Branches */}
      <div className="rounded-xl border border-border bg-card p-4 shadow-card hover:border-success-border transition-colors">
        <div className="flex items-center justify-between text-secondary mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider">Active</span>
          <CheckCircle2 size={16} className="text-success" />
        </div>
        <p className="text-2xl font-black text-foreground">{active}</p>
        <p className="text-[11px] text-success mt-1">{Math.round((active / Math.max(1, total)) * 100)}% Operational</p>
      </div>

      {/* Suspended */}
      <div className="rounded-xl border border-border bg-card p-4 shadow-card hover:border-danger-border transition-colors">
        <div className="flex items-center justify-between text-secondary mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider">Suspended</span>
          <ShieldAlert size={16} className="text-danger" />
        </div>
        <p className="text-2xl font-black text-foreground">{suspended}</p>
        <p className="text-[11px] text-danger mt-1">Isolated access block</p>
      </div>

      {/* Closed / Archived */}
      <div className="rounded-xl border border-border bg-card p-4 shadow-card hover:border-border-hover transition-colors">
        <div className="flex items-center justify-between text-secondary mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider">Closed / Archived</span>
          <XCircle size={16} className="text-muted" />
        </div>
        <p className="text-2xl font-black text-foreground">{closed}</p>
        <p className="text-[11px] text-muted mt-1">Safely soft-archived</p>
      </div>

      {/* Total Capacity */}
      <div className="rounded-xl border border-border bg-card p-4 shadow-card hover:border-warning-border transition-colors">
        <div className="flex items-center justify-between text-secondary mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider">Total Seats</span>
          <Armchair size={16} className="text-warning" />
        </div>
        <p className="text-2xl font-black text-warning">{totalSeats.toLocaleString()}</p>
        <p className="text-[11px] text-muted mt-1">Across all branches</p>
      </div>
    </div>
  );
}
