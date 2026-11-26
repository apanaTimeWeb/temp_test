'use client';
/** Responsibility: Superadmin Dashboard Infrastructure Health; monitors servers, database clusters, backup archives, and open SLA support tickets. */
import Link from 'next/link';
import {
  Activity,
  Server,
  Database,
  HardDriveDownload,
  Headphones,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
} from 'lucide-react';
import type {
  SuperadminDashboardInfrastructureHealthExtended,
  SuperadminDashboardSupportTicketItem,
} from '@/app/frontend_superadmin/superadmin_dashboard/dashboard_overview/types/SuperadminDashboardOverviewTypes';
import { SUPERADMIN_DASHBOARD_OVERVIEW_ROUTES } from '@/app/frontend_superadmin/superadmin_dashboard/dashboard_overview/config/superadmin_dashboard_overview.url_config';

interface SuperadminDashboardOverviewInfrastructureHealthProps {
  health: SuperadminDashboardInfrastructureHealthExtended;
  tickets: SuperadminDashboardSupportTicketItem[];
}

export default function SuperadminDashboardOverviewInfrastructureHealth({
  health,
  tickets,
}: SuperadminDashboardOverviewInfrastructureHealthProps) {
  const getTicketPriorityBadge = (priority: SuperadminDashboardSupportTicketItem['priority']) => {
    switch (priority) {
      case 'critical':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
            CRITICAL
          </span>
        );
      case 'high':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
            HIGH
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-sky-500/20 text-sky-300 border border-sky-500/30">
            NORMAL
          </span>
        );
    }
  };

  return (
    <section aria-label="System Infrastructure & Support Tickets" className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-6">
      {/* ─── Left: Infrastructure & Backup Health (7 cols) ─── */}
      <div className="lg:col-span-7 rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-[#0a1e16]/80 via-[#0d1f19] to-[#081813]/80 p-5 shadow-lg backdrop-blur-md flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-3.5 border-b border-emerald-500/20">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400">
                <Activity size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Server & Database Health</span>
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 motion-safe:animate-pulse" />
                    All Systems Operational
                  </span>
                </h3>
                <p className="text-xs text-slate-400">Node runtime cluster, PostgreSQL replication, and cloud backup</p>
              </div>
            </div>

            <Link
              href={SUPERADMIN_DASHBOARD_OVERVIEW_ROUTES.MODULE_URLS.SYSTEM_HEALTH}
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
            >
              <span>Telemetry</span>
              <ArrowUpRight size={13} />
            </Link>
          </div>

          {/* Grid of 4 Health Dimension Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-4">
            {/* Server / API Health */}
            <div className="p-3.5 rounded-xl border border-emerald-500/20 bg-slate-900/60 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-slate-300 font-semibold">
                  <Server size={14} className="text-emerald-400" />
                  Server / API Health
                </span>
                <span className="text-[11px] font-bold text-emerald-400">{health.uptime}</span>
              </div>
              <div className="flex items-baseline justify-between text-xs text-slate-400">
                <span>Latency: <strong className="text-white">{health.apiLatency}</strong></span>
                <span>Err Rate: <strong className="text-emerald-300">{health.apiErrorRate}</strong></span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400 rounded-full" style={{ width: '99%' }} />
              </div>
            </div>

            {/* Database Health */}
            <div className="p-3.5 rounded-xl border border-emerald-500/20 bg-slate-900/60 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-slate-300 font-semibold">
                  <Database size={14} className="text-teal-400" />
                  Database Health
                </span>
                <span className="text-[11px] font-bold text-teal-400">Primary + Replica</span>
              </div>
              <div className="flex items-baseline justify-between text-xs text-slate-400">
                <span>Connections: <strong className="text-white">{health.dbConnections}</strong></span>
                <span>R: <strong className="text-white">{health.dbReadLatency}</strong> / W: <strong className="text-white">{health.dbWriteLatency}</strong></span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-teal-400 rounded-full" style={{ width: '21%' }} />
              </div>
            </div>

            {/* Data Backup Status */}
            <div className="p-3.5 rounded-xl border border-emerald-500/20 bg-slate-900/60 space-y-2 sm:col-span-2">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-slate-300 font-semibold">
                  <HardDriveDownload size={14} className="text-sky-400" />
                  Data Backup Status
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-400">
                  <CheckCircle2 size={12} />
                  Snapshot Completed ({health.lastBackup})
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-400 flex-wrap gap-2">
                <span>Archive: <strong className="text-white">{health.backupSize}</strong></span>
                <span>Target: <strong className="text-white">AWS S3 (ap-south-1)</strong></span>
                <Link
                  href={SUPERADMIN_DASHBOARD_OVERVIEW_ROUTES.MODULE_URLS.DATA}
                  className="text-sky-400 hover:underline font-semibold"
                >
                  Manage Backups ➔
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-emerald-500/15 flex items-center justify-between text-[11px] text-slate-400">
          <span>Continuous automated failover active</span>
          <span className="text-emerald-400">SSL / TLS 1.3 Strict</span>
        </div>
      </div>

      {/* ─── Right: Open Support Tickets (5 cols) ─── */}
      <div className="lg:col-span-5 rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-[#12142d]/80 via-[#101326] to-[#0a0d1e]/80 p-5 shadow-lg backdrop-blur-md flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-3.5 border-b border-indigo-500/20">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-400">
                <Headphones size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Open Support Tickets</span>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                    {tickets.length} Active
                  </span>
                </h3>
                <p className="text-xs text-slate-400">Library owner escalations with SLA timers</p>
              </div>
            </div>

            <Link
              href={SUPERADMIN_DASHBOARD_OVERVIEW_ROUTES.MODULE_URLS.SUPPORT_TICKETS}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
            >
              <span>Tickets</span>
              <ArrowUpRight size={13} />
            </Link>
          </div>

          {/* Ticket list */}
          <div className="mt-4 space-y-3">
            {tickets.map((ticket) => (
              <Link
                key={ticket.id}
                href={SUPERADMIN_DASHBOARD_OVERVIEW_ROUTES.MODULE_URLS.SUPPORT_TICKETS}
                className="group block p-3 rounded-xl border border-indigo-500/20 bg-slate-900/60 hover:bg-slate-900/90 hover:border-indigo-500/40 motion-safe:transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono font-bold text-indigo-300">
                        {ticket.ticketNumber}
                      </span>
                      <span className="text-xs text-slate-400 font-medium truncate">
                        {ticket.libraryName}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-white group-hover:text-indigo-200 transition-colors line-clamp-1">
                      {ticket.subject}
                    </p>
                  </div>
                  {getTicketPriorityBadge(ticket.priority)}
                </div>

                <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1 text-amber-400 font-semibold">
                    <Clock size={11} />
                    SLA: {ticket.slaMinutesRemaining}m remaining
                  </span>
                  <span className="text-slate-400 group-hover:text-white transition-colors">
                    {ticket.createdAt}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-indigo-500/15 flex items-center justify-between text-[11px] text-slate-400">
          <span>Priority response SLA average: 18 mins</span>
          <Link href={SUPERADMIN_DASHBOARD_OVERVIEW_ROUTES.MODULE_URLS.SUPPORT_TICKETS} className="text-indigo-400 hover:underline">
            Resolve All
          </Link>
        </div>
      </div>
    </section>
  );
}
