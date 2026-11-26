'use client';

import React from 'react';
import { Tag, X } from 'lucide-react';
import type { UseFormRegister, FieldErrors, UseFormHandleSubmit } from 'react-hook-form';
import type { SuperadminBillingPromoFormValues } from '@/app/frontend_superadmin/superadmin_plans/plans_promotions/schemas/SuperadminPlansPromotionsPromoSchema';

interface CreateModalProps {
  showModal: boolean;
  promoDialogRef: React.Ref<HTMLDivElement>;
  requestClosePromo: () => void;
  handleSubmit: UseFormHandleSubmit<SuperadminBillingPromoFormValues>;
  handleSavePromo: (values: SuperadminBillingPromoFormValues) => void;
  register: UseFormRegister<SuperadminBillingPromoFormValues>;
  errors: FieldErrors<SuperadminBillingPromoFormValues>;
  translateValidationMessage: (msg?: string) => string;
  tCopy: (key: string) => string;
}

export default function SuperadminPlansPromotionsCreateModal({
  showModal,
  promoDialogRef,
  requestClosePromo,
  handleSubmit,
  handleSavePromo,
  register,
  errors,
  translateValidationMessage,
  tCopy,
}: CreateModalProps) {
  if (!showModal) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onMouseDown={(event) => { if (event.target === event.currentTarget) requestClosePromo(); }}
    >
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
              className="rounded-xl border border-border/80 bg-card/80 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800/60 cursor-pointer motion-safe:transition-all"
              onClick={requestClosePromo}
              data-testid="superadmin-billing-billing-overview-cancel-10"
            >
              {tCopy("COPY.CANCEL")}
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-emerald-600 px-5 py-2 text-xs font-semibold text-white shadow-md shadow-emerald-500/25 cursor-pointer motion-safe:transition-all active:scale-95"
              data-testid="superadmin-billing-billing-overview-generate-preview-11"
            >
              <span>{tCopy("COPY.GENERATE_PREVIEW")}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
