import { afterEach, cleanup, describe, expect, it, vi } from "vitest";
import { fireEvent, render } from "@testing-library/react";
import { createElement } from "react";
import { useUnsavedChangesGuard } from "@/app/frontend_admin/admin_finance/finance_collect_fee/hooks/useAdminFinanceCollectFeePage";
import { formatCurrency, formatDate, adminCollectFeeMajorToMinor, adminCollectFeeMinorToMajor } from "@/app/frontend_admin/admin_finance/finance_collect_fee/utils/AdminFinanceCollectFeeFormat";
import { createAdminCollectFeeSchema } from "@/app/frontend_admin/admin_finance/finance_collect_fee/schemas/AdminFinanceCollectFeeSchema";
import { ADMIN_FINANCE_COLLECT_FEE_ROUTES } from "@/app/frontend_admin/admin_finance/finance_collect_fee/config/admin_finance_collect_fee.url_config";


describe('date-fns locale-aware finance date formatting', () => {
  const originalDocumentLanguage = document.documentElement.lang;
  afterEach(() => { document.documentElement.lang = originalDocumentLanguage; });
  it('formats according to the active HTML language while preserving date-only values', () => {
    document.documentElement.lang = 'en-GB';
    expect(formatDate('2026-04-11')).toBe('11 Apr 2026');
    document.documentElement.lang = 'en-US';
    expect(formatDate('2026-04-11')).toBe('Apr 11, 2026');
    expect(formatDate('2026-02-30')).toBe('');
  });
});

// Preserved assertions from AdminFinanceCollectFeeFormat.test.ts.
describe('AdminFinanceCollectFeeFormat.test.ts preserved assertions', () => {
describe('admin collect fee currency formatting', () => {
  it('uses the currency-specific minor-unit scale', () => {
    expect(formatCurrency(1234, 'JPY', 'en-US')).toContain('1,234');
    expect(formatCurrency(1234, 'BHD', 'en-US')).toContain('1.234');
  });

  it('shows invalid money as unavailable instead of disguising it as zero', () => {
    expect(formatCurrency(Number.NaN, 'INR', 'en-IN')).toBe('—');
    expect(formatCurrency(1.5, 'INR', 'en-IN')).toBe('—');
    expect(formatCurrency(-1, 'INR', 'en-IN')).toBe('—');
  });
});
});

describe('AdminFinanceCollectFeeUtils.test.ts preserved assertions', () => {
describe('admin collect fee currency conversions', () => {
  it('uses the currency-specific minor-unit scale in both directions', () => {
    expect(adminCollectFeeMajorToMinor(1234, 'JPY', 'en-US')).toBe(1234);
    expect(adminCollectFeeMinorToMajor(1234, 'JPY', 'en-US')).toBe(1234);
    expect(adminCollectFeeMajorToMinor(1.234, 'BHD', 'en-US')).toBe(1234);
    expect(adminCollectFeeMinorToMajor(1234, 'BHD', 'en-US')).toBe(1.234);
  });

  it('guards invalid and negative major-unit input', () => {
    expect(adminCollectFeeMajorToMinor(Number.NaN)).toBeNaN();
    expect(adminCollectFeeMajorToMinor(-1)).toBeNaN();
    expect(adminCollectFeeMinorToMajor(Number.NaN)).toBeNaN();
  });
});
});


