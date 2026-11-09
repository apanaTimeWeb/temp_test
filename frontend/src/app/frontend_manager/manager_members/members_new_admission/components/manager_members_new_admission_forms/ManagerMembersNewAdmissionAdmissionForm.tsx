'use client';
// RESPONSIBILITY: Render the members new admission admission form component with dynamic shift & tenure pricing.
import { useTranslations } from 'next-intl';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { ManagerMembersNewAdmissionAdmissionEnrollmentSection } from '@/app/frontend_manager/manager_members/members_new_admission/components/manager_members_new_admission_sections/ManagerMembersNewAdmissionAdmissionEnrollmentSection';
import { ManagerMembersNewAdmissionAdmissionDocumentSection } from '@/app/frontend_manager/manager_members/members_new_admission/components/manager_members_new_admission_sections/ManagerMembersNewAdmissionAdmissionDocumentSection';
import { ManagerMembersNewAdmissionAdmissionPaymentSection } from '@/app/frontend_manager/manager_members/members_new_admission/components/manager_members_new_admission_sections/ManagerMembersNewAdmissionAdmissionPaymentSection';
import { ManagerMembersNewAdmissionAdmissionPersonalSection } from '@/app/frontend_manager/manager_members/members_new_admission/components/manager_members_new_admission_sections/ManagerMembersNewAdmissionAdmissionPersonalSection';
import { ManagerMembersNewAdmissionAdmissionSummary } from '@/app/frontend_manager/manager_members/members_new_admission/components/manager_members_new_admission_sections/ManagerMembersNewAdmissionAdmissionSummary';
import { ManagerMembersNewAdmissionSuccessBanner, type AdmittedStudentInfo } from '@/app/frontend_manager/manager_members/members_new_admission/components/manager_members_new_admission_sections/ManagerMembersNewAdmissionSuccessBanner';
import { useManagerNewAdmissionAdmission } from '@/app/frontend_manager/manager_members/members_new_admission/hooks/useManagerMembersNewAdmissionAdmission';
import { useManagerMembersNewAdmissionConfirm } from '@/app/frontend_manager/manager_members/members_new_admission/hooks/useManagerMembersNewAdmissionConfirm';
import { useManagerMembersNewAdmissionUnsavedChangesGuard } from '@/app/frontend_manager/manager_members/members_new_admission/hooks/useManagerMembersNewAdmissionUnsavedChangesGuard';
import { MANAGER_MEMBERS_NEW_ADMISSION_ROUTES } from '@/app/frontend_manager/manager_members/members_new_admission/config/manager_members_new_admission.url_config';
import { getLibraryPricingConfig, calculateAdmissionFee, type LibraryPricingConfig } from '@/lib/pricing/libraryPricingEngine';
import type { DynamicPlanOption } from '@/app/frontend_manager/manager_members/members_new_admission/types/ManagerMembersNewAdmissionComponentTypes';

