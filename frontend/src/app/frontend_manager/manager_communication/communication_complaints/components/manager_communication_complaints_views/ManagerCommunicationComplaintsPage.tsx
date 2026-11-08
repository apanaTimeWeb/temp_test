'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { ChevronRight, X, RefreshCw, CheckCircle, MessageSquarePlus, ShieldCheck, Search, Download } from 'lucide-react';
import { toast } from 'sonner';

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

  const allComplaints = useMemo(() => [...localComplaints, ...complaints], [localComplaints, complaints]);

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
      <span className="mc-badge mc-badge--danger">{tManagerUi('open')}</span>
    ) : status === 'In-Progress' ? (
      <span className="mc-badge mc-badge--warning">{tManagerUi('in_progress')}</span>
    ) : (
      <span className="mc-badge mc-badge--success">{tManagerUi('resolved')}</span>
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

  const handleExportCsv = () => {
    const headers = 'ID,Title,Student,Description,Status,Date,Resolved By\n';
    const rows = sortedComplaints
      .map(
        (c) =>
          `"${c.id}","${c.title}","${c.student || 'Anonymous'}","${c.description.replace(/"/g, '""')}","${c.status}","${c.date}","${c.resolvedBy || ''}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `complaints_${new Date().toISOString().slice(0, 10)}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
    toast.success('Complaints list exported to CSV successfully');
  };

  return (
    <div
      className="mc-page"
      data-route-view={view}
      data-route-id={id}
    >
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mc-breadcrumb">
            <span>{tManagerUi('communication')}</span>
            <ChevronRight size={12} />
            <span>{tManagerUi('complaints')}</span>
          </div>
          <h1 className="mc-page-title">{tManagerUi('complaints')}</h1>
          <p className="mc-page-subtitle">
            {tManagerUi('review_complaints_from_the_host_read_api_creating_changi_87c22f')}
          </p>
          <p className="mc-input-hint text-secondary flex items-center gap-1.5 mt-1" role="status">
            <ShieldCheck size={14} className="text-primary" />
            <span>Live Help Desk · Track, resolve and escalate student issues in real time.</span>
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="mgr-btn-primary flex items-center gap-1.5"
        >
          <MessageSquarePlus size={15} />
          <span>Lodge Complaint</span>
        </button>
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
          <div className="mc-empty" role="status">
            <RefreshCw className="motion-safe:animate-spin" size={20} />
            <p className="mc-empty__title">{tManagerUi('loading_complaints')}</p>
          </div>
        ) : isError ? (
          <div className="mc-empty" role="alert" aria-live="assertive">
            <p className="mc-empty__title">{tManagerUi('unable_to_load_complaints')}</p>
            <button type="button" className="mc-btn-ghost mt-3" onClick={() => refetch()}>
              {tManagerUi('retry')}
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
