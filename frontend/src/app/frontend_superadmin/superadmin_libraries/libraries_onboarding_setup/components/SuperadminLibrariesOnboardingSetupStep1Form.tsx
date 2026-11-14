'use client';
/** Responsibility: Superadmin Setup Wizard Step1Form; keep this view focused on its named module UI responsibility and delegate domain/state logic to module-owned hooks. */
/** Data-Flow: user input -> feature-owned form state -> schema validation -> explicitly gated action; no server persistence is inferred without an approved API contract. */
import { useSuperadminLibrariesOnboardingSetupValidationMessage } from '@/app/frontend_superadmin/superadmin_libraries/libraries_onboarding_setup/hooks/useSuperadminLibrariesOnboardingSetupValidationMessage';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { branchDetailsSchema } from '@/app/frontend_superadmin/superadmin_libraries/libraries_onboarding_setup/schemas/SuperadminLibrariesOnboardingSetupSchema';
import type { BranchDetailsData } from '@/app/frontend_superadmin/superadmin_libraries/libraries_onboarding_setup/types/SuperadminLibrariesOnboardingSetupTypes';
import { useTranslations } from 'next-intl';
const inputCls = (hasErr?: boolean) => `sa-input${hasErr ? ' sa-input--error' : ''}`;

/**
 * Performs the superadmin libraries onboarding setup step1 form operation within libraries onboarding setup; inputs and outputs follow the declared TypeScript contract.
 * @param parameter Input required by the declared feature contract. Declared type: { onNext: (d: BranchDetailsData) => void; initialValues: BranchDetailsData; onDirtyChange?: (isDirty: boolean) => void; }.
 */
export default function SuperadminLibrariesOnboardingSetupStep1Form({ onNext, initialValues, onDirtyChange }: { onNext: (d: BranchDetailsData) => void; initialValues: BranchDetailsData; onDirtyChange?: (isDirty: boolean) => void }) {
  const tCopy = useTranslations('SUPERADMIN_SETUP_WIZARD');
  const translateValidationMessage = useSuperadminLibrariesOnboardingSetupValidationMessage();
  const { register, handleSubmit, formState: { errors , isDirty} } = useForm<BranchDetailsData>({
    resolver: zodResolver(branchDetailsSchema),
    defaultValues: initialValues,
  });
  // Effect contract: propagate the active step form dirty state to the wizard owner so protection persists across steps; dependency set [isDirty, onDirtyChange] is the deliberate re-run boundary.
  // Effect contract: propagate the current step dirty state to the wizard owner so navigation protection persists across step unmounts; dependencies track the form state and stable callback.
  useEffect(() => { onDirtyChange?.(isDirty); }, [isDirty, onDirtyChange]);
  return (
    <form id="step1-form" onSubmit={handleSubmit(onNext)} noValidate className="space-y-4" data-testid="superadmin-superadmin-setup-wizard-overview-step1-form-form-line-23">
      <div className="space-y-1.5">
        <label className="sa-wizard-field-label" htmlFor="superadmin-superadminsetupwizardstep1form-18-input">
          {tCopy("COPY.LIBRARY_NAME")} <span className="sa-wizard-field-required">*</span>
        </label>
        <input id="superadmin-superadminsetupwizardstep1form-18-input" {...register('name')} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'step1-name-error' : undefined} placeholder={tCopy("COPY.E_G_CITY_READING_HUB")} className={inputCls(!!errors.name)}  data-testid="superadmin-setup-wizard-setup-wizard-step1-form-superadmin-superadminsetupwizardstep1form-18-input-1"/>
        {errors.name && <p id="step1-name-error" role="alert" className="sa-wizard-field-error">{translateValidationMessage(errors.name.message)}</p>}
      </div>

      <div className="space-y-1.5">
        <label className="sa-wizard-field-label" htmlFor="superadmin-superadminsetupwizardstep1form-26-textarea">
          {tCopy("COPY.ADDRESS")} <span className="sa-wizard-field-required">*</span>
        </label>
        <textarea id="superadmin-superadminsetupwizardstep1form-26-textarea" {...register('address')} rows={3} aria-invalid={Boolean(errors.address)} aria-describedby={errors.address ? 'step1-address-error' : undefined} placeholder={tCopy("COPY.FULL_ADDRESS")}
          className={`${inputCls(!!errors.address)} resize-none`}  data-testid="superadmin-setup-wizard-setup-wizard-step1-form-superadmin-superadminsetupwizardstep1form-26-textarea-2"/>
        {errors.address && <p id="step1-address-error" role="alert" className="sa-wizard-field-error">{translateValidationMessage(errors.address.message)}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="sa-wizard-field-label" htmlFor="superadmin-superadminsetupwizardstep1form-36-input">
            {tCopy("COPY.CITY")} <span className="sa-wizard-field-required">*</span>
          </label>
          <input id="superadmin-superadminsetupwizardstep1form-36-input" {...register('city')} aria-invalid={Boolean(errors.city)} aria-describedby={errors.city ? 'step1-city-error' : undefined} placeholder={tCopy("COPY.CITY")} className={inputCls(!!errors.city)}  data-testid="superadmin-setup-wizard-setup-wizard-step1-form-superadmin-superadminsetupwizardstep1form-36-input-3"/>
          {errors.city && <p id="step1-city-error" role="alert" className="sa-wizard-field-error">{translateValidationMessage(errors.city.message)}</p>}
        </div>
        <div className="space-y-1.5">
          <label className="sa-wizard-field-label" htmlFor="superadmin-superadminsetupwizardstep1form-43-input">
            {tCopy("COPY.GST_NUMBER")} <span className="sa-wizard-field-optional">{tCopy("COPY.OPTIONAL")}</span>
          </label>
          <input id="superadmin-superadminsetupwizardstep1form-43-input" {...register('gst')} placeholder={tCopy("COPY.TEXT_22AAAAA0000A1Z5")} className={inputCls()}  data-testid="superadmin-setup-wizard-setup-wizard-step1-form-superadmin-superadminsetupwizardstep1form-43-input-4"/>
        </div>
      </div>
    </form>
  );
}
