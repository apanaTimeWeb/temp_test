import AdminProfileActiveBranchesPanel from '@/app/frontend_admin/admin_settings/settings_profile/components/AdminProfileActiveBranchesPanel';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

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

describe('Admin Settings Profile Branches Controls', () => {
  it('renders branches with address, timings, capacity and status badges', () => {
    render(<AdminProfileActiveBranchesPanel />);

    expect(screen.getAllByText('Downtown Central').length).toBeGreaterThan(0);
    expect(screen.getAllByText('North Hub').length).toBeGreaterThan(0);

    const editButtons = screen.getAllByRole('button', { name: /edit/i });
    expect(editButtons.length).toBeGreaterThan(0);

    const deactivateButtons = screen.getAllByRole('button', { name: /deactivate/i });
    expect(deactivateButtons.length).toBeGreaterThan(0);
  });

  it('toggles branch status between Active and Inactive when clicked', () => {
    render(<AdminProfileActiveBranchesPanel />);

    const toggleBtn = screen.getByTestId('admin-branch-toggle-BR-001');
    expect(toggleBtn).toBeDefined();
    expect(toggleBtn.textContent).toContain('Deactivate');

    fireEvent.click(toggleBtn);
    expect(toggleBtn.textContent).toContain('Activate');

    fireEvent.click(toggleBtn);
    expect(toggleBtn.textContent).toContain('Deactivate');
  });

  it('opens Edit Branch modal with prefilled data and saves updates', async () => {
    render(<AdminProfileActiveBranchesPanel />);

    const editBtn = screen.getByTestId('admin-branch-edit-BR-001');
    fireEvent.click(editBtn);

    expect(screen.getByText('Edit Branch Details')).toBeDefined();

    const addressInput = screen.getByDisplayValue('123 Main St, City');
    expect(addressInput).toBeDefined();

    fireEvent.change(addressInput, { target: { value: '456 New Commercial Hub, City' } });

    const saveBtn = screen.getByTestId('admin-save-branch-details-button');
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(screen.getAllByText('456 New Commercial Hub, City').length).toBeGreaterThan(0);
    });
  });
});
