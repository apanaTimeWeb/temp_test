'use client';
import ManagerAttendanceQrScannerPage from '@/app/frontend_manager/manager_attendance/attendance_qr_scanner/components/manager_attendance_qr_scanner_views/ManagerAttendanceQrScannerPage.tsx';
import type { ManagerAttendanceQrScannerMainProps } from '@/app/frontend_manager/manager_attendance/attendance_qr_scanner/types/ManagerAttendanceQrScannerMainTypes';

// RESPONSIBILITY: Preserve supported route query state at the module boundary and pass it to the feature view.
// DATA FLOW: Next.js searchParams -> route page -> Main props -> feature view.
export function ManagerAttendanceQrScannerMain(props: ManagerAttendanceQrScannerMainProps) {
  return <ManagerAttendanceQrScannerPage {...props} />;
}
