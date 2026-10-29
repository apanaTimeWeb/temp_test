/** Module-local component props and UI/state types extracted from component files. */
import type { ManagerAttendanceQrScannerSearchParams } from '@/app/frontend_manager/manager_attendance/attendance_qr_scanner/types/ManagerAttendanceQrScannerMainTypes';

export type ManagerAttendanceQrScannerPageProps = {
  searchParams?: Promise<ManagerAttendanceQrScannerSearchParams>;
};
