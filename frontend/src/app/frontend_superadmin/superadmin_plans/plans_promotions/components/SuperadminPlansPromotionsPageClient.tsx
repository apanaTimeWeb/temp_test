'use client';

import { SUPERADMIN_NAVIGATION_ROUTES } from '@/app/frontend_superadmin/superadmin_plans/plans_promotions/config/superadmin_plans_promotions.url_config.ts';
import { useSuperadminPlansPromotionsConfirm } from '@/app/frontend_superadmin/superadmin_plans/plans_promotions/hooks/useSuperadminPlansPromotionsConfirm';
import SuperadminPlansPromotionsEmptyState from '@/app/frontend_superadmin/superadmin_plans/plans_promotions/components/SuperadminPlansPromotionsEmptyState';
import { toast } from 'sonner';
/** Responsibility: renders the superadmin_billing overview route UI; the module Main remains a thin composition boundary. */
/** Data-Flow: canonical route -> SuperadminPlansPromotionsPageClient -> feature-local sample fixtures and local UI state -> preview rendering; no persistence is claimed. */

import { useSuperadminPlansPromotionsValidationMessage } from '@/app/frontend_superadmin/superadmin_plans/plans_promotions/hooks/useSuperadminPlansPromotionsValidationMessage';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SuperadminBillingPromoSchema, type SuperadminBillingPromoFormValues } from '@/app/frontend_superadmin/superadmin_plans/plans_promotions/schemas/SuperadminPlansPromotionsPromoSchema';
import { Tag, Plus, X } from 'lucide-react';
import { FormatCurrency } from '@/app/frontend_superadmin/superadmin_plans/plans_promotions/utils/SuperadminPlansPromotionsFormatters';
import type { SuperadminBillingPromoSample } from '@/app/frontend_superadmin/superadmin_plans/plans_promotions/types/SuperadminPlansPromotionsTypes';
import { SUPERADMIN_BILLING_SAMPLE_PROMOS } from '@/app/frontend_superadmin/superadmin_plans/plans_promotions/mocks/fixtures/SuperadminPlansPromotionsSampleMockFixtures';
import { useLocale, useTranslations } from 'next-intl';
import { useSuperadminPlansPromotionsUnsavedChangesGuard } from '@/app/frontend_superadmin/superadmin_plans/plans_promotions/hooks/useSuperadminPlansPromotionsUnsavedChangesGuard';
import { SUPERADMIN_BILLING_TABS } from '@/app/frontend_superadmin/superadmin_plans/plans_promotions/constants/SuperadminPlansPromotionsConstants';

import { SUPERADMIN_BILLING_OVERVIEW_PAGE_CLIENT_FOCUSABLE_SELECTOR } from '@/app/frontend_superadmin/superadmin_plans/plans_promotions/constants/SuperadminPlansPromotionsStaticConstants';
/** Derives a stable, non-index row identity for repeated interactive table controls. */
function getSuperadminInteractiveTestIdSuffix(value: unknown): string {
  const record = value && typeof value === 'object' ? value as Record<string, unknown> : {};
  for (const field of ['id', 'uuid', 'recordId', 'userId', 'assetId', 'libraryId', 'planId', 'subscriptionId', 'transactionId', 'invoiceId', 'refundId', 'requestId', 'ruleId', 'messageId', 'noticeId', 'complaintId', 'entryId', 'backupId', 'enquiryId', 'studentId', 'memberId', 'branchId', 'scheduleId', 'logId', 'smartId', 'receiptNumber', 'ticketId', 'lockerId', 'seatNo', 'code', 'slug', 'key', 'name']) {
    const candidate = record[field];
    if (typeof candidate === 'string' || typeof candidate === 'number') return String(candidate);
  }
  return 'missing-domain-id';
}

