// components/AdminDashboardBranchLeaderboard.tsx
'use client';
import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Trophy, TrendingUp, AlertTriangle, Users, ArrowUpRight, ShieldAlert } from 'lucide-react';

export interface BranchBenchmarkItem {
  id: string;
  name: string;
  city: string;
  managerName: string;
  totalSeats: number;
  occupiedSeats: number;
  occupancyRate: number; // percentage (e.g. 92)
  revenueMtdRupees: number; // in ₹
  expensesMtdRupees: number; // in ₹
  netProfitRupees: number; // in ₹
  renewalRate: number; // percentage (e.g. 88)
  topBottleneck: string;
}

export const BRANCH_BENCHMARK_DATA: BranchBenchmarkItem[] = [
  {
    id: 'br-laxmi-nagar',
    name: 'Laxmi Nagar Hub',
    city: 'East Delhi',
    managerName: 'Priya Verma',
    totalSeats: 120,
    occupiedSeats: 110,
    occupancyRate: 92,
    revenueMtdRupees: 165000,
    expensesMtdRupees: 35000,
    netProfitRupees: 130000,
    renewalRate: 88,
    topBottleneck: 'Night Shift Vacancy (28 seats available 10PM-6AM)',
  },
  {
    id: 'br-karol-bagh',
    name: 'Karol Bagh Central',
    city: 'Central Delhi',
    managerName: 'Rahul Sharma',
    totalSeats: 100,
    occupiedSeats: 89,
    occupancyRate: 89,
    revenueMtdRupees: 210000,
    expensesMtdRupees: 58000,
    netProfitRupees: 152000,
    renewalRate: 84,
    topBottleneck: 'Silent Zone AC Servicing Overdue',
  },
  {
    id: 'br-mukherjee-nagar',
    name: 'Mukherjee Nagar Study Center',
    city: 'North Delhi',
    managerName: 'Vikas Kumar',
    totalSeats: 150,
    occupiedSeats: 129,
    occupancyRate: 86,
    revenueMtdRupees: 180000,
    expensesMtdRupees: 44000,
    netProfitRupees: 136000,
    renewalRate: 79,
    topBottleneck: 'Weekend Full-Day Attendance Drop (-38%)',
  },
  {
    id: 'br-noida-62',
    name: 'Noida Sector 62 Campus',
    city: 'Noida (NCR)',
    managerName: 'Sunita Rao',
    totalSeats: 100,
    occupiedSeats: 58,
    occupancyRate: 58,
    revenueMtdRupees: 78000,
    expensesMtdRupees: 42000,
    netProfitRupees: 36000,
    renewalRate: 45,
    topBottleneck: 'Expired Unrenewed Members (42 unrenewed leads)',
  },
];

type SortMetric = 'profit' | 'occupancy' | 'renewal';

