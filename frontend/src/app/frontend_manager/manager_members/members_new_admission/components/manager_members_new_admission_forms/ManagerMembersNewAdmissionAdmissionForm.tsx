'use client';
// RESPONSIBILITY: Render the members new admission admission form component with dynamic shift & tenure pricing.
import { useTranslations } from 'next-intl';

import { ManagerMembersNewAdmissionAdmissionDocumentSection } from '@/app/frontend_manager/manager_members/members_new_admission/components/manager_members_new_admission_sections/ManagerMembersNewAdmissionAdmissionDocumentSection';
import { ManagerMembersNewAdmissionAdmissionEnrollmentSection } from '@/app/frontend_manager/manager_members/members_new_admission/components/manager_members_new_admission_sections/ManagerMembersNewAdmissionAdmissionEnrollmentSection';
import { ManagerMembersNewAdmissionAdmissionPaymentSection } from '@/app/frontend_manager/manager_members/members_new_admission/components/manager_members_new_admission_sections/ManagerMembersNewAdmissionAdmissionPaymentSection';
import { ManagerMembersNewAdmissionAdmissionPersonalSection } from '@/app/frontend_manager/manager_members/members_new_admission/components/manager_members_new_admission_sections/ManagerMembersNewAdmissionAdmissionPersonalSection';
import { ManagerMembersNewAdmissionAdmissionSummary } from '@/app/frontend_manager/manager_members/members_new_admission/components/manager_members_new_admission_sections/ManagerMembersNewAdmissionAdmissionSummary';
import { ManagerMembersNewAdmissionSuccessBanner,type AdmittedStudentInfo } from '@/app/frontend_manager/manager_members/members_new_admission/components/manager_members_new_admission_sections/ManagerMembersNewAdmissionSuccessBanner';
import { MANAGER_MEMBERS_NEW_ADMISSION_ROUTES } from '@/app/frontend_manager/manager_members/members_new_admission/config/manager_members_new_admission.url_config';
import { useManagerNewAdmissionAdmission } from '@/app/frontend_manager/manager_members/members_new_admission/hooks/useManagerMembersNewAdmissionAdmission';
import { useManagerMembersNewAdmissionConfirm } from '@/app/frontend_manager/manager_members/members_new_admission/hooks/useManagerMembersNewAdmissionConfirm';
import { useManagerMembersNewAdmissionUnsavedChangesGuard } from '@/app/frontend_manager/manager_members/members_new_admission/hooks/useManagerMembersNewAdmissionUnsavedChangesGuard';
import type { DynamicPlanOption } from '@/app/frontend_manager/manager_members/members_new_admission/types/ManagerMembersNewAdmissionComponentTypes';
import { calculateAdmissionFee,getLibraryPricingConfig,type LibraryPricingConfig } from '@/lib/pricing/libraryPricingEngine';
import { ArrowLeft,Sparkles,X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect,useMemo,useState } from 'react';

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
    try {
      const stored = sessionStorage.getItem('manager_pending_enquiry_conversion');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.name) setValue('fullName', parsed.name, { shouldValidate: true, shouldDirty: true });
        if (parsed.phone) setValue('phone', parsed.phone, { shouldValidate: true, shouldDirty: true });
        if (parsed.shift && parsed.shift !== 'Not specified') {
          setValue('shift', parsed.shift, { shouldValidate: true, shouldDirty: true });
        }
        if (parsed.notes) {
          setValue('remarks', `Converted from Enquiry: ${parsed.notes}`, { shouldValidate: false, shouldDirty: true });
        }
        setConversionOrigin({ enquiryId: parsed.enquiryId || 'ENQ', name: parsed.name });
        sessionStorage.removeItem('manager_pending_enquiry_conversion');
      }
    } catch {
      // Storage fallback
    }
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

      // Real local persistence across session
      try {
        const stored = JSON.parse(localStorage.getItem('manager_admitted_students') || '[]');
        localStorage.setItem('manager_admitted_students', JSON.stringify([studentData, ...stored]));
        sessionStorage.setItem(`admission_student_${generatedSmartId}`, JSON.stringify(studentData));
        window.dispatchEvent(new CustomEvent('manager_member_admitted', { detail: studentData }));

        // Auto-create Payment Promise if partial payment with balance due
        if (isPartial) {
          const promiseRecord = {
            id: Date.now(),
            studentName: values.fullName,
            smartId: generatedSmartId,
            phone: values.phone,
            promisedAmount: balanceDue * 100, // minor units matching finance_payment_promises
            expectedDate: expectedDueDate,
            daysUntilDue: Math.ceil((new Date(expectedDueDate).getTime() - Date.now()) / (1000 * 3600 * 24)),
            timesChanged: 0,
            status: 'pending',
            remarks: values.promiseRemarks?.trim() || `Admission Token Advance: Paid ₹${amountPaidNum} of ₹${finalPayable}. Balance ₹${balanceDue} promised.`,
          };
          const storedPromises = JSON.parse(localStorage.getItem('manager_finance_payment_promises_records') || '[]');
          localStorage.setItem('manager_finance_payment_promises_records', JSON.stringify([promiseRecord, ...storedPromises]));
          sessionStorage.setItem('manager_latest_payment_promise', JSON.stringify(promiseRecord));
          window.dispatchEvent(new CustomEvent('manager_payment_promise_created', { detail: promiseRecord }));
        }

        // Auto-create Security Deposit record if refundable security deposit is collected
        if (secDepositNum > 0) {
          const depositRecord = {
            id: Date.now(),
            studentName: values.fullName,
            smartId: generatedSmartId,
            phone: values.phone,
            depositAmount: secDepositNum * 100, // minor units matching finance_security_deposits
            status: 'held',
            collectedDate: new Date().toISOString().slice(0, 10),
            collectedBy: 'Front Desk Admission',
            receiptNumber: `DEP-${generatedSmartId}`,
            notes: `Collected at admission. Plan: ${values.plan}, Seat: ${values.seat || 'General'}.`,
          };
          const storedDeposits = JSON.parse(localStorage.getItem('manager_finance_security_deposits_records') || '[]');
          localStorage.setItem('manager_finance_security_deposits_records', JSON.stringify([depositRecord, ...storedDeposits]));
          window.dispatchEvent(new CustomEvent('manager_security_deposit_collected', { detail: depositRecord }));
        }

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
      const feedbackText = isPartial
        ? `Admission registered successfully for ${values.fullName}! Token Advance: ₹${amountPaidNum}, Balance Due: ₹${balanceDue} (Auto-created Payment Promise scheduled for ${expectedDueDate}).`
        : `Admission registered successfully for ${values.fullName}! Assigned Seat: ${values.seat || 'General'}, Shift: ${values.shift}, Plan: ${values.plan}, Mode: ${values.paymentMode}.`;
      setDraftFeedback(feedbackText);
    }, 500);
  });

  return (
    <>
      {unsavedConfirmDialog}
      <div className="mgr-page w-full max-w-full min-w-0 overflow-x-hidden">
        <div className="mgr-page-header flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 w-full max-w-full min-w-0">
          <div className="min-w-0 flex-1">
            <Link href={MANAGER_MEMBERS_NEW_ADMISSION_ROUTES.LIST} className="mgr-back-link inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors mb-2">
              <ArrowLeft size={16} strokeWidth={2} />
              <span>{tManagerUi('back_to_students_6de7b0')}</span>
            </Link>
            <h1 className="mgr-page-title text-xl sm:text-2xl font-black text-primary tracking-tight truncate">{tManagerUi('new_student_admission')}</h1>
            <p className="mgr-page-subtitle text-xs sm:text-sm text-secondary mt-1">{tManagerUi('fill_all_mandatory_fields_accurately_smart_id_is_auto_ge_026bb4')}</p>
            {admittedStudent && (
              <ManagerMembersNewAdmissionSuccessBanner
                student={admittedStudent}
                onReset={handleResetAdmission}
              />
            )}
            {draftFeedback && <p className="mt-3 rounded-lg border border-warning bg-warning-bg p-3 text-sm text-warning" role="status" aria-live="polite" data-testid="manager-students-admission-draft-feedback">{draftFeedback}</p>}
            {conversionOrigin && (
              <div className="mt-3 p-3.5 rounded-xl bg-indigo-500/15 border border-indigo-500/35 flex items-center justify-between text-xs text-indigo-300">
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-indigo-400 shrink-0" />
                  <span>
                    Converted from Enquiry <strong>#{conversionOrigin.enquiryId}</strong>: Information pre-filled for <strong>{conversionOrigin.name}</strong>.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setConversionOrigin(null)}
                  className="text-secondary hover:text-primary transition-colors cursor-pointer p-1"
                  aria-label="Dismiss banner"
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>
          <div className="mgr-smartid-badge self-start sm:self-auto shrink-0 flex items-center gap-2 p-2.5 sm:p-3 rounded-xl bg-card border border-border shadow-xs">
            <span className="mgr-smartid-label text-xs text-secondary font-medium uppercase tracking-wider">{tManagerUi('smart_id')}</span>
            <span className="mgr-smartid-value font-mono text-sm font-bold text-primary">{tManagerUi('lib_new')}</span>
            <span className="mgr-badge mgr-badge--info text-[11px] font-semibold px-2 py-0.5 rounded-full bg-info-bg text-info border border-border">{tManagerUi('smart_id_preview_only')}</span>
          </div>
        </div>

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
