import { describe, expect, it } from 'vitest';
import { assertManagerCommunicationWhatsappLogsApiContract, MANAGERWHATSAPPLOGSWHATSAPPLOGS_API_CONTRACT_STATUS } from '@/app/frontend_manager/manager_communication/communication_whatsapp_logs/api/manager_communication_whatsapp_logs.api';
import { MANAGERWHATSAPPLOGSWHATSAPPLOGS_CONTRACT_GAP_MOCK } from '@/app/frontend_manager/manager_communication/communication_whatsapp_logs/mocks/ManagerCommunicationWhatsappLogsContractGapMock';
describe('manager_whatsapp_logs API contract boundary', () => {
  it('fails closed without making a network request or inventing a response schema', () => {
    expect(MANAGERWHATSAPPLOGSWHATSAPPLOGS_API_CONTRACT_STATUS).toBe('CONTRACT_NOT_FOUND_IN_WEB_ZIP');
    expect(MANAGERWHATSAPPLOGSWHATSAPPLOGS_CONTRACT_GAP_MOCK).toMatchObject({ code: 'CONTRACT_NOT_FOUND_IN_WEB_ZIP', status: 501 });
    try { assertManagerCommunicationWhatsappLogsApiContract(); throw new Error('Expected contract gap to throw'); } catch (error) { expect(error).toMatchObject({ code: 'CONTRACT_NOT_FOUND_IN_WEB_ZIP', status: 501 }); }
  });
});
