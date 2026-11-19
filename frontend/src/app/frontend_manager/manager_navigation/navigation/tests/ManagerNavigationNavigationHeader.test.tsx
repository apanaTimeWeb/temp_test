// @vitest-environment jsdom
import { NextIntlClientProvider } from 'next-intl';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import messages from '@/app/frontend_manager/manager_navigation/navigation/locales/manager_navigation_navigation_domain_en.json';
import ManagerNavigationHeader from '@/app/frontend_manager/manager_navigation/navigation/components/ManagerNavigationNavigationHeader';

const { toastMock } = vi.hoisted(() => {
  const toastMock = { info: vi.fn(), error: vi.fn(), success: vi.fn() };
  return { toastMock };
});
vi.mock('sonner', () => ({ default: toastMock, toast: toastMock, Toaster: () => null }));
vi.mock('@/components/ThemeToggle', () => ({ ThemeToggle: () => <button type="button">Theme</button> }));

function renderHeader(props: { collapsed?: boolean; onMobileOpen?: () => void } = {}) {
  const onMobileOpen = props.onMobileOpen ?? vi.fn();
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <ManagerNavigationHeader
        collapsed={props.collapsed ?? false}
        onMobileOpen={onMobileOpen}
      />
    </NextIntlClientProvider>,
  );
}

describe('ManagerNavigationNavigationHeader notification dropdown contract', () => {
  it('renders the header with notification bell and unread dot', () => {
    renderHeader();

    expect(screen.getByTestId('manager-header')).toBeTruthy();
    const bellBtn = screen.getByTestId('manager-bell-btn');
    expect(bellBtn).toBeTruthy();
    expect(bellBtn.getAttribute('aria-expanded')).toBe('false');

    // Popover is closed initially
    expect(screen.queryByTestId('manager-notifications-dropdown')).toBeNull();
  });

  it('toggles notifications popover on bell click and closes on Escape', () => {
    renderHeader();

    const bellBtn = screen.getByTestId('manager-bell-btn');

    // Open notifications
    fireEvent.click(bellBtn);
    expect(screen.getByTestId('manager-notifications-dropdown')).toBeTruthy();
    expect(screen.getByText('Notifications')).toBeTruthy();
    expect(screen.getByText(/3 New/i)).toBeTruthy();

    // Verify manager operational notifications exist
    expect(screen.getByText('Desk Admission Approval')).toBeTruthy();
    expect(screen.getByText('Daily Cash Handover')).toBeTruthy();
    expect(screen.getByText('Desk Maintenance Ticket')).toBeTruthy();

    // Verify link to Notification Center
    const viewAllLink = screen.getByTestId('manager-notifications-view-all');
    expect(viewAllLink).toHaveAttribute(
      'href',
      '/frontend_manager/manager_communication/communication_notification_center'
    );

    // Escape closes popover
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByTestId('manager-notifications-dropdown')).toBeNull();
  });

  it('marks all notifications as read when clicking "Mark all read"', () => {
    renderHeader();

    const bellBtn = screen.getByTestId('manager-bell-btn');
    fireEvent.click(bellBtn);

    const markAllBtn = screen.getByRole('button', { name: /Mark all read/i });
    expect(markAllBtn).toBeTruthy();

    fireEvent.click(markAllBtn);

    expect(screen.getByText('All caught up')).toBeTruthy();
    expect(toastMock.success).toHaveBeenCalledWith('All notifications marked as read');
  });

  it('marks single notification as read when clicked', () => {
    renderHeader();

    const bellBtn = screen.getByTestId('manager-bell-btn');
    fireEvent.click(bellBtn);

    expect(screen.getByText(/3 New/i)).toBeTruthy();

    // Click on the first notification
    const firstNotif = screen.getByText('Desk Admission Approval');
    fireEvent.click(firstNotif);

    // Unread count should now be 2 New
    expect(screen.getByText(/2 New/i)).toBeTruthy();
  });

  it('closes notifications popover when clicking outside', () => {
    renderHeader();

    const bellBtn = screen.getByTestId('manager-bell-btn');
    fireEvent.click(bellBtn);
    expect(screen.getByTestId('manager-notifications-dropdown')).toBeTruthy();

    // Click outside
    fireEvent.mouseDown(document.body);
    expect(screen.queryByTestId('manager-notifications-dropdown')).toBeNull();
  });
});
