import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import AdminAccountsDailySettlementSummarySection from '@/app/frontend_admin/admin_accounts_assets/accounts_daily_settlement/components/AdminAccountsDailySettlementSummarySection';

afterEach(() => cleanup());

describe('AdminAccountsDailySettlementSummarySection', () => {
  it('renders daily-settlement summary values supplied by the page model', () => {
    render(<AdminAccountsDailySettlementSummarySection values={{ cash: '₹500.00', upi: '₹300.00', expenses: '₹50.00', net: '₹750.00' }} labels={{ cashCollected: 'Cash collected', upiCollected: 'UPI collected', expenses: 'Expenses', net: 'Net' }} />);
        expect(screen.getByText('₹750.00')).toBeTruthy();
        expect(screen.getByText('Cash collected')).toBeTruthy();
  });
});
