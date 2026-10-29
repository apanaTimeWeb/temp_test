// RESPONSIBILITY: Render the shifts migration stepper component within the components feature. It does not own backend persistence or cross-feature business logic.
import { useTranslations } from 'next-intl';
import { CheckCircle } from 'lucide-react';
import type { ManagerShiftsMigrationStepperProps } from '@/app/frontend_manager/manager_seats_shifts_lockers/shifts_migration/types/ManagerShiftsMigrationTypes';

export function ManagerShiftsMigrationStepper({ step }: ManagerShiftsMigrationStepperProps) {
  const tManagerUi = useTranslations('manager.manager_shift_migration.ui');
  const steps = [
    { n: 1, label: tManagerUi('migration_step_select_student') },
    { n: 2, label: tManagerUi('migration_step_choose_new_slot') },
    { n: 3, label: tManagerUi('migration_step_review_payment_unavailable') },
  ];
  return (
<div className="ss-stepper">
          <div className="ss-stepper__track" />
          <div className={`ss-stepper__progress ss-progress-w-${(step - 1) * 50}`} />
          <div className="ss-stepper__steps">
            {steps.map(s => (
              <div key={s.n} className="ss-stepper__step">
                <div className={`ss-stepper__circle ${step >= s.n ? 'ss-stepper__circle--active' : 'ss-stepper__circle--inactive'}`}>
                  {step > s.n ? <CheckCircle size={18} /> : s.n}
                </div>
                <span className={`ss-stepper__label ${step >= s.n ? 'ss-stepper__label--active' : 'ss-stepper__label--inactive'}`}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
  );
}
