import { fireEvent,render,screen } from '@testing-library/react';
import { describe,expect,it,vi } from 'vitest';
import { createManagerAbsenteeReportAbsenteeColumns } from '../components/manager_attendance_absentee_report_table_parts/ManagerAttendanceAbsenteeReportColumns';
import { ManagerAttendanceAbsenteeDetailsModal } from '../components/manager_attendance_absentee_report_views/ManagerAttendanceAbsenteeDetailsModal';
import type { ManagerAttendanceAbsenteeReportSampleAbsentee } from '../mocks/manager_attendance_absentee_report_fixtures/ManagerAttendanceAbsenteeReportSampleFixtures';

describe('ManagerAttendanceAbsenteeExcusedLeave', () => {
  const mockAbsentee: ManagerAttendanceAbsenteeReportSampleAbsentee = {
    id: '2',
    name: 'Sneha Patel',
    initials: 'SP',
    smartId: 'SL-004',
    shift: 'Morning',
    daysAbsent: 8,
    lastSeen: '2026-04-04',
    parentPhone: '+91 9700005678',
    parentEmail: 'parent2@email.com',
    notified: false,
    excused: false,
  };

  it('renders leave approval option in Details Modal and invokes onMarkExcused with reason and duration', () => {
    const handleMarkExcused = vi.fn();

    render(
      <ManagerAttendanceAbsenteeDetailsModal
        isOpen={true}
        absentee={mockAbsentee}
        onClose={vi.fn()}
        onSendWhatsApp={vi.fn()}
        onMarkExcused={handleMarkExcused}
        onRevokeExcused={vi.fn()}
      />
    );

    // Click "+ Mark as Excused Leave"
    const openLeaveBtn = screen.getByText('+ Mark as Excused Leave');
    fireEvent.click(openLeaveBtn);

    // Verify presets
    expect(screen.getByText('Visiting Village / Hometown (10 Days)')).toBeInTheDocument();

    // Duration input
    const durationInput = screen.getByPlaceholderText('e.g. 10 Days');
    expect(durationInput).toHaveValue('10');

    // Click Approve & Mark Excused
    const approveBtn = screen.getByText('Approve & Mark Excused');
    fireEvent.click(approveBtn);

    expect(handleMarkExcused).toHaveBeenCalledWith(
      'SL-004',
      'Visiting Village / Hometown (10 Days) (10 Days)',
      '10'
    );
  });

  it('renders Excused Leave badge in column cell renderer when student is excused', () => {
    const excusedAbsentee: ManagerAttendanceAbsenteeReportSampleAbsentee = {
      ...mockAbsentee,
      excused: true,
      leaveReason: 'Visiting Village (10 Days)',
    };

    const cols = createManagerAbsenteeReportAbsenteeColumns(
      {
        student: 'Student',
        smartId: 'Smart ID',
        shift: 'Shift',
        daysAbsent: 'Days Absent',
        days: 'days',
        lastSeen: 'Last Seen',
        parentContact: 'Parent Contact',
        actions: 'Actions',
        samplePreviouslyNotified: 'Notified',
        parentAlertsUnavailable: 'Unavailable',
        alertUnavailable: 'Alert',
        locale: 'en',
      },
      { Morning: 'Morning' },
      () => 'badge-danger'
    );

    const daysCol = cols.find((c) => c.field === 'daysAbsent');
    expect(daysCol).toBeDefined();

    const rendered = daysCol?.cellRenderer?.({
      value: 8,
      data: excusedAbsentee,
      rowIndex: 0,
    } as any);

    const { container } = render(<div>{rendered}</div>);
    expect(container.textContent).toContain('Excused Leave');
    expect(container.textContent).toContain('Visiting Village (10 Days)');
  });
});
