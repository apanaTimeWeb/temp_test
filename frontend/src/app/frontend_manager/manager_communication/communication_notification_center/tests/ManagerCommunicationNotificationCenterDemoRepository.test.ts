import { describe, expect, it } from 'vitest';
import { MANAGER_COMMUNICATION_SAMPLE_NOTIFICATION_HISTORY } from '@/app/frontend_manager/manager_communication/communication_notification_center/hooks/ManagerCommunicationNotificationCenterDemoRepository';
import { MANAGER_COMMUNICATION_SAMPLE_NOTIFICATION_HISTORY as FIXTURE_SOURCE } from '@/app/frontend_manager/manager_communication/communication_notification_center/mocks/manager_communication_notification_center_fixtures/ManagerCommunicationNotificationCenterOperationalSampleFixtures';

describe('ManagerCommunicationNotificationCenterDemoRepository', () => {
  it('returns a defensive notification-history snapshot rather than aliasing fixture objects', () => {
    expect(MANAGER_COMMUNICATION_SAMPLE_NOTIFICATION_HISTORY).not.toBe(FIXTURE_SOURCE);
    expect(MANAGER_COMMUNICATION_SAMPLE_NOTIFICATION_HISTORY[0]).not.toBe(FIXTURE_SOURCE[0]);
    expect(MANAGER_COMMUNICATION_SAMPLE_NOTIFICATION_HISTORY[0]).toEqual(FIXTURE_SOURCE[0]);
  });
});
