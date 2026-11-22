// RESPONSIBILITY: Define local sample fixtures for analytics subscription mix; sample data does not represent live customer or backend records.
// FLOW: Feature preview/test -> superadmin_analytics/analytics_subscription_mix/mocks/fixtures/SuperadminAnalyticsSubscriptionMixMockFixtures.ts -> typed local fixtures -> screen rendering or assertions.
/**
 * Explicitly synthetic report fixtures for frontend preview only.
 * These records MUST NOT be described as live platform telemetry until an approved API contract is integrated.
 */
export interface SuperadminReportRevenuePoint {
  month: string;
  mrr: number;
  target: number;
}

/**
 * Defines the public SuperadminReportGrowthPoint contract for analytics subscription mix. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 * @property month Value defined by the existing feature-local contract. Declared type: string.
 * @property active Value defined by the existing feature-local contract. Declared type: number.
 * @property churned Value defined by the existing feature-local contract. Declared type: number.
 */
export interface SuperadminReportGrowthPoint {
  month: string;
  active: number;
  churned: number;
}

/**
 * Defines the public SuperadminReportTenant contract for analytics subscription mix. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 * @property id Stable identifier for the associated record. Declared type: string.
 * @property name Display label for the owning feature. Declared type: string.
 * @property plan Value defined by the existing feature-local contract. Declared type: 'Enterprise' | 'Pro Plan' | 'Basic Plan'.
 * @property mrr Value defined by the existing feature-local contract. Declared type: number.
 * @property students Value defined by the existing feature-local contract. Declared type: number.
 * @property status Status value as represented by the existing feature contract. Declared type: 'Active' | 'Churn Risk'.
 */
export interface SuperadminReportTenant {
  id: string;
  name: string;
  plan: 'Enterprise' | 'Pro Plan' | 'Basic Plan';
  mrr: number;
  students: number;
  status: 'Active' | 'Churn Risk';
}

export const SUPERADMIN_REPORT_REVENUE_FIXTURES: SuperadminReportRevenuePoint[] = [
  { month: 'Nov', mrr: 120000, target: 100000 },
  { month: 'Dec', mrr: 145000, target: 110000 },
  { month: 'Jan', mrr: 135000, target: 120000 },
  { month: 'Feb', mrr: 175000, target: 130000 },
  { month: 'Mar', mrr: 210000, target: 145000 },
  { month: 'Apr', mrr: 245000, target: 160000 },
];

export const SUPERADMIN_REPORT_GROWTH_FIXTURES: SuperadminReportGrowthPoint[] = [
  { month: 'Nov', active: 12, churned: 1 },
  { month: 'Dec', active: 15, churned: 0 },
  { month: 'Jan', active: 14, churned: 2 },
  { month: 'Feb', active: 22, churned: 1 },
  { month: 'Mar', active: 28, churned: 0 },
  { month: 'Apr', active: 35, churned: 1 },
];

export const SUPERADMIN_REPORT_PLAN_FIXTURES = [
  { name: 'Basic Plan', value: 45 },
  { name: 'Pro Plan', value: 35 },
  { name: 'Enterprise', value: 20 },
] as const;

export const SUPERADMIN_REPORT_TENANT_FIXTURES: SuperadminReportTenant[] = [
  { id: 'LIB-001', name: 'Central City Library', plan: 'Enterprise', mrr: 25000, students: 1200, status: 'Active' },
  { id: 'LIB-042', name: 'Westside Study Center', plan: 'Pro Plan', mrr: 15000, students: 800, status: 'Active' },
  { id: 'LIB-018', name: 'Downtown Reading Room', plan: 'Pro Plan', mrr: 12000, students: 650, status: 'Active' },
  { id: 'LIB-007', name: 'Suburban Community Library', plan: 'Basic Plan', mrr: 5000, students: 250, status: 'Active' },
  { id: 'LIB-025', name: 'East End Study Space', plan: 'Basic Plan', mrr: 4500, students: 200, status: 'Churn Risk' },
];
