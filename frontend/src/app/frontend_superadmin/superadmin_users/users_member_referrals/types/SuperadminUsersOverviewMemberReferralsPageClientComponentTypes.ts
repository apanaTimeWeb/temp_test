// RESPONSIBILITY: Define compile-time types for users member referrals; types alone do not validate runtime payloads.
// FLOW: Feature source -> superadmin_users/users_member_referrals/types/SuperadminUsersOverviewMemberReferralsPageClientComponentTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Component and local state types extracted from superadmin_member_finance/superadmin_member_finance_components/superadmin_member_finance_views/superadmin_member_referrals_page/SuperadminUsersOverviewMemberReferralsPageClient.tsx. */
export type Referrer = {
  id: number;
  name: string;
  smartId: string;
  referredNames: string[];
  referredCount: number;
  bonusEarned: number;
  redeemed: number;
  balance: number;
};
