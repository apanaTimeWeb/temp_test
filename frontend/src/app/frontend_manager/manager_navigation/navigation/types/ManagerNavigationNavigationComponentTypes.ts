/** Module-local component props and UI/state types extracted from component files. */
import type { ReactNode } from 'react';

export interface ManagerNavigationHeaderProps {
  collapsed: boolean;
  onMobileOpen: () => void;
}

export interface ManagerNavigationRouteProps {
  children: ReactNode;
}

export interface ManagerNavigationSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export type ManagerNavigationNavigationScenarioId = 'default' | 'empty' | 'loading' | 'error' | 'recovery' | 'repeated_action' | 'timeout' | 'unauthorized';
