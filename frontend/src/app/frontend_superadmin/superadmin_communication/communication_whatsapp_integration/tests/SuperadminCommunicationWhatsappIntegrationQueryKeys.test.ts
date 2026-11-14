// RESPONSIBILITY: Define source-level test coverage for communication whatsapp integration using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_communication/communication_whatsapp_integration/tests/SuperadminCommunicationWhatsappIntegrationQueryKeys.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { SUPERADMIN_COMMUNICATION_WHATSAPP_INTEGRATION_QUERY_KEYS } from '../api/superadmin_communication_whatsapp_integration.query_keys';

describe('communication_whatsapp_integration canonical query-key namespace', () => {
  it('keeps list and detail cache keys scoped to the owning leaf', () => {
    const filters = { status: 'active', page: 1 } as const;
    expect(SUPERADMIN_COMMUNICATION_WHATSAPP_INTEGRATION_QUERY_KEYS.all).toEqual(['superadmin', 'superadmin_communication', 'communication_whatsapp_integration']);
    expect(SUPERADMIN_COMMUNICATION_WHATSAPP_INTEGRATION_QUERY_KEYS.list(filters)).toEqual([...SUPERADMIN_COMMUNICATION_WHATSAPP_INTEGRATION_QUERY_KEYS.all, 'list', filters]);
    expect(SUPERADMIN_COMMUNICATION_WHATSAPP_INTEGRATION_QUERY_KEYS.detail('record-id')).toEqual([...SUPERADMIN_COMMUNICATION_WHATSAPP_INTEGRATION_QUERY_KEYS.all, 'detail', 'record-id']);
  });
});
