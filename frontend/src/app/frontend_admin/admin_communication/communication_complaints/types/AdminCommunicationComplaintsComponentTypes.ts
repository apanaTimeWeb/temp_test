import type { AdminCommunicationComplaintFormValues } from '@/app/frontend_admin/admin_communication/communication_complaints/schemas/AdminCommunicationComplaintsSchema';
import type { AdminCommunicationComplaintStatus } from '@/app/frontend_admin/admin_communication/communication_complaints/config/admin_communication_complaints.url_config';
import type { AdminCommunicationComplaintsScenario } from '@/app/frontend_admin/admin_communication/communication_complaints/tests/harness/bootstrap';
import type { ReactNode } from 'react';
import type { SubmitHandler, UseFormReturn } from 'react-hook-form';

export interface AdminCommunicationComplaintAddModalProps {
  form: UseFormReturn<AdminCommunicationComplaintFormValues>;
  onClose: () => void;
  onSubmit: SubmitHandler<AdminCommunicationComplaintFormValues>;
  isDemoMode: boolean;
}

export type CStatus = AdminCommunicationComplaintStatus;

export interface Complaint {
  id: string; title: string; student: string;
  description: string; status: CStatus; date: string;
  resolvedBy: string; resolvedDate: string; resolvedNote: string;
}

export interface AdminCommunicationComplaintsHarnessProps {
  children: ReactNode;
  scenario?: AdminCommunicationComplaintsScenario;
}
