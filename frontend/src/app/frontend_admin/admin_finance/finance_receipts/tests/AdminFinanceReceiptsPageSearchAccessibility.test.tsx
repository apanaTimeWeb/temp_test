import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import messages from '@/app/frontend_admin/admin_finance/finance_receipts/locales/admin_finance_receipts_en.json';
import { AdminFinanceReceiptsPage } from '@/app/frontend_admin/admin_finance/finance_receipts/components/AdminFinanceReceiptsPage';

afterEach(() => { cleanup(); vi.unstubAllEnvs(); });

describe('AdminFinanceReceiptsPage search accessibility', () => {
  it('exposes an accessible name for receipt search', () => {
    vi.stubEnv('NEXT_PUBLIC_FRONTEND_DEMO_MODE', 'true');
    render(<NextIntlClientProvider locale="en" messages={messages}><AdminFinanceReceiptsPage /></NextIntlClientProvider>);
    expect(screen.getByRole('textbox', { name: 'Search receipts by receipt number, student name or ID' })).toBeTruthy();
  });
});
