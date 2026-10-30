import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import messages from '@/app/frontend_admin/admin_finance/finance_invoices/locales/admin_finance_invoices_en.json';
import { AdminFinanceInvoicesPage } from '@/app/frontend_admin/admin_finance/finance_invoices/components/AdminFinanceInvoicesPage';

afterEach(() => { cleanup(); vi.unstubAllEnvs(); });

describe('AdminFinanceInvoicesPage search accessibility', () => {
  it('exposes an accessible name for invoice search', () => {
    vi.stubEnv('NEXT_PUBLIC_FRONTEND_DEMO_MODE', 'true');
    render(<NextIntlClientProvider locale="en" messages={messages}><AdminFinanceInvoicesPage /></NextIntlClientProvider>);
    expect(screen.getByRole('textbox', { name: 'Search invoices by invoice number, student name or ID' })).toBeTruthy();
  });
});
