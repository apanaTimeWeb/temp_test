// RESPONSIBILITY: Define source-level test coverage for billing member payments using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_billing/billing_member_payments/tests/SuperadminBillingOverviewMemberPaymentsDisplayValue.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { displayValue } from '../utils/SuperadminBillingOverviewMemberPaymentsDisplayValue';

describe('SuperadminBillingOverviewMemberPaymentsDisplayValue contract', () => {
  it('uses the host display-value helper for primitive fallbacks and preserves ReactNode renderers', () => {
    const components = resolve(process.cwd(), 'src/app/frontend_superadmin/superadmin_billing/billing_member_payments/components');
    const page = readFileSync(resolve(components, 'SuperadminBillingOverviewMemberPaymentsPageClient.tsx'), 'utf8');
    const table = readFileSync(resolve(components, 'SuperadminBillingOverviewMemberPaymentsSemanticTable.tsx'), 'utf8');
    expect(page).toContain("from '@/lib/display_value'");
    expect(table).toContain("from '@/lib/display_value'");
    expect(table).toContain("typeof content === 'boolean'");
    expect(table).toContain(': content;');
  });
  it('uses an en dash for null, undefined, and empty string', () => {
    expect(displayValue(null)).toBe('—');
    expect(displayValue(undefined)).toBe('—');
    expect(displayValue('')).toBe('—');
  });

  it('preserves meaningful values instead of treating them as empty', () => {
    expect(displayValue('Ready')).toBe('Ready');
    expect(displayValue(0)).toBe(0);
    expect(displayValue(false)).toBe(false);
  });
});
