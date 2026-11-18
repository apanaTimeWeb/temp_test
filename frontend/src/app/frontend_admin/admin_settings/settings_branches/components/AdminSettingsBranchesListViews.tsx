'use client';
// RESPONSIBILITY: Renders the selected branch-list tab with its module-owned responsive table, pagination, and actions.
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useAdminApplicationInfrastructureUrlQueryState } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_hooks/useAdminApplicationInfrastructureUrlQueryState';
import useAdminSettingsBranchesMain from '@/app/frontend_admin/admin_settings/settings_branches/hooks/useAdminSettingsBranchesMain';
import type { AdminBranchesBranch, AdminBranchesStatus } from '@/app/frontend_admin/admin_settings/settings_branches/schemas/AdminSettingsBranchesSchema';
import { ADMIN_BRANCHES_DEFAULT_PAGE_SIZE, ADMIN_BRANCHES_PAGE_SIZE_OPTIONS, ADMIN_BRANCHES_STATUS_OPTIONS } from '@/app/frontend_admin/admin_settings/settings_branches/config/admin_settings_branches.url_config';
import { Search, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import type { AdminBranchesListViewsProps } from '@/app/frontend_admin/admin_settings/settings_branches/types/AdminSettingsBranchesComponentTypes';
import { AdminTablePagination } from '@/app/frontend_admin/components/ui/table/AdminTablePagination';


export default function AdminBranchesListViews({ model }: AdminBranchesListViewsProps) {
  const t = useTranslations('ADMIN_BRANCHES');
  const { activeTab, setActiveTab, branches, setViewingBranch } = model;
  const filterStatus: AdminBranchesStatus | undefined = ADMIN_BRANCHES_STATUS_OPTIONS[0];
  const [search, setSearch] = useState('');
  type BranchSortField = 'name' | 'manager' | 'status';
  const [sortField, setSortField] = useState<BranchSortField | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useAdminApplicationInfrastructureUrlQueryState<number>('page', 0);
  const [pageSize, setPageSize] = useAdminApplicationInfrastructureUrlQueryState<number>('pageSize', ADMIN_BRANCHES_DEFAULT_PAGE_SIZE, { validValues: [10, 25, 50] });

  const toggleSort = (field: BranchSortField) => {
    setPage(0);
    if (sortField === field) setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    else { setSortField(field); setSortDirection('asc'); }
  };

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

  const sortedRows = useMemo(() => {
    if (!sortField) return rows;
    return [...rows].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      const cmp = aVal.localeCompare(bVal, undefined, { numeric: true, sensitivity: 'base' });
      return sortDirection === 'asc' ? cmp : -cmp;
    });
  }, [rows, sortField, sortDirection]);

  const pageCount = Math.max(1, Math.ceil(sortedRows.length / pageSize));
  const safePage = Math.min(page, pageCount - 1);
  const visibleRows = useMemo(() => sortedRows.slice(safePage * pageSize, (safePage + 1) * pageSize), [safePage, pageSize, sortedRows]);

  const renderSortableHeader = (field: BranchSortField, label: string) => {
    const isActive = sortField === field;
    return (
      <th scope="col" aria-sort={isActive ? (sortDirection === 'asc' ? 'ascending' : 'descending') : undefined} className="px-4 py-3 whitespace-nowrap text-left">
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
  const statusClass = (status: AdminBranchesStatus) => status === ADMIN_BRANCHES_STATUS_OPTIONS[0] ? 'bg-success-bg text-success-text' : status === ADMIN_BRANCHES_STATUS_OPTIONS[1] ? 'bg-danger-bg text-danger-text' : 'bg-muted text-text-secondary border border-border';
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
              </article>
            ))}
          </div>
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="h-12 bg-slate-950/70 uppercase text-xs text-slate-400 font-semibold border-b border-slate-800">
                  {renderSortableHeader('name', t('TABLE_BRANCH'))}
                  {renderSortableHeader('manager', t('TABLE_MANAGER'))}
                  {renderSortableHeader('status', t('TABLE_STATUS'))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {visibleRows.map((branch) => (
                  <tr key={branch.id} className="h-14 border-b border-slate-800/60 text-slate-200 motion-safe:transition-colors hover:bg-slate-800/40">
                    <td className="px-4 py-3">
                      <div>
                        <span className="font-semibold text-slate-100">{branch.name}</span>
                        <span className="block text-xs font-mono text-slate-400">{branch.code}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-300 font-medium">{branch.manager}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass(branch.status)}`}>
                        {t(branch.status === ADMIN_BRANCHES_STATUS_OPTIONS[0] ? 'STATUS_ACTIVE' : branch.status === ADMIN_BRANCHES_STATUS_OPTIONS[1] ? 'STATUS_SUSPENDED' : 'STATUS_ARCHIVED')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <AdminTablePagination
            page={safePage}
            pageSize={pageSize}
            totalRows={sortedRows.length}
            onPageChange={setPage}
            onPageSizeChange={(sz) => {
              setPageSize(sz);
              setPage(0);
            }}
            labels={{ results: '' }}
          />
        </>
      )}
    </div>
  );

  if (activeTab === 'active' || activeTab === 'all') {
    return (
      <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 shadow-xl backdrop-blur-md">
        <h2 className="p-5 border-b border-slate-800 text-lg font-bold text-white">{t('ACTIVE_BRANCHES')}</h2>
        {table}
      </section>
    );
  }
  return null;
}


export type { AdminBranchesListViewsProps };
