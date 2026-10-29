import { describe, expect, it } from 'vitest';
import { MANAGER_ENGAGEMENT_SAMPLE_ATTENDANCE } from '@/app/frontend_manager/manager_attendance/attendance_absentee_report/hooks/ManagerAttendanceAbsenteeReportDemoRepository';
import { MANAGER_ENGAGEMENT_SAMPLE_ATTENDANCE as FIXTURE_SOURCE } from '@/app/frontend_manager/manager_attendance/attendance_absentee_report/mocks/manager_attendance_absentee_report_fixtures/ManagerAttendanceAbsenteeReportSampleFixtures';

describe('ManagerAttendanceAbsenteeReportDemoRepository', () => {
  it('returns a defensive sample snapshot rather than aliasing fixture objects', () => {
    expect(MANAGER_ENGAGEMENT_SAMPLE_ATTENDANCE).not.toBe(FIXTURE_SOURCE);
    expect(MANAGER_ENGAGEMENT_SAMPLE_ATTENDANCE[0]).not.toBe(FIXTURE_SOURCE[0]);
    expect(MANAGER_ENGAGEMENT_SAMPLE_ATTENDANCE[0]).toEqual(FIXTURE_SOURCE[0]);
  });
});
