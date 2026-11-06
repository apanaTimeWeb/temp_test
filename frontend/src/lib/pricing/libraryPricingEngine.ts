/**
 * Centralized Modular Dynamic Pricing Engine for Study Libraries & Reading Rooms.
 * Handles shift-based base pricing, multi-shift combinations, tenure duration multipliers,
 * seat type surcharges, locker add-ons, and dynamic invoice itemization.
 */
import { readBrowserStorageItem, writeBrowserStorageItem } from '@/lib/browserStorage';

export interface ShiftPriceConfig {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  monthlyPrice: number;
  hours: string;
  badge: string;
}

export interface DurationTierConfig {
  id: string;
  name: string;
  months: number;
  discountPercent: number;
}

export interface LibraryPricingConfig {
  shifts: ShiftPriceConfig[];
  durationTiers: DurationTierConfig[];
  lockerMonthlyFee: number;
  reservedSeatMonthlyFee: number;
  multiShiftDiscountPercent: number;
}

export const DEFAULT_LIBRARY_PRICING_CONFIG: LibraryPricingConfig = {
  shifts: [
    { id: 'Morning', name: 'Morning Shift', startTime: '06:00 AM', endTime: '02:00 PM', monthlyPrice: 700, hours: '06:00 AM – 02:00 PM', badge: '8 Hrs' },
    { id: 'Evening', name: 'Evening Shift', startTime: '02:00 PM', endTime: '10:00 PM', monthlyPrice: 700, hours: '02:00 PM – 10:00 PM', badge: '8 Hrs' },
    { id: 'Night', name: 'Night Shift', startTime: '10:00 PM', endTime: '06:00 AM', monthlyPrice: 600, hours: '10:00 PM – 06:00 AM', badge: '8 Hrs' },
    { id: 'Full Day', name: 'Full Day Access', startTime: '06:00 AM', endTime: '10:00 PM', monthlyPrice: 1500, hours: '06:00 AM – 10:00 PM', badge: '16 Hrs' },
  ],
  durationTiers: [
    { id: '1_month', name: '1 Month (Monthly)', months: 1, discountPercent: 0 },
    { id: '3_months', name: '3 Months (Quarterly)', months: 3, discountPercent: 10 },
    { id: '6_months', name: '6 Months (Half-Yearly)', months: 6, discountPercent: 15 },
    { id: '12_months', name: '1 Year (Annual)', months: 12, discountPercent: 20 },
  ],
  lockerMonthlyFee: 200,
  reservedSeatMonthlyFee: 200,
  multiShiftDiscountPercent: 10,
};

const STORAGE_KEY = 'LIBRARY_OS_PRICING_CONFIG_V1';

export function getLibraryPricingConfig(): LibraryPricingConfig {
  const read = readBrowserStorageItem(STORAGE_KEY);
  if (read.available && read.value) {
    try {
      const parsed = JSON.parse(read.value) as LibraryPricingConfig;
      if (Array.isArray(parsed.shifts) && Array.isArray(parsed.durationTiers)) {
        return parsed;
      }
    } catch {
      // Fallback on corrupt payload
    }
  }
  return DEFAULT_LIBRARY_PRICING_CONFIG;
}

export function saveLibraryPricingConfig(config: LibraryPricingConfig): void {
  try {
    writeBrowserStorageItem(STORAGE_KEY, JSON.stringify(config));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('library_pricing_updated', { detail: config }));
    }
  } catch {
    // Storage quota or SSR fallback
  }
}

export interface CalculationInput {
  selectedShifts: string[];
  planDurationKey: string;
  floor?: string;
  hasLocker?: boolean;
  manualDiscount?: number;
}

export interface BreakdownItem {
  label: string;
  amount: number;
  isNegative?: boolean;
}

export interface CalculationResult {
  monthlyBaseShiftFee: number;
  comboDiscountMonthly: number;
  effectiveMonthlyShiftFee: number;
  monthlyLockerFee: number;
  monthlySeatSurcharge: number;
  totalMonthlyRate: number;
  durationMonths: number;
  durationLabel: string;
  grossTenureFee: number;
  tenureDiscountPercent: number;
  tenureDiscountAmount: number;
  netBeforeManualDiscount: number;
  manualDiscountAmount: number;
  finalPayable: number;
  breakdown: BreakdownItem[];
}

