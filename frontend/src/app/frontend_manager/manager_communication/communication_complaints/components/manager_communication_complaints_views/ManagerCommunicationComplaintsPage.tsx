'use client';

import { ButtonLoader, LibraryLoader } from '@/app/frontend_manager/components/ManagerLoader';
import { ManagerCommunicationComplaintsEmptyState } from '@/app/frontend_manager/manager_communication/communication_complaints/components/manager_communication_complaints_empty_states/ManagerCommunicationComplaintsEmptyState';
import '@/app/frontend_manager/manager_communication/communication_complaints/components/manager_communication_complaints_styles/ManagerCommunicationComplaintsManager_complaints.css';
import ManagerCommunicationComplaintsAddModal from '@/app/frontend_manager/manager_communication/communication_complaints/components/manager_communication_complaints_views/ManagerCommunicationComplaintsAddModal';
import { ManagerCommunicationComplaintsKpis } from '@/app/frontend_manager/manager_communication/communication_complaints/components/manager_communication_complaints_views/ManagerCommunicationComplaintsKpis';
import { ManagerCommunicationComplaintsResolveModal } from '@/app/frontend_manager/manager_communication/communication_complaints/components/manager_communication_complaints_views/ManagerCommunicationComplaintsResolveModal';
import {
  ManagerCommunicationComplaintsTable,
  type ComplaintSortField,
} from '@/app/frontend_manager/manager_communication/communication_complaints/components/manager_communication_complaints_views/ManagerCommunicationComplaintsTable';
import { ManagerCommunicationComplaintsToolbar } from '@/app/frontend_manager/manager_communication/communication_complaints/components/manager_communication_complaints_views/ManagerCommunicationComplaintsToolbar';
import { ManagerCommunicationComplaintsViewModal } from '@/app/frontend_manager/manager_communication/communication_complaints/components/manager_communication_complaints_views/ManagerCommunicationComplaintsViewModal';
import { useManagerComplaintsDialogFocus } from '@/app/frontend_manager/manager_communication/communication_complaints/hooks/ManagerCommunicationComplaintsDialogFocus';
import { useManagerCommunicationComplaints } from '@/app/frontend_manager/manager_communication/communication_complaints/hooks/useManagerCommunicationComplaintsComplaints';
import type { ManagerCommunicationComplaintsMainProps } from '@/app/frontend_manager/manager_communication/communication_complaints/types/ManagerCommunicationComplaintsMainTypes';
import type {
  ManagerCommunicationComplaintsComplaint,
  ManagerCommunicationComplaintsComplaintStatus,
} from '@/app/frontend_manager/manager_communication/communication_complaints/types/ManagerCommunicationComplaintsTypes';
import {
  computeComplaintStats,
  exportComplaintsToCsv,
  exportComplaintsToExcel,
  filterComplaintsList,
  formatComplaintCalendarDate,
} from '@/app/frontend_manager/manager_communication/communication_complaints/utils/ManagerCommunicationComplaintsExport';
import { CheckCircle, CheckCircle2, Clock, MessageSquare, MessageSquarePlus, Printer, X } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';

