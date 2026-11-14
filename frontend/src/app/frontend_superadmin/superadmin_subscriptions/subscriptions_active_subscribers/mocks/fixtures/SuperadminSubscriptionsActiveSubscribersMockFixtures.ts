// RESPONSIBILITY: Define local sample fixtures for subscriptions active subscribers; sample data does not represent live customer or backend records.
// FLOW: Feature preview/test -> superadmin_subscriptions/subscriptions_active_subscribers/mocks/fixtures/SuperadminSubscriptionsActiveSubscribersMockFixtures.ts -> typed local fixtures -> screen rendering or assertions.
import type { SuperadminSubscriptionRecord } from '@/app/frontend_superadmin/superadmin_subscriptions/subscriptions_active_subscribers/types/SuperadminSubscriptionsActiveSubscribersTypes';

/** Explicitly synthetic subscriber rows; never use as live SaaS telemetry. */
export const SUPERADMIN_SUBSCRIPTIONS_SAMPLE_SUBSCRIBERS: SuperadminSubscriptionRecord[] = [
  { id: 'sample-tenant-1', tenant: 'Sample Tenant Alpha', plan: 'Enterprise', cycle: 'Yearly', mrr: 15000, status: 'Paid' },
  { id: 'sample-tenant-2', tenant: 'Sample Tenant Beta', plan: 'Pro', cycle: 'Monthly', mrr: 2999, status: 'Due Soon' },
];

/** These plan values are preview fixtures, not the platform's actual pricing catalogue. */
