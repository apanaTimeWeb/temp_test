import { describe, expect, it } from 'vitest';
import { formatManagerQrScannerCalendarDate } from '@/app/frontend_manager/manager_attendance/attendance_qr_scanner/utils/ManagerAttendanceQrScannerDateFormatting';

describe('ManagerAttendanceQrScannerDateFormatting', () => {
  it('formats date-only values as local calendar dates and rejects impossible dates', () => {
    expect(formatManagerQrScannerCalendarDate('2026-10-17', 'en-GB')).toContain('17');
    expect(formatManagerQrScannerCalendarDate('2026-02-30', 'en-GB')).toBe('—');
    expect(formatManagerQrScannerCalendarDate('', 'en-GB')).toBe('—');
  });
});
