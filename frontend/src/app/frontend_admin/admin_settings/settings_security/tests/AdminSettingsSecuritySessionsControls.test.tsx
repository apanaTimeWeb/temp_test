import { ADMIN_NAVIGATION_GROUPS } from '@/app/frontend_admin/admin_navigation/admin_navigation_sidebar/config/admin_navigation_sidebar_navigation_constants';
import AdminSecurityDeviceSessionsPanel from '@/app/frontend_admin/admin_settings/settings_security/components/AdminSettingsSecurityDeviceSessionsPanel';
import { ADMIN_ROUTES } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_constants/AdminApplicationRoutes';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

describe('Admin Settings Security Sessions & Navigation Controls', () => {
  it('includes Settings Security in sidebar navigation submodules under settings group', () => {
    const settingsGroup = ADMIN_NAVIGATION_GROUPS.find((g) => g.id === 'settings');
    expect(settingsGroup).toBeDefined();
    const securitySub = settingsGroup?.submodules.find(
      (sub) => sub.href === ADMIN_ROUTES.SETTINGS_SECURITY,
    );
    expect(securitySub).toBeDefined();
    expect(securitySub?.labelKey).toBe('SUBMODULE_SETTINGS_SECURITY');
    expect(securitySub?.href).toBe('/admin/admin_settings/settings_security');
  });

  it('renders device sessions with active, enabled REVOKE buttons', () => {
    render(<AdminSecurityDeviceSessionsPanel />);

    const revokeButtons = screen.getAllByRole('button', { name: 'REVOKE' });
    expect(revokeButtons.length).toBeGreaterThan(0);
    expect(revokeButtons.every((b) => !(b as HTMLButtonElement).disabled)).toBe(true);
  });

  it('successfully revokes a device session on clicking REVOKE', () => {
    render(<AdminSecurityDeviceSessionsPanel />);

    const initialArticles = screen.getAllByRole('article');
    expect(initialArticles.length).toBeGreaterThan(0);

    const firstRevoke = screen.getByTestId('admin_security-AdminSettingsSecurityMain-control-revoke-device-demo-1');
    fireEvent.click(firstRevoke);

    expect(screen.queryByTestId('admin_security-AdminSettingsSecurityMain-control-revoke-device-demo-1')).toBeNull();
  });

  it('provides Revoke All Devices button to terminate all sessions at once', () => {
    render(<AdminSecurityDeviceSessionsPanel />);

    const revokeAllBtn = screen.getByTestId('admin-security-revoke-all-sessions-btn');
    expect(revokeAllBtn).toBeDefined();

    fireEvent.click(revokeAllBtn);

    expect(screen.getByText('No active device sessions')).toBeDefined();
  });
});
