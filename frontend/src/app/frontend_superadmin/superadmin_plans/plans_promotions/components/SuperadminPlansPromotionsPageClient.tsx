'use client';

import { SUPERADMIN_NAVIGATION_ROUTES } from '@/app/frontend_superadmin/superadmin_plans/plans_promotions/config/superadmin_plans_promotions.url_config.ts';
import { useSuperadminPlansPromotionsConfirm } from '@/app/frontend_superadmin/superadmin_plans/plans_promotions/hooks/useSuperadminPlansPromotionsConfirm';
import SuperadminPlansPromotionsEmptyState from '@/app/frontend_superadmin/superadmin_plans/plans_promotions/components/SuperadminPlansPromotionsEmptyState';
import SuperadminPlansPromotionsKpiGrid from '@/app/frontend_superadmin/superadmin_plans/plans_promotions/components/SuperadminPlansPromotionsKpiGrid';
import SuperadminPlansPromotionsCreateModal from '@/app/frontend_superadmin/superadmin_plans/plans_promotions/components/SuperadminPlansPromotionsCreateModal';
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
                  <span className="h-2 w-2 rounded-full bg-emerald-400 motion-safe:animate-pulse" />
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
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-emerald-500/25 motion-safe:transition-all active:scale-95 cursor-pointer"
            onClick={() => { reset({ code: '', discount: '', expiry: '', maxUses: 100 }); setShowModal(true); }}
            data-testid="superadmin-billing-billing-overview-create-promo-code-3"
          >
            <Plus size={16} />
            <span>{tCopy("COPY.CREATE_PROMO_CODE")}</span>
          </button>
        </div>
      </div>

      {/* 4 Vibrant KPI Cards */}
      <SuperadminPlansPromotionsKpiGrid
        activeCount={activeCount}
        totalUses={totalUses}
        totalMaxUses={totalMaxUses}
        expiredCount={expiredCount}
      />

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
              className="rounded-xl border border-border/80 bg-card/80 px-3.5 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-800/60 cursor-pointer motion-safe:transition-all"
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
                  className="flex flex-col md:flex-row md:items-center justify-between p-5 rounded-2xl border border-indigo-500/20 bg-[#0c0f28]/80 hover:bg-indigo-500/[0.04] motion-safe:transition-all gap-4 backdrop-blur-md shadow-md"
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
      <SuperadminPlansPromotionsCreateModal
        showModal={showModal}
        promoDialogRef={promoDialogRef}
        requestClosePromo={requestClosePromo}
        handleSubmit={handleSubmit}
        handleSavePromo={handleSavePromo}
        register={register}
        errors={errors}
        translateValidationMessage={translateValidationMessage}
        tCopy={tCopy}
      />
    </div>
  );
}
