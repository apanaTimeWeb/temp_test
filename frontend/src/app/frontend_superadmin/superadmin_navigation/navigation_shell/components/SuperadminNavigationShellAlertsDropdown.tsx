'use client';

import React from 'react';
import Link from 'next/link';
import { CheckCircle, AlertTriangle, Zap } from 'lucide-react';
import { SUPERADMIN_NAVIGATION_ROUTES } from '@/app/frontend_superadmin/superadmin_navigation/navigation_shell/config/superadmin_navigation_routes';

export interface SystemAlert {
  id: string;
  title: string;
  description: string;
  time: string;
  tone: 'success' | 'danger' | 'primary' | 'warning';
  unread: boolean;
  link?: string;
}

export const DEFAULT_SYSTEM_ALERTS: SystemAlert[] = [
  {
    id: 'notif-1',
    title: 'Platform Deployment Complete',
    description: 'Core microservices deployed to cluster with 99.98% uptime.',
    time: '12m ago',
    tone: 'success',
    unread: true,
    link: SUPERADMIN_NAVIGATION_ROUTES.system_health_overview,
  },
  {
    id: 'notif-2',
    title: 'Security Alert: New IP Range',
    description: 'Anomalous login attempt mitigated by cloud firewall rules.',
    time: '45m ago',
    tone: 'danger',
    unread: true,
    link: SUPERADMIN_NAVIGATION_ROUTES.security_threats,
  },
  {
    id: 'notif-3',
    title: 'Automated Database Backup Saved',
    description: 'Full database snapshot safely encrypted and stored in secondary region.',
    time: '2h ago',
    tone: 'primary',
    unread: false,
    link: SUPERADMIN_NAVIGATION_ROUTES.backup_overview,
  },
  {
    id: 'notif-4',
    title: 'New Branch Onboarded',
    description: 'Apex Digital Library branch launched into production tier.',
    time: '4h ago',
    tone: 'success',
    unread: false,
    link: SUPERADMIN_NAVIGATION_ROUTES.libraries_overview,
  },
];

interface AlertsDropdownProps {
  alerts: SystemAlert[];
  unreadAlertsCount: number;
  onMarkAllRead: () => void;
  onMarkAlertRead: (id: string, link?: string) => void;
  onClose: () => void;
  t: (key: string) => string;
}

export default function SuperadminNavigationShellAlertsDropdown({
  alerts,
  unreadAlertsCount,
  onMarkAllRead,
  onMarkAlertRead,
  onClose,
  t,
}: AlertsDropdownProps) {
  return (
    <div
      id="superadmin-notifications-dropdown"
      role="region"
      aria-label={t('COPY.SAMPLE_SYSTEM_ALERTS_2')}
      className="sa-notif-dropdown"
    >
      {/* Header */}
      <div className="sa-notif-dropdown-header flex items-center justify-between p-3.5 border-b border-indigo-500/20 bg-[#0c102b]/95">
        <div className="flex items-center gap-2">
          <span className="font-bold text-xs uppercase tracking-wider text-white">Platform Alerts</span>
          {unreadAlertsCount > 0 ? (
            <span className="rounded-full bg-indigo-500/20 border border-indigo-500/40 px-2 py-0.5 text-[10px] font-semibold text-indigo-300">
              {unreadAlertsCount} New
            </span>
          ) : (
            <span className="rounded-full bg-slate-800 border border-slate-700 px-2 py-0.5 text-[10px] font-medium text-slate-400">
              All caught up
            </span>
          )}
        </div>
        {unreadAlertsCount > 0 && (
          <button
            type="button"
            onClick={onMarkAllRead}
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
            data-testid="superadmin-navigation-header-mark-read-9"
          >
            <CheckCircle size={12} />
            {t('COPY.MARK_READ')}
          </button>
        )}
      </div>

      {/* Notification Items List */}
      <div className="sa-notif-list max-h-72 overflow-y-auto divide-y divide-white/5">
        {alerts.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-400">
            No active notifications
          </div>
        ) : (
          alerts.map((alert) => {
            const Icon = alert.tone === 'success' ? CheckCircle : alert.tone === 'danger' ? AlertTriangle : Zap;
            const toneColors = {
              success: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30',
              danger: 'text-rose-400 bg-rose-500/15 border-rose-500/30',
              primary: 'text-indigo-400 bg-indigo-500/15 border-indigo-500/30',
              warning: 'text-amber-400 bg-amber-500/15 border-amber-500/30',
            }[alert.tone];

            return (
              <div
                key={alert.id}
                onClick={() => onMarkAlertRead(alert.id, alert.link)}
                className={`sa-notif-item p-3.5 hover:bg-white/[0.04] motion-safe:transition-all cursor-pointer flex gap-3 text-left ${
                  alert.unread ? 'sa-notif-item--unread bg-indigo-500/[0.06]' : ''
                }`}
              >
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border mt-0.5 ${toneColors}`}>
                  <Icon size={15} />
                </div>
                <div className="sa-notif-item-content min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <p className={`sa-notif-item-title text-xs font-semibold truncate ${alert.unread ? 'text-white' : 'text-slate-300'}`}>
                      {alert.title}
                    </p>
                    <span className="sa-notif-item-time text-[10px] text-slate-400 shrink-0 font-mono">
                      {alert.time}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {alert.description}
                  </p>
                </div>
                {alert.unread && (
                  <div className="sa-notif-unread-dot self-center">
                    <span className="inline-block h-2 w-2 rounded-full bg-indigo-400 shadow-sm shadow-indigo-400/80 motion-safe:animate-pulse" />
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="sa-notif-dropdown-footer p-3 border-t border-indigo-500/20 bg-[#0c102b]/60 flex items-center justify-between">
        <Link
          href={SUPERADMIN_NAVIGATION_ROUTES.audit_logs}
          onClick={onClose}
          className="sa-panel-view-all w-full text-center text-xs font-semibold text-indigo-400 hover:text-indigo-300 py-1 transition-colors"
          data-testid="superadmin-navigation-header-view-logs-10"
        >
          {t('COPY.VIEW_ALL_LOGS')} →
        </Link>
      </div>
    </div>
  );
}
