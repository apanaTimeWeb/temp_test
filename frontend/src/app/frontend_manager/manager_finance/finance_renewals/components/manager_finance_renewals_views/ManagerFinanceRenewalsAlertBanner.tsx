'use client';

import React from 'react';
import { BellRing, MessageSquare } from 'lucide-react';

export interface ManagerFinanceRenewalsAlertBannerProps {
  expiringCount: number;
  expiredCount: number;
  onSendDueReminders: () => void;
}

export default function ManagerFinanceRenewalsAlertBanner({
  expiringCount,
  expiredCount,
  onSendDueReminders,
}: ManagerFinanceRenewalsAlertBannerProps) {
  const totalPending = expiringCount + expiredCount;

  return (
    <div className="p-4 rounded-xl bg-card border border-border shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-warning-bg border border-border text-warning flex items-center justify-center shrink-0">
          <BellRing size={20} className="motion-safe:animate-bounce" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-primary flex items-center gap-2">
            <span>Subscription Expiry Notification</span>
            <span className="px-2 py-0.5 rounded-full text-[11px] bg-danger text-on-danger font-bold">
              {totalPending} Urgently Pending
            </span>
          </h3>
          <p className="text-xs text-secondary mt-0.5">
            <strong className="text-danger">{expiredCount} subscriptions already expired</strong> ·{' '}
            <strong className="text-warning">{expiringCount} members have ≤ 3 days remaining</strong>. Send reminders to safeguard seat renewals.
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={onSendDueReminders}
          className="mgr-btn-primary text-xs flex items-center gap-1.5"
        >
          <MessageSquare size={14} /> Send Due Reminders ({totalPending})
        </button>
      </div>
    </div>
  );
}

