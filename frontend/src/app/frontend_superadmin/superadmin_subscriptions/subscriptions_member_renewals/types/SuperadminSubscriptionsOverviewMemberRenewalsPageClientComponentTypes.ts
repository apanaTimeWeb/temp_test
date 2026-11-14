// RESPONSIBILITY: Define compile-time types for subscriptions member renewals; types alone do not validate runtime payloads.
// FLOW: Feature source -> superadmin_subscriptions/subscriptions_member_renewals/types/SuperadminSubscriptionsOverviewMemberRenewalsPageClientComponentTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Component and local state types extracted from superadmin_member_finance/superadmin_member_finance_components/superadmin_member_finance_views/superadmin_member_renewals_page/SuperadminSubscriptionsOverviewMemberRenewalsPageClient.tsx. */
import type { SUPERADMIN_FINANCE_SAMPLE_RENEWALS } from '@/app/frontend_superadmin/superadmin_subscriptions/subscriptions_member_renewals/mocks/fixtures/SuperadminSubscriptionsOverviewMemberRenewalsMockFixtures';

/**
 * Defines the public FilterType contract for subscriptions overview. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 */
export type FilterType = 'expired' | 'expiring_7' | 'expiring_15';

/**
 * Defines the public Renewal contract for subscriptions overview. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 */
export type Renewal = (typeof SUPERADMIN_FINANCE_SAMPLE_RENEWALS)[number];
