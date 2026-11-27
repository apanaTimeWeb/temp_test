'use client';

import { AlertTriangle, Bell, BellRing } from 'lucide-react';

interface AdminCommunicationNotificationCenterKpisProps {
  totalAlerts: number;
  unreadCount: number;
  highPriorityCount: number;
}

export function AdminCommunicationNotificationCenterKpis({
  totalAlerts,
  unreadCount,
  highPriorityCount,
}: AdminCommunicationNotificationCenterKpisProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div className="group relative overflow-hidden rounded-2xl border border-info bg-card p-5 shadow-md motion-safe:transition-all motion-safe:duration-300 motion-safe:hover:scale-[1.01] hover:shadow-xl">
        <div className="relative flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Total Alerts</span>
          <div className="p-2.5 rounded-xl border shrink-0 motion-safe:transition-transform motion-safe:group-hover:scale-110 shadow-xs bg-info-bg border-info text-info-text">
            <Bell size={18} strokeWidth={2.2} />
          </div>
        </div>
        <p className="mt-3 text-2xl sm:text-3xl font-extrabold tracking-tight text-text-primary tabular-nums">{totalAlerts}</p>
        <div className="mt-2.5 flex items-center gap-1.5 text-xs text-text-secondary pt-2 border-t border-border">
          <span className="inline-flex items-center gap-1 font-semibold rounded-full px-2 py-0.5 border text-info-text bg-info-bg border-info text-[10px]">
            System Broadcasts
          </span>
        </div>
      </div>

      <div className="group relative overflow-hidden rounded-2xl border border-warning bg-card p-5 shadow-md motion-safe:transition-all motion-safe:duration-300 motion-safe:hover:scale-[1.01] hover:shadow-xl">
        <div className="relative flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Unread</span>
          <div className="p-2.5 rounded-xl border shrink-0 motion-safe:transition-transform motion-safe:group-hover:scale-110 shadow-xs bg-warning-bg border-warning text-warning-text">
            <BellRing size={18} strokeWidth={2.2} />
          </div>
        </div>
        <p className="mt-3 text-2xl sm:text-3xl font-extrabold tracking-tight text-warning-text tabular-nums">{unreadCount}</p>
        <div className="mt-2.5 flex items-center gap-1.5 text-xs text-text-secondary pt-2 border-t border-border">
          <span className="inline-flex items-center gap-1 font-semibold rounded-full px-2 py-0.5 border text-warning-text bg-warning-bg border-warning text-[10px]">
            Action Required
          </span>
        </div>
      </div>

      <div className="group relative overflow-hidden rounded-2xl border border-danger bg-card p-5 shadow-md motion-safe:transition-all motion-safe:duration-300 motion-safe:hover:scale-[1.01] hover:shadow-xl">
        <div className="relative flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">High Priority</span>
          <div className="p-2.5 rounded-xl border shrink-0 motion-safe:transition-transform motion-safe:group-hover:scale-110 shadow-xs bg-danger-bg border-danger text-danger-text">
            <AlertTriangle size={18} strokeWidth={2.2} />
          </div>
        </div>
        <p className="mt-3 text-2xl sm:text-3xl font-extrabold tracking-tight text-danger-text tabular-nums">{highPriorityCount}</p>
        <div className="mt-2.5 flex items-center gap-1.5 text-xs text-text-secondary pt-2 border-t border-border">
          <span className="inline-flex items-center gap-1 font-semibold rounded-full px-2 py-0.5 border text-danger-text bg-danger-bg border-danger text-[10px]">
            Urgent Attention
          </span>
        </div>
      </div>
    </div>
  );
}
export default AdminCommunicationNotificationCenterKpis;
