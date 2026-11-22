'use client';

import { ShieldAlert } from 'lucide-react';
import type { BranchBenchmarkItem } from './AdminDashboardBranchLeaderboard';

interface AdminDashboardBranchLeaderboardRowProps {
  item: BranchBenchmarkItem;
  rank: number;
  formatRupees: (amount: number) => string;
}

export function AdminDashboardBranchLeaderboardRow({
  item,
  rank,
  formatRupees,
}: AdminDashboardBranchLeaderboardRowProps) {
  const currentProfit = item.profitDisplay ?? item.netProfitRupees;
  const isProfitPositive = currentProfit > 0;
  const clampedOccupancy = Math.min(100, Math.max(0, Math.round(item.occupancyRate)));

  return (
    <tr className="hover:bg-indigo-500/5 transition-colors">
      {/* Rank Badge */}
      <td className="px-3.5 py-3.5 text-center whitespace-nowrap">
        {rank === 1 && (
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold shadow-xs">
            1
          </span>
        )}
        {rank === 2 && (
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-700/60 text-slate-200 border border-slate-600/50 text-xs font-bold">
            2
          </span>
        )}
        {rank === 3 && (
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-xs font-bold">
            3
          </span>
        )}
        {rank > 3 && (
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-800 text-slate-400 text-xs font-medium">
            {rank}
          </span>
        )}
      </td>

      {/* Branch & Manager */}
      <td className="px-3.5 py-3.5 whitespace-nowrap">
        <p className="font-bold text-white text-xs sm:text-sm">{item.name}</p>
        <p className="text-xs text-slate-400 mt-0.5">
          {item.city} · Mgr: <span className="font-medium text-slate-300">{item.managerName}</span>
        </p>
      </td>

      {/* Capacity & Occupancy Bar */}
      <td className="px-3.5 py-3.5 whitespace-nowrap min-w-[160px]">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="font-medium text-slate-300">{item.occupiedSeats}/{item.totalSeats} seats</span>
          <span className={`font-bold ${item.occupancyRate >= 80 ? 'text-emerald-400' : item.occupancyRate >= 60 ? 'text-amber-400' : 'text-rose-400'}`}>
            {item.occupancyRate}%
          </span>
        </div>
        <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
          <div
            className={`h-full rounded-full admin-dynamic-width-${clampedOccupancy} ${
              item.occupancyRate >= 80 ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : item.occupancyRate >= 60 ? 'bg-gradient-to-r from-amber-500 to-yellow-400' : 'bg-gradient-to-r from-rose-500 to-red-400'
            }`}
          />
        </div>
      </td>

      {/* Revenue */}
      <td className="px-3.5 py-3.5 text-right font-mono font-semibold text-slate-200 whitespace-nowrap">
        {formatRupees(item.revenueDisplay ?? item.revenueMtdRupees)}
      </td>

      {/* Expenses */}
      <td className="px-3.5 py-3.5 text-right font-mono text-slate-400 whitespace-nowrap">
        {formatRupees(item.expensesDisplay ?? item.expensesMtdRupees)}
      </td>

      {/* Net Profit */}
      <td className="px-3.5 py-3.5 text-right font-mono font-bold whitespace-nowrap">
        <span className={isProfitPositive ? 'text-emerald-400' : 'text-rose-400'}>
          {isProfitPositive ? `+${formatRupees(currentProfit)}` : formatRupees(currentProfit)}
        </span>
      </td>

      {/* Renewal Conversion Rate */}
      <td className="px-3.5 py-3.5 text-center whitespace-nowrap">
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
            item.renewalRate >= 80
              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
              : item.renewalRate >= 60
              ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
              : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
          }`}
        >
          {item.renewalRate}%
        </span>
      </td>

      {/* Top Loss Reason / Growth Bottleneck */}
      <td className="px-3.5 py-3.5 whitespace-nowrap">
        <div className="flex items-center gap-1.5 text-xs text-slate-300">
          <ShieldAlert className="h-3.5 w-3.5 text-amber-400 shrink-0" />
          <span className="font-medium text-slate-200">{item.topBottleneck}</span>
        </div>
      </td>
    </tr>
  );
}

export default AdminDashboardBranchLeaderboardRow;
