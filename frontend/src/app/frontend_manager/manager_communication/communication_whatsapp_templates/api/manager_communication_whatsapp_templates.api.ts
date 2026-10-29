/** Fail-closed: notices/complaints response shapes are not a template API contract. */
import type { ManagerCommunicationWhatsappTemplatesComplaint, ManagerCommunicationWhatsappTemplatesNotice } from '@/app/frontend_manager/manager_communication/communication_whatsapp_templates/types/ManagerCommunicationWhatsappTemplatesTypes';
export const MANAGER_WHATSAPP_TEMPLATES_API_CONTRACT_STATUS = 'CONTRACT_NOT_FOUND_IN_WEB_ZIP' as const;

export async function fetchManagerWhatsappTemplatesNotices(): Promise<ManagerCommunicationWhatsappTemplatesNotice[]> {
  throw Object.assign(new Error('CONTRACT_NOT_FOUND_IN_WEB_ZIP: authoritative WhatsApp template API contract is not supplied.'), { code: 'CONTRACT_NOT_FOUND_IN_WEB_ZIP' as const, status: 501 as const });
}

export async function fetchManagerWhatsappTemplatesComplaints(): Promise<ManagerCommunicationWhatsappTemplatesComplaint[]> {
  throw Object.assign(new Error('CONTRACT_NOT_FOUND_IN_WEB_ZIP: authoritative WhatsApp template API contract is not supplied.'), { code: 'CONTRACT_NOT_FOUND_IN_WEB_ZIP' as const, status: 501 as const });
}

