import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import AdminSettingsSecurityMain from '@/app/frontend_admin/admin_settings/settings_security/components/AdminSettingsSecurityPage';

vi.mock('next-intl', () => ({ useTranslations: (namespace: string) => (key: string) => `${namespace}.${key}` }));
vi.mock('@/lib/runtimeFeatures', () => ({ isFrontendDemoModeEnabled: () => false }));

describe('AdminSettingsSecurityMain without live contracts', () => {
  afterEach(() => vi.restoreAllMocks());

  it('shows a clear unavailable terminal state and does not render synthetic account identities', () => {
    render(<AdminSettingsSecurityMain />);
    expect(screen.getByTestId('admin_security-AdminSettingsSecurityMain-state-api-unavailable')).toBeTruthy();
    expect(screen.queryByText('manager.one@example.invalid')).toBeNull();
    expect(screen.queryByText('192.0.2.10')).toBeNull();
  });

  it('keeps navigation responsive while the selected tab remains unavailable', () => {
    render(<AdminSettingsSecurityMain />);
    fireEvent.click(screen.getByTestId('admin_security-AdminSecurityNavigation-tab-events'));
    expect(screen.getByRole('heading', { name: 'ADMIN_SECURITY.LIVE_UNAVAILABLE_TITLE' })).toBeTruthy();
  });
});