// RESPONSIBILITY: Render the communication_complaints feature while preserving supported deep-link query state.
export default function ManagerCommunicationComplaintsPage({
  view,
  id,
}: ManagerCommunicationComplaintsMainProps) {
  const tManagerUi = useTranslations('manager.manager_complaints.ui');
  const locale = useLocale();
  const { complaints, isPending, isError, refetch } = useManagerCommunicationComplaints();
  const [tab, setTab] = useState<ManagerCommunicationComplaintsComplaintStatus | 'All'>('All');
  const [viewItem, setViewItem] = useState<ManagerCommunicationComplaintsComplaint | null>(null);
  const [localComplaints, setLocalComplaints] = useState<ManagerCommunicationComplaintsComplaint[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimerRef = useRef<number | null>(null);
  useEffect(() => () => { if (toastTimerRef.current !== null) window.clearTimeout(toastTimerRef.current); }, []);
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
    (complaintId: string, resolvedNote: string) => {
      setStatusOverrides((prev) => ({ ...prev, [complaintId]: 'Resolved' }));
      setLocalComplaints((prev) =>
        prev.map((c) =>
          c.id === complaintId
            ? { ...c, status: 'Resolved', resolvedNote, resolvedDate: new Date().toISOString().slice(0, 10), resolvedBy: 'Facility Manager' }
            : c
        )
      );
    },
    []
  );

  const handleStatusChange = useCallback((cid: string, newStatus: ManagerCommunicationComplaintsComplaintStatus) => {
    setStatusOverrides((prev) => ({ ...prev, [cid]: newStatus }));
    toast.success(`Complaint #${cid} marked as ${newStatus}`, { id: `manager-complaints-status-${cid}` });
  }, []);

  const allComplaints = useMemo(() => {
    const list = [...localComplaints, ...complaints];
    return Object.keys(statusOverrides).length === 0 ? list : list.map((c) => (statusOverrides[c.id] ? { ...c, status: statusOverrides[c.id] } : c));
  }, [localComplaints, complaints, statusOverrides]);

  const stats = useMemo(() => computeComplaintStats(allComplaints), [allComplaints]);

  const filtered = useMemo(
    () => filterComplaintsList(allComplaints, tab, categoryFilter, searchQuery),
    [allComplaints, tab, searchQuery, categoryFilter]
  );

  const hasActiveFilters = Boolean(tab !== 'All' || searchQuery.trim() !== '' || categoryFilter !== 'all');
  const toggleDesc = (complaintId: string) =>
    setExpandedDesc((current) => (current.includes(complaintId) ? current.filter((item) => item !== complaintId) : [...current, complaintId]));

  const statusBadge = (status: ManagerCommunicationComplaintsComplaintStatus) =>
    status === 'Open' ? (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">
        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 motion-safe:animate-pulse" />
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
      const cmp = String(a[sortField] ?? '').localeCompare(String(b[sortField] ?? ''), undefined, { numeric: true, sensitivity: 'base' });
      return sortDirection === 'asc' ? cmp : -cmp;
    });
  }, [filtered, sortField, sortDirection]);

  const totalRows = sortedComplaints.length;
  const pageCount = Math.max(1, Math.ceil(totalRows / pageSize));
  const effectivePage = Math.min(page, pageCount - 1);
  const paginated = sortedComplaints.slice(effectivePage * pageSize, (effectivePage + 1) * pageSize);
  const startItem = totalRows === 0 ? 0 : effectivePage * pageSize + 1;
  const endItem = Math.min((effectivePage + 1) * pageSize, totalRows);

  const handleExportCsv = () => {
    exportComplaintsToCsv(sortedComplaints);
    toast.success('Complaints list exported to CSV successfully', { id: 'manager-complaints-export-csv' });
  };

  const handleExportExcel = () => {
    exportComplaintsToExcel(sortedComplaints);
    toast.success('Complaints list exported to Excel successfully', { id: 'manager-complaints-export-excel' });
  };

  const handlePrint = () => window.print();

  return (
    <div className="mc-page space-y-6" data-route-view={view} data-route-id={id}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl bg-primary-subtle border border-border text-primary flex items-center justify-center shrink-0">
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
            className="mgr-btn-outline inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold py-2 px-3.5 rounded-xl border border-border bg-card hover:bg-surface-hover text-secondary hover:text-primary motion-safe:transition-colors cursor-pointer"
            title="Print complaints summary"
          >
            <Printer size={14} />
            <span>Print Report</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="mgr-btn-primary inline-flex items-center gap-2 text-xs sm:text-sm font-semibold py-2 px-4 rounded-xl shadow-md cursor-pointer motion-safe:transition-all bg-primary text-primary-foreground hover:opacity-95"
          >
            <MessageSquarePlus size={16} />
            <span>Lodge Complaint</span>
          </button>
        </div>
      </div>

      <ManagerCommunicationComplaintsKpis stats={stats} />

      {toastMessage && (
        <div className="mb-4 flex items-center justify-between rounded-xl bg-success-bg border border-border p-3 text-xs text-success">
          <div className="flex items-center gap-2">
            <CheckCircle size={15} />
            <span className="font-medium">{toastMessage}</span>
          </div>
          <button type="button" onClick={() => setToastMessage(null)} className="text-success hover:text-primary">
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
        onResetFilters={() => { setTab('All'); setSearchQuery(''); setCategoryFilter('all'); setPage(0); }}
        onExportCsv={handleExportCsv}
        onExportExcel={handleExportExcel}
        onPrint={handlePrint}
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
            <button type="button" className="mc-btn-ghost mt-3 inline-flex items-center gap-1.5" onClick={() => refetch()} disabled={isPending}>
              {isPending ? <ButtonLoader icon="message-square-warning" /> : null}
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
            formatDate={(val) => formatComplaintCalendarDate(val, locale)}
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
          formatKnownIsoCalendarDate={formatComplaintCalendarDate}
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
          if (toastTimerRef.current !== null) window.clearTimeout(toastTimerRef.current);
          toastTimerRef.current = window.setTimeout(() => { setToastMessage(null); toastTimerRef.current = null; }, 4000);
        }}
      />
    </div>
  );
}
