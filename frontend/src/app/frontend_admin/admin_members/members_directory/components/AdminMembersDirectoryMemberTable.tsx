'use client';
// RESPONSIBILITY: AdminMembersMemberTable component owned by admin_members; responsibility folder: admin_members_components_tables.
import { useAdminApplicationInfrastructureUrlQueryState } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_hooks/useAdminApplicationInfrastructureUrlQueryState';

import { useMemo, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Eye, MoreVertical, Building2, ArrowUpDown, ArrowUp, ArrowDown, MessageSquare } from 'lucide-react';
import type { AdminMembersMember } from '@/app/frontend_admin/admin_members/members_directory/schemas/AdminMembersDirectorySchema';
import { formatAdminMembersDate } from '@/app/frontend_admin/admin_members/members_directory/utils/AdminMembersDirectoryExportUtils';
import { displayValue } from '@/lib/display_value';
import AdminMembersDirectoryMemberMobileCards from '@/app/frontend_admin/admin_members/members_directory/components/AdminMembersDirectoryMemberMobileCards';
import type { AdminMembersMemberTableProps } from '@/app/frontend_admin/admin_members/members_directory/types/AdminMembersDirectoryComponentTypes';


const STATUS_TRANSLATION_KEYS = {
  Active: 'STATUS_ACTIVE',
  Expired: 'STATUS_EXPIRED',
  Suspended: 'STATUS_SUSPENDED',
  Blocked: 'STATUS_BLOCKED',
} as const;

