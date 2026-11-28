'use client';

import { AlertTriangle, CheckCircle, Clock, CreditCard, Users } from 'lucide-react';

interface SubscriptionsMetrics {
  total: number;
  active: number;
  expiringSoon: number;
  expiredOrSuspended: number;
  totalDuesMinor: number;
  countWithDues: number;
}

interface ManagerFinanceSubscriptionsKpiGridProps {
  metrics: SubscriptionsMetrics;
  formatCurrency: (amount: number) => string;
}

export default function ManagerFinanceSubscriptionsKpiGrid({
  metrics,
  formatCurrency,
}: ManagerFinanceSubscriptionsKpiGridProps) {
  const cards = [
    { key: 'total', variant: 'indigo', label: 'Total Plans', value: String(metrics.total), valCls: 'text-white', sub: 'total enrolled', subCls: 'text-slate-400 ml-1.5', Icon: Users, span2: false },
    { key: 'active', variant: 'emerald', label: 'Active Plans', value: String(metrics.active), valCls: 'text-emerald-400', sub: 'active now', subCls: 'text-emerald-200/70 ml-1.5', Icon: CheckCircle, span2: false },
    { key: 'expiring', variant: 'amber', label: 'Expiring Soon', value: String(metrics.expiringSoon), valCls: 'text-amber-400', sub: 'within 15 days', subCls: 'text-amber-200/70 ml-1.5', Icon: Clock, span2: false },
    { key: 'action', variant: 'rose', label: 'Action Needed', value: String(metrics.expiredOrSuspended), valCls: 'text-rose-400', sub: 'expired or hold', subCls: 'text-rose-200/70 ml-1.5', Icon: AlertTriangle, span2: false },
    { key: 'dues', variant: 'purple', label: 'Pending Dues', value: formatCurrency(metrics.totalDuesMinor), valCls: 'text-purple-300', sub: `${metrics.countWithDues} students pending`, subCls: 'text-rose-400 block font-semibold mt-0.5', Icon: CreditCard, span2: true },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {cards.map(({ key, variant, label, value, valCls, sub, subCls, Icon, span2 }) => (
        <div
          key={key}
          className={`fin-sub-kpi-card--${variant} group relative overflow-hidden p-3.5 sm:p-4 rounded-2xl border motion-safe:transition-all motion-safe:duration-slow hover:scale-[1.01] hover:shadow-xl flex flex-col justify-between ${span2 ? 'col-span-2 sm:col-span-1' : ''}`}
        >
          <svg aria-hidden="true" className="fin-sub-kpi-spark absolute bottom-0 right-0 w-24 h-12 opacity-15 group-hover:opacity-30 motion-safe:transition-opacity pointer-events-none" viewBox="0 0 150 45">
            <path d="M0,32 Q25,12 50,26 T95,15 T135,24 T150,6" fill="none" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          <div className="flex items-center justify-between relative z-10">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">{label}</span>
            <div className="fin-sub-kpi-icon w-8 h-8 rounded-lg border flex items-center justify-center motion-safe:transition-transform group-hover:scale-110">
              <Icon size={16} />
            </div>
          </div>
          <div className="mt-2.5 relative z-10">
            <span className={`text-xl sm:text-2xl font-extrabold tracking-tight font-sans ${valCls}`}>{value}</span>
            <span className={`text-[11px] ${subCls}`}>{sub}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
