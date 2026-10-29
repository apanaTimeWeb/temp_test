import type { Metadata } from 'next';
import '@/app/frontend_manager/manager_members/members_new_admission/components/manager_members_new_admission_styles/ManagerMembersNewAdmissionManager_new_admission.css';

export const metadata: Metadata = {
  title: 'New Member Admission | Library OS',
  description: 'Admit new learners, select subscription plan, seat allocation, locker, and fee settlement',
};

export default function ManagerMembersNewAdmissionLayout({ children }: { children: React.ReactNode }) {
  return <div className="mgr-students-theme">{children}</div>;
}
