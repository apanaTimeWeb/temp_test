// RESPONSIBILITY: Define source-level test coverage for billing overview using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_billing/billing_overview/tests/SuperadminBillingOverviewCanonicalWorkflowRouteContract.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { SUPERADMIN_BILLING_OVERVIEW_ROUTES as __SUPERADMIN_BILLING_OVERVIEW_ROUTES } from "../config/superadmin_billing_overview.url_config";
import { readFileSync } from 'node:fs';

const EXPECTED_WORKFLOW_VIEWS = ["member_finance_overview", "member_late_fees", "member_payment_promises", "member_payments", "member_payments_collection", "member_refunds", "member_security_deposits"] as const;
const CANONICAL_OWNER_ROUTE = '/superadmin/superadmin_billing/billing_overview';

describe('superadmin_billing/billing_overview canonical workflow route contract', () => {
  it('keeps each migrated workflow inside the canonical leaf URL', () => {
    const routes = Object.values(__SUPERADMIN_BILLING_OVERVIEW_ROUTES.SUPERADMIN_BILLING_OVERVIEW_WORKFLOW_URLS);
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
