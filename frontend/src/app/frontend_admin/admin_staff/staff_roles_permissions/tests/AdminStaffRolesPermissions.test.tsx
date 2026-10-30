import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import AdminStaffRolesPermissions from '@/app/frontend_admin/admin_staff/staff_roles_permissions/components/AdminStaffRolesPermissionsPage';
import { fetchAdminStaffRolesPermissions } from '@/app/frontend_admin/admin_staff/staff_roles_permissions/api/admin_staff_roles_permissions.api';

vi.mock('../api/admin_staff_roles_permissions.api', () => ({
  fetchAdminStaffRolesPermissions: vi.fn(),
}));
vi.mock('@/lib/runtimeFeatures', () => ({ isFrontendDemoModeEnabled: () => false }));

function renderAdminStaffRolesPermissions() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <AdminStaffRolesPermissions />
    </QueryClientProvider>,
  );
}

describe('AdminStaffRolesPermissions', () => {
  beforeEach(() => vi.clearAllMocks());

  it('renders the manager permission value from the lowercase API role key', async () => {
    vi.mocked(fetchAdminStaffRolesPermissions).mockResolvedValue([{ module: 'members', actions: [{ label: 'View members', key: 'members.read', roles: { admin: true, manager: true, trainer: false } }] }]);
    renderAdminStaffRolesPermissions();
    expect(await screen.findByRole('button', { name: 'Disable View members for Manager' })).toBeTruthy();
  });

  it('keeps live permission saving disabled without an approved mutation contract', async () => {
    vi.mocked(fetchAdminStaffRolesPermissions).mockResolvedValue([{ module: 'members', actions: [{ label: 'View members', key: 'members.read', roles: { manager: true } }] }]);
    renderAdminStaffRolesPermissions();
    const saveButton = await screen.findByRole('button', { name: 'Save Changes' });
    expect(saveButton).toHaveProperty('disabled', true);
    expect(screen.getByText(/Permission editing is disabled until the host supplies/)).toBeTruthy();
  });

  it('shows an explicit empty state when the service returns no permission definitions', async () => {
    vi.mocked(fetchAdminStaffRolesPermissions).mockResolvedValue([]);
    renderAdminStaffRolesPermissions();
    expect(await screen.findByText('No permission rules found')).toBeTruthy();
  });

  it('keeps the failed request separate from an empty result and exposes retry', async () => {
    vi.mocked(fetchAdminStaffRolesPermissions).mockRejectedValue(new Error('network unavailable'));
    renderAdminStaffRolesPermissions();
    expect(await screen.findByRole('alert')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Retry' })).toBeTruthy();
  });
});
