// RESPONSIBILITY: Define stable module-owned constants for communication whatsapp logs; it does not perform I/O or mutate feature state.
// FLOW: Feature consumers -> superadmin_communication/communication_whatsapp_logs/constants/SuperadminCommunicationWhatsappLogsStaticConstants.ts -> typed constants -> component/hook/config behavior.



/** Static module-owned options/status mapping extracted from SuperadminCommunicationWhatsappLogsPageClient.tsx. */
export const SUPERADMIN_COMMUNICATION_WHATSAPP_LOGS_PAGE_CLIENT_SELECTOR = 'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';


/** Static module-owned options/status mapping extracted from SuperadminCommunicationWhatsappLogsPageClient.tsx. */
export const SUPERADMIN_COMMUNICATION_WHATSAPP_LOGS_PAGE_CLIENT_VALID_STATUSES = ['All', 'Pending', 'Sent', 'Delivered', 'Failed'];


/** Static module-owned options/status mapping extracted from SuperadminCommunicationWhatsappLogsPageClient.tsx. */
export const SUPERADMIN_COMMUNICATION_WHATSAPP_LOGS_PAGE_CLIENT_VALID_TYPES = ['All', 'welcome', 'fee_reminder', 'receipt', 'notice', 'renewal'];


/** Static module-owned options/status mapping extracted from SuperadminCommunicationWhatsappLogsPageClient.tsx. */
export const SUPERADMIN_COMMUNICATION_WHATSAPP_LOGS_PAGE_CLIENT_STATUS_BADGE = {
  Pending: 'eng-badge--warning', Sent: 'eng-badge--info', Delivered: 'eng-badge--success', Failed: 'eng-badge--danger',
};


/** Static module-owned options/status mapping extracted from SuperadminCommunicationWhatsappLogsPageClient.tsx. */
export const SUPERADMIN_COMMUNICATION_WHATSAPP_LOGS_PAGE_CLIENT_TYPE_BADGE = {
  welcome: 'eng-badge--info', fee_reminder: 'eng-badge--warning',
  receipt: 'eng-badge--success', notice: 'eng-badge--purple', renewal: 'eng-badge--primary',
};
