// Types for manager_absentee_report

export interface ManagerAttendanceAbsenteeReportHolidayCalendarForm {
  date: string;
  name: string;
  type: string;
}

export interface ManagerAttendanceAbsenteeReportHolidayCalendarAddModalProps {
  show: boolean;
  form: ManagerAttendanceAbsenteeReportHolidayCalendarForm;
  onChange: (form: ManagerAttendanceAbsenteeReportHolidayCalendarForm) => void;
  onClose: () => void;
  onAdd: () => void;
}
