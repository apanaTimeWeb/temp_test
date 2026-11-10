import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { ManagerAccountsDailySettlementConfirmModal } from '../components/manager_accounts_daily_settlement_dialogs/ManagerAccountsDailySettlementConfirmModal';

describe('ManagerAccountsDailySettlementConfirmModal', () => {
  it('renders nothing when closed', () => {
    const { container } = render(
      <ManagerAccountsDailySettlementConfirmModal
        isOpen={false}
        shiftName={null}
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders dialog details when open with shiftName', () => {
    render(
      <ManagerAccountsDailySettlementConfirmModal
        isOpen={true}
        shiftName="Morning (6AM–2PM)"
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />
    );

    expect(screen.getByRole('alertdialog')).toBeDefined();
    expect(screen.getByText('Confirm Shift Settlement')).toBeDefined();
    expect(screen.getAllByText(/Morning \(6AM–2PM\)/i).length).toBeGreaterThan(0);
  });

  it('triggers onConfirm when Confirm Settlement button is clicked', () => {
    const handleConfirm = vi.fn();
    render(
      <ManagerAccountsDailySettlementConfirmModal
        isOpen={true}
        shiftName="Afternoon (2PM–9PM)"
        onConfirm={handleConfirm}
        onCancel={vi.fn()}
      />
    );

    fireEvent.click(screen.getByText('Confirm Settlement'));
    expect(handleConfirm).toHaveBeenCalledTimes(1);
  });

  it('triggers onCancel when Cancel button or Escape key is pressed', () => {
    const handleCancel = vi.fn();
    render(
      <ManagerAccountsDailySettlementConfirmModal
        isOpen={true}
        shiftName="Afternoon (2PM–9PM)"
        onConfirm={vi.fn()}
        onCancel={handleCancel}
      />
    );

    fireEvent.click(screen.getByText('Cancel'));
    expect(handleCancel).toHaveBeenCalledTimes(1);

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(handleCancel).toHaveBeenCalledTimes(2);
  });
});

