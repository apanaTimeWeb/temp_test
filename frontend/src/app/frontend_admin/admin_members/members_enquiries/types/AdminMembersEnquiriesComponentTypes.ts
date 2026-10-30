import type { AdminMembersEnquiriesScenario } from '@/app/frontend_admin/admin_members/members_enquiries/tests/harness/bootstrap';
import type { Enquiry } from '@/app/frontend_admin/admin_members/members_enquiries/schemas/AdminMembersEnquiriesSchema';
import type { ReactNode } from 'react';

export interface AdminEnquiriesEnquiryDetailPageViewProps { params: Promise<{ id: string }>; }

export interface AdminEnquiriesEnquiryKanbanCardProps { enq: Enquiry; colClass: string; onClick: () => void; }

export type AdminEnquiriesEnquirySortField = 'name' | 'phone' | 'shift' | 'status' | 'handledBy' | 'addedDate';

export type AdminEnquiriesEnquirySortDirection = 'ascending' | 'descending';

export interface AdminEnquiriesTableProps {
  enquiries: readonly Enquiry[];
  onSelectEnquiry: (enquiry: Enquiry) => void;
}

export type AdminMembersEnquiriesSearchParams = Promise<Record<string, string | string[] | undefined>>;

export interface AdminMembersEnquiriesHarnessProps {
  children: ReactNode;
  scenario?: AdminMembersEnquiriesScenario;
}
