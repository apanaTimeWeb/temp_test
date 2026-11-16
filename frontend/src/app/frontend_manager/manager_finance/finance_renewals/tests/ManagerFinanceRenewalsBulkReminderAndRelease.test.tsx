import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import ManagerFinanceRenewalsAlertBanner from '../components/manager_finance_renewals_views/ManagerFinanceRenewalsAlertBanner';

describe('Module 15: Renewals - 1-Click WhatsApp Reminders & Seat Release Policy', () => {
  it('renders 1-Click Bulk WhatsApp button for <= 3 days due students and triggers handler', () => {
    const handle3DayReminders = vi.fn();
    const handleDueReminders = vi.fn();
    const handleAutoRelease = vi.fn();

    render(
      <ManagerFinanceRenewalsAlertBanner
        expiringCount={4}
        expiredCount={2}
        pastGraceCount={1}
        onSendDueReminders={handleDueReminders}
        onSend3DayReminders={handle3DayReminders}
        onAutoReleaseSeats={handleAutoRelease}
      />
    );

    // Verify 1-Click button exists
    const oneClickBtn = screen.getByTestId('manager-finance-1click-3day-whatsapp');
    expect(oneClickBtn).toBeInTheDocument();
    expect(oneClickBtn).toHaveTextContent(/1-Click Bulk WhatsApp/);

    fireEvent.click(oneClickBtn);
    expect(handle3DayReminders).toHaveBeenCalledTimes(1);

    // Verify Seat Auto-Release Policy banner
    expect(screen.getByText('Seat Auto-Release Policy (3-Day Grace Period)')).toBeInTheDocument();
    expect(screen.getByText(/1 Seats Eligible for Release/)).toBeInTheDocument();

    // Verify Auto-Release button
    const releaseBtn = screen.getByTestId('manager-finance-bulk-seat-release');
    expect(releaseBtn).toBeInTheDocument();
    expect(releaseBtn).toHaveTextContent('Auto-Release Expired Seats (1)');

    fireEvent.click(releaseBtn);
    expect(handleAutoRelease).toHaveBeenCalledTimes(1);
  });
});
