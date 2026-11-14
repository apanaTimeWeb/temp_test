// RESPONSIBILITY: Define compile-time types for users member trust score; types alone do not validate runtime payloads.
// FLOW: Feature source -> superadmin_users/users_member_trust_score/types/SuperadminUsersOverviewMemberTrustScorePageClientComponentTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Component and local state types extracted from superadmin_member_finance/superadmin_member_finance_components/superadmin_member_finance_views/superadmin_member_trust_score_page/SuperadminUsersOverviewMemberTrustScorePageClient.tsx. */
export type Student = {
  rank: number;
  studentName: string;
  smartId: string;
  shift: 'Morning' | 'Evening' | 'Full Day';
  trustScore: number;
  totalPromises: number;
  timesChanged: number;
  fulfilledCount: number;
  badge: 'reliable' | 'moderate' | 'low';
};

/**
 * Defines the public TrustTone contract for users overview. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 */
export type TrustTone = 'success' | 'warning' | 'danger';
