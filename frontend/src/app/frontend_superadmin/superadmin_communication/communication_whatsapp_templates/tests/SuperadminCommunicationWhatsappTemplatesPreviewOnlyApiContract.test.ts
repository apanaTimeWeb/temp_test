// RESPONSIBILITY: Define source-level test coverage for communication whatsapp templates using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_communication/communication_whatsapp_templates/tests/SuperadminCommunicationWhatsappTemplatesPreviewOnlyApiContract.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { SUPERADMINCOMMUNICATIONWHATSAPPTEMPLATES_API_CONTRACT_STATUS as contractStatus0 } from '@/app/frontend_superadmin/superadmin_communication/communication_whatsapp_templates/api/superadmin_communication_whatsapp_templates.api';
import { describe, expect, it } from 'vitest';

describe('superadmin_communication/communication_whatsapp_templates preview-only API contract', () => {
  it('fails closed until an approved backend contract is supplied', () => {
    expect(contractStatus0.status).toMatch(/^(unavailable|CONTRACT_MISSING)$/);
    expect(contractStatus0.networkCallsEnabled).toBe(false);
    expect(contractStatus0.source).toBe('SUPPLIED_FRONTEND_ARCHIVE');
    expect(contractStatus0.requiredInputs).toEqual(['approved-endpoint', 'request-schema', 'response-schema', 'authorization-contract']);
  });
});
