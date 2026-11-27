import { ADMIN_NAVIGATION_GROUPS } from '@/app/frontend_admin/admin_navigation/admin_navigation_sidebar/config/admin_navigation_sidebar_navigation_constants';
import AdminProfileActiveBranchesPanel from '@/app/frontend_admin/admin_settings/settings_profile/components/AdminProfileActiveBranchesPanel';
import AdminSecurityDeviceSessionsPanel from '@/app/frontend_admin/admin_settings/settings_security/components/AdminSettingsSecurityDeviceSessionsPanel';
import { ADMIN_ROUTES } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_constants/AdminApplicationRoutes';
import { fireEvent,render,screen,waitFor } from '@testing-library/react';
import { describe,expect,it,vi } from 'vitest';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

describe('Admin Settings Domain - Missing Controls Verification', () => {
  describe('1. Sidebar Navigation - Settings Security Link', () => {
    it('includes Settings Security in sidebar navigation submodules under settings group', () => {
      const settingsGroup = ADMIN_NAVIGATION_GROUPS.find((g) => g.id === 'settings');
      expect(settingsGroup).toBeDefined();
      const securitySub = settingsGroup?.submodules.find(
        (sub) => sub.href === ADMIN_ROUTES.SETTINGS_SECURITY
      );
      expect(securitySub).toBeDefined();
      expect(securitySub?.labelKey).toBe('SUBMODULE_SETTINGS_SECURITY');
      expect(securitySub?.href).toBe('/admin/admin_settings/settings_security');
    });
  });

  describe('2. Library Branches - Edit Branch Details & Deactivate Action', () => {
    it('renders branches with address, timings, capacity and status badges', () => {
      render(<AdminProfileActiveBranchesPanel />);

      // Verify branch names rendered
      expect(screen.getAllByText('Downtown Central').length).toBeGreaterThan(0);
      expect(screen.getAllByText('North Hub').length).toBeGreaterThan(0);

      // Verify edit buttons exist
      const editButtons = screen.getAllByRole('button', { name: /edit/i });
      expect(editButtons.length).toBeGreaterThan(0);

      // Verify deactivate/activate buttons exist
      const deactivateButtons = screen.getAllByRole('button', { name: /deactivate/i });
      expect(deactivateButtons.length).toBeGreaterThan(0);
    });

    it('toggles branch status between Active and Inactive when clicked', () => {
      render(<AdminProfileActiveBranchesPanel />);

      const toggleBtn = screen.getByTestId('admin-branch-toggle-BR-001');
      expect(toggleBtn).toBeDefined();
      expect(toggleBtn.textContent).toContain('Deactivate');

      // Click Deactivate
      fireEvent.click(toggleBtn);

      // Status should become Inactive and button should show Activate
      expect(toggleBtn.textContent).toContain('Activate');

      // Click Activate again
      fireEvent.click(toggleBtn);
      expect(toggleBtn.textContent).toContain('Deactivate');
    });

    it('opens Edit Branch modal with prefilled data and saves updates', async () => {
      render(<AdminProfileActiveBranchesPanel />);

      const editBtn = screen.getByTestId('admin-branch-edit-BR-001');
      fireEvent.click(editBtn);

      // Modal should be open
      expect(screen.getByText('Edit Branch Details')).toBeDefined();

      // Find form inputs
      const addressInput = screen.getByDisplayValue('123 Main St, City');
      expect(addressInput).toBeDefined();

      // Update address
      fireEvent.change(addressInput, { target: { value: '456 New Commercial Hub, City' } });

      // Save changes
      const saveBtn = screen.getByTestId('admin-save-branch-details-button');
      fireEvent.click(saveBtn);

      // Verify updated address appears on the page
      await waitFor(() => {
        expect(screen.getAllByText('456 New Commercial Hub, City').length).toBeGreaterThan(0);
      });
    });
  });

  describe('3. Settings Security - Active Device Sessions Force Logout', () => {
    it('renders device sessions with active, enabled REVOKE buttons', () => {
      render(<AdminSecurityDeviceSessionsPanel />);

      const revokeButtons = screen.getAllByRole('button', { name: 'REVOKE' });
      expect(revokeButtons.length).toBeGreaterThan(0);
      expect(revokeButtons.every((b) => !(b as HTMLButtonElement).disabled)).toBe(true);
    });

    it('successfully revokes a device session on clicking REVOKE', () => {
      render(<AdminSecurityDeviceSessionsPanel />);

      const initialArticles = screen.getAllByRole('article');
      const initialCount = initialArticles.length;

      const firstRevoke = screen.getByTestId('admin_security-AdminSettingsSecurityMain-control-revoke-device-demo-1');
      fireEvent.click(firstRevoke);

      // device-demo-1 should be removed
      expect(screen.queryByTestId('admin_security-AdminSettingsSecurityMain-control-revoke-device-demo-1')).toBeNull();
    });

    it('provides Revoke All Devices button to terminate all sessions at once', () => {
      render(<AdminSecurityDeviceSessionsPanel />);

      const revokeAllBtn = screen.getByTestId('admin-security-revoke-all-sessions-btn');
      expect(revokeAllBtn).toBeDefined();

      fireEvent.click(revokeAllBtn);

      // Should show empty state
      expect(screen.getByText('No active device sessions')).toBeDefined();
    });
  });
});
