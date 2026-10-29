/**
 * Module-owned, sample-only repository implementation. Each exported collection/object is a defensive
 * snapshot of the authored fixture data; these values are not a persistence or API contract.
 */
import type { ManagerAttendanceHolidayCalendarSampleAttendanceStudent as ManagerAttendanceHolidayCalendarSampleAttendanceStudentFixture } from '@/app/frontend_manager/manager_attendance/attendance_holiday_calendar/mocks/manager_attendance_holiday_calendar_fixtures/ManagerAttendanceHolidayCalendarSampleFixtures';
import type { ManagerAttendanceHolidayCalendarSampleAbsentee as ManagerAttendanceHolidayCalendarSampleAbsenteeFixture } from '@/app/frontend_manager/manager_attendance/attendance_holiday_calendar/mocks/manager_attendance_holiday_calendar_fixtures/ManagerAttendanceHolidayCalendarSampleFixtures';
import { MANAGER_ENGAGEMENT_SAMPLE_ATTENDANCE as MANAGER_ENGAGEMENT_SAMPLE_ATTENDANCEFixture } from '@/app/frontend_manager/manager_attendance/attendance_holiday_calendar/mocks/manager_attendance_holiday_calendar_fixtures/ManagerAttendanceHolidayCalendarSampleFixtures';
import { MANAGER_ENGAGEMENT_SAMPLE_ABSENTEES as MANAGER_ENGAGEMENT_SAMPLE_ABSENTEESFixture } from '@/app/frontend_manager/manager_attendance/attendance_holiday_calendar/mocks/manager_attendance_holiday_calendar_fixtures/ManagerAttendanceHolidayCalendarSampleFixtures';

/** DATA FLOW: Module-owned sample fixtures -> defensive demo repository exports -> feature preview; sample data is not persistence. */

export type ManagerAttendanceHolidayCalendarSampleAttendanceStudent = ManagerAttendanceHolidayCalendarSampleAttendanceStudentFixture;
export type ManagerAttendanceHolidayCalendarSampleAbsentee = ManagerAttendanceHolidayCalendarSampleAbsenteeFixture;
export const MANAGER_ENGAGEMENT_SAMPLE_ATTENDANCE = MANAGER_ENGAGEMENT_SAMPLE_ATTENDANCEFixture.map((record) => (typeof record === 'object' && record !== null ? { ...record } : record));
export const MANAGER_ENGAGEMENT_SAMPLE_ABSENTEES = MANAGER_ENGAGEMENT_SAMPLE_ABSENTEESFixture.map((record) => (typeof record === 'object' && record !== null ? { ...record } : record));
