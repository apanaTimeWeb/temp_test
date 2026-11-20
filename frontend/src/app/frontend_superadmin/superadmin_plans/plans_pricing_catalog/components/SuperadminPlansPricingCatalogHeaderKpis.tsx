'use client';

import { Users, Package, Plus, Layers, CheckCircle2, IndianRupee, Calendar } from 'lucide-react';
import { formatSuperadminSubscriptionsMajorPreviewCurrency } from '@/app/frontend_superadmin/superadmin_plans/plans_pricing_catalog/utils/SuperadminPlansPricingCatalogFormatters';
import type { SuperadminSubscriptionPlan } from '@/app/frontend_superadmin/superadmin_plans/plans_pricing_catalog/types/SuperadminPlansPricingCatalogTypes';

interface SuperadminPlansPricingCatalogHeaderKpisProps {
  plans: SuperadminSubscriptionPlan[];
  selectedCycle: 'monthly' | 'half_yearly' | 'annual';
  onCycleChange: (cycle: 'monthly' | 'half_yearly' | 'annual') => void;
  onOpenAdd: () => void;
  locale: string;
  t: (key: string) => string;
}

export default function SuperadminPlansPricingCatalogHeaderKpis({
  plans,
  selectedCycle,
  onCycleChange,
  onOpenAdd,
  locale,
  t,
}: SuperadminPlansPricingCatalogHeaderKpisProps) {
  const popularPlan = plans.find((p) => p.isPopular) ?? plans[1] ?? plans[0];
  const minPrice = plans.length > 0 ? Math.min(...plans.map((p) => p.price)) : 0;
  const maxMembers = plans.length > 0 ? Math.max(...plans.map((p) => p.members)) : 0;

  return (
    <div className="space-y-6">
      {/* Notice Banner */}
      <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs text-amber-300" role="status">
        {t('COPY.SUBSCRIBER_AND_PRICING_PLAN_RECORDS_ARE_SAMPLE_DATA_EDITING_A_PLAN_IS_A_LOCAL_PREVIEW_NO_SUBSCRIBER_PAYMENT_OR_PLAN_MUTATION_API_CONTRACT_IS_SUPPLIED')}
      </div>

      {/* Hero Header Card */}
      <div className="rounded-2xl border border-indigo-500/25 bg-[#0c0f28]/95 p-5 sm:p-6 shadow-md backdrop-blur-md">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-indigo-500/30 bg-indigo-500/15 text-indigo-400 shadow-inner">
              <Package className="h-6 w-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-100">
                  {t('COPY.SAAS_SUBSCRIPTIONS')}
                </h1>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  SaaS Control Active
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-indigo-500/30 bg-indigo-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-indigo-300">
                  {plans.length} Tier Configurations
                </span>
              </div>
              <p className="mt-1 text-xs sm:text-sm text-slate-400">
                Configure SaaS subscription tiers, branch entitlements, user quotas, storage & features.
              </p>
            </div>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-indigo-500/25 transition-all active:scale-95 cursor-pointer"
            onClick={onOpenAdd}
            data-testid="superadmin-subscriptions-subscriptions-overview-create-plan-2"
          >
            <Plus size={16} />
            <span>{t('COPY.CREATE_PLAN')}</span>
          </button>
        </div>
      </div>

      {/* 4 Vibrant KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Plans */}
        <div className="relative overflow-hidden rounded-2xl border border-sky-500/30 bg-gradient-to-br from-sky-950/40 via-slate-900/90 to-slate-900/90 p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-sky-400">Total Plans</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-sky-500/30 bg-sky-500/15 text-sky-400">
              <Layers className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl sm:text-3xl font-black text-slate-100">{plans.length}</div>
          <div className="mt-3 flex items-center justify-between">
            <span className="inline-flex items-center gap-1 rounded-md bg-sky-500/10 px-2 py-0.5 text-[11px] font-medium text-sky-300 border border-sky-500/20">
              Active Tiers
            </span>
            <span className="text-[11px] text-slate-400">Configured Plans</span>
          </div>
        </div>

        {/* Most Popular Plan */}
        <div className="relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/40 via-slate-900/90 to-slate-900/90 p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Top Tier</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/15 text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl sm:text-3xl font-black text-slate-100">{popularPlan?.name ?? 'Standard'}</div>
          <div className="mt-3 flex items-center justify-between">
            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-300 border border-emerald-500/20">
              {t('COPY.MOST_POPULAR')}
            </span>
            <span className="text-[11px] text-slate-400">Recommended</span>
          </div>
        </div>

        {/* Entry Price */}
        <div className="relative overflow-hidden rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/40 via-slate-900/90 to-slate-900/90 p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-300">Base Entry Price</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-indigo-500/30 bg-indigo-500/15 text-indigo-400">
              <IndianRupee className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl sm:text-3xl font-black text-slate-100">
            {formatSuperadminSubscriptionsMajorPreviewCurrency(minPrice, 'INR', locale)}
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="inline-flex items-center gap-1 rounded-md bg-indigo-500/10 px-2 py-0.5 text-[11px] font-medium text-indigo-300 border border-indigo-500/20">
              Per Month
            </span>
            <span className="text-[11px] text-slate-400">Starter Tier</span>
          </div>
        </div>

        {/* Member Capacity */}
        <div className="relative overflow-hidden rounded-2xl border border-purple-500/30 bg-gradient-to-br from-purple-950/40 via-slate-900/90 to-slate-900/90 p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-purple-400">Max Member Scale</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-purple-500/30 bg-purple-500/15 text-purple-400">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl sm:text-3xl font-black text-slate-100">{maxMembers.toLocaleString()}</div>
          <div className="mt-3 flex items-center justify-between">
            <span className="inline-flex items-center gap-1 rounded-md bg-purple-500/10 px-2 py-0.5 text-[11px] font-medium text-purple-300 border border-purple-500/20">
              Enterprise Scale
            </span>
            <span className="text-[11px] text-slate-400">Platform Limit</span>
          </div>
        </div>
      </div>

      {/* Billing Frequency Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 sm:p-5 rounded-2xl border border-indigo-500/25 bg-gradient-to-r from-card/95 via-card/90 to-card/70 shadow-md backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-indigo-500/30 bg-indigo-500/15 text-indigo-400">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-100 flex items-center gap-2">
              <span>{t('COPY.BILLING_CYCLE')}</span>
            </h2>
            <p className="text-xs text-slate-400">
              Switch cadence: Monthly, 6 Months (save 10%), or Annual (save ~17%)
            </p>
          </div>
        </div>

        <div className="flex items-center p-1 bg-slate-900/90 rounded-xl border border-indigo-500/25 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => onCycleChange('monthly')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              selectedCycle === 'monthly'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            data-testid="superadmin-subscriptions-cycle-monthly"
          >
            {t('COPY.CYCLE_MONTHLY')}
          </button>
          <button
            type="button"
            onClick={() => onCycleChange('half_yearly')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedCycle === 'half_yearly'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            data-testid="superadmin-subscriptions-cycle-half-yearly"
          >
            <span>{t('COPY.CYCLE_HALF_YEARLY')}</span>
            <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Save 10%
            </span>
          </button>
          <button
            type="button"
            onClick={() => onCycleChange('annual')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedCycle === 'annual'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            data-testid="superadmin-subscriptions-cycle-annual"
          >
            <span>{t('COPY.CYCLE_ANNUALLY')}</span>
            <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Save ~17%
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
