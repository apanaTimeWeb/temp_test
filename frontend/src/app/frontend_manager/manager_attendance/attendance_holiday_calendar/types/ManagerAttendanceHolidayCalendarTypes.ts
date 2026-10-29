// Types for manager_holiday_calendar

export interface ManagerAttendanceHolidayCalendarForm {
  date: string;
  name: string;
  type: string;
}

export interface ManagerAttendanceHolidayCalendarAddModalProps {
  show: boolean;
  form: ManagerAttendanceHolidayCalendarForm;
  onChange: (form: ManagerAttendanceHolidayCalendarForm) => void;
  onClose: () => void;
  onAdd: () => void;
}
