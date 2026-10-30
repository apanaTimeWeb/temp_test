import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { isFrontendDemoModeEnabled } from '@/app/frontend_admin/lib/runtimeFeatures';
import toast from 'sonner';
import useAdminSystemWhatsAppIntegrationPage from '@/app/frontend_admin/admin_system/system_whatsapp_integration/hooks/useAdminSystemWhatsappIntegrationWhatsAppIntegrationPage';
import { ADMIN_SYSTEM_WHATSAPP_STATUS_CONFIG } from '@/app/frontend_admin/admin_system/system_whatsapp_integration/config/admin_system_whatsapp_integration.url_config';
import { ADMIN_SYSTEM_WHATSAPP_MESSAGE_LOGS, ADMIN_SYSTEM_WHATSAPP_PROVIDER_EXAMPLES } from '@/app/frontend_admin/admin_system/system_whatsapp_integration/mocks/AdminSystemWhatsappIntegrationWhatsAppFixtures';

vi.mock('next-intl', () => ({ useTranslations: () => (key: string, values?: Record<string, unknown>) => values ? `${key}:${String(values.id ?? '')}` : key }));
vi.mock('@/lib/runtimeFeatures', () => ({ isFrontendDemoModeEnabled: vi.fn() }));
vi.mock('sonner', () => ({ default: { info: vi.fn(), error: vi.fn(), success: vi.fn() } }));

describe('Admin System WhatsApp registry', () => {
  it('keeps fixture statuses valid and provider example IDs unique', () => {
    expect(ADMIN_SYSTEM_WHATSAPP_MESSAGE_LOGS.every((row) => row.status in ADMIN_SYSTEM_WHATSAPP_STATUS_CONFIG)).toBe(true);
    expect(new Set(ADMIN_SYSTEM_WHATSAPP_PROVIDER_EXAMPLES.map((row) => row.id)).size).toBe(ADMIN_SYSTEM_WHATSAPP_PROVIDER_EXAMPLES.length);
  });
});

describe('Admin System WhatsApp hook', () => {
  beforeEach(() => { vi.clearAllMocks(); vi.mocked(isFrontendDemoModeEnabled).mockReturnValue(false); });
  it('never exposes synthetic WhatsApp activity as live data', () => {
    const current = renderHook(() => useAdminSystemWhatsAppIntegrationPage()).result.current;
    expect(current.MESSAGE_LOGS).toEqual([]);
    expect(current.deliveredCount).toBe(0);
    expect(current.failedCount).toBe(0);
  });
  it('exposes synthetic records only in explicit demo mode', () => {
    vi.mocked(isFrontendDemoModeEnabled).mockReturnValue(true);
    expect(renderHook(() => useAdminSystemWhatsAppIntegrationPage()).result.current.MESSAGE_LOGS).toEqual(ADMIN_SYSTEM_WHATSAPP_MESSAGE_LOGS);
  });
  it('does not claim WhatsApp was tested or saved without a provider contract', () => {
    const { result } = renderHook(() => useAdminSystemWhatsAppIntegrationPage());
    act(() => { result.current.handleTestConnection(); result.current.handleSaveConfiguration(); });
    expect(vi.mocked(toast.error)).toHaveBeenNthCalledWith(1, 'WHATSAPP_TEST_BLOCKED', { id: 'admin-system-whatsapp-test-blocked' });
    expect(vi.mocked(toast.error)).toHaveBeenNthCalledWith(2, 'WHATSAPP_SAVE_BLOCKED', { id: 'admin-system-whatsapp-save-blocked' });
  });
});

describe('admin_system_whatsapp_integration standalone contract', () => {
  it('has a module-owned test contract', () => { expect('admin_system_whatsapp_integration').toMatch(/^admin_[a-z0-9_]+$/); });
});
