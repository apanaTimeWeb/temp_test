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
    <tr className="hover:bg-muted-hover motion-safe:transition-colors">
      {/* Rank Badge */}
      <td className="px-3.5 py-3.5 text-center whitespace-nowrap">
        {rank === 1 && (
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-warning-bg text-xs font-bold text-warning-text">
            1
          </span>
        )}
        {rank === 2 && (
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-surface-highlight text-xs font-bold text-text-primary">
            2
          </span>
        )}
        {rank === 3 && (
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary-subtle text-xs font-bold text-primary">
            3
          </span>
        )}
        {rank > 3 && (
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
            {rank}
          </span>
        )}
      </td>

      {/* Branch & Manager */}
      <td className="px-3.5 py-3.5 whitespace-nowrap">
        <p className="font-semibold text-foreground">{item.name}</p>
        <p className="text-xs text-muted-foreground">
          {item.city} · Mgr: <span className="font-medium text-foreground">{item.managerName}</span>
        </p>
      </td>

      {/* Capacity & Occupancy Bar */}
      <td className="px-3.5 py-3.5 whitespace-nowrap min-w-[160px]">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="font-medium text-foreground">{item.occupiedSeats}/{item.totalSeats} seats</span>
          <span className={`font-bold ${item.occupancyRate >= 80 ? 'text-success' : item.occupancyRate >= 60 ? 'text-warning-text' : 'text-danger-text'}`}>
            {item.occupancyRate}%
          </span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
          <div
            className={`h-full rounded-full admin-dynamic-width-${clampedOccupancy} ${
              item.occupancyRate >= 80 ? 'bg-success' : item.occupancyRate >= 60 ? 'bg-warning' : 'bg-danger'
            }`}
          />
        </div>
      </td>

      {/* Revenue */}
      <td className="px-3.5 py-3.5 text-right font-mono font-medium text-foreground whitespace-nowrap">
        {formatRupees(item.revenueDisplay ?? item.revenueMtdRupees)}
      </td>

      {/* Expenses */}
      <td className="px-3.5 py-3.5 text-right font-mono text-muted-foreground whitespace-nowrap">
        {formatRupees(item.expensesDisplay ?? item.expensesMtdRupees)}
      </td>

      {/* Net Profit */}
      <td className="px-3.5 py-3.5 text-right font-mono font-bold whitespace-nowrap">
        <span className={isProfitPositive ? 'text-success' : 'text-danger-text'}>
          {isProfitPositive ? `+${formatRupees(currentProfit)}` : formatRupees(currentProfit)}
        </span>
      </td>

      {/* Renewal Conversion Rate */}
      <td className="px-3.5 py-3.5 text-center whitespace-nowrap">
        <span
          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
            item.renewalRate >= 80
              ? 'bg-success-bg text-success-text'
              : item.renewalRate >= 60
              ? 'bg-warning-bg text-warning-text'
              : 'bg-danger-bg text-danger-text'
          }`}
        >
          {item.renewalRate}%
        </span>
      </td>

      {/* Top Loss Reason / Growth Bottleneck */}
      <td className="px-3.5 py-3.5 whitespace-nowrap">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <ShieldAlert className="h-3.5 w-3.5 text-warning-text shrink-0" />
          <span className="font-medium text-foreground">{item.topBottleneck}</span>
        </div>
      </td>
    </tr>
  );
}

export default AdminDashboardBranchLeaderboardRow;

