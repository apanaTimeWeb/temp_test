'use client';
/** Responsibility: Superadmin Dashboard Critical Alerts; surfaces payment failures, expiring subscriptions, failed logins, and background job anomalies. */
import { useState } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  CreditCard,
  CalendarClock,
  ShieldAlert,
  ServerCrash,
  ArrowUpRight,
  ExternalLink,
  RotateCw,
} from 'lucide-react';
import type { SuperadminDashboardPlatformAlert } from '@/app/frontend_superadmin/superadmin_dashboard/dashboard_overview/types/SuperadminDashboardOverviewTypes';
import { SUPERADMIN_DASHBOARD_OVERVIEW_ROUTES } from '@/app/frontend_superadmin/superadmin_dashboard/dashboard_overview/config/superadmin_dashboard_overview.url_config';

interface SuperadminDashboardOverviewCriticalAlertsProps {
  alerts: SuperadminDashboardPlatformAlert[];
}

type AlertFilter = 'all' | 'payment_failure' | 'subscription_expiring' | 'failed_login' | 'job_failure';

export default function SuperadminDashboardOverviewCriticalAlerts({
  alerts,
}: SuperadminDashboardOverviewCriticalAlertsProps) {
  const [activeFilter, setActiveFilter] = useState<AlertFilter>('all');

  const filteredAlerts = alerts.filter((alert) => {
    if (activeFilter === 'all') return true;
    return alert.type === activeFilter;
  });

  const getAlertIcon = (type: SuperadminDashboardPlatformAlert['type']) => {
    switch (type) {
      case 'payment_failure':
        return <CreditCard size={16} className="text-rose-400" />;
      case 'subscription_expiring':
        return <CalendarClock size={16} className="text-amber-400" />;
      case 'failed_login':
        return <ShieldAlert size={16} className="text-rose-400" />;
      case 'job_failure':
        return <ServerCrash size={16} className="text-amber-400" />;
    }
  };

  const getSeverityBadge = (severity: SuperadminDashboardPlatformAlert['severity']) => {
    switch (severity) {
      case 'critical':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-500/20 text-rose-300 border border-rose-500/40">
            CRITICAL
          </span>
        );
      case 'high':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/40">
            HIGH
          </span>
        );
      case 'warning':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-yellow-500/15 text-yellow-300 border border-yellow-500/30">
            WARNING
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/15 text-blue-300 border border-blue-500/30">
            INFO
          </span>
        );
    }
  };

  return (
    <section
      aria-label="Platform Alerts & Operational Health"
      className="mb-6 rounded-2xl border border-rose-500/30 bg-gradient-to-br from-[#1c0c14]/80 via-[#180910] to-[#12060c]/80 p-5 shadow-lg backdrop-blur-md"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-rose-500/20">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-400 animate-pulse">
            <AlertTriangle size={18} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Critical Operational Alerts</span>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                {alerts.length} Action Items
              </span>
            </h3>
            <p className="text-xs text-slate-400">Payment bounce, subscription expirations, failed logins, and job queues</p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
              activeFilter === 'all'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            All ({alerts.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('payment_failure')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
              activeFilter === 'payment_failure'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Payment Failures
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('subscription_expiring')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
              activeFilter === 'subscription_expiring'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Expiring Subscriptions
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('failed_login')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
              activeFilter === 'failed_login'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Failed Logins
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('job_failure')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
              activeFilter === 'job_failure'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Job Failures
          </button>
        </div>
      </div>

      {/* Alert Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mt-4">
        {filteredAlerts.map((alert) => (
          <div
            key={alert.id}
            className="group p-4 rounded-xl border border-rose-500/20 bg-slate-900/80 hover:bg-slate-900 hover:border-rose-500/40 transition-all flex flex-col justify-between gap-3"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-slate-800 border border-slate-700/60">
                    {getAlertIcon(alert.type)}
                  </div>
                  <h4 className="text-xs font-bold text-white group-hover:text-rose-300 transition-colors">
                    {alert.title}
                  </h4>
                </div>
                {getSeverityBadge(alert.severity)}
              </div>

              <p className="text-xs text-slate-300 leading-relaxed pl-8">
                {alert.description}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2.5 border-t border-slate-800/80 text-xs">
              <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                {alert.amount && <span className="font-semibold text-rose-300">{alert.amount}</span>}
                {alert.amount && <span>•</span>}
                <span>{alert.timestamp}</span>
              </div>

              {alert.actionHref && (
                <Link
                  href={alert.actionHref}
                  className="inline-flex items-center gap-1 font-bold text-xs text-rose-400 hover:text-white bg-rose-500/10 hover:bg-rose-600 px-3 py-1.5 rounded-lg transition-all"
                >
                  <span>{alert.actionLabel || 'Investigate'}</span>
                  <ArrowUpRight size={13} />
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
