import { describe, expect, it } from 'vitest';
import { maskManagerNotificationCenterPhone } from '@/app/frontend_manager/manager_communication/communication_notification_center/utils/ManagerCommunicationNotificationCenterUtilities';

describe('maskManagerNotificationCenterPhone', () => {
  it('masks raw phone values without exposing middle digits', () => {
    expect(maskManagerNotificationCenterPhone('9876543210')).toBe('98••••10');
  });
  it('preserves the visible prefix and suffix of already-masked sample values', () => {
    expect(maskManagerNotificationCenterPhone('98****2310')).toBe('98••••2310');
    expect(maskManagerNotificationCenterPhone('+91 98****2310')).toBe('98••••2310');
  });
  it('uses a safe fallback for empty or unusable input', () => {
    expect(maskManagerNotificationCenterPhone('')).toBe('—');
    expect(maskManagerNotificationCenterPhone('123')).toBe('••••');
  });
});
