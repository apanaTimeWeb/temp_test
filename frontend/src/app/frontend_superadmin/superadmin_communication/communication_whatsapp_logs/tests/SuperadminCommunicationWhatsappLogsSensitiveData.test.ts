// RESPONSIBILITY: Define source-level test coverage for communication whatsapp logs using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_communication/communication_whatsapp_logs/tests/SuperadminCommunicationWhatsappLogsSensitiveData.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { maskSensitiveData } from '@/app/frontend_superadmin/superadmin_communication/communication_whatsapp_logs/utils/SuperadminCommunicationWhatsappLogsWhatsappLogUtilities';

describe('WhatsApp log PII presentation', () => {
  it('masks all but the last four digits of a full phone value', () => {
    expect(maskSensitiveData('+91 98765 43210')).toBe('********3210');
  });

  it('preserves values already masked by the upstream contract', () => {
    expect(maskSensitiveData('98****0001')).toBe('98****0001');
  });

  it('does not rewrite non-phone short labels', () => {
    expect(maskSensitiveData('1234')).toBe('1234');
  });
});
