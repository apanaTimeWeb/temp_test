'use client';

import { ADMIN_STAFF_DIRECTORY_STATUS_BADGE_CLASSES } from '@/app/frontend_admin/admin_staff/staff_directory/config/admin_staff_directory.url_config';
import type { AdminStaffDirectoryManager } from '@/app/frontend_admin/admin_staff/staff_directory/schemas/AdminStaffDirectorySchema';
import type { AdminStaffDirectoryManagerTableProps } from '@/app/frontend_admin/admin_staff/staff_directory/types/AdminStaffDirectoryComponentTypes';
import { getAdminStaffDirectoryLastActiveLabel, maskAdminStaffDirectoryEmail, maskAdminStaffDirectoryPhone } from '@/app/frontend_admin/admin_staff/staff_directory/utils/AdminStaffDirectoryDisplayUtils';
import { exportStaffDirectoryCsv, exportStaffDirectoryExcel, printStaffDirectoryRoster } from '@/app/frontend_admin/admin_staff/staff_directory/utils/adminStaffDirectoryExports';
import { useAdminApplicationInfrastructureUrlQueryState } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_hooks/useAdminApplicationInfrastructureUrlQueryState';
import { AdminTablePagination } from '@/app/frontend_admin/components/ui/table/AdminTablePagination';
import { AlertCircle, ArrowDown, ArrowUp, ArrowUpDown, Download, Eye, FileSpreadsheet, Mail, MessageSquare, Printer, Search, UserCheck, UserX } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';

type ManagerSortField = 'name' | 'email' | 'branch' | 'lastActive' | 'status';

