'use client';

import { ADMIN_COMMUNICATION_COMPLAINT_STATUS } from '@/app/frontend_admin/admin_communication/communication_complaints/config/admin_communication_complaints.url_config';
import type { Complaint } from '@/app/frontend_admin/admin_communication/communication_complaints/types/AdminCommunicationComplaintsComponentTypes';
import { AlertTriangle, CheckCircle, MessageSquare, RefreshCw } from 'lucide-react';

export function AdminCommunicationComplaintsKpiGrid({ complaints }: { complaints: Complaint[] }) {
  const cards = [
    {
      label: 'Total Tickets',
      value: complaints.length,
      footer: 'Total grievances recorded',
      valCls: 'text-text-primary',
      iconCls: 'border-info bg-info-bg text-info-text',
      stroke: 'var(--chart-info)',
      Icon: MessageSquare,
    },
    {
      label: 'Open & Escalated',
      value: complaints.filter((c) => c.status === ADMIN_COMMUNICATION_COMPLAINT_STATUS.OPEN).length,
      footer: 'Unresolved complaints',
      valCls: 'text-danger-text',
      iconCls: 'border-danger bg-danger-bg text-danger-text',
      stroke: 'var(--chart-danger)',
      Icon: AlertTriangle,
    },
    {
      label: 'In Progress',
      value: complaints.filter((c) => c.status === ADMIN_COMMUNICATION_COMPLAINT_STATUS.IN_PROGRESS).length,
      footer: 'Active investigation',
      valCls: 'text-warning-text',
      iconCls: 'border-warning bg-warning-bg text-warning-text',
      stroke: 'var(--chart-warning)',
      Icon: RefreshCw,
    },
    {
      label: 'Resolved',
      value: complaints.filter((c) => c.status === ADMIN_COMMUNICATION_COMPLAINT_STATUS.RESOLVED).length,
      footer: 'Successfully closed',
      valCls: 'text-success-text',
      iconCls: 'border-success bg-success-bg text-success-text',
      stroke: 'var(--chart-success)',
      Icon: CheckCircle,
    },
  ];

  return (
    <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
      {cards.map(({ label, value, footer, valCls, iconCls, stroke, Icon }) => (
        <div
          key={label}
          className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-card motion-safe:transition-transform motion-safe:duration-300 motion-safe:hover:scale-[1.01]"
        >
          <svg
            aria-hidden="true"
            className="absolute bottom-0 right-0 w-36 h-20 opacity-20 group-hover:opacity-35 motion-safe:transition-opacity pointer-events-none"
            viewBox="0 0 150 45"
          >
            <path d="M0,32 Q25,18 55,24 T95,14 T130,20 T150,8" fill="none" stroke={stroke} strokeWidth="3" strokeLinecap="round" />
          </svg>
          <div className="relative z-10 flex items-start justify-between gap-2">
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-text-secondary">{label}</span>
            <div className={`p-2.5 rounded-xl border shrink-0 motion-safe:transition-transform motion-safe:group-hover:scale-110 shadow-card ${iconCls}`}>
              <Icon size={18} strokeWidth={2.2} aria-hidden="true" />
            </div>
          </div>
          <p className={`relative z-10 mt-3 sm:mt-4 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight tabular-nums ${valCls}`}>
            {value}
          </p>
          <p className="relative z-10 mt-3.5 pt-2.5 border-t border-border text-xs font-medium text-text-secondary">{footer}</p>
        </div>
      ))}
    </div>
  );
}
export default AdminCommunicationComplaintsKpiGrid;
