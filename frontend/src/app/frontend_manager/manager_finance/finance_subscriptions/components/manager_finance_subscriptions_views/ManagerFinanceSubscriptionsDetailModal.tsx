'use client';

import type { MANAGER_FINANCE_SAMPLE_SUBSCRIPTIONS } from '@/app/frontend_manager/manager_finance/finance_subscriptions/hooks/ManagerFinanceSubscriptionsDemoRepository';
import { AlertCircle,ArrowUpRight,Clock,RefreshCw,X } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';

const STATUS_BADGE: Record<string, string> = {
  active: 'fin-badge fin-badge--success',
  expired: 'fin-badge fin-badge--danger',
  suspended: 'fin-badge fin-badge--warning',
  cancelled: 'fin-badge fin-badge--neutral',
};

export interface ManagerFinanceSubscriptionsDetailModalProps {
  subscription: (typeof MANAGER_FINANCE_SAMPLE_SUBSCRIPTIONS)[0] | null;
  onClose: () => void;
  onRenewClick?: (sub: (typeof MANAGER_FINANCE_SAMPLE_SUBSCRIPTIONS)[0]) => void;
  formatDate: (date: string) => string;
  formatCurrency: (amount: number) => string;
}

export default function ManagerFinanceSubscriptionsDetailModal({
  subscription,
  onClose,
  onRenewClick,
  formatDate,
  formatCurrency,
}: ManagerFinanceSubscriptionsDetailModalProps) {
  useEffect(() => {
    if (!subscription) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [subscription, onClose]);

  if (!subscription) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay-backdrop p-4" onClick={onClose} role="dialog" aria-modal="true">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-4 sm:p-6 shadow-dialog space-y-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center border-b border-border pb-3">
          <div>
            <h3 className="text-xl font-bold text-primary">{subscription.studentName}</h3>
            <p className="text-xs font-mono text-secondary">{subscription.smartId} • {subscription.plan}</p>
          </div>
          <button type="button" onClick={onClose} className="text-secondary hover:text-primary p-1 rounded-lg hover:bg-surface-hover" aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Due Warning Banner if student has pending dues */}
        {subscription.due > 0 && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0" />
              <span>
                <strong>Outstanding Due:</strong> {formatCurrency(subscription.due)} is unpaid for this plan.
              </span>
            </div>
            <Link
              href="/frontend_manager/manager_finance/finance_collect_fee"
              className="inline-flex items-center gap-1 font-semibold text-rose-600 dark:text-rose-400 underline hover:no-underline shrink-0"
            >
              Collect Fee <ArrowUpRight size={13} />
            </Link>
          </div>
        )}

        {/* Expiry Warning Banner if plan expired or expiring within 7 days */}
        {subscription.status === 'expired' ? (
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs flex items-center gap-2">
            <Clock size={16} className="shrink-0" />
            <span>
              <strong>Plan Expired:</strong> Expired {Math.abs(subscription.daysLeft)} days ago ({formatDate(subscription.endDate)}).
            </span>
          </div>
        ) : subscription.daysLeft <= 7 ? (
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs flex items-center gap-2">
            <Clock size={16} className="shrink-0" />
            <span>
              <strong>Expiring Soon:</strong> Only {subscription.daysLeft} days remaining on this subscription cycle.
            </span>
          </div>
        ) : null}

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-floating border border-border">
            <span className="text-secondary block">Shift & Timing</span>
            <span className="font-bold text-primary text-sm mt-0.5 block">{subscription.shift}</span>
          </div>
          <div className="p-3 rounded-xl bg-floating border border-border">
            <span className="text-secondary block">Subscription Status</span>
            <span className={`inline-block mt-1 ${STATUS_BADGE[subscription.status] || 'fin-badge'}`}>{subscription.status.toUpperCase()}</span>
          </div>
          <div className="p-3 rounded-xl bg-floating border border-border">
            <span className="text-secondary block">Start Date</span>
            <span className="font-semibold text-primary">{formatDate(subscription.startDate)}</span>
          </div>
          <div className="p-3 rounded-xl bg-floating border border-border">
            <span className="text-secondary block">End Date</span>
            <span className="font-semibold text-primary">
              {formatDate(subscription.endDate)} ({subscription.daysLeft < 0 ? `${Math.abs(subscription.daysLeft)} days overdue` : `${subscription.daysLeft} days remaining`})
            </span>
          </div>
          <div className="p-3 rounded-xl bg-floating border border-border">
            <span className="text-secondary block">Base / Plan Fee</span>
            <span className="font-semibold text-primary">{formatCurrency(subscription.base)}</span>
          </div>
          <div className="p-3 rounded-xl bg-floating border border-border">
            <span className="text-secondary block">Discount Applied</span>
            <span className="font-semibold text-warning">- {formatCurrency(subscription.discount)}</span>
          </div>
          <div className="p-3 rounded-xl bg-floating border border-border">
            <span className="text-secondary block">Total Paid</span>
            <span className="font-bold text-success text-sm">{formatCurrency(subscription.paid)}</span>
          </div>
          <div className="p-3 rounded-xl bg-floating border border-border">
            <span className="text-secondary block">Balance Due</span>
            <span className={`font-bold text-sm ${subscription.due > 0 ? 'text-danger' : 'text-primary'}`}>{formatCurrency(subscription.due)}</span>
          </div>
        </div>
        <div className="flex justify-between items-center pt-3 border-t border-border">
          {onRenewClick && (
            <button
              type="button"
              onClick={() => {
                const target = subscription;
                onClose();
                onRenewClick(target);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs cursor-pointer motion-safe:transition-colors"
            >
              <RefreshCw size={13} /> Renew This Plan
            </button>
          )}
          <button type="button" onClick={onClose} className="mgr-btn-ghost mgr-btn-sm ml-auto">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

