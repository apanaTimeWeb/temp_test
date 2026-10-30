import type { AdminSystemDataExportScenario } from '@/app/frontend_admin/admin_system/system_data_export/tests/harness/bootstrap';
import type { ReactNode } from 'react';

export interface AdminSystemDataExportHarnessProps {
  children: ReactNode;
  scenario?: AdminSystemDataExportScenario;
}
