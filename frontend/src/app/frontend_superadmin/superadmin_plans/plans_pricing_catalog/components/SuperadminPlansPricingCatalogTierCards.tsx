'use client';

import { Package, Building2, Users, Edit3, Shield, MessageSquare, Check } from 'lucide-react';
import { formatSuperadminSubscriptionsMajorPreviewCurrency } from '@/app/frontend_superadmin/superadmin_plans/plans_pricing_catalog/utils/SuperadminPlansPricingCatalogFormatters';
import type { SuperadminSubscriptionPlan } from '@/app/frontend_superadmin/superadmin_plans/plans_pricing_catalog/types/SuperadminPlansPricingCatalogTypes';

interface SuperadminPlansPricingCatalogTierCardsProps {
  plans: SuperadminSubscriptionPlan[];
  selectedCycle: 'monthly' | 'half_yearly' | 'annual';
  onOpenEdit: (plan: SuperadminSubscriptionPlan) => void;
  locale: string;
  t: (key: string) => string;
}

export default function SuperadminPlansPricingCatalogTierCards({
  plans,
  selectedCycle,
  onOpenEdit,
  locale,
  t,
}: SuperadminPlansPricingCatalogTierCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {plans.map((p) => {
        const isPop = p.isPopular;
        const monthlyPrice = p.price;
        const halfYearlyPrice = p.priceHalfYearly ?? Math.round(p.price * 6 * 0.9);
        const annualPrice = p.priceAnnual ?? Math.round(p.price * 10);

        const displayPrice = selectedCycle === 'monthly'
          ? monthlyPrice
          : selectedCycle === 'half_yearly'
            ? halfYearlyPrice
            : annualPrice;

        const cycleUnit = selectedCycle === 'monthly'
          ? `/${t('COPY.MO')}`
          : selectedCycle === 'half_yearly'
            ? '/6 mo'
            : '/yr';

        const effectiveMonthly = selectedCycle === 'half_yearly'
          ? `(₹${Math.round(halfYearlyPrice / 6).toLocaleString()}/mo)`
          : selectedCycle === 'annual'
            ? `(₹${Math.round(annualPrice / 12).toLocaleString()}/mo)`
            : null;

        return (
          <div
            key={p.id}
            className={`relative flex flex-col justify-between overflow-hidden rounded-2xl border bg-gradient-to-br via-slate-900/90 to-slate-900/90 p-5 sm:p-6 shadow-xl backdrop-blur-md transition-all hover:scale-[1.01] ${
              isPop
                ? 'border-indigo-400 shadow-indigo-500/15 ring-1 ring-indigo-400/40 from-indigo-950/40'
                : 'border-indigo-500/20 from-slate-950/40'
            }`}
          >
            {isPop && (
              <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-indigo-600 to-indigo-500 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
                <Check size={11} />
                {t('COPY.MOST_POPULAR')}
              </span>
            )}

            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-indigo-500/30 bg-indigo-500/15 text-indigo-400">
                  <Package className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-100">{p.name}</h3>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
                    {p.tierType ?? (p.branches === 1 ? 'Starter Tier' : p.branches <= 3 ? 'Pro Tier' : 'Enterprise Tier')}
                  </span>
                </div>
              </div>

              <div className="my-4 flex flex-col border-b border-indigo-500/15 pb-4">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl sm:text-3xl font-black text-slate-100">
                    {formatSuperadminSubscriptionsMajorPreviewCurrency(displayPrice, 'INR', locale)}
                  </span>
                  <span className="text-xs font-semibold text-indigo-400/80">{cycleUnit}</span>
                </div>
                {effectiveMonthly && (
                  <span className="text-[11px] text-emerald-400 font-medium mt-0.5">
                    Effective {effectiveMonthly}
                  </span>
                )}
                {p.freeTrial && (
                  <span className="text-[10px] text-amber-300 font-medium mt-1">
                    ✓ {p.trialDays ?? 14}-Day Free Trial Included
                  </span>
                )}
              </div>

              {/* Core Limits Specification */}
              <div className="space-y-2.5 mb-4 text-xs">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <Building2 className="h-3.5 w-3.5 text-indigo-400" />
                    <span>Max Branches:</span>
                  </span>
                  <span className="font-bold text-slate-100 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                    {p.branches} {p.branches === 1 ? 'Branch' : 'Branches'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <Users className="h-3.5 w-3.5 text-sky-400" />
                    <span>Max Members:</span>
                  </span>
                  <span className="font-semibold text-slate-100">{p.members.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <Shield className="h-3.5 w-3.5 text-purple-400" />
                    <span>Admin / Staff:</span>
                  </span>
                  <span className="font-semibold text-slate-100">{p.adminUsers ?? 1} Admin · {p.staffUsers ?? 3} Staff</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <MessageSquare className="h-3.5 w-3.5 text-amber-400" />
                    <span>SMS / WhatsApp:</span>
                  </span>
                  <span className="font-semibold text-slate-100">{p.smsCredits ?? 500} / {p.whatsappCredits ?? 200} mo</span>
                </div>
              </div>

              {/* Entitlement Badges */}
              <div className="mb-4 pt-3 border-t border-indigo-500/15 flex flex-wrap gap-1.5">
                <span className={`text-[10px] px-2 py-0.5 rounded-md font-medium border flex items-center gap-1 ${p.apiAccess ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' : 'bg-slate-800/50 text-slate-500 border-slate-700/50'}`}>
                  {p.apiAccess ? <Check size={10} /> : '✕'} API Access
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-md font-medium border flex items-center gap-1 ${p.exportAccess !== false ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' : 'bg-slate-800/50 text-slate-500 border-slate-700/50'}`}>
                  <Check size={10} /> Data Export
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-md font-medium border flex items-center gap-1 ${p.advancedReports ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20' : 'bg-slate-800/50 text-slate-500 border-slate-700/50'}`}>
                  {p.advancedReports ? <Check size={10} /> : '✕'} Adv. Reports
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-md font-medium bg-purple-500/10 text-purple-300 border border-purple-500/20">
                  {p.supportLevel ?? 'Standard'} Support
                </span>
              </div>
            </div>

            <button
              type="button"
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-indigo-500/30 bg-indigo-500/10 py-2.5 text-xs font-semibold text-indigo-300 hover:bg-indigo-500/20 transition-all cursor-pointer active:scale-95"
              onClick={() => onOpenEdit(p)}
              data-testid={`superadmin-subscriptions-subscriptions-overview-edit-limits-pricing-4-${String(p.id)}`}
            >
              <Edit3 className="h-3.5 w-3.5" />
              <span>{t('COPY.EDIT_LIMITS_PRICING')}</span>
            </button>
          </div>
        );
      })}
    </div>
  );
}
