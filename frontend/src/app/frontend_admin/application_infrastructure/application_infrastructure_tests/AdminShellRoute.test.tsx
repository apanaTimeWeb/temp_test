import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

let mockPathname = '/admin/admin_dashboard';

vi.mock('next/navigation', () => ({ usePathname: () => mockPathname }));
vi.mock('next-themes', () => ({ ThemeProvider: ({ children }: { children: React.ReactNode }) => children }));
vi.mock('@/app/frontend_admin/application_infrastructure/application_infrastructure_components/AdminQueryProvider', () => ({ AdminQueryProvider: ({ children }: { children: React.ReactNode }) => children }));
vi.mock('@/app/frontend_admin/application_infrastructure/application_infrastructure_components/AdminShellHeader', () => ({
  AdminShellHeader: ({ onMobileOpen }: { onMobileOpen?: () => void }) => <button type="button" onClick={onMobileOpen}>Open mobile navigation</button>,
}));
vi.mock('@/app/frontend_admin/admin_navigation/admin_navigation_sidebar/components/AdminNavigationSidebar', () => ({
  AdminNavigationSidebar: ({ mobileOpen, onMobileClose }: { mobileOpen?: boolean; onMobileClose?: () => void }) => (
    <div data-testid="admin-sidebar" data-mobile-open={String(Boolean(mobileOpen))}>
      <button type="button" onClick={onMobileClose}>Close mobile navigation</button>
    </div>
  ),
}));

import { AdminShellRoute } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_components/AdminShellRoute';

describe('AdminShellRoute mobile navigation contract', () => {
  beforeEach(() => { mockPathname = '/admin/admin_dashboard'; });

  it('connects the header trigger, sidebar open state, and close action', () => {
    render(<AdminShellRoute><p>Dashboard content</p></AdminShellRoute>);
    const sidebar = screen.getByTestId('admin-sidebar');
    expect(sidebar.getAttribute('data-mobile-open')).toBe('false');

    fireEvent.click(screen.getByRole('button', { name: 'Open mobile navigation' }));
    expect(sidebar.getAttribute('data-mobile-open')).toBe('true');

    fireEvent.click(screen.getByRole('button', { name: 'Close mobile navigation' }));
    expect(sidebar.getAttribute('data-mobile-open')).toBe('false');
  });

  it('does not wrap non-admin routes in the admin shell', () => {
    mockPathname = '/auth/login';
    render(<AdminShellRoute><p>Login content</p></AdminShellRoute>);
    expect(screen.getByText('Login content')).toBeTruthy();
    expect(screen.queryByTestId('admin-sidebar')).toBeNull();
  });
});
