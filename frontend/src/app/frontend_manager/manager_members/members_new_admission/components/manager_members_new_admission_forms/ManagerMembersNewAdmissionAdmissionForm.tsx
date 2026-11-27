'use client';
// RESPONSIBILITY: Render the members new admission admission form component with dynamic shift & tenure pricing.
import { useTranslations } from 'next-intl';

import { ManagerMembersNewAdmissionPageHeader } from '@/app/frontend_manager/manager_members/members_new_admission/components/manager_members_new_admission_forms/ManagerMembersNewAdmissionPageHeader';
import { ManagerMembersNewAdmissionAdmissionDocumentSection } from '@/app/frontend_manager/manager_members/members_new_admission/components/manager_members_new_admission_sections/ManagerMembersNewAdmissionAdmissionDocumentSection';
import { ManagerMembersNewAdmissionAdmissionEnrollmentSection } from '@/app/frontend_manager/manager_members/members_new_admission/components/manager_members_new_admission_sections/ManagerMembersNewAdmissionAdmissionEnrollmentSection';
import { ManagerMembersNewAdmissionAdmissionPaymentSection } from '@/app/frontend_manager/manager_members/members_new_admission/components/manager_members_new_admission_sections/ManagerMembersNewAdmissionAdmissionPaymentSection';
import { ManagerMembersNewAdmissionAdmissionPersonalSection } from '@/app/frontend_manager/manager_members/members_new_admission/components/manager_members_new_admission_sections/ManagerMembersNewAdmissionAdmissionPersonalSection';
import { ManagerMembersNewAdmissionAdmissionSummary } from '@/app/frontend_manager/manager_members/members_new_admission/components/manager_members_new_admission_sections/ManagerMembersNewAdmissionAdmissionSummary';
import type { AdmittedStudentInfo } from '@/app/frontend_manager/manager_members/members_new_admission/components/manager_members_new_admission_sections/ManagerMembersNewAdmissionSuccessBanner';
import { useManagerNewAdmissionAdmission } from '@/app/frontend_manager/manager_members/members_new_admission/hooks/useManagerMembersNewAdmissionAdmission';
import { useManagerMembersNewAdmissionConfirm } from '@/app/frontend_manager/manager_members/members_new_admission/hooks/useManagerMembersNewAdmissionConfirm';
import { useManagerMembersNewAdmissionUnsavedChangesGuard } from '@/app/frontend_manager/manager_members/members_new_admission/hooks/useManagerMembersNewAdmissionUnsavedChangesGuard';
import { consumeEnquiryConversionPrefill, formatAdmissionInr, persistCompletedAdmission } from '@/app/frontend_manager/manager_members/members_new_admission/utils/ManagerMembersNewAdmissionStorageAndFormat';
import type { DynamicPlanOption } from '@/app/frontend_manager/manager_members/members_new_admission/types/ManagerMembersNewAdmissionComponentTypes';
import { calculateAdmissionFee, getLibraryPricingConfig, type LibraryPricingConfig } from '@/lib/pricing/libraryPricingEngine';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

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

  const [conversionOrigin, setConversionOrigin] = useState<{ enquiryId: string; name: string } | null>(null);

  useEffect(() => {
    const parsed = consumeEnquiryConversionPrefill();
    if (!parsed) return;
    if (parsed.name) setValue('fullName', parsed.name, { shouldValidate: true, shouldDirty: true });
    if (parsed.phone) setValue('phone', parsed.phone, { shouldValidate: true, shouldDirty: true });
    if (parsed.shift && parsed.shift !== 'Not specified') {
      setValue('shift', parsed.shift, { shouldValidate: true, shouldDirty: true });
    }
    if (parsed.notes) {
      setValue('remarks', `Converted from Enquiry: ${parsed.notes}`, { shouldValidate: false, shouldDirty: true });
    }
    setConversionOrigin({ enquiryId: parsed.enquiryId || 'ENQ', name: parsed.name || 'Candidate' });
  }, [setValue]);

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
  const watchedRegFee = watch('registrationFee');
  const watchedSecDeposit = watch('securityDeposit');
  const watchedPaymentType = watch('paymentType');

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
        ? `Save ${formatAdmissionInr(calc.tenureDiscountAmount)} • ${tier.discountPercent}% Off`
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
        registrationFee: Number(watchedRegFee) || 0,
        securityDeposit: Number(watchedSecDeposit) || 0,
      },
      pricingConfig
    );
  }, [
    selectedShifts,
    watchedPlan,
    watchedFloor,
    watchedLocker,
    watchedDiscount,
    watchedRegFee,
    watchedSecDeposit,
    pricingConfig,
  ]);

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
    if (watchedPaymentType !== 'partial' && calcResult.finalPayable > 0) {
      setValue('amountPaid', String(calcResult.finalPayable), { shouldValidate: true });
    }
  }, [calcResult.finalPayable, watchedPaymentType, setValue]);

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
      const finalPayable = calcResult.finalPayable;
      const amountPaidNum = Number(values.amountPaid) || finalPayable;
      const balanceDue = Math.max(0, finalPayable - amountPaidNum);
      const isPartial = balanceDue > 0;
      const secDepositNum = Number(values.securityDeposit) || 0;
      const expectedDueDate = values.promiseDueDate || new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString().slice(0, 10);

      const studentData: AdmittedStudentInfo = {
        fullName: values.fullName,
        phone: values.phone,
        smartId: generatedSmartId,
        seat: values.seat || 'General Study',
        shift: values.shift,
        plan: values.plan,
        paymentMode: values.paymentMode,
        amountPaid: values.amountPaid,
        totalPayable: String(finalPayable),
        balanceDue: String(balanceDue),
        isPartialPayment: isPartial,
        promiseDueDate: isPartial ? expectedDueDate : undefined,
        securityDeposit: secDepositNum > 0 ? String(secDepositNum) : undefined,
      };

      persistCompletedAdmission({
        studentData,
        generatedSmartId,
        finalPayable,
        amountPaidNum,
        balanceDue,
        isPartial,
        secDepositNum,
        expectedDueDate,
        promiseRemarks: values.promiseRemarks,
        referredBy: values.referredBy,
      });

      setAdmittedStudent(studentData);
      const feedbackText = isPartial
        ? `Admission registered successfully for ${values.fullName}! Token Advance: ${formatAdmissionInr(amountPaidNum)}, Balance Due: ${formatAdmissionInr(balanceDue)} (Auto-created Payment Promise scheduled for ${expectedDueDate}).`
        : `Admission registered successfully for ${values.fullName}! Assigned Seat: ${values.seat || 'General'}, Shift: ${values.shift}, Plan: ${values.plan}, Mode: ${values.paymentMode}.`;
      setDraftFeedback(feedbackText);
    }, 500);
  });

  return (
    <>
      {unsavedConfirmDialog}
      <div className="mgr-page w-full max-w-full min-w-0 overflow-x-hidden">
        <ManagerMembersNewAdmissionPageHeader
          tManagerUi={tManagerUi}
          admittedStudent={admittedStudent}
          onResetAdmission={handleResetAdmission}
          draftFeedback={draftFeedback}
          conversionOrigin={conversionOrigin}
          onDismissConversionOrigin={() => setConversionOrigin(null)}
        />

        <form onSubmit={submit} noValidate className="w-full max-w-full min-w-0">
          <div className="mgr-admission-layout w-full max-w-full min-w-0">
            <div className="mgr-admission-main w-full max-w-full min-w-0">
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
                finalPayable={calcResult.finalPayable}
                watchedLocker={watchedLocker}
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
