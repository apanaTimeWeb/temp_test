import { describe, expect, it } from 'vitest';
import { assertManagerCommunicationNotificationCenterApiContract, MANAGERNOTIFICATIONCENTERNOTIFICATIONCENTER_API_CONTRACT_STATUS } from '@/app/frontend_manager/manager_communication/communication_notification_center/api/manager_communication_notification_center.api';
import { MANAGERNOTIFICATIONCENTERNOTIFICATIONCENTER_CONTRACT_GAP_MOCK } from '@/app/frontend_manager/manager_communication/communication_notification_center/mocks/ManagerCommunicationNotificationCenterContractGapMock.ts';
describe('manager_notification_center API contract boundary', () => {
  it('fails closed without making a network request or inventing a response schema', () => {
    expect(MANAGERNOTIFICATIONCENTERNOTIFICATIONCENTER_API_CONTRACT_STATUS).toBe('CONTRACT_NOT_FOUND_IN_WEB_ZIP');
    expect(MANAGERNOTIFICATIONCENTERNOTIFICATIONCENTER_CONTRACT_GAP_MOCK).toMatchObject({ code: 'CONTRACT_NOT_FOUND_IN_WEB_ZIP', status: 501 });
    try { assertManagerCommunicationNotificationCenterApiContract(); throw new Error('Expected contract gap to throw'); } catch (error) { expect(error).toMatchObject({ code: 'CONTRACT_NOT_FOUND_IN_WEB_ZIP', status: 501 }); }
  });
});
