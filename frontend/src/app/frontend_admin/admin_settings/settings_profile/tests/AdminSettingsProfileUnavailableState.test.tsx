import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import AdminSettingsProfileMain from '@/app/frontend_admin/admin_settings/settings_profile/page';

vi.mock('next-intl', () => ({
  useTranslations: (namespace: string) => (key: string) => `${namespace}.${key}`,
}));
vi.mock('@/lib/runtimeFeatures', () => ({ isFrontendDemoModeEnabled: () => false }));

describe('AdminSettingsProfileMain without host identity/session contracts', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders one explicit unavailable panel in non-demo mode', () => {
    render(<AdminSettingsProfileMain />);
    expect(screen.getByTestId('admin_profile-AdminSettingsProfileMain-state-tab-unavailable')).toBeTruthy();
    expect(screen.getByTestId('admin_profile-AdminSettingsProfileMain-state-api-unavailable')).toBeTruthy();
    expect(screen.queryByText('admin@smartlibrary.example')).toBeNull();
    expect(screen.getAllByTestId('admin_profile-AdminSettingsProfileMain-state-tab-unavailable')).toHaveLength(1);
  });

  it('keeps the selected tab local while showing its explicit unavailable state', () => {
    render(<AdminSettingsProfileMain />);
    fireEvent.click(screen.getByTestId('admin_profile-AdminSettingsProfileMain-navigation-sessions'));
    expect(screen.getByRole('heading', { name: /ADMIN_PROFILE\.NAV_SESSIONS.*ADMIN_PROFILE\.UNAVAILABLE_SUFFIX/ })).toBeTruthy();
  });
});
