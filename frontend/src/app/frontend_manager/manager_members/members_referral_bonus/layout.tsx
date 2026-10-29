import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Referral Bonus | Library OS',
  description: 'Manage referral programs, reward payouts, and member referral bonuses',
};

export default function ManagerMembersReferralBonusLayout({ children }: { children: React.ReactNode }) {
  return <div className="mgr-students-theme">{children}</div>;
}
