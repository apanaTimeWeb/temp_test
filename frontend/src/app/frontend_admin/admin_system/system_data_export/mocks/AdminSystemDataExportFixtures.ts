import type { AdminSystemDataExportDemoRow } from '@/app/frontend_admin/admin_system/system_data_export/types/AdminSystemDataExportTypes';

/** Synthetic values used only for the explicit local demo CSV export; never treat as live system data. */
export const ADMIN_SYSTEM_DATA_EXPORT_DEMO_ROWS: readonly AdminSystemDataExportDemoRow[] = [
  { module: 'students', recordId: 'STU-001', label: 'Rahul Sharma', value: 'Active', recordDate: '2026-01-05', feeStatus: 'Paid', subscriptionExpiry: '2026-01-25' },
  { module: 'students', recordId: 'STU-002', label: 'Priya Verma', value: 'Active', recordDate: '2026-01-12', feeStatus: 'Due', subscriptionExpiry: '2026-03-15' },
  { module: 'students', recordId: 'STU-003', label: 'Amit Kumar', value: 'Pending', recordDate: '2026-01-19', feeStatus: 'Due', subscriptionExpiry: '2026-05-01' },
  { module: 'payments', recordId: 'PAY-001', label: 'Rahul Sharma', value: '1000 INR', recordDate: '2026-02-02', feeStatus: 'Paid' },
  { module: 'payments', recordId: 'PAY-002', label: 'Priya Verma', value: '800 INR', recordDate: '2026-02-09', feeStatus: 'Due' },
  { module: 'payments', recordId: 'PAY-003', label: 'Amit Kumar', value: '1200 INR', recordDate: '2026-02-16', feeStatus: 'Due' },
  { module: 'attendance', recordId: 'ATT-001', label: 'Rahul Sharma', value: 'Present', recordDate: '2026-02-23' },
  { module: 'attendance', recordId: 'ATT-002', label: 'Priya Verma', value: 'Present', recordDate: '2026-03-02' },
  { module: 'attendance', recordId: 'ATT-003', label: 'Amit Kumar', value: 'Absent', recordDate: '2026-03-09' },
  { module: 'expenses', recordId: 'EXP-001', label: 'Electricity', value: '5000 INR', recordDate: '2026-03-16' },
  { module: 'expenses', recordId: 'EXP-002', label: 'Cleaning', value: '1200 INR', recordDate: '2026-03-23' },
  { module: 'enquiries', recordId: 'ENQ-001', label: 'Sneha Patel', value: 'New', recordDate: '2026-03-30' },
  { module: 'enquiries', recordId: 'ENQ-002', label: 'Vikas Singh', value: 'Follow-up', recordDate: '2026-04-01' },
  { module: 'seats', recordId: 'SEAT-001', label: 'S-01', value: 'Occupied', recordDate: '2026-04-03' },
  { module: 'seats', recordId: 'SEAT-002', label: 'S-02', value: 'Available', recordDate: '2026-04-05' },
  { module: 'seats', recordId: 'LOCK-001', label: 'L-01', value: 'Assigned', recordDate: '2026-04-07' },
  { module: 'whatsapp', recordId: 'WA-001', label: 'Rahul Sharma', value: 'Delivered', recordDate: '2026-04-09' },
  { module: 'whatsapp', recordId: 'WA-002', label: 'Priya Verma', value: 'Pending', recordDate: '2026-04-10' },
  { module: 'audit', recordId: 'AUD-001', label: 'Settings Updated', value: 'Admin User', recordDate: '2026-04-11' },
  { module: 'audit', recordId: 'AUD-002', label: 'Backup Requested', value: 'Admin User', recordDate: '2026-04-12' },
  { module: 'audit', recordId: 'AUD-003', label: 'Member Export', value: 'Admin User', recordDate: '2026-04-12' },
] as const;