export default function ManagerMembersNewAdmissionAdmissionForm() {
  const tManagerUi = useTranslations('manager.manager_new_admission.ui');
  const { confirm, dialog: unsavedConfirmDialog } = useManagerMembersNewAdmissionConfirm();
  const { form } = useManagerNewAdmissionAdmission();
  const [draftFeedback, setDraftFeedback] = useState<string | null>(null);
  const [admittedStudent, setAdmittedStudent] = useState<AdmittedStudentInfo | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pricingConfig, setPricingConfig] = useState<LibraryPricingConfig>(() => getLibraryPricingConfig());
  const { register, watch, setValue, reset, formState: { errors, isDirty, isValid } } = form;
  const router = useRouter();
  useManagerMembersNewAdmissionUnsavedChangesGuard({ isDirty, confirm, router, tManagerUi, replayAnchorOnConfirm: true });

  useEffect(() => {
    const handlePriceUpdate = () => setPricingConfig(getLibraryPricingConfig());
    window.addEventListener('library_pricing_updated', handlePriceUpdate);
    return () => window.removeEventListener('library_pricing_updated', handlePriceUpdate);
  }, []);

  const watchedPlan = watch('plan');
  const watchedShift = watch('shift');
  const watchedSeat = watch('seat');
  const watchedFloor = watch('floor');
  const watchedLocker = watch('locker');
  const watchedAmountPaid = watch('amountPaid');
  const watchedDiscount = watch('manualDiscount');

  const selectedShifts = useMemo(() => {
    if (!watchedShift) return [];
    if (watchedShift.includes('+')) {
      return watchedShift.split('+').map(s => s.trim().replace(/\(.*\)/, '').trim());
    }
    return [watchedShift.replace(/\(.*\)/, '').trim()].filter(Boolean);
  }, [watchedShift]);

  const handleToggleShift = (shiftId: string) => {
    let nextShifts: string[];
    if (shiftId === 'Full Day') {
      nextShifts = selectedShifts.includes('Full Day') ? [] : ['Full Day'];
    } else {
      const filtered = selectedShifts.filter((s) => s !== 'Full Day');
      if (filtered.includes(shiftId)) {
        nextShifts = filtered.filter((s) => s !== shiftId);
      } else {
        nextShifts = [...filtered, shiftId];
      }
    }
    const consolidated =
      nextShifts.length === 0
        ? ''
        : nextShifts.length === 1
          ? nextShifts[0]
          : `${nextShifts.join(' + ')} (Multi-Shift)`;

    setValue('shift', consolidated, { shouldValidate: true, shouldDirty: true });
  };

  // Compute dynamic plan options based on chosen shifts
  const planOptions: DynamicPlanOption[] = useMemo(() => {
    const activeShifts = selectedShifts.length > 0 ? selectedShifts : ['Morning'];
    return pricingConfig.durationTiers.map((tier) => {
      const calc = calculateAdmissionFee(
        {
          selectedShifts: activeShifts,
          planDurationKey: tier.id,
          floor: watchedFloor,
          hasLocker: Boolean(watchedLocker),
          manualDiscount: 0,
        },
        pricingConfig
      );
      const savings = calc.tenureDiscountAmount > 0
        ? `Save ₹${calc.tenureDiscountAmount.toLocaleString('en-IN')} • ${tier.discountPercent}% Off`
        : undefined;
      return {
        id: tier.id,
        label: tier.name,
        months: tier.months,
        totalAmount: calc.finalPayable,
        savingsText: savings,
      };
    });
  }, [pricingConfig, selectedShifts, watchedFloor, watchedLocker]);

  // Compute active calculation for the current form state
  const calcResult = useMemo(() => {
    return calculateAdmissionFee(
      {
        selectedShifts,
        planDurationKey: watchedPlan || '1_month',
        floor: watchedFloor,
        hasLocker: Boolean(watchedLocker),
        manualDiscount: Number(watchedDiscount) || 0,
      },
      pricingConfig
    );
  }, [selectedShifts, watchedPlan, watchedFloor, watchedLocker, watchedDiscount, pricingConfig]);

  // Sync default plan and auto-fill amountPaid
  useEffect(() => {
    if (!watchedPlan && planOptions.length > 0) {
      const firstOption = planOptions[0];
      if (firstOption) {
        setValue('plan', firstOption.label, { shouldDirty: false });
      }
    }
  }, [watchedPlan, planOptions, setValue]);

  useEffect(() => {
    if (calcResult.finalPayable > 0) {
      setValue('amountPaid', String(calcResult.finalPayable), { shouldValidate: true });
    }
  }, [calcResult.finalPayable, setValue]);

  const baseAmountMinor = calcResult.grossTenureFee * 100;
  const discountMinor = (calcResult.tenureDiscountAmount + calcResult.manualDiscountAmount) * 100;
  const totalPayableMinor = calcResult.finalPayable * 100;
  const amountPaidMinor = (Number(watchedAmountPaid) || calcResult.finalPayable) * 100;

  const handleResetAdmission = () => {
    reset();
    setAdmittedStudent(null);
    setDraftFeedback(null);
  };

  const submit = form.handleSubmit((values) => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      // BUG-02: Structured, collision-free Smart ID format
      const generatedSmartId = `LIB-${Date.now().toString().slice(-4)}`;
      const studentData: AdmittedStudentInfo = {
        fullName: values.fullName,
        phone: values.phone,
        smartId: generatedSmartId,
        seat: values.seat || 'General Study',
        shift: values.shift,
        plan: values.plan,
        paymentMode: values.paymentMode,
        amountPaid: values.amountPaid,
      };

      // Real local persistence across session
      try {
        const stored = JSON.parse(localStorage.getItem('manager_admitted_students') || '[]');
        localStorage.setItem('manager_admitted_students', JSON.stringify([studentData, ...stored]));
        sessionStorage.setItem(`admission_student_${generatedSmartId}`, JSON.stringify(studentData));
        window.dispatchEvent(new CustomEvent('manager_member_admitted', { detail: studentData }));

        // Automatically record verified referral when newly admitted student declares a referrer
        const refBy = values.referredBy?.trim();
        if (refBy && refBy !== 'Direct Walk-in' && !refBy.toLowerCase().startsWith('direct walk-in')) {
          const storedReferrals = JSON.parse(localStorage.getItem('manager_members_referral_records') || '[]');
          const newRef = {
            id: `REF-${Date.now().toString().slice(-4)}`,
            referrer: refBy,
            referred: `${values.fullName} (${generatedSmartId})`,
            date: new Date().toISOString().slice(0, 10),
            status: 'Pending',
            bonus: '₹500',
            method: 'Fee Discount',
          };
          localStorage.setItem('manager_members_referral_records', JSON.stringify([newRef, ...storedReferrals]));
          window.dispatchEvent(new CustomEvent('manager_referral_created', { detail: newRef }));
        }
      } catch {
        // Storage unavailable fallback
      }

      setAdmittedStudent(studentData);
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
            {admittedStudent && (
              <ManagerMembersNewAdmissionSuccessBanner
                student={admittedStudent}
                onReset={handleResetAdmission}
              />
            )}
            <p className="mt-3 rounded-lg border border-warning bg-warning-bg p-3 text-sm text-warning" role="status" data-testid="manager-students-admission-contract-warning">{tManagerUi('admission_unavailable_host_contract_not_supplied')}</p>
            {draftFeedback && <p className="mt-3 rounded-lg border border-warning bg-warning-bg p-3 text-sm text-warning" role="status" aria-live="polite" data-testid="manager-students-admission-draft-feedback">{draftFeedback}</p>}
          </div>
          <div className="mgr-smartid-badge"><span className="mgr-smartid-label">{tManagerUi('smart_id')}</span><span className="mgr-smartid-value">{tManagerUi('lib_new')}</span><span className="mgr-badge mgr-badge--info">{tManagerUi('smart_id_preview_only')}</span></div>
        </div>

        <form onSubmit={submit} noValidate>
          <div className="mgr-admission-layout">
            <div className="mgr-admission-main">
              <ManagerMembersNewAdmissionAdmissionPersonalSection
                register={register}
                errors={errors}
                setValue={setValue}
                watch={watch}
              />
              <ManagerMembersNewAdmissionAdmissionEnrollmentSection
                register={register}
                errors={errors}
                setValue={setValue}
                watch={watch}
                selectedShifts={selectedShifts}
                onToggleShift={handleToggleShift}
                watchedShift={watchedShift}
              />
              {/* BUG-14: Pass setValue and watch for RHF KYC document integration */}
              <ManagerMembersNewAdmissionAdmissionDocumentSection
                setValue={setValue}
                watch={watch}
              />
              <ManagerMembersNewAdmissionAdmissionPaymentSection
                register={register}
                errors={errors}
                setValue={setValue}
                watch={watch}
                planOptions={planOptions}
                effectiveMonthlyRate={calcResult.effectiveMonthlyShiftFee}
              />
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
              pricingAvailable={Boolean(calcResult.finalPayable !== undefined && calcResult.grossTenureFee >= 0)}
              isSubmitting={isSubmitting}
              canSubmit={isValid && !isSubmitting}
              hasUnsavedChanges={isDirty}
              breakdown={calcResult.breakdown}
            />
          </div>
        </form>
      </div>
    </>
  );
}
