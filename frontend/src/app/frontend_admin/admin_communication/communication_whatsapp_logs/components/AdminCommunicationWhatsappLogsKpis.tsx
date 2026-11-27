'use client';

import type { AdminCommunicationWhatsappLog } from '@/app/frontend_admin/admin_communication/communication_whatsapp_logs/types/AdminCommunicationWhatsappLogsTypes';
import { AlertCircle, CheckCheck, Clock, MessageSquare } from 'lucide-react';

export interface AdminCommunicationWhatsappLogsKpisProps {
  visibleLogs: readonly AdminCommunicationWhatsappLog[];
}

export function AdminCommunicationWhatsappLogsKpis({ visibleLogs }: AdminCommunicationWhatsappLogsKpisProps) {
  const deliveredCount = visibleLogs.filter((l) => l.status === 'Delivered').length;
  const inTransitCount = visibleLogs.filter((l) => l.status === 'Sent' || l.status === 'Pending').length;
  const failedCount = visibleLogs.filter((l) => l.status === 'Failed').length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="group relative overflow-hidden rounded-2xl border border-info bg-card p-5 shadow-md motion-safe:transition-all motion-safe:duration-300 motion-safe:hover:scale-[1.01]">
        <div className="relative flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Total Dispatches</span>
          <div className="p-2.5 rounded-xl border shrink-0 bg-info-bg border-info text-info-text">
            <MessageSquare size={18} strokeWidth={2.2} />
          </div>
        </div>
        <p className="mt-3 text-2xl sm:text-3xl font-extrabold text-text-primary tabular-nums">{visibleLogs.length}</p>
        <p className="mt-1 text-xs text-text-secondary">Recorded audit triggers</p>
      </div>

      <div className="group relative overflow-hidden rounded-2xl border border-success bg-card p-5 shadow-md motion-safe:transition-all motion-safe:duration-300 motion-safe:hover:scale-[1.01]">
        <div className="relative flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Delivered</span>
          <div className="p-2.5 rounded-xl border shrink-0 bg-success-bg border-success text-success-text">
            <CheckCheck size={18} strokeWidth={2.2} />
          </div>
        </div>
        <p className="mt-3 text-2xl sm:text-3xl font-extrabold text-success-text tabular-nums">{deliveredCount}</p>
        <p className="mt-1 text-xs text-text-secondary">Confirmed recipient handshakes</p>
      </div>

      <div className="group relative overflow-hidden rounded-2xl border border-warning bg-card p-5 shadow-md motion-safe:transition-all motion-safe:duration-300 motion-safe:hover:scale-[1.01]">
        <div className="relative flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">In Transit / Sent</span>
          <div className="p-2.5 rounded-xl border shrink-0 bg-warning-bg border-warning text-warning-text">
            <Clock size={18} strokeWidth={2.2} />
          </div>
        </div>
        <p className="mt-3 text-2xl sm:text-3xl font-extrabold text-warning-text tabular-nums">{inTransitCount}</p>
        <p className="mt-1 text-xs text-text-secondary">Queued for gateway routing</p>
      </div>

      <div className="group relative overflow-hidden rounded-2xl border border-danger bg-card p-5 shadow-md motion-safe:transition-all motion-safe:duration-300 motion-safe:hover:scale-[1.01]">
        <div className="relative flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Failed / Issues</span>
          <div className="p-2.5 rounded-xl border shrink-0 bg-danger-bg border-danger text-danger-text">
            <AlertCircle size={18} strokeWidth={2.2} />
          </div>
        </div>
        <p className="mt-3 text-2xl sm:text-3xl font-extrabold text-danger-text tabular-nums">{failedCount}</p>
        <p className="mt-1 text-xs text-text-secondary">Requires mobile correction</p>
      </div>
    </div>
  );
}
export default AdminCommunicationWhatsappLogsKpis;
