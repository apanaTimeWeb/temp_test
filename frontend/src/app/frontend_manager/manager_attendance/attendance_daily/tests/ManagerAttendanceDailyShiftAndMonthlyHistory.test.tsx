import { describe, expect, it } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MANAGER_ENGAGEMENT_SAMPLE_ATTENDANCE } from '../hooks/ManagerAttendanceDailyDemoRepository';
import { getStudentMonthlyAttendance } from '../utils/ManagerAttendanceDailyMonthlyHistoryUtils';
import { ManagerAttendanceDailyMemberMonthlyHistoryModal } from '../components/manager_attendance_daily_views/ManagerAttendanceDailyMemberMonthlyHistoryModal';
import { ManagerAttendanceDailyMonthlyRegister } from '../components/manager_attendance_daily_views/ManagerAttendanceDailyMonthlyRegister';
import type { Student } from '../types/ManagerAttendanceDailyComponentTypes';

describe('ManagerAttendanceDailyShiftAndMonthlyHistory', () => {
  it('verifies all shift conditions have active enrolled members', () => {
    const allStudents = [...MANAGER_ENGAGEMENT_SAMPLE_ATTENDANCE];

    // Condition 1: All shifts
    expect(allStudents.length).toBeGreaterThanOrEqual(10);

    // Condition 2: Morning Shift
    const morningStudents = allStudents.filter((s) => s.shift === 'Morning');
    expect(morningStudents.length).toBeGreaterThanOrEqual(4);
    expect(morningStudents.some((s) => s.name === 'Rahul Sharma')).toBe(true);

    // Condition 3: Afternoon Shift
    const afternoonStudents = allStudents.filter((s) => s.shift === 'Afternoon');
    expect(afternoonStudents.length).toBeGreaterThanOrEqual(2);
    expect(afternoonStudents.some((s) => s.name === 'Amit Kumar')).toBe(true);

    // Condition 4: Evening Shift
    const eveningStudents = allStudents.filter((s) => s.shift === 'Evening');
    expect(eveningStudents.length).toBeGreaterThanOrEqual(2);
    expect(eveningStudents.some((s) => s.name === 'Rohan Das')).toBe(true);

    // Condition 5: Night Shift
    const nightStudents = allStudents.filter((s) => s.shift === 'Night');
    expect(nightStudents.length).toBeGreaterThanOrEqual(2);
    expect(nightStudents.some((s) => s.name === 'Vikram Malhotra')).toBe(true);

    // Condition 6: Full Day Shift
    const fullDayStudents = allStudents.filter((s) => s.shift === 'Full Day');
    expect(fullDayStudents.length).toBeGreaterThanOrEqual(2);
    expect(fullDayStudents.some((s) => s.name === 'Suresh Reddy')).toBe(true);
  });

  it('generates accurate month-wise attendance metrics and calendar days', () => {
    const student: Student = {
      id: '1',
      smartId: 'SL-001',
      name: 'Rahul Sharma',
      initials: 'RS',
      shift: 'Morning',
      consecutiveAbsent: 0,
      status: 'present',
      inTime: '06:15',
      outTime: '14:00',
      seat: 'Seat A-14',
    };

    const novHistory = getStudentMonthlyAttendance(student, '2026-11');
    expect(novHistory.studentName).toBe('Rahul Sharma');
    expect(novHistory.smartId).toBe('SL-001');
    expect(novHistory.shift).toBe('Morning');
    expect(novHistory.totalDays).toBe(30);
    expect(novHistory.totalWorkingDays).toBeGreaterThan(20);
    expect(novHistory.attendanceRate).toBeGreaterThan(70);
    expect(novHistory.dailyLogs.length).toBe(30);

    // Sunday holidays
    const sundayLogs = novHistory.dailyLogs.filter((l) => l.isSunday);
    expect(sundayLogs.length).toBeGreaterThan(0);
    expect(sundayLogs.every((l) => l.status === 'holiday')).toBe(true);

    // October has 31 days
    const octHistory = getStudentMonthlyAttendance(student, '2026-10');
    expect(octHistory.totalDays).toBe(31);
    expect(octHistory.dailyLogs.length).toBe(31);
  });

  it('renders Member Monthly Attendance History Modal with calendar and metrics', () => {
    const student: Student = {
      id: '1',
      smartId: 'SL-001',
      name: 'Rahul Sharma',
      initials: 'RS',
      shift: 'Morning',
      consecutiveAbsent: 0,
      status: 'present',
      inTime: '06:15',
      outTime: '14:00',
      seat: 'Seat A-14',
    };

    render(
      <ManagerAttendanceDailyMemberMonthlyHistoryModal
        isOpen={true}
        student={student}
        onClose={() => {}}
      />
    );

    // Student identity and shift
    expect(screen.getAllByText('Rahul Sharma').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('SL-001')).toBeInTheDocument();
    expect(screen.getByText('Morning Shift')).toBeInTheDocument();
    expect(screen.getByText('Seat A-14')).toBeInTheDocument();

    // Month Selector Buttons
    expect(screen.getByText('November 2026 (Current)')).toBeInTheDocument();
    expect(screen.getByText('October 2026')).toBeInTheDocument();

    // Metric Badges
    expect(screen.getByText('Attendance Rate')).toBeInTheDocument();
    expect(screen.getByText('Present Days')).toBeInTheDocument();
    expect(screen.getByText('Absent Days')).toBeInTheDocument();
    expect(screen.getByText('Late Arrivals')).toBeInTheDocument();

    // Calendar grid
    expect(screen.getByText('Day 1')).toBeInTheDocument();
    expect(screen.getByText('Day 15')).toBeInTheDocument();
  });

  it('renders Monthly Attendance Register with shift filtering and member summaries', () => {
    const students: Student[] = [...MANAGER_ENGAGEMENT_SAMPLE_ATTENDANCE];

    render(
      <ManagerAttendanceDailyMonthlyRegister
        students={students}
        onOpenStudentHistory={() => {}}
      />
    );

    // Verify header and controls
    expect(screen.getByText('Select Month:')).toBeInTheDocument();
    expect(screen.getByText('Export CSV')).toBeInTheDocument();
    expect(screen.getByText('Print Register')).toBeInTheDocument();

    // Verify members are listed
    expect(screen.getByText('Rahul Sharma')).toBeInTheDocument();
    expect(screen.getByText('Vikram Malhotra')).toBeInTheDocument();
    expect(screen.getByText('Suresh Reddy')).toBeInTheDocument();

    // Filter by Night shift
    const nightFilterBtn = screen.getByRole('button', { name: 'Night' });
    fireEvent.click(nightFilterBtn);

    // Night student remains visible
    expect(screen.getByText('Vikram Malhotra')).toBeInTheDocument();
    // Morning student filtered out
    expect(screen.queryByText('Rahul Sharma')).not.toBeInTheDocument();
  });
});
