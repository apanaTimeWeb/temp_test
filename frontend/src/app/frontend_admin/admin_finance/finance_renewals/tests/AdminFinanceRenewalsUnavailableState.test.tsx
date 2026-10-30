import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { describe, expect, it } from 'vitest';
import messages from '@/app/frontend_admin/admin_finance/finance_renewals/locales/admin_finance_renewals_en.json';
import { AdminRenewalsPage } from '@/app/frontend_admin/admin_finance/finance_renewals/components/AdminFinanceRenewalsPage';

describe('AdminRenewalsPage integration boundary', () => {
  it('explains the missing verified API contract without fabricating records', () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <AdminRenewalsPage />
      </NextIntlClientProvider>,
    );

    expect(screen.getByRole('status')).toHaveTextContent(messages.ADMIN_RENEWALS.LIVE_UNAVAILABLE);
    expect(screen.getByRole('note')).toHaveTextContent(messages.ADMIN_RENEWALS.NO_DEMO_RECORDS);
  });
});
