'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import {
  Eye,
  RefreshCw,
  CheckCircle,
  SearchX,
  Building2,
  AlertTriangle,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  Tag,
} from 'lucide-react';
import { ADMIN_COMMUNICATION_COMPLAINT_STATUS } from '@/app/frontend_admin/admin_communication/communication_complaints/config/admin_communication_complaints.url_config';
import AdminCommunicationEmptyState from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveEmptyState';
import { AdminTablePagination } from '@/app/frontend_admin/components/ui/table/AdminTablePagination';
import type { CStatus, Complaint } from '@/app/frontend_admin/admin_communication/communication_complaints/types/AdminCommunicationComplaintsComponentTypes';

type ComplaintSortField = 'title' | 'branchName' | 'student' | 'status' | 'date';

interface AdminCommunicationComplaintsTableProps {
  complaints: Complaint[];
  isLoading: boolean;
  errorMessage: string | null;
  tab: CStatus | 'All';
  isDemoMode: boolean;
  onView: (item: Complaint) => void;
  onMarkInProgress: (id: string) => void;
  onResolve: (item: Complaint) => void;
  statusBadge: (s: CStatus) => React.ReactNode;
  formatComplaintDate: (value: string) => string;
  onRetry: () => void;
}

export function AdminCommunicationComplaintsTable({
  complaints,
  isLoading,
  errorMessage,
  tab,
  isDemoMode,
  onView,
  onMarkInProgress,
  onResolve,
  statusBadge,
  formatComplaintDate,
  onRetry,
}: AdminCommunicationComplaintsTableProps) {
  const t = useTranslations('ADMIN_COMMUNICATION');
  const [sortField, setSortField] = useState<ComplaintSortField | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const toggleSort = (field: ComplaintSortField) => {
    setPage(0);
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedComplaints = useMemo(() => {
    if (!sortField) return complaints;
    return [...complaints].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        const cmp = aVal.localeCompare(bVal, undefined, { numeric: true, sensitivity: 'base' });
        return sortDirection === 'asc' ? cmp : -cmp;
      }
      return 0;
    });
  }, [complaints, sortField, sortDirection]);

  const paginated = useMemo(
    () => sortedComplaints.slice(page * pageSize, (page + 1) * pageSize),
    [sortedComplaints, page, pageSize]
  );

  const renderSortableHeader = (field: ComplaintSortField, label: string, align: 'left' | 'right' | 'center' = 'left') => {
    const isActive = sortField === field;
    return (
      <th
        scope="col"
        aria-sort={isActive ? (sortDirection === 'asc' ? 'ascending' : 'descending') : undefined}
        className={`py-3 px-4 whitespace-nowrap ${align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left'}`}
      >
        <button
          type="button"
          onClick={() => toggleSort(field)}
          className={`group inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 rounded px-1 -mx-1 ${
            align === 'right' ? 'ml-auto' : align === 'center' ? 'mx-auto' : ''
          }`}
          aria-label={`${label}, sort ${isActive ? (sortDirection === 'asc' ? 'descending' : 'ascending') : 'ascending'}`}
        >
          <span>{label}</span>
          {isActive ? (
            sortDirection === 'asc' ? (
              <ArrowUp className="text-indigo-400 font-bold shrink-0" size={14} aria-hidden="true" />
            ) : (
              <ArrowDown className="text-indigo-400 font-bold shrink-0" size={14} aria-hidden="true" />
            )
          ) : (
            <ArrowUpDown className="text-slate-500 opacity-40 group-hover:opacity-100 transition-opacity shrink-0" size={14} aria-hidden="true" />
          )}
        </button>
      </th>
    );
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/60 p-8 text-slate-400">
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
          <span className="text-sm font-medium">{t('COMPLAINT_LOADING')}</span>
        </div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div role="alert" className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-8 text-center text-rose-400">
        <p className="text-sm font-semibold">{t('COMPLAINT_LOAD_ERROR_PREFIX')} {errorMessage}</p>
        <button
          type="button"
          className="mt-3 inline-flex items-center gap-1.5 rounded-xl border border-rose-500/40 bg-rose-500/20 px-4 py-2 text-xs font-semibold text-rose-200 hover:bg-rose-500/30 transition-all"
          onClick={onRetry}
        >
          <RefreshCw size={14} />
          {t('COMPLAINT_RETRY')}
        </button>
      </div>
    );
  }

  if (complaints.length === 0) {
    return (
      <AdminCommunicationEmptyState
        icon={SearchX}
        testId="admin_communication-page-state-016"
        iconTestId="admin_communication-page-state-017"
        titleTestId="admin_communication-page-state-018"
        title={tab === 'All' ? t('COMPLAINT_EMPTY_ALL') : t('COMPLAINT_EMPTY_STATUS', { status: tab === ADMIN_COMMUNICATION_COMPLAINT_STATUS.OPEN ? t('COMPLAINT_STATUS_OPEN') : tab === ADMIN_COMMUNICATION_COMPLAINT_STATUS.IN_PROGRESS ? t('COMPLAINT_STATUS_IN_PROGRESS') : t('COMPLAINT_STATUS_RESOLVED') })}
        description={t('COMPLAINT_EMPTY_DESCRIPTION')}
      />
    );
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 shadow-xl backdrop-blur-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-xs text-left">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/70 uppercase text-xs text-slate-400 font-semibold tracking-wider">
              <th className="py-3.5 px-4 text-left w-12">#</th>
              {renderSortableHeader('title', 'Ticket & Category')}
              {renderSortableHeader('branchName', 'Branch')}
              {renderSortableHeader('student', 'Student')}
              {renderSortableHeader('status', 'Status', 'center')}
              {renderSortableHeader('date', 'Logged Date')}
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-200">
            {paginated.map((c, i) => {
              const globalIndex = page * pageSize + i;
              return (
                <tr key={c.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono text-slate-500 font-medium">{globalIndex + 1}</td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm hover:text-indigo-300 transition-colors cursor-pointer" onClick={() => onView(c)}>
                        {c.title}
                      </span>
                      {c.isEscalatedToHq && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-rose-500/30 bg-rose-500/15 px-2 py-0.5 text-[10px] font-bold text-rose-400">
                          <AlertTriangle size={10} className="shrink-0" />
                          Escalated to HQ
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5 max-w-md">
                      {c.description}
                    </p>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-800/80 px-2.5 py-1 text-xs font-semibold text-slate-300">
                      <Building2 size={12} className="text-emerald-400 shrink-0" />
                      <span>{c.branchName ?? 'Downtown Central'}</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <p className="font-semibold text-white">{c.student}</p>
                    <span className="text-[11px] text-slate-400 font-mono">Member</span>
                  </td>
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    {statusBadge(c.status)}
                  </td>
                  <td className="py-3.5 px-4 text-slate-400 font-mono whitespace-nowrap">
                    {formatComplaintDate(c.date)}
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        data-testid={`admin_communication-page-control-010-${c.id}`}
                        onClick={() => onView(c)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:border-indigo-500 hover:bg-slate-700 hover:text-white transition-all"
                        title={t('VIEW_DETAILS')}
                      >
                        <Eye size={15} />
                      </button>
                      {c.status !== ADMIN_COMMUNICATION_COMPLAINT_STATUS.RESOLVED && (
                        <button
                          type="button"
                          onClick={() => onResolve(c)}
                          className="inline-flex items-center gap-1 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-400 hover:bg-emerald-500/20 transition-all"
                          title={t('BUTTON_RESOLVE')}
                        >
                          <CheckCircle2 size={13} />
                          Resolve
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="border-t border-slate-800 p-4">
        <AdminTablePagination
          page={page}
          pageSize={pageSize}
          totalItems={sortedComplaints.length}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
        />
      </div>
    </div>
  );
}

export default AdminCommunicationComplaintsTable;
