import type { AdminSystemSmartIdScenario } from '@/app/frontend_admin/admin_system/system_smart_id/tests/harness/bootstrap';
import type { ReactNode } from 'react';

export interface AdminSystemSmartIdHarnessProps {
  children: ReactNode;
  scenario?: AdminSystemSmartIdScenario;
}
