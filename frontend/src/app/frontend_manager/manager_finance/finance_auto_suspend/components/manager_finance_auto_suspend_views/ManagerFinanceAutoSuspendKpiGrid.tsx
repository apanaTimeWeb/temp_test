'use client';

import type { ManagerFinanceAutoSuspendConfig as Config } from '@/app/frontend_manager/manager_finance/finance_auto_suspend/types/ManagerFinanceAutoSuspendTypes';
import { Ban, RotateCcw, Settings, UserCheck } from 'lucide-react';

interface ManagerFinanceAutoSuspendKpiGridProps {
  config: Config;
  labels: {
    daysBeforeSuspend: string;
    currentlySuspended: string;
    autoRestoredMonth: string;
    manualRestores: string;
  };
}

export default function ManagerFinanceAutoSuspendKpiGrid({ config, labels }: ManagerFinanceAutoSuspendKpiGridProps) {
  const kpiCards = [
    {
      label: labels.daysBeforeSuspend,
      value: `${config?.daysBeforeSuspend} Days`,
      icon: Settings,
      chip: 'Policy Threshold',
      variant: 'sky' as const,
    },
    {
      label: labels.currentlySuspended,
      value: `${config?.currentlySuspended ?? 0} Students`,
      icon: Ban,
      chip: 'Active Suspensions',
      variant: 'rose' as const,
    },
    {
      label: labels.autoRestoredMonth,
      value: `${config?.autoRestoredThisMonth ?? 0} Restored`,
      icon: RotateCcw,
      chip: 'Auto-Settled',
      variant: 'emerald' as const,
    },
    {
      label: labels.manualRestores,
      value: `${config?.manualRestores ?? 0} Overrides`,
      icon: UserCheck,
      chip: 'Manager Action',
      variant: 'purple' as const,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpiCards.map(({ label, value, icon: Icon, chip, variant }) => (
        <div
          key={label}
          className={`fin-autosuspend-kpi-card fin-autosuspend-kpi-card--${variant} group relative overflow-hidden p-5 rounded-2xl border motion-safe:transition-all motion-safe:duration-slow hover:scale-[1.01] hover:shadow-xl flex flex-col justify-between`}
        >
          <svg
            aria-hidden="true"
            className="fin-autosuspend-kpi-spark absolute bottom-0 right-0 w-28 h-14 opacity-15 group-hover:opacity-30 motion-safe:transition-opacity pointer-events-none"
            viewBox="0 0 150 45"
          >
            <path d="M0,32 Q25,12 50,26 T95,15 T135,24 T150,6" fill="none" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-3">
              <div className="fin-autosuspend-kpi-icon p-2.5 rounded-xl border motion-safe:transition-transform group-hover:scale-110 shadow-xs">
                <Icon size={18} />
              </div>
              <span className="fin-autosuspend-kpi-chip text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full border">
                {chip}
              </span>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">{label}</p>
              <h3 className="fin-autosuspend-kpi-value text-2xl sm:text-3xl font-extrabold tracking-tight font-sans">{value}</h3>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
