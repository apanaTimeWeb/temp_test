import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import ManagerFinanceSecurityDepositsRefundModal from '../components/manager_finance_security_deposits_views/ManagerFinanceSecurityDepositsRefundModal';

describe('Module 17: Security Deposits - Exit Clearance Checklist', () => {
  const sampleDeposit = {
    id: 1,
    studentName: 'Amit Sharma',
    smartId: 'LIB-001',
    depositAmount: 1000,
    status: 'held' as const,
    collectedBy: 'Manager',
    collectedDate: '2026-01-10',
    deductionAmount: 0,
    deductionReason: '',
    refundedDate: '',
  };

  it('renders clearance checklist and disables refund until all items are verified', () => {
    const handleConfirm = vi.fn();
    const handleClose = vi.fn();

    render(
      <ManagerFinanceSecurityDepositsRefundModal
        refundTarget={sampleDeposit}
        onClose={handleClose}
        refundMode="upi"
        onRefundModeChange={vi.fn()}
        refundRef="UPI-123456"
        onRefundRefChange={vi.fn()}
        onConfirmRefund={handleConfirm}
      />
    );

    // Verify modal title and student name
    expect(screen.getByText('Exit Clearance & Deposit Refund')).toBeInTheDocument();
    expect(screen.getByText(/Amit Sharma/)).toBeInTheDocument();

    // Verify all 5 checklist items exist
    expect(screen.getByTestId('checklist-locker-key')).toBeInTheDocument();
    expect(screen.getByTestId('checklist-id-card')).toBeInTheDocument();
    expect(screen.getByTestId('checklist-desk-inspected')).toBeInTheDocument();
    expect(screen.getByTestId('checklist-assets-returned')).toBeInTheDocument();
    expect(screen.getByTestId('checklist-dues-cleared')).toBeInTheDocument();

    // Verify confirm button is disabled initially
    const confirmBtn = screen.getByTestId('confirm-deposit-refund-btn');
    expect(confirmBtn).toBeDisabled();

    // Click "Verify All"
    const verifyAllBtn = screen.getByText('Verify All');
    fireEvent.click(verifyAllBtn);

    // Now confirm button should be enabled
    expect(confirmBtn).not.toBeDisabled();

    // Submit form
    fireEvent.click(confirmBtn);
    expect(handleConfirm).toHaveBeenCalledTimes(1);
  });
});
