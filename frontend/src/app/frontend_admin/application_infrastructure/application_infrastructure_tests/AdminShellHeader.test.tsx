import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { AdminShellHeader } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_components/AdminShellHeader';
import { AdminBranchProvider } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_components/AdminBranchProvider';

const translations: Record<string, string> = {
  OPEN_MENU: 'Open menu',
  SELECT_BRANCH: 'Select branch',
  ALL_BRANCHES: 'All Branches',
  BRANCH_SELECTION_UNAVAILABLE: 'Branch selection unavailable',
  GOOD_MORNING: 'Good morning',
  GOOD_AFTERNOON: 'Good afternoon',
  GOOD_EVENING: 'Good evening',
  ADMIN_GREETING: 'Admin',
  NOTIFICATIONS_UNAVAILABLE: 'Notifications unavailable',
  NOTIFICATIONS_BLOCKED: 'Notifications API/route is not supplied; there are no notifications to display.',
  DEMO_PROFILE_TOOLTIP: 'Demo profile; authenticated identity is not connected',
};

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => translations[key] ?? key,
  useLocale: () => 'en',
}));
vi.mock('next/link', () => ({ default: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => <a href={href} {...props}>{children}</a> }));
vi.mock('@/app/frontend_admin/application_infrastructure/application_infrastructure_components/AdminShellThemeToggle', () => ({ AdminShellThemeToggle: () => <button type="button">Theme</button> }));
const toastMock = { info: vi.fn(), error: vi.fn(), success: vi.fn() };
vi.mock('sonner', () => ({ default: toastMock, toast: toastMock, Toaster: () => null }));

describe('AdminShellHeader branch selector contract', () => {
  it('renders an active global branch selector with all configured branches', () => {
    render(
      <AdminBranchProvider>
        <AdminShellHeader />
      </AdminBranchProvider>,
    );
    const selector = screen.getByRole('combobox');
    expect((selector as HTMLSelectElement).disabled).toBe(false);
    const options = within(selector).getAllByRole('option');
    expect(options.length).toBeGreaterThanOrEqual(4);
    expect(within(selector).getByRole('option', { name: 'All Branches' })).toBeTruthy();
    expect(within(selector).getByRole('option', { name: 'Downtown Central' })).toBeTruthy();
    expect(within(selector).getByRole('option', { name: 'Westside Branch' })).toBeTruthy();
    expect(within(selector).getByRole('option', { name: 'North Hub' })).toBeTruthy();

    fireEvent.change(selector, { target: { value: 'BR-001' } });
    expect((selector as HTMLSelectElement).value).toBe('BR-001');
  });
});
