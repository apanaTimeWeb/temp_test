import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ManagerSeatsMatrixSwapModal } from '../components/manager_seats_matrix_dialogs/ManagerSeatsMatrixSwapModal';
import { SeatData } from '../types/ManagerSeatsMatrixComponentTypes';

describe('Seat Matrix Swap Tool and Zone Filter', () => {
  const mockSeats: SeatData[] = [
    {
      id: 's-05',
      status: 'occupied',
      student: 'Rahul Sharma',
      smartId: 'LIB-1005',
      studentGender: 'Male',
      shift: 'Morning',
      wing: 'AC Hall A',
      expiry: '2026-12-31',
    },
    {
      id: 's-12',
      status: 'free',
      wing: 'AC Hall A',
    },
    {
      id: 's-20',
      status: 'occupied',
      student: 'Priya Verma',
      smartId: 'LIB-1020',
      studentGender: 'Female',
      shift: 'Morning',
      wing: 'Girls Cabin',
      expiry: '2026-11-30',
    },
  ];

  it('renders swap modal and allows selecting target seat for direct relocation', () => {
    const handleSwap = vi.fn();
    const handleClose = vi.fn();

    render(
      <ManagerSeatsMatrixSwapModal
        isOpen={true}
        onClose={handleClose}
        sourceSeat={mockSeats[0]}
        allSeats={mockSeats}
        onConfirmSwap={handleSwap}
      />
    );

    // Modal title and source seat display
    expect(screen.getByText(/Seat Swap & Exchange Tool/i)).toBeInTheDocument();
    expect(screen.getByText(/Seat s-05/i)).toBeInTheDocument();
    expect(screen.getByText(/Rahul Sharma/i)).toBeInTheDocument();

    // Select target seat s-12 (free seat)
    const select = screen.getByTestId('manager-swap-target-seat-select');
    fireEvent.change(select, { target: { value: 's-12' } });

    // Expect mode to show Direct Relocation
    expect(screen.getByText(/Mode: Direct Relocation/i)).toBeInTheDocument();

    // Click confirm swap
    const confirmBtn = screen.getByTestId('manager-confirm-seat-swap-btn');
    fireEvent.click(confirmBtn);

    expect(handleSwap).toHaveBeenCalledWith('s-05', 's-12', expect.any(String));
  });

  it('shows mutual swap mode when swapping with an occupied seat', () => {
    const handleSwap = vi.fn();
    const handleClose = vi.fn();

    render(
      <ManagerSeatsMatrixSwapModal
        isOpen={true}
        onClose={handleClose}
        sourceSeat={mockSeats[0]}
        allSeats={mockSeats}
        onConfirmSwap={handleSwap}
      />
    );

    // Select target seat s-20 (occupied seat)
    const select = screen.getByTestId('manager-swap-target-seat-select');
    fireEvent.change(select, { target: { value: 's-20' } });

    // Expect mode to show Bilateral Mutual Swap
    expect(screen.getByText(/Mode: Bilateral Mutual Swap/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Priya Verma/i).length).toBeGreaterThanOrEqual(1);

    // Click confirm swap
    const confirmBtn = screen.getByTestId('manager-confirm-seat-swap-btn');
    fireEvent.click(confirmBtn);

    expect(handleSwap).toHaveBeenCalledWith('s-05', 's-20', expect.any(String));
  });
});
