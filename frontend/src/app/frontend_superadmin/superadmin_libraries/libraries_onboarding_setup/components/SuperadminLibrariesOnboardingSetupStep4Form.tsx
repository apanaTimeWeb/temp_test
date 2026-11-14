'use client';
/** Responsibility: Superadmin Setup Wizard Step4Form; keep this view focused on its named module UI responsibility and delegate domain/state logic to module-owned hooks. */
/** Data-Flow: user input -> feature-owned form state -> schema validation -> explicitly gated action; no server persistence is inferred without an approved API contract. */
import { useSuperadminLibrariesOnboardingSetupValidationMessage } from '@/app/frontend_superadmin/superadmin_libraries/libraries_onboarding_setup/hooks/useSuperadminLibrariesOnboardingSetupValidationMessage';
import { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { plansSchema } from '@/app/frontend_superadmin/superadmin_libraries/libraries_onboarding_setup/schemas/SuperadminLibrariesOnboardingSetupSchema';
import type { PlansData } from '@/app/frontend_superadmin/superadmin_libraries/libraries_onboarding_setup/types/SuperadminLibrariesOnboardingSetupTypes';
import { Plus, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
const inputCls = (hasErr?: boolean) => `sa-input${hasErr ? ' sa-input--error' : ''}`;

/**
 * Performs the superadmin libraries onboarding setup step4 form operation within libraries onboarding setup; inputs and outputs follow the declared TypeScript contract.
 * @param parameter Input required by the declared feature contract. Declared type: { onNext: (d: PlansData) => void; initialValues: PlansData; onDirtyChange?: (isDirty: boolean) => void; }.
 */
export default function SuperadminLibrariesOnboardingSetupStep4Form({ onNext, initialValues, onDirtyChange }: { onNext: (d: PlansData) => void; initialValues: PlansData; onDirtyChange?: (isDirty: boolean) => void }) {
  const tCopy = useTranslations('SUPERADMIN_SETUP_WIZARD');
  const translateValidationMessage = useSuperadminLibrariesOnboardingSetupValidationMessage();
  const { register, control, handleSubmit, formState: { errors , isDirty} } = useForm<PlansData>({
    resolver: zodResolver(plansSchema),
    defaultValues: initialValues,
  });
  // Effect contract: propagate the active step form dirty state to the wizard owner so protection persists across steps; dependency set [isDirty, onDirtyChange] is the deliberate re-run boundary.
  // Effect contract: propagate the current step dirty state to the wizard owner so navigation protection persists across step unmounts; dependencies track the form state and stable callback.
  useEffect(() => { onDirtyChange?.(isDirty); }, [isDirty, onDirtyChange]);
  const { fields, append, remove } = useFieldArray({ control, name: 'plans' });

  return (
    <form id="step4-form" onSubmit={handleSubmit(onNext)} noValidate className="space-y-3" data-testid="superadmin-superadmin-setup-wizard-overview-step4-form-form-line-26">
      {fields.map((field, i) => (
        <div key={field.id} className="sa-wizard-row sa-wizard-row--plans">
          <div className="space-y-1.5">
            <label className="sa-wizard-field-label--sm" htmlFor={`setup-plan-${i}-name`}>
              {tCopy("COPY.PLAN_NAME")} <span className="sa-wizard-field-required">*</span>
            </label>
            <input id={`setup-plan-${i}-name`} aria-invalid={!!errors.plans?.[i]?.name} aria-describedby={errors.plans?.[i]?.name ? `setup-plan-${i}-name-error` : undefined} {...register(`plans.${i}.name`)} placeholder={tCopy("COPY.E_G_MONTHLY")}
              className={inputCls(!!(errors.plans?.[i]?.name))}  data-testid={`superadmin-setup-wizard-setup-wizard-step4-form-e-g-monthly-1-${String(field.id)}`}/>
            {errors.plans?.[i]?.name && <p id={`setup-plan-${i}-name-error`} className="sa-wizard-field-error">{translateValidationMessage(errors.plans[i]?.name?.message)}</p>}
          </div>
          <div className="space-y-1.5">
            <label className="sa-wizard-field-label--sm" htmlFor={`setup-plan-${i}-days`}>{tCopy("COPY.DAYS")}</label>
            <input id={`setup-plan-${i}-days`} type="number" min={1} step={1} inputMode="numeric"
              aria-invalid={!!errors.plans?.[i]?.days} aria-describedby={errors.plans?.[i]?.days ? `setup-plan-${i}-days-error` : undefined} {...register(`plans.${i}.days`, { valueAsNumber: true })}
              className={inputCls(!!errors.plans?.[i]?.days)}  data-testid={`superadmin-setup-wizard-setup-wizard-step4-form-field-2-${String(field.id)}`}/>
            {errors.plans?.[i]?.days && <p id={`setup-plan-${i}-days-error`} className="sa-wizard-field-error">{translateValidationMessage(errors.plans[i]?.days?.message)}</p>}
          </div>
          <div className="space-y-1.5">
            <label className="sa-wizard-field-label--sm" htmlFor={`setup-plan-${i}-price`}>{tCopy("COPY.PRICE")}</label>
            <input id={`setup-plan-${i}-price`} type="number" min={0} step="0.01" inputMode="decimal"
              aria-invalid={!!errors.plans?.[i]?.price} aria-describedby={errors.plans?.[i]?.price ? `setup-plan-${i}-price-error` : undefined} {...register(`plans.${i}.price`, { valueAsNumber: true })}
              placeholder="1000"
              className={inputCls(!!errors.plans?.[i]?.price)}  data-testid={`superadmin-setup-wizard-setup-wizard-step4-form-field-1000-3-${String(field.id)}`}/>
            {errors.plans?.[i]?.price && <p id={`setup-plan-${i}-price-error`} className="sa-wizard-field-error">{translateValidationMessage(errors.plans[i]?.price?.message)}</p>}
          </div>
          <button
            type="button"
            onClick={() => remove(i)}
            disabled={fields.length <= 1}
            className="sa-wizard-remove-btn"
            aria-label={tCopy("COPY.REMOVE_PLAN_NUMBER_ARIA_LABEL", { index: i + 1 })}
           data-testid={`superadmin-setup-wizard-setup-wizard-step4-form-remove-plan-number-aria-label-4-${String(field.id)}`}>
            <Trash2 size={14} />
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={() => append({ name: '', days: 30, price: 0 })}
        className="sa-btn-dashed"
       data-testid="superadmin-setup-wizard-setup-wizard-step4-form-add-another-plan-5">
        <Plus size={15} /> {tCopy("COPY.ADD_ANOTHER_PLAN")}
      </button>
    </form>
  );
}
