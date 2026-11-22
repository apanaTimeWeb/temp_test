'use client';

import { SUPERADMIN_NAVIGATION_ROUTES } from '@/app/frontend_superadmin/superadmin_plans/plans_promotions/config/superadmin_plans_promotions.url_config.ts';
import { useSuperadminPlansPromotionsConfirm } from '@/app/frontend_superadmin/superadmin_plans/plans_promotions/hooks/useSuperadminPlansPromotionsConfirm';
import SuperadminPlansPromotionsEmptyState from '@/app/frontend_superadmin/superadmin_plans/plans_promotions/components/SuperadminPlansPromotionsEmptyState';
import { toast } from 'sonner';
/** Responsibility: renders the superadmin_billing overview route UI; the module Main remains a thin composition boundary. */
/** Data-Flow: canonical route -> SuperadminPlansPromotionsPageClient -> feature-local sample fixtures and local UI state -> preview rendering; no persistence is claimed. */

import { useSuperadminPlansPromotionsValidationMessage } from '@/app/frontend_superadmin/superadmin_plans/plans_promotions/hooks/useSuperadminPlansPromotionsValidationMessage';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SuperadminBillingPromoSchema, type SuperadminBillingPromoFormValues } from '@/app/frontend_superadmin/superadmin_plans/plans_promotions/schemas/SuperadminPlansPromotionsPromoSchema';
import { Tag, Plus, X, Percent, TrendingUp, Clock, CheckCircle2 } from 'lucide-react';
import { FormatCurrency } from '@/app/frontend_superadmin/superadmin_plans/plans_promotions/utils/SuperadminPlansPromotionsFormatters';
import type { SuperadminBillingPromoSample } from '@/app/frontend_superadmin/superadmin_plans/plans_promotions/types/SuperadminPlansPromotionsTypes';
import { SUPERADMIN_BILLING_SAMPLE_PROMOS } from '@/app/frontend_superadmin/superadmin_plans/plans_promotions/mocks/fixtures/SuperadminPlansPromotionsSampleMockFixtures';
import { useLocale, useTranslations } from 'next-intl';
import { useSuperadminPlansPromotionsUnsavedChangesGuard } from '@/app/frontend_superadmin/superadmin_plans/plans_promotions/hooks/useSuperadminPlansPromotionsUnsavedChangesGuard';
import { SUPERADMIN_BILLING_OVERVIEW_PAGE_CLIENT_FOCUSABLE_SELECTOR } from '@/app/frontend_superadmin/superadmin_plans/plans_promotions/constants/SuperadminPlansPromotionsStaticConstants';

/**
 * Renders the `superadmin_billing` view owned by `SuperadminPlansPromotionsPageClient`.
 * Owns local UI state for `promos`, local-only `promoPreview`, toast feedback, and `showModal`.
 * Effect lifecycle boundaries are `[showModal]`; listeners/timers/focus are cleaned up by their owning effects.
 * Dirty form state is guarded before destructive or route-leaving actions.
 */
