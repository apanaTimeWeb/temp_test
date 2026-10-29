import { describe, expect, it } from 'vitest';
import { formatManagerHolidayCalendarCalendarDate } from '@/app/frontend_manager/manager_attendance/attendance_holiday_calendar/utils/ManagerAttendanceHolidayCalendarDateFormatting';

describe('ManagerAttendanceHolidayCalendarDateFormatting', () => {
  it('formats date-only values as local calendar dates and rejects impossible dates', () => {
    expect(formatManagerHolidayCalendarCalendarDate('2026-10-17', 'en-GB')).toContain('17');
    expect(formatManagerHolidayCalendarCalendarDate('2026-02-30', 'en-GB')).toBe('—');
    expect(formatManagerHolidayCalendarCalendarDate('', 'en-GB')).toBe('—');
  });
});
