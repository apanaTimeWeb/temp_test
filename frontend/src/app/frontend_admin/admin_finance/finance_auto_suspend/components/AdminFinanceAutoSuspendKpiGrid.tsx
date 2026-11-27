'use client';

import type { AdminFinanceAutoSuspendConfig } from '@/app/frontend_admin/admin_finance/finance_auto_suspend/types/AdminFinanceAutoSuspendTypes';
import { Ban, RotateCcw, Settings, UserCheck } from 'lucide-react';

interface AdminFinanceAutoSuspendKpiGridProps {
  config: AdminFinanceAutoSuspendConfig;
}

export function AdminFinanceAutoSuspendKpiGrid({ config }: AdminFinanceAutoSuspendKpiGridProps) {
  const cards = [
    {
      label: 'Days Before Suspend',
      value: `${config.daysBeforeSuspend} Days`,
      icon: Settings,
      chip: 'Policy Threshold',
      chipCls: 'bg-info-bg text-info-text border-info',
      iconCls: 'bg-info-bg text-info-text border-info',
      stroke: 'var(--chart-info)',
      valColor: 'text-text-primary',
    },
    {
      label: 'Currently Suspended',
      value: `${config.currentlySuspended} Students`,
      icon: Ban,
      chip: 'Active Suspensions',
      chipCls: 'bg-danger-bg text-danger-text border-danger',
      iconCls: 'bg-danger-bg text-danger-text border-danger',
      stroke: 'var(--chart-danger)',
      valColor: 'text-danger-text',
    },
    {
      label: 'Auto-Restored (Month)',
      value: `${config.autoRestoredThisMonth} Restored`,
      icon: RotateCcw,
      chip: 'Auto-Settled',
      chipCls: 'bg-success-bg text-success-text border-success',
      iconCls: 'bg-success-bg text-success-text border-success',
      stroke: 'var(--chart-success)',
      valColor: 'text-success-text',
    },
    {
      label: 'Manual Overrides',
      value: `${config.manualRestores} Overrides`,
      icon: UserCheck,
      chip: 'Admin Action',
      chipCls: 'bg-purple-bg text-purple-text border-purple-text',
      iconCls: 'bg-purple-bg text-purple-text border-purple-text',
      stroke: 'var(--chart-primary)',
      valColor: 'text-purple-text',
    },
  ] as const;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map(({ label, value, icon: Icon, chip, chipCls, iconCls, stroke, valColor }) => (
        <div
          key={label}
          className="group relative overflow-hidden p-5 rounded-2xl border border-border bg-card shadow-card motion-safe:transition-transform motion-safe:duration-300 motion-safe:hover:scale-[1.01] flex flex-col justify-between"
        >
          <svg
            aria-hidden="true"
            className="absolute bottom-0 right-0 w-28 h-14 opacity-15 group-hover:opacity-30 motion-safe:transition-opacity pointer-events-none"
            viewBox="0 0 150 45"
          >
            <path d="M0,32 Q25,12 50,26 T95,15 T135,24 T150,6" fill="none" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-3">
              <div className={`p-2.5 rounded-xl border motion-safe:transition-transform motion-safe:group-hover:scale-110 shadow-card ${iconCls}`}>
                <Icon size={18} aria-hidden="true" />
              </div>
              <span className={`text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full border ${chipCls}`}>
                {chip}
              </span>
            </div>
            <div>
              <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">{label}</p>
              <h3 className={`text-2xl sm:text-3xl font-extrabold tracking-tight font-sans ${valColor}`}>{value}</h3>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