/** Feature-owned table; no backend records are synthesized here. */
export default function AdminMembersMemberTable({
  members,
  filterStatus,
  onSelectMember,
  onAction,
  canMutate = true,
  selectedIds = [],
  onToggleSelectOne,
  onToggleSelectAll,
  onQuickWhatsApp,
}: AdminMembersMemberTableProps) {
  const t = useTranslations('ADMIN_MEMBERS');
  const locale = useLocale();
  type MemberSortField = 'name' | 'branch' | 'phone' | 'plan' | 'seat' | 'expiryDate' | 'status';
  const [sortField, setSortField] = useState<MemberSortField | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useAdminApplicationInfrastructureUrlQueryState<number>('page', 0);
  const [openActionsFor, setOpenActionsFor] = useState<string | null>(null);
  const [pageSize, setPageSize] = useState(10);

  const toggleSort = (field: MemberSortField) => {
    setPage(0);
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredMembers = useMemo(
    () => members.filter((member) => !filterStatus || member.status === filterStatus),
    [filterStatus, members],
  );

  const sortedMembers = useMemo(() => {
    if (!sortField) return filteredMembers;
    return [...filteredMembers].sort((a, b) => {
      const aVal = a[sortField] ?? '';
      const bVal = b[sortField] ?? '';
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        const cmp = aVal.localeCompare(bVal, undefined, { numeric: true, sensitivity: 'base' });
        return sortDirection === 'asc' ? cmp : -cmp;
      }
      return 0;
    });
  }, [filteredMembers, sortField, sortDirection]);

  const pageCount = Math.max(1, Math.ceil(sortedMembers.length / pageSize));
  const currentPage = Math.min(page, pageCount - 1);
  const visibleMembers = sortedMembers.slice(currentPage * pageSize, (currentPage + 1) * pageSize);
  const statusLabel = (status: AdminMembersMember['status']) => t(STATUS_TRANSLATION_KEYS[status] ?? 'STATUS_UNKNOWN');
  const expiryLabel = (date: string) => formatAdminMembersDate(date, locale, t('UNKNOWN_DATE'));

  const renderSortableHeader = (field: MemberSortField, label: string, extraClass: string = '') => {
    const isActive = sortField === field;
    return (
      <th scope="col" aria-sort={isActive ? (sortDirection === 'asc' ? 'ascending' : 'descending') : undefined} className={`px-4 py-3 whitespace-nowrap ${extraClass}`}>
        <button
          type="button"
          onClick={() => toggleSort(field)}
          className="group inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-text-secondary hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1 -mx-1"
          aria-label={`${label}, sort ${isActive ? (sortDirection === 'asc' ? 'descending' : 'ascending') : 'ascending'}`}
        >
          <span>{label}</span>
          {isActive ? (
            sortDirection === 'asc' ? (
              <ArrowUp className="text-primary font-bold shrink-0" size={14} aria-hidden="true" />
            ) : (
              <ArrowDown className="text-primary font-bold shrink-0" size={14} aria-hidden="true" />
            )
          ) : (
            <ArrowUpDown className="text-text-secondary opacity-40 group-hover:opacity-100 transition-opacity shrink-0" size={14} aria-hidden="true" />
          )}
        </button>
      </th>
    );
  };

  if (filteredMembers.length === 0) {
    return <div className="p-6 text-center text-text-secondary" role="status">{t('TABLE_EMPTY')}</div>;
  }

  return (
    <div>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface-highlight uppercase text-xs text-text-secondary font-semibold">
            <tr>
              <th scope="col" className="w-10 px-4 py-3">
                {onToggleSelectAll && (
                  <input
                    type="checkbox"
                    aria-label="Select all members on this page"
                    checked={visibleMembers.length > 0 && visibleMembers.every((m) => selectedIds.includes(m.id))}
                    onChange={onToggleSelectAll}
                    className="rounded border-border"
                  />
                )}
              </th>
              {renderSortableHeader('name', t('TABLE_MEMBER'))}
              {renderSortableHeader('branch', 'Branch')}
              {renderSortableHeader('phone', t('TABLE_CONTACT'))}
              {renderSortableHeader('plan', t('TABLE_PLAN'))}
              {renderSortableHeader('seat', 'Seat / Shift')}
              {renderSortableHeader('expiryDate', t('TABLE_EXPIRY'))}
              {renderSortableHeader('status', t('TABLE_STATUS'))}
              <th scope="col" className="px-4 py-3 text-right">{t('TABLE_ACTIONS')}</th>
            </tr>
          </thead>
          <tbody>
            {visibleMembers.map((member) => {
              const isSelected = selectedIds.includes(member.id);
              return (
              <tr key={member.id} className={`border-b border-border hover:bg-surface-hover even:bg-surface-zebra h-12 ${isSelected ? 'bg-primary-subtle' : ''}`}>
                <td className="w-10 px-4 py-3">
                  {onToggleSelectOne && (
                    <input
                      type="checkbox"
                      aria-label={`Select ${member.name}`}
                      checked={isSelected}
                      onChange={() => onToggleSelectOne(member.id)}
                      className="rounded border-border"
                    />
                  )}
                </td>
                <th scope="row" className="px-4 py-3 font-medium text-text-primary">
                  <button type="button" className="underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" onClick={() => onSelectMember(member)}>{displayValue(member.name)}</button>
                  <span className="block text-xs font-normal text-text-secondary">{displayValue(member.id)}</span>
                </th>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1 rounded-md border border-border bg-surface-highlight px-2 py-0.5 text-xs font-medium text-text-primary whitespace-nowrap">
                    <Building2 size={12} className="text-primary shrink-0" />
                    <span>{member.branch || 'Downtown Central'}</span>
                  </span>
                </td>
                <td className="px-4 py-3"><span className="block">{displayValue(member.email)}</span><span className="text-text-secondary">{displayValue(member.phone)}</span></td>
                <td className="px-4 py-3">{displayValue(member.plan)}</td>
                <td className="px-4 py-3">
                  <span className="block font-medium text-text-primary">{member.seat ? `Seat ${member.seat}` : '—'}</span>
                  <span className="text-xs text-text-secondary">{member.shift || '—'}{member.locker ? ` · Locker ${member.locker}` : ''}</span>
                </td>
                <td className="px-4 py-3">{expiryLabel(member.expiryDate)}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-col gap-1 items-start">
                    <span className="rounded-full bg-surface-highlight px-2.5 py-0.5 text-xs font-semibold">{statusLabel(member.status)}</span>
                    {member.feeStatus && (
                      <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${member.feeStatus === 'Paid' ? 'bg-success-bg text-success-text' : 'bg-danger-bg text-danger-text'}`}>
                        {member.feeStatus === 'Due' && member.dueFeeMinor ? `Due: ₹${(member.dueFeeMinor / 100).toLocaleString('en-IN')}` : `Fee: ${member.feeStatus}`}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3"><div className="relative flex justify-end gap-1">
                  <button type="button" className="min-h-11 min-w-11 rounded-md hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" aria-label={t('ACTION_VIEW_MEMBER', { name: member.name })} onClick={() => onSelectMember(member)}><Eye size={18} strokeWidth={2} aria-hidden="true" /></button>
                  <button
                    type="button"
                    className="min-h-11 min-w-11 rounded-md text-success-text hover:bg-success-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary inline-flex items-center justify-center"
                    title="Chat on WhatsApp"
                    aria-label={`Chat with ${member.name} on WhatsApp`}
                    onClick={() => {
                      if (onQuickWhatsApp) {
                        onQuickWhatsApp(member);
                      } else {
                        const digits = (member.phone || '').replace(/\D/g, '');
                        const phone = digits.length === 10 ? `91${digits}` : digits;
                        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(`Hello ${member.name}, greetings from Smart Library admin!`)}`, '_blank', 'noopener,noreferrer');
                      }
                    }}
                  >
                    <MessageSquare size={18} strokeWidth={2} aria-hidden="true" />
                  </button>
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
              );
            })}
          </tbody>
        </table>
      </div>
      <AdminMembersDirectoryMemberMobileCards
        visibleMembers={visibleMembers}
        selectedIds={selectedIds}
        onToggleSelectOne={onToggleSelectOne}
        onSelectMember={onSelectMember}
        onAction={onAction}
        canMutate={canMutate}
        statusLabel={statusLabel}
        expiryLabel={expiryLabel}
      />
      {filteredMembers.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border px-4 py-3 text-sm text-text-secondary">
          <span>{t('PAGINATION_SHOWING_RANGE', { start: currentPage * pageSize + 1, end: Math.min((currentPage + 1) * pageSize, filteredMembers.length), total: filteredMembers.length })}</span>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <label htmlFor="rows-per-page-members-directory" className="text-xs text-text-secondary whitespace-nowrap">
                Rows per page:
              </label>
              <select
                id="rows-per-page-members-directory"
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(0);
                }}
                className="rounded border border-border bg-input px-2 py-1 text-xs text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="min-h-9 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-text-primary hover:bg-surface-hover disabled:cursor-not-allowed disabled:text-text-disabled"
                disabled={currentPage === 0}
                onClick={() => setPage((current) => Math.max(0, current - 1))}
              >
                {t('PAGINATION_PREVIOUS')}
              </button>
              <span className="text-xs text-text-secondary">
                Page {currentPage + 1} of {pageCount}
              </span>
              <button
                type="button"
                className="min-h-9 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-text-primary hover:bg-surface-hover disabled:cursor-not-allowed disabled:text-text-disabled"
                disabled={currentPage >= pageCount - 1}
                onClick={() => setPage((current) => Math.min(pageCount - 1, current + 1))}
              >
                {t('PAGINATION_NEXT')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


export type { AdminMembersMemberTableProps };
