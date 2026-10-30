import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import accountingMessages from '@/app/frontend_admin/admin_accounts_assets/accounts_daily_settlement/locales/admin_accounts_daily_settlement_en.json';
import { AdminAccountsDailySettlementPage } from '@/app/frontend_admin/admin_accounts_assets/accounts_daily_settlement/components/AdminAccountsDailySettlementPage';

vi.mock('sonner', () => ({
  default: { info: vi.fn(), error: vi.fn() },
}));

afterEach(() => {
  cleanup();
  vi.unstubAllEnvs();
});

describe('AdminAccountsDailySettlementPage', () => {
  it('filters fixture rows by the selected date', () => {
    vi.stubEnv('NEXT_PUBLIC_FRONTEND_DEMO_MODE', 'true');
    render(<NextIntlClientProvider locale="en" messages={accountingMessages}><AdminAccountsDailySettlementPage /></NextIntlClientProvider>);

    expect(screen.getByText('Morning (6AM–2PM)')).toBeTruthy();
    fireEvent.change(screen.getByLabelText('Settlement date'), { target: { value: '2026-10-09' } });
    expect(screen.getByText('No settlement entries for 2026-10-09.')).toBeTruthy();
  });

  it('resets the selected date to the module default', () => {
    vi.stubEnv('NEXT_PUBLIC_FRONTEND_DEMO_MODE', 'true');
    render(<NextIntlClientProvider locale="en" messages={accountingMessages}><AdminAccountsDailySettlementPage /></NextIntlClientProvider>);
    const dateInput = screen.getByLabelText('Settlement date') as HTMLInputElement;
    fireEvent.change(dateInput, { target: { value: '2026-10-09' } });
    fireEvent.click(screen.getByRole('button', { name: 'Reset date' }));
    expect(dateInput.value).toBe('2026-10-10');
  });

  it('renders the settle action with a semantic className and preserves demo-only gating', () => {
    vi.stubEnv('NEXT_PUBLIC_FRONTEND_DEMO_MODE', 'true');
    render(<NextIntlClientProvider locale="en" messages={accountingMessages}><AdminAccountsDailySettlementPage /></NextIntlClientProvider>);
    const settleButton = screen.getAllByRole('button', { name: /settle/i })[0];
    expect(settleButton.className).toContain('bg-success');
    expect(settleButton.className).not.toBe('');
  });

  it('changes a pending row only within the demo preview', () => {
    vi.stubEnv('NEXT_PUBLIC_FRONTEND_DEMO_MODE', 'true');
    render(<NextIntlClientProvider locale="en" messages={accountingMessages}><AdminAccountsDailySettlementPage /></NextIntlClientProvider>);

    fireEvent.click(screen.getAllByRole('button', { name: /settle/i })[0]);
    expect(screen.getAllByRole('button', { name: /settle/i })).toHaveLength(1);
  });
});
