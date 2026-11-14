// RESPONSIBILITY: Define compile-time types for billing member finance overview; types alone do not validate runtime payloads.
// FLOW: Feature source -> superadmin_billing/billing_member_finance_overview/types/SuperadminBillingOverviewMemberFinanceOverviewPageClientComponentTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Component and local state types extracted from superadmin_member_finance/superadmin_member_finance_components/superadmin_member_finance_views/superadmin_member_finance_overview_page/SuperadminBillingOverviewMemberFinanceOverviewPageClient.tsx. */
export interface DashboardStats {
  totalCollections: number; collectionsGrowth: number; activeStudents: number;
  expiringSoon: number; suspended: number; totalReferrals: number;
  depositsHeld: number; pendingPromises: number; overdueStudents: number;
  pendingRefunds: number; renewalsDue: number; lateFeeAccrued: number;
}

/**
 * Defines the public RecentPayment contract for billing overview. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 * @property id Stable identifier for the associated record. Declared type: number.
 * @property studentName Display label for the owning feature. Declared type: string.
 * @property studentSmartId Stable identifier for the associated record. Declared type: string.
 * @property amount Monetary or numeric value with units and currency semantics defined by the declared type. Declared type: number.
 * @property mode Value defined by the existing feature-local contract. Declared type: string.
 * @property date Timestamp or date value in the declared type; formatting is handled by the owning view. Declared type: string.
 */
export interface RecentPayment {
  id: number; studentName: string; studentSmartId: string;
  amount: number; mode: string; date: string;
}
