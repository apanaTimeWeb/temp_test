// RESPONSIBILITY: AdminMembersMemberTable component owned by admin_members; responsibility folder: admin_members_components_tables.
'use client';
import { useAdminApplicationInfrastructureUrlQueryState } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_hooks/useAdminApplicationInfrastructureUrlQueryState';

import { useMemo, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Eye, MoreVertical } from 'lucide-react';
import type { AdminMembersMember } from '@/app/frontend_admin/admin_members/members_directory/schemas/AdminMembersDirectorySchema';
import { formatAdminMembersDate } from '@/app/frontend_admin/admin_members/members_directory/utils/AdminMembersDirectoryExportUtils';
import { displayValue } from '@/lib/display_value';
import type { AdminMembersMemberTableProps } from '@/app/frontend_admin/admin_members/members_directory/types/AdminMembersDirectoryComponentTypes';


const STATUS_TRANSLATION_KEYS = {
  Active: 'STATUS_ACTIVE',
  Expired: 'STATUS_EXPIRED',
  Suspended: 'STATUS_SUSPENDED',
  Blocked: 'STATUS_BLOCKED',
} as const;

/** Feature-owned table; no backend records are synthesized here. */
export default function AdminMembersMemberTable({ members, filterStatus, onSelectMember, onAction, canMutate = true }: AdminMembersMemberTableProps) {
  const t = useTranslations('ADMIN_MEMBERS');
  const locale = useLocale();
  const [page, setPage] = useAdminApplicationInfrastructureUrlQueryState<number>('page', 0);
  const [openActionsFor, setOpenActionsFor] = useState<string | null>(null);
  const pageSize = 10;
  const filteredMembers = useMemo(
    () => members.filter((member) => !filterStatus || member.status === filterStatus),
    [filterStatus, members],
  );
  const pageCount = Math.max(1, Math.ceil(filteredMembers.length / pageSize));
  const currentPage = Math.min(page, pageCount - 1);
  const visibleMembers = filteredMembers.slice(currentPage * pageSize, (currentPage + 1) * pageSize);
  const statusLabel = (status: AdminMembersMember['status']) => t(STATUS_TRANSLATION_KEYS[status] ?? 'STATUS_UNKNOWN');
  const expiryLabel = (date: string) => formatAdminMembersDate(date, locale, t('UNKNOWN_DATE'));

  if (filteredMembers.length === 0) {
    return <div className="p-6 text-center text-text-secondary" role="status">{t('TABLE_EMPTY')}</div>;
  }

  return (
    <div>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface-highlight text-text-secondary">
            <tr>
              <th scope="col" className="px-4 py-3">{t('TABLE_MEMBER')}</th>
              <th scope="col" className="px-4 py-3">{t('TABLE_CONTACT')}</th>
              <th scope="col" className="px-4 py-3">{t('TABLE_PLAN')}</th>
              <th scope="col" className="px-4 py-3">{t('TABLE_EXPIRY')}</th>
              <th scope="col" className="px-4 py-3">{t('TABLE_STATUS')}</th>
              <th scope="col" className="px-4 py-3 text-right">{t('TABLE_ACTIONS')}</th>
            </tr>
          </thead>
          <tbody>
            {visibleMembers.map((member) => (
              <tr key={member.id} className="border-b border-border hover:bg-surface-hover">
                <th scope="row" className="px-4 py-3 font-medium text-text-primary">
                  <button type="button" className="underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" onClick={() => onSelectMember(member)}>{displayValue(member.name)}</button>
                  <span className="block text-xs font-normal text-text-secondary">{displayValue(member.id)}</span>
                </th>
                <td className="px-4 py-3"><span className="block">{displayValue(member.email)}</span><span className="text-text-secondary">{displayValue(member.phone)}</span></td>
                <td className="px-4 py-3">{displayValue(member.plan)}</td>
                <td className="px-4 py-3">{expiryLabel(member.expiryDate)}</td>
                <td className="px-4 py-3"><span className="rounded-full bg-surface-highlight px-2.5 py-1 text-xs font-semibold">{statusLabel(member.status)}</span></td>
                <td className="px-4 py-3"><div className="relative flex justify-end gap-1">
                  <button type="button" className="min-h-11 min-w-11 rounded-md hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" aria-label={t('ACTION_VIEW_MEMBER', { name: member.name })} onClick={() => onSelectMember(member)}><Eye size={18} strokeWidth={2} aria-hidden="true" /></button>
                  <button
                    type="button"
                    className="min-h-11 min-w-11 rounded-md hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    aria-label={t('ACTION_OPEN_ACTIONS', { name: member.name })}
                    aria-expanded={openActionsFor === member.id}
                    aria-controls={`admin-member-actions-${member.id}`}
                    onClick={() => setOpenActionsFor((current) => current === member.id ? null : member.id)}
                  ><MoreVertical size={18} strokeWidth={2} aria-hidden="true" /></button>
                  {openActionsFor === member.id && <div id={`admin-member-actions-${member.id}`} aria-label={t('ACTION_OPEN_ACTIONS', { name: member.name })} onKeyDown={(event) => { if (event.key === 'Escape') setOpenActionsFor(null); }} className="absolute right-4 z-10 mt-12 min-w-48 rounded-md border border-border bg-popover p-1 shadow-popover">
                    <button type="button" className="block min-h-11 w-full rounded px-3 py-2 text-left text-primary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" onClick={() => { setOpenActionsFor(null); onSelectMember(member); }}>{t('ACTION_VIEW_DETAILS')}</button>
                    <button type="button" disabled={!canMutate} title={!canMutate ? t('MEMBER_EDIT_UNAVAILABLE') : undefined} className="block min-h-11 w-full rounded px-3 py-2 text-left text-primary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50" onClick={() => { setOpenActionsFor(null); onAction('EDIT', member); }}>{t('ACTION_EDIT_MEMBER')}</button>
                    <button type="button" className="block min-h-11 w-full rounded px-3 py-2 text-left text-primary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" onClick={() => setOpenActionsFor(null)}>{t('ACTION_CLOSE_MENU')}</button>
                  </div>}
                </div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="grid gap-3 md:hidden" role="list" aria-label={t('TABLE_MEMBER')}>
        {visibleMembers.map((member) => (
          <article key={`mobile-${member.id}`} role="listitem" className="rounded-lg border border-border bg-card p-4 shadow-card">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <button type="button" className="text-left font-semibold text-primary underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" onClick={() => onSelectMember(member)}>{displayValue(member.name)}</button>
                <p className="mt-1 text-xs text-text-secondary">{member.id}</p>
              </div>
              <span className="shrink-0 rounded-full bg-surface-highlight px-2.5 py-1 text-xs font-semibold">{statusLabel(member.status)}</span>
            </div>
            <dl className="mt-3 grid grid-cols-1 gap-2 text-sm">
              <div><dt className="text-xs text-text-secondary">{t('TABLE_CONTACT')}</dt><dd className="break-words text-text-primary"><span className="block">{displayValue(member.email)}</span><span className="text-text-secondary">{displayValue(member.phone)}</span></dd></div>
              <div><dt className="text-xs text-text-secondary">{t('TABLE_PLAN')}</dt><dd className="text-text-primary">{displayValue(member.plan)}</dd></div>
              <div><dt className="text-xs text-text-secondary">{t('TABLE_EXPIRY')}</dt><dd className="text-text-primary">{expiryLabel(member.expiryDate)}</dd></div>
            </dl>
            <div className="relative mt-3 flex gap-2 border-t border-border pt-3">
              <button type="button" className="min-h-11 flex-1 rounded-md border border-border px-3 text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" onClick={() => onSelectMember(member)}>{t('ACTION_VIEW_DETAILS')}</button>
              <button type="button" className="min-h-11 min-w-11 rounded-md border border-border px-3 text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" aria-label={t('ACTION_OPEN_ACTIONS', { name: member.name })} aria-expanded={openActionsFor === member.id} aria-controls={`admin-member-actions-mobile-${member.id}`} onClick={() => setOpenActionsFor((current) => current === member.id ? null : member.id)}><MoreVertical size={18} strokeWidth={2} aria-hidden="true" /></button>
              {openActionsFor === member.id && <div id={`admin-member-actions-mobile-${member.id}`} aria-label={t('ACTION_OPEN_ACTIONS', { name: member.name })} onKeyDown={(event) => { if (event.key === 'Escape') setOpenActionsFor(null); }} className="absolute right-0 top-12 z-10 min-w-48 rounded-md border border-border bg-popover p-1 shadow-popover">
                <button type="button" className="block min-h-11 w-full rounded px-3 py-2 text-left text-primary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" onClick={() => { setOpenActionsFor(null); onSelectMember(member); }}>{t('ACTION_VIEW_DETAILS')}</button>
                <button type="button" disabled={!canMutate} title={!canMutate ? t('MEMBER_EDIT_UNAVAILABLE') : undefined} className="block min-h-11 w-full rounded px-3 py-2 text-left text-primary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50" onClick={() => { setOpenActionsFor(null); onAction('EDIT', member); }}>{t('ACTION_EDIT_MEMBER')}</button>
                <button type="button" className="block min-h-11 w-full rounded px-3 py-2 text-left text-primary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" onClick={() => setOpenActionsFor(null)}>{t('ACTION_CLOSE_MENU')}</button>
              </div>}
            </div>
          </article>
        ))}
      </div>
      {pageCount > 1 && <div className="flex min-h-11 items-center justify-between gap-3 border-t border-border px-4 py-3 text-sm text-text-secondary"><span>{t('PAGINATION_SHOWING_RANGE', { start: currentPage * pageSize + 1, end: Math.min((currentPage + 1) * pageSize, filteredMembers.length), total: filteredMembers.length })}</span><div className="flex gap-2"><button type="button" className="min-h-11 rounded-md border border-border px-3 disabled:text-text-disabled" disabled={currentPage === 0} onClick={() => setPage((current) => Math.max(0, current - 1))}>{t('PAGINATION_PREVIOUS')}</button><button type="button" className="min-h-11 rounded-md border border-border px-3 disabled:text-text-disabled" disabled={currentPage >= pageCount - 1} onClick={() => setPage((current) => Math.min(pageCount - 1, current + 1))}>{t('PAGINATION_NEXT')}</button></div></div>}
    </div>
  );
}


export type { AdminMembersMemberTableProps };
