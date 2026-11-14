'use client';
/** Responsibility: Superadmin Setup Wizard Step3Form; keep this view focused on its named module UI responsibility and delegate domain/state logic to module-owned hooks. */
/** Data-Flow: user input -> feature-owned form state -> schema validation -> explicitly gated action; no server persistence is inferred without an approved API contract. */
import { useSuperadminLibrariesOnboardingSetupValidationMessage } from '@/app/frontend_superadmin/superadmin_libraries/libraries_onboarding_setup/hooks/useSuperadminLibrariesOnboardingSetupValidationMessage';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { seatsSchema } from '@/app/frontend_superadmin/superadmin_libraries/libraries_onboarding_setup/schemas/SuperadminLibrariesOnboardingSetupSchema';
import type { SeatsData } from '@/app/frontend_superadmin/superadmin_libraries/libraries_onboarding_setup/types/SuperadminLibrariesOnboardingSetupTypes';
import { useTranslations } from 'next-intl';
const inputCls = (hasErr?: boolean) => `sa-input${hasErr ? ' sa-input--error' : ''}`;

/**
 * Performs the superadmin libraries onboarding setup step3 form operation within libraries onboarding setup; inputs and outputs follow the declared TypeScript contract.
 * @param parameter Input required by the declared feature contract. Declared type: { onNext: (d: SeatsData) => void; initialValues: SeatsData; onDirtyChange?: (isDirty: boolean) => void; }.
 */
export default function SuperadminLibrariesOnboardingSetupStep3Form({ onNext, initialValues, onDirtyChange }: { onNext: (d: SeatsData) => void; initialValues: SeatsData; onDirtyChange?: (isDirty: boolean) => void }) {
  const tCopy = useTranslations('SUPERADMIN_SETUP_WIZARD');
  const translateValidationMessage = useSuperadminLibrariesOnboardingSetupValidationMessage();
  const { register, handleSubmit, watch, formState: { errors , isDirty} } = useForm<SeatsData>({
    resolver: zodResolver(seatsSchema),
    defaultValues: initialValues,
  });
  // Effect contract: propagate the active step form dirty state to the wizard owner so protection persists across steps; dependency set [isDirty, onDirtyChange] is the deliberate re-run boundary.
  // Effect contract: propagate the current step dirty state to the wizard owner so navigation protection persists across step unmounts; dependencies track the form state and stable callback.
  useEffect(() => { onDirtyChange?.(isDirty); }, [isDirty, onDirtyChange]);
  const count  = watch('count')  || 0;
  const prefix = watch('prefix') || '';

  const preview =
    Array.from({ length: Math.min(count, 5) }, (_, i) =>
      `${prefix}${String(i + 1).padStart(2, '0')}`
    ).join(', ') + (count > 5 ? ` ... ${prefix}${String(count).padStart(2, '0')}` : '');

  const seatCellClass = (i: number) => {
    if (i === 0) return 'sa-wizard-seat-cell sa-wizard-seat-cell--occupied';
    if (i === 1) return 'sa-wizard-seat-cell sa-wizard-seat-cell--expiring';
    return 'sa-wizard-seat-cell sa-wizard-seat-cell--free';
  };

  return (
    <form id="step3-form" onSubmit={handleSubmit(onNext)} noValidate className="space-y-5" data-testid="superadmin-superadmin-setup-wizard-overview-step3-form-form-line-37">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="sa-wizard-field-label" htmlFor="superadmin-superadminsetupwizardstep3form-33-input">
            {tCopy("COPY.TOTAL_SEATS")} <span className="sa-wizard-field-required">*</span>
          </label>
          <input id="superadmin-superadminsetupwizardstep3form-33-input" type="number" min={1} max={9999} step={1} inputMode="numeric"
            {...register('count', { valueAsNumber: true })} aria-invalid={Boolean(errors.count)} aria-describedby={errors.count ? 'step3-count-error' : undefined}
            className={inputCls(!!errors.count)}  data-testid="superadmin-setup-wizard-setup-wizard-step3-form-superadmin-superadminsetupwizardstep3form-33-input-1"/>
          {errors.count && <p id="step3-count-error" role="alert" className="sa-wizard-field-error">{translateValidationMessage(errors.count.message)}</p>}
        </div>
        <div className="space-y-1.5">
          <label className="sa-wizard-field-label" htmlFor="superadmin-superadminsetupwizardstep3form-42-input">
            {tCopy("COPY.SEAT_PREFIX")} <span className="sa-wizard-field-optional">{tCopy("COPY.MAX_3")}</span>
          </label>
          <input id="superadmin-superadminsetupwizardstep3form-42-input" maxLength={3} {...register('prefix')} aria-invalid={Boolean(errors.prefix)} aria-describedby={errors.prefix ? 'step3-prefix-error' : undefined} placeholder={tCopy("COPY.E_G_SL")}
            className={inputCls(!!errors.prefix)}  data-testid="superadmin-setup-wizard-setup-wizard-step3-form-superadmin-superadminsetupwizardstep3form-42-input-2"/>
          {errors.prefix && <p id="step3-prefix-error" role="alert" className="sa-wizard-field-error">{translateValidationMessage(errors.prefix.message)}</p>}
        </div>
      </div>

      <div className="sa-wizard-preview-card">
        <p className="sa-wizard-preview-label">{tCopy("COPY.SEATS_WILL_BE_GENERATED_AS")}</p>
        <p className="sa-wizard-seat-preview-text">
          {prefix ? preview : tCopy('COPY.ENTER_PREFIX_TO_PREVIEW')}
        </p>
        <p className="sa-wizard-seat-preview-sub">
          {tCopy('COPY.SEAT_COUNT', { count })} {tCopy("COPY.TOTAL")}
        </p>
      </div>

      <div>
        <p className="sa-wizard-seat-grid-label">{tCopy("COPY.SAMPLE_GRID_PREVIEW")}</p>
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: Math.min(count, 20) }, (_, i) => {
            const seatNumber = i + 1;
            const seatLabel = `${prefix}${String(seatNumber).padStart(2, '0')}`;
            return (
            <div key={seatLabel} className={seatCellClass(i)}>
              {seatLabel}
            </div>
            );
          })}
          {count > 20 && (
            <div className="sa-wizard-seat-cell sa-wizard-seat-cell--more">
              +{count - 20}
            </div>
          )}
        </div>
      </div>
    </form>
  );
}
