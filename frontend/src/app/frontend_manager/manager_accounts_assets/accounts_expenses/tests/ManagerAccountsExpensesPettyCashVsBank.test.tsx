import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ManagerAccountsExpensesExpenseSummaryCards from '../components/manager_accounts_expenses_sections/ManagerAccountsExpensesExpenseSummaryCards';
import { managerAccountsExpensesAddExpenseModalSchema } from '../schemas/ManagerAccountsExpensesExpenseDraftSchema';
import type { Expense } from '../types/ManagerAccountsExpensesComponentTypes';

describe('ManagerAccountsExpensesPettyCashVsBank', () => {
  it('validates schema with source field properly', () => {
    const pettyCashData = {
      category: 'Cleaning',
      description: 'Broom & cleaning liquid',
      amount: '150.00',
      mode: 'cash' as const,
      source: 'petty_cash' as const,
      paidBy: 'Manager Counter',
    };
    const parsed = managerAccountsExpensesAddExpenseModalSchema.safeParse(pettyCashData);
    expect(parsed.success).toBe(true);

    const bankData = {
      category: 'Electricity',
      description: 'Electricity bill April',
      amount: '5000.00',
      mode: 'bank' as const,
      source: 'bank_direct' as const,
      paidBy: 'Owner Account',
    };
    const parsedBank = managerAccountsExpensesAddExpenseModalSchema.safeParse(bankData);
    expect(parsedBank.success).toBe(true);
  });

  it('renders separate summary cards for Petty Cash Float and Bank / Owner Account', () => {
    const sampleExpenses: Expense[] = [
      {
        id: 1,
        date: '2026-04-01',
        category: 'Electricity',
        description: 'Electricity bill',
        amount: 500000, // ₹5,000
        mode: 'bank',
        source: 'bank_direct',
        paidBy: 'Owner',
      },
      {
        id: 2,
        date: '2026-04-02',
        category: 'Cleaning',
        description: 'Broom & Tea',
        amount: 15000, // ₹150
        mode: 'cash',
        source: 'petty_cash',
        paidBy: 'Counter',
      },
      {
        id: 3,
        date: '2026-04-03',
        category: 'Stationery',
        description: 'Registers',
        amount: 50000, // ₹500
        mode: 'cash',
        source: 'petty_cash',
        paidBy: 'Staff',
      },
    ];

    const formatCurrency = (minor: number) => `₹${(minor / 100).toLocaleString('en-IN')}`;

    render(
      <ManagerAccountsExpensesExpenseSummaryCards
        expenses={sampleExpenses}
        visibleExpenses={sampleExpenses}
        formatCurrency={formatCurrency}
        labels={{
          totalExpenses: 'Total Outflow',
          thisMonth: 'Filtered Spend',
          entries: 'Entries',
          categories: 'Categories',
        }}
        timeHorizonLabel="This Month"
      />
    );

    // Verify Petty Cash card is present
    expect(screen.getByText(/Petty Cash Float \(गल्ला\)/i)).toBeInTheDocument();
    // Petty cash total = 150 + 500 = ₹650
    expect(screen.getByText('₹650')).toBeInTheDocument();

    // Verify Bank / Owner Account card is present
    expect(screen.getByText(/Bank \/ Owner Account/i)).toBeInTheDocument();
    // Bank total = ₹5,000
    expect(screen.getByText('₹5,000')).toBeInTheDocument();
  });
});
