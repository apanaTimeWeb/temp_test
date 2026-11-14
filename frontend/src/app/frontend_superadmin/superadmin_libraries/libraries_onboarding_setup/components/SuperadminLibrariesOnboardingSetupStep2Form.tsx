'use client';
/** Responsibility: Superadmin Setup Wizard Step2Form; keep this view focused on its named module UI responsibility and delegate domain/state logic to module-owned hooks. */
/** Data-Flow: user input -> feature-owned form state -> schema validation -> explicitly gated action; no server persistence is inferred without an approved API contract. */
import { useSuperadminLibrariesOnboardingSetupValidationMessage } from '@/app/frontend_superadmin/superadmin_libraries/libraries_onboarding_setup/hooks/useSuperadminLibrariesOnboardingSetupValidationMessage';
import { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { shiftsSchema } from '@/app/frontend_superadmin/superadmin_libraries/libraries_onboarding_setup/schemas/SuperadminLibrariesOnboardingSetupSchema';
import type { ShiftsData } from '@/app/frontend_superadmin/superadmin_libraries/libraries_onboarding_setup/types/SuperadminLibrariesOnboardingSetupTypes';
import { Plus, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
const inputCls = (hasErr?: boolean) => `sa-input${hasErr ? ' sa-input--error' : ''}`;

/**
 * Performs the superadmin libraries onboarding setup step2 form operation within libraries onboarding setup; inputs and outputs follow the declared TypeScript contract.
 * @param parameter Input required by the declared feature contract. Declared type: { onNext: (d: ShiftsData) => void; initialValues: ShiftsData; onDirtyChange?: (isDirty: boolean) => void; }.
 */
export default function SuperadminLibrariesOnboardingSetupStep2Form({ onNext, initialValues, onDirtyChange }: { onNext: (d: ShiftsData) => void; initialValues: ShiftsData; onDirtyChange?: (isDirty: boolean) => void }) {
  const tCopy = useTranslations('SUPERADMIN_SETUP_WIZARD');
  const translateValidationMessage = useSuperadminLibrariesOnboardingSetupValidationMessage();
  const { register, control, handleSubmit, formState: { errors , isDirty} } = useForm<ShiftsData>({
    resolver: zodResolver(shiftsSchema),
    defaultValues: initialValues,
  });
  // Effect contract: propagate the active step form dirty state to the wizard owner so protection persists across steps; dependency set [isDirty, onDirtyChange] is the deliberate re-run boundary.
  // Effect contract: propagate the current step dirty state to the wizard owner so navigation protection persists across step unmounts; dependencies track the form state and stable callback.
  useEffect(() => { onDirtyChange?.(isDirty); }, [isDirty, onDirtyChange]);
  const { fields, append, remove } = useFieldArray({ control, name: 'shifts' });

  return (
    <form id="step2-form" onSubmit={handleSubmit(onNext)} noValidate className="space-y-3" data-testid="superadmin-superadmin-setup-wizard-overview-step2-form-form-line-26">
      {fields.map((field, i) => (
        <div key={field.id} className="sa-wizard-row sa-wizard-row--shifts">
          <div className="space-y-1.5">
            <label className="sa-wizard-field-label--sm" htmlFor={`setup-shift-${i}-name`}>{tCopy("COPY.SHIFT_NAME")}</label>
            <input id={`setup-shift-${i}-name`} aria-invalid={!!errors.shifts?.[i]?.name} aria-describedby={errors.shifts?.[i]?.name ? `setup-shift-${i}-name-error` : undefined} {...register(`shifts.${i}.name`)} placeholder={tCopy("COPY.E_G_MORNING")}
              className={inputCls(!!(errors.shifts?.[i]?.name))}  data-testid={`superadmin-setup-wizard-setup-wizard-step2-form-e-g-morning-1-${String(field.id)}`}/>
            {errors.shifts?.[i]?.name && (
              <p id={`setup-shift-${i}-name-error`} className="sa-wizard-field-error">{translateValidationMessage(errors.shifts[i].name?.message)}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <label className="sa-wizard-field-label--sm" htmlFor={`setup-shift-${i}-start`}>{tCopy("COPY.START")}</label>
            <input id={`setup-shift-${i}-start`} type="time" aria-invalid={!!errors.shifts?.[i]?.start} aria-describedby={errors.shifts?.[i]?.start ? `setup-shift-${i}-start-error` : undefined} {...register(`shifts.${i}.start`)}
              className={`${inputCls(!!errors.shifts?.[i]?.start)} [color-scheme:dark]`}  data-testid={`superadmin-setup-wizard-setup-wizard-step2-form-field-2-${String(field.id)}`}/>
            {errors.shifts?.[i]?.start && <p id={`setup-shift-${i}-start-error`} className="sa-wizard-field-error">{translateValidationMessage(errors.shifts[i]?.start?.message)}</p>}
          </div>
          <div className="space-y-1.5">
            <label className="sa-wizard-field-label--sm" htmlFor={`setup-shift-${i}-end`}>{tCopy("COPY.END")}</label>
            <input id={`setup-shift-${i}-end`} type="time" {...register(`shifts.${i}.end`)}
              className={`${inputCls(!!errors.shifts?.[i]?.end)} [color-scheme:dark]`} aria-invalid={!!errors.shifts?.[i]?.end} aria-describedby={errors.shifts?.[i]?.end ? `setup-shift-${i}-end-error` : undefined}  data-testid={`superadmin-setup-wizard-setup-wizard-step2-form-field-3-${String(field.id)}`}/>
            {errors.shifts?.[i]?.end && <p id={`setup-shift-${i}-end-error`} className="sa-wizard-field-error">{translateValidationMessage(errors.shifts[i]?.end?.message)}</p>}
          </div>
          <button
            type="button"
            onClick={() => remove(i)}
            disabled={fields.length <= 1}
            className="sa-wizard-remove-btn"
            aria-label={tCopy("COPY.REMOVE_SHIFT_NUMBER_ARIA_LABEL", { index: i + 1 })}
           data-testid={`superadmin-setup-wizard-setup-wizard-step2-form-remove-shift-number-aria-label-4-${String(field.id)}`}>
            <Trash2 size={14} />
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={() => append({ name: '', start: '06:00', end: '12:00' })}
        className="sa-btn-dashed"
       data-testid="superadmin-setup-wizard-setup-wizard-step2-form-add-another-shift-5">
        <Plus size={15} /> {tCopy("COPY.ADD_ANOTHER_SHIFT")}
      </button>
    </form>
  );
}
