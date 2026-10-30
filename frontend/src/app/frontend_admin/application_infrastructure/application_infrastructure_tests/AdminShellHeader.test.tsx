import { render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { AdminShellHeader } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_components/AdminShellHeader';

const translations: Record<string, string> = {
  OPEN_MENU: 'Open menu',
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
  it('does not present invented branch records when the authoritative registry is unavailable', () => {
    render(<AdminShellHeader />);
    const selector = screen.getByRole('combobox');
    expect((selector as HTMLSelectElement).disabled).toBe(true);
    expect(within(selector).getAllByRole('option')).toHaveLength(1);
    expect(within(selector).getByRole('option', { name: 'Branch selection unavailable' })).toBeTruthy();
    expect(within(selector).queryByRole('option', { name: /Kothrud|Nashik|Main Branch|Branch 2/i })).toBeNull();
  });
});