export function AdminDashboardBranchLeaderboard() {
  const t = useTranslations('ADMIN_DASHBOARD');
  const [sortBy, setSortBy] = useState<SortMetric>('profit');

  const sortedBranches = useMemo(() => {
    return [...BRANCH_BENCHMARK_DATA].sort((a, b) => {
      if (sortBy === 'profit') return b.netProfitRupees - a.netProfitRupees;
      if (sortBy === 'occupancy') return b.occupancyRate - a.occupancyRate;
      return b.renewalRate - a.renewalRate;
    });
  }, [sortBy]);

  const formatRupees = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-2xs space-y-4">
      {/* Section Header with Sort Tabs */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-500" />
            <h2 className="text-base sm:text-lg font-semibold text-foreground">
              {t('LEADERBOARD_TITLE')}
            </h2>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {t('LEADERBOARD_SUBTITLE')}
          </p>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-1.5 rounded-lg border border-border bg-muted/40 p-1 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setSortBy('profit')}
            className={`rounded-md px-2.5 py-1 text-xs font-medium motion-safe:transition-colors ${
              sortBy === 'profit'
                ? 'bg-card text-foreground font-semibold shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {t('LEADERBOARD_SORT_PROFIT')}
          </button>
          <button
            type="button"
            onClick={() => setSortBy('occupancy')}
            className={`rounded-md px-2.5 py-1 text-xs font-medium motion-safe:transition-colors ${
              sortBy === 'occupancy'
                ? 'bg-card text-foreground font-semibold shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {t('LEADERBOARD_SORT_OCCUPANCY')}
          </button>
          <button
            type="button"
            onClick={() => setSortBy('renewal')}
            className={`rounded-md px-2.5 py-1 text-xs font-medium motion-safe:transition-colors ${
              sortBy === 'renewal'
                ? 'bg-card text-foreground font-semibold shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {t('LEADERBOARD_SORT_RENEWAL')}
          </button>
        </div>
      </div>

      {/* Comparative Leaderboard Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse" aria-label="Branch Benchmark Leaderboard">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <th scope="col" className="px-3.5 py-3 text-center whitespace-nowrap">{t('COL_RANK')}</th>
              <th scope="col" className="px-3.5 py-3 whitespace-nowrap">{t('COL_BRANCH')}</th>
              <th scope="col" className="px-3.5 py-3 whitespace-nowrap">{t('COL_CAPACITY')}</th>
              <th scope="col" className="px-3.5 py-3 text-right whitespace-nowrap">{t('COL_REVENUE')}</th>
              <th scope="col" className="px-3.5 py-3 text-right whitespace-nowrap">{t('COL_EXPENSES')}</th>
              <th scope="col" className="px-3.5 py-3 text-right whitespace-nowrap">{t('COL_NET_PROFIT')}</th>
              <th scope="col" className="px-3.5 py-3 text-center whitespace-nowrap">{t('COL_RENEWAL')}</th>
              <th scope="col" className="px-3.5 py-3 whitespace-nowrap">{t('COL_BOTTLENECK')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sortedBranches.map((item, index) => {
              const rank = index + 1;
              const isProfitPositive = item.netProfitRupees > 0;

              return (
                <tr
                  key={item.id}
                  className="hover:bg-muted/20 motion-safe:transition-colors"
                >
                  {/* Rank Badge */}
                  <td className="px-3.5 py-3.5 text-center whitespace-nowrap">
                    {rank === 1 && (
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/20 text-xs font-bold text-amber-600 dark:text-amber-400">
                        1
                      </span>
                    )}
                    {rank === 2 && (
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-300 dark:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200">
                        2
                      </span>
                    )}
                    {rank === 3 && (
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-amber-700/20 text-xs font-bold text-amber-800 dark:text-amber-300">
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
                      <span className={`font-bold ${item.occupancyRate >= 80 ? 'text-success' : item.occupancyRate >= 60 ? 'text-warning' : 'text-destructive'}`}>
                        {item.occupancyRate}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          item.occupancyRate >= 80 ? 'bg-success' : item.occupancyRate >= 60 ? 'bg-warning' : 'bg-destructive'
                        }`}
                        style={{ width: `${item.occupancyRate}%` }}
                      />
                    </div>
                  </td>

                  {/* Revenue MTD */}
                  <td className="px-3.5 py-3.5 text-right font-mono font-medium text-foreground whitespace-nowrap">
                    {formatRupees(item.revenueMtdRupees)}
                  </td>

                  {/* Expenses MTD */}
                  <td className="px-3.5 py-3.5 text-right font-mono text-muted-foreground whitespace-nowrap">
                    {formatRupees(item.expensesMtdRupees)}
                  </td>

                  {/* Net Profit */}
                  <td className="px-3.5 py-3.5 text-right font-mono font-bold whitespace-nowrap">
                    <span className={isProfitPositive ? 'text-success' : 'text-destructive'}>
                      {isProfitPositive ? `+${formatRupees(item.netProfitRupees)}` : formatRupees(item.netProfitRupees)}
                    </span>
                  </td>

                  {/* Renewal Conversion Rate */}
                  <td className="px-3.5 py-3.5 text-center whitespace-nowrap">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                        item.renewalRate >= 80
                          ? 'bg-success/15 text-success'
                          : item.renewalRate >= 60
                          ? 'bg-warning/15 text-warning-text'
                          : 'bg-destructive/15 text-destructive'
                      }`}
                    >
                      {item.renewalRate}%
                    </span>
                  </td>

                  {/* Top Loss Reason / Growth Bottleneck */}
                  <td className="px-3.5 py-3.5 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <ShieldAlert className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                      <span className="font-medium text-foreground">{item.topBottleneck}</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default AdminDashboardBranchLeaderboard;

