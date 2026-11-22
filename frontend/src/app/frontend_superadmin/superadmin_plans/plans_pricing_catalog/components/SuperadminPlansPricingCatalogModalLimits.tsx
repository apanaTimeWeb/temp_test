'use client';

import type { UseFormRegister } from 'react-hook-form';
import type { SuperadminSubscriptionPlanFormValues } from '@/app/frontend_superadmin/superadmin_plans/plans_pricing_catalog/types/SuperadminPlansPricingCatalogTypes';

interface SuperadminPlansPricingCatalogModalLimitsProps {
  register: UseFormRegister<SuperadminSubscriptionPlanFormValues>;
  t: (key: string) => string;
}

export default function SuperadminPlansPricingCatalogModalLimits({
  register,
  t,
}: SuperadminPlansPricingCatalogModalLimitsProps) {
  return (
    <div className="space-y-3.5">
      {/* Branch, User & Member Limits */}
      <div className="pt-2 border-t border-indigo-500/15">
        <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2.5">Capacity & Entitlements</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1" htmlFor="subscription-plan-branches">
              {t('COPY.MAX_BRANCHES')}
            </label>
            <input maxLength={30}
              id="subscription-plan-branches"
              type="number"
              min={1}
              className="w-full rounded-xl border border-indigo-500/25 bg-slate-900/60 px-3 py-1.5 text-xs text-slate-100 focus:border-indigo-500"
              {...register('branches', { valueAsNumber: true })}
              data-testid="superadmin-subscriptions-subscriptions-overview-subscription-plan-branches-8"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">Max Admins</label>
            <input maxLength={100}
              type="number"
              min={1}
              className="w-full rounded-xl border border-indigo-500/25 bg-slate-900/60 px-3 py-1.5 text-xs text-slate-100 focus:border-indigo-500"
              {...register('adminUsers', { valueAsNumber: true })}
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">Max Staff</label>
            <input maxLength={100}
              type="number"
              min={1}
              className="w-full rounded-xl border border-indigo-500/25 bg-slate-900/60 px-3 py-1.5 text-xs text-slate-100 focus:border-indigo-500"
              {...register('staffUsers', { valueAsNumber: true })}
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1" htmlFor="subscription-plan-members">
              {t('COPY.MAX_MEMBERS')}
            </label>
            <input maxLength={30}
              id="subscription-plan-members"
              type="number"
              min={1}
              className="w-full rounded-xl border border-indigo-500/25 bg-slate-900/60 px-3 py-1.5 text-xs text-slate-100 focus:border-indigo-500"
              {...register('members', { valueAsNumber: true })}
              data-testid="superadmin-subscriptions-subscriptions-overview-subscription-plan-members-9"
            />
          </div>
        </div>
      </div>

      {/* Storage & Messaging */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-[11px] font-semibold text-slate-300 mb-1">Storage Limit</label>
          <input maxLength={100}
            type="text"
            placeholder="e.g. 25 GB"
            className="w-full rounded-xl border border-indigo-500/25 bg-slate-900/60 px-3 py-1.5 text-xs text-slate-100 focus:border-indigo-500"
            {...register('storage')}
          />
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-slate-300 mb-1">SMS Credits / mo</label>
          <input maxLength={100}
            type="number"
            min={0}
            className="w-full rounded-xl border border-indigo-500/25 bg-slate-900/60 px-3 py-1.5 text-xs text-slate-100 focus:border-indigo-500"
            {...register('smsCredits', { valueAsNumber: true })}
          />
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-slate-300 mb-1">WhatsApp Credits / mo</label>
          <input maxLength={100}
            type="number"
            min={0}
            className="w-full rounded-xl border border-indigo-500/25 bg-slate-900/60 px-3 py-1.5 text-xs text-slate-100 focus:border-indigo-500"
            {...register('whatsappCredits', { valueAsNumber: true })}
          />
        </div>
      </div>
    </div>
  );
}
