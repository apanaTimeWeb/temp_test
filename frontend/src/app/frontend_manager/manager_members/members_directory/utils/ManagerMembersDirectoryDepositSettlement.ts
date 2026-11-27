import { readBrowserStorageItem, writeBrowserStorageItem } from '@/lib/browserStorage';

export interface MemberDepositSettlementInfo {
  hasHeldDeposit: boolean;
  amount: number;
  depositId?: string | number;
  receiptNumber?: string;
  status: 'Held' | 'Refunded' | 'Settled' | 'No Deposit';
}

const INR_RUPEES_FORMATTER = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
export const formatDirectoryInrRupees = (rupees: number): string => INR_RUPEES_FORMATTER.format(rupees);
const cleanDigits = (val: string | null | undefined): string => (val || '').replace(/\D/g, '').slice(-10);

function matchesDepositRecord(rec: Record<string, unknown> | null, targetId: string, targetNameLower: string, cleanPhone: string): boolean {
  if (!rec) return false;
  return Boolean(
    (targetId && (rec.smartId === targetId || rec.id === targetId)) ||
      (targetNameLower && typeof rec.studentName === 'string' && rec.studentName.trim().toLowerCase() === targetNameLower) ||
      (cleanPhone && typeof rec.phone === 'string' && cleanDigits(rec.phone) === cleanPhone)
  );
}

export function checkMemberDepositSettlement(
  student: { id?: string; smartId?: string; name?: string; phone?: string; locker?: string; securityDeposit?: number } | null
): MemberDepositSettlementInfo {
  if (!student) return { hasHeldDeposit: false, amount: 0, status: 'No Deposit' };
  const cleanPhone = cleanDigits(student.phone);
  const targetId = student.id || student.smartId || '';
  const targetName = (student.name || '').trim().toLowerCase();

  try {
    const raw = readBrowserStorageItem('manager_finance_security_deposits_records');
    const records = raw.available && raw.value ? JSON.parse(raw.value) : null;
    const match = Array.isArray(records) ? records.find((rec: Record<string, unknown> | null) => matchesDepositRecord(rec, targetId, targetName, cleanPhone)) : null;
    if (match) {
      const rawAmt = typeof match.depositAmount === 'number' ? match.depositAmount : 50000;
      const amtInRs = rawAmt > 2000 ? Math.round(rawAmt / 100) : rawAmt;
      if (match.status === 'held') return { hasHeldDeposit: true, amount: amtInRs || 500, depositId: match.id as string | number, receiptNumber: String(match.receiptNumber || ''), status: 'Held' };
      if (match.status === 'refunded' || match.status === 'approved' || match.status === 'processed') {
        return { hasHeldDeposit: false, amount: amtInRs || 0, depositId: match.id as string | number, receiptNumber: String(match.receiptNumber || ''), status: 'Refunded' };
      }
    }
  } catch { /* storage unavailable */ }

  if (typeof student.securityDeposit === 'number' && student.securityDeposit > 0) return { hasHeldDeposit: true, amount: student.securityDeposit, status: 'Held' };
  if (student.locker) return { hasHeldDeposit: true, amount: 500, status: 'Held' };
  return { hasHeldDeposit: false, amount: 0, status: 'No Deposit' };
}

export function getDepositSettlementFinanceUrl(studentName: string, phone?: string): string {
  const params = new URLSearchParams();
  if (studentName) params.set('name', studentName.trim());
  const digits = phone ? cleanDigits(phone) : '';
  if (digits.length === 10) params.set('phone', digits);
  return `/frontend_manager/manager_finance/finance_security_deposits?${params.toString()}`;
}

export function settleAndRefundDepositInLedger(
  student: { id?: string; smartId?: string; name: string; phone?: string; joinDate?: string },
  refundAmount: number, notes?: string, refundDate?: string
): boolean {
  if (typeof window === 'undefined') return false;
  const cleanPhone = cleanDigits(student.phone);
  const targetId = student.id || student.smartId || `STU-${Date.now().toString().slice(-4)}`;
  const targetName = student.name.trim();
  const effectiveRefundDate = refundDate || new Date().toISOString().slice(0, 10);

  try {
    const raw = readBrowserStorageItem('manager_finance_security_deposits_records');
    const records = raw.available && raw.value ? JSON.parse(raw.value) : [];
    const list = Array.isArray(records) ? records : [];
    let matched = false;
    const updated = list.map((dep: Record<string, unknown> | null) => {
      if (!matchesDepositRecord(dep, targetId, targetName.toLowerCase(), cleanPhone) || !dep) return dep;
      matched = true;
      return { ...dep, status: 'refunded', refundedDate: effectiveRefundDate, netRefund: typeof dep.depositAmount === 'number' ? dep.depositAmount : refundAmount * 100, deductionAmount: 0, notes: notes || dep.notes || `Refunded upon graduation to Alumni (${new Date().toLocaleDateString('en-GB')})` };
    });
    if (!matched && refundAmount > 0) {
      updated.unshift({
        id: Date.now(), studentName: targetName, smartId: targetId, phone: cleanPhone, depositAmount: refundAmount * 100,
        status: 'refunded', collectedDate: student.joinDate || effectiveRefundDate, refundedDate: effectiveRefundDate,
        netRefund: refundAmount * 100, deductionAmount: 0, collectedBy: 'Front Desk Clearance', receiptNumber: `DEP-REF-${targetId}`,
        notes: notes || 'Refunded upon graduation to Alumni.',
      });
    }
    writeBrowserStorageItem('manager_finance_security_deposits_records', JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('manager_security_deposit_refunded', { detail: { studentName: targetName, smartId: targetId, amount: refundAmount } }));
    return true;
  } catch { return false; }
}
