/**
 * Module-owned, sample-only repository implementation. Each exported collection/object is a defensive
 * snapshot of the authored fixture data; these values are not a persistence or API contract.
 */
import type {
  ManagerCommunicationWhatsappLogsNotificationHistoryRow as ManagerCommunicationWhatsappLogsNotificationHistoryRowFixture,
  Template as TemplateFixture,
  WaLog as WaLogFixture,
} from '@/app/frontend_manager/manager_communication/communication_whatsapp_logs/config/manager_communication_whatsapp_logs.demo_data';
import {
  MANAGER_COMMUNICATION_SAMPLE_NOTIFICATION_HISTORY as MANAGER_COMMUNICATION_SAMPLE_NOTIFICATION_HISTORYFixture,
  MANAGER_COMMUNICATION_SAMPLE_WHATSAPP_LOGS as MANAGER_COMMUNICATION_SAMPLE_WHATSAPP_LOGSFixture,
  MANAGER_COMMUNICATION_SAMPLE_WHATSAPP_TEMPLATES as MANAGER_COMMUNICATION_SAMPLE_WHATSAPP_TEMPLATESFixture,
} from '@/app/frontend_manager/manager_communication/communication_whatsapp_logs/config/manager_communication_whatsapp_logs.demo_data';

export type WaLog = WaLogFixture;
export type Template = TemplateFixture;
export type ManagerCommunicationWhatsappLogsNotificationHistoryRow = ManagerCommunicationWhatsappLogsNotificationHistoryRowFixture;
export const MANAGER_COMMUNICATION_SAMPLE_WHATSAPP_LOGS = MANAGER_COMMUNICATION_SAMPLE_WHATSAPP_LOGSFixture.map((record) => (typeof record === 'object' && record !== null ? { ...record } : record));
export const MANAGER_COMMUNICATION_SAMPLE_WHATSAPP_TEMPLATES = MANAGER_COMMUNICATION_SAMPLE_WHATSAPP_TEMPLATESFixture.map((record) => (typeof record === 'object' && record !== null ? { ...record } : record));
export const MANAGER_COMMUNICATION_SAMPLE_NOTIFICATION_HISTORY = MANAGER_COMMUNICATION_SAMPLE_NOTIFICATION_HISTORYFixture.map((record) => (typeof record === 'object' && record !== null ? { ...record } : record));
