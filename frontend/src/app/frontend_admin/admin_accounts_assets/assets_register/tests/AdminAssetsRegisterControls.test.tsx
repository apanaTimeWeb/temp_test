import { AdminAssetsRegisterPage } from '@/app/frontend_admin/admin_accounts_assets/assets_register/components/AdminAssetsRegisterPage';
import assetsMessages from '@/app/frontend_admin/admin_accounts_assets/assets_register/locales/admin_assets_register_en.json';
import { fireEvent, render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() }),
  usePathname: () => '/admin/admin_accounts_assets/assets_register',
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock('@/app/frontend_admin/application_infrastructure/application_infrastructure_components/AdminBranchProvider', () => ({
  useAdminBranch: () => ({
    selectedBranchId: 'ALL',
    selectedBranch: null,
    isAllBranches: true,
    availableBranches: [{ id: 'branch-1', name: 'Downtown Central' }],
  }),
}));

vi.mock('@/lib/runtimeFeatures', () => ({
  isFrontendDemoModeEnabled: () => true,
}));

describe('Admin Assets Register Controls', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders Export CSV and Export Excel buttons on Assets Register page', () => {
    render(
      <NextIntlClientProvider locale="en" messages={assetsMessages}>
        <AdminAssetsRegisterPage />
      </NextIntlClientProvider>,
    );

    expect(screen.getByTitle('Export Asset Register as CSV')).toBeInTheDocument();
    expect(screen.getByTitle('Export Asset Register as Formatted Excel (.xls)')).toBeInTheDocument();
  });

  it('triggers CSV and Excel downloads when export buttons are clicked', () => {
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
    globalThis.URL.createObjectURL = vi.fn().mockReturnValue('blob:mock-url');
    globalThis.URL.revokeObjectURL = vi.fn();

    render(
      <NextIntlClientProvider locale="en" messages={assetsMessages}>
        <AdminAssetsRegisterPage />
      </NextIntlClientProvider>,
    );

    const csvBtn = screen.getByTitle('Export Asset Register as CSV');
    fireEvent.click(csvBtn);
    expect(clickSpy).toHaveBeenCalledTimes(1);

    const excelBtn = screen.getByTitle('Export Asset Register as Formatted Excel (.xls)');
    fireEvent.click(excelBtn);
    expect(clickSpy).toHaveBeenCalledTimes(2);
  });
});
