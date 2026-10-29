/**
 * Module-owned, sample-only repository implementation. Each exported collection/object is a defensive
 * snapshot of the authored fixture data; these values are not a persistence or API contract.
 */
import type { ManagerAttendanceQrScannerSampleAttendanceStudent as ManagerAttendanceQrScannerSampleAttendanceStudentFixture } from '@/app/frontend_manager/manager_attendance/attendance_qr_scanner/mocks/manager_attendance_qr_scanner_fixtures/ManagerAttendanceQrScannerSampleFixtures';
import type { ManagerAttendanceQrScannerSampleAbsentee as ManagerAttendanceQrScannerSampleAbsenteeFixture } from '@/app/frontend_manager/manager_attendance/attendance_qr_scanner/mocks/manager_attendance_qr_scanner_fixtures/ManagerAttendanceQrScannerSampleFixtures';
import { MANAGER_ENGAGEMENT_SAMPLE_ATTENDANCE as MANAGER_ENGAGEMENT_SAMPLE_ATTENDANCEFixture } from '@/app/frontend_manager/manager_attendance/attendance_qr_scanner/mocks/manager_attendance_qr_scanner_fixtures/ManagerAttendanceQrScannerSampleFixtures';
import { MANAGER_ENGAGEMENT_SAMPLE_ABSENTEES as MANAGER_ENGAGEMENT_SAMPLE_ABSENTEESFixture } from '@/app/frontend_manager/manager_attendance/attendance_qr_scanner/mocks/manager_attendance_qr_scanner_fixtures/ManagerAttendanceQrScannerSampleFixtures';

/** DATA FLOW: Module-owned sample fixtures -> defensive demo repository exports -> feature preview; sample data is not persistence. */

export type ManagerAttendanceQrScannerSampleAttendanceStudent = ManagerAttendanceQrScannerSampleAttendanceStudentFixture;
export type ManagerAttendanceQrScannerSampleAbsentee = ManagerAttendanceQrScannerSampleAbsenteeFixture;
export const MANAGER_ENGAGEMENT_SAMPLE_ATTENDANCE = MANAGER_ENGAGEMENT_SAMPLE_ATTENDANCEFixture.map((record) => (typeof record === 'object' && record !== null ? { ...record } : record));
export const MANAGER_ENGAGEMENT_SAMPLE_ABSENTEES = MANAGER_ENGAGEMENT_SAMPLE_ABSENTEESFixture.map((record) => (typeof record === 'object' && record !== null ? { ...record } : record));
