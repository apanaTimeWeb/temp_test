// RESPONSIBILITY: Define source-level test coverage for billing invoices using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_billing/billing_invoices/tests/SuperadminBillingInvoicesCanonicalWorkflowRouteContract.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { SUPERADMIN_BILLING_INVOICES_ROUTES as __SUPERADMIN_BILLING_INVOICES_ROUTES } from "../config/superadmin_billing_invoices.url_config";
import { readFileSync } from 'node:fs';

const EXPECTED_WORKFLOW_VIEWS = ["member_invoices", "member_receipts"] as const;
const CANONICAL_OWNER_ROUTE = '/superadmin/superadmin_billing/billing_invoices';

describe('superadmin_billing/billing_invoices canonical workflow route contract', () => {
  it('keeps each migrated workflow inside the canonical leaf URL', () => {
    const routes = Object.values(__SUPERADMIN_BILLING_INVOICES_ROUTES.SUPERADMIN_BILLING_INVOICES_WORKFLOW_URLS);
    expect(routes).toHaveLength(EXPECTED_WORKFLOW_VIEWS.length);
    for (const route of routes) {
      expect(route.startsWith(`${CANONICAL_OWNER_ROUTE}?view=`)).toBe(true);
      expect(route.match(/\?view=/g)).toHaveLength(1);
    }
  });

  it('dispatches every declared workflow view from the canonical page', () => {
    const source = readFileSync(new URL('../page.tsx', import.meta.url), 'utf8');
    for (const view of EXPECTED_WORKFLOW_VIEWS) {
      expect(source).toContain(`view === '${view}'`);
    }
  });
});
