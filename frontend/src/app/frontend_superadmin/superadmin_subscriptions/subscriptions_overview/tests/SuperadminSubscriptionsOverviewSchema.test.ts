import { describe, expect, it } from 'vitest';
import {
  SUPERADMIN_SUBSCRIPTION_ACTION_SCHEMA,
  SUPERADMIN_NEW_SUBSCRIPTION_SCHEMA,
} from '@/app/frontend_superadmin/superadmin_subscriptions/subscriptions_overview/schemas/superadmin_subscriptions_overview.schema';

describe('Superadmin Subscriptions Overview Schemas', () => {
  it('validates a valid subscription lifecycle action payload', () => {
    const valid = {
      subscriptionId: 'sub-101',
      plan: 'Professional',
      cycle: 'Monthly',
      mrr: 2999,
      status: 'Active',
      gracePeriodDays: 7,
      autoRenewal: true,
      discountPercent: 10,
    };
    const res = SUPERADMIN_SUBSCRIPTION_ACTION_SCHEMA.safeParse(valid);
    expect(res.success).toBe(true);
  });

  it('rejects invalid status not in the 7 lifecycle states', () => {
    const invalid = {
      subscriptionId: 'sub-101',
      plan: 'Professional',
      cycle: 'Monthly',
      mrr: 2999,
      status: 'UnknownStatus',
      gracePeriodDays: 7,
      autoRenewal: true,
    };
    const res = SUPERADMIN_SUBSCRIPTION_ACTION_SCHEMA.safeParse(invalid);
    expect(res.success).toBe(false);
  });

  it('validates a new subscription provisioning payload', () => {
    const validNew = {
      tenant: 'Apex Library',
      email: 'admin@apexlib.org',
      plan: 'Starter',
      cycle: 'Monthly',
      customPrice: 999,
      branchesCount: 1,
      isTrial: true,
    };
    const res = SUPERADMIN_NEW_SUBSCRIPTION_SCHEMA.safeParse(validNew);
    expect(res.success).toBe(true);
  });
});
