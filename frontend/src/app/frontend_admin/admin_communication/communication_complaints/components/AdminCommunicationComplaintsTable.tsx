'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import {
  Eye,
  RefreshCw,
  SearchX,
  Building2,
  AlertTriangle,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  MessageSquare,
  CheckCircle2,
  Snowflake,
  Wifi,
  KeyRound,
  Zap,
  Volume2,
  Tag,
  ShieldAlert,
  Clock,
  Sparkles,
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

export function resolveComplaintCategory(c: Complaint): {
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  badgeClass: string;
} {
  const text = `${c.category ?? ''} ${c.title} ${c.description}`.toLowerCase();
  if (text.includes('ac ') || text.includes('cooling') || text.includes('temperature') || text.includes('cassette')) {
    return {
      label: 'HVAC & Cooling',
      icon: Snowflake,
      badgeClass: 'text-sky-400 border-sky-500/30 bg-sky-500/10',
    };
  }
  if (text.includes('wi-fi') || text.includes('wifi') || text.includes('internet') || text.includes('ping') || text.includes('fiber')) {
    return {
      label: 'Network & Wi-Fi',
      icon: Wifi,
      badgeClass: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
    };
  }
  if (text.includes('locker') || text.includes('key') || text.includes('lock') || text.includes('cylinder')) {
    return {
      label: 'Facility & Lockers',
      icon: KeyRound,
      badgeClass: 'text-purple-400 border-purple-500/30 bg-purple-500/10',
    };
  }
  if (text.includes('light') || text.includes('led') || text.includes('power') || text.includes('socket') || text.includes('ups')) {
    return {
      label: 'Electrical & Power',
      icon: Zap,
      badgeClass: 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10',
    };
  }
  if (text.includes('whisper') || text.includes('noise') || text.includes('silent') || text.includes('talking')) {
    return {
      label: 'Discipline & Quiet',
      icon: Volume2,
      badgeClass: 'text-rose-400 border-rose-500/30 bg-rose-500/10',
    };
  }
  return {
    label: c.category || 'General Grievance',
    icon: Tag,
    badgeClass: 'text-indigo-400 border-indigo-500/30 bg-indigo-500/10',
  };
}

export function resolvePriority(c: Complaint): {
  label: string;
  badgeClass: string;
  dotClass: string;
} {
  const p = c.priority || (c.isEscalatedToHq ? 'URGENT' : c.status === 'Open' ? 'HIGH' : 'MEDIUM');
  if (p === 'URGENT') {
    return {
      label: 'Urgent',
      badgeClass: 'border-rose-500/40 bg-rose-500/15 text-rose-300 font-bold',
      dotClass: 'bg-rose-400 animate-pulse',
    };
  }
  if (p === 'HIGH') {
    return {
      label: 'High Priority',
      badgeClass: 'border-amber-500/40 bg-amber-500/15 text-amber-300 font-semibold',
      dotClass: 'bg-amber-400',
    };
  }
  if (p === 'MEDIUM') {
    return {
      label: 'Medium',
      badgeClass: 'border-sky-500/40 bg-sky-500/15 text-sky-300',
      dotClass: 'bg-sky-400',
    };
  }
  return {
    label: 'Standard',
    badgeClass: 'border-slate-700 bg-slate-800 text-slate-300',
    dotClass: 'bg-slate-400',
  };
}

