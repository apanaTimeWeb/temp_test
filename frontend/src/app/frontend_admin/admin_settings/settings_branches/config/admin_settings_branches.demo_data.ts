import type { AdminSettingsBranchRecord } from '@/app/frontend_admin/admin_settings/settings_branches/types/AdminSettingsBranchesTypes';

export const ADMIN_SETTINGS_BRANCHES_DEMO_DATA: AdminSettingsBranchRecord[] = [
  { id: 'BR-001', name: 'Downtown Central', code: 'DT-CEN', address: '123 Main St, City', phone: '+91 9876543210', email: 'downtown@lib.com', manager: 'Vikram Singh', status: 'Active', timing: '06:00 AM - 11:00 PM', totalCapacity: 150 },
  { id: 'BR-003', name: 'North Hub', code: 'NH-01', address: '88 North Blvd, City', phone: '+91 9876543212', email: 'north@lib.com', manager: 'Rahul Sharma', status: 'Active', timing: '07:00 AM - 10:00 PM', totalCapacity: 80 },
];
