// RESPONSIBILITY: Define isolated mock handlers for communication notification center; they do not establish a live backend contract.
// FLOW: Feature test harness -> superadmin_communication/communication_notification_center/mocks/handlers/SuperadminCommunicationNotificationCenterMockHandlers.ts -> module fixtures and declared mock routes -> isolated test response.
/** No verified HTTP contract is supplied for communication_notification_center; do not invent endpoints or write success. */
export const SUPERADMIN_COMMUNICATION_NOTIFICATION_CENTER_MSW_HANDLERS: never[] = [];
