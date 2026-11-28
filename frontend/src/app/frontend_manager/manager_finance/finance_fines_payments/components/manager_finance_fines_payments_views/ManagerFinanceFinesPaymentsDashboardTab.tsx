'use client';

import { ArrowRight, CreditCard, LucideIcon, TrendingUp } from 'lucide-react';

export interface DashboardKpiItem {
  id: string;
  labelKey: string;
  value: string;
  subtitle: string;
  icon: LucideIcon;
  color: string;
  bg: string;
  targetTab: string;
  filterType: string;
}

export interface ManagerFinanceFinesPaymentsDashboardTabProps {
  overviewTitle: string;
  timeHorizonSubtitle: string;
  timeHorizonLabel: string;
  kpis: DashboardKpiItem[];
  getKpiLabel: (key: string) => string;
  onSelectKpi: (targetTab: string, filterType: string) => void;
}

export default function ManagerFinanceFinesPaymentsDashboardTab({
  overviewTitle,
  timeHorizonSubtitle,
  timeHorizonLabel,
  kpis,
  getKpiLabel,
  onSelectKpi,
}: ManagerFinanceFinesPaymentsDashboardTabProps) {
  const getVariantConfig = (id: string) => {
    switch (id) {
      case 'todaysCollection':
        return { label: 'Realized', variant: 'emerald' };
      case 'totalPending':
        return { label: 'Unsettled Dues', variant: 'rose' };
      case 'overdueFines':
        return { label: 'Critical Follow-up', variant: 'amber' };
      case 'lostBookCharges':
        return { label: 'Book Replacement', variant: 'cyan' };
      case 'damageCharges':
        return { label: 'Property Restitution', variant: 'purple' };
      default:
        return { label: timeHorizonLabel, variant: 'indigo' };
    }
  };

  return (
    <div className="space-y-6 motion-safe:transition-all motion-safe:duration-base">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
        <div>
          <h2 className="text-xl font-bold text-primary">{overviewTitle}</h2>
          <p className="text-xs text-secondary mt-0.5">{timeHorizonSubtitle}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {kpis.map((kpi) => {
          const { label, variant } = getVariantConfig(kpi.id);
          return (
            <button
              key={kpi.labelKey}
              type="button"
              onClick={() => onSelectKpi(kpi.targetTab, kpi.filterType)}
              className={`fin-fines-kpi-card--${variant} group relative overflow-hidden p-5 rounded-2xl border motion-safe:transition-all motion-safe:duration-slow hover:scale-[1.01] hover:shadow-xl text-left cursor-pointer flex flex-col justify-between`}
            >
              <svg
                aria-hidden="true"
                className="fin-fines-kpi-spark absolute bottom-0 right-0 w-28 h-14 opacity-15 group-hover:opacity-30 motion-safe:transition-opacity pointer-events-none"
                viewBox="0 0 150 45"
              >
                <path d="M0,32 Q25,12 50,26 T95,15 T135,24 T150,6" fill="none" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
              <div className="relative z-10 w-full">
                <div className="flex justify-between items-start mb-3">
                  <div className="fin-fines-kpi-icon p-2.5 rounded-xl border motion-safe:transition-transform group-hover:scale-110 shadow-xs">
                    <kpi.icon size={20} />
                  </div>
                  <span className="text-xs text-slate-300 group-hover:text-white font-semibold flex items-center gap-1 group-hover:translate-x-0.5 motion-safe:transition-all">
                    View list <ArrowRight size={13} />
                  </span>
                </div>
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      {getKpiLabel(kpi.labelKey)}
                    </p>
                    <span className="fin-fines-kpi-chip text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full border">
                      {label}
                    </span>
                  </div>
                  <h3 className="fin-fines-kpi-val text-2xl sm:text-3xl font-extrabold tracking-tight font-sans">{kpi.value}</h3>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {kpi.subtitle} ({timeHorizonLabel})
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-2">
        <div className="p-5 rounded-2xl border border-border bg-card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-primary flex items-center gap-2">
              <CreditCard size={16} className="text-primary" />
              Payment Method Realization
            </h3>
            <span className="text-xs text-secondary font-medium">Digital vs Cash</span>
          </div>
          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="text-primary">UPI / QR Code</span>
                <span className="text-success">62% (Instant)</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-success h-2 rounded-full w-[62%]" />
              </div>
            </div>
            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="text-primary">Cash Counter</span>
                <span className="text-warning">26% (Physical Vault)</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-warning h-2 rounded-full w-[26%]" />
              </div>
            </div>
            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="text-primary">Debit / Credit Card &amp; Bank</span>
                <span className="text-primary">12% (POS / NetBanking)</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full w-[12%]" />
              </div>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-border bg-card flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-primary flex items-center gap-2 mb-2">
              <TrendingUp size={16} className="text-primary" />
              Audit &amp; Settlement Status
            </h3>
            <p className="text-xs text-secondary leading-relaxed">
              All fine receipts and late penalties generated across the branch are balanced automatically against the daily settlement vault at end of day (10:00 PM).
            </p>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs">
            <span className="text-secondary font-medium">Daily Vault Status:</span>
            <span className="px-2.5 py-1 rounded-full font-bold bg-success-bg text-success border border-border">
              Balanced &amp; Audited
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
