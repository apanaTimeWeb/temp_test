import { ManagerAttendanceQrScannerMain } from '@/app/frontend_manager/manager_attendance/attendance_qr_scanner/components/ManagerAttendanceQrScannerMain';
import type { ManagerAttendanceQrScannerMainProps } from '@/app/frontend_manager/manager_attendance/attendance_qr_scanner/types/ManagerAttendanceQrScannerMainTypes';
import type { ManagerAttendanceQrScannerPageProps } from '@/app/frontend_manager/manager_attendance/attendance_qr_scanner/types/ManagerAttendanceQrScannerComponentTypes';



function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ManagerAttendanceQrScannerPage({ searchParams }: ManagerAttendanceQrScannerPageProps) {
  const params = searchParams ? await searchParams : {};
  const mainProps: ManagerAttendanceQrScannerMainProps = {
    view: firstValue(params.view),
    id: firstValue(params.id),
    name: firstValue(params.name),
    phone: firstValue(params.phone),
    smartId: firstValue(params.smartId),
  };
  return <ManagerAttendanceQrScannerMain {...mainProps} />;
}
