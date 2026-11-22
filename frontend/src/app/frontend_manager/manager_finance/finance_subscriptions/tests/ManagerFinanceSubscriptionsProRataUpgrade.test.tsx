import { act,fireEvent,render,screen } from '@testing-library/react';
import { describe,expect,it,vi } from 'vitest';
import ManagerFinanceSubscriptionsUpgradeModal from '../components/manager_finance_subscriptions_views/ManagerFinanceSubscriptionsUpgradeModal';

describe('Module 14: Subscriptions - Pro-Rata Plan Upgrade Calculator', () => {
  const sampleSub = {
    id: 1,
    studentName: 'Aarav Sharma',
    smartId: 'STU001',
    plan: 'Basic Plan',
    shift: 'Morning',
    startDate: '2026-04-01',
    endDate: '2026-04-30',
    daysLeft: 15,
    base: 80000,
    total: 80000,
    paid: 80000,
    due: 0,
    status: 'active',
  };

  it('renders modal and computes pro-rata upgrade breakdown accurately', () => {
    const handleConfirm = vi.fn();
    const handleClose = vi.fn();

    render(
      <ManagerFinanceSubscriptionsUpgradeModal
        isOpen={true}
        onClose={handleClose}
        subscription={sampleSub}
        onConfirmUpgrade={handleConfirm}
      />
    );

    // Verify modal title and student info
    expect(screen.getByText('Pro-Rata Plan Upgrade Calculator')).toBeInTheDocument();
    expect(screen.getByText(/Aarav Sharma/)).toBeInTheDocument();
    expect(screen.getByText(/15 Days remaining/)).toBeInTheDocument();

    // Verify Pro-Rata Math Breakdown
    const breakdownBox = screen.getByTestId('pro-rata-calculator-breakdown');
    expect(breakdownBox).toBeInTheDocument();
    expect(screen.getByText('Pro-Rata Adjustment Formula Breakdown')).toBeInTheDocument();
    expect(screen.getByText('Net Upgrade Amount Payable:')).toBeInTheDocument();

    // Verify Confirm Button exists with amount
    const confirmBtn = screen.getByTestId('confirm-pro-rata-upgrade-btn');
    expect(confirmBtn).toBeInTheDocument();
  });

  it('selects 24/7 Unlimited Access shift and triggers onConfirmUpgrade with calculated pro-rata amount', async () => {
    const handleConfirm = vi.fn();
    const handleClose = vi.fn();

    render(
      <ManagerFinanceSubscriptionsUpgradeModal
        isOpen={true}
        onClose={handleClose}
        subscription={sampleSub}
        onConfirmUpgrade={handleConfirm}
      />
    );

    // Click 24 Hours option
    const unlimitedBtn = screen.getByText('24 Hours');
    await act(async () => {
      fireEvent.click(unlimitedBtn);
    });

    // Confirm upgrade
    const confirmBtn = screen.getByTestId('confirm-pro-rata-upgrade-btn');
    await act(async () => {
      fireEvent.click(confirmBtn);
    });

    await vi.waitFor(() => {
      expect(handleConfirm).toHaveBeenCalledWith(
        1,
        '24/7 Unlimited Access',
        '24 Hours',
        expect.any(Number)
      );
    });
  });
});
