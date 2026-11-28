import type { ReactNode } from 'react';

export const AdminNavigationSidebarScenarios = ['ACTIVE', 'EMPTY', 'SERVER_500', 'TIMEOUT', 'UNAUTHORIZED'] as const;
export type AdminNavigationSidebarScenario = (typeof AdminNavigationSidebarScenarios)[number];

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
