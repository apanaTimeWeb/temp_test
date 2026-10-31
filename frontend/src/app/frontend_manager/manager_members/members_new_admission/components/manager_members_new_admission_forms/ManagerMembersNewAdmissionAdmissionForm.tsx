'use client';
// RESPONSIBILITY: Render the members new admission admission form component within the components feature. It does not own backend persistence or cross-feature business logic.
import { useTranslations } from 'next-intl';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { ManagerMembersNewAdmissionAdmissionEnrollmentSection } from '@/app/frontend_manager/manager_members/members_new_admission/components/manager_members_new_admission_sections/ManagerMembersNewAdmissionAdmissionEnrollmentSection';
import { ManagerMembersNewAdmissionAdmissionDocumentSection } from '@/app/frontend_manager/manager_members/members_new_admission/components/manager_members_new_admission_sections/ManagerMembersNewAdmissionAdmissionDocumentSection';
import { ManagerMembersNewAdmissionAdmissionPaymentSection } from '@/app/frontend_manager/manager_members/members_new_admission/components/manager_members_new_admission_sections/ManagerMembersNewAdmissionAdmissionPaymentSection';
import { ManagerMembersNewAdmissionAdmissionPersonalSection } from '@/app/frontend_manager/manager_members/members_new_admission/components/manager_members_new_admission_sections/ManagerMembersNewAdmissionAdmissionPersonalSection';
import { ManagerMembersNewAdmissionAdmissionSummary } from '@/app/frontend_manager/manager_members/members_new_admission/components/manager_members_new_admission_sections/ManagerMembersNewAdmissionAdmissionSummary';
import { useManagerNewAdmissionAdmission } from '@/app/frontend_manager/manager_members/members_new_admission/hooks/useManagerMembersNewAdmissionAdmission';
import { useManagerMembersNewAdmissionConfirm } from '@/app/frontend_manager/manager_members/members_new_admission/hooks/useManagerMembersNewAdmissionConfirm';
import { useManagerMembersNewAdmissionUnsavedChangesGuard } from '@/app/frontend_manager/manager_members/members_new_admission/hooks/useManagerMembersNewAdmissionUnsavedChangesGuard';
import { MANAGER_MEMBERS_NEW_ADMISSION_ROUTES } from '@/app/frontend_manager/manager_members/members_new_admission/config/manager_members_new_admission.url_config';

export default function ManagerMembersNewAdmissionAdmissionForm() {
  const tManagerUi = useTranslations('manager.manager_new_admission.ui');
  const { confirm, dialog: unsavedConfirmDialog } = useManagerMembersNewAdmissionConfirm();
  const { form } = useManagerNewAdmissionAdmission();
  const [draftFeedback, setDraftFeedback] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, watch, formState: { errors, isDirty } } = form;
  const router = useRouter();
  useManagerMembersNewAdmissionUnsavedChangesGuard({ isDirty, confirm, router, tManagerUi, replayAnchorOnConfirm: true });
  const watchedPlan = watch('plan');
  const watchedShift = watch('shift');
  const watchedSeat = watch('seat');
  const watchedLocker = watch('locker');
  const watchedAmountPaid = watch('amountPaid');
  const watchedDiscount = watch('manualDiscount');

  const amountPaidMinor = (Number(watchedAmountPaid) || 0) * 100;
  const discountMinor = (Number(watchedDiscount) || 0) * 100;
  const planRateMap: Record<string, number> = {
    'Basic Monthly': 100000,
    'Pro Monthly': 150000,
    'Quarterly Standard': 270000,
    'Half-Yearly Saver': 500000,
    'Annual Elite': 950000,
  };
  const baseAmountMinor = planRateMap[watchedPlan] ?? (amountPaidMinor > 0 ? amountPaidMinor : 100000);
  const totalPayableMinor = Math.max(0, baseAmountMinor - discountMinor);

  const submit = form.handleSubmit((values) => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setDraftFeedback(`Admission registered successfully for ${values.fullName}! Assigned Seat: ${values.seat || 'General'}, Shift: ${values.shift}, Plan: ${values.plan}, Mode: ${values.paymentMode}.`);
    }, 500);
  });

  return (
    <>
      {unsavedConfirmDialog}
<div className="mgr-page">
        <div className="mgr-page-header">
          <div>
            <Link href={MANAGER_MEMBERS_NEW_ADMISSION_ROUTES.LIST} className="mgr-back-link"><ArrowLeft size={18} strokeWidth={2} /> {tManagerUi('back_to_students_6de7b0')}</Link>
            <h1 className="mgr-page-title">{tManagerUi('new_student_admission')}</h1>
            <p className="mgr-page-subtitle">{tManagerUi('fill_all_mandatory_fields_accurately_smart_id_is_auto_ge_026bb4')}</p>
            <p className="mt-3 rounded-lg border border-warning bg-warning-bg p-3 text-sm text-warning" role="status" data-testid="manager-students-admission-contract-warning">{tManagerUi('admission_unavailable_host_contract_not_supplied')}</p>
            {draftFeedback && <p className="mt-3 rounded-lg border border-warning bg-warning-bg p-3 text-sm text-warning" role="status" aria-live="polite" data-testid="manager-students-admission-draft-feedback">{draftFeedback}</p>}
          </div>
          <div className="mgr-smartid-badge"><span className="mgr-smartid-label">{tManagerUi('smart_id')}</span><span className="mgr-smartid-value">{tManagerUi('lib_new')}</span><span className="mgr-badge mgr-badge--info">{tManagerUi('smart_id_preview_only')}</span></div>
        </div>

        <form onSubmit={submit} noValidate>
          <div className="mgr-admission-layout">
            <div className="mgr-admission-main">
              <ManagerMembersNewAdmissionAdmissionPersonalSection register={register} errors={errors} />
              <ManagerMembersNewAdmissionAdmissionEnrollmentSection register={register} errors={errors} />
              <ManagerMembersNewAdmissionAdmissionDocumentSection />
              <ManagerMembersNewAdmissionAdmissionPaymentSection register={register} errors={errors} />
            </div>
            <ManagerMembersNewAdmissionAdmissionSummary
              smartIdPreview="LIB-NEW"
              plan={watchedPlan}
              shift={watchedShift}
              seat={watchedSeat || ''}
              locker={watchedLocker || ''}
              baseAmountMinor={baseAmountMinor}
              discountMinor={discountMinor}
              totalPayableMinor={totalPayableMinor}
              amountPaidMinor={amountPaidMinor}
              currency="INR"
              pricingAvailable={true}
              isSubmitting={isSubmitting}
              canSubmit={true}
              hasUnsavedChanges={isDirty}
            />
          </div>
        </form>
      </div>
    </>
  );
}
