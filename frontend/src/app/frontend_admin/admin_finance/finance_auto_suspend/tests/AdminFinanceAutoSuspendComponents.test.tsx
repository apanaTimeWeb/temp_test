import { fireEvent,render,screen } from '@testing-library/react';
import { describe,expect,it,vi } from 'vitest';
import { AdminFinanceAutoSuspendKioskModal } from '../components/AdminFinanceAutoSuspendKioskModal';
import { AdminFinanceAutoSuspendTable } from '../components/AdminFinanceAutoSuspendTable';
import type { AdminFinanceAutoSuspendSuspendedStudent } from '../types/AdminFinanceAutoSuspendTypes';

describe('AdminFinanceAutoSuspend Components', () => {
  const sampleDefaulters: AdminFinanceAutoSuspendSuspendedStudent[] = [
    {
      id: 1,
      studentId: 101,
      studentName: 'Rahul Kumar',
      smartId: 'STU101',
      seat: 'A-12',
      shift: 'Morning',
      daysOverdue: 14,
      suspendedSince: '2026-03-28',
      phone: '9876543210',
      duesAmount: 1800,
      planName: 'Monthly Morning',
      branch: 'Downtown Central',
    },
    {
      id: 2,
      studentId: 102,
      studentName: 'Priya Singh',
      smartId: 'STU102',
      seat: 'B-05',
      shift: 'Evening',
      daysOverdue: 9,
      suspendedSince: '2026-04-02',
      phone: '9876543211',
      duesAmount: 1400,
      planName: 'Monthly Evening',
      branch: 'Downtown Central',
    },
  ];

  it('renders turnstile gate simulator and shows ACCESS DENIED for suspended student', () => {
    const handleClose = vi.fn();

    render(
      <AdminFinanceAutoSuspendKioskModal
        isOpen={true}
        onClose={handleClose}
        suspendedStudents={sampleDefaulters}
        initialStudent={sampleDefaulters[0]}
      />
    );

    expect(screen.getByText('Entrance Turnstile QR Kiosk Simulator')).toBeInTheDocument();

    const scanBtn = screen.getByRole('button', { name: /Simulate Gate QR Scan/i });
    fireEvent.click(scanBtn);

    const deniedBox = screen.getByTestId('kiosk-access-denied-box');
    expect(deniedBox).toBeInTheDocument();
    expect(screen.getByText(/SEAT ACCESS SUSPENDED/i)).toBeInTheDocument();
    expect(screen.getByText(/14 days unpaid overdue fee/i)).toBeInTheDocument();
  });

  it('renders defaulters table with sortable columns and action triggers', () => {
    const onToggleSort = vi.fn();
    const onSendReminder = vi.fn();
    const onRestoreStudent = vi.fn();
    const onTestKioskScan = vi.fn();

    render(
      <AdminFinanceAutoSuspendTable
        filtered={sampleDefaulters}
        paginated={sampleDefaulters}
        totalRows={2}
        startItem={1}
        endItem={2}
        pageSize={10}
        effectivePage={0}
        pageCount={1}
        sortField={null}
        sortDirection="asc"
        onToggleSort={onToggleSort}
        onPageSizeChange={vi.fn()}
        onPrevPage={vi.fn()}
        onNextPage={vi.fn()}
        onSendReminder={onSendReminder}
        onRestoreStudent={onRestoreStudent}
        onTestKioskScan={onTestKioskScan}
        shiftLabels={{ Morning: 'Morning', Evening: 'Evening' }}
        labels={{
          student: 'Student Details',
          seat: 'Seat & Shift',
          shift: 'Shift',
          branch: 'Branch',
          dues: 'Pending Dues',
          daysOverdue: 'Overdue Duration',
          suspendedSince: 'Suspended Since',
          actions: 'Actions',
          noStudents: 'No students found',
        }}
      />
    );

    expect(screen.getByText('Rahul Kumar')).toBeInTheDocument();
    expect(screen.getByText('Priya Singh')).toBeInTheDocument();
    expect(screen.getByText(/14 Days Due/i)).toBeInTheDocument();
    expect(screen.getByText(/₹1,800/i)).toBeInTheDocument();

    // Click restore on first student
    const restoreButtons = screen.getAllByRole('button', { name: /Restore/i });
    fireEvent.click(restoreButtons[0]);
    expect(onRestoreStudent).toHaveBeenCalledWith(sampleDefaulters[0]);

    // Click whatsapp reminder
    const whatsappButtons = screen.getAllByRole('button', { name: /WhatsApp/i });
    fireEvent.click(whatsappButtons[0]);
    expect(onSendReminder).toHaveBeenCalledWith(sampleDefaulters[0]);
  });
});
