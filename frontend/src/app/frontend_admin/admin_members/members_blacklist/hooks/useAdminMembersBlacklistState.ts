// DATA FLOW: members_blacklist route/container -> this hook or store -> owning module components; state and query updates return through explicit typed callbacks.
'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { format } from 'date-fns';
import toast from 'sonner';
import type { AdminBlacklistFormSchemaType } from '@/app/frontend_admin/admin_members/members_blacklist/schemas/AdminMembersBlacklistSchema';
import type { AdminBlacklistRecord } from '@/app/frontend_admin/admin_members/members_blacklist/types/AdminMembersBlacklistTypes';
import { fetchAdminBlacklist } from '@/app/frontend_admin/admin_members/members_blacklist/api/admin_members_blacklist_api';
import { ADMIN_BLACKLIST_QUERY_KEYS } from '@/app/frontend_admin/admin_members/members_blacklist/api/admin_members_blacklist.query_keys';
import { ADMIN_BLACKLIST_STATUS_VALUES } from '@/app/frontend_admin/admin_members/members_blacklist/config/admin_members_blacklist.url_config';
import { ADMIN_BLACKLIST_DEMO_FIXTURES } from '@/app/frontend_admin/admin_members/members_blacklist/mocks/scenarios/admin_members_blacklist.scenarios';
import { isFrontendDemoModeEnabled } from '@/app/frontend_admin/lib/runtimeFeatures';

/** Owns blacklist server-state orchestration and explicitly demo-only mutations. */
export default function useAdminMembersBlacklistState() {
  const t = useTranslations('ADMIN_BLACKLIST');
  const isDemoMode = isFrontendDemoModeEnabled();
  const [demoRecordsOverride, setDemoRecordsOverride] = useState<AdminBlacklistRecord[] | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [removeId, setRemoveId] = useState<string | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<AdminBlacklistRecord | null>(null);
  const recordsQuery = useQuery({
    queryKey: ADMIN_BLACKLIST_QUERY_KEYS.list({ mode: isDemoMode ? 'demo' : 'live' }),
    queryFn: () => isDemoMode ? Promise.resolve([...ADMIN_BLACKLIST_DEMO_FIXTURES]) : fetchAdminBlacklist(),
  });
  const records = isDemoMode ? demoRecordsOverride ?? recordsQuery.data ?? [] : recordsQuery.data ?? [];

  const submit = (values: AdminBlacklistFormSchemaType) => {
    if (!isDemoMode) {
      toast.info(t('MUTATION_BLOCKED'), { id: 'admin_members-members_blacklist-hooks-useAdminMembersBlacklistState-toast-33-1' });
      return;
    }
    const newRecord: AdminBlacklistRecord = {
      id: `demo-blacklist-${Date.now()}`, name: values.name.trim(), phone: values.phone.trim(),
      reason: values.reason.trim(), blacklistedBy: t('DEMO_ADMIN_NAME'),
      blacklistedOn: format(new Date(), 'yyyy-MM-dd'), previousSeat: values.previousSeat.trim() || '—',
      status: ADMIN_BLACKLIST_STATUS_VALUES[0],
    };
    setDemoRecordsOverride([newRecord, ...records]);
    toast.info(t('DEMO_CREATED'), { id: 'admin_members-members_blacklist-hooks-useAdminMembersBlacklistState-toast-43-2' });
    setShowForm(false);
  };

  const confirmRemove = () => {
    if (!removeId) return;
    if (!isDemoMode) {
      toast.info(t('MUTATION_BLOCKED'), { id: 'admin_members-members_blacklist-hooks-useAdminMembersBlacklistState-toast-50-3' });
      setRemoveId(null);
      return;
    }
    setDemoRecordsOverride(records.filter((record) => record.id !== removeId));
    setSelectedRecord((current) => current?.id === removeId ? null : current);
    toast.info(t('DEMO_REMOVED'), { id: 'admin_members-members_blacklist-hooks-useAdminMembersBlacklistState-toast-56-4' });
    setRemoveId(null);
  };

  return { isDemoMode, recordsQuery, records, showForm, setShowForm, removeId, setRemoveId, selectedRecord, setSelectedRecord, submit, confirmRemove } as const;
}
