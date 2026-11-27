import type { AdminCommunicationWhatsappLogsScenario } from '@/app/frontend_admin/admin_communication/communication_whatsapp_logs/tests/harness/bootstrap';
import type { ReactNode } from 'react';

export type AdminCommunicationWhatsappLogType = 'welcome' | 'fee_reminder' | 'receipt' | 'notice' | 'renewal';
export type AdminCommunicationWhatsappLogStatus = 'Pending' | 'Sent' | 'Delivered' | 'Failed';

/** Typed read-only sample record used only in explicit frontend demo mode. */
export interface AdminCommunicationWhatsappLog {
  id: string;
  dateTime: string;
  phone: string;
  student: string;
  type: AdminCommunicationWhatsappLogType;
  status: AdminCommunicationWhatsappLogStatus;
  error: string;
  message: string;
  branch?: string;
  dispatchMode?: 'auto_api_single' | 'manual_free_web';
}

export interface AdminCommunicationWhatsappLogsHarnessProps {
  children: ReactNode;
  scenario?: AdminCommunicationWhatsappLogsScenario;
}
