// @vitest-environment jsdom
import { NextIntlClientProvider } from 'next-intl';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import messages from '@/app/frontend_manager/manager_navigation/navigation/locales/manager_navigation_navigation_domain_en.json';
import ManagerNavigationSidebar from '@/app/frontend_manager/manager_navigation/navigation/components/ManagerNavigationNavigationSidebar';

vi.mock('next/navigation', () => ({
  usePathname: () => '/frontend_manager/manager_dashboard/dashboard_overview',
  useSearchParams: () => new URLSearchParams(),
}));

function renderSidebar(props: { collapsed?: boolean; mobileOpen?: boolean; onToggle?: () => void; onMobileClose?: () => void } = {}) {
  const onToggle = props.onToggle ?? vi.fn();
  const onMobileClose = props.onMobileClose ?? vi.fn();

  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <ManagerNavigationSidebar
        collapsed={props.collapsed ?? false}
        mobileOpen={props.mobileOpen ?? false}
        onToggle={onToggle}
        onMobileClose={onMobileClose}
      />
    </NextIntlClientProvider>,
  );
}

describe('ManagerNavigationSidebar Search and Dropdown Functionality', () => {
  it('renders the search input and clear button works as expected', () => {
    renderSidebar();

    const searchInput = screen.getByTestId('manager-sidebar-search-input') as HTMLInputElement;
    expect(searchInput).toBeTruthy();
    expect(searchInput.placeholder).toBe('Search modules...');

    // Initially clear button is not visible
    expect(screen.queryByTestId('manager-sidebar-search-clear')).toBeNull();

    // Type query
    fireEvent.change(searchInput, { target: { value: 'member' } });
    expect(searchInput.value).toBe('member');

    // Clear button becomes visible
    const clearBtn = screen.getByTestId('manager-sidebar-search-clear');
    expect(clearBtn).toBeTruthy();

    // Clicking clear resets input
    fireEvent.click(clearBtn);
    expect(searchInput.value).toBe('');
  });

  it('filters navigation links and auto-expands sections when searching', () => {
    renderSidebar();

    const searchInput = screen.getByTestId('manager-sidebar-search-input');

    // Search for a specific submodule
    fireEvent.change(searchInput, { target: { value: 'id card' } });

    // ID card generator link should be visible
    expect(screen.getByTestId('manager-nav-link--frontend-manager-manager-members-members-id-card-generator')).toBeTruthy();

    // Unrelated modules like invoices should not be in the document
    expect(screen.queryByTestId('manager-nav-link--frontend-manager-manager-finance-finance-invoices')).toBeNull();
  });

  it('shows empty state when no modules match the search query', () => {
    renderSidebar();

    const searchInput = screen.getByTestId('manager-sidebar-search-input');
    fireEvent.change(searchInput, { target: { value: 'non_existent_module_xyz' } });

    expect(screen.getByTestId('manager-nav-search-empty')).toBeTruthy();
    expect(screen.getByText('No matching modules')).toBeTruthy();

    // Clicking clear in empty state resets search
    const clearBtn = screen.getByTestId('manager-nav-search-empty-clear');
    fireEvent.click(clearBtn);

    expect(screen.queryByTestId('manager-nav-search-empty')).toBeNull();
  });

  it('toggles dropdown sections open and closed on click', () => {
    renderSidebar();

    // group_members toggle button
    const membersToggle = screen.getByTestId('manager-nav-group-toggle-group_members');
    expect(membersToggle).toBeTruthy();

    // Check group element
    const membersGroup = document.getElementById('manager-nav-group-group_members');
    expect(membersGroup).toBeTruthy();

    // Initially group_members is not active (dashboard is active), so it starts collapsed
    expect(membersToggle.getAttribute('aria-expanded')).toBe('false');
    expect(membersGroup?.hasAttribute('hidden')).toBe(true);

    // Click to expand
    fireEvent.click(membersToggle);
    expect(membersToggle.getAttribute('aria-expanded')).toBe('true');
    expect(membersGroup?.hasAttribute('hidden')).toBe(false);

    // Click to collapse
    fireEvent.click(membersToggle);
    expect(membersToggle.getAttribute('aria-expanded')).toBe('false');
    expect(membersGroup?.hasAttribute('hidden')).toBe(true);
  });

  it('renders collapsed search toggle button in collapsed mode and triggers onToggle', () => {
    const onToggle = vi.fn();
    renderSidebar({ collapsed: true, onToggle });

    const collapsedSearchBtn = screen.getByTestId('manager-sidebar-search-collapsed-toggle');
    expect(collapsedSearchBtn).toBeTruthy();

    fireEvent.click(collapsedSearchBtn);
    expect(onToggle).toHaveBeenCalledTimes(1);
  });
});
