// RESPONSIBILITY: Define source-level test coverage for billing invoices using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_billing/billing_invoices/tests/SuperadminBillingInvoicesLegacyDetailRouteContract.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

const routeSource = readFileSync(new URL('../page.tsx', import.meta.url), 'utf8');

describe('billing_invoices legacy detail route adapters', () => {
  it('redirects legacy invoice and receipt details to their owning leaf workflows', () => {
    expect(routeSource).toContain("view === 'member_invoices_detail'");
    expect(routeSource).toContain("'/superadmin/superadmin_billing/billing_member_invoices', query, 'detail'");
    expect(routeSource).toContain("view === 'member_receipts_detail'");
    expect(routeSource).toContain("'/superadmin/superadmin_billing/billing_member_receipts', query, 'detail'");
  });

  it('preserves non-view query values and repeated keys while replacing the legacy view key', () => {
    expect(routeSource).toContain("if (key === 'view' || value === undefined) continue");
    expect(routeSource).toContain('value.forEach((item) => preserved.append(key, item))');
    expect(routeSource).toContain("if (targetView) preserved.set('view', targetView)");
    expect(routeSource).toContain('const id = firstValue(query.id)');
  });
});
