// RESPONSIBILITY: Define compile-time types for subscriptions member auto suspend policy; types alone do not validate runtime payloads.
// FLOW: Feature source -> superadmin_subscriptions/subscriptions_member_auto_suspend_policy/types/SuperadminSubscriptionsOverviewMemberAutoSuspendPolicyPageClientComponentTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Component and local state types extracted from superadmin_member_finance/superadmin_member_finance_components/superadmin_member_finance_views/superadmin_member_auto_suspend_policy_page/SuperadminSubscriptionsOverviewMemberAutoSuspendPolicyPageClient.tsx. */
export type Config = { daysBeforeSuspend: number; currentlySuspended: number; autoRestoredThisMonth: number; manualRestores: number };

/**
 * Defines the public SuspendedStudent contract for subscriptions overview. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 * @property id Stable identifier for the associated record. Declared type: number.
 * @property studentId Stable identifier for the associated record. Declared type: number.
 * @property studentName Display label for the owning feature. Declared type: string.
 * @property smartId Stable identifier for the associated record. Declared type: string.
 * @property seat Value defined by the existing feature-local contract. Declared type: string.
 * @property shift Value defined by the existing feature-local contract. Declared type: string.
 * @property daysOverdue Value defined by the existing feature-local contract. Declared type: number.
 * @property suspendedSince Value defined by the existing feature-local contract. Declared type: string.
 */
export type SuspendedStudent = { id: number; studentId: number; studentName: string; smartId: string; seat: string; shift: string; daysOverdue: number; suspendedSince: string };
