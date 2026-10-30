'use client';
// DATA FLOW: settings_support route/container -> this hook or store -> owning module components; state and query updates return through explicit typed callbacks.

import { useCallback, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { AdminSupportTab } from '@/app/frontend_admin/admin_settings/settings_support/types/AdminSettingsSupportTypes';
const TABS: readonly AdminSupportTab[] = ['help', 'tickets', 'status', 'announcements', 'docs'];
export default function useAdminSupportTabState() {
  const router = useRouter(); const pathname = usePathname(); const searchParams = useSearchParams();
  const value = searchParams.get('view');
  const [localTab, setLocalTab] = useState<AdminSupportTab | null>(null);
  const activeTab: AdminSupportTab = localTab ?? (TABS.includes(value as AdminSupportTab) ? value as AdminSupportTab : 'tickets');
  const setActiveTab = useCallback((tab: AdminSupportTab) => {
    setLocalTab(tab);
    const next = new URLSearchParams(searchParams.toString());
    next.set('view', tab);
    router.push(`${pathname}?${next.toString()}`, { scroll: false });
  }, [pathname, router, searchParams]);
  return [activeTab, setActiveTab] as const;
}
