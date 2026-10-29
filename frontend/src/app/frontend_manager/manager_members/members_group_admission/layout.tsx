import type { Metadata } from 'next';
import '@/app/frontend_manager/manager_members/members_group_admission/components/manager_members_group_admission_styles/ManagerMembersGroupAdmissionManager_group_admission.css';

export const metadata: Metadata = {
  title: 'Group Admission | Library OS',
  description: 'Bulk register batches of learners, upload student Excel/CSV spreadsheets, and batch allocate seats',
};

export default function ManagerMembersGroupAdmissionLayout({ children }: { children: React.ReactNode }) {
  return <div className="mgr-students-theme">{children}</div>;
}
