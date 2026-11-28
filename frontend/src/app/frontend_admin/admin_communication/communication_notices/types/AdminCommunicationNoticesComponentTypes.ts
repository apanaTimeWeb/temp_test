import type { ReactNode } from 'react';

export type AdminCommunicationNoticesScenario = 'ACTIVE' | 'EMPTY' | 'SERVER_500' | 'TIMEOUT' | 'UNAUTHORIZED';

export interface AdminCommunicationEmptyStateProps {
  title?: string;
  description?: string;
  testId?: string;
  iconTestId?: string;
  titleTestId?: string;
}

export type AdminCommunicationNoticesStatus = 'Active' | 'Expired' | 'Unknown';
export type NoticePriority = 'STANDARD' | 'URGENT' | 'EMERGENCY';

export interface Notice {
  id: string;
  title: string;
  message: string;
  validTill: string;
  postedBy: string;
  postedDate: string;
  status: AdminCommunicationNoticesStatus;
  targetBranch?: string;
  channels?: Array<'whatsapp' | 'email' | 'sms'>;
  priority?: NoticePriority;
  isEmergency?: boolean;
}

export interface AdminCommunicationNoticesHarnessProps {
  children: ReactNode;
  scenario?: AdminCommunicationNoticesScenario;
}
