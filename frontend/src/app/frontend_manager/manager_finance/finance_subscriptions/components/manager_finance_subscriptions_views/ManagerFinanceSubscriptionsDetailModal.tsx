'use client';

import React from 'react';
import { X } from 'lucide-react';
import type { MANAGER_FINANCE_SAMPLE_SUBSCRIPTIONS } from '@/app/frontend_manager/manager_finance/finance_subscriptions/hooks/ManagerFinanceSubscriptionsDemoRepository';

const STATUS_BADGE: Record<string, string> = {
  active: 'fin-badge fin-badge--success',
  expired: 'fin-badge fin-badge--danger',
  suspended: 'fin-badge fin-badge--warning',
  cancelled: 'fin-badge fin-badge--neutral',
};

export interface ManagerFinanceSubscriptionsDetailModalProps {
  subscription: (typeof MANAGER_FINANCE_SAMPLE_SUBSCRIPTIONS)[0] | null;
  onClose: () => void;
  formatDate: (date: string) => string;
  formatCurrency: (amount: number) => string;
}

export default function ManagerFinanceSubscriptionsDetailModal({
  subscription,
  onClose,
  formatDate,
  formatCurrency,
}: ManagerFinanceSubscriptionsDetailModalProps) {
  if (!subscription) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay-backdrop p-4" onClick={onClose}>
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-dialog space-y-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center border-b border-border pb-3">
          <div>
            <h3 className="text-xl font-bold text-primary">{subscription.studentName}</h3>
            <p className="text-xs font-mono text-secondary">{subscription.smartId} • {subscription.plan}</p>
          </div>
          <button type="button" onClick={onClose} className="text-secondary hover:text-primary p-1">
            <X size={20} />
          </button>
        </div>
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
            <span className="font-semibold text-primary">{formatDate(subscription.endDate)} ({subscription.daysLeft} days left)</span>
          </div>
          <div className="p-3 rounded-xl bg-floating border border-border">
            <span className="text-secondary block">Base / Plan Fee</span>
            <span className="font-semibold text-primary">{formatCurrency(subscription.base)}</span>
          </div>
          <div className="p-3 rounded-xl bg-floating border border-border">
            <span className="text-secondary block">Discount Applied</span>
            <span className="font-semibold text-warning">− {formatCurrency(subscription.discount)}</span>
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
        <div className="flex justify-end gap-2 pt-3 border-t border-border">
          <button type="button" onClick={onClose} className="mgr-btn-ghost mgr-btn-sm">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

