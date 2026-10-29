import { describe, expect, it } from 'vitest';
import { maskManagerComplaintsPhone } from '@/app/frontend_manager/manager_communication/communication_complaints/utils/ManagerCommunicationComplaintsUtilities';

describe('maskManagerComplaintsPhone', () => {
  it('masks raw phone values without exposing middle digits', () => {
    expect(maskManagerComplaintsPhone('9876543210')).toBe('98••••10');
  });
  it('preserves the visible prefix and suffix of already-masked sample values', () => {
    expect(maskManagerComplaintsPhone('98****2310')).toBe('98••••2310');
    expect(maskManagerComplaintsPhone('+91 98****2310')).toBe('98••••2310');
  });
  it('uses a safe fallback for empty or unusable input', () => {
    expect(maskManagerComplaintsPhone('')).toBe('—');
    expect(maskManagerComplaintsPhone('123')).toBe('••••');
  });
});
