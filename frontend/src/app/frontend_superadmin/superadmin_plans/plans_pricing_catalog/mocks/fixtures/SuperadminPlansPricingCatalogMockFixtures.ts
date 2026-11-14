// RESPONSIBILITY: Define local sample fixtures for plans pricing catalog; sample data does not represent live customer or backend records.
// FLOW: Feature preview/test -> superadmin_plans/plans_pricing_catalog/mocks/fixtures/SuperadminPlansPricingCatalogMockFixtures.ts -> typed local fixtures -> screen rendering or assertions.
import type { SuperadminSubscriptionPlan, SuperadminSubscriptionRecord } from '@/app/frontend_superadmin/superadmin_plans/plans_pricing_catalog/types/SuperadminPlansPricingCatalogTypes';

/** Explicitly synthetic subscriber rows; never use as live SaaS telemetry. */
export const SUPERADMIN_SUBSCRIPTIONS_SAMPLE_SUBSCRIBERS: SuperadminSubscriptionRecord[] = [
  { id: 'sample-tenant-1', tenant: 'Sample Tenant Alpha', plan: 'Enterprise', cycle: 'Yearly', mrr: 15000, status: 'Paid' },
  { id: 'sample-tenant-2', tenant: 'Sample Tenant Beta', plan: 'Pro', cycle: 'Monthly', mrr: 2999, status: 'Due Soon' },
];

/** These plan values are preview fixtures, not the platform's actual pricing catalogue. */
export const SUPERADMIN_SUBSCRIPTIONS_SAMPLE_PLANS: SuperadminSubscriptionPlan[] = [
  { id: 'sample-plan-starter', name: 'Starter', price: 999, branches: 1, members: 150, storage: '1GB', isPopular: false },
  { id: 'sample-plan-pro', name: 'Pro', price: 2999, branches: 5, members: 1000, storage: '10GB', isPopular: true },
];
