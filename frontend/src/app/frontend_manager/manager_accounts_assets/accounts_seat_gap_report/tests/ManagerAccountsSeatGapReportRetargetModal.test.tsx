import React from 'react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ManagerAccountsSeatGapReportRetargetModal } from '../components/manager_accounts_seat_gap_report_views/ManagerAccountsSeatGapReportRetargetModal';
import type { GapRow } from '../hooks/ManagerAccountsSeatGapReportDemoRepository';

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    info: vi.fn(),
    error: vi.fn(),
  },
}));

describe('ManagerAccountsSeatGapReportRetargetModal', () => {
  const mockSeat: GapRow = {
    seatNo: 'S-07',
    shift: 'Morning Shift (6 AM - 2 PM)',
    floor: '1st Floor',
    lastOccupied: '2026-04-01',
    gapDays: 14,
    revenueLoss: 140000,
    status: 'vacant',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    if (typeof window !== 'undefined') {
      window.open = vi.fn();
    }
    if (typeof navigator !== 'undefined') {
      Object.assign(navigator, {
        clipboard: {
          writeText: vi.fn().mockResolvedValue(undefined),
        },
      });
    }
  });

  it('renders modal with vacant seat context and matching inquiry leads', () => {
    render(
      <ManagerAccountsSeatGapReportRetargetModal
        isOpen={true}
        seat={mockSeat}
        onClose={vi.fn()}
      />
    );

    // Title and stats
    expect(
      screen.getByText(/Seat Retargeting: Match Inquiries & Send Offer/i)
    ).toBeInTheDocument();
    expect(screen.getAllByText(/14 days/i).length).toBeGreaterThanOrEqual(1);

    // Matching leads should be rendered
    expect(screen.getByText('Amit Verma')).toBeInTheDocument();
    expect(screen.getByText('Sneha Gupta')).toBeInTheDocument();
  });

  it('updates generated WhatsApp message when offer incentive changes', () => {
    render(
      <ManagerAccountsSeatGapReportRetargetModal
        isOpen={true}
        seat={mockSeat}
        onClose={vi.fn()}
      />
    );

    // Initial offer: ₹100 instant registration waiver
    expect(
      screen.getByText(/Special ₹100 instant registration waiver/i)
    ).toBeInTheDocument();

    // Click on "2-Day Trial" offer
    const trialBtn = screen.getByRole('button', { name: /2-Day Trial/i });
    fireEvent.click(trialBtn);

    expect(
      screen.getByText(/Complimentary 2-Day free study trial pass included!/i)
    ).toBeInTheDocument();
  });

  it('triggers WhatsApp send action on button click', () => {
    const onOfferSent = vi.fn();
    render(
      <ManagerAccountsSeatGapReportRetargetModal
        isOpen={true}
        seat={mockSeat}
        onClose={vi.fn()}
        onOfferSent={onOfferSent}
      />
    );

    const sendBtn = screen.getByRole('button', { name: /Send WhatsApp Offer to/i });
    fireEvent.click(sendBtn);

    expect(window.open).toHaveBeenCalled();
    expect(onOfferSent).toHaveBeenCalled();
  });

  it('supports broadcasting offer to all matching leads', () => {
    const onOfferSent = vi.fn();
    const onClose = vi.fn();
    render(
      <ManagerAccountsSeatGapReportRetargetModal
        isOpen={true}
        seat={mockSeat}
        onClose={onClose}
        onOfferSent={onOfferSent}
      />
    );

    const broadcastBtn = screen.getByRole('button', { name: /Broadcast to All/i });
    fireEvent.click(broadcastBtn);

    expect(onOfferSent).toHaveBeenCalledWith(expect.anything(), 'broadcast_all');
    expect(onClose).toHaveBeenCalled();
  });
});
