import type { ManagerMembersDirectoryRecord } from '@/app/frontend_manager/manager_members/members_directory/types/ManagerMembersDirectoryTypes';

export const MANAGER_MEMBERS_DEMO_RECORDS: ManagerMembersDirectoryRecord[] = [
  { id: 'LIB-001', name: 'Rahul Sharma', phone: '9876543210', email: 'rahul@example.com', type: 'Pro', status: 'Active', joinDate: '2026-01-10', expiryDate: '2026-12-31', address: '123 Main St, New Delhi' },
  { id: 'LIB-002', name: 'Priya Verma', phone: '9876543211', email: 'priya@example.com', type: 'Basic', status: 'Expired', joinDate: '2025-05-15', expiryDate: '2026-05-15', address: '24 Park Road, Lucknow' },
  { id: 'LIB-003', name: 'Amit Kumar', phone: '9876543212', email: 'amit@example.com', type: 'Enterprise', status: 'Suspended', joinDate: '2026-03-20', expiryDate: '2027-03-20', address: '7 Civil Lines, Kanpur' },
  { id: 'LIB-004', name: 'Sneha Patel', phone: '9876543213', email: 'sneha@example.com', type: 'Pro', status: 'Active', joinDate: '2026-08-01', expiryDate: '2026-11-01', address: '18 MG Road, Jaipur' },
];
