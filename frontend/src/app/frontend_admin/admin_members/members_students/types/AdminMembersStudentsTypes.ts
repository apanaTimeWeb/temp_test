import type { ADMIN_STUDENTS_STATUSES, ADMIN_STUDENTS_BUSINESS_STATUSES } from '@/app/frontend_admin/admin_members/members_students/config/admin_members_students.url_config';
import type useAdminMembersStudentsMain from '@/app/frontend_admin/admin_members/members_students/hooks/useAdminMembersStudentsMain';
import type { AdminMembersStudentsScenario } from '@/app/frontend_admin/admin_members/members_students/tests/harness/bootstrap';
import type { ReactNode } from 'react';

export type AdminStudentsStatus = (typeof ADMIN_STUDENTS_STATUSES)[number];

export interface AdminStudentsStudent {
  id: string;
  name: string;
  phone: string;
  shift: string;
  seat: string;
  plan: string;
  joinDate: string;
  expiryDate: string;
  status: (typeof ADMIN_STUDENTS_BUSINESS_STATUSES)[number];
  branch: string;
  feeStatus?: 'Paid' | 'Due' | string;
  locker?: string;
  consecutiveAbsent?: number;
  /** Legacy display-only fields remain pending an authoritative backend DTO decision. */
  totalPaid?: string;
  dueFee?: string;
  totalPaidMinor?: number;
  dueFeeMinor?: number;
  currencyCode?: string;
}

export interface AdminStudentsRawStudent {
  id: string;
  fullName?: string;
  name?: string;
  phone?: string;
  shift?: string;
  seat?: string;
  plan?: string;
  joinDate?: string;
  expiryDate?: string;
  status?: string;
  branch?: string;
  feeStatus?: string;
  locker?: string;
  consecutiveAbsent?: number;
  totalPaid?: string;
  dueFee?: string;
  totalPaidMinor?: number;
  dueFeeMinor?: number;
  currencyCode?: string;
}

export interface AdminMembersStudentsViewProps {
  model: ReturnType<typeof useAdminMembersStudentsMain>;
}

export interface AdminStudentsColumnDefinitionsOptions {
  onSelectStudent: (student: AdminStudentsStudent) => void;
}

export interface AdminMembersStudentsHarnessProps {
  children: ReactNode;
  scenario?: AdminMembersStudentsScenario;
}
