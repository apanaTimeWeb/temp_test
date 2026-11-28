import '@/app/frontend_manager/manager_members/members_referral_bonus/components/manager_members_referral_bonus_styles/ManagerMembersReferralBonusManager_referral_bonus.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Referral Bonus | Library OS',
  description: 'Manage referral programs, reward payouts, and member referral bonuses',
};

export default function ManagerMembersReferralBonusLayout({ children }: { children: React.ReactNode }) {
  return <div className="mgr-students-theme">{children}</div>;
}
