/** Module-owned routes and source-backed API endpoints. Do not infer additional backend contracts. */
const ROOT = '/frontend_manager/manager_seats_shifts_lockers/shifts_management' as const;
export const MANAGER_SHIFTS_MANAGEMENT_ROUTES = {
  root: ROOT,
  lockers: '/frontend_manager/manager_seats_shifts_lockers/lockers_management',
  shiftManagement: '/frontend_manager/manager_seats_shifts_lockers/shifts_management',
  seatManagement: '/frontend_manager/manager_seats_shifts_lockers/seats_management',
  seatMatrix: '/frontend_manager/manager_seats_shifts_lockers/seats_matrix',
  seatHistory: '/frontend_manager/manager_seats_shifts_lockers/seats_history',
  shiftMigration: '/frontend_manager/manager_seats_shifts_lockers/shifts_migration',
  lockerMatrix: '/frontend_manager/manager_seats_shifts_lockers/lockers_matrix',
  allocations: '/frontend_manager/manager_seats_shifts_lockers/seats_allocations',
  lockersList: '/frontend_manager/manager_seats_shifts_lockers/lockers_management',
  ASSIGN_STUDENT: '/frontend_manager/manager_members/members_new_admission',
  STUDENTS_FILTER: '/frontend_manager/manager_members/members_directory',
  STUDENTS_FILTER_BY_SMART_ID: (smartId: string) => `/frontend_manager/manager_members/members_directory?${new URLSearchParams({ smartId }).toString()}`,
} as const;

export const MANAGER_SHIFTS_MANAGEMENT_API = {
  ALLOCATIONS: '/seats_shifts_lockers/allocations',
  HISTORY: '/seats_shifts_lockers/history',
  LOCKERS: '/seats_shifts_lockers/lockers',
  SEAT_MATRIX: '/seats_shifts_lockers/seat-matrix'
} as const;
