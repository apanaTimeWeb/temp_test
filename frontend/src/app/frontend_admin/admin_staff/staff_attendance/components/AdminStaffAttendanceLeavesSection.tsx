'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import {
  Check,
  X,
  UserX,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import type {
  StaffLeaveRequest,
} from '@/app/frontend_admin/admin_staff/staff_attendance/schemas/AdminStaffAttendanceSchema';
import { AdminTablePagination } from '@/app/frontend_admin/components/ui/table/AdminTablePagination';

interface LeavesProps {
  leaveRequests: StaffLeaveRequest[];
  onAction: (leaveId: string, action: 'APPROVE' | 'REJECT') => void;
}

type LeaveSortField = 'staffName' | 'branchName' | 'leaveType' | 'daysCount' | 'status';

export function AdminStaffAttendanceLeavesSection({ leaveRequests, onAction }: LeavesProps) {
  const t = useTranslations('ADMIN_STAFF_ATTENDANCE');
  const [sortField, setSortField] = useState<LeaveSortField | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const toggleSort = (field: LeaveSortField) => {
    setPage(0);
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedRequests = useMemo(() => {
    if (!sortField) return leaveRequests;
    return [...leaveRequests].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        const cmp = aVal.localeCompare(bVal, undefined, { numeric: true, sensitivity: 'base' });
        return sortDirection === 'asc' ? cmp : -cmp;
      }
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        const diff = aVal - bVal;
        return sortDirection === 'asc' ? diff : -diff;
      }
      return 0;
    });
  }, [leaveRequests, sortField, sortDirection]);

  const paginatedRequests = useMemo(
    () => sortedRequests.slice(page * pageSize, (page + 1) * pageSize),
    [sortedRequests, page, pageSize]
  );

  const renderSortableHeader = (field: LeaveSortField, label: string) => {
    const isActive = sortField === field;
    return (
      <th scope="col" aria-sort={isActive ? (sortDirection === 'asc' ? 'ascending' : 'descending') : undefined} className="px-4 py-3 whitespace-nowrap">
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

  if (leaveRequests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card p-12 text-center">
        <UserX className="h-10 w-10 text-text-disabled" />
        <h3 className="mt-3 text-base font-semibold text-text-primary">{t('NO_LEAVES_TITLE')}</h3>
        <p className="mt-1 text-sm text-text-secondary">{t('NO_LEAVES_DESC')}</p>
      </div>
    );
  }

  const badgeStyles = {
    CASUAL: 'bg-info-bg text-info-text border-border',
    SICK: 'bg-warning-bg text-warning-text border-border',
    VACATION: 'bg-primary-subtle text-primary border-border',
    UNPAID: 'bg-muted text-text-secondary border-border',
  };

  const statusStyles = {
    PENDING: 'bg-warning-bg text-warning-text border-border',
    APPROVED: 'bg-success-bg text-success-text border-border',
    REJECTED: 'bg-destructive-bg text-destructive border-border',
  };

  return (
    <div className="space-y-4">
      {/* Mobile Card View */}
      <div className="space-y-3 md:hidden">
        {paginatedRequests.map((req) => (
          <article key={req.id} className="rounded-xl border border-border bg-card p-4 shadow-sm space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h4 className="font-semibold text-text-primary">{req.staffName}</h4>
                <p className="text-xs text-text-secondary">{req.role} · {req.branchName}</p>
              </div>
              <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold border ${statusStyles[req.status]}`}>
                {req.status}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className={`rounded px-2 py-0.5 font-medium border ${badgeStyles[req.leaveType]}`}>
                {req.leaveType}
              </span>
              <span className="text-text-secondary">
                {req.startDate} to {req.endDate} ({req.daysCount} days)
              </span>
            </div>

            <p className="text-xs text-text-secondary bg-surface p-2 rounded-md border border-border">
              "{req.reason}"
            </p>

            {req.status === 'PENDING' && (
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => onAction(req.id, 'APPROVE')}
                  className="flex-1 inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg bg-primary px-3 text-xs font-semibold text-on-primary hover:bg-primary-hover transition-colors"
                >
                  <Check size={14} />
                  {t('ACTION_APPROVE_LEAVE')}
                </button>
                <button
                  type="button"
                  onClick={() => onAction(req.id, 'REJECT')}
                  className="flex-1 inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg border border-destructive-bg bg-destructive-bg px-3 text-xs font-semibold text-destructive hover:opacity-90 transition-colors"
                >
                  <X size={14} />
                  {t('ACTION_REJECT_LEAVE')}
                </button>
              </div>
            )}
          </article>
        ))}
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-surface text-xs font-semibold uppercase text-text-secondary">
            <tr>
              {renderSortableHeader('staffName', t('COL_STAFF'))}
              {renderSortableHeader('branchName', t('COL_BRANCH'))}
              {renderSortableHeader('leaveType', t('COL_LEAVE_TYPE'))}
              {renderSortableHeader('daysCount', t('COL_DURATION'))}
              <th scope="col" className="px-4 py-3">{t('COL_REASON')}</th>
              {renderSortableHeader('status', t('COL_STATUS'))}
              <th scope="col" className="px-4 py-3 text-right">{t('COL_ACTIONS')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paginatedRequests.map((req) => (
              <tr key={req.id} className="hover:bg-surface-hover transition-colors">
                <td className="px-4 py-3 font-medium text-text-primary">
                  <div>{req.staffName}</div>
                  <div className="text-xs text-text-secondary">{req.role}</div>
                </td>
                <td className="px-4 py-3 text-text-secondary">{req.branchName}</td>
                <td className="px-4 py-3">
                  <span className={`inline-block rounded px-2 py-0.5 text-xs font-medium border ${badgeStyles[req.leaveType]}`}>
                    {req.leaveType}
                  </span>
                </td>
                <td className="px-4 py-3 text-text-secondary text-xs">
                  <div>{req.startDate} to {req.endDate}</div>
                  <div className="font-semibold text-text-primary">{req.daysCount} days</div>
                </td>
                <td className="px-4 py-3 text-xs text-text-secondary max-w-xs truncate" title={req.reason}>
                  {req.reason}
                </td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold border ${statusStyles[req.status]}`}>
                    {req.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  {req.status === 'PENDING' ? (
                    <div className="flex justify-end items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => onAction(req.id, 'APPROVE')}
                        className="inline-flex min-h-8 items-center gap-1 rounded-md bg-primary px-2.5 text-xs font-semibold text-on-primary hover:bg-primary-hover transition-colors"
                      >
                        <Check size={13} />
                        {t('ACTION_APPROVE_LEAVE')}
                      </button>
                      <button
                        type="button"
                        onClick={() => onAction(req.id, 'REJECT')}
                        className="inline-flex min-h-8 items-center gap-1 rounded-md border border-destructive-bg bg-destructive-bg px-2 text-xs font-semibold text-destructive hover:opacity-90 transition-colors"
                      >
                        <X size={13} />
                        {t('ACTION_REJECT_LEAVE')}
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-text-disabled">Decided</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AdminTablePagination
        page={page}
        pageSize={pageSize}
        totalRows={leaveRequests.length}
        onPageChange={setPage}
        onPageSizeChange={(newPageSize) => {
          setPageSize(newPageSize);
          setPage(0);
        }}
      />
    </div>
  );
}

export default AdminStaffAttendanceLeavesSection;
