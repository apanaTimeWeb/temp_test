import type { Metadata } from 'next';
import '@/app/frontend_manager/manager_members/members_id_card_generator/components/manager_members_id_card_generator_styles/ManagerMembersIdCardGeneratorManager_id_card_generator.css';

export const metadata: Metadata = {
  title: 'ID Card Generator | Library OS',
  description: 'Member Smart ID Card Generator and Preview',
};

export default function ManagerMembersIdCardGeneratorLayout({ children }: { children: React.ReactNode }) {
  return <div className="mgr-students-theme">{children}</div>;
}
