/**
 * Utility for verifying and settling security deposits when transitioning members to Alumni
 * and managing deposit clearance in the Alumni Network.
 */

export interface MemberDepositSettlementInfo {
  hasHeldDeposit: boolean;
  amount: number;
  depositId?: string | number;
  receiptNumber?: string;
  status: 'Held' | 'Refunded' | 'Settled' | 'No Deposit';
}

/**
 * Normalizes phone numbers to 10 digits for matching
 */
function cleanDigits(val: string | null | undefined): string {
  return (val || '').replace(/\D/g, '').slice(-10);
}

/**
 * Checks if a member has an active held security deposit recorded in finance or member data.
 */
export function checkMemberDepositSettlement(
  student: {
    id?: string;
    smartId?: string;
    name?: string;
    phone?: string;
    locker?: string;
    securityDeposit?: number;
  } | null
): MemberDepositSettlementInfo {
  if (!student) {
    return { hasHeldDeposit: false, amount: 0, status: 'No Deposit' };
  }

  const cleanPhone = cleanDigits(student.phone);
  const targetId = student.id || student.smartId || '';
  const targetName = (student.name || '').trim().toLowerCase();

  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem('manager_finance_security_deposits_records');
      if (raw) {
        const records = JSON.parse(raw);
        if (Array.isArray(records)) {
          // Look for matching deposit record
          const match = records.find((rec: any) => {
            if (!rec) return false;
            if (targetId && (rec.smartId === targetId || rec.id === targetId)) return true;
            if (targetName && rec.studentName && rec.studentName.trim().toLowerCase() === targetName) return true;
            if (cleanPhone && rec.phone && cleanDigits(rec.phone) === cleanPhone) return true;
            return false;
          });

          if (match) {
            const rawAmt = typeof match.depositAmount === 'number' ? match.depositAmount : 50000;
            const amtInRs = rawAmt > 2000 ? Math.round(rawAmt / 100) : rawAmt;

            if (match.status === 'held') {
              return {
                hasHeldDeposit: true,
                amount: amtInRs || 500,
                depositId: match.id,
                receiptNumber: match.receiptNumber,
                status: 'Held',
              };
            }
            if (match.status === 'refunded' || match.status === 'approved' || match.status === 'processed') {
              return {
                hasHeldDeposit: false,
                amount: amtInRs || 0,
                depositId: match.id,
                receiptNumber: match.receiptNumber,
                status: 'Refunded',
              };
            }
          }
        }
      }
    } catch {
      // Storage unavailable fallback
    }
  }

  // Fallback to student entity properties
  if (typeof student.securityDeposit === 'number' && student.securityDeposit > 0) {
    return {
      hasHeldDeposit: true,
      amount: student.securityDeposit,
      status: 'Held',
    };
  }

  // If member has an active locker assigned, a standard security deposit is held
  if (student.locker) {
    return {
      hasHeldDeposit: true,
      amount: 500,
      status: 'Held',
    };
  }

  return {
    hasHeldDeposit: false,
    amount: 0,
    status: 'No Deposit',
  };
}

/**
 * Builds the direct deep-link to Finance Security Deposits desk
 */
export function getDepositSettlementFinanceUrl(studentName: string, phone?: string): string {
  const params = new URLSearchParams();
  if (studentName) params.set('name', studentName.trim());
  if (phone) {
    const digits = cleanDigits(phone);
    if (digits.length === 10) params.set('phone', digits);
  }
  return `/frontend_manager/manager_finance/finance_security_deposits?${params.toString()}`;
}

/**
 * Marks deposit as refunded in localStorage and dispatches sync event
 */
export function settleAndRefundDepositInLedger(
  student: {
    id?: string;
    smartId?: string;
    name: string;
    phone?: string;
    joinDate?: string;
  },
  refundAmount: number,
  notes?: string,
  refundDate?: string
): boolean {
  if (typeof window === 'undefined') return false;

  const cleanPhone = cleanDigits(student.phone);
  const targetId = student.id || student.smartId || `STU-${Date.now().toString().slice(-4)}`;
  const targetName = student.name.trim();
  const effectiveRefundDate = refundDate || new Date().toISOString().slice(0, 10);

  try {
    const raw = localStorage.getItem('manager_finance_security_deposits_records');
    const records = raw ? JSON.parse(raw) : [];
    const list = Array.isArray(records) ? records : [];

    let matched = false;
    const updated = list.map((dep: any) => {
      if (!dep) return dep;
      const isMatch =
        (targetId && (dep.smartId === targetId || dep.id === targetId)) ||
        (targetName && dep.studentName && dep.studentName.trim().toLowerCase() === targetName.toLowerCase()) ||
        (cleanPhone && dep.phone && cleanDigits(dep.phone) === cleanPhone);

      if (isMatch) {
        matched = true;
        return {
          ...dep,
          status: 'refunded',
          refundedDate: effectiveRefundDate,
          netRefund: typeof dep.depositAmount === 'number' ? dep.depositAmount : refundAmount * 100,
          deductionAmount: 0,
          notes: notes || dep.notes || `Refunded upon graduation to Alumni (${new Date().toLocaleDateString('en-GB')})`,
        };
      }
      return dep;
    });

    if (!matched && refundAmount > 0) {
      updated.unshift({
        id: Date.now(),
        studentName: targetName,
        smartId: targetId,
        phone: cleanPhone,
        depositAmount: refundAmount * 100,
        status: 'refunded',
        collectedDate: student.joinDate || new Date().toISOString().slice(0, 10),
        refundedDate: effectiveRefundDate,
        netRefund: refundAmount * 100,
        deductionAmount: 0,
        collectedBy: 'Front Desk Clearance',
        receiptNumber: `DEP-REF-${targetId}`,
        notes: notes || `Refunded upon graduation to Alumni.`,
      });
    }

    localStorage.setItem('manager_finance_security_deposits_records', JSON.stringify(updated));
    window.dispatchEvent(
      new CustomEvent('manager_security_deposit_refunded', {
        detail: {
          studentName: targetName,
          smartId: targetId,
          amount: refundAmount,
        },
      })
    );
    return true;
  } catch {
    return false;
  }
}
