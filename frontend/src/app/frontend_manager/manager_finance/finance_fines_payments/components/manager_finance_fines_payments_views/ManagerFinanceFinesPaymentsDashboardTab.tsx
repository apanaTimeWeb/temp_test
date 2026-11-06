'use client';

import React from 'react';
import { ArrowRight, CreditCard, TrendingUp, LucideIcon } from 'lucide-react';

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
  return (
    <div className="space-y-6 motion-safe:transition-all motion-safe:duration-base">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
        <div>
          <h2 className="text-xl font-bold text-primary">{overviewTitle}</h2>
          <p className="text-xs text-secondary mt-0.5">
            {timeHorizonSubtitle}
          </p>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {kpis.map((kpi) => (
          <button
            key={kpi.labelKey}
            type="button"
            onClick={() => onSelectKpi(kpi.targetTab, kpi.filterType)}
            className="p-5 rounded-2xl bg-card border border-border hover:border-primary hover:shadow-md hover:-translate-y-0.5 motion-safe:transition-all text-left cursor-pointer group flex flex-col justify-between"
          >
            <div className="flex justify-between items-start mb-3">
              <div className={`p-2.5 rounded-xl border ${kpi.bg} ${kpi.color}`}>
                <kpi.icon size={20} />
              </div>
              <span className="text-xs text-secondary group-hover:text-primary font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                View list <ArrowRight size={13} />
              </span>
            </div>
            <div>
              <div className="flex items-center justify-between gap-2 mb-1">
                <p className="text-xs font-semibold text-secondary uppercase tracking-wider">
                  {getKpiLabel(kpi.labelKey)}
                </p>
                <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-surface-highlight text-primary border border-border">
                  [{timeHorizonLabel}]
                </span>
              </div>
              <h3 className="text-2xl font-black text-primary tracking-tight">{kpi.value}</h3>
              <p className="text-[11px] text-secondary mt-1">{kpi.subtitle} ({timeHorizonLabel})</p>
            </div>
          </button>
        ))}
      </div>

      {/* Supplementary Financial Overview Widget: Payment Method Distribution */}
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
                <span className="text-primary">Debit / Credit Card & Bank</span>
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
              Audit & Settlement Status
            </h3>
            <p className="text-xs text-secondary leading-relaxed">
              All fine receipts and late penalties generated in Central Branch are balanced automatically against the daily settlement vault at end of day (10:00 PM).
            </p>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs">
            <span className="text-secondary font-medium">Daily Vault Status:</span>
            <span className="px-2.5 py-1 rounded-full font-bold bg-success-bg text-success border border-border">
              🟢 Balanced & Audited
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

