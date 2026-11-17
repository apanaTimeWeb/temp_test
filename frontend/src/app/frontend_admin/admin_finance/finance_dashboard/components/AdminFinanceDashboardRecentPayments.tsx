'use client';

import { Receipt } from 'lucide-react';
import type { AdminFinanceDemoRecentPayment } from '@/app/frontend_admin/admin_finance/finance_dashboard/types/AdminFinanceDashboardTypes';

interface AdminFinanceDashboardRecentPaymentsProps {
  displayedPayments: AdminFinanceDemoRecentPayment[];
  totalPaymentsCount: number;
  isLoading: boolean;
  periodLabel: string;
  emptyText: string;
  formatCurrency: (amount: number) => string;
}

export function AdminFinanceDashboardRecentPayments({
  displayedPayments,
  totalPaymentsCount,
  isLoading,
  periodLabel,
  emptyText,
  formatCurrency,
}: AdminFinanceDashboardRecentPaymentsProps) {
  return (
    <div className="min-w-0 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b border-border p-5 bg-card">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-subtle text-primary">
            <Receipt size={17} strokeWidth={2.2} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-text-primary">Recent Direct Collections</h2>
              <span className="rounded-md bg-success-bg px-2 py-0.5 text-[11px] font-semibold text-success-text">
                {periodLabel}
              </span>
            </div>
            <p className="text-xs text-text-secondary">
              Direct collections & transactions feed for {periodLabel}
            </p>
          </div>
        </div>
        <span className="rounded-full bg-surface-highlight px-2.5 py-0.5 text-xs font-medium text-text-secondary">
          Showing {displayedPayments.length} of {totalPaymentsCount} entries
        </span>
      </div>

      <div className="divide-y divide-border">
        {isLoading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div key={`skeleton-${i + 1}`} className="flex items-center justify-between gap-4 p-4">
                <div className="space-y-1">
                  <div className="motion-safe:animate-pulse rounded-sm bg-skeleton-base h-4 w-32" />
                  <div className="motion-safe:animate-pulse rounded-sm bg-skeleton-base h-3 w-20" />
                </div>
                <div className="text-right space-y-1">
                  <div className="motion-safe:animate-pulse rounded-sm bg-skeleton-base h-4 w-16 ml-auto" />
                  <div className="motion-safe:animate-pulse rounded-sm bg-skeleton-base h-3 w-12 ml-auto" />
                </div>
              </div>
            ))
          : displayedPayments.length === 0 ? (
              <div className="p-8 text-center text-sm text-text-muted">
                <p>{emptyText}</p>
                <p className="mt-1 text-xs text-text-secondary">
                  {"No transactions recorded for "}{periodLabel}{". Switch to 'This Month' to view all records."}
                </p>
              </div>
            ) : (
              displayedPayments.map((p) => {
                const initials = p.studentName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
                return (
                  <div key={p.id} className="flex items-center justify-between gap-4 p-4 hover:bg-surface-hover motion-safe:transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-indigo-500/10 to-purple-500/10 text-indigo-500 font-bold text-xs border border-indigo-500/20 shrink-0">
                        {initials}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-text-primary">{p.studentName}</div>
                        <div className="text-xs text-text-secondary font-mono">{p.studentSmartId} · {p.date}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        data-testid="admin_finance-page-state-001"
                        className={`inline-flex min-h-6 items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize whitespace-nowrap ${
                          p.mode === 'cash' ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                          p.mode === 'upi' ? 'border-indigo-500/20 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' :
                          p.mode === 'card' ? 'border-purple-500/20 bg-purple-500/10 text-purple-600 dark:text-purple-400' :
                          p.mode === 'bank' ? 'border-cyan-500/20 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400' :
                          'border-border bg-surface-highlight text-text-secondary'
                        }`}
                      >
                        {p.mode}
                      </span>
                      <span className="font-bold text-sm text-text-primary font-mono">{formatCurrency(p.amount)}</span>
                    </div>
                  </div>
                );
              })
            )}
      </div>
    </div>
  );
}

export default AdminFinanceDashboardRecentPayments;

