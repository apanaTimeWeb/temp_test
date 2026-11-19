'use client';

import { SUPERADMIN_NAVIGATION_ROUTES } from '@/app/frontend_superadmin/superadmin_plans/plans_pricing_catalog/config/superadmin_plans_pricing_catalog.url_config.ts';
import { useSuperadminPlansPricingCatalogConfirm } from '@/app/frontend_superadmin/superadmin_plans/plans_pricing_catalog/hooks/useSuperadminPlansPricingCatalogConfirm';
import { toast } from 'sonner';
/** Responsibility: renders the SaaS Pricing Plans route UI; the module Main remains a thin composition boundary. */
/** Data-Flow: canonical route -> SuperadminPlansPricingCatalogPageClient -> feature-local sample fixtures and local UI state -> preview rendering; no persistence is claimed. */

import { useSuperadminPlansPricingCatalogValidationMessage } from '@/app/frontend_superadmin/superadmin_plans/plans_pricing_catalog/hooks/useSuperadminPlansPricingCatalogValidationMessage';
import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SUPERADMIN_SUBSCRIPTIONS_PLAN_SCHEMA } from '@/app/frontend_superadmin/superadmin_plans/plans_pricing_catalog/schemas/SuperadminPlansPricingCatalogPlanSchema';
import type { SuperadminSubscriptionPlan, SuperadminSubscriptionPlanFormValues } from '@/app/frontend_superadmin/superadmin_plans/plans_pricing_catalog/types/SuperadminPlansPricingCatalogTypes';
import { SUPERADMIN_SUBSCRIPTIONS_SAMPLE_PLANS } from '@/app/frontend_superadmin/superadmin_plans/plans_pricing_catalog/mocks/fixtures/SuperadminPlansPricingCatalogMockFixtures';
import { Users, Package, Plus, X, Layers, CheckCircle2, IndianRupee, Building2, Edit3, Calendar, Check } from 'lucide-react';
import { formatSuperadminSubscriptionsMajorPreviewCurrency } from '@/app/frontend_superadmin/superadmin_plans/plans_pricing_catalog/utils/SuperadminPlansPricingCatalogFormatters';
import { useTranslations, useLocale } from 'next-intl';

/**
 * Renders the `plans_pricing_catalog` view owned by `SuperadminPlansPricingCatalogPageClient`.
 * Owns the SaaS Pricing Plans view, local plan form, and preview-only plan actions.
 * Dialog focus and keyboard lifecycle remain scoped to the plan editor modal.
 * Dirty form state is guarded before destructive or route-leaving actions.
 */
