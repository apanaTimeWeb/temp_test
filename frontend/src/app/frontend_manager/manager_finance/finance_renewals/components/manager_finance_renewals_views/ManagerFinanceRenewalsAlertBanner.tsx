'use client';

import React from 'react';
import { BellRing, MessageSquare, Clock, UserX, AlertTriangle, ShieldAlert } from 'lucide-react';

export interface ManagerFinanceRenewalsAlertBannerProps {
  expiringCount: number;
  expiredCount: number;
  pastGraceCount?: number;
  onSendDueReminders: () => void;
  onSend3DayReminders?: () => void;
  onAutoReleaseSeats?: () => void;
}

export default function ManagerFinanceRenewalsAlertBanner({
  expiringCount,
  expiredCount,
  pastGraceCount = 0,
  onSendDueReminders,
  onSend3DayReminders,
  onAutoReleaseSeats,
}: ManagerFinanceRenewalsAlertBannerProps) {
  const totalPending = expiringCount + expiredCount;

  return (
    <div className="space-y-3">
      {/* Expiry Alert Card */}
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
              <strong className="text-warning">{expiringCount} members expiring within 3 days</strong>.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {onSend3DayReminders && (
            <button
              type="button"
              data-testid="manager-finance-1click-3day-whatsapp"
              onClick={onSend3DayReminders}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              title="1-Click WhatsApp reminder to all students expiring in <= 3 days"
            >
              <MessageSquare size={13} />
              <span>1-Click Bulk WhatsApp (≤ 3 Days Due)</span>
            </button>
          )}
          <button
            type="button"
            onClick={onSendDueReminders}
            className="mgr-btn-outline text-xs flex items-center gap-1.5"
          >
            <MessageSquare size={13} /> All Reminders ({totalPending})
          </button>
        </div>
      </div>

      {/* Seat Release Policy / Timer Banner */}
      <div className="p-3.5 rounded-xl border border-rose-500/20 bg-rose-500/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-rose-500/15 text-rose-600 dark:text-rose-400">
            <Clock size={16} />
          </div>
          <div>
            <div className="flex items-center gap-2 font-bold text-primary">
              <span>Seat Auto-Release Policy (3-Day Grace Period)</span>
              {pastGraceCount > 0 && (
                <span className="fin-badge fin-badge--danger text-[10px] px-1.5 py-0">
                  {pastGraceCount} Seats Eligible for Release
                </span>
              )}
            </div>
            <p className="text-secondary text-[11px] mt-0.5">
              Seats expired for &gt; 3 days are unassigned automatically to free up capacity for new admissions.
            </p>
          </div>
        </div>

        {pastGraceCount > 0 && onAutoReleaseSeats && (
          <button
            type="button"
            data-testid="manager-finance-bulk-seat-release"
            onClick={onAutoReleaseSeats}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <UserX size={13} />
            <span>Auto-Release Expired Seats ({pastGraceCount})</span>
          </button>
        )}
      </div>
    </div>
  );
}
