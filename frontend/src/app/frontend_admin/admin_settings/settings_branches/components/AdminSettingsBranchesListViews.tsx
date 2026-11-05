'use client';
// RESPONSIBILITY: Renders the selected branch-list tab with its module-owned responsive table, pagination, and actions.
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useAdminApplicationInfrastructureUrlQueryState } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_hooks/useAdminApplicationInfrastructureUrlQueryState';
import type { KeyboardEvent, MouseEvent } from 'react';
import useAdminSettingsBranchesMain from '@/app/frontend_admin/admin_settings/settings_branches/hooks/useAdminSettingsBranchesMain';
import type { AdminBranchesBranch, AdminBranchesStatus } from '@/app/frontend_admin/admin_settings/settings_branches/schemas/AdminSettingsBranchesSchema';
import { ADMIN_BRANCHES_DEFAULT_PAGE_SIZE, ADMIN_BRANCHES_PAGE_SIZE_OPTIONS, ADMIN_BRANCHES_STATUS_OPTIONS } from '@/app/frontend_admin/admin_settings/settings_branches/config/admin_settings_branches.url_config';
import { Eye, MoreVertical, Search } from 'lucide-react';
import type { AdminBranchesListViewsProps } from '@/app/frontend_admin/admin_settings/settings_branches/types/AdminSettingsBranchesComponentTypes';
import { AdminTablePagination } from '@/app/frontend_admin/components/ui/table/AdminTablePagination';


