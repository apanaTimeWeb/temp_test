import { ManagerCommunicationComplaintsResolveModal } from '@/app/frontend_manager/manager_communication/communication_complaints/components/manager_communication_complaints_views/ManagerCommunicationComplaintsResolveModal';
import type { ManagerCommunicationComplaintsComplaint } from '@/app/frontend_manager/manager_communication/communication_complaints/types/ManagerCommunicationComplaintsTypes';
import { fireEvent,render,screen } from '@testing-library/react';
import { describe,expect,it,vi } from 'vitest';

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('ManagerCommunicationComplaintsResolveModal', () => {
  const mockComplaint: ManagerCommunicationComplaintsComplaint = {
    id: 'CMP-9901',
    title: 'AC Leaking Water',
    student: 'Amit Verma',
    phone: '9876543210',
    seatTag: 'Seat S-14 (Hall A)',
    description: 'AC unit above seat S-14 is dripping cold water.',
    status: 'Open',
    date: '2026-10-18',
    resolvedBy: null,
    resolvedDate: null,
    resolvedNote: null,
  };

  it('renders nothing when not open', () => {
    const { container } = render(
      <ManagerCommunicationComplaintsResolveModal
        complaint={mockComplaint}
        isOpen={false}
        onClose={vi.fn()}
        onConfirmResolve={vi.fn()}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('displays seat tag, student name, and whatsapp preview when open', () => {
    render(
      <ManagerCommunicationComplaintsResolveModal
        complaint={mockComplaint}
        isOpen={true}
        onClose={vi.fn()}
        onConfirmResolve={vi.fn()}
      />
    );

    expect(screen.getByText('Resolve Complaint & Notify Student')).toBeInTheDocument();
    expect(screen.getByText('Seat S-14 (Hall A)')).toBeInTheDocument();
    expect(screen.getByText('Amit Verma')).toBeInTheDocument();
    expect(screen.getByText('Student WhatsApp Preview')).toBeInTheDocument();
  });

  it('confirms resolution and invokes onConfirmResolve callback', () => {
    const confirmSpy = vi.fn();
    render(
      <ManagerCommunicationComplaintsResolveModal
        complaint={mockComplaint}
        isOpen={true}
        onClose={vi.fn()}
        onConfirmResolve={confirmSpy}
      />
    );

    const resolveBtn = screen.getByText('Resolve Status');
    fireEvent.click(resolveBtn);

    expect(confirmSpy).toHaveBeenCalledWith(
      'CMP-9901',
      expect.stringContaining('Seat S-14 (Hall A)'),
      true,
      false
    );
  });
});
