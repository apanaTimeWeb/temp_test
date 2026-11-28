import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ManagerAttendanceMonthlyHistoryMemberModal } from '../components/manager_attendance_monthly_history_views/ManagerAttendanceMonthlyHistoryMemberModal';
import { ManagerAttendanceMonthlyHistoryRegister } from '../components/manager_attendance_monthly_history_views/ManagerAttendanceMonthlyHistoryRegister';
import { MANAGER_ATTENDANCE_MONTHLY_HISTORY_SAMPLE_STUDENTS } from '../hooks/ManagerAttendanceMonthlyHistoryDemoRepository';
import type { Student } from '../types/ManagerAttendanceMonthlyHistoryTypes';
import { getStudentMonthlyAttendance } from '../utils/ManagerAttendanceMonthlyHistoryUtilities';

describe('ManagerAttendanceMonthlyHistory', () => {
  it('verifies all shift conditions have active enrolled members', () => {
    const allStudents = [...MANAGER_ATTENDANCE_MONTHLY_HISTORY_SAMPLE_STUDENTS];

    expect(allStudents.length).toBeGreaterThanOrEqual(10);
    expect(allStudents.some((s) => s.shift === 'Morning' && s.name === 'Rahul Sharma')).toBe(true);
    expect(allStudents.some((s) => s.shift === 'Afternoon' && s.name === 'Amit Kumar')).toBe(true);
    expect(allStudents.some((s) => s.shift === 'Evening' && s.name === 'Rohan Das')).toBe(true);
    expect(allStudents.some((s) => s.shift === 'Night' && s.name === 'Vikram Malhotra')).toBe(true);
    expect(allStudents.some((s) => s.shift === 'Full Day' && s.name === 'Suresh Reddy')).toBe(true);
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

    const sundayLogs = novHistory.dailyLogs.filter((l) => l.isSunday);
    expect(sundayLogs.length).toBeGreaterThan(0);
    expect(sundayLogs.every((l) => l.status === 'holiday')).toBe(true);

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
      <ManagerAttendanceMonthlyHistoryMemberModal
        isOpen={true}
        student={student}
        onClose={() => {}}
      />
    );

    expect(screen.getAllByText('Rahul Sharma').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('SL-001')).toBeInTheDocument();
    expect(screen.getByText('Morning Shift')).toBeInTheDocument();
    expect(screen.getByText('Seat A-14')).toBeInTheDocument();
    expect(screen.getByText('November 2026 (Current)')).toBeInTheDocument();
    expect(screen.getByText('October 2026')).toBeInTheDocument();
    expect(screen.getByText('Attendance Rate')).toBeInTheDocument();
    expect(screen.getByText('Present Days')).toBeInTheDocument();
    expect(screen.getByText('Absent Days')).toBeInTheDocument();
    expect(screen.getByText('Late Arrivals')).toBeInTheDocument();
    expect(screen.getByText('Day 1')).toBeInTheDocument();
    expect(screen.getByText('Day 15')).toBeInTheDocument();
  });

  it('renders Monthly Attendance Register with shift filtering and member summaries', () => {
    const students: Student[] = [...MANAGER_ATTENDANCE_MONTHLY_HISTORY_SAMPLE_STUDENTS];

    render(
      <ManagerAttendanceMonthlyHistoryRegister
        students={students}
        onOpenStudentHistory={() => {}}
      />
    );

    expect(screen.getByText('Select Month:')).toBeInTheDocument();
    expect(screen.getByText('Export CSV')).toBeInTheDocument();
    expect(screen.getByText('Print Register')).toBeInTheDocument();

    expect(screen.getByText('Rahul Sharma')).toBeInTheDocument();
    expect(screen.getByText('Vikram Malhotra')).toBeInTheDocument();
    expect(screen.getByText('Suresh Reddy')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Night' }));

    expect(screen.getByText('Vikram Malhotra')).toBeInTheDocument();
    expect(screen.queryByText('Rahul Sharma')).not.toBeInTheDocument();
  });
});
