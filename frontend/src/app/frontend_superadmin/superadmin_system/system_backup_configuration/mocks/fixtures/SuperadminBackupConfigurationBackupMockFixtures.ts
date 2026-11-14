// FLOW: Feature preview/test -> superadmin_system/system_backup_configuration/mocks/fixtures/SuperadminBackupConfigurationBackupMockFixtures.ts -> typed local fixtures -> screen rendering or assertions.
/** Responsibility: Superadmin System Backup Fixtures; supplies module-owned mock fixtures or handler behavior only. */
import type { SuperadminSystemBackupRecord } from '@/app/frontend_superadmin/superadmin_system/system_backup_configuration/types/SuperadminBackupConfigurationBackupTypes';

export const SUPERADMIN_SYSTEM_BACKUP_HISTORY: SuperadminSystemBackupRecord[] = [
  {
    id: 'bk-001', name: 'Nightly Auto Backup',    type: 'auto',   size: '4.2 MB', createdAt: '2026-04-12 02:00 AM', status: 'success',
    modules: ['Students', 'Payments', 'Attendance', 'Seats', 'Expenses'],
  },
  {
    id: 'bk-002', name: 'Nightly Auto Backup',    type: 'auto',   size: '4.1 MB', createdAt: '2026-04-11 02:00 AM', status: 'success',
    modules: ['Students', 'Payments', 'Attendance', 'Seats', 'Expenses'],
  },
  {
    id: 'bk-003', name: 'Manual Backup — Pre-Import',type: 'manual', size: '4.0 MB', createdAt: '2026-04-10 11:30 AM', status: 'success',
    modules: ['Students', 'Payments', 'Seats'],
  },
  {
    id: 'bk-004', name: 'Nightly Auto Backup',    type: 'auto',   size: '—',      createdAt: '2026-04-09 02:00 AM', status: 'failed',
    modules: [],
  },
  {
    id: 'bk-005', name: 'Nightly Auto Backup',    type: 'auto',   size: '3.9 MB', createdAt: '2026-04-08 02:00 AM', status: 'success',
    modules: ['Students', 'Payments', 'Attendance', 'Seats', 'Expenses'],
  },
  {
    id: 'bk-006', name: 'Manual Backup — Monthly',type: 'manual', size: '3.7 MB', createdAt: '2026-04-01 09:00 AM', status: 'success',
    modules: ['Students', 'Payments', 'Attendance', 'Seats', 'Expenses', 'CRM', 'WhatsApp Logs'],
  },
];