export function calculateAdmissionFee(
  input: CalculationInput,
  config: LibraryPricingConfig = getLibraryPricingConfig()
): CalculationResult {
  const { selectedShifts, planDurationKey, floor, hasLocker, manualDiscount = 0 } = input;

  // 1. Calculate shift rates
  let monthlyBaseShiftFee = 0;
  if (selectedShifts.includes('Full Day')) {
    const fullDayShift = config.shifts.find((s) => s.id === 'Full Day');
    monthlyBaseShiftFee = fullDayShift?.monthlyPrice ?? 1500;
  } else {
    for (const shiftId of selectedShifts) {
      const matched = config.shifts.find((s) => s.id === shiftId);
      monthlyBaseShiftFee += matched ? matched.monthlyPrice : 700;
    }
  }

  // Multi-shift combo discount if 2 or more distinct individual shifts
  const hasMultiShiftCombo = !selectedShifts.includes('Full Day') && selectedShifts.length > 1;
  const comboDiscountMonthly = hasMultiShiftCombo
    ? Math.round((monthlyBaseShiftFee * config.multiShiftDiscountPercent) / 100)
    : 0;
  const effectiveMonthlyShiftFee = Math.max(0, monthlyBaseShiftFee - comboDiscountMonthly);

  // 2. Add-on fees
  const monthlyLockerFee = hasLocker ? config.lockerMonthlyFee : 0;
  const isReservedSeat = floor === '3';
  const monthlySeatSurcharge = isReservedSeat ? config.reservedSeatMonthlyFee : 0;

  const totalMonthlyRate = effectiveMonthlyShiftFee + monthlyLockerFee + monthlySeatSurcharge;

  // 3. Resolve duration tier
  const normalizedKey = planDurationKey.trim().toLowerCase();
  const tier =
    config.durationTiers.find((t) => t.id.toLowerCase() === normalizedKey || t.name.toLowerCase() === normalizedKey) ??
    config.durationTiers.find((t) => {
      if (normalizedKey.includes('quarter') || normalizedKey.startsWith('3')) return t.months === 3;
      if (normalizedKey.includes('half') || normalizedKey.startsWith('6')) return t.months === 6;
      if (normalizedKey.includes('annual') || normalizedKey.includes('year') || normalizedKey.startsWith('12')) return t.months === 12;
      if (normalizedKey.startsWith('1')) return t.months === 1;
      return false;
    }) ??
    config.durationTiers[0];

  const durationMonths = tier?.months ?? 1;
  const durationLabel = tier?.name ?? '1 Month (Monthly)';
  const tenureDiscountPercent = tier?.discountPercent ?? 0;

  // 4. Compute tenure amounts
  const grossTenureFee = totalMonthlyRate * durationMonths;
  const tenureDiscountAmount =
    tenureDiscountPercent > 0 ? Math.round((grossTenureFee * tenureDiscountPercent) / 100) : 0;
  const netBeforeManualDiscount = Math.max(0, grossTenureFee - tenureDiscountAmount);
  const manualDiscountAmount = Math.max(0, manualDiscount);
  const finalPayable = Math.max(0, netBeforeManualDiscount - manualDiscountAmount);

  // 5. Build human-readable itemized breakdown
  const breakdown: BreakdownItem[] = [];
  if (selectedShifts.length > 0) {
    breakdown.push({
      label: `Shift Base Fee (${selectedShifts.join(' + ')}) × ${durationMonths} mo`,
      amount: monthlyBaseShiftFee * durationMonths,
    });
  }
  if (comboDiscountMonthly > 0) {
    breakdown.push({
      label: `Multi-Shift Combo Discount (${config.multiShiftDiscountPercent}%)`,
      amount: comboDiscountMonthly * durationMonths,
      isNegative: true,
    });
  }
  if (monthlySeatSurcharge > 0) {
    breakdown.push({
      label: `Reserved Cabin Desk Surcharge × ${durationMonths} mo`,
      amount: monthlySeatSurcharge * durationMonths,
    });
  }
  if (monthlyLockerFee > 0) {
    breakdown.push({
      label: `Personal Locker Allotment × ${durationMonths} mo`,
      amount: monthlyLockerFee * durationMonths,
    });
  }
  if (tenureDiscountAmount > 0) {
    breakdown.push({
      label: `Duration Saver Discount (${tenureDiscountPercent}% Off)`,
      amount: tenureDiscountAmount,
      isNegative: true,
    });
  }
  if (manualDiscountAmount > 0) {
    breakdown.push({
      label: 'Manual / Coupon Discount',
      amount: manualDiscountAmount,
      isNegative: true,
    });
  }

  return {
    monthlyBaseShiftFee,
    comboDiscountMonthly,
    effectiveMonthlyShiftFee,
    monthlyLockerFee,
    monthlySeatSurcharge,
    totalMonthlyRate,
    durationMonths,
    durationLabel,
    grossTenureFee,
    tenureDiscountPercent,
    tenureDiscountAmount,
    netBeforeManualDiscount,
    manualDiscountAmount,
    finalPayable,
    breakdown,
  };
}
