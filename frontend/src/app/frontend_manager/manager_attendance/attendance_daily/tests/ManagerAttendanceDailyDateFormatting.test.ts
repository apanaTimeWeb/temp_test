import { describe, expect, it } from 'vitest';
import { formatManagerAttendanceCalendarDate } from '@/app/frontend_manager/manager_attendance/attendance_daily/utils/ManagerAttendanceDailyDateFormatting';

describe('ManagerAttendanceDailyDateFormatting', () => {
  it('formats date-only values as local calendar dates and rejects impossible dates', () => {
    expect(formatManagerAttendanceCalendarDate('2026-10-17', 'en-GB')).toContain('17');
    expect(formatManagerAttendanceCalendarDate('2026-02-30', 'en-GB')).toBe('—');
    expect(formatManagerAttendanceCalendarDate('', 'en-GB')).toBe('—');
  });
});
