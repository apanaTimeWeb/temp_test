import { describe, expect, it } from 'vitest';
import { maskManagerWhatsappTemplatesPhone } from '@/app/frontend_manager/manager_communication/communication_whatsapp_templates/utils/ManagerCommunicationWhatsappTemplatesUtilities';

describe('maskManagerWhatsappTemplatesPhone', () => {
  it('masks raw phone values without exposing middle digits', () => {
    expect(maskManagerWhatsappTemplatesPhone('9876543210')).toBe('98••••10');
  });
  it('preserves the visible prefix and suffix of already-masked sample values', () => {
    expect(maskManagerWhatsappTemplatesPhone('98****2310')).toBe('98••••2310');
    expect(maskManagerWhatsappTemplatesPhone('+91 98****2310')).toBe('98••••2310');
  });
  it('uses a safe fallback for empty or unusable input', () => {
    expect(maskManagerWhatsappTemplatesPhone('')).toBe('—');
    expect(maskManagerWhatsappTemplatesPhone('123')).toBe('••••');
  });
});
