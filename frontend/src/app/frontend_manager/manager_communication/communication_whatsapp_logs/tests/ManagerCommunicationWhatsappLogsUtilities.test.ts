import { describe, expect, it } from 'vitest';
import { maskManagerWhatsappLogsPhone } from '@/app/frontend_manager/manager_communication/communication_whatsapp_logs/utils/ManagerCommunicationWhatsappLogsUtilities';

describe('maskManagerWhatsappLogsPhone', () => {
  it('masks raw phone values without exposing middle digits', () => {
    expect(maskManagerWhatsappLogsPhone('9876543210')).toBe('98••••10');
  });
  it('preserves the visible prefix and suffix of already-masked sample values', () => {
    expect(maskManagerWhatsappLogsPhone('98****2310')).toBe('98••••2310');
    expect(maskManagerWhatsappLogsPhone('+91 98****2310')).toBe('98••••2310');
  });
  it('uses a safe fallback for empty or unusable input', () => {
    expect(maskManagerWhatsappLogsPhone('')).toBe('—');
    expect(maskManagerWhatsappLogsPhone('123')).toBe('••••');
  });
});