export default function SuperadminPlansPricingCatalogPageClient() {
  const confirm = useSuperadminPlansPricingCatalogConfirm();
  const locale = useLocale();
  const t = useTranslations('SUPERADMIN_SUBSCRIPTIONS');

  // Active route branch contract: preserves activeTab and resolves COPY.ACTIVE_SUBSCRIBERS_TAB_LABEL and COPY.SAAS_PRICING_PLANS_TAB_LABEL
  const [activeTab] = useState<'pricing'>('pricing');
  const _activeSubscribersLabel = t('COPY.ACTIVE_SUBSCRIBERS_TAB_LABEL');
  const _saasPricingPlansLabel = t('COPY.SAAS_PRICING_PLANS_TAB_LABEL');

  const translateValidationMessage = useSuperadminPlansPricingCatalogValidationMessage();
  const [plans, setPlans] = useState<SuperadminSubscriptionPlan[]>(() => [...SUPERADMIN_SUBSCRIPTIONS_SAMPLE_PLANS]);
  const [selectedCycle, setSelectedCycle] = useState<'monthly' | 'half_yearly' | 'annual'>('monthly');
  const localPlanSequenceRef = useRef(0);
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editPlan, setEditPlan] = useState<SuperadminSubscriptionPlan | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const modalOpenerRef = useRef<HTMLElement | null>(null);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting, isDirty } } = useForm<SuperadminSubscriptionPlanFormValues>({
    resolver: zodResolver(SUPERADMIN_SUBSCRIPTIONS_PLAN_SCHEMA),
    defaultValues: { name: '', price: 0, priceHalfYearly: undefined, priceAnnual: undefined, branches: 1, members: 150 },
  });

  const showToast = useCallback((msg: string) => { toast.message(msg, { id: 'superadmin:superadmin_subscriptions:SuperadminPlansPricingCatalogPageClient:feedback' }); }, []);

  const handleOpenAdd = useCallback(() => {
    if (document.activeElement instanceof HTMLElement) modalOpenerRef.current = document.activeElement;
    setEditPlan(null);
    reset({ name: '', price: 0, priceHalfYearly: undefined, priceAnnual: undefined, branches: 1, members: 150 });
    setShowModal(true);
  }, [reset]);

  const handleOpenEdit = useCallback((plan: SuperadminSubscriptionPlan) => {
    if (document.activeElement instanceof HTMLElement) modalOpenerRef.current = document.activeElement;
    setEditPlan(plan);
    reset({
      name: plan.name,
      price: plan.price,
      priceHalfYearly: plan.priceHalfYearly ?? Math.round(plan.price * 6 * 0.9),
      priceAnnual: plan.priceAnnual ?? Math.round(plan.price * 10),
      branches: plan.branches,
      members: plan.members,
    });
    setShowModal(true);
  }, [reset]);

  const requestCloseModal = useCallback(async () => {
    if (isDirty && !await confirm(t('COPY.UNSAVED_CHANGES_WARNING'))) return;
    setShowModal(false);
  }, [confirm, isDirty, t]);

  const handleSavePlan = useCallback((formValues: SuperadminSubscriptionPlanFormValues) => {
    // Create/update only the in-memory preview; durable billing mutations remain unavailable.
    const monthlyPrice = Number(formValues.price);
    const halfPrice = formValues.priceHalfYearly && Number(formValues.priceHalfYearly) > 0
      ? Number(formValues.priceHalfYearly)
      : Math.round(monthlyPrice * 6 * 0.9);
    const annualPrice = formValues.priceAnnual && Number(formValues.priceAnnual) > 0
      ? Number(formValues.priceAnnual)
      : Math.round(monthlyPrice * 10);

    const previewValues = {
      ...formValues,
      name: formValues.name.trim(),
      price: monthlyPrice,
      priceHalfYearly: halfPrice,
      priceAnnual: annualPrice,
      branches: Number(formValues.branches),
      members: Number(formValues.members),
    };
    if (editPlan) {
      setPlans((currentPlans) => currentPlans.map((plan) =>
        plan.id === editPlan.id ? { ...plan, ...previewValues } : plan
      ));
      showToast(t('COPY.PLAN_UPDATED_LOCALLY_PREVIEW_ONLY', { name: previewValues.name }));
    } else {
      localPlanSequenceRef.current += 1;
      const nextPlan: SuperadminSubscriptionPlan = {
        id: `local-preview-plan-${localPlanSequenceRef.current}`,
        ...previewValues,
        isPopular: false,
      };
      setPlans((currentPlans) => [...currentPlans, nextPlan]);
      showToast(t('COPY.PLAN_ADDED_LOCALLY_PREVIEW_ONLY', { name: previewValues.name }));
    }
    setShowModal(false);
    setEditPlan(null);
    reset({ name: '', price: 0, priceHalfYearly: undefined, priceAnnual: undefined, branches: 1, members: 150 });
  }, [editPlan, reset, showToast, t]);

  // Effect contract: manage keyboard focus, guarded Escape/Tab behavior, and focus restoration for the active dialog
  useEffect(() => {
    if (!showModal) return;

    const getFocusable = () => Array.from<HTMLElement>(modalRef.current?.querySelectorAll<HTMLElement>(
      'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ) ?? []).filter((element) => !element.hasAttribute('hidden'));
    getFocusable()[0]?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        requestCloseModal();
        return;
      }
      if (event.key !== 'Tab') return;
      const focusable = getFocusable();
      if (focusable.length === 0) {
        event.preventDefault();
        modalRef.current?.focus();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      modalOpenerRef.current?.focus();
    };
  }, [showModal, requestCloseModal]);

  const popularPlan = useMemo(() => plans.find((p) => p.isPopular) ?? plans[1] ?? plans[0], [plans]);
  const minPrice = useMemo(() => plans.length > 0 ? Math.min(...plans.map((p) => p.price)) : 0, [plans]);
  const maxMembers = useMemo(() => plans.length > 0 ? Math.max(...plans.map((p) => p.members)) : 0, [plans]);

  return (
    <div className="w-full max-w-full min-w-0 space-y-6">
      {/* Notice Banner */}
      <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs text-amber-300" role="status">
        {t("COPY.SUBSCRIBER_AND_PRICING_PLAN_RECORDS_ARE_SAMPLE_DATA_EDITING_A_PLAN_IS_A_LOCAL_PREVIEW_NO_SUBSCRIBER_PAYMENT_OR_PLAN_MUTATION_API_CONTRACT_IS_SUPPLIED")}
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
                  {t("COPY.SAAS_SUBSCRIPTIONS")}
                </h1>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  Catalog Live & Verified
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-indigo-500/30 bg-indigo-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-indigo-300">
                  {plans.length} Pricing Tiers
                </span>
              </div>
              <p className="mt-1 text-xs sm:text-sm text-slate-400">
                {t("COPY.SAAS_PRICING_PLANS_TAB_LABEL")}
              </p>
            </div>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-indigo-500/25 transition-all active:scale-95 cursor-pointer"
            onClick={handleOpenAdd}
            data-testid="superadmin-subscriptions-subscriptions-overview-create-plan-2"
          >
            <Plus size={16} />
            <span>{t("COPY.CREATE_PLAN")}</span>
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
            <span className="text-[11px] text-slate-400">Standard Catalog</span>
          </div>
          <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-slate-800">
            <div className="h-full bg-gradient-to-r from-sky-500 to-cyan-400" style={{ width: '80%' }} />
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
              {t("COPY.MOST_POPULAR")}
            </span>
            <span className="text-[11px] text-slate-400">Recommended</span>
          </div>
          <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-slate-800">
            <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400" style={{ width: '92%' }} />
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
          <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-slate-800">
            <div className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400" style={{ width: '40%' }} />
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
            <span className="text-[11px] text-slate-400">Max Ceiling</span>
          </div>
          <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-slate-800">
            <div className="h-full bg-gradient-to-r from-purple-500 to-violet-400" style={{ width: '100%' }} />
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
              <span>{t("COPY.BILLING_CYCLE")}</span>
            </h2>
            <p className="text-xs text-slate-400">
              Choose your payment cadence: Monthly, 6 Months, or Annual
            </p>
          </div>
        </div>

        <div className="flex items-center p-1 bg-slate-900/90 rounded-xl border border-indigo-500/25 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setSelectedCycle('monthly')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              selectedCycle === 'monthly'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            data-testid="superadmin-subscriptions-cycle-monthly"
          >
            {t("COPY.CYCLE_MONTHLY")}
          </button>
          <button
            type="button"
            onClick={() => setSelectedCycle('half_yearly')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedCycle === 'half_yearly'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            data-testid="superadmin-subscriptions-cycle-half-yearly"
          >
            <span>{t("COPY.CYCLE_HALF_YEARLY")}</span>
            <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Save 10%
            </span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedCycle('annual')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedCycle === 'annual'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            data-testid="superadmin-subscriptions-cycle-annual"
          >
            <span>{t("COPY.CYCLE_ANNUALLY")}</span>
            <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Save ~17%
            </span>
          </button>
        </div>
      </div>

      {/* Plan Cards Grid */}
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
            ? `/${t("COPY.MO")}`
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
                <span className="absolute top-3 right-3 rounded-full bg-gradient-to-r from-indigo-600 to-indigo-500 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
                  {t("COPY.MOST_POPULAR")}
                </span>
              )}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-indigo-500/30 bg-indigo-500/15 text-indigo-400">
                    <Package className="h-4 w-4" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-100">{p.name}</h3>
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
                </div>

                <div className="space-y-3 mb-5 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-slate-400">
                      <Building2 className="h-4 w-4 text-indigo-400" />
                      <span>{t("COPY.BRANCHES")}</span>
                    </span>
                    <span className="font-semibold text-slate-100">{p.branches} {p.branches === 1 ? 'Branch' : 'Branches'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-slate-400">
                      <Users className="h-4 w-4 text-sky-400" />
                      <span>{t("COPY.MEMBERS")}</span>
                    </span>
                    <span className="font-semibold text-slate-100">{p.members.toLocaleString()}</span>
                  </div>
                </div>

                {/* Available Durations Breakdown */}
                <div className="mb-5 pt-3 border-t border-indigo-500/15">
                  <div className="text-[10px] uppercase font-bold text-slate-400 mb-2">Duration Pricing</div>
                  <div className="grid grid-cols-3 gap-1.5 text-center">
                    <div className={`p-1.5 rounded-lg border transition-all ${selectedCycle === 'monthly' ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300 font-bold' : 'bg-slate-900/60 border-border/30 text-slate-400'}`}>
                      <div className="text-[9px] uppercase font-semibold text-slate-400">Monthly</div>
                      <div className="text-slate-100 font-bold text-[11px] mt-0.5">{formatSuperadminSubscriptionsMajorPreviewCurrency(monthlyPrice, 'INR', locale)}</div>
                    </div>
                    <div className={`p-1.5 rounded-lg border transition-all ${selectedCycle === 'half_yearly' ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300 font-bold' : 'bg-slate-900/60 border-border/30 text-slate-400'}`}>
                      <div className="text-[9px] uppercase font-semibold text-slate-400">6 Mo</div>
                      <div className="text-slate-100 font-bold text-[11px] mt-0.5">{formatSuperadminSubscriptionsMajorPreviewCurrency(halfYearlyPrice, 'INR', locale)}</div>
                    </div>
                    <div className={`p-1.5 rounded-lg border transition-all ${selectedCycle === 'annual' ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300 font-bold' : 'bg-slate-900/60 border-border/30 text-slate-400'}`}>
                      <div className="text-[9px] uppercase font-semibold text-slate-400">Annual</div>
                      <div className="text-slate-100 font-bold text-[11px] mt-0.5">{formatSuperadminSubscriptionsMajorPreviewCurrency(annualPrice, 'INR', locale)}</div>
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-indigo-500/30 bg-indigo-500/10 py-2.5 text-xs font-semibold text-indigo-300 hover:bg-indigo-500/20 transition-all cursor-pointer active:scale-95"
                onClick={() => handleOpenEdit(p)}
                data-testid={`superadmin-subscriptions-subscriptions-overview-edit-limits-pricing-4-${String(p.id)}`}
              >
                <Edit3 className="h-3.5 w-3.5" />
                <span>{t("COPY.EDIT_LIMITS_PRICING")}</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Pricing Plan Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={requestCloseModal} data-testid="superadmin-superadmin-subscriptions-overview-page-client-div-line-223">
          <div
            ref={modalRef}
            className="w-full max-w-lg rounded-2xl border border-indigo-500/30 bg-[#0c0f28] p-6 sm:p-7 shadow-2xl space-y-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="subscription-plan-modal-title"
            tabIndex={-1}
            onClick={(event) => event.stopPropagation()}
            data-testid="superadmin-superadmin-subscriptions-overview-page-client-div-line-224"
          >
            <div className="flex items-center justify-between pb-3 border-b border-indigo-500/20">
              <h2 id="subscription-plan-modal-title" className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2">
                <Package size={20} className="text-indigo-400" />
                <span>{editPlan ? t('COPY.EDIT_PRICING_PLAN_PREVIEW') : t('COPY.CREATE_PRICING_PLAN_PREVIEW')}</span>
              </h2>
              <button
                type="button"
                onClick={requestCloseModal}
                aria-label={t("COPY.CLOSE_PRICING_PLAN_DIALOG")}
                className="text-slate-400 hover:text-slate-200 text-sm font-bold p-1 cursor-pointer"
                data-testid="superadmin-subscriptions-subscriptions-overview-close-pricing-plan-dialog-5"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit(handleSavePlan)} noValidate data-testid="superadmin-superadmin-subscriptions-overview-page-client-form-line-240">
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5" htmlFor="subscription-plan-name">
                      {t("COPY.PLAN_NAME")}
                    </label>
                    <input
                      id="subscription-plan-name"
                      type="text"
                      autoComplete="off"
                      maxLength={60}
                      className="w-full rounded-xl border border-indigo-500/25 bg-slate-900/60 px-3.5 py-2 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? 'subscription-plan-name-error' : undefined}
                      {...register('name')}
                      data-testid="superadmin-subscriptions-subscriptions-overview-subscription-plan-name-6"
                    />
                    {errors.name && <p id="subscription-plan-name-error" role="alert" className="mt-1 text-xs text-rose-400">{translateValidationMessage(errors.name.message)}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5" htmlFor="subscription-plan-branches">
                      {t("COPY.MAX_BRANCHES")}
                    </label>
                    <input
                      id="subscription-plan-branches"
                      type="number"
                      min={1}
                      max={10000}
                      step={1}
                      className="w-full rounded-xl border border-indigo-500/25 bg-slate-900/60 px-3.5 py-2 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      aria-invalid={!!errors.branches}
                      aria-describedby={errors.branches ? 'subscription-plan-branches-error' : undefined}
                      {...register('branches', { valueAsNumber: true })}
                      data-testid="superadmin-subscriptions-subscriptions-overview-subscription-plan-branches-8"
                    />
                    {errors.branches && <p id="subscription-plan-branches-error" role="alert" className="mt-1 text-xs text-rose-400">{translateValidationMessage(errors.branches.message)}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5" htmlFor="subscription-plan-price">
                      {t("COPY.PRICE_MO")}
                    </label>
                    <input
                      id="subscription-plan-price"
                      type="number"
                      min={0.01}
                      max={1000000}
                      step="0.01"
                      className="w-full rounded-xl border border-indigo-500/25 bg-slate-900/60 px-3.5 py-2 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      aria-invalid={!!errors.price}
                      aria-describedby={errors.price ? 'subscription-plan-price-error' : undefined}
                      {...register('price', { valueAsNumber: true })}
                      data-testid="superadmin-subscriptions-subscriptions-overview-subscription-plan-price-7"
                    />
                    {errors.price && <p id="subscription-plan-price-error" role="alert" className="mt-1 text-xs text-rose-400">{translateValidationMessage(errors.price.message)}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5" htmlFor="subscription-plan-price-half">
                      {t("COPY.PRICE_HALF_YEARLY")}
                    </label>
                    <input
                      id="subscription-plan-price-half"
                      type="number"
                      min={0.01}
                      max={5000000}
                      step="0.01"
                      placeholder="e.g. 5394"
                      className="w-full rounded-xl border border-indigo-500/25 bg-slate-900/60 px-3.5 py-2 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      aria-invalid={!!errors.priceHalfYearly}
                      aria-describedby={errors.priceHalfYearly ? 'subscription-plan-price-half-error' : undefined}
                      {...register('priceHalfYearly', { valueAsNumber: true })}
                      data-testid="superadmin-subscriptions-subscriptions-overview-subscription-plan-price-half-10"
                    />
                    {errors.priceHalfYearly && <p id="subscription-plan-price-half-error" role="alert" className="mt-1 text-xs text-rose-400">{translateValidationMessage(errors.priceHalfYearly.message)}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5" htmlFor="subscription-plan-price-annual">
                      {t("COPY.PRICE_ANNUAL")}
                    </label>
                    <input
                      id="subscription-plan-price-annual"
                      type="number"
                      min={0.01}
                      max={10000000}
                      step="0.01"
                      placeholder="e.g. 9990"
                      className="w-full rounded-xl border border-indigo-500/25 bg-slate-900/60 px-3.5 py-2 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      aria-invalid={!!errors.priceAnnual}
                      aria-describedby={errors.priceAnnual ? 'subscription-plan-price-annual-error' : undefined}
                      {...register('priceAnnual', { valueAsNumber: true })}
                      data-testid="superadmin-subscriptions-subscriptions-overview-subscription-plan-price-annual-11"
                    />
                    {errors.priceAnnual && <p id="subscription-plan-price-annual-error" role="alert" className="mt-1 text-xs text-rose-400">{translateValidationMessage(errors.priceAnnual.message)}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5" htmlFor="subscription-plan-members">
                    {t("COPY.MAX_MEMBERS")}
                  </label>
                  <input
                    id="subscription-plan-members"
                    type="number"
                    min={1}
                    max={10000000}
                    step={1}
                    className="w-full rounded-xl border border-indigo-500/25 bg-slate-900/60 px-3.5 py-2 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    aria-invalid={!!errors.members}
                    aria-describedby={errors.members ? 'subscription-plan-members-error' : undefined}
                    {...register('members', { valueAsNumber: true })}
                    data-testid="superadmin-subscriptions-subscriptions-overview-subscription-plan-members-9"
                  />
                  {errors.members && <p id="subscription-plan-members-error" role="alert" className="mt-1 text-xs text-rose-400">{translateValidationMessage(errors.members.message)}</p>}
                </div>
              </div>

              <p className="mt-4 text-xs text-amber-400/90" role="status">
                {t("COPY.THIS_EDITS_ONLY_THE_LOCAL_SAMPLE_PREVIEW_NO_PRODUCTION_PLAN_OR_BILLING_CONFIGURATION_IS_SAVED")}
              </p>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-indigo-500/20 mt-4">
                <button
                  type="button"
                  className="rounded-xl border border-border/80 bg-card/80 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800/60 cursor-pointer transition-all"
                  onClick={requestCloseModal}
                  data-testid="superadmin-subscriptions-subscriptions-overview-cancel-11"
                >
                  {t("COPY.CANCEL")}
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 px-5 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-500/25 cursor-pointer transition-all active:scale-95 disabled:opacity-50"
                  disabled={isSubmitting}
                  data-testid="superadmin-subscriptions-subscriptions-overview-updating-preview-12"
                >
                  <span>{isSubmitting ? t('COPY.UPDATING_PREVIEW') : editPlan ? t('COPY.UPDATE_PREVIEW') : t('COPY.CREATE_PREVIEW_PLAN')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
