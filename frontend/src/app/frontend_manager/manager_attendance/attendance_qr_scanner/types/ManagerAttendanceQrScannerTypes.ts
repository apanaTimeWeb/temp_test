// Types for manager_qr_scanner

export interface ManagerAttendanceQrScannerHolidayCalendarForm {
  date: string;
  name: string;
  type: string;
}

export interface ManagerAttendanceQrScannerHolidayCalendarAddModalProps {
  show: boolean;
  form: ManagerAttendanceQrScannerHolidayCalendarForm;
  onChange: (form: ManagerAttendanceQrScannerHolidayCalendarForm) => void;
  onClose: () => void;
  onAdd: () => void;
}
