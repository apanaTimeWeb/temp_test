// RESPONSIBILITY: Define stable module-owned constants for communication whatsapp integration; it does not perform I/O or mutate feature state.
// FLOW: Feature consumers -> superadmin_communication/communication_whatsapp_integration/constants/SuperadminCommunicationWhatsappIntegrationStaticConstants.ts -> typed constants -> component/hook/config behavior.



/** Static module-owned options/status mapping extracted from SuperadminCommunicationWhatsappIntegrationBadge.tsx. */
export const SUPERADMIN_SYSTEM_BADGE_VARIANT_CLASS = {
  default: 'sys-badge--outline', primary: 'sys-badge--primary', success: 'sys-badge--success',
  warning: 'sys-badge--warning', danger: 'sys-badge--danger', info: 'sys-badge--info', outline: 'sys-badge--outline',
};


/** Static module-owned options/status mapping extracted from SuperadminCommunicationWhatsappIntegrationButton.tsx. */
export const SUPERADMIN_SYSTEM_BUTTON_SIZE = { sm: 'sys-btn--sm', md: '', lg: 'sys-btn--lg', icon: 'sys-btn--icon' };


/** Static module-owned options/status mapping extracted from SuperadminCommunicationWhatsappIntegrationPageClient.tsx. */
export const SUPERADMIN_SYSTEM_WHATSAPP_INTEGRATION_PAGE_CLIENT_WEBHOOK_URL = '';


/** Static module-owned options/status mapping extracted from SuperadminCommunicationWhatsappIntegrationButton.tsx. */
export const SUPERADMIN_SYSTEM_BUTTON_VARIANT = {
  primary: 'sys-btn-primary', ghost: 'sys-btn-ghost', destructive: 'sys-btn-danger',
  secondary: 'sys-btn-ghost', link: 'sys-btn-link',
};


/** Static module-owned options/status mapping extracted from SuperadminCommunicationWhatsappIntegrationPageClient.tsx. */
export const SUPERADMIN_SYSTEM_WHATSAPP_INTEGRATION_PAGE_CLIENT_TEST_STATUS = 'idle';
