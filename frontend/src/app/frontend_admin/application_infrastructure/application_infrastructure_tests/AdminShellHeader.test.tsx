import { AdminBranchProvider } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_components/AdminBranchProvider';
import { AdminShellHeader } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_components/AdminShellHeader';
import { fireEvent,render,screen,within } from '@testing-library/react';
import { describe,expect,it,vi } from 'vitest';

const translations: Record<string, string> = {
  OPEN_MENU: 'Open menu',
  SELECT_BRANCH: 'Select branch',
  ALL_BRANCHES: 'All Branches',
  BRANCH_SELECTION_UNAVAILABLE: 'Branch selection unavailable',
  GOOD_MORNING: 'Good morning',
  GOOD_AFTERNOON: 'Good afternoon',
  GOOD_EVENING: 'Good evening',
  GOOD_NIGHT: 'Good night',
  WELCOME: 'Welcome',
  ADMIN_GREETING: 'Admin',
  NOTIFICATIONS_UNAVAILABLE: 'Notifications unavailable',
  NOTIFICATIONS_BLOCKED: 'Notifications API/route is not supplied; there are no notifications to display.',
  DEMO_PROFILE_TOOLTIP: 'Demo profile; authenticated identity is not connected',
  LOG_OUT: 'Log out',
  LOG_OUT_TITLE: 'Log out?',
  LOG_OUT_DESCRIPTION: 'Are you sure you want to log out of this session?',
  CANCEL: 'Cancel',
  ADMINISTRATOR: 'Administrator',
  MY_PROFILE: 'My Profile',
};

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => translations[key] ?? key,
  useLocale: () => 'en',
}));
vi.mock('next/link', () => ({ default: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => <a href={href} {...props}>{children}</a> }));
vi.mock('@/app/frontend_admin/application_infrastructure/application_infrastructure_components/AdminShellThemeToggle', () => ({ AdminShellThemeToggle: () => <button type="button">Theme</button> }));
const { toastMock } = vi.hoisted(() => {
  const toastMock = { info: vi.fn(), error: vi.fn(), success: vi.fn() };
  return { toastMock };
});
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

describe('AdminShellHeader logout modal viewport centering contract', () => {
  it('opens centered logout dialog in document.body outside header', () => {
    const { container } = render(
      <AdminBranchProvider>
        <AdminShellHeader />
      </AdminBranchProvider>,
    );

    const header = container.querySelector('header');
    expect(header).toBeTruthy();

    // Dialog is initially not rendered
    expect(screen.queryByRole('dialog')).toBeNull();

    // Click profile dropdown toggle
    const profileBtn = screen.getByTestId('admin_header-AdminShellHeader-control-003');
    fireEvent.click(profileBtn);

    // Click logout button in menu
    const logoutBtn = screen.getByTestId('admin_header-AdminShellHeader-control-logout');
    fireEvent.click(logoutBtn);

    // Logout modal dialog is now rendered in document.body
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeTruthy();
    expect(document.body.contains(dialog)).toBe(true);
    expect(header?.contains(dialog)).toBe(false);

    // Verify dialog has centered fixed positioning classes
    expect(dialog.className).toContain('fixed');
    expect(dialog.className).toContain('inset-0');
    expect(dialog.className).toContain('items-center');
    expect(dialog.className).toContain('justify-center');

    // Title and description are visible
    expect(screen.getByText('Log out?')).toBeTruthy();
    expect(screen.getByText('Are you sure you want to log out of this session?')).toBeTruthy();

    // Click cancel button closes the modal
    const cancelBtn = screen.getByTestId('admin-logout-cancel');
    fireEvent.click(cancelBtn);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('closes logout dialog on Escape key press', () => {
    render(
      <AdminBranchProvider>
        <AdminShellHeader />
      </AdminBranchProvider>,
    );

    // Open modal
    fireEvent.click(screen.getByTestId('admin_header-AdminShellHeader-control-003'));
    fireEvent.click(screen.getByTestId('admin_header-AdminShellHeader-control-logout'));
    expect(screen.getByRole('dialog')).toBeTruthy();

    // Press Escape
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('toggles notifications popover on bell button click and closes on Escape', () => {
    render(
      <AdminBranchProvider>
        <AdminShellHeader />
      </AdminBranchProvider>,
    );

    const bellBtn = screen.getByTestId('admin_header-AdminShellHeader-control-002');
    expect(screen.queryByTestId('admin-notifications-dropdown')).toBeNull();

    // Click to open
    fireEvent.click(bellBtn);
    const dropdown = screen.getByTestId('admin-notifications-dropdown');
    expect(dropdown).toBeTruthy();
    expect(screen.getByText('Notifications')).toBeTruthy();
    expect(screen.getByTestId('admin-notifications-view-all')).toHaveAttribute(
      'href',
      '/admin/admin_communication/communication_notification_center'
    );

    // Mark all read
    const markAllBtn = screen.getByRole('button', { name: /Mark all read/i });
    fireEvent.click(markAllBtn);
    expect(screen.getByText('All caught up')).toBeTruthy();

    // Press Escape closes dropdown
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByTestId('admin-notifications-dropdown')).toBeNull();
  });
});
