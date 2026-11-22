import { fireEvent,render,screen } from '@testing-library/react';
import { describe,expect,it,vi } from 'vitest';
import { buildPendingCols } from '../components/manager_finance_fines_payments_views/ManagerFinanceFinesPaymentsTableColumns';

describe('Module 18: Fines & Penalties - Auto-Add Fine to Next Renewal Bill', () => {
  it('renders "+ Add to Next Renewal" button and calls onAddToRenewal', () => {
    const handleAddToRenewal = vi.fn();
    const renewalAddedIds = new Set<string>();

    const cols = buildPendingCols(
      (amt) => `₹${amt / 100}`,
      (t) => String(t),
      (k) => k,
      handleAddToRenewal,
      renewalAddedIds
    );

    const actionCol = cols.find((c) => c.headerName === 'Renewal Bill Action');
    expect(actionCol).toBeDefined();

    const sampleRow = {
      id: 'F-101',
      member: 'Rahul Sharma (LIB-001)',
      type: 'Overdue Book',
      amount: 15000,
      status: 'Pending',
      date: '2026-09-25',
    };

    const rendered = actionCol?.cellRenderer?.({
      value: undefined,
      data: sampleRow,
    });

    render(<div>{rendered}</div>);

    const addBtn = screen.getByTestId('add-to-renewal-btn-F-101');
    expect(addBtn).toBeInTheDocument();
    expect(addBtn).toHaveTextContent('+ Add to Next Renewal');

    fireEvent.click(addBtn);
    expect(handleAddToRenewal).toHaveBeenCalledWith(sampleRow);
  });

  it('renders "✓ Added to Next Renewal" status when fine is already attached', () => {
    const renewalAddedIds = new Set<string>(['F-102']);

    const cols = buildPendingCols(
      (amt) => `₹${amt / 100}`,
      (t) => String(t),
      (k) => k,
      vi.fn(),
      renewalAddedIds
    );

    const actionCol = cols.find((c) => c.headerName === 'Renewal Bill Action');
    const sampleRow = {
      id: 'F-102',
      member: 'Priya Verma (LIB-022)',
      type: 'Lost Book Charge',
      amount: 50000,
      status: 'Pending',
      date: '2026-09-28',
    };

    const rendered = actionCol?.cellRenderer?.({
      value: undefined,
      data: sampleRow,
    });

    render(<div>{rendered}</div>);

    expect(screen.getByText('✓ Added to Next Renewal')).toBeInTheDocument();
  });
});
