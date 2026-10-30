import type { AdminCommunicationNoticesScenario } from '@/app/frontend_admin/admin_communication/communication_notices/tests/harness/bootstrap';
import type { ReactNode } from 'react';

export interface AdminCommunicationEmptyStateProps {
  title?: string;
  description?: string;
  testId?: string;
  iconTestId?: string;
  titleTestId?: string;
}

export type AdminCommunicationNoticesStatus = 'Active' | 'Expired' | 'Unknown';

export interface Notice {
  id: string; title: string; message: string;
  validTill: string; postedBy: string; postedDate: string;
  status: AdminCommunicationNoticesStatus;
}

export interface AdminCommunicationNoticesHarnessProps {
  children: ReactNode;
  scenario?: AdminCommunicationNoticesScenario;
}
