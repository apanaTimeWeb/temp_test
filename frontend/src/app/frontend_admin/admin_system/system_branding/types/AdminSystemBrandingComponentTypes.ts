import type { AdminSystemBrandingScenario } from '@/app/frontend_admin/admin_system/system_branding/tests/harness/bootstrap';
import type { ReactNode } from 'react';

export interface AdminSystemBrandingHarnessProps {
  children: ReactNode;
  scenario?: AdminSystemBrandingScenario;
}