export default function SuperadminPlansPromotionsPageClient() {
  const confirm = useSuperadminPlansPromotionsConfirm();
  const tCopy = useTranslations('SUPERADMIN_BILLING');
  const locale = useLocale();
  const translateValidationMessage = useSuperadminPlansPromotionsValidationMessage();
  const [promos] = useState<SuperadminBillingPromoSample[]>(SUPERADMIN_BILLING_SAMPLE_PROMOS);
  const [promoPreview, setPromoPreview] = useState<SuperadminBillingPromoFormValues | null>(null);
  // Promo Modal State
  const [showModal, setShowModal] = useState(false);
  const promoDialogRef = useRef<HTMLDivElement>(null);
  const createPromoButtonRef = useRef<HTMLButtonElement>(null);
  const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm<SuperadminBillingPromoFormValues>({
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

  // Effect contract: attach keyboard handling for the active interactive surface and remove it during cleanup
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

  const activeCount = useMemo(() => promos.filter((p) => p.status === 'Active').length, [promos]);
  const totalUses = useMemo(() => promos.reduce((sum, p) => sum + p.uses, 0), [promos]);
  const totalMaxUses = useMemo(() => promos.reduce((sum, p) => sum + p.maxUses, 0), [promos]);
  const expiredCount = useMemo(() => promos.filter((p) => p.status !== 'Active').length, [promos]);

  return (
    <div className="w-full max-w-full min-w-0 space-y-6">
      {/* Notice Banner */}
      <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs text-amber-300" role="status">
        {tCopy("COPY.INVOICE_AND_PROMOTION_ENTRIES_ARE_LOCAL_DEMONSTRATION_DATA_PROMO_CHANGES_ARE_PREVIEWS_AND_ARE_NOT_LIVE_BILLING_CHANGES")}
      </div>

      {/* Hero Header Card */}
      <div className="rounded-2xl border border-indigo-500/25 bg-[#0c0f28]/95 p-5 sm:p-6 shadow-md backdrop-blur-md">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-indigo-500/30 bg-indigo-500/15 text-indigo-400 shadow-inner">
              <Tag className="h-6 w-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-100">
                  {tCopy("COPY.BILLING_REVENUE")}
                </h1>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  Promotions Engine Active
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-indigo-500/30 bg-indigo-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-indigo-300">
                  {promos.length} Active Campaigns
                </span>
              </div>
              <p className="mt-1 text-xs sm:text-sm text-slate-400">
                {tCopy("COPY.SAMPLE_PROMO_CODES")}
              </p>
            </div>
          </div>
          <button
            ref={createPromoButtonRef}
            type="button"
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-emerald-500/25 transition-all active:scale-95 cursor-pointer"
            onClick={() => { reset({ code: '', discount: '', expiry: '', maxUses: 100 }); setShowModal(true); }}
            data-testid="superadmin-billing-billing-overview-create-promo-code-3"
          >
            <Plus size={16} />
            <span>{tCopy("COPY.CREATE_PROMO_CODE")}</span>
          </button>
        </div>
      </div>

      {/* 4 Vibrant KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Active Codes */}
        <div className="relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/40 via-slate-900/90 to-slate-900/90 p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Active Promo Codes</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/15 text-emerald-400">
              <Tag className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl sm:text-3xl font-black text-slate-100">{activeCount}</div>
          <div className="mt-3 flex items-center justify-between">
            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-300 border border-emerald-500/20">
              Live Discounts
            </span>
            <span className="text-[11px] text-slate-400">Redeemable</span>
          </div>
          <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-slate-800">
            <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400" style={{ width: '85%' }} />
          </div>
        </div>

        {/* Total Redemptions */}
        <div className="relative overflow-hidden rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/40 via-slate-900/90 to-slate-900/90 p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-300">Total Redemptions</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-indigo-500/30 bg-indigo-500/15 text-indigo-400">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl sm:text-3xl font-black text-slate-100">{totalUses.toLocaleString()}</div>
          <div className="mt-3 flex items-center justify-between">
            <span className="inline-flex items-center gap-1 rounded-md bg-indigo-500/10 px-2 py-0.5 text-[11px] font-medium text-indigo-300 border border-indigo-500/20">
              Times Used
            </span>
            <span className="text-[11px] text-slate-400">All Campaigns</span>
          </div>
          <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-slate-800">
            <div className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400" style={{ width: '60%' }} />
          </div>
        </div>

        {/* Max Capacity */}
        <div className="relative overflow-hidden rounded-2xl border border-sky-500/30 bg-gradient-to-br from-sky-950/40 via-slate-900/90 to-slate-900/90 p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-sky-400">Campaign Capacity</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-sky-500/30 bg-sky-500/15 text-sky-400">
              <Percent className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl sm:text-3xl font-black text-slate-100">{totalMaxUses.toLocaleString()}</div>
          <div className="mt-3 flex items-center justify-between">
            <span className="inline-flex items-center gap-1 rounded-md bg-sky-500/10 px-2 py-0.5 text-[11px] font-medium text-sky-300 border border-sky-500/20">
              Max Limit
            </span>
            <span className="text-[11px] text-slate-400">Overall Quota</span>
          </div>
          <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-slate-800">
            <div className="h-full bg-gradient-to-r from-sky-500 to-cyan-400" style={{ width: '75%' }} />
          </div>
        </div>

        {/* Expired / Lapsed */}
        <div className="relative overflow-hidden rounded-2xl border border-rose-500/30 bg-gradient-to-br from-rose-950/40 via-slate-900/90 to-slate-900/90 p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-400">Expired Campaigns</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-rose-500/30 bg-rose-500/15 text-rose-400">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl sm:text-3xl font-black text-slate-100">{expiredCount}</div>
          <div className="mt-3 flex items-center justify-between">
            <span className="inline-flex items-center gap-1 rounded-md bg-rose-500/10 px-2 py-0.5 text-[11px] font-medium text-rose-300 border border-rose-500/20">
              Archived
            </span>
            <span className="text-[11px] text-slate-400">Past Validity</span>
          </div>
          <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-slate-800">
            <div className="h-full bg-gradient-to-r from-rose-500 to-pink-500" style={{ width: '30%' }} />
          </div>
        </div>
      </div>

      {/* Local Preview Card (when created) */}
      {promoPreview && (
        <section className="rounded-2xl border border-emerald-500/30 bg-[#0c0f28]/95 p-5 shadow-xl backdrop-blur-md" aria-labelledby="superadmin-promo-local-preview-title" data-testid="superadmin-plans-promotions-local-preview">
          <div className="flex items-start justify-between gap-4 pb-3 border-b border-emerald-500/20">
            <div>
              <h2 id="superadmin-promo-local-preview-title" className="text-base font-bold text-slate-100 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>{tCopy('COPY.CREATE_PROMO_CODE_PREVIEW')}</span>
              </h2>
              <p className="text-xs text-amber-300 mt-1" role="status">{tCopy('COPY.PREVIEW_ONLY_THE_PROMO_CODE_IS_LOCAL_STATE_AND_IS_NOT_ACTIVE_IN_THE_BILLING_SERVICE')}</p>
            </div>
            <button
              type="button"
              className="rounded-xl border border-border/80 bg-card/80 px-3.5 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-800/60 cursor-pointer transition-all"
              onClick={() => setPromoPreview(null)}
              aria-label={tCopy('COPY.CLOSE_PROMO_CODE_DIALOG')}
              data-testid="superadmin-plans-promotions-dismiss-local-preview"
            >
              {tCopy('COPY.CANCEL')}
            </button>
          </div>
          <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-indigo-500/20 bg-slate-900/60 p-3">
              <dt className="text-xs text-slate-400 font-semibold uppercase">{tCopy('COPY.COUPON_CODE')}</dt>
              <dd className="mt-1 font-mono font-bold text-base text-slate-100">{promoPreview.code}</dd>
            </div>
            <div className="rounded-xl border border-indigo-500/20 bg-slate-900/60 p-3">
              <dt className="text-xs text-slate-400 font-semibold uppercase">{tCopy('COPY.DISCOUNT')}</dt>
              <dd className="mt-1 font-bold text-base text-emerald-400">{promoPreview.discount}</dd>
            </div>
            <div className="rounded-xl border border-indigo-500/20 bg-slate-900/60 p-3">
              <dt className="text-xs text-slate-400 font-semibold uppercase">{tCopy('COPY.EXPIRY_DATE')}</dt>
              <dd className="mt-1 font-semibold text-base text-slate-200">{promoPreview.expiry}</dd>
            </div>
            <div className="rounded-xl border border-indigo-500/20 bg-slate-900/60 p-3">
              <dt className="text-xs text-slate-400 font-semibold uppercase">{tCopy('COPY.MAX_USES')}</dt>
              <dd className="mt-1 font-semibold text-base text-slate-200">{promoPreview.maxUses}</dd>
            </div>
          </dl>
        </section>
      )}

      {/* Main Promo Codes List */}
      <div className="rounded-2xl border border-indigo-500/20 bg-[#0c0f28]/95 p-6 shadow-md backdrop-blur-md">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-indigo-500/15">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/15 text-emerald-400">
              <Tag size={16} />
            </div>
            <span className="font-semibold text-slate-100">{tCopy("COPY.SAMPLE_PROMO_CODES")}</span>
          </div>
          <span className="text-xs font-semibold text-slate-400">
            {promos.length} Campaigns
          </span>
        </div>

        <p className="text-xs text-slate-400 mb-5">
          {tCopy("COPY.ILLUSTRATIVE_CODES_ONLY_THEY_CANNOT_BE_REDEEMED_AND_DO_NOT_APPLY_TO_LIVE_TENANTS")}
        </p>

        <div className="grid gap-4">
          {promos.length === 0 ? (
            <div className="py-8 text-center"><SuperadminPlansPromotionsEmptyState /></div>
          ) : (
            promos.map((p) => {
              const isActive = p.status === 'Active';
              const usagePercent = Math.min(100, Math.round((p.uses / p.maxUses) * 100));
              return (
                <div
                  key={p.id}
                  className="flex flex-col md:flex-row md:items-center justify-between p-5 rounded-2xl border border-indigo-500/20 bg-[#0c0f28]/80 hover:bg-indigo-500/[0.04] transition-all gap-4 backdrop-blur-md shadow-md"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/15 text-emerald-400 shadow-inner shrink-0">
                      <Tag className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-mono font-bold tracking-widest text-slate-100">{p.code}</h3>
                      <p className="text-xs text-slate-400 mt-1">
                        {tCopy("COPY.DISCOUNT")}{' '}
                        <strong className="text-emerald-400 font-bold">
                          {p.discountAmountMinor !== undefined && p.discountCurrencyCode
                            ? `${FormatCurrency(p.discountAmountMinor, p.discountCurrencyCode, locale)} ${tCopy('COPY.FLAT_AMOUNT')}`
                            : p.discount}
                        </strong>{' '}
                        • {tCopy("COPY.EXPIRES")}{' '}
                        <span className="font-mono text-slate-300">{p.expiry}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto">
                    <div className="text-left md:text-right">
                      <p className="text-xs font-bold text-slate-100">
                        {p.uses} <span className="text-slate-400 font-normal">/ {p.maxUses} {tCopy("COPY.USES")}</span>
                      </p>
                      <div className="w-28 h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                          style={{ width: `${usagePercent}%` }}
                          aria-label={tCopy("COPY.PROMO_CODE_USAGE_ARIA_LABEL", { code: p.code })}
                        />
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${
                        isActive
                          ? 'border-emerald-500/30 bg-emerald-500/15 text-emerald-400'
                          : 'border-rose-500/30 bg-rose-500/15 text-rose-400'
                      }`}
                    >
                      {isActive ? tCopy('COPY.ACTIVE') : tCopy('COPY.EXPIRED')}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Promo Code Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) requestClosePromo(); }}>
          <div
            ref={promoDialogRef}
            className="w-full max-w-md rounded-2xl border border-indigo-500/30 bg-[#0c0f28] p-6 sm:p-7 shadow-2xl space-y-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="superadmin-billing-promo-dialog-title"
            aria-describedby="superadmin-billing-promo-dialog-description"
            tabIndex={-1}
          >
            <div className="flex items-center justify-between pb-3 border-b border-indigo-500/20">
              <h2 id="superadmin-billing-promo-dialog-title" className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2">
                <Tag size={20} className="text-emerald-400" aria-hidden="true" />
                <span>{tCopy("COPY.CREATE_PROMO_CODE_PREVIEW")}</span>
              </h2>
              <button
                type="button"
                onClick={requestClosePromo}
                className="text-slate-400 hover:text-slate-200 text-sm font-bold p-1 cursor-pointer"
                aria-label={tCopy("COPY.CLOSE_PROMO_CODE_DIALOG")}
                data-testid="superadmin-billing-billing-overview-close-promo-code-dialog-5"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>
            <p id="superadmin-billing-promo-dialog-description" className="text-xs text-amber-300">
              {tCopy("COPY.THIS_CREATES_A_LOCAL_PREVIEW_ONLY_IT_DOES_NOT_ACTIVATE_A_PROMOTION_IN_THE_BILLING_SERVICE")}
            </p>

            <form onSubmit={handleSubmit(handleSavePromo)} noValidate data-testid="superadmin-superadmin-billing-overview-page-client-form-line-245">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5" htmlFor="superadmin-billing-promo-code">
                    {tCopy("COPY.COUPON_CODE")}
                  </label>
                  <input maxLength={30}
                    id="superadmin-billing-promo-code"
                    type="text"
                    autoComplete="off"
                    placeholder={tCopy("COPY.E_G_DIWALI50")}
                    className="w-full uppercase font-mono rounded-xl border border-indigo-500/25 bg-slate-900/60 px-3.5 py-2 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    {...register('code')}
                    aria-invalid={Boolean(errors.code)}
                    aria-describedby={errors.code ? 'superadmin-billing-promo-code-error' : undefined}
                    data-testid="superadmin-billing-billing-overview-superadmin-billing-promo-code-6"
                  />
                  {errors.code && <p id="superadmin-billing-promo-code-error" className="mt-1 text-xs text-rose-400" role="alert">{translateValidationMessage(errors.code.message)}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5" htmlFor="superadmin-billing-promo-discount">
                      {tCopy("COPY.DISCOUNT_FLAT")}
                    </label>
                    <input maxLength={30}
                      id="superadmin-billing-promo-discount"
                      type="text"
                      placeholder={tCopy("COPY.E_G_20")}
                      className="w-full rounded-xl border border-indigo-500/25 bg-slate-900/60 px-3.5 py-2 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      {...register('discount')}
                      aria-invalid={Boolean(errors.discount)}
                      aria-describedby={errors.discount ? 'superadmin-billing-promo-discount-error' : undefined}
                      data-testid="superadmin-billing-billing-overview-superadmin-billing-promo-discount-7"
                    />
                    {errors.discount && <p id="superadmin-billing-promo-discount-error" className="mt-1 text-xs text-rose-400" role="alert">{translateValidationMessage(errors.discount.message)}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5" htmlFor="superadmin-billing-promo-max-uses">
                      {tCopy("COPY.MAX_USES")}
                    </label>
                    <input maxLength={30}
                      id="superadmin-billing-promo-max-uses"
                      type="number"
                      min={1}
                      step={1}
                      className="w-full rounded-xl border border-indigo-500/25 bg-slate-900/60 px-3.5 py-2 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      {...register('maxUses', { valueAsNumber: true })}
                      aria-invalid={Boolean(errors.maxUses)}
                      aria-describedby={errors.maxUses ? 'superadmin-billing-promo-max-uses-error' : undefined}
                      data-testid="superadmin-billing-billing-overview-superadmin-billing-promo-max-uses-8"
                    />
                    {errors.maxUses && <p id="superadmin-billing-promo-max-uses-error" className="mt-1 text-xs text-rose-400" role="alert">{translateValidationMessage(errors.maxUses.message)}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5" htmlFor="superadmin-billing-promo-expiry">
                    {tCopy("COPY.EXPIRY_DATE")}
                  </label>
                  <input maxLength={30}
                    id="superadmin-billing-promo-expiry"
                    type="date"
                    className="w-full rounded-xl border border-indigo-500/25 bg-slate-900/60 px-3.5 py-2 text-xs sm:text-sm text-slate-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    {...register('expiry')}
                    aria-invalid={Boolean(errors.expiry)}
                    aria-describedby={errors.expiry ? 'superadmin-billing-promo-expiry-error' : undefined}
                    data-testid="superadmin-billing-billing-overview-superadmin-billing-promo-expiry-9"
                  />
                  {errors.expiry && <p id="superadmin-billing-promo-expiry-error" className="mt-1 text-xs text-rose-400" role="alert">{translateValidationMessage(errors.expiry.message)}</p>}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-indigo-500/20 mt-4">
                <button
                  type="button"
                  className="rounded-xl border border-border/80 bg-card/80 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800/60 cursor-pointer transition-all"
                  onClick={requestClosePromo}
                  data-testid="superadmin-billing-billing-overview-cancel-10"
                >
                  {tCopy("COPY.CANCEL")}
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-emerald-600 px-5 py-2 text-xs font-semibold text-white shadow-md shadow-emerald-500/25 cursor-pointer transition-all active:scale-95"
                  data-testid="superadmin-billing-billing-overview-generate-preview-11"
                >
                  <span>{tCopy("COPY.GENERATE_PREVIEW")}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
