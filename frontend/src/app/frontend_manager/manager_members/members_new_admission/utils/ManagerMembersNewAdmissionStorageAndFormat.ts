import type { AdmittedStudentInfo } from '@/app/frontend_manager/manager_members/members_new_admission/components/manager_members_new_admission_sections/ManagerMembersNewAdmissionSuccessBanner';
import { readBrowserSessionStorageItem, readBrowserStorageItem, writeBrowserSessionStorageItem, writeBrowserStorageItem } from '@/lib/browserStorage';

const INR_RUPEES_FORMATTER = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
export const formatAdmissionInr = (rupees: number): string => INR_RUPEES_FORMATTER.format(Number.isFinite(rupees) ? rupees : 0);

export interface EnquiryConversionPrefill {
  name?: string;
  phone?: string;
  shift?: string;
  notes?: string;
  enquiryId?: string;
}

export function consumeEnquiryConversionPrefill(): EnquiryConversionPrefill | null {
  try {
    const raw = readBrowserSessionStorageItem('manager_pending_enquiry_conversion');
    if (!raw.available || !raw.value || !raw.value.trim()) return null;
    const parsed = JSON.parse(raw.value) as EnquiryConversionPrefill;
    writeBrowserSessionStorageItem('manager_pending_enquiry_conversion', '');
    return parsed;
  } catch {
    return null;
  }
}

function appendStorageArrayItem(key: string, item: unknown): void {
  const existing = readBrowserStorageItem(key);
  const parsed = existing.available && existing.value ? JSON.parse(existing.value) : [];
  writeBrowserStorageItem(key, JSON.stringify([item, ...(Array.isArray(parsed) ? parsed : [])]));
}

export interface PersistAdmissionInput {
  studentData: AdmittedStudentInfo;
  generatedSmartId: string;
  finalPayable: number;
  amountPaidNum: number;
  balanceDue: number;
  isPartial: boolean;
  secDepositNum: number;
  expectedDueDate: string;
  promiseRemarks?: string;
  referredBy?: string;
}

export function persistCompletedAdmission(input: PersistAdmissionInput): void {
  if (typeof window === 'undefined') return;
  const { studentData, generatedSmartId, finalPayable, amountPaidNum, balanceDue, isPartial, secDepositNum, expectedDueDate, promiseRemarks, referredBy } = input;
  try {
    appendStorageArrayItem('manager_admitted_students', studentData);
    writeBrowserSessionStorageItem(`admission_student_${generatedSmartId}`, JSON.stringify(studentData));
    window.dispatchEvent(new CustomEvent('manager_member_admitted', { detail: studentData }));

    if (isPartial) {
      const promiseRecord = {
        id: Date.now(), studentName: studentData.fullName, smartId: generatedSmartId, phone: studentData.phone,
        promisedAmount: balanceDue * 100, expectedDate: expectedDueDate,
        daysUntilDue: Math.ceil((new Date(expectedDueDate).getTime() - Date.now()) / (1000 * 3600 * 24)),
        timesChanged: 0, status: 'pending',
        remarks: promiseRemarks?.trim() || `Admission Token Advance: Paid ${formatAdmissionInr(amountPaidNum)} of ${formatAdmissionInr(finalPayable)}. Balance ${formatAdmissionInr(balanceDue)} promised.`,
      };
      appendStorageArrayItem('manager_finance_payment_promises_records', promiseRecord);
      writeBrowserSessionStorageItem('manager_latest_payment_promise', JSON.stringify(promiseRecord));
      window.dispatchEvent(new CustomEvent('manager_payment_promise_created', { detail: promiseRecord }));
    }

    if (secDepositNum > 0) {
      const depositRecord = {
        id: Date.now(), studentName: studentData.fullName, smartId: generatedSmartId, phone: studentData.phone,
        depositAmount: secDepositNum * 100, status: 'held', collectedDate: new Date().toISOString().slice(0, 10),
        collectedBy: 'Front Desk Admission', receiptNumber: `DEP-${generatedSmartId}`,
        notes: `Collected at admission. Plan: ${studentData.plan}, Seat: ${studentData.seat || 'General'}.`,
      };
      appendStorageArrayItem('manager_finance_security_deposits_records', depositRecord);
      window.dispatchEvent(new CustomEvent('manager_security_deposit_collected', { detail: depositRecord }));
    }

    const refBy = referredBy?.trim();
    if (refBy && refBy !== 'Direct Walk-in' && !refBy.toLowerCase().startsWith('direct walk-in')) {
      const newRef = {
        id: `REF-${Date.now().toString().slice(-4)}`, referrer: refBy,
        referred: `${studentData.fullName} (${generatedSmartId})`, date: new Date().toISOString().slice(0, 10),
        status: 'Pending', bonus: formatAdmissionInr(500), method: 'Fee Discount',
      };
      appendStorageArrayItem('manager_members_referral_records', newRef);
      window.dispatchEvent(new CustomEvent('manager_referral_created', { detail: newRef }));
    }
  } catch { /* Storage unavailable fallback */ }
}
