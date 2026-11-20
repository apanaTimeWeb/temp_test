'use client';

import { useState, useEffect } from 'react';
import { Package, X, AlertCircle, ShieldAlert, Check, RefreshCw } from 'lucide-react';
import type { SuperadminSubscriptionRecord, SuperadminSubscriptionPaymentStatus } from '@/app/frontend_superadmin/superadmin_subscriptions/subscriptions_overview/types/SuperadminSubscriptionsOverviewTypes';

interface SuperadminSubscriptionsOverviewActionModalProps {
  subscription: SuperadminSubscriptionRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: SuperadminSubscriptionRecord) => void;
}

export default function SuperadminSubscriptionsOverviewActionModal({
  subscription,
  isOpen,
  onClose,
  onSave,
}: SuperadminSubscriptionsOverviewActionModalProps) {
  const [selectedPlan, setSelectedPlan] = useState('Professional');
  const [status, setStatus] = useState<SuperadminSubscriptionPaymentStatus>('Active');
  const [cycle, setCycle] = useState<'Monthly' | 'Yearly'>('Monthly');
  const [autoRenewal, setAutoRenewal] = useState(true);
  const [gracePeriodDays, setGracePeriodDays] = useState(7);
  const [customPrice, setCustomPrice] = useState(2999);
  const [discountPercent, setDiscountPercent] = useState(0);

  useEffect(() => {
    if (subscription) {
      setSelectedPlan(subscription.plan);
      setStatus(subscription.status);
      setCycle(subscription.cycle);
      setAutoRenewal(subscription.autoRenewal ?? true);
      setGracePeriodDays(subscription.gracePeriodDays ?? 7);
      setCustomPrice(subscription.customPrice ?? subscription.mrr);
      setDiscountPercent(subscription.discountPercent ?? 0);
    }
  }, [subscription]);

  if (!isOpen || !subscription) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: SuperadminSubscriptionRecord = {
      ...subscription,
      plan: selectedPlan,
      status,
      cycle,
      mrr: Number(customPrice),
      autoRenewal,
      gracePeriodDays: Number(gracePeriodDays),
      discountPercent: Number(discountPercent),
      customPrice: Number(customPrice),
      history: [
        ...(subscription.history || []),
        {
          id: `h-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          action: `Subscription Updated to ${selectedPlan} (${status})`,
          note: `Plan: ${selectedPlan}, Status: ${status}, MRR: ₹${customPrice}, Grace: ${gracePeriodDays} days`,
          actor: 'SuperAdmin',
        },
      ],
    };
    onSave(updated);
  };

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
            <Package size={20} className="text-indigo-400" />
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-100">Manage Tenant Subscription</h2>
              <p className="text-xs text-indigo-300 font-medium">{subscription.tenant}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Plan Selection (Upgrade/Downgrade) */}
          <div className="space-y-1">
            <label className="block font-semibold uppercase tracking-wider text-slate-300">
              Subscription Plan (Upgrade / Downgrade)
            </label>
            <select
              value={selectedPlan}
              onChange={(e) => {
                setSelectedPlan(e.target.value);
                if (e.target.value === 'Starter') setCustomPrice(999);
                if (e.target.value === 'Professional') setCustomPrice(2999);
                if (e.target.value === 'Enterprise') setCustomPrice(4999);
              }}
              className="w-full rounded-xl border border-indigo-500/25 bg-slate-900/90 px-3 py-2 text-slate-100 focus:border-indigo-500"
            >
              <option value="Starter">Starter Plan (1 Branch · ₹999/mo)</option>
              <option value="Standard">Standard Plan (2 Branches · ₹1,999/mo)</option>
              <option value="Professional">Professional Plan (3 Branches · ₹2,999/mo)</option>
              <option value="Enterprise">Enterprise Cloud (10+ Branches · ₹4,999/mo)</option>
            </select>
          </div>

          {/* Subscription Status Lifecycle */}
          <div className="space-y-1">
            <label className="block font-semibold uppercase tracking-wider text-slate-300">
              Lifecycle Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as SuperadminSubscriptionPaymentStatus)}
              className="w-full rounded-xl border border-indigo-500/25 bg-slate-900/90 px-3 py-2 text-slate-100 focus:border-indigo-500"
            >
              <option value="Active">Active (Operational & Billed)</option>
              <option value="Trial">Trial Account</option>
              <option value="Grace Period">Grace Period (7 Days Buffer)</option>
              <option value="Past Due">Past Due (Payment Overdue / Dunning)</option>
              <option value="Suspended">Suspended (Restricted Read-Only Mode)</option>
              <option value="Cancelled">Cancelled (Valid Until End of Period)</option>
              <option value="Expired">Expired</option>
            </select>
          </div>

          {/* Pricing & Billing Cadence */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Billing Cadence</label>
              <select
                value={cycle}
                onChange={(e) => setCycle(e.target.value as 'Monthly' | 'Yearly')}
                className="w-full rounded-xl border border-indigo-500/25 bg-slate-900/90 px-3 py-2 text-slate-100"
              >
                <option value="Monthly">Monthly Recurring</option>
                <option value="Yearly">Yearly (Annual Pre-paid)</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Custom Price (₹/mo)</label>
              <input
                type="number"
                value={customPrice}
                onChange={(e) => setCustomPrice(Number(e.target.value))}
                className="w-full rounded-xl border border-indigo-500/25 bg-slate-900/60 px-3 py-2 text-slate-100"
              />
            </div>
          </div>

          {/* Grace Period & Discount Settings */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Grace Period (Days)</label>
              <input
                type="number"
                min={0}
                max={60}
                value={gracePeriodDays}
                onChange={(e) => setGracePeriodDays(Number(e.target.value))}
                className="w-full rounded-xl border border-indigo-500/25 bg-slate-900/60 px-3 py-2 text-slate-100"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Coupon Discount (%)</label>
              <input
                type="number"
                min={0}
                max={100}
                value={discountPercent}
                onChange={(e) => setDiscountPercent(Number(e.target.value))}
                className="w-full rounded-xl border border-indigo-500/25 bg-slate-900/60 px-3 py-2 text-slate-100"
              />
            </div>
          </div>

          {/* Auto Renewal Toggle */}
          <label className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-900/60 border border-border/40 cursor-pointer">
            <input
              type="checkbox"
              checked={autoRenewal}
              onChange={(e) => setAutoRenewal(e.target.checked)}
              className="rounded text-indigo-600 h-4 w-4"
            />
            <div>
              <span className="font-semibold text-slate-100">Enable Auto-Renewal</span>
              <p className="text-[11px] text-slate-400">Automatically charges saved payment method on renewal date</p>
            </div>
          </label>

          {/* Safety Rule Banner */}
          <div className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-[11px] flex items-start gap-2">
            <ShieldAlert size={15} className="text-emerald-400 shrink-0 mt-0.5" />
            <span>
              <strong>Zero Data Loss Policy:</strong> If suspended or cancelled, data is never deleted. Tenant enters read-only mode with data export and billing portal access permanently active.
            </span>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-indigo-500/20">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-border/80 bg-card/80 px-4 py-2 font-semibold text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-5 py-2 font-semibold text-white shadow-md active:scale-95"
            >
              <Check size={14} />
              <span>Apply Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
