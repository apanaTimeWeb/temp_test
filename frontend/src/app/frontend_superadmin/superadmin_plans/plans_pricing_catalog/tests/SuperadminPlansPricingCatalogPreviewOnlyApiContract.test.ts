// RESPONSIBILITY: Define source-level test coverage for plans pricing catalog using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_plans/plans_pricing_catalog/tests/SuperadminPlansPricingCatalogPreviewOnlyApiContract.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { SUPERADMIN_PLANS_PRICING_CATALOG_API_CONTRACT_STATUS as contractStatus0 } from '../api/superadmin_plans_pricing_catalog.api';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('superadmin_plans/plans_pricing_catalog preview-only API contract', () => {
  it('fails closed until an approved backend contract is supplied', () => {
    expect(contractStatus0.status).toMatch(/^(unavailable|CONTRACT_MISSING)$/);
    expect(contractStatus0.networkCallsEnabled).toBe(false);
    expect(contractStatus0.source).toBe('SUPPLIED_FRONTEND_ARCHIVE');
    expect(contractStatus0.requiredInputs).toEqual(['approved-endpoint', 'request-schema', 'response-schema', 'authorization-contract']);
  });

  it('applies validated plan changes to local preview state without issuing a network mutation', () => {
    const page = readFileSync(new URL('../components/SuperadminPlansPricingCatalogPageClient.tsx', import.meta.url), 'utf8');
    expect(page).toContain('setPlans((currentPlans) => currentPlans.map');
    expect(page).toContain('setPlans((currentPlans) => [...currentPlans, nextPlan])');
    expect(page).toContain('COPY.PLAN_ADDED_LOCALLY_PREVIEW_ONLY');
    expect(page).toContain('COPY.PLAN_UPDATED_LOCALLY_PREVIEW_ONLY');
    expect(page).not.toMatch(/\bfetch\s*\(/);
  });

  it('resolves visible secondary tab labels through localized catalog keys', () => {
    const page = readFileSync(new URL('../components/SuperadminPlansPricingCatalogPageClient.tsx', import.meta.url), 'utf8');
    expect(page).toContain('COPY.ACTIVE_SUBSCRIBERS_TAB_LABEL');
    expect(page).toContain('COPY.SAAS_PRICING_PLANS_TAB_LABEL');
    expect(page).not.toContain("name: 'Active Subscribers'");
    expect(page).not.toContain("name: 'SaaS Pricing Plans'");
  });
});
