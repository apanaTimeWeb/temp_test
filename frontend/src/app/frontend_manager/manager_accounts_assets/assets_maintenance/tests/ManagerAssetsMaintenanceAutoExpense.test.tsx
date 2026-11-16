import React from 'react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ManagerAssetsMaintenanceAddModal } from '../components/ManagerAssetsMaintenanceAddModal';
import { ManagerAssetsMaintenanceDetailsModal } from '../components/ManagerAssetsMaintenanceDetailsModal';
import { ManagerAssetsMaintenanceTable, type MaintenanceLogItem } from '../components/ManagerAssetsMaintenanceTable';

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    info: vi.fn(),
    error: vi.fn(),
  },
}));

describe('ManagerAssetsMaintenanceAutoExpense', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('displays auto-post to Operating Expenses option when cost is entered in Add Modal', async () => {
    render(
      <ManagerAssetsMaintenanceAddModal
        isOpen={true}
        onClose={vi.fn()}
        onAddOrder={vi.fn()}
      />
    );

    // Cost input
    const costInput = screen.getByPlaceholderText('e.g. 1500');
    fireEvent.change(costInput, { target: { value: '2500' } });

    // Should display the auto-post checkbox and fund source options
    await waitFor(() => {
      expect(
        screen.getByText(/Auto-Post to Operating Expenses/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/Petty Cash Float/i)).toBeInTheDocument();
      expect(screen.getByText(/Bank \/ Owner Direct/i)).toBeInTheDocument();
    });
  });

  it('renders Accounts Ledger Synchronization badge in Details Modal for paid repair', () => {
    const mockItem: MaintenanceLogItem = {
      id: 991,
      assetName: 'Daikin 2-Ton Inverter AC',
      issue: 'Gas leak repair & cooling coil replacement',
      reportedDate: '2026-04-10',
      scheduledDate: '2026-04-12',
      vendor: 'Urban Company Pro',
      cost: 250000, // ₹2,500
      status: 'completed',
      priority: 'urgent',
      type: 'breakdown',
      autoPostToExpenses: true,
      expensePaymentSource: 'bank_direct',
    };

    render(
      <ManagerAssetsMaintenanceDetailsModal
        isOpen={true}
        logItem={mockItem}
        formatCurrency={(val) => `₹${(val / 100).toLocaleString('en-IN')}`}
        onClose={vi.fn()}
      />
    );

    expect(
      screen.getByText(/Accounts Ledger Synchronization:/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Auto-Posted to Expenses/i)).toBeInTheDocument();
  });

  it('renders Auto-Expense badge in Maintenance Table for items with cost', () => {
    const mockList: MaintenanceLogItem[] = [
      {
        id: 101,
        assetName: 'Hall A AC',
        issue: 'Gas refill',
        reportedDate: '2026-04-10',
        scheduledDate: '2026-04-11',
        vendor: 'Cool Care',
        cost: 250000,
        status: 'pending',
      },
    ];

    render(
      <ManagerAssetsMaintenanceTable
        paginated={mockList}
        totalRows={1}
        filteredCount={1}
        searchQuery=""
        sortField={null}
        sortDirection="asc"
        onToggleSort={vi.fn()}
        formatCurrency={(val) => `₹${(val / 100).toLocaleString('en-IN')}`}
        onUpdateStatus={vi.fn()}
        page={0}
        pageSize={10}
        pageCount={1}
        onPageChange={vi.fn()}
        onPageSizeChange={vi.fn()}
      />
    );

    expect(screen.getByText(/Auto-Expense/i)).toBeInTheDocument();
  });
});
