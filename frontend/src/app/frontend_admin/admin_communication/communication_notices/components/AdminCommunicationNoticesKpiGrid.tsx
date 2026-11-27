'use client';

import { Building2, CheckCircle2, Clock, Radio } from 'lucide-react';

interface AdminCommunicationNoticesKpiGridProps {
  totalCount: number;
  activeCount: number;
  expiredCount: number;
  targetScopeLabel: string;
}

export function AdminCommunicationNoticesKpiGrid({
  totalCount,
  activeCount,
  expiredCount,
  targetScopeLabel,
}: AdminCommunicationNoticesKpiGridProps) {
  return (
    <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
      <div className="group relative overflow-hidden rounded-2xl border border-info bg-card p-5 sm:p-6 shadow-md motion-safe:transition-all motion-safe:duration-300 motion-safe:hover:scale-[1.01] hover:shadow-xl">
        <div className="relative z-10 flex items-start justify-between gap-2">
          <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-text-secondary">Total Notices</span>
          <div className="p-2.5 rounded-xl border border-info bg-info-bg text-info-text shrink-0 motion-safe:transition-transform motion-safe:group-hover:scale-110 shadow-xs">
            <Radio size={18} strokeWidth={2.2} />
          </div>
        </div>
        <p className="relative z-10 mt-3 sm:mt-4 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-text-primary tabular-nums">{totalCount}</p>
        <p className="relative z-10 mt-3.5 pt-2.5 border-t border-border text-xs font-medium text-text-secondary">Published broadcasts</p>
      </div>

      <div className="group relative overflow-hidden rounded-2xl border border-success bg-card p-5 sm:p-6 shadow-md motion-safe:transition-all motion-safe:duration-300 motion-safe:hover:scale-[1.01] hover:shadow-xl">
        <div className="relative z-10 flex items-start justify-between gap-2">
          <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-text-secondary">Active Notices</span>
          <div className="p-2.5 rounded-xl border border-success bg-success-bg text-success-text shrink-0 motion-safe:transition-transform motion-safe:group-hover:scale-110 shadow-xs">
            <CheckCircle2 size={18} strokeWidth={2.2} />
          </div>
        </div>
        <p className="relative z-10 mt-3 sm:mt-4 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-success-text tabular-nums">{activeCount}</p>
        <p className="relative z-10 mt-3.5 pt-2.5 border-t border-border text-xs font-medium text-text-secondary">Currently live to members</p>
      </div>

      <div className="group relative overflow-hidden rounded-2xl border border-warning bg-card p-5 sm:p-6 shadow-md motion-safe:transition-all motion-safe:duration-300 motion-safe:hover:scale-[1.01] hover:shadow-xl">
        <div className="relative z-10 flex items-start justify-between gap-2">
          <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-text-secondary">Expired</span>
          <div className="p-2.5 rounded-xl border border-warning bg-warning-bg text-warning-text shrink-0 motion-safe:transition-transform motion-safe:group-hover:scale-110 shadow-xs">
            <Clock size={18} strokeWidth={2.2} />
          </div>
        </div>
        <p className="relative z-10 mt-3 sm:mt-4 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-warning-text tabular-nums">{expiredCount}</p>
        <p className="relative z-10 mt-3.5 pt-2.5 border-t border-border text-xs font-medium text-text-secondary">Passed validity threshold</p>
      </div>

      <div className="group relative overflow-hidden rounded-2xl border border-primary bg-card p-5 sm:p-6 shadow-md motion-safe:transition-all motion-safe:duration-300 motion-safe:hover:scale-[1.01] hover:shadow-xl">
        <div className="relative z-10 flex items-start justify-between gap-2">
          <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-text-secondary">Target Branches</span>
          <div className="p-2.5 rounded-xl border border-primary bg-info-bg text-primary-text shrink-0 motion-safe:transition-transform motion-safe:group-hover:scale-110 shadow-xs">
            <Building2 size={18} strokeWidth={2.2} />
          </div>
        </div>
        <p className="relative z-10 mt-3 sm:mt-4 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-text-primary tabular-nums truncate">
          {targetScopeLabel}
        </p>
        <p className="relative z-10 mt-3.5 pt-2.5 border-t border-border text-xs font-medium text-text-secondary">Notice recipient scope</p>
      </div>
    </div>
  );
}
export default AdminCommunicationNoticesKpiGrid;
