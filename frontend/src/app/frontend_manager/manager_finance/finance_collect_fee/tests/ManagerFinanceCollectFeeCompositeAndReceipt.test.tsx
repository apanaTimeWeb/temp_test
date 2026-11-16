import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import ManagerFinanceCollectFeePostPaymentModal from '../components/manager_finance_collect_fee_views/ManagerFinanceCollectFeePostPaymentModal';

// Mock next-intl
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

describe('Module 13: Collect Fee - Composite Billing & Post-Payment Actions', () => {
  it('renders Post-Payment Action Modal with Print Thermal Receipt and Send WhatsApp Receipt buttons', () => {
    const handleClose = vi.fn();
    render(
      <ManagerFinanceCollectFeePostPaymentModal
        isOpen={true}
        onClose={handleClose}
        receiptNumber="REC-987654"
        studentName="Aarav Sharma"
        smartId="STU-001"
        phone="9876543210"
        totalAmount={1800}
        paymentMode="upi"
        txnId="UPI-778899"
        billingPeriod="Apr 2026"
        lineItems={[
          { id: 'seat_fee', label: 'Seat Monthly Fee', amount: 1200 },
          { id: 'locker_fee', label: 'Locker Rental Fee', amount: 400 },
          { id: 'late_fine', label: 'Late Fine', amount: 200 },
        ]}
      />
    );

    // Verify modal title
    expect(screen.getByText('Fee Collected Successfully!')).toBeInTheDocument();
    expect(screen.getByText('REC-987654')).toBeInTheDocument();
    expect(screen.getByText(/Aarav Sharma/)).toBeInTheDocument();

    // Verify Composite Line Items are rendered
    expect(screen.getByText('Seat Monthly Fee')).toBeInTheDocument();
    expect(screen.getByText('Locker Rental Fee')).toBeInTheDocument();
    expect(screen.getByText('Late Fine')).toBeInTheDocument();
    expect(screen.getByText('₹1,800')).toBeInTheDocument();

    // Verify Action Buttons
    const printBtn = screen.getByTestId('manager-finance-post-payment-print');
    expect(printBtn).toBeInTheDocument();
    expect(printBtn).toHaveTextContent('Print Thermal Receipt');

    const waBtn = screen.getByTestId('manager-finance-post-payment-whatsapp');
    expect(waBtn).toBeInTheDocument();
    expect(waBtn).toHaveTextContent('Send WhatsApp Receipt');

    const doneBtn = screen.getByTestId('manager-finance-post-payment-done');
    expect(doneBtn).toBeInTheDocument();

    fireEvent.click(doneBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('triggers window.print and WhatsApp links on clicking action buttons', () => {
    const printSpy = vi.spyOn(window, 'print').mockImplementation(() => {});
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);

    render(
      <ManagerFinanceCollectFeePostPaymentModal
        isOpen={true}
        onClose={vi.fn()}
        receiptNumber="REC-112233"
        studentName="Neha Patel"
        smartId="STU-002"
        phone="9123456789"
        totalAmount={1200}
        paymentMode="cash"
      />
    );

    const printBtn = screen.getByTestId('manager-finance-post-payment-print');
    fireEvent.click(printBtn);
    expect(printSpy).toHaveBeenCalled();

    const waBtn = screen.getByTestId('manager-finance-post-payment-whatsapp');
    fireEvent.click(waBtn);
    expect(openSpy).toHaveBeenCalledWith(expect.stringContaining('wa.me/919123456789'), '_blank', 'noopener,noreferrer');

    printSpy.mockRestore();
    openSpy.mockRestore();
  });
});
