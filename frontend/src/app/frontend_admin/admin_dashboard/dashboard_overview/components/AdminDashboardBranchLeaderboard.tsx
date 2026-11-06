// components/AdminDashboardBranchLeaderboard.tsx
'use client';
import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Trophy, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { AdminDashboardBranchLeaderboardRow } from './AdminDashboardBranchLeaderboardRow';

export type AdminDashboardTimeRange = 'today' | 'this_week' | 'this_month' | 'custom';

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
  revenueDisplay?: number;
  expensesDisplay?: number;
  profitDisplay?: number;
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

type SortMetric = 'profit' | 'occupancy' | 'renewal' | 'revenue' | 'expenses' | 'branch';

export function AdminDashboardBranchLeaderboard({
  timeRange = 'this_month',
}: {
  timeRange?: AdminDashboardTimeRange;
}) {
  const t = useTranslations('ADMIN_DASHBOARD');
  const [sortBy, setSortBy] = useState<SortMetric>('profit');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const formatRupees = (amount: number) => `₹${amount.toLocaleString('en-IN')}`;

  const toggleSort = (metric: SortMetric) => {
    if (sortBy === metric) {
      setSortDirection((prev) => (prev === 'desc' ? 'asc' : 'desc'));
    } else {
      setSortBy(metric);
      setSortDirection('desc');
    }
  };

  const multiplier = timeRange === 'today' ? 0.04 : timeRange === 'this_week' ? 0.25 : 1;

  const adjustedBranches = useMemo(() => {
    return BRANCH_BENCHMARK_DATA.map((b) => ({
      ...b,
      revenueDisplay: Math.round(b.revenueMtdRupees * multiplier),
      expensesDisplay: Math.round(b.expensesMtdRupees * multiplier),
      profitDisplay: Math.round(b.netProfitRupees * multiplier),
    }));
  }, [multiplier]);

  const sortedBranches = useMemo(() => {
    return [...adjustedBranches].sort((a, b) => {
      let diff = 0;
      if (sortBy === 'profit') diff = (a.profitDisplay ?? a.netProfitRupees) - (b.profitDisplay ?? b.netProfitRupees);
      else if (sortBy === 'occupancy') diff = a.occupancyRate - b.occupancyRate;
      else if (sortBy === 'renewal') diff = a.renewalRate - b.renewalRate;
      else if (sortBy === 'revenue') diff = (a.revenueDisplay ?? a.revenueMtdRupees) - (b.revenueDisplay ?? b.revenueMtdRupees);
      else if (sortBy === 'expenses') diff = (a.expensesDisplay ?? a.expensesMtdRupees) - (b.expensesDisplay ?? b.expensesMtdRupees);
      else if (sortBy === 'branch') return sortDirection === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
      return sortDirection === 'asc' ? diff : -diff;
    });
  }, [adjustedBranches, sortBy, sortDirection]);

  const periodLabel = timeRange === 'today' ? 'Today' : timeRange === 'this_week' ? 'This Week' : 'MTD';

  const renderSortableHeader = (metric: SortMetric, label: string, align: 'left' | 'right' | 'center' = 'left') => {
    const isActive = sortBy === metric;
    return (
      <th scope="col" aria-sort={isActive ? (sortDirection === 'asc' ? 'ascending' : 'descending') : undefined} className="p-3">
        <button
          type="button"
          onClick={() => toggleSort(metric)}
          className={`group inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-text-secondary hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1 -mx-1 ${align === 'right' ? 'ml-auto' : align === 'center' ? 'mx-auto' : ''}`}
          aria-label={`${label}, sort ${isActive ? (sortDirection === 'asc' ? 'descending' : 'ascending') : 'ascending'}`}
        >
          <span>{label}</span>
          {isActive ? (
            sortDirection === 'asc' ? (
              <ArrowUp size={14} className="text-primary font-bold shrink-0" aria-hidden="true" />
            ) : (
              <ArrowDown size={14} className="text-primary font-bold shrink-0" aria-hidden="true" />
            )
          ) : (
            <ArrowUpDown size={14} className="text-text-secondary/40 group-hover:text-text-secondary transition-colors shrink-0" aria-hidden="true" />
          )}
        </button>
      </th>
    );
  };

  return (
    <section aria-labelledby="branch-leaderboard-title" className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Trophy className="text-warning" size={20} />
            <h2 id="branch-leaderboard-title" className="text-base font-bold text-text-primary">
              Multi-Branch Performance & Benchmarking
            </h2>
          </div>
          <p className="text-xs text-text-secondary mt-1">
            Comparative revenue, occupancy, and bottleneck diagnostics ({periodLabel} Horizon)
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-border bg-muted/20">
              <th scope="col" className="p-3 uppercase font-semibold text-text-secondary">Rank</th>
              {renderSortableHeader('branch', 'Branch & Manager')}
              {renderSortableHeader('occupancy', 'Occupancy')}
              {renderSortableHeader('revenue', `Revenue (${periodLabel})`, 'right')}
              {renderSortableHeader('expenses', `Expenses (${periodLabel})`, 'right')}
              {renderSortableHeader('profit', `Net Profit (${periodLabel})`, 'right')}
              {renderSortableHeader('renewal', 'Renewal %', 'center')}
              <th scope="col" className="p-3 uppercase font-semibold text-text-secondary">Key Bottleneck / Alert</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sortedBranches.map((item, index) => (
              <AdminDashboardBranchLeaderboardRow
                key={item.id}
                item={item}
                rank={index + 1}
                formatRupees={formatRupees}
              />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default AdminDashboardBranchLeaderboard;
