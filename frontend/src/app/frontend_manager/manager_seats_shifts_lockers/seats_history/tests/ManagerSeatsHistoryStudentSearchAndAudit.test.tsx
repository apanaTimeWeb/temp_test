import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ManagerSeatsHistoryAuditModal } from '../components/manager_seats_history_dialogs/ManagerSeatsHistoryAuditModal';
import type { ManagerSeatsHistoryRow } from '../types/ManagerSeatsHistoryTypes';

describe('Seats History Search by Student Name and Incident Audit Tool', () => {
  const mockHistoryData: ManagerSeatsHistoryRow[] = [
    {
      seatNo: 'S-001',
      studentName: 'Rahul Sharma',
      smartId: 'LIB-1001',
      shift: 'Morning',
      occupiedFrom: '2026-10-25',
      occupiedTill: '2026-11-15',
      duration: '21 days',
      reason: 'Admission',
    },
    {
      seatNo: 'S-001',
      studentName: 'Aman Verma',
      smartId: 'LIB-1002',
      shift: 'Evening',
      occupiedFrom: '2026-10-01',
      occupiedTill: '2026-10-24',
      duration: '24 days',
      reason: 'Seat Change',
    },
    {
      seatNo: 'S-012',
      studentName: 'Priya Patel',
      smartId: 'LIB-1012',
      shift: 'Morning',
      occupiedFrom: '2026-09-01',
      occupiedTill: '2026-09-30',
      duration: '30 days',
      reason: 'Admission',
    },
  ];

  it('renders audit modal and lists students who occupied the investigated seat in the past month', () => {
    const handleApply = vi.fn();
    const handleClose = vi.fn();

    render(
      <ManagerSeatsHistoryAuditModal
        isOpen={true}
        onClose={handleClose}
        seatOptions={['S-001', 'S-012']}
        historyData={mockHistoryData}
        initialSeat="S-001"
        onApplySeatFilter={handleApply}
      />
    );

    // Modal title check
    expect(screen.getByText(/Seat Incident & Audit Investigation/i)).toBeInTheDocument();

    // Verify S-001 occupants are displayed
    expect(screen.getByText(/Rahul Sharma/i)).toBeInTheDocument();
    expect(screen.getByText(/LIB-1001/i)).toBeInTheDocument();

    // Switch horizon to All Time to see older occupants as well
    const horizonSelect = screen.getByTestId('manager-audit-horizon-select');
    fireEvent.change(horizonSelect, { target: { value: 'all' } });

    // Both Rahul and Aman should be listed for S-001
    expect(screen.getByText(/Rahul Sharma/i)).toBeInTheDocument();
    expect(screen.getByText(/Aman Verma/i)).toBeInTheDocument();

    // Priya is on S-012, so should not be in S-001 roster
    expect(screen.queryByText(/Priya Patel/i)).not.toBeInTheDocument();

    // Click apply filter button
    const applyBtn = screen.getByTestId('manager-audit-apply-filter-btn');
    fireEvent.click(applyBtn);

    expect(handleApply).toHaveBeenCalledWith('S-001', expect.any(String));
  });

  it('allows searching specific student name within the audit modal', () => {
    const handleApply = vi.fn();
    const handleClose = vi.fn();

    render(
      <ManagerSeatsHistoryAuditModal
        isOpen={true}
        onClose={handleClose}
        seatOptions={['S-001', 'S-012']}
        historyData={mockHistoryData}
        initialSeat="S-001"
        onApplySeatFilter={handleApply}
      />
    );

    const horizonSelect = screen.getByTestId('manager-audit-horizon-select');
    fireEvent.change(horizonSelect, { target: { value: 'all' } });

    const studentSearchInput = screen.getByTestId('manager-audit-student-search');
    fireEvent.change(studentSearchInput, { target: { value: 'Aman' } });

    expect(screen.getByText(/Aman Verma/i)).toBeInTheDocument();
    expect(screen.queryByText(/Rahul Sharma/i)).not.toBeInTheDocument();
  });
});
