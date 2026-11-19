// @vitest-environment jsdom
import { NextIntlClientProvider } from 'next-intl';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import messages from '@/app/frontend_manager/manager_navigation/navigation/locales/manager_navigation_navigation_domain_en.json';
import { ManagerNavigationSidebarLogoutModal } from '@/app/frontend_manager/manager_navigation/navigation/components/ManagerNavigationSidebarLogoutModal';

describe('ManagerNavigationSidebarLogoutModal design and content parity contract', () => {
  it('renders centered modal matching admin structure with same size and content', () => {
    const handleClose = vi.fn();
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <ManagerNavigationSidebarLogoutModal isOpen={true} onClose={handleClose} />
      </NextIntlClientProvider>
    );

    // Modal dialog is rendered in document.body
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeTruthy();
    expect(document.body.contains(dialog)).toBe(true);

    // Title and description match Admin structure
    expect(screen.getByText('Log out?')).toBeTruthy();
    expect(screen.getByText('Are you sure you want to log out of this session?')).toBeTruthy();

    // User info row rendered with MANAGER badge and details
    expect(screen.getByText('Manager')).toBeTruthy();
    expect(screen.getByText('manager@library.com')).toBeTruthy();
    expect(screen.getByText('MANAGER')).toBeTruthy();

    // Cancel button triggers onClose
    const cancelBtn = screen.getByTestId('manager-logout-cancel');
    expect(cancelBtn).toBeTruthy();
    fireEvent.click(cancelBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('closes logout dialog on Escape key press', () => {
    const handleClose = vi.fn();
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <ManagerNavigationSidebarLogoutModal isOpen={true} onClose={handleClose} />
      </NextIntlClientProvider>
    );

    expect(screen.getByRole('dialog')).toBeTruthy();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
