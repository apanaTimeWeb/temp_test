'use client';

import React from 'react';
import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import type { SuperadminLibrariesEditFormValues } from '../schemas/SuperadminLibrariesOverviewSchema';
import { SUPERADMIN_LIBRARIES_PLAN_VALUES } from '../constants/SuperadminLibrariesOverviewConstants';
import { useTranslations } from 'next-intl';

interface SuperadminLibrariesOverviewPanelEditFormProps {
  register: UseFormRegister<SuperadminLibrariesEditFormValues>;
  errors: FieldErrors<SuperadminLibrariesEditFormValues>;
  isSubmitting: boolean;
  saved: boolean;
  firstInputRef: React.RefObject<HTMLInputElement | null>;
  translateValidationMessage: (msg?: string) => string;
  onCancel: () => void;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
}

export default function SuperadminLibrariesOverviewPanelEditForm({
  register,
  errors,
  isSubmitting,
  saved,
  firstInputRef,
  translateValidationMessage,
  onCancel,
  onSubmit,
}: SuperadminLibrariesOverviewPanelEditFormProps) {
  const t = useTranslations('SUPERADMIN_LIBRARIES');

  return (
    <form className="space-y-4" onSubmit={onSubmit} noValidate data-testid="superadmin-superadmin-libraries-overview-panel-form-line-139">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <label htmlFor="superadmin-libraries-name" className="block text-xs font-semibold text-slate-300 mb-1.5">
            {t('COPY.LIBRARY_NAME')}
          </label>
          <input
            id="superadmin-libraries-name"
            className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-indigo-500/30 bg-[#131d38] text-white placeholder:text-slate-500 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 outline-none transition-all"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'superadmin-libraries-name-error' : undefined}
            {...register('name')}
            ref={(el) => {
              register('name').ref(el);
              if (firstInputRef) (firstInputRef as { current: HTMLInputElement | null }).current = el;
            }}
            data-testid="superadmin-libraries-libraries-superadmin-libraries-name-3"
          />
          {errors.name?.message && (
            <p id="superadmin-libraries-name-error" className="text-xs text-rose-400 mt-1" role="alert">
              {translateValidationMessage(errors.name.message)}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="superadmin-libraries-owner" className="block text-xs font-semibold text-slate-300 mb-1.5">
            {t('COPY.OWNER_NAME')}
          </label>
          <input
            id="superadmin-libraries-owner"
            className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-indigo-500/30 bg-[#131d38] text-white placeholder:text-slate-500 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 outline-none transition-all"
            aria-invalid={Boolean(errors.owner)}
            aria-describedby={errors.owner ? 'superadmin-libraries-owner-error' : undefined}
            {...register('owner')}
            data-testid="superadmin-libraries-libraries-superadmin-libraries-owner-4"
          />
          {errors.owner?.message && (
            <p id="superadmin-libraries-owner-error" className="text-xs text-rose-400 mt-1" role="alert">
              {translateValidationMessage(errors.owner.message)}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <label htmlFor="superadmin-libraries-email" className="block text-xs font-semibold text-slate-300 mb-1.5">
            {t('COPY.EMAIL')}
          </label>
          <input
            id="superadmin-libraries-email"
            type="email"
            autoComplete="email"
            className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-indigo-500/30 bg-[#131d38] text-white placeholder:text-slate-500 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 outline-none transition-all"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'superadmin-libraries-email-error' : undefined}
            {...register('email')}
            data-testid="superadmin-libraries-libraries-superadmin-libraries-email-5"
          />
          {errors.email?.message && (
            <p id="superadmin-libraries-email-error" className="text-xs text-rose-400 mt-1" role="alert">
              {translateValidationMessage(errors.email.message)}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="superadmin-libraries-phone" className="block text-xs font-semibold text-slate-300 mb-1.5">
            {t('COPY.PHONE')}
          </label>
          <input maxLength={15}
            id="superadmin-libraries-phone"
            type="tel"
            autoComplete="tel"
            className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-indigo-500/30 bg-[#131d38] text-white placeholder:text-slate-500 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 outline-none transition-all"
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? 'superadmin-libraries-phone-error' : undefined}
            {...register('phone')}
            data-testid="superadmin-libraries-libraries-superadmin-libraries-phone-6"
          />
          {errors.phone?.message && (
            <p id="superadmin-libraries-phone-error" className="text-xs text-rose-400 mt-1" role="alert">
              {translateValidationMessage(errors.phone.message)}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="superadmin-libraries-gst" className="block text-xs font-semibold text-slate-300 mb-1.5">
          {t('COPY.GST_NUMBER_SAMPLE_IDENTIFIER')}
        </label>
        <input
          id="superadmin-libraries-gst"
          className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-indigo-500/30 bg-[#131d38] text-white placeholder:text-slate-500 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 outline-none transition-all"
          aria-invalid={Boolean(errors.gstNumber)}
          aria-describedby={errors.gstNumber ? 'superadmin-libraries-gst-error' : undefined}
          {...register('gstNumber')}
          data-testid="superadmin-libraries-libraries-superadmin-libraries-gst-7"
        />
        {errors.gstNumber?.message && (
          <p id="superadmin-libraries-gst-error" className="text-xs text-rose-400 mt-1" role="alert">
            {translateValidationMessage(errors.gstNumber.message)}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <label htmlFor="superadmin-libraries-location" className="block text-xs font-semibold text-slate-300 mb-1.5">
            {t('COPY.LOCATION')}
          </label>
          <input
            id="superadmin-libraries-location"
            className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-indigo-500/30 bg-[#131d38] text-white placeholder:text-slate-500 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 outline-none transition-all"
            aria-invalid={Boolean(errors.location)}
            aria-describedby={errors.location ? 'superadmin-libraries-location-error' : undefined}
            {...register('location')}
            data-testid="superadmin-libraries-libraries-superadmin-libraries-location-8"
          />
          {errors.location?.message && (
            <p id="superadmin-libraries-location-error" className="text-xs text-rose-400 mt-1" role="alert">
              {translateValidationMessage(errors.location.message)}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="superadmin-libraries-plan" className="block text-xs font-semibold text-slate-300 mb-1.5">
            {t('COPY.SAAS_PLAN')}
          </label>
          <select
            id="superadmin-libraries-plan"
            className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-indigo-500/30 bg-[#131d38] text-white focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 outline-none cursor-pointer"
            aria-invalid={Boolean(errors.plan)}
            {...register('plan')}
            data-testid="superadmin-libraries-libraries-superadmin-libraries-plan-9"
          >
            {SUPERADMIN_LIBRARIES_PLAN_VALUES.map((plan) => (
              <option key={plan} value={plan} className="bg-slate-900 text-white">
                {plan}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-3">
        <button
          type="button"
          className="px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-700 transition-all cursor-pointer"
          onClick={onCancel}
          data-testid="superadmin-libraries-libraries-cancel-10"
        >
          {t('COPY.CANCEL')}
        </button>
        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white text-xs font-bold shadow-md shadow-emerald-950/50 cursor-pointer disabled:opacity-50 transition-all"
          disabled={isSubmitting}
          data-testid="superadmin-libraries-libraries-applying-preview-11"
        >
          {isSubmitting ? t('COPY.APPLYING_PREVIEW') : saved ? t('COPY.UPDATE_PREVIEW') : t('COPY.SAVE_PREVIEW')}
        </button>
      </div>
    </form>
  );
}
