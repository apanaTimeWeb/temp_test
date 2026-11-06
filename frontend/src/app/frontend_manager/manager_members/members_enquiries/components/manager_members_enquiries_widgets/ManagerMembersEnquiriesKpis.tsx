'use client';
import { Users, Sparkles, PhoneCall, CheckCircle2 } from 'lucide-react';

interface ManagerMembersEnquiriesKpisProps {
  stats: {
    total: number;
    newLeads: number;
    activePipeline: number;
    visited: number;
    interested: number;
    converted: number;
    conversionRate: number;
  };
  horizonLabel: string;
}

export function ManagerMembersEnquiriesKpis({ stats, horizonLabel }: ManagerMembersEnquiriesKpisProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* KPI 1: Total Enquiries */}
      <div className="rounded-xl border border-border bg-card p-4 transition-all hover:border-primary hover:shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-secondary uppercase tracking-wider">Total Leads</span>
          <div className="w-9 h-9 rounded-lg bg-warning-bg text-warning border border-border flex items-center justify-center">
            <Users size={18} />
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-center justify-between gap-2">
            <div className="text-2xl font-bold tracking-tight text-primary">{stats.total}</div>
            <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-surface-highlight text-primary border border-border">
              [{horizonLabel}]
            </span>
          </div>
          <p className="mt-1 text-xs text-secondary flex items-center gap-1">
            <span>All enquiries in {horizonLabel}</span>
          </p>
        </div>
      </div>

      {/* KPI 2: New Prospects */}
      <div className="rounded-xl border border-border bg-card p-4 transition-all hover:border-primary hover:shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-secondary uppercase tracking-wider">New Leads</span>
          <div className="w-9 h-9 rounded-lg bg-primary-subtle text-primary border border-border flex items-center justify-center">
            <Sparkles size={18} />
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-center justify-between gap-2">
            <div className="text-2xl font-bold tracking-tight text-primary">{stats.newLeads}</div>
            <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-surface-highlight text-primary border border-border">
              [{horizonLabel}]
            </span>
          </div>
          <p className="mt-1 text-xs text-secondary">Awaiting response ({horizonLabel})</p>
        </div>
      </div>

      {/* KPI 3: Active Pipeline (Visited + Interested) */}
      <div className="rounded-xl border border-border bg-card p-4 transition-all hover:border-primary hover:shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-secondary uppercase tracking-wider">In Pipeline</span>
          <div className="w-9 h-9 rounded-lg bg-muted text-secondary border border-border flex items-center justify-center">
            <PhoneCall size={18} />
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-center justify-between gap-2">
            <div className="text-2xl font-bold tracking-tight text-secondary">{stats.activePipeline}</div>
            <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-surface-highlight text-primary border border-border">
              [{horizonLabel}]
            </span>
          </div>
          <p className="mt-1 text-xs text-secondary">
            {stats.visited} visited · {stats.interested} interested ({horizonLabel})
          </p>
        </div>
      </div>

      {/* KPI 4: Admissions Converted */}
      <div className="rounded-xl border border-border bg-card p-4 transition-all hover:border-primary hover:shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-secondary uppercase tracking-wider">Admitted / Won</span>
          <div className="w-9 h-9 rounded-lg bg-success-bg text-success border border-border flex items-center justify-center">
            <CheckCircle2 size={18} />
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-center justify-between gap-2">
            <div className="text-2xl font-bold tracking-tight text-success">{stats.converted}</div>
            <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-surface-highlight text-primary border border-border">
              [{horizonLabel}]
            </span>
          </div>
          <p className="mt-1 text-xs text-secondary">
            <span className="font-semibold text-success">{stats.conversionRate}%</span> conversion rate ({horizonLabel})
          </p>
        </div>
      </div>
    </div>
  );
}

