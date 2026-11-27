export const INITIAL_COMPOSITE_ITEMS = [
  { id: 'seat_fee', label: 'Seat Monthly Fee', amount: 1200, enabled: true },
  { id: 'locker_fee', label: 'Locker Rental Fee', amount: 400, enabled: false },
  { id: 'late_fine', label: 'Late Fine / Penalty', amount: 200, enabled: false },
  { id: 'reg_fee', label: 'Registration / Admission Fee', amount: 500, enabled: false },
];

export function computeCollectionReconciliation({
  amount,
  lateFee,
  couponDiscount,
  studentDuePaise,
  cycleAmount,
}: {
  amount: string;
  lateFee: string;
  couponDiscount: number;
  studentDuePaise: number;
  cycleAmount: number;
}) {
  const baseAmount = Number.isFinite(Number(amount)) && amount.trim() !== '' ? Number(amount) : 0;
  const lateFeeAmt = Number.isFinite(Number(lateFee)) && lateFee.trim() !== '' ? Number(lateFee) : 0;
  const total = Math.max(0, baseAmount + lateFeeAmt - couponDiscount);
  const numAmount = parseFloat(amount || '');
  const isAmountInvalid = !amount || isNaN(numAmount) || numAmount <= 0;
  const studentDueMajor = studentDuePaise / 100;
  const targetReconciliationAmount = studentDueMajor > 0 ? studentDueMajor : cycleAmount;
  const isPartialPayment = studentDuePaise > 0 && total > 0 && total < studentDueMajor;
  const isFullPayment = studentDuePaise > 0 && total === studentDueMajor;
  const isAdvancePayment = studentDuePaise > 0 && total > studentDueMajor;
  const remainingDuePaise = studentDuePaise > 0 ? Math.max(0, studentDuePaise - Math.round(total * 100)) : 0;
  return {
    total,
    isAmountInvalid,
    studentDueMajor,
    targetReconciliationAmount,
    isPartialPayment,
    isFullPayment,
    isAdvancePayment,
    remainingDuePaise,
  };
}
