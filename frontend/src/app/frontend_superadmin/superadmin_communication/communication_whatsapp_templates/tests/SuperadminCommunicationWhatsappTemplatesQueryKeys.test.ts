// RESPONSIBILITY: Define source-level test coverage for communication whatsapp templates using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_communication/communication_whatsapp_templates/tests/SuperadminCommunicationWhatsappTemplatesQueryKeys.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { SUPERADMIN_COMMUNICATION_WHATSAPP_TEMPLATES_QUERY_KEYS } from '@/app/frontend_superadmin/superadmin_communication/communication_whatsapp_templates/api/superadmin_communication_whatsapp_templates.query_keys';

describe('communication_whatsapp_templates canonical query-key namespace', () => {
  it('keeps list and detail cache keys scoped to the owning leaf', () => {
    const filters = { status: 'active', page: 1 } as const;
    expect(SUPERADMIN_COMMUNICATION_WHATSAPP_TEMPLATES_QUERY_KEYS.all).toEqual(['superadmin', 'superadmin_communication', 'communication_whatsapp_templates']);
    expect(SUPERADMIN_COMMUNICATION_WHATSAPP_TEMPLATES_QUERY_KEYS.list(filters)).toEqual([...SUPERADMIN_COMMUNICATION_WHATSAPP_TEMPLATES_QUERY_KEYS.all, 'list', filters]);
    expect(SUPERADMIN_COMMUNICATION_WHATSAPP_TEMPLATES_QUERY_KEYS.detail('record-id')).toEqual([...SUPERADMIN_COMMUNICATION_WHATSAPP_TEMPLATES_QUERY_KEYS.all, 'detail', 'record-id']);
  });
});
