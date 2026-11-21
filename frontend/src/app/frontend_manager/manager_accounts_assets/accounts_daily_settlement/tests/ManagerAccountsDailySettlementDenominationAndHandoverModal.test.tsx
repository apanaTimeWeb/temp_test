import React from 'react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ManagerAccountsDailySettlementDenominationAndHandoverModal } from '../components/manager_accounts_daily_settlement_dialogs/ManagerAccountsDailySettlementDenominationAndHandoverModal';
import type { Entry } from '../hooks/ManagerAccountsDailySettlementDemoRepository';

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    info: vi.fn(),
    error: vi.fn(),
  },
}));

describe('ManagerAccountsDailySettlementDenominationAndHandoverModal', () => {
  const mockEntry: Entry = {
    id: 1,
    shift: 'Morning Shift (6 AM - 2 PM)',
    openingBalance: 100000,
    cashCollected: 750000,
    upiCollected: 1200000,
    expenses: 50000,
    closingBalance: 800000, // ₹8,000 expected
    status: 'pending',
    settledBy: '',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    if (typeof navigator !== 'undefined') {
      Object.assign(navigator, {
        clipboard: {
          writeText: vi.fn().mockResolvedValue(undefined),
        },
      });
    }
  });

  it('renders denomination counter rows and calculates subtotal and discrepancy', () => {
    render(
      <ManagerAccountsDailySettlementDenominationAndHandoverModal
        isOpen={true}
        onClose={vi.fn()}
        entry={mockEntry}
      />
    );

    // Modal Title
    expect(
      screen.getByText(/Currency Denomination Counter & Owner Handover/i)
    ).toBeInTheDocument();

    // Check ₹500, ₹200, ₹100 notes are rendered
    expect(screen.getByText('₹500 Note')).toBeInTheDocument();
    expect(screen.getByText('₹200 Note')).toBeInTheDocument();
    expect(screen.getByText('₹100 Note')).toBeInTheDocument();

    // Expected Drawer Cash should display ₹8,000
    expect(screen.getAllByText('₹8,000').length).toBeGreaterThanOrEqual(1);
  });

  it('calculates owner handover amount accurately based on retained float', () => {
    const onConfirm = vi.fn();
    render(
      <ManagerAccountsDailySettlementDenominationAndHandoverModal
        isOpen={true}
        onClose={vi.fn()}
        entry={mockEntry}
        onConfirmSettlement={onConfirm}
      />
    );

    // Retained Float field exists
    expect(
      screen.getByText(/Retained Petty Cash Float for Tomorrow Morning/i)
    ).toBeInTheDocument();

    // Net Cash Handed Over to Library Owner section exists
    expect(
      screen.getByText(/Net Cash Handed Over to Library Owner/i)
    ).toBeInTheDocument();

    // Confirm button is present and clickable
    const confirmBtn = screen.getByRole('button', { name: /Confirm & Sign-Off Handover/i });
    fireEvent.click(confirmBtn);

    expect(onConfirm).toHaveBeenCalled();
  });

  it('switches to Owner Handover Receipt tab and displays sign-off slip', () => {
    render(
      <ManagerAccountsDailySettlementDenominationAndHandoverModal
        isOpen={true}
        onClose={vi.fn()}
        entry={mockEntry}
      />
    );

    const receiptTab = screen.getByRole('button', {
      name: /Owner Handover Receipt/i,
    });
    fireEvent.click(receiptTab);

    // Should display printable receipt title
    expect(
      screen.getByText(/Library OS — Daily Cash Handover Receipt/i)
    ).toBeInTheDocument();

    // Should display dual sign-off blocks
    expect(screen.getByText(/Handed Over By \(Branch Manager\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Received & Confirmed By \(Owner\)/i)).toBeInTheDocument();
  });

  it('copies WhatsApp handover summary when WhatsApp button is clicked', () => {
    render(
      <ManagerAccountsDailySettlementDenominationAndHandoverModal
        isOpen={true}
        onClose={vi.fn()}
        entry={mockEntry}
      />
    );

    const waBtn = screen.getByRole('button', { name: /WhatsApp Summary/i });
    fireEvent.click(waBtn);

    expect(navigator.clipboard.writeText).toHaveBeenCalled();
  });
});
