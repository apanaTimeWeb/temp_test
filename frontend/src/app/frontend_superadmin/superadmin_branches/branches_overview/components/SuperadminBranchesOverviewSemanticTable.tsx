'use client';
// RESPONSIBILITY: Render accessible sortable paginated table for Branch Management with single-line horizontal actions.
import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, GitBranch } from 'lucide-react';
import type { SuperadminBranchRecord } from '@/app/frontend_superadmin/superadmin_branches/branches_overview/types/SuperadminBranchesOverviewTypes';

interface SuperadminBranchesOverviewSemanticTableProps {
  branches: SuperadminBranchRecord[];
  onView: (b: SuperadminBranchRecord) => void;
  onEdit: (b: SuperadminBranchRecord) => void;
  onActivate: (id: string) => void;
  onSuspend: (b: SuperadminBranchRecord) => void;
  onCloseSafety: (b: SuperadminBranchRecord) => void;
  onRestore: (id: string) => void;
  onTransferManager: (b: SuperadminBranchRecord) => void;
  onViewActivity: (b: SuperadminBranchRecord) => void;
  onViewReports: (b: SuperadminBranchRecord) => void;
  renderActionButtons: (b: SuperadminBranchRecord) => React.ReactNode;
}

export default function SuperadminBranchesOverviewSemanticTable({
  branches,
  onView,
  renderActionButtons,
}: SuperadminBranchesOverviewSemanticTableProps) {
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(0);
  const [sortField, setSortField] = useState<keyof SuperadminBranchRecord>('name');
  const [sortAsc, setSortAsc] = useState(true);

  const sorted = useMemo(() => {
    return [...branches].sort((a, b) => {
      const vA = a[sortField] ?? '';
      const vB = b[sortField] ?? '';
      const comp = String(vA).localeCompare(String(vB), undefined, { numeric: true });
      return sortAsc ? comp : -comp;
    });
  }, [branches, sortField, sortAsc]);

  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize));
  const activePage = Math.min(currentPage, pageCount - 1);
  const visible = sorted.slice(activePage * pageSize, (activePage + 1) * pageSize);

  const handleSort = (field: keyof SuperadminBranchRecord) => {
    if (sortField === field) setSortAsc(!sortAsc);
    else { setSortField(field); setSortAsc(true); }
  };

  const statusStyles: Record<string, string> = {
    active: 'bg-success-bg text-success border-success-border',
    suspended: 'bg-danger-bg text-danger border-danger-border',
    closed: 'bg-surface text-muted border-border',
    deactivated: 'bg-warning-bg text-warning border-warning-border',
  };

  return (
    <div className="rounded-2xl border border-border bg-card shadow-card overflow-hidden">
      <div className="overflow-x-auto w-full">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-primary-subtle border-b border-border text-primary font-bold">
            <tr>
              {/* Sticky First Column: Rule 68 */}
              <th className="sticky start-0 z-10 bg-primary-subtle border-e border-border px-4 py-3.5 text-xs font-bold uppercase tracking-wider min-w-48">
                <button type="button" onClick={() => handleSort('name')} className="inline-flex items-center gap-1 hover:text-foreground cursor-pointer">
                  <span>Branch Name & Code</span>
                  <span>{sortField === 'name' ? (sortAsc ? '↑' : '↓') : ''}</span>
                </button>
              </th>
              <th className="px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-secondary min-w-44">
                <button type="button" onClick={() => handleSort('libraryName')} className="inline-flex items-center gap-1 hover:text-foreground cursor-pointer">
                  <span>Parent Library (Tenant)</span>
                  <span>{sortField === 'libraryName' ? (sortAsc ? '↑' : '↓') : ''}</span>
                </button>
              </th>
              <th className="px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-secondary min-w-36">
                <span>Location</span>
              </th>
              <th className="px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-secondary min-w-32">
                <span>Branch Manager</span>
              </th>
              <th className="px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-secondary min-w-28 text-right">
                <span>Capacity / Assets</span>
              </th>
              <th className="px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-secondary min-w-28">
                <span>Status</span>
              </th>
              <th className="px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-secondary min-w-[380px]">
                <span>Quick Actions (Strictly Horizontal)</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-xs">
            {visible.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-muted">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <GitBranch size={28} className="text-muted" />
                    <span>No branches match the selected filters.</span>
                  </div>
                </td>
              </tr>
            ) : (
              visible.map((branch) => (
                <tr
                  key={branch.id}
                  onClick={() => onView?.(branch)}
                  className="hover:bg-surface-elevated transition-colors cursor-pointer"
                >
                  {/* Sticky First Column: Rule 68 */}
                  <td className="sticky start-0 z-10 bg-card border-e border-border px-4 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-primary-subtle border border-border flex items-center justify-center text-primary font-bold shrink-0">
                        <GitBranch size={15} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-foreground truncate">{branch.name}</p>
                        <span className="font-mono text-[10px] text-primary px-1.5 py-0.5 rounded bg-primary-subtle border border-border">{branch.code}</span>
                      </div>
                    </div>
                  </td>

                  {/* Parent Library */}
                  <td className="px-4 py-3.5">
                    <p className="font-semibold text-foreground">{branch.libraryName}</p>
                    <span className="text-[10px] text-muted">Admin: {branch.adminName}</span>
                  </td>

                  {/* Location */}
                  <td className="px-4 py-3.5 text-secondary">
                    <p className="font-medium text-foreground">{branch.city || '—'}</p>
                    <span className="text-[11px] text-muted">{branch.state || '—'}</span>
                  </td>

                  {/* Manager */}
                  <td className="px-4 py-3.5">
                    <p className="font-semibold text-info">{branch.managerName}</p>
                    <span className="text-[10px] text-muted block truncate">{branch.managerPhone}</span>
                  </td>

                  {/* Capacity & Operational Assets */}
                  <td className="px-4 py-3.5 text-right font-medium text-foreground">
                    <div><strong className="text-warning">{branch.capacity}</strong> seats</div>
                    <div className="text-[11px] text-info">{branch.activeMembers} active students</div>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3.5">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border capitalize ${statusStyles[branch.status] || statusStyles.active}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${branch.status === 'active' ? 'bg-success motion-safe:animate-pulse' : 'bg-muted'}`} />
                      <span>{branch.status}</span>
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
                    {renderActionButtons(branch)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3.5 border-t border-border bg-card text-xs text-secondary">
        <div className="flex items-center gap-3">
          <span className="text-muted">
            Showing {sorted.length === 0 ? 0 : activePage * pageSize + 1} to {Math.min((activePage + 1) * pageSize, sorted.length)} of {sorted.length} branches
          </span>
          <div className="flex items-center gap-1.5 ml-2">
            <span className="text-[11px] text-muted">Per page:</span>
            <select
              aria-label="Rows per page"
              value={pageSize}
              onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(0); }}
              className="rounded-lg border border-border bg-surface px-2 py-1 text-xs text-foreground cursor-pointer focus:border-primary outline-none"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            disabled={activePage === 0}
            onClick={() => setCurrentPage(0)}
            className="p-1.5 rounded-lg border border-border bg-surface text-secondary hover:text-foreground hover:bg-surface-elevated disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            title="First page"
          >
            <ChevronsLeft size={14} />
          </button>
          <button
            type="button"
            disabled={activePage === 0}
            onClick={() => setCurrentPage(Math.max(0, activePage - 1))}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border bg-surface text-secondary hover:text-foreground hover:bg-surface-elevated disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer font-medium"
          >
            <ChevronLeft size={13} />
            <span>Previous</span>
          </button>

          {Array.from({ length: pageCount }).map((_, i) => (
            <button
              key={`branch-pg-${i}`}
              type="button"
              onClick={() => setCurrentPage(i)}
              className={`min-w-8 h-8 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activePage === i
                  ? 'bg-primary text-on-primary shadow-sm font-extrabold'
                  : 'border border-border bg-surface text-secondary hover:bg-surface-elevated hover:text-foreground'
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            type="button"
            disabled={activePage + 1 >= pageCount}
            onClick={() => setCurrentPage(Math.min(pageCount - 1, activePage + 1))}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border bg-surface text-secondary hover:text-foreground hover:bg-surface-elevated disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer font-medium"
          >
            <span>Next</span>
            <ChevronRight size={13} />
          </button>
          <button
            type="button"
            disabled={activePage + 1 >= pageCount}
            onClick={() => setCurrentPage(Math.max(0, pageCount - 1))}
            className="p-1.5 rounded-lg border border-border bg-surface text-secondary hover:text-foreground hover:bg-surface-elevated disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            title="Last page"
          >
            <ChevronsRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
