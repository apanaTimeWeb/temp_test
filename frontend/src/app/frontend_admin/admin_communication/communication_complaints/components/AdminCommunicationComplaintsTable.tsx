'use client';

import { ADMIN_COMMUNICATION_COMPLAINT_STATUS } from '@/app/frontend_admin/admin_communication/communication_complaints/config/admin_communication_complaints.url_config';
import type { CStatus, Complaint } from '@/app/frontend_admin/admin_communication/communication_complaints/types/AdminCommunicationComplaintsComponentTypes';
import {
  getStudentInitials,
  resolveComplaintCategory,
  resolvePriority,
} from '@/app/frontend_admin/admin_communication/communication_complaints/utils/adminCommunicationComplaintsExports';
import AdminCommunicationEmptyState from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveEmptyState';
import { AdminTablePagination } from '@/app/frontend_admin/components/ui/table/AdminTablePagination';
import {
  ArrowDown, ArrowUp, ArrowUpDown, Building2, CheckCircle2, Clock,
  Eye, MessageCircle, RefreshCw, SearchX, ShieldAlert,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';

export { resolveComplaintCategory, resolvePriority };

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
  onView,
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
    if (sortField === field) setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    else { setSortField(field); setSortDirection('asc'); }
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
      <th scope="col" aria-sort={isActive ? (sortDirection === 'asc' ? 'ascending' : 'descending') : undefined} className={`py-3.5 px-4 whitespace-nowrap text-xs font-semibold uppercase tracking-wider text-text-secondary ${align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left'}`}>
        <button
          type="button"
          onClick={() => toggleSort(field)}
          className={`group inline-flex items-center gap-1.5 hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1 -mx-1 ${align === 'right' ? 'ml-auto' : align === 'center' ? 'mx-auto' : ''}`}
          aria-label={`${label}, sort ${isActive ? (sortDirection === 'asc' ? 'descending' : 'ascending') : 'ascending'}`}
        >
          <span>{label}</span>
          {isActive ? (
            sortDirection === 'asc' ? <ArrowUp className="text-primary font-bold shrink-0" size={13} aria-hidden="true" /> : <ArrowDown className="text-primary font-bold shrink-0" size={13} aria-hidden="true" />
          ) : (
            <ArrowUpDown className="text-text-secondary opacity-50 group-hover:opacity-100 motion-safe:transition-opacity shrink-0" size={13} aria-hidden="true" />
          )}
        </button>
      </th>
    );
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-border bg-card p-8 text-text-secondary">
        <div className="flex items-center gap-3">
          <div className="h-5 w-5 motion-safe:animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span className="text-sm font-semibold">{t('COMPLAINT_LOADING')}</span>
        </div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div role="alert" className="rounded-2xl border border-danger bg-danger-bg p-8 text-center text-danger-text">
        <p className="text-sm font-semibold">{t('COMPLAINT_LOAD_ERROR_PREFIX')} {errorMessage}</p>
        <button
          type="button"
          className="mt-3 inline-flex items-center gap-1.5 rounded-xl border border-danger bg-card px-4 py-2 text-xs font-semibold text-danger-text hover:bg-surface-hover motion-safe:transition-colors"
          onClick={onRetry}
        >
          <RefreshCw size={14} aria-hidden="true" />
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
    <div className="rounded-2xl border border-border bg-card shadow-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-xs text-left">
          <thead>
            <tr className="border-b border-border bg-surface-highlight">
              <th className="py-3.5 px-4 text-left w-12 text-xs font-semibold text-text-secondary uppercase tracking-wider">#</th>
              {renderSortableHeader('title', 'Ticket & Grievance Subject')}
              {renderSortableHeader('student', 'Complainant')}
              {renderSortableHeader('branchName', 'Branch')}
              {renderSortableHeader('status', 'Status', 'center')}
              {renderSortableHeader('date', 'Logged Date')}
              <th className="py-3.5 px-4 text-right text-xs font-semibold text-text-secondary uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-text-primary">
            {paginated.map((c, i) => {
              const globalIndex = page * pageSize + i;
              const category = resolveComplaintCategory(c);
              const priority = resolvePriority(c);
              const CategoryIcon = category.icon;
              const initials = getStudentInitials(c.student);
              const cleanDigits = (c.studentPhone ?? '').replace(/\D/g, '');
              const phone = cleanDigits.length === 10 ? `91${cleanDigits}` : cleanDigits;
              const waMsg = c.status === ADMIN_COMMUNICATION_COMPLAINT_STATUS.RESOLVED
                ? `Hello ${c.student}, your library grievance (${c.id}: "${c.title}") has been marked RESOLVED by ${c.resolvedBy || 'Library Admin'}. Note: ${c.resolvedNote || 'Issue has been addressed'}.`
                : `Hello ${c.student}, regarding your library grievance (${c.id}: "${c.title}"): our administration is actively addressing this issue.`;

              return (
                <tr key={c.id} className="group hover:bg-surface-hover even:bg-surface-zebra motion-safe:transition-colors">
                  <td className="py-4 px-4 font-mono text-text-secondary font-semibold">{String(globalIndex + 1).padStart(2, '0')}</td>
                  <td className="py-4 px-4 max-w-md">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded-md border border-border-focus bg-primary-subtle text-primary">{c.id}</span>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold border ${category.badgeClass}`}>
                        <CategoryIcon size={11} className="shrink-0" aria-hidden="true" />
                        <span>{category.label}</span>
                      </span>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] border ${priority.badgeClass}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${priority.dotClass}`} />
                        <span>{priority.label}</span>
                      </span>
                      {c.isEscalatedToHq && (
                        <span className="inline-flex items-center gap-1 rounded-md border border-danger bg-danger-bg px-2 py-0.5 text-[10px] font-bold text-danger-text motion-safe:animate-pulse">
                          <ShieldAlert size={11} className="shrink-0 text-danger-text" aria-hidden="true" />
                          HQ Escalated
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => onView(c)}
                      className="text-left font-bold text-sm text-text-primary hover:text-primary motion-safe:transition-colors cursor-pointer group-hover:underline block truncate max-w-md"
                      title={c.title}
                    >
                      {c.title}
                    </button>
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-[11px] font-bold text-on-primary shadow-card shrink-0">
                        {initials}
                      </div>
                      <div>
                        <p className="font-bold text-xs text-text-primary leading-tight">{c.student}</p>
                        <div className="flex items-center gap-1 text-[11px] text-text-secondary mt-0.5">
                          {c.seatNumber ? <span className="font-mono text-primary font-medium">{c.seatNumber}</span> : <span>Registered Member</span>}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface-highlight px-2.5 py-1 text-xs font-semibold text-text-primary shadow-card">
                      <Building2 size={13} className="text-primary shrink-0" aria-hidden="true" />
                      <span>{c.branchName ?? 'Downtown Central'}</span>
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center whitespace-nowrap">{statusBadge(c.status)}</td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="font-mono text-xs text-text-primary font-semibold">{formatComplaintDate(c.date)}</div>
                    <div className="text-[10px] text-text-secondary flex items-center gap-1 mt-0.5">
                      <Clock size={10} className="text-text-secondary" aria-hidden="true" />
                      <span>Logged in library</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      {c.studentPhone && (
                        <a
                          href={phone ? `https://wa.me/${phone}?text=${encodeURIComponent(waMsg)}` : `https://wa.me/?text=${encodeURIComponent(waMsg)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-success bg-success-bg text-success-text hover:opacity-90 motion-safe:transition-opacity shadow-card"
                          title={`Send WhatsApp update to ${c.student} (${c.studentPhone})`}
                          aria-label={`Send WhatsApp update to ${c.student}`}
                        >
                          <MessageCircle size={14} aria-hidden="true" />
                        </a>
                      )}
                      <button
                        type="button"
                        data-testid={`admin_communication-page-control-010-${c.id}`}
                        onClick={() => onView(c)}
                        className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 text-xs font-semibold text-text-primary hover:border-border-focus hover:bg-primary-subtle hover:text-primary motion-safe:transition-colors shadow-card"
                        title={t('VIEW_DETAILS')}
                      >
                        <Eye size={14} className="text-primary" aria-hidden="true" />
                        <span>View</span>
                      </button>
                      {c.status !== ADMIN_COMMUNICATION_COMPLAINT_STATUS.RESOLVED && (
                        <button
                          type="button"
                          onClick={() => onResolve(c)}
                          className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-success bg-success-bg px-2.5 text-xs font-semibold text-success-text hover:opacity-90 motion-safe:transition-opacity shadow-card"
                          title={t('BUTTON_MARK_RESOLVED')}
                        >
                          <CheckCircle2 size={13} aria-hidden="true" />
                          <span>Resolve</span>
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
      <div className="border-t border-border p-4 bg-surface-highlight">
        <AdminTablePagination page={page} pageSize={pageSize} totalRows={sortedComplaints.length} onPageChange={setPage} onPageSizeChange={setPageSize} />
      </div>
    </div>
  );
}

export default AdminCommunicationComplaintsTable;