// Preserved assertions from AdminFinanceCollectFeeSchema.test.ts.
describe('AdminFinanceCollectFeeSchema.test.ts preserved assertions', () => {
const messages = {
  amountPositive: 'Amount must be at least 0.01.',
  amountPrecision: 'Enter an amount using no more than two decimal places.',
  studentRequired: 'Select a student.',
  transactionTooLong: 'Transaction reference is too long.',
  transactionRequired: 'Transaction reference is required for non-cash payments.',
  couponTooLong: 'Coupon code is too long.',
  lateFeeNegative: 'Late fee cannot be negative.',
  remarkTooLong: 'Remark is too long.',
};

const schema = createAdminCollectFeeSchema(messages);
const validInput = {
  selectedStudentId: 'student-1',
  amountMajor: '25.50',
  mode: 'upi' as const,
  txnId: 'txn-demo',
  couponCode: 'SAVE50',
  lateFeeMajor: '0',
  monthsToRenew: '1' as const,
  remark: '',
};

describe('createAdminCollectFeeSchema', () => {
  it('coerces amount inputs to numbers and accepts the documented form shape', () => {
    const parsed = schema.safeParse(validInput);
    expect(parsed.success).toBe(true);
    if (parsed.success) expect(parsed.data.amountMajor).toBe(25.5);
  });

  it('rejects a zero amount with the supplied localized message', () => {
    const parsed = schema.safeParse({ ...validInput, amountMajor: '0' });
    expect(parsed.success).toBe(false);
    if (!parsed.success) expect(parsed.error.issues[0]?.message).toBe(messages.amountPositive);
  });

  it('rejects a negative late fee', () => {
    expect(schema.safeParse({ ...validInput, lateFeeMajor: '-1' }).success).toBe(false);
  });

  it('requires a transaction ID for non-cash modes but not cash', () => {
    for (const mode of ['upi', 'card', 'bank'] as const) {
      expect(schema.safeParse({ ...validInput, mode, txnId: '' }).success).toBe(false);
      expect(schema.safeParse({ ...validInput, mode, txnId: '   ' }).success).toBe(false);
    }
    expect(schema.safeParse({ ...validInput, mode: 'cash', txnId: '' }).success).toBe(true);
  });


  it('requires a selected student and rejects amounts smaller than one paise', () => {
    expect(schema.safeParse({ ...validInput, selectedStudentId: '' }).success).toBe(false);
    expect(schema.safeParse({ ...validInput, amountMajor: '0.001' }).success).toBe(false);
  });

  it('rejects fractional-paise precision for both amount fields', () => {
    expect(schema.safeParse({ ...validInput, amountMajor: '12.345' }).success).toBe(false);
    expect(schema.safeParse({ ...validInput, lateFeeMajor: '0.001' }).success).toBe(false);
  });

  it('rejects unsupported renewal cycles', () => {
    expect(schema.safeParse({ ...validInput, monthsToRenew: '2' }).success).toBe(false);
  });
});
});

describe('AdminFinanceCollectFeeMainCollectFeeUrlContract.test.ts preserved assertions', () => {
describe('admin_collect_fee canonical URL contract', () => {
  it('exports a stable route owned by this module', () => {
    expect(ADMIN_FINANCE_COLLECT_FEE_ROUTES.ROOT).toBe('/admin/admin_finance/finance_collect_fee');
  });
});
});


describe('collect-fee unsaved changes guard (Rule 79)', () => {
  afterEach(() => { cleanup(); vi.restoreAllMocks(); });

  function GuardHarness({ dirty, dialogOpen = false, onNavigationAttempt }: { dirty: boolean; dialogOpen?: boolean; onNavigationAttempt: (destination: string) => void }) {
    useUnsavedChangesGuard(dirty, dialogOpen, onNavigationAttempt);
    return createElement('a', { href: '/admin/admin_finance/finance_payments' }, 'Leave collect-fee form');
  }

  it('blocks same-origin route links while dirty and requests explicit confirmation', () => {
    const onNavigationAttempt = vi.fn();
    const { getByRole } = render(createElement(GuardHarness, { dirty: true, onNavigationAttempt }));
    const link = getByRole('link', { name: 'Leave collect-fee form' });
    const clickWasNotNavigable = fireEvent.click(link);
    expect(clickWasNotNavigable).toBe(false);
    expect(onNavigationAttempt).toHaveBeenCalledWith('/admin/admin_finance/finance_payments');
  });

  it('guards browser exit while dirty and removes the listener when clean', () => {
    const onNavigationAttempt = vi.fn();
    const { rerender } = render(createElement(GuardHarness, { dirty: true, onNavigationAttempt }));
    const beforeUnload = new Event('beforeunload', { cancelable: true }) as BeforeUnloadEvent;
    window.dispatchEvent(beforeUnload);
    expect(beforeUnload.defaultPrevented).toBe(true);

    rerender(createElement(GuardHarness, { dirty: false, onNavigationAttempt }));
    const cleanBeforeUnload = new Event('beforeunload', { cancelable: true }) as BeforeUnloadEvent;
    window.dispatchEvent(cleanBeforeUnload);
    expect(cleanBeforeUnload.defaultPrevented).toBe(false);
  });
});
