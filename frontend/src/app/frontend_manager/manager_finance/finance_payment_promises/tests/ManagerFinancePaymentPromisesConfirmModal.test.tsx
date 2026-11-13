import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import React from 'react';
import { useManagerFinancePaymentPromisesConfirm } from '@/app/frontend_manager/manager_finance/finance_payment_promises/hooks/useManagerFinancePaymentPromisesConfirm';

function TestPaymentPromisesConfirmComponent({ onResult }: { onResult: (res: boolean) => void }) {
  const { confirm, dialog } = useManagerFinancePaymentPromisesConfirm();
  return (
    <div>
      <button
        type="button"
        onClick={async () => {
          const res = await confirm(
            'Mark payment commitment for Rahul Sharma (₹1,500) as fulfilled / paid?',
            'Cancel',
            'Confirm Mark Paid'
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

describe('useManagerFinancePaymentPromisesConfirm', () => {
  it('does not render dialog initially', () => {
    render(<TestPaymentPromisesConfirmComponent onResult={() => {}} />);
    expect(screen.queryByRole('alertdialog')).toBeNull();
  });

  it('renders accessible alertdialog when triggered', async () => {
    render(<TestPaymentPromisesConfirmComponent onResult={() => {}} />);
    await act(async () => {
      fireEvent.click(screen.getByText('Trigger Confirm'));
    });
    const dialog = screen.getByRole('alertdialog');
    expect(dialog).toBeDefined();
    expect(dialog.getAttribute('aria-modal')).toBe('true');
    expect(screen.getByText(/Mark payment commitment for Rahul Sharma/)).toBeDefined();
    expect(screen.getByText('Cancel')).toBeDefined();
    expect(screen.getByText('Confirm Mark Paid')).toBeDefined();
  });

  it('resolves false when Cancel is clicked', async () => {
    let outcome: boolean | null = null;
    render(<TestPaymentPromisesConfirmComponent onResult={(res) => { outcome = res; }} />);
    await act(async () => {
      fireEvent.click(screen.getByText('Trigger Confirm'));
    });
    await act(async () => {
      fireEvent.click(screen.getByTestId('manager-finance-payment-promises-confirm-cancel'));
    });
    expect(outcome).toBe(false);
    expect(screen.queryByRole('alertdialog')).toBeNull();
  });

  it('resolves true when Continue is clicked', async () => {
    let outcome: boolean | null = null;
    render(<TestPaymentPromisesConfirmComponent onResult={(res) => { outcome = res; }} />);
    await act(async () => {
      fireEvent.click(screen.getByText('Trigger Confirm'));
    });
    await act(async () => {
      fireEvent.click(screen.getByTestId('manager-finance-payment-promises-confirm-continue'));
    });
    expect(outcome).toBe(true);
    expect(screen.queryByRole('alertdialog')).toBeNull();
  });
});
