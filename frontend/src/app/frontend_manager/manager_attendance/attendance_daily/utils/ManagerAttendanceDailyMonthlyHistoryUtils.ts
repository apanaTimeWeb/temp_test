import {
  ATTENDANCE_DAY_NAMES,
  ATTENDANCE_SHIFT_TIMINGS,
  pseudoAttendanceHash,
} from '@/app/frontend_manager/manager_attendance/attendance_daily/constants/ManagerAttendanceDailyMonthlyConstants';
import type { Student } from '@/app/frontend_manager/manager_attendance/attendance_daily/types/ManagerAttendanceDailyComponentTypes';

export type AttendanceDailyMonthStatus = 'present' | 'absent' | 'late' | 'holiday';

export interface AttendanceDailyDayRecord {
  dayNumber: number;
  dateStr: string;
  dayOfWeek: string;
  isSunday: boolean;
  status: AttendanceDailyMonthStatus;
  inTime: string;
  outTime: string;
  studyHours: number;
  verificationMethod: string;
}

export interface StudentMonthlyAttendanceSummary {
  studentId: string;
  studentName: string;
  smartId: string;
  shift: string;
  seat: string;
  month: string;
  monthLabel: string;
  totalDays: number;
  totalWorkingDays: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  holidayDays: number;
  attendanceRate: number;
  totalStudyHours: number;
  dailyLogs: AttendanceDailyDayRecord[];
}

export function getStudentMonthlyAttendance(
  student: Student,
  monthKey: string = '2026-11'
): StudentMonthlyAttendanceSummary {
  const [yearStr, monthStr] = monthKey.split('-');
  const year = parseInt(yearStr || '2026', 10);
  const monthIndex = parseInt(monthStr || '11', 10) - 1;
  const totalDays = new Date(year, monthIndex + 1, 0).getDate();
  const monthLabel = new Date(year, monthIndex, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const defaultTiming = ATTENDANCE_SHIFT_TIMINGS[student.shift] || { in: '08:00', out: '17:00', hours: 9.0 };

  const dailyLogs: AttendanceDailyDayRecord[] = [];
  let presentDays = 0;
  let absentDays = 0;
  let lateDays = 0;
  let holidayDays = 0;
  let totalStudyHours = 0;

  for (let d = 1; d <= totalDays; d++) {
    const dStr = String(d).padStart(2, '0');
    const dayOfWeek = ATTENDANCE_DAY_NAMES[new Date(year, monthIndex, d).getDay()];
    const dateFormatted = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${dStr}`;

    if (dayOfWeek === 'Sun') {
      holidayDays++;
      dailyLogs.push({ dayNumber: d, dateStr: dateFormatted, dayOfWeek, isSunday: true, status: 'holiday', inTime: '—', outTime: '—', studyHours: 0, verificationMethod: 'Weekly Off / Sunday' });
      continue;
    }

    const hash = pseudoAttendanceHash(`${student.id}-${student.smartId}-${monthKey}-${d}`);
    const hashMod = hash % 100;
    const isConsecutiveAbsentWindow = student.consecutiveAbsent > 0 && d > totalDays - student.consecutiveAbsent - 2 && monthKey === '2026-11';

    let status: AttendanceDailyMonthStatus = 'present';
    let inTime = defaultTiming.in;
    const outTimeDefault = defaultTiming.out;
    let outTime = outTimeDefault;
    let studyHours = defaultTiming.hours;

    if (isConsecutiveAbsentWindow || hashMod < 6) {
      status = 'absent';
      absentDays++;
      inTime = '—';
      outTime = '—';
      studyHours = 0;
    } else if (hashMod < 14) {
      status = 'late';
      lateDays++;
      presentDays++;
      const [h, m] = defaultTiming.in.split(':').map(Number);
      inTime = `${String(h).padStart(2, '0')}:${String((m + 35) % 60).padStart(2, '0')}`;
      studyHours = Math.max(1, defaultTiming.hours - 0.75);
      totalStudyHours += studyHours;
    } else {
      presentDays++;
      totalStudyHours += studyHours;
    }

    const methods = ['Biometric Turnstile', 'QR Kiosk Scan', 'Manager Roll Check'];
    const verificationMethod = status === 'absent' ? 'Unmarked / Absent' : methods[hash % 3];
    dailyLogs.push({ dayNumber: d, dateStr: dateFormatted, dayOfWeek, isSunday: false, status, inTime, outTime, studyHours: Math.round(studyHours * 10) / 10, verificationMethod });
  }

  const totalWorkingDays = totalDays - holidayDays;
  const attendanceRate = totalWorkingDays > 0 ? Math.round((presentDays / totalWorkingDays) * 1000) / 10 : 0;

  return {
    studentId: student.id, studentName: student.name, smartId: student.smartId, shift: student.shift,
    seat: student.seat || 'General Floor', month: monthKey, monthLabel, totalDays, totalWorkingDays,
    presentDays, absentDays, lateDays, holidayDays, attendanceRate, totalStudyHours: Math.round(totalStudyHours), dailyLogs,
  };
}
