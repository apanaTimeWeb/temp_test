import { describe, expect, it } from 'vitest';
import { maskManagerNoticesPhone } from '@/app/frontend_manager/manager_communication/communication_notices/utils/ManagerCommunicationNoticesUtilities';

describe('maskManagerNoticesPhone', () => {
  it('masks raw phone values without exposing middle digits', () => {
    expect(maskManagerNoticesPhone('9876543210')).toBe('98••••10');
  });
  it('preserves the visible prefix and suffix of already-masked sample values', () => {
    expect(maskManagerNoticesPhone('98****2310')).toBe('98••••2310');
    expect(maskManagerNoticesPhone('+91 98****2310')).toBe('98••••2310');
  });
  it('uses a safe fallback for empty or unusable input', () => {
    expect(maskManagerNoticesPhone('')).toBe('—');
    expect(maskManagerNoticesPhone('123')).toBe('••••');
  });
});
