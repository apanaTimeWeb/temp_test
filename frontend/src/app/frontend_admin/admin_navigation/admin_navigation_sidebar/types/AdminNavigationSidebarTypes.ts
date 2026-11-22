import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

export type AdminNavItem =
  | { group: string; groupKey?: string }
  | { href: string; icon: LucideIcon; label: string; labelKey?: string };

export interface AdminRouteProps {
  children: ReactNode;
}
