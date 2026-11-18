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
        {kpis.map((kpi) => {
          const config = (() => {
            switch (kpi.id) {
              case 'todaysCollection':
                return {
                  label: 'Realized',
                  cls: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
                  cardBg: 'border-emerald-500/40 bg-gradient-to-br from-emerald-950/80 via-[#0e2c21] to-emerald-900/60 shadow-lg shadow-emerald-950/40 hover:border-emerald-400/60',
                  iconBox: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
                  stroke: '#34d399',
                  valColor: 'text-emerald-400',
                };
              case 'totalPending':
                return {
                  label: 'Unsettled Dues',
                  cls: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
                  cardBg: 'border-rose-500/40 bg-gradient-to-br from-rose-950/80 via-[#260e19] to-rose-900/60 shadow-lg shadow-rose-950/40 hover:border-rose-400/60',
                  iconBox: 'bg-rose-500/20 text-rose-400 border-rose-500/40',
                  stroke: '#f87171',
                  valColor: 'text-rose-400',
                };
              case 'overdueFines':
                return {
                  label: 'Critical Follow-up',
                  cls: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
                  cardBg: 'border-amber-500/40 bg-gradient-to-br from-amber-950/80 via-[#261708] to-amber-900/60 shadow-lg shadow-amber-950/40 hover:border-amber-400/60',
                  iconBox: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
                  stroke: '#fbbf24',
                  valColor: 'text-amber-400',
                };
              case 'lostBookCharges':
                return {
                  label: 'Book Replacement',
                  cls: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
                  cardBg: 'border-cyan-500/40 bg-gradient-to-br from-cyan-950/80 via-[#0a282f] to-cyan-900/60 shadow-lg shadow-cyan-950/40 hover:border-cyan-400/60',
                  iconBox: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40',
                  stroke: '#22d3ee',
                  valColor: 'text-cyan-400',
                };
              case 'damageCharges':
                return {
                  label: 'Property Restitution',
                  cls: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
                  cardBg: 'border-purple-500/40 bg-gradient-to-br from-purple-950/80 via-[#24133f] to-purple-900/60 shadow-lg shadow-purple-950/40 hover:border-purple-400/60',
                  iconBox: 'bg-purple-500/20 text-purple-400 border-purple-500/40',
                  stroke: '#c084fc',
                  valColor: 'text-purple-400',
                };
              default:
                return {
                  label: timeHorizonLabel,
                  cls: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
                  cardBg: 'border-indigo-500/40 bg-gradient-to-br from-indigo-950/80 via-[#181c4b] to-indigo-900/60 shadow-lg shadow-indigo-950/40 hover:border-indigo-400/60',
                  iconBox: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/40',
                  stroke: '#818cf8',
                  valColor: 'text-white',
                };
            }
          })();

          return (
            <button
              key={kpi.labelKey}
              type="button"
              onClick={() => onSelectKpi(kpi.targetTab, kpi.filterType)}
              className={`group relative overflow-hidden p-5 rounded-2xl border transition-all duration-300 hover:scale-[1.01] hover:shadow-xl text-left cursor-pointer flex flex-col justify-between ${config.cardBg}`}
            >
              <svg aria-hidden="true" className="absolute bottom-0 right-0 w-28 h-14 opacity-15 group-hover:opacity-30 motion-safe:transition-opacity pointer-events-none" viewBox="0 0 150 45">
                <path d="M0,32 Q25,12 50,26 T95,15 T135,24 T150,6" fill="none" stroke={config.stroke} strokeWidth="2.5" strokeLinecap="round" />
              </svg>
              <div className="relative z-10 w-full">
                <div className="flex justify-between items-start mb-3">
                  <div className={`p-2.5 rounded-xl border transition-transform group-hover:scale-110 shadow-xs ${config.iconBox}`}>
                    <kpi.icon size={20} />
                  </div>
                  <span className="text-xs text-slate-300 group-hover:text-white font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-all">
                    View list <ArrowRight size={13} />
                  </span>
                </div>
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      {getKpiLabel(kpi.labelKey)}
                    </p>
                    <span className={`text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full border ${config.cls}`}>
                      {config.label}
                    </span>
                  </div>
                  <h3 className={`text-2xl sm:text-3xl font-extrabold tracking-tight font-sans ${config.valColor}`}>{kpi.value}</h3>
                  <p className="text-[11px] text-slate-400 mt-1">{kpi.subtitle} ({timeHorizonLabel})</p>
                </div>
              </div>
            </button>
          );
        })}
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
              All fine receipts and late penalties generated across the branch are balanced automatically against the daily settlement vault at end of day (10:00 PM).
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

