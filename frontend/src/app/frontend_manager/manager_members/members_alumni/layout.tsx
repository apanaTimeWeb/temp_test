import type { Metadata } from 'next';
import '@/app/frontend_manager/manager_members/members_alumni/components/manager_members_alumni_styles/ManagerMembersAlumniManager_alumni.css';

export const metadata: Metadata = {
  title: 'Alumni Directory | Library OS',
  description: 'Track graduated learners, examination accomplishments, and alumni network outreach',
};

export default function ManagerMembersAlumniLayout({ children }: { children: React.ReactNode }) {
  return <div className="mgr-students-theme">{children}</div>;
}
