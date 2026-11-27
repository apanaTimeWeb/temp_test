'use client';

import type { BranchBenchmarkItem } from '@/app/frontend_admin/admin_dashboard/dashboard_overview/components/AdminDashboardBranchLeaderboard';
import { ShieldAlert } from 'lucide-react';

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
    <tr className="hover:bg-surface-hover motion-safe:transition-colors">
      {/* Rank Badge */}
      <td className="px-3.5 py-3.5 text-center whitespace-nowrap">
        {rank === 1 && (
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-warning-bg text-warning-text border border-warning text-xs font-bold shadow-card">
            1
          </span>
        )}
        {rank === 2 && (
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-surface-highlight text-text-primary border border-border text-xs font-bold">
            2
          </span>
        )}
        {rank === 3 && (
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary-subtle text-primary border border-border-focus text-xs font-bold">
            3
          </span>
        )}
        {rank > 3 && (
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-surface-highlight text-text-secondary text-xs font-medium">
            {rank}
          </span>
        )}
      </td>

      {/* Branch & Manager */}
      <td className="px-3.5 py-3.5 whitespace-nowrap">
        <p className="font-bold text-text-primary text-xs sm:text-sm">{item.name}</p>
        <p className="text-xs text-text-secondary mt-0.5">
          {item.city} · Mgr: <span className="font-medium text-text-primary">{item.managerName}</span>
        </p>
      </td>

      {/* Capacity & Occupancy Bar */}
      <td className="px-3.5 py-3.5 whitespace-nowrap min-w-[160px]">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="font-medium text-text-secondary">{item.occupiedSeats}/{item.totalSeats} seats</span>
          <span className={`font-bold ${item.occupancyRate >= 80 ? 'text-success-text' : item.occupancyRate >= 60 ? 'text-warning-text' : 'text-danger-text'}`}>
            {item.occupancyRate}%
          </span>
        </div>
        <div className="h-2 w-full rounded-full bg-surface-highlight overflow-hidden">
          <div
            className={`h-full rounded-full admin-dynamic-width-${clampedOccupancy} ${
              item.occupancyRate >= 80 ? 'bg-success' : item.occupancyRate >= 60 ? 'bg-warning' : 'bg-danger'
            }`}
          />
        </div>
      </td>

      {/* Revenue */}
      <td className="px-3.5 py-3.5 text-right font-mono font-semibold text-text-primary whitespace-nowrap">
        {formatRupees(item.revenueDisplay ?? item.revenueMtdRupees)}
      </td>

      {/* Expenses */}
      <td className="px-3.5 py-3.5 text-right font-mono text-text-secondary whitespace-nowrap">
        {formatRupees(item.expensesDisplay ?? item.expensesMtdRupees)}
      </td>

      {/* Net Profit */}
      <td className="px-3.5 py-3.5 text-right font-mono font-bold whitespace-nowrap">
        <span className={isProfitPositive ? 'text-success-text' : 'text-danger-text'}>
          {isProfitPositive ? `+${formatRupees(currentProfit)}` : formatRupees(currentProfit)}
        </span>
      </td>

      {/* Renewal Conversion Rate */}
      <td className="px-3.5 py-3.5 text-center whitespace-nowrap">
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
            item.renewalRate >= 80
              ? 'bg-success-bg text-success-text border border-success'
              : item.renewalRate >= 60
              ? 'bg-warning-bg text-warning-text border border-warning'
              : 'bg-danger-bg text-danger-text border border-danger'
          }`}
        >
          {item.renewalRate}%
        </span>
      </td>

      {/* Top Loss Reason / Growth Bottleneck */}
      <td className="px-3.5 py-3.5 whitespace-nowrap">
        <div className="flex items-center gap-1.5 text-xs text-text-secondary">
          <ShieldAlert className="h-3.5 w-3.5 text-warning-text shrink-0" aria-hidden="true" />
          <span className="font-medium text-text-primary">{item.topBottleneck}</span>
        </div>
      </td>
    </tr>
  );
}

export default AdminDashboardBranchLeaderboardRow;
