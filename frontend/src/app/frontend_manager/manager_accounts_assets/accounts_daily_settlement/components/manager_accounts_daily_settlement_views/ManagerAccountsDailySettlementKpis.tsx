'use client';
import '@/app/frontend_manager/manager_accounts_assets/accounts_daily_settlement/components/manager_accounts_daily_settlement_styles/ManagerAccountsDailySettlementStyles.css';
import { Coins, QrCode, Scale, TrendingDown } from 'lucide-react';

interface ManagerAccountsDailySettlementKpisProps {
  totalCash: number;
  totalUpi: number;
  totalExp: number;
  netSurplus: number;
  dateScopeLabel: string;
  formatCurrency: (val: number) => string;
  labels: {
    cashCollected: string;
    upiCollected: string;
    expenses: string;
    net: string;
  };
}

export function ManagerAccountsDailySettlementKpis({
  totalCash,
  totalUpi,
  totalExp,
  netSurplus,
  dateScopeLabel,
  formatCurrency,
  labels,
}: ManagerAccountsDailySettlementKpisProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Cash Collected */}
      <div className="group relative overflow-hidden rounded-2xl border border-emerald-500/40 mds-kpi-emerald p-5 shadow-lg shadow-emerald-950/40 motion-safe:transition-all motion-safe:duration-300 hover:scale-[1.01] hover:border-emerald-400/60 hover:shadow-xl cursor-default select-none flex flex-col justify-between">
        <svg aria-hidden="true" className="absolute bottom-0 right-0 w-28 h-14 opacity-15 group-hover:opacity-30 motion-safe:transition-opacity pointer-events-none text-emerald-400" viewBox="0 0 150 45">
          <path d="M0,34 Q25,18 55,20 T105,8 T150,14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              {labels.cashCollected}
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center transition-transform group-hover:scale-110 shadow-xs">
              <Coins size={20} />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-center justify-between gap-2">
              <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-emerald-400 font-mono">
                {formatCurrency(totalCash)}
              </div>
              <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                [{dateScopeLabel}]
              </span>
            </div>
            <p className="mt-1 text-xs text-emerald-200/70">Physical cash drawer total ({dateScopeLabel})</p>
          </div>
        </div>
      </div>

      {/* UPI Collected */}
      <div className="group relative overflow-hidden rounded-2xl border border-cyan-500/40 mds-kpi-cyan p-5 shadow-lg shadow-cyan-950/40 motion-safe:transition-all motion-safe:duration-300 hover:scale-[1.01] hover:border-cyan-400/60 hover:shadow-xl cursor-default select-none flex flex-col justify-between">
        <svg aria-hidden="true" className="absolute bottom-0 right-0 w-28 h-14 opacity-15 group-hover:opacity-30 motion-safe:transition-opacity pointer-events-none text-cyan-400" viewBox="0 0 150 45">
          <path d="M0,32 Q25,12 50,26 T95,15 T135,24 T150,6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
              {labels.upiCollected}
            </span>
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center transition-transform group-hover:scale-110 shadow-xs">
              <QrCode size={20} />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-center justify-between gap-2">
              <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-cyan-400 font-mono">
                {formatCurrency(totalUpi)}
              </div>
              <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                [{dateScopeLabel}]
              </span>
            </div>
            <p className="mt-1 text-xs text-cyan-200/70">Direct bank / QR settlements ({dateScopeLabel})</p>
          </div>
        </div>
      </div>

      {/* Expenses Disbursed */}
      <div className="group relative overflow-hidden rounded-2xl border border-rose-500/40 mds-kpi-rose p-5 shadow-lg shadow-rose-950/40 motion-safe:transition-all motion-safe:duration-300 hover:scale-[1.01] hover:border-rose-400/60 hover:shadow-xl cursor-default select-none flex flex-col justify-between">
        <svg aria-hidden="true" className="absolute bottom-0 right-0 w-28 h-14 opacity-15 group-hover:opacity-30 motion-safe:transition-opacity pointer-events-none text-rose-400" viewBox="0 0 150 45">
          <path d="M0,30 Q20,10 45,22 T90,12 T130,18 T150,8" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider">
              {labels.expenses}
            </span>
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center justify-center transition-transform group-hover:scale-110 shadow-xs">
              <TrendingDown size={20} />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-center justify-between gap-2">
              <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-rose-400 font-mono">
                {formatCurrency(totalExp)}
              </div>
              <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/30">
                [{dateScopeLabel}]
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-400">Petty cash paid from counter ({dateScopeLabel})</p>
          </div>
        </div>
      </div>

      {/* Net Shift Surplus */}
      <div className="group relative overflow-hidden rounded-2xl border border-amber-500/40 mds-kpi-amber p-5 shadow-lg shadow-amber-950/40 motion-safe:transition-all motion-safe:duration-300 hover:scale-[1.01] hover:border-amber-400/60 hover:shadow-xl cursor-default select-none flex flex-col justify-between">
        <svg aria-hidden="true" className="absolute bottom-0 right-0 w-28 h-14 opacity-15 group-hover:opacity-30 motion-safe:transition-opacity pointer-events-none text-amber-400" viewBox="0 0 150 45">
          <path d="M0,32 Q25,12 50,26 T95,15 T135,24 T150,6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
              {labels.net}
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center transition-transform group-hover:scale-110 shadow-xs">
              <Scale size={20} />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-center justify-between gap-2">
              <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-amber-400 font-mono">
                {formatCurrency(netSurplus)}
              </div>
              <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                [{dateScopeLabel}]
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-400">Net realized vault closing balance ({dateScopeLabel})</p>
          </div>
        </div>
      </div>
    </div>
  );
}

