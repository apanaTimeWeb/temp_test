/**
 * Module-owned, sample-only repository implementation. Each exported collection/object is a defensive
 * snapshot of the authored fixture data; these values are not a persistence or API contract.
 */
import type { ManagerAttendanceAbsenteeReportSampleAttendanceStudent as ManagerAttendanceAbsenteeReportSampleAttendanceStudentFixture } from '@/app/frontend_manager/manager_attendance/attendance_absentee_report/mocks/manager_attendance_absentee_report_fixtures/ManagerAttendanceAbsenteeReportSampleFixtures';
import type { ManagerAttendanceAbsenteeReportSampleAbsentee as ManagerAttendanceAbsenteeReportSampleAbsenteeFixture } from '@/app/frontend_manager/manager_attendance/attendance_absentee_report/mocks/manager_attendance_absentee_report_fixtures/ManagerAttendanceAbsenteeReportSampleFixtures';
import { MANAGER_ENGAGEMENT_SAMPLE_ATTENDANCE as MANAGER_ENGAGEMENT_SAMPLE_ATTENDANCEFixture } from '@/app/frontend_manager/manager_attendance/attendance_absentee_report/mocks/manager_attendance_absentee_report_fixtures/ManagerAttendanceAbsenteeReportSampleFixtures';
import { MANAGER_ENGAGEMENT_SAMPLE_ABSENTEES as MANAGER_ENGAGEMENT_SAMPLE_ABSENTEESFixture } from '@/app/frontend_manager/manager_attendance/attendance_absentee_report/mocks/manager_attendance_absentee_report_fixtures/ManagerAttendanceAbsenteeReportSampleFixtures';

/** DATA FLOW: Module-owned sample fixtures -> defensive demo repository exports -> feature preview; sample data is not persistence. */

export type ManagerAttendanceAbsenteeReportSampleAttendanceStudent = ManagerAttendanceAbsenteeReportSampleAttendanceStudentFixture;
export type ManagerAttendanceAbsenteeReportSampleAbsentee = ManagerAttendanceAbsenteeReportSampleAbsenteeFixture;
export const MANAGER_ENGAGEMENT_SAMPLE_ATTENDANCE = MANAGER_ENGAGEMENT_SAMPLE_ATTENDANCEFixture.map((record) => (typeof record === 'object' && record !== null ? { ...record } : record));
export const MANAGER_ENGAGEMENT_SAMPLE_ABSENTEES = MANAGER_ENGAGEMENT_SAMPLE_ABSENTEESFixture.map((record) => (typeof record === 'object' && record !== null ? { ...record } : record));
