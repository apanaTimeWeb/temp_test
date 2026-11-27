import { AdminAccountsExpensesFilterSection } from '@/app/frontend_admin/admin_accounts_assets/accounts_expenses/components/AdminAccountsExpensesFilterSection';
import { AdminAccountsExpensesHeaderSection } from '@/app/frontend_admin/admin_accounts_assets/accounts_expenses/components/AdminAccountsExpensesHeaderSection';
import expensesMessages from '@/app/frontend_admin/admin_accounts_assets/accounts_expenses/locales/admin_accounts_expenses_en.json';
import { fireEvent, render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { describe, expect, it, vi } from 'vitest';

describe('Admin Accounts Expenses Controls', () => {
  it('renders Export CSV and Excel buttons in HeaderSection', () => {
    const onExportCsv = vi.fn();
    const onExportExcel = vi.fn();

    render(
      <NextIntlClientProvider locale="en" messages={expensesMessages}>
        <AdminAccountsExpensesHeaderSection
          onAddExpense={vi.fn()}
          canMutate={true}
          onExportCsv={onExportCsv}
          onExportExcel={onExportExcel}
        />
      </NextIntlClientProvider>,
    );

    const csvBtn = screen.getByTitle('Export Expenses CSV');
    expect(csvBtn).toBeInTheDocument();
    fireEvent.click(csvBtn);
    expect(onExportCsv).toHaveBeenCalledTimes(1);

    const excelBtn = screen.getByTitle('Export Formatted Excel Sheet (.xls)');
    expect(excelBtn).toBeInTheDocument();
    fireEvent.click(excelBtn);
    expect(onExportExcel).toHaveBeenCalledTimes(1);
  });

  it('renders Date Range filter with Last Month and Custom range in FilterSection', () => {
    const onTimeRangeChange = vi.fn();
    const onCustomStartDateChange = vi.fn();
    const onCustomEndDateChange = vi.fn();
    const onExportCsv = vi.fn();
    const onExportExcel = vi.fn();

    render(
      <NextIntlClientProvider locale="en" messages={expensesMessages}>
        <AdminAccountsExpensesFilterSection
          value="all"
          onChange={vi.fn()}
          timeRange="custom"
          onTimeRangeChange={onTimeRangeChange}
          customStartDate="2026-10-01"
          onCustomStartDateChange={onCustomStartDateChange}
          customEndDate="2026-10-31"
          onCustomEndDateChange={onCustomEndDateChange}
          onExportCsv={onExportCsv}
          onExportExcel={onExportExcel}
        />
      </NextIntlClientProvider>,
    );

    const select = screen.getByLabelText('Filter expenses by date range');
    expect(select).toBeInTheDocument();
    expect(screen.getByText('Last Month')).toBeInTheDocument();

    const startInput = screen.getByLabelText('Start date filter');
    expect(startInput).toHaveValue('2026-10-01');
    fireEvent.change(startInput, { target: { value: '2026-10-05' } });
    expect(onCustomStartDateChange).toHaveBeenCalledWith('2026-10-05');

    const endInput = screen.getByLabelText('End date filter');
    expect(endInput).toHaveValue('2026-10-31');
    fireEvent.change(endInput, { target: { value: '2026-10-25' } });
    expect(onCustomEndDateChange).toHaveBeenCalledWith('2026-10-25');

    const exportCsvBtn = screen.getByTitle('Export Expenses as CSV');
    fireEvent.click(exportCsvBtn);
    expect(onExportCsv).toHaveBeenCalledTimes(1);
  });
});
