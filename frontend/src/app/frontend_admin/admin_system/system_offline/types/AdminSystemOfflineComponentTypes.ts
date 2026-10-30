import type { AdminSystemOfflineScenario } from '@/app/frontend_admin/admin_system/system_offline/tests/harness/bootstrap';
import type { ReactNode } from 'react';

export interface AdminSystemOfflineHarnessProps {
  children: ReactNode;
  scenario?: AdminSystemOfflineScenario;
}
