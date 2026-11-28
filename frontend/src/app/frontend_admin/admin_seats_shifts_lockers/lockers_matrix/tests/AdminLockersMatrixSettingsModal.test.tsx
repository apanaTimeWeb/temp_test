import { AdminLockersMatrixSettingsModal } from '@/app/frontend_admin/admin_seats_shifts_lockers/lockers_matrix/components/AdminLockersMatrixSettingsModal';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

describe('Locker Rent & Deposit Settings Modal', () => {
  it('renders pricing form and saves updated rent and security deposit policy', () => {
    const onSavePolicy = vi.fn();
    const onClose = vi.fn();

    render(
      <AdminLockersMatrixSettingsModal
        isOpen={true}
        onClose={onClose}
        currentPolicy={{
          monthlyRent: 200,
          securityDeposit: 500,
          lostKeyFee: 150,
          lateFeePerDay: 20,
          branchName: 'All Branches',
        }}
        onSavePolicy={onSavePolicy}
      />,
    );

    expect(screen.getByText('Locker Rent & Caution Deposit Settings')).toBeTruthy();
    expect(screen.getByDisplayValue('200')).toBeTruthy();
    expect(screen.getByDisplayValue('500')).toBeTruthy();

    const saveBtn = screen.getByRole('button', { name: /Save Policy Settings/i });
    fireEvent.click(saveBtn);

    expect(onSavePolicy).toHaveBeenCalled();
    expect(onSavePolicy.mock.calls[0][0].monthlyRent).toBe(200);
    expect(onSavePolicy.mock.calls[0][0].securityDeposit).toBe(500);
  });
});
