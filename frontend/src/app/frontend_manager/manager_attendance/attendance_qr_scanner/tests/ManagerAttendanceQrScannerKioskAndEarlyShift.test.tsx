import React from 'react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ManagerAttendanceQrScannerPage from '../components/manager_attendance_qr_scanner_views/ManagerAttendanceQrScannerPage';

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

describe('ManagerAttendanceQrScannerKioskAndEarlyShift', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('launches full-screen locked kiosk mode and exits only with correct PIN', () => {
    render(<ManagerAttendanceQrScannerPage />);

    // Click "Launch Locked Kiosk Mode"
    const kioskBtn = screen.getByRole('button', { name: /Launch Locked Kiosk Mode/i });
    fireEvent.click(kioskBtn);

    // Should now display the locked kiosk screen
    expect(screen.getByText(/Kiosk Tablet Mode Active \(Locked\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Point QR Code or Tap Card/i)).toBeInTheDocument();

    // Click "Exit Kiosk"
    const exitBtn = screen.getByRole('button', { name: /Exit Kiosk/i });
    fireEvent.click(exitBtn);

    // PIN prompt should appear
    expect(screen.getByText(/Admin Unlock PIN/i)).toBeInTheDocument();
    const pinInput = screen.getByPlaceholderText('Enter PIN (1234)');

    // Enter wrong PIN
    fireEvent.change(pinInput, { target: { value: '9999' } });
    const unlockBtn = screen.getByRole('button', { name: /^Unlock$/i });
    fireEvent.click(unlockBtn);

    // Still in Kiosk mode
    expect(screen.getByText(/Kiosk Tablet Mode Active \(Locked\)/i)).toBeInTheDocument();

    // Enter correct PIN
    fireEvent.change(pinInput, { target: { value: '1234' } });
    fireEvent.click(unlockBtn);

    // Kiosk mode exited, back to desk view
    expect(screen.queryByText(/Kiosk Tablet Mode Active \(Locked\)/i)).not.toBeInTheDocument();
  });

  it('triggers Early Shift Entry warning when evening student scans in the morning', () => {
    render(<ManagerAttendanceQrScannerPage />);

    const input = screen.getByPlaceholderText(/e\.g\. LIB-001/i);
    // LIB-005 is assigned to Evening Shift (06:00 PM - 10:00 PM)
    fireEvent.change(input, { target: { value: 'LIB-005' } });

    const checkInBtn = screen.getByRole('button', { name: /Verify Check-In/i });
    fireEvent.click(checkInBtn);

    // Warning dialog should appear
    expect(
      screen.getByText(/Early Shift Entry Restriction Detected/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Evening Shift/i)).toBeInTheDocument();
    expect(screen.getByText(/Reject Entry \(Keep Gate Closed\)/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Manager Override \(Allow Exceptional Entry\)/i)
    ).toBeInTheDocument();
  });

  it('allows Morning shift student normal check-in without early entry warning', () => {
    render(<ManagerAttendanceQrScannerPage />);

    const input = screen.getByPlaceholderText(/e\.g\. LIB-001/i);
    // LIB-001 is assigned to Morning Shift
    fireEvent.change(input, { target: { value: 'LIB-001' } });

    const checkInBtn = screen.getByRole('button', { name: /Verify Check-In/i });
    fireEvent.click(checkInBtn);

    // No warning dialog
    expect(
      screen.queryByText(/Early Shift Entry Restriction Detected/i)
    ).not.toBeInTheDocument();
    expect(screen.getByText(/GATE CHECK-IN VERIFIED/i)).toBeInTheDocument();
  });
});
