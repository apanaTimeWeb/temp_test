import { describe, expect, it } from 'vitest';
import { managerCommunicationComplaintResponseListSchema, managerCommunicationNoticeResponseListSchema, managerCommunicationComplaintResponseSchema, managerCommunicationNoticeResponseSchema } from '@/app/frontend_manager/manager_communication/communication_whatsapp_templates/schemas/ManagerCommunicationWhatsappTemplatesSchema';
import { MANAGER_COMMUNICATION_MOCK_COMPLAINT_RESPONSE, MANAGER_COMMUNICATION_MOCK_NOTICE_RESPONSE } from '@/app/frontend_manager/manager_communication/communication_whatsapp_templates/mocks/manager_communication_whatsapp_templates_fixtures/ManagerCommunicationWhatsappTemplatesMockFixtures';

describe('manager communication response schemas', () => {
  it('keeps module-owned read fixtures aligned with the validated response contracts', () => {
    expect(managerCommunicationNoticeResponseListSchema.safeParse(MANAGER_COMMUNICATION_MOCK_NOTICE_RESPONSE).success).toBe(true);
    expect(managerCommunicationComplaintResponseListSchema.safeParse(MANAGER_COMMUNICATION_MOCK_COMPLAINT_RESPONSE).success).toBe(true);
  });
  it('rejects complaint statuses outside the declared contract', () => {
    expect(managerCommunicationComplaintResponseSchema.safeParse({ id: 'c1', subject: 'Example', description: 'Example', createdAt: '2026-01-01', status: 'unknown' }).success).toBe(false);
  });
  it('rejects malformed and impossible calendar dates at the API boundary', () => {
    expect(managerCommunicationNoticeResponseSchema.safeParse({ id: 'n1', title: 'Notice', message: 'Body', createdAt: '2026-02-30', validTill: '2026-03-01' }).success).toBe(false);
    expect(managerCommunicationComplaintResponseSchema.safeParse({ id: 'c1', subject: 'Example', description: 'Example', createdAt: 'not-a-date', status: 'open' }).success).toBe(false);
    expect(managerCommunicationComplaintResponseSchema.safeParse({ id: 'c1', subject: 'Example', description: 'Example', createdAt: '2026-02-30T10:00:00Z', status: 'open' }).success).toBe(false);
  });
  it('accepts a valid date-only calendar value', () => {
    expect(managerCommunicationComplaintResponseSchema.safeParse({ id: 'c1', subject: 'Example', description: 'Example', createdAt: '2024-02-29', status: 'open' }).success).toBe(true);
  });
  it('requires notice identifiers and required text fields', () => {
    expect(managerCommunicationNoticeResponseSchema.safeParse({ title: 'Notice' }).success).toBe(false);
  });
});