/**
 * Renders the `superadmin_billing` view owned by `SuperadminPlansPromotionsPageClient`.
 * Owns local UI state for `promos`, local-only `promoPreview`, toast feedback, and `showModal`.
 * Effect lifecycle boundaries are `[showModal]`; listeners/timers/focus are cleaned up by their owning effects.
 * Dirty form state is guarded before destructive or route-leaving actions.
 */
export default function SuperadminPlansPromotionsPageClient() {
  const confirm = useSuperadminPlansPromotionsConfirm();
  const tCopy = useTranslations('SUPERADMIN_BILLING');
  
  const navigateToWorkflow = (key: string) => {
    const routes: Record<string, string> = {
    "invoices": SUPERADMIN_NAVIGATION_ROUTES.billing_invoices,
    "promos": SUPERADMIN_NAVIGATION_ROUTES.plans_promotions
    };
    const route = routes[key];
    if (route) { const target = new URL(route, window.location.origin); const query = new URLSearchParams(window.location.search); query.delete('view'); query.forEach((value, key) => { if (!target.searchParams.has(key)) target.searchParams.append(key, value); }); window.location.assign(target.pathname + target.search + target.hash); }
  };
const locale = useLocale();
  const translateValidationMessage = useSuperadminPlansPromotionsValidationMessage();
  const [promos] = useState<SuperadminBillingPromoSample[]>(SUPERADMIN_BILLING_SAMPLE_PROMOS);
  const [promoPreview, setPromoPreview] = useState<SuperadminBillingPromoFormValues | null>(null);
  // Promo Modal State
  const [showModal, setShowModal] = useState(false);
  const promoDialogRef = useRef<HTMLDivElement>(null);
  const createPromoButtonRef = useRef<HTMLButtonElement>(null);
  const { register, handleSubmit, reset, formState: { errors , isDirty} } = useForm<SuperadminBillingPromoFormValues>({
    resolver: zodResolver(SuperadminBillingPromoSchema),
    defaultValues: { code: '', discount: '', expiry: '', maxUses: 100 },
    mode: 'onBlur',
  });
  useSuperadminPlansPromotionsUnsavedChangesGuard(isDirty, tCopy('COPY.UNSAVED_CHANGES_WARNING'));

  const showToast = (msg: string) => { toast.message(msg, { id: 'superadmin:superadmin_billing:SuperadminPlansPromotionsPageClient:feedback' }); };

  const requestClosePromo = useCallback(async () => {
    if (isDirty && !await confirm(tCopy('COPY.UNSAVED_CHANGES_WARNING'))) return;
    reset({ code: '', discount: '', expiry: '', maxUses: 100 });
    setShowModal(false);
  }, [confirm, isDirty, reset, tCopy]);

  const handleSavePromo = (values: SuperadminBillingPromoFormValues) => {
    // This is an explicit local preview only; no billing API write is attempted or implied.
    setPromoPreview(values);
    setShowModal(false);
    reset({ code: '', discount: '', expiry: '', maxUses: 100 });
    showToast(tCopy('COPY.PREVIEW_ONLY_THE_PROMO_CODE_IS_LOCAL_STATE_AND_IS_NOT_ACTIVE_IN_THE_BILLING_SERVICE'));
  };

  // Effect contract: attach keyboard handling for the active interactive surface and remove it during cleanup; dependency set [showModal] is the deliberate re-run boundary.
  useEffect(() => {
    if (!showModal) return;
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    
    
    const getFocusable = () => Array.from<HTMLElement>(promoDialogRef.current?.querySelectorAll<HTMLElement>(SUPERADMIN_BILLING_OVERVIEW_PAGE_CLIENT_FOCUSABLE_SELECTOR) ?? []).filter((element) => element.offsetParent !== null);
    getFocusable()[0]?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); requestClosePromo(); return; }
      if (event.key !== 'Tab') return;
      const focusable = getFocusable();
      if (focusable.length === 0) { event.preventDefault(); promoDialogRef.current?.focus(); return; }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      if (previouslyFocused?.isConnected) previouslyFocused.focus();
      else createPromoButtonRef.current?.focus();
    };
  }, [showModal, requestClosePromo]);

  


  return (
    <div className="sa-page-animate relative">

      <div className="flex flex-col gap-1 mb-8">
        <div className="sa-breadcrumb">
          <span>{tCopy("COPY.LIBRARY_OS")}</span><span>/</span><span>{tCopy("COPY.SUPER_ADMIN")}</span><span>/</span><span>{tCopy("COPY.BILLING")}</span>
        </div>
        <div className="flex items-center justify-between mt-2">
          <h1 className="sa-page-title">{tCopy("COPY.BILLING_REVENUE")}</h1>
          <div className="flex items-center gap-3">
            <button ref={createPromoButtonRef} type="button" className="sa-btn-primary bg-success text-on-success hover:bg-success hover:text-on-success border-none" onClick={() => { reset({ code: '', discount: '', expiry: '', maxUses: 100 }); setShowModal(true); }} data-testid="superadmin-billing-billing-overview-create-promo-code-3">
              <Plus size={16} /> {tCopy("COPY.CREATE_PROMO_CODE")}
            </button>
          </div>
        </div>
      </div>

      <p className="mb-4 rounded-lg border border-border bg-warning-bg p-3 text-sm text-warning" role="status">{tCopy("COPY.INVOICE_AND_PROMOTION_ENTRIES_ARE_LOCAL_DEMONSTRATION_DATA_PROMO_CHANGES_ARE_PREVIEWS_AND_ARE_NOT_LIVE_BILLING_CHANGES")}</p>

      {promoPreview && (
        <section className="sa-card mb-6 border border-border p-5" aria-labelledby="superadmin-promo-local-preview-title" data-testid="superadmin-plans-promotions-local-preview">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 id="superadmin-promo-local-preview-title" className="text-lg font-bold text-primary">{tCopy('COPY.CREATE_PROMO_CODE_PREVIEW')}</h2>
              <p className="text-sm text-warning mt-1" role="status">{tCopy('COPY.PREVIEW_ONLY_THE_PROMO_CODE_IS_LOCAL_STATE_AND_IS_NOT_ACTIVE_IN_THE_BILLING_SERVICE')}</p>
            </div>
            <button type="button" className="sa-btn-ghost" onClick={() => setPromoPreview(null)} aria-label={tCopy('COPY.CLOSE_PROMO_CODE_DIALOG')} data-testid="superadmin-plans-promotions-dismiss-local-preview">{tCopy('COPY.CANCEL')}</button>
          </div>
          <dl className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div><dt className="text-xs text-secondary">{tCopy('COPY.COUPON_CODE')}</dt><dd className="font-bold text-primary">{promoPreview.code}</dd></div>
            <div><dt className="text-xs text-secondary">{tCopy('COPY.DISCOUNT')}</dt><dd className="font-bold text-success">{promoPreview.discount}</dd></div>
            <div><dt className="text-xs text-secondary">{tCopy('COPY.EXPIRY_DATE')}</dt><dd className="font-semibold text-primary">{promoPreview.expiry}</dd></div>
            <div><dt className="text-xs text-secondary">{tCopy('COPY.MAX_USES')}</dt><dd className="font-semibold text-primary">{promoPreview.maxUses}</dd></div>
          </dl>
        </section>
      )}

      <div className="flex items-center gap-2 mb-6 border-b border-border pb-2 overflow-x-auto hide-scrollbar">
        {SUPERADMIN_BILLING_TABS.map((tab) => (
          <button type="button"
            key={tab.id}
            onClick={() => navigateToWorkflow(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold motion-safe:transition-all motion-reduce:transition-none whitespace-nowrap ${
              tab.id === 'promos'
                ? 'bg-info-bg text-primary border border-border shadow-card' 
                : 'text-secondary hover:bg-surface-hover hover:text-primary'
            }`}
           data-testid={`superadmin-billing-billing-overview-set-active-tab-4-${String(tab.id)}`}>
            <tab.icon size={16} /> {tCopy(tab.labelKey)}
          </button>
        ))}
      </div>

      <div className="sa-card p-0 overflow-hidden h-125 flex flex-col">
          <div className="p-6 h-full overflow-y-auto motion-safe:animate-fade-in motion-reduce:animate-none space-y-4">
            <h2 className="text-lg font-bold text-primary mb-2">{tCopy("COPY.SAMPLE_PROMO_CODES")}</h2>
            <p className="text-sm text-secondary mb-6">{tCopy("COPY.ILLUSTRATIVE_CODES_ONLY_THEY_CANNOT_BE_REDEEMED_AND_DO_NOT_APPLY_TO_LIVE_TENANTS")}</p>
            
            <div className="grid gap-4">
              {promos.length === 0 ? (
                <div className="py-8 text-center"><SuperadminPlansPromotionsEmptyState /></div>
              ) : promos.map(p => (
                <div key={p.id} className="flex flex-col md:flex-row md:items-center justify-between p-5 bg-surface-hover border border-border rounded-xl hover:bg-surface-hover motion-safe:transition-colors motion-reduce:transition-none gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-success-bg border border-border flex items-center justify-center shrink-0">
                      <Tag className="text-success" size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-black tracking-widest text-primary">{p.code}</h3>
                      <p className="text-xs text-secondary mt-1">{tCopy("COPY.DISCOUNT")} <strong className="text-success">{p.discountAmountMinor !== undefined && p.discountCurrencyCode ? `${FormatCurrency(p.discountAmountMinor, p.discountCurrencyCode, locale)} ${tCopy('COPY.FLAT_AMOUNT')}` : p.discount}</strong> {tCopy("COPY.EXPIRES")} {p.expiry}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between md:justify-end gap-8 w-full md:w-auto">
                    <div className="text-left md:text-right">
                      <p className="text-sm font-bold text-primary">{p.uses} <span className="text-secondary font-normal">/ {p.maxUses} {tCopy("COPY.USES")}</span></p>
                      <div className="w-24 h-1.5 bg-floating rounded-full mt-2 overflow-hidden">
                        <progress className="sa-plan-usage-progress" max={p.maxUses} value={p.uses} aria-label={tCopy("COPY.PROMO_CODE_USAGE_ARIA_LABEL", { code: p.code })} />
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-bold ${p.status === 'Active' ? 'bg-success-bg text-success' : 'bg-danger-bg text-danger'}`}>
                      {p.status === 'Active' ? tCopy('COPY.ACTIVE') : tCopy('COPY.EXPIRED')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
      </div>

      {/* Promo Code Modal — preview-only, with validated fields and accessible focus lifecycle. */}
      {showModal && (
        <div className="sa-wizard-modal-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) requestClosePromo(); }}>
          <div ref={promoDialogRef} className="sa-wizard-modal sa-wizard-modal--medium" role="dialog" aria-modal="true" aria-labelledby="superadmin-billing-promo-dialog-title" aria-describedby="superadmin-billing-promo-dialog-description" tabIndex={-1}>
            <div className="flex items-center justify-between mb-6">
              <h2 id="superadmin-billing-promo-dialog-title" className="text-lg font-bold text-primary flex items-center gap-2">
                <Tag size={20} className="text-success" aria-hidden="true" /> {tCopy("COPY.CREATE_PROMO_CODE_PREVIEW")}
              </h2>
              <button type="button" onClick={requestClosePromo} className="sa-btn-icon" aria-label={tCopy("COPY.CLOSE_PROMO_CODE_DIALOG")} data-testid="superadmin-billing-billing-overview-close-promo-code-dialog-5"><X size={20} aria-hidden="true" /></button>
            </div>
            <p id="superadmin-billing-promo-dialog-description" className="mb-4 text-sm text-warning">{tCopy("COPY.THIS_CREATES_A_LOCAL_PREVIEW_ONLY_IT_DOES_NOT_ACTIVATE_A_PROMOTION_IN_THE_BILLING_SERVICE")}</p>

            <form onSubmit={handleSubmit(handleSavePromo)} noValidate data-testid="superadmin-superadmin-billing-overview-page-client-form-line-245">
              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-xs font-semibold text-secondary block mb-1" htmlFor="superadmin-billing-promo-code">{tCopy("COPY.COUPON_CODE")}</label>
                  <input id="superadmin-billing-promo-code" type="text" autoComplete="off" placeholder={tCopy("COPY.E_G_DIWALI50")} className="sa-input uppercase" {...register('code')} aria-invalid={Boolean(errors.code)} aria-describedby={errors.code ? 'superadmin-billing-promo-code-error' : undefined}  data-testid="superadmin-billing-billing-overview-superadmin-billing-promo-code-6"/>
                  {errors.code && <p id="superadmin-billing-promo-code-error" className="mt-1 text-xs text-danger" role="alert">{translateValidationMessage(errors.code.message)}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-secondary block mb-1" htmlFor="superadmin-billing-promo-discount">{tCopy("COPY.DISCOUNT_FLAT")}</label>
                    <input id="superadmin-billing-promo-discount" type="text" placeholder={tCopy("COPY.E_G_20")} className="sa-input" {...register('discount')} aria-invalid={Boolean(errors.discount)} aria-describedby={errors.discount ? 'superadmin-billing-promo-discount-error' : undefined}  data-testid="superadmin-billing-billing-overview-superadmin-billing-promo-discount-7"/>
                    {errors.discount && <p id="superadmin-billing-promo-discount-error" className="mt-1 text-xs text-danger" role="alert">{translateValidationMessage(errors.discount.message)}</p>}
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-secondary block mb-1" htmlFor="superadmin-billing-promo-max-uses">{tCopy("COPY.MAX_USES")}</label>
                    <input id="superadmin-billing-promo-max-uses" type="number" min={1} step={1} className="sa-input" {...register('maxUses', { valueAsNumber: true })} aria-invalid={Boolean(errors.maxUses)} aria-describedby={errors.maxUses ? 'superadmin-billing-promo-max-uses-error' : undefined}  data-testid="superadmin-billing-billing-overview-superadmin-billing-promo-max-uses-8"/>
                    {errors.maxUses && <p id="superadmin-billing-promo-max-uses-error" className="mt-1 text-xs text-danger" role="alert">{translateValidationMessage(errors.maxUses.message)}</p>}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-secondary block mb-1" htmlFor="superadmin-billing-promo-expiry">{tCopy("COPY.EXPIRY_DATE")}</label>
                  <input id="superadmin-billing-promo-expiry" type="date" className="sa-input text-primary" {...register('expiry')} aria-invalid={Boolean(errors.expiry)} aria-describedby={errors.expiry ? 'superadmin-billing-promo-expiry-error' : undefined}  data-testid="superadmin-billing-billing-overview-superadmin-billing-promo-expiry-9"/>
                  {errors.expiry && <p id="superadmin-billing-promo-expiry-error" className="mt-1 text-xs text-danger" role="alert">{translateValidationMessage(errors.expiry.message)}</p>}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <button type="button" className="sa-btn-ghost" onClick={requestClosePromo} data-testid="superadmin-billing-billing-overview-cancel-10">{tCopy("COPY.CANCEL")}</button>
                <button type="submit" className="sa-btn-primary bg-success text-on-success hover:bg-success hover:text-on-success border-none" data-testid="superadmin-billing-billing-overview-generate-preview-11">{tCopy("COPY.GENERATE_PREVIEW")}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
