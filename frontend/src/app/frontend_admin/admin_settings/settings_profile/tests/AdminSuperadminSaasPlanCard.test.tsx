// @vitest-environment jsdom
import { NextIntlClientProvider } from 'next-intl';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import messages from '@/app/frontend_admin/admin_settings/settings_profile/locales/admin_settings_profile_en.json';
import AdminSettingsProfileReadOnlyPanels from '@/app/frontend_admin/admin_settings/settings_profile/components/AdminSettingsProfileReadOnlyPanels';

const { toastMock } = vi.hoisted(() => {
  const toastMock = { info: vi.fn(), error: vi.fn(), success: vi.fn() };
  return { toastMock };
});
vi.mock('sonner', () => ({ default: toastMock, toast: toastMock, Toaster: () => null }));

describe('AdminSettingsProfileReadOnlyPanels SuperAdmin SaaS Plan & Branch Entitlement', () => {
  it('renders SuperAdmin SaaS license details and quota progress bars under subscription view', () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <AdminSettingsProfileReadOnlyPanels view="subscription" />
      </NextIntlClientProvider>
    );

    // Section title and SuperAdmin badge
    expect(screen.getByTestId('admin-superadmin-plan-section')).toBeTruthy();
    expect(screen.getByText('Enterprise Multi-Branch Suite')).toBeTruthy();
    expect(screen.getByText(/SuperAdmin SaaS License/i)).toBeTruthy();
    expect(screen.getByText(/Active Plan • Auto-Renew Enabled/i)).toBeTruthy();
    expect(screen.getByText(/SuperAdmin \(LibraryOS Platform Cloud\)/i)).toBeTruthy();

    // Contract details
    expect(screen.getByText('₹29,999 / year')).toBeTruthy();
    expect(screen.getByText(/LIC-LIBOS-2026-X89/i)).toBeTruthy();
    expect(screen.getByText(/99.9% Uptime/i)).toBeTruthy();

    // Quotas
    expect(screen.getByText('3/5')).toBeTruthy();
    expect(screen.getByText('380/500')).toBeTruthy();
    expect(screen.getByText('8,450/10,000')).toBeTruthy();
    expect(screen.getByText('12/20')).toBeTruthy();

    // Features
    expect(screen.getByText('Centralized Multi-Branch Governance')).toBeTruthy();
    expect(screen.getByText('Automated Turnstile RFID & Biometric Gate Sync')).toBeTruthy();

    // Upgrade action button triggers toast
    const upgradeBtn = screen.getByRole('button', { name: /Contact SuperAdmin to Upgrade/i });
    expect(upgradeBtn).toBeTruthy();
    fireEvent.click(upgradeBtn);
    expect(toastMock.success).toHaveBeenCalledWith(
      'Upgrade request sent to SuperAdmin! Our team will contact you shortly.'
    );

    // Download invoice triggers toast
    const invoiceBtn = screen.getByRole('button', { name: /Download Invoice/i });
    expect(invoiceBtn).toBeTruthy();
    fireEvent.click(invoiceBtn);
    expect(toastMock.success).toHaveBeenCalledWith(
      'Downloading SuperAdmin SaaS Invoice #INV-2026-092...'
    );
  });

  it('keeps profile view clean and focused on personal profile overview', () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <AdminSettingsProfileReadOnlyPanels view="profile" />
      </NextIntlClientProvider>
    );

    // Profile overview should render without the subscription plan section
    expect(screen.queryByTestId('admin-superadmin-plan-section')).toBeNull();
    expect(screen.getByText('Verified Administrator')).toBeTruthy();
  });
});
