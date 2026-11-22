import { fireEvent,render,screen } from '@testing-library/react';
import { describe,expect,it,vi } from 'vitest';
import { AdminFinanceSecurityDepositsKpis } from '../components/AdminFinanceSecurityDepositsKpis';
import { AdminFinanceSecurityDepositsRefundModal } from '../components/AdminFinanceSecurityDepositsRefundModal';
import { AdminFinanceSecurityDepositsTable } from '../components/AdminFinanceSecurityDepositsTable';
import type { AdminFinanceSecurityDeposit } from '../types/AdminFinanceSecurityDepositsTypes';

describe('AdminFinanceSecurityDeposits Components', () => {
  const sampleDeposits: AdminFinanceSecurityDeposit[] = [
    {
      id: 1,
      studentName: 'Rahul Kumar',
      smartId: 'STU101',
      depositAmount: 1500,
      collectedBy: 'Admin (System)',
      collectedDate: '2026-03-15',
      deductionAmount: 0,
      status: 'held',
      seat: 'A-12',
      phone: '9876543210',
      branch: 'Downtown Central',
    },
    {
      id: 2,
      studentName: 'Priya Singh',
      smartId: 'STU102',
      depositAmount: 2000,
      collectedBy: 'Branch Manager',
      collectedDate: '2026-03-20',
      deductionAmount: 150,
      deductionReason: 'Locker Key Lost',
      status: 'held',
      seat: 'B-05',
      phone: '9876543211',
      branch: 'Downtown Central',
    },
    {
      id: 3,
      studentName: 'Aman Verma',
      smartId: 'STU103',
      depositAmount: 1500,
      collectedBy: 'Admin Desk',
      collectedDate: '2026-02-10',
      deductionAmount: 0,
      status: 'refunded',
      refundedDate: '2026-04-08',
      seat: 'C-18',
      phone: '9876543212',
      branch: 'North Hub',
    },
  ];

  it('renders KPI metrics correctly', () => {
    render(
      <AdminFinanceSecurityDepositsKpis
        deposits={sampleDeposits}
        timeHorizonLabel="All Time"
      />
    );

    expect(screen.getByText('Active Escrow Pool')).toBeInTheDocument();
    expect(screen.getByText('Forfeited Deposits')).toBeInTheDocument();
    expect(screen.getByText('Damage & Deductions')).toBeInTheDocument();
    expect(screen.getByText('Disbursed Refunds')).toBeInTheDocument();

    // 1500 + (2000 - 150) = 3350 in escrow
    expect(screen.getByText('₹3,350')).toBeInTheDocument();
    // 150 deduction
    expect(screen.getByText('₹150')).toBeInTheDocument();
    // 1 refunded
    expect(screen.getByText('1 Returned')).toBeInTheDocument();
  });

  it('renders deposits ledger table with sort and action triggers', () => {
    const onToggleSort = vi.fn();
    const onOpenRefund = vi.fn();
    const onOpenDeduct = vi.fn();

    render(
      <AdminFinanceSecurityDepositsTable
        filtered={sampleDeposits}
        paginated={sampleDeposits}
        sortField={null}
        sortDirection="asc"
        onToggleSort={onToggleSort}
        onOpenRefund={onOpenRefund}
        onOpenDeduct={onOpenDeduct}
        startItem={1}
        endItem={3}
        totalRows={3}
        pageSize={10}
        onPageSizeChange={vi.fn()}
        effectivePage={0}
        pageCount={1}
        onPrevPage={vi.fn()}
        onNextPage={vi.fn()}
        labels={{
          student: 'Student Details',
          seatBranch: 'Seat & Branch',
          deposit: 'Deposit Amount',
          status: 'Status',
          collectedBy: 'Collected By',
          collectedDate: 'Collected Date',
          deduction: 'Deductions',
          refundedDate: 'Refund Date / Net',
          actions: 'Actions',
          noDeposits: 'No security deposits found',
        }}
      />
    );

    expect(screen.getByText('Rahul Kumar')).toBeInTheDocument();
    expect(screen.getByText('Priya Singh')).toBeInTheDocument();
    expect(screen.getByText('Aman Verma')).toBeInTheDocument();
    expect(screen.getAllByText('₹1,500').length).toBeGreaterThan(0);

    // Click Refund button on first row
    const refundButtons = screen.getAllByRole('button', { name: /^Refund$/i });
    fireEvent.click(refundButtons[0]);
    expect(onOpenRefund).toHaveBeenCalledWith(sampleDeposits[0]);

    // Click Deduct button
    const deductButtons = screen.getAllByRole('button', { name: /^Deduct$/i });
    fireEvent.click(deductButtons[0]);
    expect(onOpenDeduct).toHaveBeenCalledWith(sampleDeposits[0]);
  });

  it('handles exit clearance checklist and verifies refund button state', () => {
    const handleClose = vi.fn();
    const handleConfirmRefund = vi.fn((e) => e.preventDefault());

    render(
      <AdminFinanceSecurityDepositsRefundModal
        refundTarget={sampleDeposits[0]}
        onClose={handleClose}
        refundMode="upi"
        onRefundModeChange={vi.fn()}
        refundRef=""
        onRefundRefChange={vi.fn()}
        onConfirmRefund={handleConfirmRefund}
      />
    );

    expect(screen.getByText('Exit Clearance & Deposit Refund')).toBeInTheDocument();
    expect(screen.getByText('Exit Clearance Checklist')).toBeInTheDocument();

    // Submit button should be disabled until all checklist items are checked
    const submitBtn = screen.getByRole('button', { name: /Confirm & Disburse/i });
    expect(submitBtn).toBeDisabled();

    // Click Check All
    const checkAllBtn = screen.getByText('Check All');
    fireEvent.click(checkAllBtn);

    // Now submit button should be enabled
    expect(submitBtn).not.toBeDisabled();
  });
});
