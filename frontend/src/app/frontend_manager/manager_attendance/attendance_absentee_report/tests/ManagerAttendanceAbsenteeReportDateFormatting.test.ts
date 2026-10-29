import { describe, expect, it } from 'vitest';
import { formatManagerAbsenteeReportCalendarDate } from '@/app/frontend_manager/manager_attendance/attendance_absentee_report/utils/ManagerAttendanceAbsenteeReportDateFormatting';

describe('ManagerAttendanceAbsenteeReportDateFormatting', () => {
  it('formats date-only values as local calendar dates and rejects impossible dates', () => {
    expect(formatManagerAbsenteeReportCalendarDate('2026-10-17', 'en-GB')).toContain('17');
    expect(formatManagerAbsenteeReportCalendarDate('2026-02-30', 'en-GB')).toBe('—');
    expect(formatManagerAbsenteeReportCalendarDate('', 'en-GB')).toBe('—');
  });
});
