
/** Masks a phone number for finance preview surfaces; not suitable for identity matching. */
export function maskManagerCollectFeePhone(phone: string | null | undefined): string {
  const digits = (phone ?? '').replace(/\D/g, '').slice(-10);
  if (!digits) return '—';
  if (digits.length < 4) return '••••';
  return `${digits.slice(0, 2)}••••${digits.slice(-2)}`;
}

export interface BillingPeriodCalculation {
  billingMonth: string;
  startDateFormatted: string;
  endDateFormatted: string;
  coverageLabel: string;
  nextDueDateFormatted: string;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export function calculateBillingCycleInfo(startYearMonth: string, durationMonths = 1): BillingPeriodCalculation {
  let year: number;
  let monthIndex: number;

  if (startYearMonth && /^\d{4}-\d{2}$/.test(startYearMonth)) {
    const parts = startYearMonth.split('-');
    year = Number(parts[0]);
    monthIndex = Number(parts[1]) - 1;
  } else {
    const now = new Date();
    year = now.getFullYear();
    monthIndex = now.getMonth();
  }

  const numMonths = Math.max(1, Math.min(36, Number(durationMonths) || 1));
  const startDate = new Date(year, monthIndex, 1);
  const endDate = new Date(year, monthIndex + numMonths, 0);
  const nextDueDate = new Date(year, monthIndex + numMonths, 1);

  const formatShortDate = (d: Date) => {
    const day = String(d.getDate()).padStart(2, '0');
    const month = MONTH_NAMES[d.getMonth()].slice(0, 3);
    const yr = d.getFullYear();
    return `${day} ${month} ${yr}`;
  };

  const monthLabel = `${MONTH_NAMES[startDate.getMonth()]} ${startDate.getFullYear()}`;
  const startFmt = formatShortDate(startDate);
  const endFmt = formatShortDate(endDate);
  const nextDueFmt = formatShortDate(nextDueDate);

  const coverageLabel = numMonths === 1 
    ? `${startFmt} – ${endFmt} (1 Month)`
    : `${startFmt} – ${endFmt} (${numMonths} Months)`;

  return {
    billingMonth: monthLabel,
    startDateFormatted: startFmt,
    endDateFormatted: endFmt,
    coverageLabel,
    nextDueDateFormatted: nextDueFmt,
  };
}

export function getAvailableBillingMonths(count = 6): Array<{ id: string; label: string }> {
  const result: Array<{ id: string; label: string }> = [];
  const now = new Date();

  // 1 month past (for backlog)
  const pastDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const pastKey = `${pastDate.getFullYear()}-${String(pastDate.getMonth() + 1).padStart(2, '0')}`;
  result.push({
    id: pastKey,
    label: `${MONTH_NAMES[pastDate.getMonth()]} ${pastDate.getFullYear()} (Previous Month / Backlog)`,
  });

  // current month and future months
  for (let i = 0; i < count; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const name = `${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`;
    const tag = i === 0 ? ' (Current Month)' : i === 1 ? ' (Next Month)' : '';
    result.push({ id: key, label: `${name}${tag}` });
  }

  return result;
}
