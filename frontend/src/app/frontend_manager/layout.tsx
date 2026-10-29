import type { ReactNode } from 'react';
import { ManagerNavigationRoute } from '@/app/frontend_manager/manager_navigation/navigation/components/ManagerNavigationNavigationRoute';

export default function FrontendManagerLayout({ children }: { children: ReactNode }) {
  return <ManagerNavigationRoute>{children}</ManagerNavigationRoute>;
}
