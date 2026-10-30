import type { AdminNavigationSidebarScenario } from '@/app/frontend_admin/admin_navigation/admin_navigation_sidebar/tests/harness/bootstrap';
import type { ReactNode } from 'react';

export interface AdminNavigationSidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export interface AdminNavigationSidebarHarnessProps {
  children: ReactNode;
  scenario?: AdminNavigationSidebarScenario;
}
