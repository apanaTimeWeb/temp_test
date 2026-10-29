// Types for manager_attendance

export interface ManagerAttendanceDailyHolidayCalendarForm {
  date: string;
  name: string;
  type: string;
}

export interface ManagerAttendanceDailyHolidayCalendarAddModalProps {
  show: boolean;
  form: ManagerAttendanceDailyHolidayCalendarForm;
  onChange: (form: ManagerAttendanceDailyHolidayCalendarForm) => void;
  onClose: () => void;
  onAdd: () => void;
}
