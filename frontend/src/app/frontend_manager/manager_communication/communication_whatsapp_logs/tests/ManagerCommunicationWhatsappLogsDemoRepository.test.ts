import { describe, expect, it } from 'vitest';
import { MANAGER_COMMUNICATION_SAMPLE_WHATSAPP_LOGS } from '@/app/frontend_manager/manager_communication/communication_whatsapp_logs/hooks/ManagerCommunicationWhatsappLogsDemoRepository';
import { MANAGER_COMMUNICATION_SAMPLE_WHATSAPP_LOGS as FIXTURE_SOURCE } from '@/app/frontend_manager/manager_communication/communication_whatsapp_logs/mocks/manager_communication_whatsapp_logs_fixtures/ManagerCommunicationWhatsappLogsOperationalSampleFixtures';

describe('ManagerCommunicationWhatsappLogsDemoRepository', () => {
  it('returns a defensive sample snapshot rather than aliasing fixture objects', () => {
    expect(MANAGER_COMMUNICATION_SAMPLE_WHATSAPP_LOGS).not.toBe(FIXTURE_SOURCE);
    expect(MANAGER_COMMUNICATION_SAMPLE_WHATSAPP_LOGS[0]).not.toBe(FIXTURE_SOURCE[0]);
    expect(MANAGER_COMMUNICATION_SAMPLE_WHATSAPP_LOGS[0]).toEqual(FIXTURE_SOURCE[0]);
  });
});
