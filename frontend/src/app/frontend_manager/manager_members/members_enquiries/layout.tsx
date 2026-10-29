import type { Metadata } from 'next';
import '@/app/frontend_manager/manager_members/members_enquiries/components/manager_members_enquiries_styles/ManagerMembersEnquiriesManager_enquiries.css';

export const metadata: Metadata = {
  title: 'Enquiries CRM | Library OS',
  description: 'Manage prospect inquiries, follow-up timeline, conversion pipeline, and kanban board',
};

export default function ManagerMembersEnquiriesInnerLayout({ children }: { children: React.ReactNode }) {
  return <div className="crm-theme">{children}</div>;
}
