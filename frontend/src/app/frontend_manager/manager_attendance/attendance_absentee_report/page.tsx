import { ManagerAttendanceAbsenteeReportMain } from '@/app/frontend_manager/manager_attendance/attendance_absentee_report/components/ManagerAttendanceAbsenteeReportMain';
import type { ManagerAttendanceAbsenteeReportMainProps } from '@/app/frontend_manager/manager_attendance/attendance_absentee_report/types/ManagerAttendanceAbsenteeReportMainTypes';
import type { ManagerAttendanceAbsenteeReportPageProps } from '@/app/frontend_manager/manager_attendance/attendance_absentee_report/types/ManagerAttendanceAbsenteeReportComponentTypes';



function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ManagerAttendanceAbsenteeReportPage({ searchParams }: ManagerAttendanceAbsenteeReportPageProps) {
  const params = searchParams ? await searchParams : {};
  const mainProps: ManagerAttendanceAbsenteeReportMainProps = {
    view: firstValue(params.view),
    id: firstValue(params.id),
    name: firstValue(params.name),
    phone: firstValue(params.phone),
    smartId: firstValue(params.smartId),
  };
  return <ManagerAttendanceAbsenteeReportMain {...mainProps} />;
}
