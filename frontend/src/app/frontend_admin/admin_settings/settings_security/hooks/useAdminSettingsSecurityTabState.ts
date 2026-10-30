'use client';
// DATA FLOW: settings_security route/container -> this hook or store -> owning module components; state and query updates return through explicit typed callbacks.
import { useCallback } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { AdminSecurityTab } from '@/app/frontend_admin/admin_settings/settings_security/types/AdminSettingsSecurityTypes';
const TABS: readonly AdminSecurityTab[] = ['dashboard', 'login-security', 'active-sessions', 'failed-logins', 'blocked-users', 'device-sessions', 'events'];
export default function useAdminSecurityTabState() {
  const router = useRouter(); const pathname = usePathname(); const searchParams = useSearchParams();
  const value = searchParams.get('view');
  const activeTab: AdminSecurityTab = TABS.includes(value as AdminSecurityTab) ? value as AdminSecurityTab : 'dashboard';
  const setActiveTab = useCallback((tab: AdminSecurityTab) => { const next = new URLSearchParams(searchParams.toString()); next.set('view', tab); router.push(`${pathname}?${next.toString()}`, { scroll: false }); }, [pathname, router, searchParams]);
  return [activeTab, setActiveTab] as const;
}
