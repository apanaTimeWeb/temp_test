import AdminSeatsMatrixBulkGenerateModal from '@/app/frontend_admin/admin_seats_shifts_lockers/seats_matrix/components/AdminSeatsMatrixBulkGenerateModal';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

describe('Admin Seats Matrix - Bulk Generate Seats Modal', () => {
  it('renders modal and generates seats in range', () => {
    const onGenerate = vi.fn();
    const onClose = vi.fn();

    render(
      <AdminSeatsMatrixBulkGenerateModal
        isOpen={true}
        onClose={onClose}
        onGenerate={onGenerate}
        defaultBranchName="Downtown Central"
        existingSeatIds={['1', '2']}
      />,
    );

    expect(screen.getByText('Bulk Generate Study Desks & Cabins')).toBeTruthy();
    expect(screen.getByText('Quick Presets')).toBeTruthy();

    const generateBtn = screen.getByRole('button', { name: /Generate 50 Seats/i });
    fireEvent.click(generateBtn);

    expect(onGenerate).toHaveBeenCalled();
    const generatedSeats = onGenerate.mock.calls[0][0];
    expect(generatedSeats.length).toBe(50);
    expect(generatedSeats[0].id).toBe('1');
    expect(generatedSeats[49].id).toBe('50');
  });

  it('returns null when isOpen is false', () => {
    const { container } = render(
      <AdminSeatsMatrixBulkGenerateModal
        isOpen={false}
        onClose={vi.fn()}
        onGenerate={vi.fn()}
        existingSeatIds={[]}
      />,
    );
    expect(container.firstChild).toBeNull();
  });
});
