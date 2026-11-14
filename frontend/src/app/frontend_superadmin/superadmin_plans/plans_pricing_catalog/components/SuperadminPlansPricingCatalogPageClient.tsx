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
import { Users, Package, Plus, X } from 'lucide-react';
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
  
  const navigateToWorkflow = (route: string) => {
    const target = new URL(route, window.location.origin);
    const query = new URLSearchParams(window.location.search);
    query.delete('view');
    query.forEach((value, key) => {
      if (!target.searchParams.has(key)) target.searchParams.append(key, value);
    });
    window.location.assign(target.pathname + target.search + target.hash);
  };
  const translateValidationMessage = useSuperadminPlansPricingCatalogValidationMessage();
  const activeTabId = 'plans' as const;
  const [plans, setPlans] = useState<SuperadminSubscriptionPlan[]>(() => [...SUPERADMIN_SUBSCRIPTIONS_SAMPLE_PLANS]);
  const localPlanSequenceRef = useRef(0);
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editPlan, setEditPlan] = useState<SuperadminSubscriptionPlan | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const modalOpenerRef = useRef<HTMLElement | null>(null);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting , isDirty} } = useForm<SuperadminSubscriptionPlanFormValues>({
    resolver: zodResolver(SUPERADMIN_SUBSCRIPTIONS_PLAN_SCHEMA),
    defaultValues: { name: '', price: 0, branches: 1, members: 1, storage: '' },
  });

  const showToast = useCallback((msg: string) => { toast.message(msg, { id: 'superadmin:superadmin_subscriptions:SuperadminPlansPricingCatalogPageClient:feedback' }); }, []);

  const handleOpenAdd = useCallback(() => {
    if (document.activeElement instanceof HTMLElement) modalOpenerRef.current = document.activeElement;
    setEditPlan(null);
    reset({ name: '', price: 0, branches: 1, members: 1, storage: '' });
    setShowModal(true);
  }, [reset]);

  const handleOpenEdit = useCallback((plan: SuperadminSubscriptionPlan) => {
    if (document.activeElement instanceof HTMLElement) modalOpenerRef.current = document.activeElement;
    setEditPlan(plan);
    reset({ name: plan.name, price: plan.price, branches: plan.branches, members: plan.members, storage: plan.storage });
    setShowModal(true);
  }, [reset]);

  const requestCloseModal = useCallback(async () => {
    if (isDirty && !await confirm(t('COPY.UNSAVED_CHANGES_WARNING'))) return;
    setShowModal(false);
  }, [confirm, isDirty, t]);

  const handleSavePlan = useCallback((formValues: SuperadminSubscriptionPlanFormValues) => {
    // Create/update only the in-memory preview; durable billing mutations remain unavailable.
    const previewValues = { ...formValues, name: formValues.name.trim(), storage: formValues.storage.trim() };
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
    reset({ name: '', price: 0, branches: 1, members: 1, storage: '' });
  }, [editPlan, reset, showToast, t]);

  // Effect contract: manage keyboard focus, guarded Escape/Tab behavior, and focus restoration for the active dialog or drawer; dependencies [showModal, requestCloseModal] are the deliberate re-run boundary.
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

  const tabs = useMemo(() => ([
    { id: 'subscribers', href: SUPERADMIN_NAVIGATION_ROUTES.subscriptions_active_subscribers, labelKey: 'COPY.ACTIVE_SUBSCRIBERS_TAB_LABEL', icon: Users },
    { id: 'plans', href: SUPERADMIN_NAVIGATION_ROUTES.plans_pricing_catalog, labelKey: 'COPY.SAAS_PRICING_PLANS_TAB_LABEL', icon: Package },
  ] as const), []);

  return (
    <div className="sa-page-animate relative">
      <p className="mb-4 rounded-lg border border-border bg-warning-bg p-3 text-sm text-warning" role="status">{t("COPY.SUBSCRIBER_AND_PRICING_PLAN_RECORDS_ARE_SAMPLE_DATA_EDITING_A_PLAN_IS_A_LOCAL_PREVIEW_NO_SUBSCRIBER_PAYMENT_OR_PLAN_MUTATION_API_CONTRACT_IS_SUPPLIED")}</p>
      

      <div className="flex flex-col gap-1 mb-8">
        <div className="sa-breadcrumb">
          <span>{t("COPY.LIBRARY_OS")}</span><span>/</span><span>{t("COPY.SUPER_ADMIN")}</span><span>/</span><span>{t("COPY.SUBSCRIPTIONS")}</span>
        </div>
        <div className="flex items-center justify-between mt-2">
          <h1 className="sa-page-title">{t("COPY.SAAS_SUBSCRIPTIONS")}</h1>
          {activeTabId === 'plans' && (
            <button type="button" className="sa-btn-primary" onClick={handleOpenAdd} data-testid="superadmin-subscriptions-subscriptions-overview-create-plan-2"><Plus size={16} /> {t("COPY.CREATE_PLAN")}</button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 mb-6 border-b border-border pb-2 overflow-x-auto hide-scrollbar" role="navigation" aria-label={t("COPY.SUBSCRIPTION_SECTIONS")}>
        {tabs.map((tab) => (
          <button type="button"
            key={tab.id}
            aria-current={activeTabId === tab.id ? 'page' : undefined}
            onClick={() => navigateToWorkflow(tab.href)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold motion-safe:transition-all motion-reduce:transition-none whitespace-nowrap ${
              activeTabId === tab.id 
                ? 'bg-info-bg text-primary border border-border shadow-card' 
                : 'text-secondary hover:bg-surface-hover hover:text-primary'
            }`}
           data-testid={`superadmin-subscriptions-subscriptions-overview-set-active-tab-3-${String(tab.id)}`}>
            <tab.icon size={16} /> {t(tab.labelKey)}
          </button>
        ))}
      </div>

      <div className="sa-card p-0 overflow-hidden h-150 flex flex-col">
        

        {activeTabId === 'plans' && (
          <div className="p-6 h-full overflow-y-auto motion-safe:animate-fade-in motion-reduce:animate-none">
            <div className="grid grid-cols-3 gap-6">
              {plans.map(p => (
                <div key={p.id} className={`p-6 rounded-2xl border ${p.isPopular ? 'border-focus bg-info-bg' : 'border-border bg-surface-hover'} relative`}>
                  {p.isPopular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-info text-on-info text-xs font-bold px-3 py-1 rounded-full">{t("COPY.MOST_POPULAR")}</span>}
                  <h3 className="text-xl font-bold text-primary mb-2">{p.name}</h3>
                  <div className="flex items-end gap-1 mb-6">
                    <span className="text-3xl font-black text-primary">{formatSuperadminSubscriptionsMajorPreviewCurrency(p.price, 'INR', locale)}</span>
                    <span className="text-sm text-secondary pb-1">{t("COPY.MO")}</span>
                  </div>
                  
                  <div className="space-y-3 mb-8">
                    <div className="flex justify-between text-sm"><span className="text-secondary">{t("COPY.BRANCHES")}</span><span className="text-primary font-medium">{p.branches}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-secondary">{t("COPY.MEMBERS")}</span><span className="text-primary font-medium">{p.members}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-secondary">{t("COPY.STORAGE")}</span><span className="text-primary font-medium">{p.storage}</span></div>
                  </div>

                  <button type="button" className="w-full sa-btn-secondary" onClick={() => handleOpenEdit(p)} data-testid={`superadmin-subscriptions-subscriptions-overview-edit-limits-pricing-4-${String(p.id)}`}>{t("COPY.EDIT_LIMITS_PRICING")}</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Pricing Plan Modal */}
      {showModal && (
        <div className="sa-wizard-modal-overlay" onClick={requestCloseModal} data-testid="superadmin-superadmin-subscriptions-overview-page-client-div-line-223">
          <div
            ref={modalRef}
            className="sa-wizard-modal sa-wizard-modal--wide"
            role="dialog"
            aria-modal="true"
            aria-labelledby="subscription-plan-modal-title"
            tabIndex={-1}
            onClick={(event) => event.stopPropagation()}
           data-testid="superadmin-superadmin-subscriptions-overview-page-client-div-line-224">
            <div className="flex items-center justify-between mb-6">
              <h2 id="subscription-plan-modal-title" className="text-lg font-bold text-primary flex items-center gap-2">
                <Package size={20} className="text-primary" /> {editPlan ? t('COPY.EDIT_PRICING_PLAN_PREVIEW') : t('COPY.CREATE_PRICING_PLAN_PREVIEW')}
              </h2>
              <button type="button" onClick={requestCloseModal} aria-label={t("COPY.CLOSE_PRICING_PLAN_DIALOG")} className="text-secondary hover:text-primary focus-visible:ring-2 focus-visible:ring-primary" data-testid="superadmin-subscriptions-subscriptions-overview-close-pricing-plan-dialog-5"><X size={20}/></button>
            </div>

            <form onSubmit={handleSubmit(handleSavePlan)} noValidate data-testid="superadmin-superadmin-subscriptions-overview-page-client-form-line-240">
              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-secondary block mb-1" htmlFor="subscription-plan-name">{t("COPY.PLAN_NAME")}</label>
                    <input id="subscription-plan-name" type="text" autoComplete="off" maxLength={60} className="sa-input" aria-invalid={!!errors.name} aria-describedby={errors.name ? 'subscription-plan-name-error' : undefined} {...register('name')}  data-testid="superadmin-subscriptions-subscriptions-overview-subscription-plan-name-6"/>
                    {errors.name && <p id="subscription-plan-name-error" role="alert" className="text-xs text-danger mt-1">{translateValidationMessage(errors.name.message)}</p>}
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-secondary block mb-1" htmlFor="subscription-plan-price">{t("COPY.PRICE_MO")}</label>
                    <input id="subscription-plan-price" type="number" min={0.01} max={1000000} step="0.01" className="sa-input" aria-invalid={!!errors.price} aria-describedby={errors.price ? 'subscription-plan-price-error' : undefined} {...register('price', { valueAsNumber: true })}  data-testid="superadmin-subscriptions-subscriptions-overview-subscription-plan-price-7"/>
                    {errors.price && <p id="subscription-plan-price-error" role="alert" className="text-xs text-danger mt-1">{translateValidationMessage(errors.price.message)}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-secondary block mb-1" htmlFor="subscription-plan-branches">{t("COPY.MAX_BRANCHES")}</label>
                    <input id="subscription-plan-branches" type="number" min={1} max={10000} step={1} className="sa-input" aria-invalid={!!errors.branches} aria-describedby={errors.branches ? 'subscription-plan-branches-error' : undefined} {...register('branches', { valueAsNumber: true })}  data-testid="superadmin-subscriptions-subscriptions-overview-subscription-plan-branches-8"/>
                    {errors.branches && <p id="subscription-plan-branches-error" role="alert" className="text-xs text-danger mt-1">{translateValidationMessage(errors.branches.message)}</p>}
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-secondary block mb-1" htmlFor="subscription-plan-members">{t("COPY.MAX_MEMBERS")}</label>
                    <input id="subscription-plan-members" type="number" min={1} max={10000000} step={1} className="sa-input" aria-invalid={!!errors.members} aria-describedby={errors.members ? 'subscription-plan-members-error' : undefined} {...register('members', { valueAsNumber: true })}  data-testid="superadmin-subscriptions-subscriptions-overview-subscription-plan-members-9"/>
                    {errors.members && <p id="subscription-plan-members-error" role="alert" className="text-xs text-danger mt-1">{translateValidationMessage(errors.members.message)}</p>}
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-secondary block mb-1" htmlFor="subscription-plan-storage">{t("COPY.STORAGE")}</label>
                    <input id="subscription-plan-storage" type="text" maxLength={40} className="sa-input" aria-invalid={!!errors.storage} aria-describedby={errors.storage ? 'subscription-plan-storage-error' : undefined} {...register('storage')}  data-testid="superadmin-subscriptions-subscriptions-overview-subscription-plan-storage-10"/>
                    {errors.storage && <p id="subscription-plan-storage-error" role="alert" className="text-xs text-danger mt-1">{translateValidationMessage(errors.storage.message)}</p>}
                  </div>
                </div>
              </div>

              <p className="mb-4 text-xs text-warning" role="status">{t("COPY.THIS_EDITS_ONLY_THE_LOCAL_SAMPLE_PREVIEW_NO_PRODUCTION_PLAN_OR_BILLING_CONFIGURATION_IS_SAVED")}</p>
              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <button type="button" className="sa-btn-ghost" onClick={requestCloseModal} data-testid="superadmin-subscriptions-subscriptions-overview-cancel-11">{t("COPY.CANCEL")}</button>
                <button type="submit" className="sa-btn-primary" disabled={isSubmitting} data-testid="superadmin-subscriptions-subscriptions-overview-updating-preview-12">{isSubmitting ? t('COPY.UPDATING_PREVIEW') : editPlan ? t('COPY.UPDATE_PREVIEW') : t('COPY.CREATE_PREVIEW_PLAN')}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
