import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import ManagerFinancePaymentPromisesTable from '../components/manager_finance_payment_promises_views/ManagerFinancePaymentPromisesTable';

// Mock next-intl
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

describe('Module 16: Payment Promises - Due Date Alert & Direct Collect Link', () => {
  const samplePromise = {
    id: 101,
    studentName: 'Rahul Kumar',
    smartId: 'STU101',
    promisedAmount: 120000,
    expectedDate: '2026-04-12',
    daysUntilDue: 0,
    timesChanged: 1,
    status: 'pending' as const,
    remarks: 'Will clear at desk',
  };

  it('renders "Collect" button in promises table row and calls onCollectAmount', () => {
    const handleCollect = vi.fn();
    const handleMarkPaid = vi.fn();
    const handleEdit = vi.fn();
    const handleView = vi.fn();

    render(
      <ManagerFinancePaymentPromisesTable
        filtered={[samplePromise]}
        paginated={[samplePromise]}
        formatCurrency={(amount) => `₹${amount / 100}`}
        formatDate={(d) => d}
        sortField={null}
        sortDirection="asc"
        onToggleSort={vi.fn()}
        onMarkPaid={handleMarkPaid}
        onCollectAmount={handleCollect}
        onOpenEdit={handleEdit}
        onOpenView={handleView}
        startItem={1}
        endItem={1}
        totalRows={1}
        effectivePage={0}
        pageCount={1}
        onPrevPage={vi.fn()}
        onNextPage={vi.fn()}
        labels={{
          student: 'Student',
          promisedInr: 'Promised (₹)',
          expectedDate: 'Expected Date',
          daysUntilSinceDue: 'Due Status',
          timesChanged: 'Changes',
          status: 'Status',
          actions: 'Actions',
          noPromises: 'No promises',
          paidOn: 'Paid on',
          daysOverdueCount: (c) => `${c}d overdue`,
          daysCount: (c) => `${c}d left`,
          translateStatus: (s) => s,
        }}
      />
    );

    // Verify row displays student name and promised amount
    expect(screen.getByText('Rahul Kumar')).toBeInTheDocument();
    expect(screen.getByText('₹1200')).toBeInTheDocument();

    // Verify "Collect" button exists
    const collectBtn = screen.getByTestId('collect-amount-btn-101');
    expect(collectBtn).toBeInTheDocument();
    expect(collectBtn).toHaveTextContent('Collect');

    fireEvent.click(collectBtn);
    expect(handleCollect).toHaveBeenCalledWith(samplePromise);
  });
});