export default function AdminBranchesListViews({ model }: AdminBranchesListViewsProps) {
  const t = useTranslations('ADMIN_BRANCHES');
  const { activeTab, setActiveTab, branches, setViewingBranch } = model;
  const filterStatus: AdminBranchesStatus | undefined = activeTab === 'active' ? ADMIN_BRANCHES_STATUS_OPTIONS[0] : activeTab === 'suspended' ? ADMIN_BRANCHES_STATUS_OPTIONS[1] : activeTab === 'archived' ? ADMIN_BRANCHES_STATUS_OPTIONS[2] : undefined;
  const [search, setSearch] = useState('');
  const [page, setPage] = useAdminApplicationInfrastructureUrlQueryState<number>('page', 0);
  const [pageSize, setPageSize] = useAdminApplicationInfrastructureUrlQueryState<number>('pageSize', ADMIN_BRANCHES_DEFAULT_PAGE_SIZE, { validValues: [10, 25, 50] });
  const [openActionsFor, setOpenActionsFor] = useState<string | null>(null);
  const prevFilterRef = useRef(filterStatus);
  useEffect(() => {
    if (prevFilterRef.current !== filterStatus) {
      prevFilterRef.current = filterStatus;
      setPage(0);
    }
  }, [filterStatus, setPage]);

  const rows = useMemo(() => {
    let list = filterStatus ? branches.filter((branch) => branch.status === filterStatus) : branches;
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter((b) =>
        b.name.toLowerCase().includes(q) ||
        b.code.toLowerCase().includes(q) ||
        b.manager.toLowerCase().includes(q) ||
        (b.address ? b.address.toLowerCase().includes(q) : false)
      );
    }
    return list;
  }, [branches, filterStatus, search]);

  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));
  const safePage = Math.min(page, pageCount - 1);
  const visibleRows = useMemo(() => rows.slice(safePage * pageSize, (safePage + 1) * pageSize), [safePage, pageSize, rows]);
  const statusClass = (status: AdminBranchesStatus) => status === ADMIN_BRANCHES_STATUS_OPTIONS[0] ? 'bg-success-bg text-success-text' : status === ADMIN_BRANCHES_STATUS_OPTIONS[1] ? 'bg-danger-bg text-danger-text' : 'bg-surface-highlight text-text-secondary';
  const activateRow = (event: KeyboardEvent<HTMLTableRowElement>, branch: AdminBranchesBranch) => {
    const target = event.target;
    if (target instanceof HTMLElement && target.closest('button,a,input,select,textarea,[role=menuitem]')) return;
    if (['Enter', ' '].includes(event.key)) { event.preventDefault(); setViewingBranch(branch); }
  };
  const clickRow = (event: MouseEvent<HTMLTableRowElement>, branch: AdminBranchesBranch) => {
    const target = event.target;
    if (target instanceof HTMLElement && target.closest('button,a,input,select,textarea')) return;
    setViewingBranch(branch);
  };
  const table = (
    <div className="w-full">
      <div className="p-4 border-b border-border flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            placeholder="Search branches by name, code, manager, address..."
            aria-label="Search branches"
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-border bg-input text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>
      {!rows.length ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center text-text-secondary m-4">
          <p className="font-medium text-text-primary">{t('EMPTY_TITLE')}</p>
          <p className="mt-1 text-sm">{t('EMPTY_DESCRIPTION')}</p>
        </div>
      ) : (
        <>
          <div className="space-y-3 md:hidden p-4" aria-label={t('BRANCH_LIST_MOBILE')}>
            {visibleRows.map((branch) => (
              <article key={branch.id} className="space-y-3 rounded-lg border border-border bg-card p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="break-words font-semibold text-text-primary">{branch.name}</h3>
                    <p className="text-xs text-text-secondary">{t('BRANCH_CODE_LABEL')}: {branch.code}</p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass(branch.status)}`}>
                    {t(branch.status === ADMIN_BRANCHES_STATUS_OPTIONS[0] ? 'STATUS_ACTIVE' : branch.status === ADMIN_BRANCHES_STATUS_OPTIONS[1] ? 'STATUS_SUSPENDED' : 'STATUS_ARCHIVED')}
                  </span>
                </div>
                <dl className="grid grid-cols-1 gap-2 text-sm">
                  <div><dt className="text-text-secondary">{t('TABLE_MANAGER')}</dt><dd className="break-words text-text-primary">{branch.manager}</dd></div>
                  <div><dt className="text-text-secondary">{t('BRANCH_ADDRESS_LABEL')}</dt><dd className="break-words text-text-primary">{branch.address}</dd></div>
                </dl>
                <button type="button" className="min-h-11 w-full rounded-md border border-border px-3 py-2 text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" onClick={() => setViewingBranch(branch)}>{t('VIEW_DETAILS')}</button>
              </article>
            ))}
          </div>
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="h-12 bg-surface-highlight uppercase text-xs text-text-secondary font-semibold border-b border-border">
                  <th className="px-4 py-3 text-left">{t('TABLE_BRANCH')}</th>
                  <th className="px-4 py-3 text-left">{t('TABLE_MANAGER')}</th>
                  <th className="px-4 py-3 text-left">{t('TABLE_STATUS')}</th>
                  <th className="px-4 py-3 text-right">{t('TABLE_ACTIONS')}</th>
                </tr>
              </thead>
              <tbody>
                {visibleRows.map((branch) => (
                  <tr key={branch.id} tabIndex={0} className="h-12 cursor-pointer border-b border-border text-text-primary motion-safe:transition-colors hover:bg-surface-hover even:bg-surface-zebra/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" onClick={(event) => clickRow(event, branch)} onKeyDown={(event) => activateRow(event, branch)} aria-label={t('OPEN_BRANCH', { name: branch.name })}>
                    <td className="px-4 py-3">
                      <button type="button" className="text-left text-primary underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" onClick={() => setViewingBranch(branch)}>
                        <span className="font-medium">{branch.name}</span>
                        <span className="block text-xs text-text-secondary">{branch.code}</span>
                      </button>
                    </td>
                    <td className="px-4 py-3">{branch.manager}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass(branch.status)}`}>
                        {t(branch.status === ADMIN_BRANCHES_STATUS_OPTIONS[0] ? 'STATUS_ACTIVE' : branch.status === ADMIN_BRANCHES_STATUS_OPTIONS[1] ? 'STATUS_SUSPENDED' : 'STATUS_ARCHIVED')}
                      </span>
                    </td>
                    <td className="relative px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button type="button" aria-label={t('VIEW_BRANCH', { name: branch.name })} className="min-h-11 min-w-11 rounded-md text-text-secondary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" onClick={() => { setOpenActionsFor(null); setViewingBranch(branch); }}><Eye size={18} strokeWidth={2}/></button>
                        <button type="button" aria-label={t('OPEN_ACTIONS', { name: branch.name })} aria-haspopup="menu" aria-expanded={openActionsFor === branch.id} aria-controls={`admin-branch-actions-${branch.id}`} className="min-h-11 min-w-11 rounded-md text-text-secondary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" onClick={() => setOpenActionsFor((current) => current === branch.id ? null : branch.id)}><MoreVertical size={18} strokeWidth={2}/></button>
                      </div>
                      {openActionsFor === branch.id && (
                        <div id={`admin-branch-actions-${branch.id}`} role="menu" aria-label={t('OPEN_ACTIONS', { name: branch.name })} onKeyDown={(event) => { if (event.key === 'Escape') setOpenActionsFor(null); }} className="absolute right-4 top-14 z-10 min-w-48 rounded-md border border-border bg-popover p-1 shadow-popover">
                          <button type="button" role="menuitem" className="block min-h-11 w-full rounded px-3 py-2 text-left text-primary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" onClick={() => { setOpenActionsFor(null); setViewingBranch(branch); }}>{t('VIEW_DETAILS')}</button>
                          <button type="button" role="menuitem" disabled title={t('EDIT_BRANCH_TITLE')} className="block min-h-11 w-full cursor-not-allowed rounded px-3 py-2 text-left text-text-disabled disabled:opacity-60">{t('EDIT_BRANCH_UNAVAILABLE')}</button>
                          <button type="button" role="menuitem" className="block min-h-11 w-full rounded px-3 py-2 text-left text-primary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" onClick={() => setOpenActionsFor(null)}>{t('CLOSE_MENU')}</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <AdminTablePagination
            page={safePage}
            pageSize={pageSize}
            totalRows={rows.length}
            onPageChange={setPage}
            onPageSizeChange={(sz) => {
              setPageSize(sz);
              setPage(0);
            }}
          />
        </>
      )}
    </div>
  );

  if (activeTab === 'all') return <section className="admin-card"><div className="flex items-center justify-between gap-4 p-4"><h2>{t('ALL_BRANCHES')}</h2><button type="button" className="admin-btn-primary" onClick={() => setActiveTab('create')}>{t('NEW_BRANCH')}</button></div>{table}</section>;
  if (activeTab === 'active') return <section className="admin-card"><h2 className="p-4">{t('ACTIVE_BRANCHES')}</h2>{table}</section>;
  if (activeTab === 'suspended') return <section className="admin-card"><h2 className="p-4">{t('SUSPENDED_BRANCHES')}</h2>{table}</section>;
  if (activeTab === 'archived') return <section className="admin-card"><h2 className="p-4">{t('ARCHIVED_BRANCHES')}</h2>{table}</section>;
  return null;
}


export type { AdminBranchesListViewsProps };
