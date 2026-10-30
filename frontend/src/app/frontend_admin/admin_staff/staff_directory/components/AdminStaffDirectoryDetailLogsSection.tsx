'use client';
// RESPONSIBILITY: Owns the selected manager overview and its demo-only history/activity panels.

import { Building2, Clock3, Mail, Phone, UserRound } from 'lucide-react';
import { useTranslations } from 'next-intl';
import useAdminStaffDirectory from '@/app/frontend_admin/admin_staff/staff_directory/hooks/useAdminStaffDirectory';
import { getAdminStaffDirectoryLastActiveLabel } from '@/app/frontend_admin/admin_staff/staff_directory/utils/AdminStaffDirectoryDisplayUtils';
import { ADMIN_STAFF_DIRECTORY_MANAGER_ACTIVITY_FIXTURES, ADMIN_STAFF_DIRECTORY_MANAGER_HISTORY_FIXTURES } from '@/app/frontend_admin/admin_staff/staff_directory/mocks/scenarios/admin_staff_directory.scenarios';
import type { AdminStaffDirectoryDetailLogsSectionProps } from '@/app/frontend_admin/admin_staff/staff_directory/types/AdminStaffDirectoryComponentTypes';


/** Combines the selected-manager overview and its related detail panels under the same lifecycle. */
export default function AdminStaffDirectoryDetailLogsSection({ model, onBack }: AdminStaffDirectoryDetailLogsSectionProps) {
  const t = useTranslations('ADMIN_STAFF_DIRECTORY');
  const manager = model.viewingManager;
  if (!manager) return null;
  const mode = model.managerDetailTab;
  const isDemoMode = model.isDemoMode;
  const isHistory = mode === 'history';
  return <>
    <section className="admin-card mt-4 p-5">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4"><div><h2 className="text-lg font-semibold">{manager.name}</h2><p className="text-sm text-text-secondary">{t('PROFILE_TITLE', { id: manager.id })}</p></div><span className="rounded-full bg-surface-highlight px-3 py-1 text-sm">{({ Active: t('STATUS_ACTIVE'), Suspended: t('STATUS_SUSPENDED'), Deactivated: t('STATUS_DEACTIVATED') } as const)[manager.status]}</span></div>
      <dl className="grid gap-4 sm:grid-cols-2">
        <div className="flex items-start gap-3"><UserRound size={18}/><div><dt className="text-sm text-text-secondary">{t('PROFILE_USERNAME')}</dt><dd>@{manager.username}</dd></div></div>
        <div className="flex items-start gap-3"><Building2 size={18}/><div><dt className="text-sm text-text-secondary">{t('PROFILE_BRANCH')}</dt><dd>{manager.branch}</dd></div></div>
        <div className="flex items-start gap-3"><Mail size={18}/><div><dt className="text-sm text-text-secondary">{t('PROFILE_EMAIL')}</dt><dd>{manager.email}</dd></div></div>
        <div className="flex items-start gap-3"><Phone size={18}/><div><dt className="text-sm text-text-secondary">{t('PROFILE_PHONE')}</dt><dd>{manager.phone}</dd></div></div>
        <div className="flex items-start gap-3"><Clock3 size={18}/><div><dt className="text-sm text-text-secondary">{t('PROFILE_LAST_ACTIVE')}</dt><dd>{getAdminStaffDirectoryLastActiveLabel(manager.lastActive, t)}</dd></div></div>
      </dl>
    </section>
    {isDemoMode && (mode === 'history' || mode === 'activity') && <section className="admin-card mt-4">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-4"><h2 className="text-lg font-semibold text-text-primary">{t(isHistory ? 'DETAIL_HISTORY_TITLE' : 'DETAIL_ACTIVITY_TITLE', { name: manager.name })}</h2><button type="button" className="min-h-11 rounded-md border border-border px-3 py-2 text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" onClick={onBack}>{t('BACK_TO_OVERVIEW')}</button></header>
      {isHistory ? <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-surface-highlight text-text-secondary"><tr><th scope="col" className="p-3">{t('DETAIL_TABLE_DATETIME')}</th><th scope="col" className="p-3">{t('DETAIL_TABLE_DEVICE_IP')}</th><th scope="col" className="p-3">{t('DETAIL_TABLE_STATUS')}</th></tr></thead><tbody>{ADMIN_STAFF_DIRECTORY_MANAGER_HISTORY_FIXTURES.map((entry) => <tr key={`${entry.timeKey}-${entry.device}`} className="border-t border-border"><td className="p-3">{t(entry.timeKey)}</td><td className="p-3">{entry.device}</td><td className="p-3"><span className="rounded-full bg-success-bg px-2.5 py-1 text-xs font-semibold text-success-text">{t(entry.statusKey)}</span></td></tr>)}</tbody></table></div> : <div className="divide-y divide-border">{ADMIN_STAFF_DIRECTORY_MANAGER_ACTIVITY_FIXTURES.map((entry) => <article key={`${entry.timeKey}-${entry.actionKey}`} className="p-4"><p className="text-text-primary">{t(entry.actionKey)}</p><time className="mt-1 block text-xs text-text-secondary">{t(entry.timeKey)}</time></article>)}</div>}
      <p className="p-3 text-xs text-text-secondary">{t('DEMO_WARNING')}</p>
    </section>}
  </>;
}
