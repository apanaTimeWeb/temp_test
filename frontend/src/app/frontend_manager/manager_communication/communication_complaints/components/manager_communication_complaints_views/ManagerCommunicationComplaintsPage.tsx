'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import {
  ChevronRight,
  X,
  RefreshCw,
  CheckCircle,
  MessageSquarePlus,
  ShieldCheck,
  Search,
  Download,
  Printer,
  AlertCircle,
  Clock,
  CheckCircle2,
  Layers,
  MessageSquare,
} from 'lucide-react';
import { toast } from 'sonner';
import { LibraryLoader, ButtonLoader } from '@/app/frontend_manager/components/ManagerLoader';

import type { ManagerCommunicationComplaintsMainProps } from '@/app/frontend_manager/manager_communication/communication_complaints/types/ManagerCommunicationComplaintsMainTypes';
import { useManagerComplaintsDialogFocus } from '@/app/frontend_manager/manager_communication/communication_complaints/hooks/ManagerCommunicationComplaintsDialogFocus';
import { useManagerCommunicationComplaints } from '@/app/frontend_manager/manager_communication/communication_complaints/hooks/useManagerCommunicationComplaintsComplaints';
import type {
  ManagerCommunicationComplaintsComplaint,
  ManagerCommunicationComplaintsComplaintStatus,
} from '@/app/frontend_manager/manager_communication/communication_complaints/types/ManagerCommunicationComplaintsTypes';
import { MANAGER_COMMUNICATION_COMPLAINT_TABS } from '@/app/frontend_manager/manager_communication/communication_complaints/constants/ManagerCommunicationComplaintsComplaintConstants';
import { ManagerCommunicationComplaintsEmptyState } from '@/app/frontend_manager/manager_communication/communication_complaints/components/manager_communication_complaints_empty_states/ManagerCommunicationComplaintsEmptyState';
import ManagerCommunicationComplaintsAddModal from '@/app/frontend_manager/manager_communication/communication_complaints/components/manager_communication_complaints_views/ManagerCommunicationComplaintsAddModal';
import { ManagerCommunicationComplaintsResolveModal } from './ManagerCommunicationComplaintsResolveModal';
import { ManagerCommunicationComplaintsToolbar } from './ManagerCommunicationComplaintsToolbar';
import {
  ManagerCommunicationComplaintsTable,
  type ComplaintSortField,
} from './ManagerCommunicationComplaintsTable';
import { ManagerCommunicationComplaintsViewModal } from './ManagerCommunicationComplaintsViewModal';

function formatKnownIsoCalendarDate(value: string, locale: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return value;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return value;
  return new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'short', day: 'numeric' }).format(date);
}

