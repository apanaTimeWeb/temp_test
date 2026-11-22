'use client';
// DATA FLOW: settings_security route/container -> this hook or store -> owning module components; state and query updates return through explicit typed callbacks.
import type { AdminSecurityTab } from '@/app/frontend_admin/admin_settings/settings_security/types/AdminSettingsSecurityTypes';
import { usePathname,useRouter,useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
const TABS: readonly AdminSecurityTab[] = ['active-sessions', 'login-security', 'device-sessions', 'failed-logins', 'blocked-users', 'events', 'audit-trail'];
export default function useAdminSecurityTabState() {
  const router = useRouter(); const pathname = usePathname(); const searchParams = useSearchParams();
  const value = searchParams.get('view');
  const activeTab: AdminSecurityTab = TABS.includes(value as AdminSecurityTab) ? value as AdminSecurityTab : 'active-sessions';
  const setActiveTab = useCallback((tab: AdminSecurityTab) => { const next = new URLSearchParams(searchParams.toString()); next.set('view', tab); router.push(`${pathname}?${next.toString()}`, { scroll: false }); }, [pathname, router, searchParams]);
  return [activeTab, setActiveTab] as const;
}
