import type { AdminSystemGapFillingScenario } from '@/app/frontend_admin/admin_system/system_gap_filling/tests/harness/bootstrap';
import type { ReactNode } from 'react';

export interface AdminSystemGapFillingHarnessProps {
  children: ReactNode;
  scenario?: AdminSystemGapFillingScenario;
}
