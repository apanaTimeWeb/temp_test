import { describe, expect, it } from 'vitest';
import { MANAGER_COMMUNICATION_SAMPLE_WHATSAPP_TEMPLATES } from '@/app/frontend_manager/manager_communication/communication_whatsapp_templates/hooks/ManagerCommunicationWhatsappTemplatesDemoRepository';
import { MANAGER_COMMUNICATION_SAMPLE_WHATSAPP_TEMPLATES as FIXTURE_SOURCE } from '@/app/frontend_manager/manager_communication/communication_whatsapp_templates/mocks/manager_communication_whatsapp_templates_fixtures/ManagerCommunicationWhatsappTemplatesOperationalSampleFixtures';

describe('ManagerCommunicationWhatsappTemplatesDemoRepository', () => {
  it('returns a defensive template snapshot rather than aliasing fixture objects', () => {
    expect(MANAGER_COMMUNICATION_SAMPLE_WHATSAPP_TEMPLATES).not.toBe(FIXTURE_SOURCE);
    expect(MANAGER_COMMUNICATION_SAMPLE_WHATSAPP_TEMPLATES[0]).not.toBe(FIXTURE_SOURCE[0]);
    expect(MANAGER_COMMUNICATION_SAMPLE_WHATSAPP_TEMPLATES[0]).toEqual(FIXTURE_SOURCE[0]);
  });
});
