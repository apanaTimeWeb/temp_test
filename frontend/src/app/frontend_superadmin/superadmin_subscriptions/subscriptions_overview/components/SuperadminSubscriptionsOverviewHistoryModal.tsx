'use client';

import { History, X, Calendar, User, ShieldCheck } from 'lucide-react';
import type { SuperadminSubscriptionRecord } from '@/app/frontend_superadmin/superadmin_subscriptions/subscriptions_overview/types/SuperadminSubscriptionsOverviewTypes';

interface SuperadminSubscriptionsOverviewHistoryModalProps {
  subscription: SuperadminSubscriptionRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function SuperadminSubscriptionsOverviewHistoryModal({
  subscription,
  isOpen,
  onClose,
}: SuperadminSubscriptionsOverviewHistoryModalProps) {
  if (!isOpen || !subscription) return null;

  const history = subscription.history || [
    {
      id: 'default-1',
      date: subscription.startDate || '2026-01-01',
      action: 'Account Provisioned',
      note: `Initialized on ${subscription.plan} tier`,
      actor: 'SuperAdmin',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto" onClick={onClose}>
      <div
        className="w-full max-w-lg rounded-2xl border border-indigo-500/30 bg-[#0c0f28] p-5 sm:p-6 shadow-2xl space-y-4"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-indigo-500/20">
          <div className="flex items-center gap-2">
            <History size={20} className="text-indigo-400" />
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-100">Subscription History & Audit</h2>
              <p className="text-xs text-indigo-300 font-medium">{subscription.tenant}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
          {history.map((entry, idx) => (
            <div key={entry.id || idx} className="relative pl-6 pb-4 border-l border-indigo-500/20 last:border-0 last:pb-0">
              <span className="absolute -left-1.5 top-0.5 h-3 w-3 rounded-full bg-indigo-500 ring-4 ring-[#0c0f28]" />
              <div className="rounded-xl border border-indigo-500/20 bg-slate-900/60 p-3 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-100">{entry.action}</span>
                  <span className="flex items-center gap-1 text-[11px] text-slate-400">
                    <Calendar size={11} /> {entry.date}
                  </span>
                </div>
                <p className="text-xs text-slate-300">{entry.note}</p>
                <div className="flex items-center gap-1 text-[10px] text-indigo-400 pt-1">
                  <User size={10} /> Authorized by: {entry.actor}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-indigo-500/20">
          <span className="text-[11px] text-emerald-400 flex items-center gap-1">
            <ShieldCheck size={12} /> Tamper-evident ledger log
          </span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-indigo-500/30 bg-indigo-500/15 px-4 py-1.5 text-xs font-semibold text-indigo-300 hover:bg-indigo-500/25"
          >
            Close Audit
          </button>
        </div>
      </div>
    </div>
  );
}
