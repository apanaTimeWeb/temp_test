import type {
  StaffAttendanceRecord,
  StaffRosterSlot,
  AttendanceStatus,
  StaffShiftType,
  RegularizeAttendanceInput,
  StaffLeaveRequest,
} from '@/app/frontend_admin/admin_staff/staff_attendance/schemas/AdminStaffAttendanceSchema';

export type StaffAttendanceViewTab = 'roster' | 'logs' | 'leaves';

export interface StaffAttendanceFilterState {
  tab: StaffAttendanceViewTab;
  selectedBranchId: string;
  selectedDate: string;
  selectedShift: string;
  statusFilter: string;
  searchQuery: string;
}

export interface StaffAttendanceKpiSummary {
  totalStaff: number;
  presentCount: number;
  lateCount: number;
  absentCount: number;
  onLeaveCount: number;
  attendanceRatePercent: number;
}

export interface AdminStaffAttendanceModel {
  filters: StaffAttendanceFilterState;
  setTab: (tab: StaffAttendanceViewTab) => void;
  setSelectedBranchId: (branchId: string) => void;
  setSelectedDate: (date: string) => void;
  setSelectedShift: (shift: string) => void;
  setStatusFilter: (status: string) => void;
  setSearchQuery: (query: string) => void;
  kpis: StaffAttendanceKpiSummary;
  records: StaffAttendanceRecord[];
  rosterSlots: StaffRosterSlot[];
  leaveRequests: StaffLeaveRequest[];
  isDemoMode: boolean;
  inspectingRecord: StaffAttendanceRecord | null;
  setInspectingRecord: (record: StaffAttendanceRecord | null) => void;
  regularizingRecord: StaffAttendanceRecord | null;
  setRegularizingRecord: (record: StaffAttendanceRecord | null) => void;
  handleRegularizeSubmit: (input: RegularizeAttendanceInput) => void;
  handleLeaveAction: (leaveId: string, action: 'APPROVE' | 'REJECT') => void;
}