function getStudentInitials(name: string): string {
  if (!name || name === '—') return 'ST';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

const AVATAR_GRADIENTS = [
  'from-indigo-500 to-purple-600',
  'from-cyan-500 to-blue-600',
  'from-emerald-500 to-teal-600',
  'from-amber-500 to-orange-600',
  'from-rose-500 to-pink-600',
];

function getAvatarGradient(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash += name.charCodeAt(i);
  return AVATAR_GRADIENTS[Math.abs(hash) % AVATAR_GRADIENTS.length];
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
        className={`py-3.5 px-4 whitespace-nowrap text-xs font-semibold uppercase tracking-wider text-muted-foreground ${
          align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left'
        }`}
      >
        <button
          type="button"
          onClick={() => toggleSort(field)}
          className={`group inline-flex items-center gap-1.5 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1 -mx-1 ${
            align === 'right' ? 'ml-auto' : align === 'center' ? 'mx-auto' : ''
          }`}
          aria-label={`${label}, sort ${isActive ? (sortDirection === 'asc' ? 'descending' : 'ascending') : 'ascending'}`}
        >
          <span>{label}</span>
          {isActive ? (
            sortDirection === 'asc' ? (
              <ArrowUp className="text-primary font-bold shrink-0" size={13} aria-hidden="true" />
            ) : (
              <ArrowDown className="text-primary font-bold shrink-0" size={13} aria-hidden="true" />
            )
          ) : (
            <ArrowUpDown className="text-muted-foreground/40 opacity-50 group-hover:opacity-100 transition-opacity shrink-0" size={13} aria-hidden="true" />
          )}
        </button>
      </th>
    );
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-border bg-card p-8 text-muted-foreground">
        <div className="flex items-center gap-3">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span className="text-sm font-semibold">{t('COMPLAINT_LOADING')}</span>
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
    <div className="rounded-2xl border border-border bg-card shadow-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-xs text-left">
          <thead>
            <tr className="border-b border-border bg-surface-muted/80 backdrop-blur-sm">
              <th className="py-3.5 px-4 text-left w-12 text-xs font-semibold text-muted-foreground uppercase tracking-wider">#</th>
              {renderSortableHeader('title', 'Ticket & Grievance Subject')}
              {renderSortableHeader('student', 'Complainant')}
              {renderSortableHeader('branchName', 'Branch')}
              {renderSortableHeader('status', 'Status', 'center')}
              {renderSortableHeader('date', 'Logged Date')}
              <th className="py-3.5 px-4 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60 text-foreground">
            {paginated.map((c, i) => {
              const globalIndex = page * pageSize + i;
              const category = resolveComplaintCategory(c);
              const priority = resolvePriority(c);
              const CategoryIcon = category.icon;
              const initials = getStudentInitials(c.student);
              const gradient = getAvatarGradient(c.student);

              return (
                <tr
                  key={c.id}
                  className="group hover:bg-card-hover/80 transition-colors"
                >
                  {/* Row Index */}
                  <td className="py-4 px-4 font-mono text-muted-foreground font-semibold">
                    {String(globalIndex + 1).padStart(2, '0')}
                  </td>

                  {/* Ticket Code, Category & Subject Title (First View: Important Details Only) */}
                  <td className="py-4 px-4 max-w-md">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      {/* Ticket Number Chip */}
                      <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded-md border border-primary/20 bg-primary/10 text-primary">
                        {c.id}
                      </span>

                      {/* Category Badge */}
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold border ${category.badgeClass}`}>
                        <CategoryIcon size={11} className="shrink-0" />
                        <span>{category.label}</span>
                      </span>

                      {/* Priority Tag */}
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] border ${priority.badgeClass}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${priority.dotClass}`} />
                        <span>{priority.label}</span>
                      </span>

                      {/* HQ Escalation Beacon */}
                      {c.isEscalatedToHq && (
                        <span className="inline-flex items-center gap-1 rounded-md border border-rose-500/40 bg-rose-500/20 px-2 py-0.5 text-[10px] font-bold text-rose-300 animate-pulse">
                          <ShieldAlert size={11} className="shrink-0 text-rose-400" />
                          HQ Escalated
                        </span>
                      )}
                    </div>

                    {/* Complaint Title (Clickable to view dossier) */}
                    <button
                      type="button"
                      onClick={() => onView(c)}
                      className="text-left font-bold text-sm text-foreground hover:text-primary transition-colors cursor-pointer group-hover:underline block truncate max-w-md"
                      title={c.title}
                    >
                      {c.title}
                    </button>
                  </td>

                  {/* Student / Complainant Profile */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-2.5">
                      <div className={`h-8 w-8 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-[11px] font-bold text-white shadow-xs shrink-0`}>
                        {initials}
                      </div>
                      <div>
                        <p className="font-bold text-xs text-foreground leading-tight">
                          {c.student}
                        </p>
                        <div className="flex items-center gap-1 text-[11px] text-muted-foreground mt-0.5">
                          {c.seatNumber ? (
                            <span className="font-mono text-primary font-medium">{c.seatNumber}</span>
                          ) : (
                            <span>Registered Member</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Branch Location */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-2.5 py-1 text-xs font-semibold text-foreground shadow-xs">
                      <Building2 size={13} className="text-primary shrink-0" />
                      <span>{c.branchName ?? 'Downtown Central'}</span>
                    </span>
                  </td>

                  {/* Status Indicator */}
                  <td className="py-4 px-4 text-center whitespace-nowrap">
                    {statusBadge(c.status)}
                  </td>

                  {/* Logged Date */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="font-mono text-xs text-foreground font-semibold">
                      {formatComplaintDate(c.date)}
                    </div>
                    <div className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                      <Clock size={10} className="text-muted-foreground/70" />
                      <span>Logged in library</span>
                    </div>
                  </td>

                  {/* Actions (Icon Trigger to inspect full details) */}
                  <td className="py-4 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* View Dossier Trigger */}
                      <button
                        type="button"
                        data-testid={`admin_communication-page-control-010-${c.id}`}
                        onClick={() => onView(c)}
                        className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border bg-surface px-2.5 text-xs font-semibold text-foreground hover:border-primary hover:bg-primary/10 hover:text-primary transition-all shadow-xs"
                        title={t('VIEW_DETAILS')}
                      >
                        <Eye size={14} className="text-primary" />
                        <span>View</span>
                      </button>

                      {/* Quick Resolve Button */}
                      {c.status !== ADMIN_COMMUNICATION_COMPLAINT_STATUS.RESOLVED && (
                        <button
                          type="button"
                          onClick={() => onResolve(c)}
                          className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 text-xs font-semibold text-emerald-400 hover:bg-emerald-500/25 hover:border-emerald-500/50 transition-all shadow-xs"
                          title={t('BUTTON_MARK_RESOLVED')}
                        >
                          <CheckCircle2 size={13} />
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

      <div className="border-t border-border p-4 bg-surface/40">
        <AdminTablePagination
          page={page}
          pageSize={pageSize}
          totalRows={sortedComplaints.length}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
        />
      </div>
    </div>
  );
}

export default AdminCommunicationComplaintsTable;
