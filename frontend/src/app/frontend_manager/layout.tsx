import { ManagerNavigationRoute } from '@/app/frontend_manager/manager_navigation/navigation/components/ManagerNavigationNavigationRoute';
import type { ReactNode } from 'react';

export default function FrontendManagerLayout({ children }: { children: ReactNode }) {
  return <ManagerNavigationRoute>{children}</ManagerNavigationRoute>;
}