// RESPONSIBILITY: Render the communication_complaints feature while preserving supported deep-link query state.
// DATA FLOW: Route searchParams -> Main props -> this view's route context.
export default function ManagerCommunicationComplaintsPage({
  view,
  id,
  name,
  phone,
  smartId,
}: ManagerCommunicationComplaintsMainProps) {
  const tManagerUi = useTranslations('manager.manager_complaints.ui');
  const locale = useLocale();
  const { complaints, isPending, isError, refetch } = useManagerCommunicationComplaints();
  const [tab, setTab] = useState<ManagerCommunicationComplaintsComplaintStatus | 'All'>('All');
  const [viewItem, setViewItem] = useState<ManagerCommunicationComplaintsComplaint | null>(null);
  const [localComplaints, setLocalComplaints] = useState<ManagerCommunicationComplaintsComplaint[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeComplaintDialog = useCallback(() => setViewItem(null), []);
  useManagerComplaintsDialogFocus(dialogRef, closeComplaintDialog, Boolean(viewItem));
  const [expandedDesc, setExpandedDesc] = useState<string[]>([]);

  const [sortField, setSortField] = useState<ComplaintSortField | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [statusOverrides, setStatusOverrides] = useState<Record<string, ManagerCommunicationComplaintsComplaintStatus>>({});
  const [resolveModalComplaint, setResolveModalComplaint] = useState<ManagerCommunicationComplaintsComplaint | null>(null);

  const handleOpenResolveModal = useCallback((complaint: ManagerCommunicationComplaintsComplaint) => {
    setResolveModalComplaint(complaint);
  }, []);

  const handleConfirmResolve = useCallback(
    (complaintId: string, resolvedNote: string, _shouldSendWhatsApp: boolean, _openBrowserWhatsApp: boolean) => {
      setStatusOverrides((prev) => ({ ...prev, [complaintId]: 'Resolved' }));
      setLocalComplaints((prev) =>
        prev.map((c) =>
          c.id === complaintId
            ? {
                ...c,
                status: 'Resolved',
                resolvedNote,
                resolvedDate: new Date().toISOString().slice(0, 10),
                resolvedBy: 'Facility Manager',
              }
            : c
        )
      );
    },
    []
  );

  const handleStatusChange = useCallback((cid: string, newStatus: ManagerCommunicationComplaintsComplaintStatus) => {
    setStatusOverrides((prev) => ({ ...prev, [cid]: newStatus }));
    toast.success(`Complaint #${cid} marked as ${newStatus}`);
  }, []);

  const allComplaints = useMemo(() => {
    const list = [...localComplaints, ...complaints];
    return Object.keys(statusOverrides).length === 0 ? list : list.map((c) => (statusOverrides[c.id] ? { ...c, status: statusOverrides[c.id] } : c));
  }, [localComplaints, complaints, statusOverrides]);

  const stats = useMemo(() => {
    const total = allComplaints.length;
    const openCount = allComplaints.filter((c) => c.status === 'Open').length;
    const inProgressCount = allComplaints.filter((c) => c.status === 'In-Progress').length;
    const resolvedCount = allComplaints.filter((c) => c.status === 'Resolved').length;
    const resolutionRate = total > 0 ? Math.round((resolvedCount / total) * 100) : 0;
    return { total, openCount, inProgressCount, resolvedCount, resolutionRate };
  }, [allComplaints]);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const base = tab === 'All' ? allComplaints : allComplaints.filter((c) => c.status === tab);
    return base.filter((c) => {
      const matchCat =
        categoryFilter === 'all' ||
        c.title.toLowerCase().includes(categoryFilter.toLowerCase()) ||
        c.description.toLowerCase().includes(categoryFilter.toLowerCase());
      const matchQ =
        !q ||
        c.title.toLowerCase().includes(q) ||
        (c.student && c.student.toLowerCase().includes(q)) ||
        (c.seatTag && c.seatTag.toLowerCase().includes(q)) ||
        c.description.toLowerCase().includes(q) ||
        (c.resolvedBy && c.resolvedBy.toLowerCase().includes(q));
      return matchCat && matchQ;
    });
  }, [allComplaints, tab, searchQuery, categoryFilter]);

  const hasActiveFilters = Boolean(tab !== 'All' || searchQuery.trim() !== '' || categoryFilter !== 'all');

  const toggleDesc = (complaintId: string) =>
    setExpandedDesc((current) =>
      current.includes(complaintId) ? current.filter((item) => item !== complaintId) : [...current, complaintId]
    );

  const statusBadge = (status: ManagerCommunicationComplaintsComplaintStatus) =>
    status === 'Open' ? (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">
        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
        <span>{tManagerUi('open')}</span>
      </span>
    ) : status === 'In-Progress' ? (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
        <Clock size={11} className="text-amber-400" />
        <span>{tManagerUi('in_progress')}</span>
      </span>
    ) : (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
        <CheckCircle2 size={11} className="text-emerald-400" />
        <span>{tManagerUi('resolved')}</span>
      </span>
    );

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
    if (!sortField) return filtered;
    return [...filtered].sort((a, b) => {
      const aVal = String(a[sortField] ?? '');
      const bVal = String(b[sortField] ?? '');
      const cmp = aVal.localeCompare(bVal, undefined, { numeric: true, sensitivity: 'base' });
      return sortDirection === 'asc' ? cmp : -cmp;
    });
  }, [filtered, sortField, sortDirection]);

  const totalRows = sortedComplaints.length;
  const pageCount = Math.max(1, Math.ceil(totalRows / pageSize));
  const effectivePage = Math.min(page, pageCount - 1);
  const paginated = sortedComplaints.slice(effectivePage * pageSize, (effectivePage + 1) * pageSize);
  const startItem = totalRows === 0 ? 0 : effectivePage * pageSize + 1;
  const endItem = Math.min((effectivePage + 1) * pageSize, totalRows);

  const escapeCsvCell = (val: unknown) => {
    let str = String(val ?? '');
    if (/^[\u0000-\u0020]*[=+\-@]/.test(str)) str = `'${str}`;
    return `"${str.replace(/"/g, '""')}"`;
  };

  const handleExportCsv = () => {
    const headers = ['ID', 'Title', 'Student', 'Description', 'Status', 'Date', 'Resolved By'].map(escapeCsvCell).join(',');
    const rows = sortedComplaints
      .map((c) =>
        [c.id, c.title, c.student || 'Anonymous', c.description, c.status, c.date, c.resolvedBy || ''].map(escapeCsvCell).join(',')
      )
      .join('\r\n');
    const blob = new Blob([`\uFEFF${headers}\r\n${rows}`], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `complaints_${new Date().toISOString().slice(0, 10)}.csv`;
    anchor.hidden = true;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast.success('Complaints list exported to CSV successfully');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="mc-page space-y-6"
      data-route-view={view}
      data-route-id={id}
    >
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0">
              <MessageSquare size={20} />
            </span>
            <span>{tManagerUi('complaints')}</span>
          </h1>
          <p className="text-xs sm:text-sm text-secondary mt-1">
            Track, investigate, and resolve student complaints and facility maintenance requests in real-time.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            type="button"
            onClick={handlePrint}
            className="mgr-btn-outline inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold py-2 px-3.5 rounded-xl border border-border bg-card hover:bg-surface-hover text-secondary hover:text-primary transition-colors cursor-pointer"
            title="Print complaints summary"
          >
            <Printer size={14} />
            <span>Print Report</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="mgr-btn-primary inline-flex items-center gap-2 text-xs sm:text-sm font-semibold py-2 px-4 rounded-xl shadow-md cursor-pointer transition-all bg-primary text-primary-foreground hover:opacity-95"
          >
            <MessageSquarePlus size={16} />
            <span>Lodge Complaint</span>
          </button>
        </div>
      </div>

      {/* 4 KPI Metric Summary Cards (Clean Overview Metric Cards - Not Interlinked Filter Buttons) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Total Complaints */}
        <div className="mgr-card p-4 rounded-2xl border border-border flex items-center gap-3.5 shadow-xs bg-card">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center border border-indigo-500/30 shrink-0">
            <Layers size={20} />
          </div>
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-secondary block">
              Total Lodged
            </span>
            <span className="text-xl sm:text-2xl font-black text-primary">
              {stats.total}
            </span>
          </div>
        </div>

        {/* Card 2: Open / Unresolved */}
        <div className="mgr-card p-4 rounded-2xl border border-border flex items-center gap-3.5 shadow-xs bg-card">
          <div className="w-10 h-10 rounded-xl bg-rose-500/15 text-rose-400 flex items-center justify-center border border-rose-500/30 shrink-0">
            <AlertCircle size={20} />
          </div>
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-secondary block flex items-center gap-1.5">
              <span>Pending Open</span>
              {stats.openCount > 0 && <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />}
            </span>
            <span className="text-xl sm:text-2xl font-black text-rose-400">
              {stats.openCount}
            </span>
          </div>
        </div>

        {/* Card 3: In-Progress */}
        <div className="mgr-card p-4 rounded-2xl border border-border flex items-center gap-3.5 shadow-xs bg-card">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center border border-amber-500/30 shrink-0">
            <Clock size={20} />
          </div>
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-secondary block">
              In-Progress
            </span>
            <span className="text-xl sm:text-2xl font-black text-amber-400">
              {stats.inProgressCount}
            </span>
          </div>
        </div>

        {/* Card 4: Resolved */}
        <div className="mgr-card p-4 rounded-2xl border border-border flex items-center gap-3.5 shadow-xs bg-card">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center border border-emerald-500/30 shrink-0">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-secondary block">
              Resolved ({stats.resolutionRate}%)
            </span>
            <span className="text-xl sm:text-2xl font-black text-emerald-400">
              {stats.resolvedCount}
            </span>
          </div>
        </div>
      </div>

      {toastMessage && (
        <div className="mb-4 flex items-center justify-between rounded-xl bg-success-bg border border-border p-3 text-xs text-success">
          <div className="flex items-center gap-2">
            <CheckCircle size={15} />
            <span className="font-medium">{toastMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-success hover:text-primary"
          >
            <X size={14} />
          </button>
        </div>
      )}

      <ManagerCommunicationComplaintsToolbar
        tab={tab}
        setTab={setTab}
        allComplaints={allComplaints}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        hasActiveFilters={hasActiveFilters}
        onResetFilters={() => {
          setTab('All');
          setSearchQuery('');
          setCategoryFilter('all');
          setPage(0);
        }}
        onExportCsv={handleExportCsv}
        onResetPage={() => setPage(0)}
      />

      <div className="mc-card mc-card--flush">
        {isPending ? (
          <div className="mc-empty flex items-center justify-center p-8" role="status">
            <LibraryLoader size="md" icon="message-square-warning" variant="contra" />
          </div>
        ) : isError ? (
          <div className="mc-empty" role="alert" aria-live="assertive">
            <p className="mc-empty__title">{tManagerUi('unable_to_load_complaints')}</p>
            <button type="button" className="mc-btn-ghost mt-3 inline-flex items-center gap-1.5" onClick={() => refetch()} disabled={isFetching}>
              {isFetching ? <ButtonLoader icon="message-square-warning" /> : null}
              <span>{tManagerUi('retry')}</span>
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <ManagerCommunicationComplaintsEmptyState className="mc-empty">
            <p className="mc-empty__title">
              {searchQuery ? 'No complaints matching your search query.' : tManagerUi('no_complaints_in_this_view')}
            </p>
          </ManagerCommunicationComplaintsEmptyState>
        ) : (
          <ManagerCommunicationComplaintsTable
            paginated={paginated}
            totalRows={totalRows}
            startItem={startItem}
            endItem={endItem}
            effectivePage={effectivePage}
            pageCount={pageCount}
            pageSize={pageSize}
            setPageSize={setPageSize}
            setPage={setPage}
            expandedDesc={expandedDesc}
            toggleDesc={toggleDesc}
            statusBadge={statusBadge}
            formatDate={(val) => formatKnownIsoCalendarDate(val, locale)}
            onViewItem={setViewItem}
            sortField={sortField}
            sortDirection={sortDirection}
            toggleSort={toggleSort}
            onStatusChange={handleStatusChange}
            onResolveClick={handleOpenResolveModal}
          />
        )}
      </div>

      {viewItem && (
        <ManagerCommunicationComplaintsViewModal
          viewItem={viewItem}
          dialogRef={dialogRef}
          locale={locale}
          onClose={closeComplaintDialog}
          formatKnownIsoCalendarDate={formatKnownIsoCalendarDate}
          statusBadge={statusBadge}
          onResolveClick={handleOpenResolveModal}
        />
      )}

      {resolveModalComplaint && (
        <ManagerCommunicationComplaintsResolveModal
          complaint={resolveModalComplaint}
          isOpen={Boolean(resolveModalComplaint)}
          onClose={() => setResolveModalComplaint(null)}
          onConfirmResolve={handleConfirmResolve}
        />
      )}

      <ManagerCommunicationComplaintsAddModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={(newComp) => {
          setLocalComplaints((prev) => [newComp, ...prev]);
          setToastMessage(`Complaint #${newComp.id} lodged successfully.`);
          setTimeout(() => setToastMessage(null), 4000);
        }}
      />
    </div>
  );
}
