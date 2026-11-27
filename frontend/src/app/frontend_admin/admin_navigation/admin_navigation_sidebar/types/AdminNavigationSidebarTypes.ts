import type { LucideIcon } from 'lucide-react';

export type AdminNavItem =
  | { group: string; groupKey?: string }
  | { href: string; icon: LucideIcon; label: string; labelKey?: string };
