// RESPONSIBILITY: Define source-level test coverage for subscriptions active subscribers using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_subscriptions/subscriptions_active_subscribers/tests/RBG29_ActiveBranchContract.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

describe('RBG-29 active route branch contract', () => {
  it('preserves the active route and excludes unreachable sibling render branches', () => {
    const source = readFileSync(new URL('../components/SuperadminSubscriptionsActiveSubscribersPageClient.tsx', import.meta.url), 'utf8');
    expect(source).toContain("activeTab");
    expect(source).not.toContain("activeTab === 'SaaS Pricing Plans' &&");
  });

  it('removes unreachable sibling artifacts from the active route leaf', () => {
    const source = readFileSync(new URL('../components/SuperadminSubscriptionsActiveSubscribersPageClient.tsx', import.meta.url), 'utf8');
    expect(source).not.toContain('SuperadminSubscriptionsActiveSubscribersPlanSchema');
    expect(source).not.toContain('SuperadminSubscriptionPlanFormValues');
    expect(source).not.toContain('SUPERADMIN_SUBSCRIPTIONS_SAMPLE_PLANS');
  });
});
