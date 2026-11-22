// RESPONSIBILITY: Define source-level test coverage for communication notification center using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_communication/communication_notification_center/tests/SuperadminCommunicationNotificationCenterHarness.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { SUPERADMIN_COMMUNICATION_NOTIFICATION_CENTER_ROUTES as __SUPERADMIN_COMMUNICATION_NOTIFICATION_CENTER_ROUTES } from "@/app/frontend_superadmin/superadmin_communication/communication_notification_center/config/superadmin_communication_notification_center.url_config";
import { SUPERADMIN_COMMUNICATION_NOTIFICATION_CENTER_QUERY_KEYS } from '@/app/frontend_superadmin/superadmin_communication/communication_notification_center/api/superadmin_communication_notification_center.query_keys';

describe('communication_notification_center standalone contract', () => {
  it('keeps the public route inside its owning domain', () => {
    expect(__SUPERADMIN_COMMUNICATION_NOTIFICATION_CENTER_ROUTES.SUPERADMIN_COMMUNICATION_NOTIFICATION_CENTER_URLS.PAGE).toContain('/superadmin/superadmin_communication');
    expect(__SUPERADMIN_COMMUNICATION_NOTIFICATION_CENTER_ROUTES.SUPERADMIN_COMMUNICATION_NOTIFICATION_CENTER_URLS.SCREEN).toBe("/superadmin/superadmin_communication/communication_notification_center");
  });
  it('uses an isolated query-key namespace', () => {
    expect(SUPERADMIN_COMMUNICATION_NOTIFICATION_CENTER_QUERY_KEYS.all).toEqual(["superadmin", "superadmin_communication", "communication_notification_center"]);
  });
});
