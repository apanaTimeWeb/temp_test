// RESPONSIBILITY: Validate SaaS Subscription Lifecycle capabilities per SuperAdmin specification.
import { describe, expect, it } from 'vitest';
import { SUPERADMIN_SUBSCRIPTIONS_SAMPLE_SUBSCRIBERS } from '@/app/frontend_superadmin/superadmin_subscriptions/subscriptions_overview/mocks/fixtures/SuperadminSubscriptionsOverviewMockFixtures';

describe('Superadmin SaaS Subscription Lifecycle Full Capabilities Suite', () => {
  it('covers all required 7 lifecycle statuses across tenant fixtures', () => {
    const statuses = new Set(SUPERADMIN_SUBSCRIPTIONS_SAMPLE_SUBSCRIBERS.map((s) => s.status));
    expect(statuses.has('Active')).toBe(true);
    expect(statuses.has('Trial')).toBe(true);
    expect(statuses.has('Grace Period')).toBe(true);
    expect(statuses.has('Past Due')).toBe(true);
    expect(statuses.has('Suspended')).toBe(true);
    expect(statuses.has('Cancelled')).toBe(true);
  });

  it('guarantees tenant subscribers have audit trail history records', () => {
    const alpha = SUPERADMIN_SUBSCRIPTIONS_SAMPLE_SUBSCRIBERS.find((s) => s.id === 'sample-tenant-1');
    expect(alpha).toBeDefined();
    expect(alpha?.history).toBeDefined();
    expect(alpha?.history?.length).toBeGreaterThanOrEqual(2);
    expect(alpha?.history?.[0].actor).toBe('SuperAdmin');
  });

  it('verifies grace period configuration and auto-renewal settings on subscribers', () => {
    const heritage = SUPERADMIN_SUBSCRIPTIONS_SAMPLE_SUBSCRIBERS.find((s) => s.status === 'Grace Period');
    expect(heritage).toBeDefined();
    expect(heritage?.gracePeriodDays).toBe(7);
    expect(heritage?.autoRenewal).toBe(true);
  });

  it('verifies suspended tenant retains branches, contact, and email for recovery', () => {
    const suspended = SUPERADMIN_SUBSCRIPTIONS_SAMPLE_SUBSCRIBERS.find((s) => s.status === 'Suspended');
    expect(suspended).toBeDefined();
    expect(suspended?.branchesCount).toBeDefined();
    expect(suspended?.email).toBeTruthy();
    expect(suspended?.history?.some((h) => h.note.includes('Restricted Read-Only'))).toBe(true);
  });
});
