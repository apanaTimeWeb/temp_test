'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Eye, RefreshCw, CheckCircle, SearchX, Building2, AlertTriangle, ArrowUpDown, ArrowUp, ArrowDown, MessageSquare } from 'lucide-react';
import { ADMIN_COMMUNICATION_COMPLAINT_STATUS } from '@/app/frontend_admin/admin_communication/communication_complaints/config/admin_communication_complaints.url_config';
import AdminCommunicationEmptyState from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveEmptyState';
import { AdminTablePagination } from '@/app/frontend_admin/components/ui/table/AdminTablePagination';
import type { CStatus, Complaint } from '@/app/frontend_admin/admin_communication/communication_complaints/types/AdminCommunicationComplaintsComponentTypes';

type ComplaintSortField = 'title' | 'branchName' | 'student' | 'status' | 'date' | 'resolvedBy' | 'resolvedDate';

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
  const [expandedDesc, setExpandedDesc] = useState<string[]>([]);

  const toggleSort = (field: ComplaintSortField) => {
    setPage(0);
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const toggleDesc = (id: string) =>
    setExpandedDesc((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

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

  const renderSortableHeader = (field: ComplaintSortField, label: string, align: 'left' | 'right' = 'left') => {
    const isActive = sortField === field;
    return (
      <th
        scope="col"
        aria-sort={isActive ? (sortDirection === 'asc' ? 'ascending' : 'descending') : undefined}
        className={`py-3 px-4 whitespace-nowrap ${align === 'right' ? 'text-right' : 'text-left'}`}
      >
        <button
          type="button"
          onClick={() => toggleSort(field)}
          className={`group inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-text-secondary hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1 -mx-1 ${
            align === 'right' ? 'ml-auto' : ''
          }`}
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

  if (isLoading) {
    return <p role="status" aria-live="polite" className="p-8 text-center text-text-secondary">{t('COMPLAINT_LOADING')}</p>;
  }

  if (errorMessage) {
    return (
      <div role="alert" className="p-8 text-center text-danger-text">
        <p>{t('COMPLAINT_LOAD_ERROR_PREFIX')} {errorMessage}</p>
        <button
          type="button"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-ui font-medium text-text-primary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 motion-safe:transition-colors motion-safe:duration-base mt-3"
          onClick={onRetry}
        >
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
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-body text-left">
        <thead>
          <tr className="h-12 bg-surface-highlight uppercase text-xs text-text-secondary font-semibold border-b border-border">
            <th className="py-3 px-4 text-left">{t('TABLE_NUMBER')}</th>
            {renderSortableHeader('title', t('TABLE_TITLE'))}
            {renderSortableHeader('branchName', 'Branch')}
            {renderSortableHeader('student', t('TABLE_STUDENT'))}
            <th className="py-3 px-4 text-left">{t('TABLE_DESCRIPTION')}</th>
            {renderSortableHeader('status', t('TABLE_STATUS'))}
            {renderSortableHeader('date', t('TABLE_DATE'))}
            {renderSortableHeader('resolvedBy', t('TABLE_RESOLVED_BY'))}
            {renderSortableHeader('resolvedDate', t('TABLE_RESOLVED_DATE'))}
            <th className="py-3 px-4 text-right">{t('TABLE_ACTIONS')}</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map((c, i) => {
            const isExpanded = expandedDesc.includes(c.id);
            const isLong = c.description.length > 60;
            const globalIndex = page * pageSize + i;
            return (
              <tr key={c.id} className="h-12 border-b border-border text-text-primary motion-safe:transition-colors hover:bg-surface-hover even:bg-surface-zebra">
                <td className="py-3 px-4 font-mono text-ui text-text-secondary">{globalIndex + 1}</td>
                <td className="py-3 px-4">
                  <div className="font-semibold text-text-primary">{c.title}</div>
                  {c.isEscalatedToHq && (
                    <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-danger-bg text-danger-text px-2 py-0.5 text-[10px] font-bold border border-border">
                      <AlertTriangle size={10} className="shrink-0" />
                      Escalated to HQ
                    </span>
                  )}
                </td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center gap-1 rounded-md border border-border bg-surface-highlight px-2 py-0.5 text-xs font-medium text-text-primary whitespace-nowrap">
                    <Building2 size={12} className="text-primary shrink-0" />
                    <span>{c.branchName ?? 'Downtown Central'}</span>
                  </span>
                </td>
                <td className="py-3 px-4 text-text-secondary">{c.student}</td>
                <td className="py-3 px-4">
                  <span id={`admin-communication-complaint-description-${c.id}`}>{isLong && !isExpanded ? c.description.slice(0, 60) + '…' : c.description}</span>
                  {isLong && (
                    <button
                      type="button"
                      aria-expanded={isExpanded}
                      aria-controls={`admin-communication-complaint-description-${c.id}`}
                      data-testid="admin_communication-page-control-019"
                      onClick={() => toggleDesc(c.id)}
                      className="inline-flex min-h-11 items-center rounded-md px-1.5 text-ui text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ml-1"
                    >
                      {isExpanded ? t('BUTTON_LESS') : t('BUTTON_MORE')}
                    </button>
                  )}
                </td>
                <td className="py-3 px-4">{statusBadge(c.status)}</td>
                <td className="py-3 px-4 text-text-secondary">{formatComplaintDate(c.date)}</td>
                <td className="py-3 px-4 text-text-secondary">{c.resolvedBy}</td>
                <td className="py-3 px-4 text-text-secondary">{formatComplaintDate(c.resolvedDate)}</td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        const msg = encodeURIComponent(`Hello ${c.student}, regarding your ticket "${c.title}" at Smart Library: We are contacting you to assist with your complaint.`);
                        window.open(`https://wa.me/?text=${msg}`, '_blank', 'noopener,noreferrer');
                      }}
                      className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border border-transparent text-success-text hover:bg-success-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary motion-safe:transition-colors motion-safe:duration-base"
                      title="WhatsApp student"
                      aria-label={`WhatsApp ${c.student} regarding ${c.title}`}
                    >
                      <MessageSquare size={18} strokeWidth={2}/>
                    </button>
                    <button
                      data-testid={`admin_communication-complaint-view-${c.id}`}
                      onClick={() => onView(c)}
                      className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border border-transparent text-text-secondary hover:bg-surface-hover hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 motion-safe:transition-colors motion-safe:duration-base"
                      title={t('COMPLAINT_VIEW_ACTION')}
                      aria-label={t('COMPLAINT_VIEW_ARIA', { title: c.title })}
                    >
                      <Eye size={18} strokeWidth={2}/>
                    </button>
                    {c.status === 'Open' && (
                      <button
                        data-testid={`admin_communication-complaint-progress-${c.id}`}
                        disabled={!isDemoMode}
                        title={!isDemoMode ? t('COMPLAINT_STATUS_UPDATE_BLOCKED') : t('COMPLAINT_STATUS_IN_PROGRESS')}
                        onClick={() => onMarkInProgress(c.id)}
                        className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border border-transparent text-text-secondary hover:bg-surface-hover hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary motion-safe:transition-colors motion-safe:duration-base disabled:cursor-not-allowed disabled:opacity-50"
                        aria-label={t('COMPLAINT_MARK_IN_PROGRESS_ARIA', { title: c.title })}
                      >
                        <RefreshCw size={18} strokeWidth={2}/>
                      </button>
                    )}
                    {c.status !== 'Resolved' && (
                      <button
                        data-testid={`admin_communication-complaint-resolve-${c.id}`}
                        disabled={!isDemoMode}
                        title={!isDemoMode ? t('COMPLAINT_RESOLUTION_BLOCKED') : t('COMPLAINT_RESOLVE_TITLE')}
                        onClick={() => onResolve(c)}
                        className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border border-transparent text-text-secondary hover:bg-surface-hover hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary motion-safe:transition-colors motion-safe:duration-base disabled:cursor-not-allowed disabled:opacity-50"
                        aria-label={t('COMPLAINT_RESOLVE_ARIA', { title: c.title })}
                      >
                        <CheckCircle size={18} strokeWidth={2}/>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {complaints.length > 0 && (
        <AdminTablePagination
          page={page}
          pageSize={pageSize}
          totalCount={complaints.length}
          onPageChange={setPage}
          onPageSizeChange={(newSize: number) => {
            setPageSize(newSize);
            setPage(0);
          }}
        />
      )}
    </div>
  );
}

export default AdminCommunicationComplaintsTable;
