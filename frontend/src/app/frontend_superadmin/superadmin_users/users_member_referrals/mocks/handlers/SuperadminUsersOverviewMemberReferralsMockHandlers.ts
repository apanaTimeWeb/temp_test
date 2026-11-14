// RESPONSIBILITY: Define isolated mock handlers for users member referrals; they do not establish a live backend contract.
// FLOW: Feature test harness -> superadmin_users/users_member_referrals/mocks/handlers/SuperadminUsersOverviewMemberReferralsMockHandlers.ts -> module fixtures and declared mock routes -> isolated test response.
/** No verified HTTP contract is supplied for member_referrals; do not invent endpoints or write success. */
export const SUPERADMIN_FINANCE_REFERRALS_MSW_HANDLERS: never[] = [];
