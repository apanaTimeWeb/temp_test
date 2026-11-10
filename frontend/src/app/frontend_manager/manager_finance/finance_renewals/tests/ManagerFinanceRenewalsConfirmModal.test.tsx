import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import React from 'react';
import { useManagerFinanceRenewalsConfirm } from '@/app/frontend_manager/manager_finance/finance_renewals/hooks/useManagerFinanceRenewalsConfirm';

function TestConfirmComponent({ onResult }: { onResult: (res: boolean) => void }) {
  const { confirm, dialog } = useManagerFinanceRenewalsConfirm();
  return (
    <div>
      <button
        type="button"
        onClick={async () => {
          const res = await confirm(
            'Confirm Subscription Renewal: Extend subscription for Aarav Sharma by 30 days?',
            'Cancel',
            'Renew (+30 Days)'
          );
          onResult(res);
        }}
      >
        Trigger Confirm
      </button>
      {dialog}
    </div>
  );
}

describe('useManagerFinanceRenewalsConfirm', () => {
  it('does not render dialog initially', () => {
    render(<TestConfirmComponent onResult={() => {}} />);
    expect(screen.queryByRole('alertdialog')).toBeNull();
  });

  it('renders accessible alertdialog when triggered', async () => {
    render(<TestConfirmComponent onResult={() => {}} />);
    await act(async () => {
      fireEvent.click(screen.getByText('Trigger Confirm'));
    });
    const dialog = screen.getByRole('alertdialog');
    expect(dialog).toBeDefined();
    expect(dialog.getAttribute('aria-modal')).toBe('true');
    expect(screen.getByText(/Confirm Subscription Renewal/)).toBeDefined();
    expect(screen.getByText('Cancel')).toBeDefined();
    expect(screen.getByText('Renew (+30 Days)')).toBeDefined();
  });

  it('resolves false when Cancel is clicked', async () => {
    let outcome: boolean | null = null;
    render(<TestConfirmComponent onResult={(res) => { outcome = res; }} />);
    await act(async () => {
      fireEvent.click(screen.getByText('Trigger Confirm'));
    });
    await act(async () => {
      fireEvent.click(screen.getByTestId('manager-finance-renewals-confirm-cancel'));
    });
    expect(outcome).toBe(false);
    expect(screen.queryByRole('alertdialog')).toBeNull();
  });

  it('resolves true when Continue is clicked', async () => {
    let outcome: boolean | null = null;
    render(<TestConfirmComponent onResult={(res) => { outcome = res; }} />);
    await act(async () => {
      fireEvent.click(screen.getByText('Trigger Confirm'));
    });
    await act(async () => {
      fireEvent.click(screen.getByTestId('manager-finance-renewals-confirm-continue'));
    });
    expect(outcome).toBe(true);
    expect(screen.queryByRole('alertdialog')).toBeNull();
  });
});

