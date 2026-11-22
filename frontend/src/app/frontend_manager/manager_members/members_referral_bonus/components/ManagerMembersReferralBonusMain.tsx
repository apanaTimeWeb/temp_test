'use client';
// RESPONSIBILITY: Provide the page/orchestration entry component for the members referral bonus feature. It does not own backend persistence or cross-feature business logic.

import { ManagerMembersReferralBonusErrorBoundary } from '@/app/frontend_manager/manager_members/members_referral_bonus/components/manager_members_referral_bonus_states/ManagerMembersReferralBonusErrorBoundary';
import { ManagerMembersReferralBonusReferralsClient } from '@/app/frontend_manager/manager_members/members_referral_bonus/components/manager_members_referral_bonus_views/ManagerMembersReferralBonusReferralsClient';

export function ManagerMembersReferralBonusMain() {
  return <ManagerMembersReferralBonusErrorBoundary><ManagerMembersReferralBonusReferralsClient /></ManagerMembersReferralBonusErrorBoundary>;
}
