import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import AdminSettingsSupportMain from '@/app/frontend_admin/admin_settings/settings_support/components/AdminSettingsSupportPage';

vi.mock('next-intl', () => ({
  useTranslations: (namespace: string) => (key: string) => `${namespace}.${key}`,
}));
vi.mock('@/lib/runtimeFeatures', () => ({ isFrontendDemoModeEnabled: () => false }));

describe('AdminSettingsSupportMain without a support API contract', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders an explicit unavailable state rather than a blank ticket tab', () => {
    render(<AdminSettingsSupportMain />);
    expect(screen.getByRole('heading', { name: 'ADMIN_SUPPORT.UNAVAILABLE_TICKETS_TITLE' })).toBeTruthy();
  });

  it('shows explicit terminal states for unavailable status and announcement feeds', () => {
    render(<AdminSettingsSupportMain />);
    fireEvent.click(screen.getByTestId('admin_support-AdminSettingsSupportMain-navigation-status'));
    expect(screen.getByRole('heading', { name: 'ADMIN_SUPPORT.UNAVAILABLE_STATUS_TITLE' })).toBeTruthy();
    fireEvent.click(screen.getByTestId('admin_support-AdminSettingsSupportMain-navigation-announcements'));
    expect(screen.getByRole('heading', { name: 'ADMIN_SUPPORT.UNAVAILABLE_ANNOUNCEMENTS_TITLE' })).toBeTruthy();
  });
});
