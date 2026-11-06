import type { LucideIcon } from 'lucide-react';
import {
  ADMIN_SIDEBAR_NAV,
  type AdminNavigationGroup,
} from '@/app/frontend_admin/admin_navigation/admin_navigation_sidebar/config/admin_navigation_sidebar_navigation_constants';

export const ALL_HREFS = ADMIN_SIDEBAR_NAV.filter(
  (n): n is { href: string; icon: LucideIcon; label: string } => 'href' in n
).map((n) => n.href);

export function normalizePath(p: string | null | undefined): string {
  if (!p) return '';
  return p.replace(/^\/frontend_admin(\/|$)/, '/admin$1').split('?')[0].split('#')[0].replace(/\/$/, '');
}

export function isSubmoduleActive(currentPath: string, subHref: string): boolean {
  const normCurrent = normalizePath(currentPath);
  const normSub = normalizePath(subHref);
  if (!normSub) return false;
  return normCurrent === normSub || normCurrent.startsWith(normSub + '/');
}

export function isGroupActive(currentPath: string, group: AdminNavigationGroup): boolean {
  const normCurrent = normalizePath(currentPath);
  const normPrimary = normalizePath(group.primaryHref);
  if (normCurrent === normPrimary || normCurrent.startsWith(normPrimary + '/')) return true;
  return group.submodules.some((sub) => isSubmoduleActive(currentPath, sub.href));
}

export function isSidebarLinkActive(currentPath: string, href: string): boolean {
  const normCurrent = normalizePath(currentPath);
  const normHref = normalizePath(href);
  if (normCurrent === normHref) return true;
  if (!normHref || normHref === '/' || !normCurrent.startsWith(normHref + '/')) return false;
  return !ALL_HREFS.some((other) => {
    const normOther = normalizePath(other);
    return normOther !== normHref && normOther.startsWith(normHref) && normCurrent.startsWith(normOther);
  });
}

