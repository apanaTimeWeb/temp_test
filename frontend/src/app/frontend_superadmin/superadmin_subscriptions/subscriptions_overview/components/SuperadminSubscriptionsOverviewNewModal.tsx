'use client';

import { useState } from 'react';
import { Package, X, PlusCircle, Check } from 'lucide-react';
import type { SuperadminSubscriptionRecord, SuperadminSubscriptionPaymentStatus } from '@/app/frontend_superadmin/superadmin_subscriptions/subscriptions_overview/types/SuperadminSubscriptionsOverviewTypes';

interface SuperadminSubscriptionsOverviewNewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (record: SuperadminSubscriptionRecord) => void;
}

export default function SuperadminSubscriptionsOverviewNewModal({
  isOpen,
  onClose,
  onCreate,
}: SuperadminSubscriptionsOverviewNewModalProps) {
  const [tenantName, setTenantName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('Professional');
  const [cycle, setCycle] = useState<'Monthly' | 'Yearly'>('Monthly');
  const [isTrial, setIsTrial] = useState(false);
  const [customPrice, setCustomPrice] = useState(2999);
  const [couponCode, setCouponCode] = useState('');
  const [branchesCount, setBranchesCount] = useState(3);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenantName.trim()) return;

    const discount = couponCode.toUpperCase() === 'LAUNCH50' ? 50 : 0;
    const finalMrr = isTrial ? 0 : Math.round(customPrice * (1 - discount / 100));

    const newSub: SuperadminSubscriptionRecord = {
      id: `sub-${Date.now()}`,
      tenant: tenantName.trim(),
      plan: selectedPlan,
      cycle,
      mrr: finalMrr,
      status: isTrial ? 'Trial' : 'Active',
      startDate: new Date().toISOString().split('T')[0],
      renewalDate: new Date(Date.now() + (isTrial ? 14 : cycle === 'Yearly' ? 365 : 30) * 86400000).toISOString().split('T')[0],
      gracePeriodDays: 7,
      autoRenewal: !isTrial,
      discountPercent: discount,
      branchesCount,
      email: adminEmail.trim() || 'admin@library.org',
      history: [
        {
          id: `h-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          action: isTrial ? 'Trial Provisioned' : 'SaaS Subscription Initialized',
          note: `Plan: ${selectedPlan}, Branches: ${branchesCount}, MRR: ₹${finalMrr}`,
          actor: 'SuperAdmin',
        },
      ],
    };

    onCreate(newSub);
    onClose();
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
            <PlusCircle size={20} className="text-indigo-400" />
            <h2 className="text-base sm:text-lg font-bold text-slate-100">Provision SaaS Subscription</h2>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">
              Library / Organization Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Apex Central Library"
              value={tenantName}
              onChange={(e) => setTenantName(e.target.value)}
              className="w-full rounded-xl border border-indigo-500/25 bg-slate-900/60 px-3 py-2 text-slate-100 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">
              Admin Billing Email *
            </label>
            <input
              type="email"
              required
              placeholder="e.g. billing@apexlib.org"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              className="w-full rounded-xl border border-indigo-500/25 bg-slate-900/60 px-3 py-2 text-slate-100 focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Select SaaS Plan</label>
              <select
                value={selectedPlan}
                onChange={(e) => {
                  setSelectedPlan(e.target.value);
                  if (e.target.value === 'Starter') { setCustomPrice(999); setBranchesCount(1); }
                  if (e.target.value === 'Professional') { setCustomPrice(2999); setBranchesCount(3); }
                  if (e.target.value === 'Enterprise') { setCustomPrice(4999); setBranchesCount(10); }
                }}
                className="w-full rounded-xl border border-indigo-500/25 bg-slate-900/90 px-3 py-2 text-slate-100"
              >
                <option value="Starter">Starter (1 Branch · ₹999/mo)</option>
                <option value="Professional">Professional (3 Branches · ₹2,999/mo)</option>
                <option value="Enterprise">Enterprise (10 Branches · ₹4,999/mo)</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Allowed Branches</label>
              <input
                type="number"
                min={1}
                value={branchesCount}
                onChange={(e) => setBranchesCount(Number(e.target.value))}
                className="w-full rounded-xl border border-indigo-500/25 bg-slate-900/60 px-3 py-2 text-slate-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Billing Cadence</label>
              <select
                value={cycle}
                onChange={(e) => setCycle(e.target.value as 'Monthly' | 'Yearly')}
                className="w-full rounded-xl border border-indigo-500/25 bg-slate-900/90 px-3 py-2 text-slate-100"
              >
                <option value="Monthly">Monthly</option>
                <option value="Yearly">Yearly (Save ~17%)</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Monthly Price (₹)</label>
              <input
                type="number"
                value={customPrice}
                onChange={(e) => setCustomPrice(Number(e.target.value))}
                className="w-full rounded-xl border border-indigo-500/25 bg-slate-900/60 px-3 py-2 text-slate-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Coupon / Promo Code</label>
              <input
                type="text"
                placeholder="e.g. LAUNCH50"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="w-full rounded-xl border border-indigo-500/25 bg-slate-900/60 px-3 py-2 text-slate-100 uppercase"
              />
            </div>
            <div className="flex items-center pt-5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isTrial}
                  onChange={(e) => setIsTrial(e.target.checked)}
                  className="rounded text-indigo-600 h-4 w-4"
                />
                <span className="font-semibold text-amber-300">Start with 14-Day Free Trial</span>
              </label>
            </div>
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
              <span>Create Subscription</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
