import type {
  AdminStaffDirectoryApiRecord,
  AdminStaffDirectoryManager,
} from '@/app/frontend_admin/admin_staff/staff_directory/schemas/AdminStaffDirectorySchema';

export const ADMIN_STAFF_DIRECTORY_DEMO_DATA: readonly AdminStaffDirectoryManager[] = [
  { id: 'MGR-001', name: 'Vikram Singh', username: 'vikram.s', email: 'vikram@smartlibrary.com', phone: '+91 9876543210', branch: 'Downtown Central', status: 'Active', lastActive: '2 mins ago', role: 'Branch Manager' },
  { id: 'MGR-002', name: 'Anita Desai', username: 'anita.d', email: 'anita@smartlibrary.com', phone: '+91 9876543211', branch: 'Westside Branch', status: 'Active', lastActive: '1 hr ago', role: 'Branch Manager' },
  { id: 'MGR-003', name: 'Rahul Sharma', username: 'rahul.s', email: 'rahul@smartlibrary.com', phone: '+91 9876543212', branch: 'North Hub', status: 'Suspended', lastActive: '3 days ago', role: 'Branch Manager' },
  { id: 'MGR-004', name: 'Sneha Verma', username: 'sneha.v', email: 'sneha@smartlibrary.com', phone: '+91 9876543213', branch: 'Unassigned', status: 'Deactivated', lastActive: '1 month ago', role: 'Branch Manager' },
  { id: 'STF-001', name: 'Rohan Mehta', username: 'rohan.m', email: 'rohan@smartlibrary.com', phone: '+91 9876543220', branch: 'Downtown Central', status: 'Active', lastActive: '5 mins ago', role: 'Librarian' },
  { id: 'STF-002', name: 'Priya Nair', username: 'priya.n', email: 'priya@smartlibrary.com', phone: '+91 9876543221', branch: 'Downtown Central', status: 'Active', lastActive: '20 mins ago', role: 'Front Desk Executive' },
  { id: 'STF-003', name: 'Amit Patel', username: 'amit.p', email: 'amit@smartlibrary.com', phone: '+91 9876543222', branch: 'Westside Branch', status: 'Active', lastActive: '2 hrs ago', role: 'Operations Assistant' },
  { id: 'STF-004', name: 'Kavita Joshi', username: 'kavita.j', email: 'kavita@smartlibrary.com', phone: '+91 9876543223', branch: 'Westside Branch', status: 'Active', lastActive: '1 day ago', role: 'Front Desk Executive' },
  { id: 'STF-005', name: 'Suresh Kumar', username: 'suresh.k', email: 'suresh@smartlibrary.com', phone: '+91 9876543224', branch: 'North Hub', status: 'Suspended', lastActive: '4 days ago', role: 'Support Executive' },
  { id: 'STF-006', name: 'Meera Reddy', username: 'meera.r', email: 'meera@smartlibrary.com', phone: '+91 9876543225', branch: 'Downtown Central', status: 'Deactivated', lastActive: '2 weeks ago', role: 'Assistant Librarian' },
];

export const ADMIN_STAFF_DIRECTORY_API_DEMO_DATA: AdminStaffDirectoryApiRecord[] = [
  { id: 'STAFF-DEMO-001', name: 'Demo Manager', username: 'demo.manager', email: 'manager@example.invalid', phone: '+91 90000 00031', branch: 'Demo Branch', status: 'Active', lastActive: 'Never (synthetic fixture)' },
];

export const ADMIN_STAFF_DIRECTORY_SESSION_DEMO_DATA = [
  { managerName: 'Demo Manager', operatingSystem: 'Demo browser / operating system', ipAddress: '192.0.2.10', timeKey: 'LAST_ACTIVE_TWO_MINUTES' },
] as const;

export const ADMIN_STAFF_DIRECTORY_LOGIN_HISTORY_DEMO_DATA = [
  { managerName: 'Demo Manager', timeKey: 'TIME_TODAY_0900', statusKey: 'STATUS_SUCCESS', location: 'Synthetic demo location' },
  { managerName: 'Demo Manager', timeKey: 'TIME_YESTERDAY_1015', statusKey: 'STATUS_FAILED', location: 'Synthetic demo location' },
] as const;

export const ADMIN_STAFF_DIRECTORY_ACTIVITY_DEMO_DATA = [
  { managerName: 'Demo Manager', timeKey: 'TIME_JUST_NOW', actionKey: 'ACTIVITY_ADMISSION_APPROVED' },
  { managerName: 'Demo Manager', timeKey: 'TIME_TWO_HOURS', actionKey: 'ACTIVITY_PRICING_UPDATED' },
] as const;

export const ADMIN_STAFF_DIRECTORY_MANAGER_HISTORY_DEMO_DATA = [
  { timeKey: 'TIME_TODAY_0900', device: 'Synthetic demo device · 192.0.2.11', statusKey: 'DETAIL_TABLE_SUCCESS' },
  { timeKey: 'TIME_YESTERDAY_1015', device: 'Synthetic demo device · 192.0.2.12', statusKey: 'DETAIL_TABLE_FAILED' },
] as const;

export const ADMIN_STAFF_DIRECTORY_MANAGER_ACTIVITY_DEMO_DATA = [
  { timeKey: 'TIME_JUST_NOW', actionKey: 'ACTIVITY_ADMISSION_APPROVED' },
  { timeKey: 'TIME_TWO_HOURS', actionKey: 'ACTIVITY_BRANCH_PRICING_UPDATED' },
] as const;