export function AdminStaffDirectoryManagerTable({ managers, filterStatus, tab, onSelectManager, onUpdateStatus }: AdminStaffDirectoryManagerTableProps) {
  const t = useTranslations('ADMIN_STAFF_DIRECTORY');
  const [sortField, setSortField] = useState<ManagerSortField | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useAdminApplicationInfrastructureUrlQueryState<number>('page', 0);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');

  const toggleSort = (field: ManagerSortField) => {
    setPage(0);
    if (sortField === field) setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    else { setSortField(field); setSortDirection('asc'); }
  };

  const tabTitleKey = { all: 'PANEL_ALL', staff: 'PANEL_STAFF', active: 'PANEL_ACTIVE', suspended: 'PANEL_SUSPENDED', deactivated: 'PANEL_DEACTIVATED' } as const;
  const tabFilterStatus: Partial<Record<NonNullable<typeof tab>, AdminStaffDirectoryManager['status']>> = { active: 'Active', suspended: 'Suspended', deactivated: 'Deactivated' };
  const effectiveFilterStatus = filterStatus ?? (tab ? tabFilterStatus[tab] : undefined);

  const filteredManagers = useMemo(() => {
    let result = managers;
    if (tab === 'all') result = result.filter((m) => !m.id.startsWith('STF'));
    else if (tab === 'staff') result = result.filter((m) => m.id.startsWith('STF') || (m.role && m.role !== 'Branch Manager'));
    if (effectiveFilterStatus) result = result.filter((m) => m.status === effectiveFilterStatus);
    const q = search.trim().toLowerCase();
    if (!q) return result;
    return result.filter((m) =>
      m.name.toLowerCase().includes(q) || m.username.toLowerCase().includes(q) || m.email.toLowerCase().includes(q) ||
      m.phone.toLowerCase().includes(q) || m.branch.toLowerCase().includes(q) || Boolean(m.role && m.role.toLowerCase().includes(q))
    );
  }, [effectiveFilterStatus, managers, tab, search]);

  const sortedManagers = useMemo(() => {
    if (!sortField) return filteredManagers;
    return [...filteredManagers].sort((a, b) => {
      const aVal = a[sortField]; const bVal = b[sortField];
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        const cmp = aVal.localeCompare(bVal, undefined, { numeric: true, sensitivity: 'base' });
        return sortDirection === 'asc' ? cmp : -cmp;
      }
      return 0;
    });
  }, [filteredManagers, sortField, sortDirection]);

  const pageCount = Math.max(1, Math.ceil(sortedManagers.length / pageSize));
  const currentPage = Math.min(page, pageCount - 1);
  const visibleManagers = sortedManagers.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

  const renderSortableHeader = (field: ManagerSortField, label: string) => {
    const isActive = sortField === field;
    return (
      <th scope="col" aria-sort={isActive ? (sortDirection === 'asc' ? 'ascending' : 'descending') : undefined} className="px-4 py-3 whitespace-nowrap">
        <button
          type="button" onClick={() => toggleSort(field)}
          className="group inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-text-secondary hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1 -mx-1"
          aria-label={`${label}, sort ${isActive ? (sortDirection === 'asc' ? 'descending' : 'ascending') : 'ascending'}`}
        >
          <span>{label}</span>
          {isActive ? (sortDirection === 'asc' ? <ArrowUp className="text-primary font-bold shrink-0" size={14} aria-hidden="true" /> : <ArrowDown className="text-primary font-bold shrink-0" size={14} aria-hidden="true" />) : (
            <ArrowUpDown className="text-text-secondary opacity-40 group-hover:opacity-100 motion-safe:transition-opacity shrink-0" size={14} aria-hidden="true" />
          )}
        </button>
      </th>
    );
  };

  const renderStatusActionButtons = (manager: AdminStaffDirectoryManager, compact = false) => {
    if (!onUpdateStatus) return null;
    const base = compact
      ? 'inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-[11px] font-semibold motion-safe:transition-colors'
      : 'inline-flex min-h-10 px-2.5 items-center gap-1 rounded-md border text-xs font-semibold';
    if (manager.status === 'Active') {
      return (
        <>
          <button type="button" onClick={() => onUpdateStatus(manager.id, 'Suspended')} className={`${base} border-warning bg-warning-bg text-warning-text hover:opacity-90`} title="Suspend staff account">
            <AlertCircle size={compact ? 12 : 13} /><span>Suspend</span>
          </button>
          <button type="button" onClick={() => onUpdateStatus(manager.id, 'Deactivated')} className={`${base} border-danger bg-danger-bg text-danger-text hover:opacity-90`} title="Deactivate staff account">
            <UserX size={compact ? 12 : 13} /><span>Deactivate</span>
          </button>
        </>
      );
    }
    return (
      <button type="button" onClick={() => onUpdateStatus(manager.id, 'Active')} className={`${base} border-success bg-success-bg text-success-text hover:opacity-90`} title={manager.status === 'Suspended' ? 'Activate staff account' : 'Reactivate staff account'}>
        <UserCheck size={compact ? 12 : 13} /><span>{manager.status === 'Suspended' ? 'Activate' : 'Reactivate'}</span>
      </button>
    );
  };

  const statusLabels = { Active: t('STATUS_ACTIVE'), Suspended: t('STATUS_SUSPENDED'), Deactivated: t('STATUS_DEACTIVATED') } as const;

  const tableContent = (
    <div>
      <div className="p-4 border-b border-border flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
          <input maxLength={100} type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }} placeholder="Search staff by name, email, phone, branch..." aria-label="Search staff directory" className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-border bg-input text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={() => printStaffDirectoryRoster(sortedManagers)} disabled={sortedManagers.length === 0} className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-text-primary hover:bg-surface-hover motion-safe:transition-colors disabled:opacity-40" title="Print Staff Roster"><Printer size={13} className="text-text-secondary" /><span>Print Roster</span></button>
          <button type="button" onClick={() => exportStaffDirectoryCsv(sortedManagers)} disabled={sortedManagers.length === 0} className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-text-primary hover:bg-surface-hover motion-safe:transition-colors disabled:opacity-40" title="Export Staff CSV"><Download size={13} className="text-text-secondary" /><span>CSV</span></button>
          <button type="button" onClick={() => exportStaffDirectoryExcel(sortedManagers)} disabled={sortedManagers.length === 0} className="inline-flex items-center gap-1.5 rounded-lg border border-success bg-success-bg px-3 py-1.5 text-xs font-semibold text-success-text hover:opacity-90 motion-safe:transition-colors disabled:opacity-40" title="Export Staff Excel"><FileSpreadsheet size={13} /><span>Excel</span></button>
        </div>
      </div>

      {filteredManagers.length === 0 ? (
        <p className="p-6 text-text-secondary" role="status">{t('NO_RECORDS')}</p>
      ) : (
        <>
          <div className="space-y-3 p-3 md:hidden">
            {visibleManagers.map((manager) => (
              <article key={manager.id} className="rounded-lg border border-border p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <button type="button" className="break-words font-semibold text-primary-text underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" onClick={() => onSelectManager(manager)}>{manager.name}</button>
                    <p className="text-xs text-text-secondary">@{manager.username}{manager.role ? ` · ${manager.role}` : ''}</p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${ADMIN_STAFF_DIRECTORY_STATUS_BADGE_CLASSES[manager.status]}`}>{statusLabels[manager.status]}</span>
                </div>
                <dl className="mt-3 grid grid-cols-1 gap-2 text-sm">
                  <div><dt className="text-text-secondary">{t('TABLE_CONTACT')}</dt><dd className="break-words">{maskAdminStaffDirectoryEmail(manager.email)} · {maskAdminStaffDirectoryPhone(manager.phone)}</dd></div>
                  <div><dt className="text-text-secondary">{t('TABLE_BRANCH')}</dt><dd>{manager.branch}</dd></div>
                  <div><dt className="text-text-secondary">{t('TABLE_LAST_ACTIVE')}</dt><dd>{getAdminStaffDirectoryLastActiveLabel(manager.lastActive, t)}</dd></div>
                </dl>
                <div className="mt-3 flex flex-wrap gap-2 items-center">
                  <button type="button" className="min-h-10 rounded-md border border-border px-3 text-sm font-medium" onClick={() => onSelectManager(manager)}>{t('VIEW_MANAGER', { name: manager.name })}</button>
                  <a href={`https://wa.me/91${manager.phone.replace(/\D/g, '').slice(-10)}?text=${encodeURIComponent(`Hello ${manager.name}, this is regarding Library Administration.`)}`} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 px-3 items-center gap-1.5 rounded-md border border-success bg-success-bg text-xs font-semibold text-success-text hover:opacity-90" title={`WhatsApp ${manager.name}`} aria-label={`WhatsApp ${manager.name}`}><MessageSquare size={13} /><span>WhatsApp</span></a>
                  <a href={`mailto:${manager.email}?subject=${encodeURIComponent('Official Communication - Library Administration')}`} className="inline-flex min-h-10 px-3 items-center gap-1.5 rounded-md border border-info bg-info-bg text-xs font-semibold text-info-text hover:opacity-90" title={`Email ${manager.name}`} aria-label={`Email ${manager.name}`}><Mail size={13} /><span>Email</span></a>
                  {renderStatusActionButtons(manager, false)}
                </div>
              </article>
            ))}
          </div>

          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="h-12 bg-surface uppercase text-xs text-text-secondary font-semibold border-b border-border">
                  {renderSortableHeader('name', t('TABLE_MANAGER'))}
                  {renderSortableHeader('email', t('TABLE_CONTACT'))}
                  {renderSortableHeader('branch', t('TABLE_BRANCH'))}
                  {renderSortableHeader('lastActive', t('TABLE_LAST_ACTIVE'))}
                  {renderSortableHeader('status', t('TABLE_STATUS'))}
                  <th scope="col" className="px-4 py-3 text-right">{t('TABLE_ACTIONS')}</th>
                </tr>
              </thead>
              <tbody>
                {visibleManagers.map((manager) => (
                  <tr key={manager.id} className="h-12 border-b border-border text-text-primary motion-safe:transition-colors hover:bg-surface-hover even:bg-surface-zebra">
                    <th scope="row" className="px-4 py-3 font-medium text-text-primary">
                      <button type="button" className="underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" onClick={() => onSelectManager(manager)}>{manager.name}</button>
                      <span className="block text-xs font-normal text-text-secondary">@{manager.username}{manager.role ? ` · ${manager.role}` : ''}</span>
                    </th>
                    <td className="px-4 py-3"><span className="block">{maskAdminStaffDirectoryEmail(manager.email)}</span><span className="text-text-secondary">{maskAdminStaffDirectoryPhone(manager.phone)}</span></td>
                    <td className="px-4 py-3">{manager.branch}</td>
                    <td className="px-4 py-3">{getAdminStaffDirectoryLastActiveLabel(manager.lastActive, t)}</td>
                    <td className="px-4 py-3"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${ADMIN_STAFF_DIRECTORY_STATUS_BADGE_CLASSES[manager.status]}`}>{statusLabels[manager.status]}</span></td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end items-center gap-1.5">
                        <a href={`https://wa.me/91${manager.phone.replace(/\D/g, '').slice(-10)}?text=${encodeURIComponent(`Hello ${manager.name}, this is regarding Library Administration.`)}`} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-8 min-w-8 items-center justify-center rounded-lg border border-success bg-success-bg text-success-text hover:opacity-90 motion-safe:transition-all shadow-xs" title={`WhatsApp ${manager.name}`} aria-label={`WhatsApp ${manager.name}`}><MessageSquare size={14} /></a>
                        <a href={`mailto:${manager.email}?subject=${encodeURIComponent('Official Communication - Library Administration')}`} className="inline-flex min-h-8 min-w-8 items-center justify-center rounded-lg border border-info bg-info-bg text-info-text hover:opacity-90 motion-safe:transition-all shadow-xs" title={`Email ${manager.name}`} aria-label={`Email ${manager.name}`}><Mail size={14} /></a>
                        <button type="button" aria-label={t('VIEW_MANAGER', { name: manager.name })} className="inline-flex min-h-8 min-w-8 items-center justify-center rounded-lg border border-border bg-card text-text-secondary hover:text-text-primary hover:bg-surface-hover motion-safe:hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary motion-safe:transition-all" onClick={() => onSelectManager(manager)}><Eye size={15} strokeWidth={2} /></button>
                        {renderStatusActionButtons(manager, true)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p id="admin-staff-users-row-actions-help" className="sr-only">{t('ROW_ACTIONS_BLOCKED')}</p>
          <AdminTablePagination page={currentPage} pageSize={pageSize} totalRows={filteredManagers.length} onPageChange={setPage} onPageSizeChange={(newPageSize) => { setPageSize(newPageSize); setPage(0); }} />
        </>
      )}
    </div>
  );

  return tab ? <section className="admin-card"><h2 className="p-4 text-lg font-semibold text-text-primary">{t(tabTitleKey[tab])}</h2>{tableContent}</section> : tableContent;
}
export type { AdminStaffDirectoryManagerTableProps };
export default AdminStaffDirectoryManagerTable;
