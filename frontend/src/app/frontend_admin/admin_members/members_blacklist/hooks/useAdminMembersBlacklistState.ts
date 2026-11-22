'use client';
// DATA FLOW: members_blacklist route/container -> this hook or store -> owning module components; state and query updates return through explicit typed callbacks.

import { ADMIN_BLACKLIST_QUERY_KEYS } from '@/app/frontend_admin/admin_members/members_blacklist/api/admin_members_blacklist.query_keys';
import { fetchAdminBlacklist } from '@/app/frontend_admin/admin_members/members_blacklist/api/admin_members_blacklist_api';
import { ADMIN_BLACKLIST_STATUS_VALUES } from '@/app/frontend_admin/admin_members/members_blacklist/config/admin_members_blacklist.url_config';
import { ADMIN_BLACKLIST_DEMO_FIXTURES } from '@/app/frontend_admin/admin_members/members_blacklist/mocks/scenarios/admin_members_blacklist.scenarios';
import type { AdminBlacklistFormSchemaType } from '@/app/frontend_admin/admin_members/members_blacklist/schemas/AdminMembersBlacklistSchema';
import type { AdminBlacklistRecord } from '@/app/frontend_admin/admin_members/members_blacklist/types/AdminMembersBlacklistTypes';
import { isFrontendDemoModeEnabled } from '@/app/frontend_admin/lib/runtimeFeatures';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'sonner';

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
    initialData: isDemoMode ? [...ADMIN_BLACKLIST_DEMO_FIXTURES] : undefined,
  });
  const records = isDemoMode ? demoRecordsOverride ?? recordsQuery.data ?? [] : recordsQuery.data ?? [];

  const submit = (values: AdminBlacklistFormSchemaType) => {
    if (!isDemoMode) {
      toast.info(t('MUTATION_BLOCKED'), { id: 'admin_members-members_blacklist-hooks-useAdminMembersBlacklistState-toast-33-1' });
      return;
    }
    const newRecord: AdminBlacklistRecord = {
      id: `demo-blacklist-${Date.now()}`,
      name: values.name.trim(),
      phone: values.phone.trim(),
      reason: values.reason.trim(),
      blacklistedBy: t('DEMO_ADMIN_NAME'),
      blacklistedOn: format(new Date(), 'yyyy-MM-dd'),
      previousSeat: values.previousSeat?.trim() || '—',
      status: ADMIN_BLACKLIST_STATUS_VALUES[0],
      branch: values.branch || 'Downtown Central',
      category: values.category || 'INDISCIPLINE_MISCONDUCT',
      banScope: values.banScope || 'NETWORK_WIDE',
      banDuration: values.banDuration || 'PERMANENT',
      revokedSeat: values.revokeSeat ?? true,
      revokedLocker: values.revokeLocker ?? true,
      blockedBiometric: values.blockBiometric ?? true,
      confiscatedDeposit: values.confiscateDeposit ?? false,
      incidentDate: values.incidentDate || format(new Date(), 'yyyy-MM-dd'),
      incidentLocation: values.incidentLocation || 'Reading Hall',
      firRefNo: values.firRefNo || undefined,
      incidentNotes: values.incidentNotes || values.reason.trim(),
    };
    setDemoRecordsOverride([newRecord, ...records]);
    const scopeMsg = newRecord.banScope === 'NETWORK_WIDE' ? 'Network-Wide Ban Enforced across all branches' : 'Branch Ban Enforced';
    toast.success(`Student blacklisted successfully. ${scopeMsg}. Active seat revoked.`);
    setShowForm(false);
  };

  const pardonStudent = (id: string, reason: string) => {
    if (!isDemoMode) {
      toast.info(t('MUTATION_BLOCKED'));
      return;
    }
    const today = format(new Date(), 'yyyy-MM-dd');
    setDemoRecordsOverride(
      records.map((r) =>
        r.id === id
          ? {
              ...r,
              status: 'Pardoned',
              pardonReason: reason,
              pardonDate: today,
              pardonedBy: 'Chief Admin',
            }
          : r
      )
    );
    setSelectedRecord((cur) =>
      cur?.id === id
        ? {
            ...cur,
            status: 'Pardoned',
            pardonReason: reason,
            pardonDate: today,
            pardonedBy: 'Chief Admin',
          }
        : cur
    );
    toast.success(`Ban revoked for student. Member access reinstated.`);
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

  return { isDemoMode, recordsQuery, records, showForm, setShowForm, removeId, setRemoveId, selectedRecord, setSelectedRecord, submit, pardonStudent, confirmRemove } as const;
}
