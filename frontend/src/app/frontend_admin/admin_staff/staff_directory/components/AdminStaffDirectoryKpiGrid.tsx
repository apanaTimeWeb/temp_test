'use client';

import { AlertCircle, UserCheck, Users, UserX } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface AdminStaffDirectoryKpiGridProps {
  managerCounts: {
    all: number;
    active: number;
    suspended: number;
    deactivated: number;
  };
}

export function AdminStaffDirectoryKpiGrid({ managerCounts }: AdminStaffDirectoryKpiGridProps) {
  const t = useTranslations('ADMIN_STAFF_DIRECTORY');

  const cards = [
    { label: t('PANEL_ALL'), value: managerCounts.all, pill: 'Total Directory Count', border: 'border-info', iconBg: 'bg-info-bg border-info text-info-text', valueColor: 'text-text-primary', pillColor: 'text-info-text bg-info-bg border-info', Icon: Users },
    { label: t('STATUS_ACTIVE'), value: managerCounts.active, pill: 'Active On-Duty', border: 'border-success', iconBg: 'bg-success-bg border-success text-success-text', valueColor: 'text-success-text', pillColor: 'text-success-text bg-success-bg border-success', Icon: UserCheck },
    { label: t('STATUS_SUSPENDED'), value: managerCounts.suspended, pill: 'Access Paused', border: 'border-warning', iconBg: 'bg-warning-bg border-warning text-warning-text', valueColor: 'text-warning-text', pillColor: 'text-warning-text bg-warning-bg border-warning', Icon: AlertCircle },
    { label: t('STATUS_DEACTIVATED'), value: managerCounts.deactivated, pill: 'Offboarded', border: 'border-danger', iconBg: 'bg-danger-bg border-danger text-danger-text', valueColor: 'text-danger-text', pillColor: 'text-danger-text bg-danger-bg border-danger', Icon: UserX },
  ] as const;

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {cards.map(({ label, value, pill, border, iconBg, valueColor, pillColor, Icon }) => (
        <div
          key={label}
          className={`group relative overflow-hidden rounded-2xl border ${border} bg-card p-5 shadow-lg motion-safe:transition-all motion-safe:duration-300 motion-safe:hover:scale-[1.01] hover:shadow-xl`}
        >
          <div className="relative flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">{label}</span>
            <div className={`p-2.5 rounded-xl border shrink-0 motion-safe:transition-transform motion-safe:group-hover:scale-110 shadow-xs ${iconBg}`}>
              <Icon size={18} strokeWidth={2.2} />
            </div>
          </div>
          <p className={`mt-3 text-2xl font-bold tracking-tight ${valueColor}`}>{value}</p>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-text-secondary">
            <span className={`inline-flex items-center gap-1 font-semibold rounded-full px-2 py-0.5 border ${pillColor}`}>
              {pill}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
export default AdminStaffDirectoryKpiGrid;
