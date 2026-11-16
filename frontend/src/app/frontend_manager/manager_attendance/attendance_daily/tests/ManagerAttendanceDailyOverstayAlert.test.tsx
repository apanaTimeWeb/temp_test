import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ManagerAttendanceDailyStudentRow } from '../components/manager_attendance_daily_widgets/ManagerAttendanceDailyStudentRow';
import { ManagerAttendanceDailyKpis } from '../components/manager_attendance_daily_views/ManagerAttendanceDailyKpis';
import type { Student } from '../types/ManagerAttendanceDailyComponentTypes';

describe('ManagerAttendanceDailyOverstayAlert', () => {
  it('renders prominent red highlight and Overstay Alert badge when student overstays shift', () => {
    const mockStudent: Student = {
      id: '1',
      smartId: 'SL-001',
      name: 'Rahul Sharma',
      initials: 'RS',
      shift: 'Morning',
      consecutiveAbsent: 0,
      status: 'present',
      inTime: '06:15',
      outTime: '',
      seat: 'Seat A-14',
      isOverstay: true,
      overstayMinutes: 90,
      shiftEnd: '14:00 (2:00 PM)',
    };

    const handleEvict = vi.fn();

    render(
      <ManagerAttendanceDailyStudentRow
        student={mockStudent}
        onStatusChange={vi.fn()}
        onFieldChange={vi.fn()}
        onEvictOverstay={handleEvict}
      />
    );

    expect(screen.getByText('Overstay Alert')).toBeInTheDocument();
    expect(screen.getByText(/\+90m overstay/i)).toBeInTheDocument();
    expect(screen.getByText(/Seat A-14/i)).toBeInTheDocument();

    const evictBtn = screen.getByRole('button', { name: /Evict \/ Vacate Seat/i });
    expect(evictBtn).toBeInTheDocument();
    fireEvent.click(evictBtn);
    expect(handleEvict).toHaveBeenCalledWith(mockStudent);
  });

  it('renders Overstay Alerts KPI card reflecting count of overstaying students', () => {
    const students: Student[] = [
      {
        id: '1',
        smartId: 'SL-001',
        name: 'Rahul Sharma',
        initials: 'RS',
        shift: 'Morning',
        consecutiveAbsent: 0,
        status: 'present',
        inTime: '06:15',
        outTime: '',
        isOverstay: true,
        overstayMinutes: 90,
      },
      {
        id: '2',
        smartId: 'SL-002',
        name: 'Priya Verma',
        initials: 'PV',
        shift: 'Morning',
        consecutiveAbsent: 0,
        status: 'present',
        inTime: '07:00',
        outTime: '13:00',
        isOverstay: false,
      },
    ];

    render(
      <ManagerAttendanceDailyKpis
        filtered={students}
        dateLabel="Today"
        shift="Morning"
        shiftLabel={(s) => s}
        present={2}
        absent={0}
        late={0}
        marked={2}
      />
    );

    expect(screen.getByText('Overstay Alerts')).toBeInTheDocument();
    expect(screen.getByText('Exceeding shift end window')).toBeInTheDocument();
  });
});
