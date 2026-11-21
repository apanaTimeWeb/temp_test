'use client';

import { useSuperadminCommunicationNoticesConfirm } from '@/app/frontend_superadmin/superadmin_communication/communication_notices/hooks/useSuperadminCommunicationNoticesConfirm';
import { toast } from 'sonner';
/** Responsibility: Superadmin Communication Notices Page Client; keep this view focused on its named module UI responsibility and delegate domain/state logic to module-owned hooks. */
/** Data-Flow: canonical route -> SuperadminCommunicationNoticesPageClient -> leaf-owned query/API boundary -> runtime schema validation -> rendered success/loading/error states. */
import SuperadminCommunicationNoticesSemanticTable from '@/app/frontend_superadmin/superadmin_communication/communication_notices/components/SuperadminCommunicationNoticesSemanticTable';

import { useSuperadminCommunicationNoticesValidationMessage } from '@/app/frontend_superadmin/superadmin_communication/communication_notices/hooks/useSuperadminCommunicationNoticesValidationMessage';
import type { SemanticCellParams } from '@/app/frontend_superadmin/superadmin_communication/communication_notices/components/SuperadminCommunicationNoticesSemanticTable';
type ICellRendererParams = SemanticCellParams<Notice>;
import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SuperadminCommunicationNoticeSchema, type SuperadminCommunicationNoticeFormValues } from '@/app/frontend_superadmin/superadmin_communication/communication_notices/schemas/SuperadminCommunicationNoticesNoticeSchema';
import { useSuperadminCommunicationNoticesQuery } from '@/app/frontend_superadmin/superadmin_communication/communication_notices/hooks/useSuperadminCommunicationNoticesQueries';
import type { SuperadminCommunicationNotice as Notice } from '@/app/frontend_superadmin/superadmin_communication/communication_notices/types/SuperadminCommunicationNoticesTypes';
import { SUPERADMIN_COMMUNICATION_NOTICES_QUERY_KEYS } from '@/app/frontend_superadmin/superadmin_communication/communication_notices/api/superadmin_communication_notices.query_keys';
import { useQueryClient } from '@tanstack/react-query';
import {
  Plus,
  X,
  Edit2,
  Trash2,
  Send,
  Download,
  Printer,
  RotateCcw,
  Search,
  Bell,
  CheckCircle2,
  Clock,
  Radio,
  FileSpreadsheet,
  AlertCircle
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useSuperadminCommunicationNoticesUnsavedChangesGuard } from '@/app/frontend_superadmin/superadmin_communication/communication_notices/hooks/useSuperadminCommunicationNoticesUnsavedChangesGuard';

const today = new Date().toISOString().split('T')[0];

/** Derives a stable, non-index row identity for repeated interactive table controls. */
function getSuperadminInteractiveTestIdSuffix(value: unknown): string {
  const record = value && typeof value === 'object' ? (value as Record<string, unknown>) : {};
  for (const field of ['id', 'uuid', 'recordId', 'userId', 'assetId', 'libraryId', 'planId', 'subscriptionId', 'transactionId', 'invoiceId', 'refundId', 'requestId', 'ruleId', 'messageId', 'noticeId', 'complaintId', 'entryId', 'backupId', 'enquiryId', 'studentId', 'memberId', 'branchId', 'scheduleId', 'logId', 'smartId', 'receiptNumber', 'ticketId', 'lockerId', 'seatNo', 'code', 'slug', 'key', 'name']) {
    const candidate = record[field];
    if (typeof candidate === 'string' || typeof candidate === 'number') return String(candidate);
  }
  return 'missing-domain-id';
}

/**
 * Renders the `superadmin_communication` view owned by `SuperadminCommunicationNoticesPageClient`.
 * Owns local UI state for `showAdd`, `editItem`, `deleteItem`, `broadcastItem` and related form/selection state.
 * Reads module-owned query state and must keep loading, error, empty, and retry behavior distinct where the query exposes those states.
 * Dirty form state is guarded before destructive or route-leaving actions.
 */
export default function SuperadminCommunicationNoticesPageClient({ id }: { id?: string } = {}) {
  const confirm = useSuperadminCommunicationNoticesConfirm();
  const tCopy = useTranslations('SUPERADMIN_COMMUNICATION');
  const translateValidationMessage = useSuperadminCommunicationNoticesValidationMessage();
  const queryClient = useQueryClient();
  const noticesQuery = useSuperadminCommunicationNoticesQuery();
  const notices = noticesQuery.data ?? [];

  const [showAdd, setShowAdd] = useState(false);
  const [editItem, setEditItem] = useState<Notice | null>(null);
  const [deleteItem, setDeleteItem] = useState<Notice | null>(null);
  const [broadcastItem, setBroadcastItem] = useState<Notice | null>(null);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Expired'>('All');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<SuperadminCommunicationNoticeFormValues>({
    resolver: zodResolver(SuperadminCommunicationNoticeSchema),
    defaultValues: { title: '', message: '', validTill: '' },
  });

  useSuperadminCommunicationNoticesUnsavedChangesGuard(isDirty, tCopy('COPY.UNSAVED_CHANGES_WARNING'));

  const requestCloseAdd = async () => {
    if (isDirty && !(await confirm(tCopy('COPY.UNSAVED_CHANGES_WARNING')))) return;
    reset({ title: '', message: '', validTill: '' });
    setEditItem(null);
    setShowAdd(false);
  };

  const showToast = (msg: string) => {
    toast.message(msg, { id: 'superadmin:superadmin_communication:SuperadminCommunicationNoticesPageClient:feedback' });
  };

  const openAdd = () => {
    reset({ title: '', message: '', validTill: '' });
    setEditItem(null);
    setShowAdd(true);
  };

  const openEdit = (n: Notice) => {
    reset({ title: n.title, message: n.message, validTill: n.validTill });
    setEditItem(n);
    setShowAdd(true);
  };

  const handleSave = (_values: SuperadminCommunicationNoticeFormValues) => {
    showToast(tCopy('COPY.TOAST_NOTICE_WRITE_API_UNAVAILABLE'));
  };

  const handleDelete = () => {
    if (!deleteItem) return;
    showToast(tCopy('COPY.TOAST_NOTICE_DELETE_API_UNAVAILABLE'));
  };

  const handleBroadcast = () => {
    setBroadcastItem(null);
    showToast(tCopy('COPY.TOAST_WHATSAPP_BROADCAST_UNAVAILABLE'));
  };

  // Filtered notices
  const filteredNotices = useMemo(() => {
    return notices.filter((n) => {
      const matchesSearch =
        searchTerm.trim() === '' ||
        n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (n.postedBy && n.postedBy.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus =
        statusFilter === 'All' ||
        (statusFilter === 'Active' && n.status === 'Active') ||
        (statusFilter === 'Expired' && n.status !== 'Active');

      return matchesSearch && matchesStatus;
    });
  }, [notices, searchTerm, statusFilter]);

  // Live KPI Summary
  const stats = useMemo(() => {
    const total = notices.length;
    const active = notices.filter((n) => n.status === 'Active').length;
    const expired = notices.filter((n) => n.status !== 'Active').length;
    return { total, active, expired };
  }, [notices]);

  const handleExportCsv = () => {
    const headers = ['Title', 'Message', 'Status', 'Valid Till', 'Posted By', 'Posted Date'];
    const rows = filteredNotices.map((n) => [
      `"${n.title.replace(/"/g, '""')}"`,
      `"${n.message.replace(/"/g, '""')}"`,
      `"${n.status}"`,
      `"${n.validTill}"`,
      `"${n.postedBy ?? ''}"`,
      `"${n.postedDate ?? ''}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `library_notices_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const hasActiveFilters = searchTerm !== '' || statusFilter !== 'All';

  const colDefs = [
    {
      field: 'title',
      headerName: tCopy('COPY.TITLE'),
      width: 220,
      cellRenderer: (p: ICellRendererParams) => (
        <span className="eng-td-bold text-foreground font-semibold text-sm">
          {String(p.value || tCopy('COPY.UNKNOWN'))}
        </span>
      ),
    },
    {
      field: 'message',
      headerName: tCopy('COPY.MESSAGE'),
      flex: 1,
      minWidth: 250,
      cellRenderer: (p: ICellRendererParams) => (
        <span className="text-muted-foreground text-xs truncate block w-full pt-1" title={String(p.value ?? '')}>
          {String(p.value || tCopy('COPY.UNKNOWN'))}
        </span>
      ),
    },
    {
      field: 'status',
      headerName: tCopy('COPY.STATUS'),
      width: 130,
      cellRenderer: (p: ICellRendererParams) => (
        <span
          className={`eng-badge inline-flex items-center gap-1 mt-2 text-xs font-semibold px-2.5 py-0.5 rounded-full ${
            p.value === 'Active'
              ? 'eng-badge--success bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
              : 'eng-badge--outline bg-muted/40 text-muted-foreground border border-border/60'
          }`}
        >
          {p.value === 'Active' ? `✅ ${tCopy('COPY.ACTIVE_STATUS')}` : tCopy('COPY.EXPIRED_STATUS')}
        </span>
      ),
    },
    {
      field: 'validTill',
      headerName: tCopy('COPY.VALID_TILL'),
      width: 140,
      cellRenderer: (p: ICellRendererParams) => (
        <span className="font-mono text-xs text-muted-foreground flex items-center gap-1 pt-1">
          <Clock className="w-3 h-3 text-sky-400" />
          {String(p.value || tCopy('COPY.UNKNOWN'))}
        </span>
      ),
    },
    {
      field: 'postedBy',
      headerName: tCopy('COPY.POSTED_BY'),
      width: 130,
      cellRenderer: (p: ICellRendererParams) => (
        <span className="text-muted-foreground text-xs">{String(p.value || tCopy('COPY.UNKNOWN'))}</span>
      ),
    },
    {
      field: 'postedDate',
      headerName: tCopy('COPY.POSTED_DATE'),
      width: 130,
      cellRenderer: (p: ICellRendererParams) => (
        <span className="font-mono text-xs text-muted-foreground">{String(p.value || tCopy('COPY.UNKNOWN'))}</span>
      ),
    },
    {
      headerName: tCopy('COPY.ACTIONS'),
      width: 140,
      sortable: false,
      cellRenderer: (params: ICellRendererParams) => (
        <div className="h-full flex items-center gap-2 py-1">
          <button
            type="button"
            onClick={() => openEdit(params.data)}
            className="p-1.5 rounded-lg border border-sky-500/30 bg-sky-500/10 text-sky-300 hover:bg-sky-500/25 hover:text-white transition-all shadow-sm active:scale-95"
            title={tCopy('COPY.EDIT')}
            data-testid={`superadmin-communication-communication-notices-edit-1-${getSuperadminInteractiveTestIdSuffix(params.data)}`}
          >
            <Edit2 size={13} />
          </button>
          <button
            type="button"
            onClick={() => setBroadcastItem(params.data)}
            className="p-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/25 hover:text-white transition-all shadow-sm active:scale-95"
            title={tCopy('COPY.BROADCAST')}
            data-testid={`superadmin-communication-communication-notices-broadcast-2-${getSuperadminInteractiveTestIdSuffix(params.data)}`}
          >
            <Send size={13} />
          </button>
          <button
            type="button"
            onClick={() => setDeleteItem(params.data)}
            className="p-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/25 hover:text-white transition-all shadow-sm active:scale-95"
            title={tCopy('COPY.DELETE')}
            data-testid={`superadmin-communication-communication-notices-delete-3-${getSuperadminInteractiveTestIdSuffix(params.data)}`}
          >
            <Trash2 size={13} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full max-w-full min-w-0 space-y-6 pb-12" data-resource-id={id || undefined}>
      {noticesQuery.isError && (
        <p className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs text-rose-200" role="alert">
          {tCopy('COPY.COULD_NOT_LOAD_NOTICES_FROM_THE_CONFIGURED_ENDPOINT')}{' '}
          <button
            type="button"
            className="underline ml-2 text-rose-300 font-semibold"
            onClick={() => {
              void queryClient.invalidateQueries({ queryKey: SUPERADMIN_COMMUNICATION_NOTICES_QUERY_KEYS.lists() });
              void noticesQuery.refetch();
            }}
            data-testid="superadmin-communication-communication-notices-retry-4"
          >
            {tCopy('COPY.RETRY')}
          </button>
        </p>
      )}

      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-sky-950/40 via-card/90 to-card/60 border border-sky-500/20 p-6 shadow-xl backdrop-blur-md">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-sky-500/10 border border-sky-500/25 text-sky-400 text-xs font-medium mb-3">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
              <Radio className="w-3.5 h-3.5" />
              <span>Broadcast Network Active</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
              <Bell className="w-7 h-7 text-sky-400" />
              {tCopy('COPY.NOTICE_BOARD')}
            </h1>
            <p className="text-xs text-muted-foreground mt-1 max-w-2xl">
              {tCopy('COPY.POST_AND_MANAGE_LIBRARY_NOTICES_FOR_STUDENTS')}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleExportCsv}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-card border border-border/80 hover:border-sky-500/50 hover:bg-sky-500/10 text-foreground text-xs font-medium transition-all shadow-sm"
              title="Export notices to CSV"
            >
              <Download className="w-4 h-4 text-sky-400" />
              <span>Export CSV</span>
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-card border border-border/80 hover:border-slate-500/50 hover:bg-slate-500/10 text-foreground text-xs font-medium transition-all shadow-sm"
              title="Print notices"
            >
              <Printer className="w-4 h-4 text-slate-300" />
              <span>Print</span>
            </button>
            <button
              type="button"
              onClick={openAdd}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-500 hover:to-sky-400 text-white text-xs font-bold shadow-md transition-all active:scale-95"
              data-testid="superadmin-communication-communication-notices-post-notice-15"
            >
              <Plus size={15} /> {tCopy('COPY.POST_NOTICE')}
            </button>
          </div>
        </div>

        {/* Live KPI Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6 pt-6 border-t border-border/40">
          <div className="p-3 rounded-xl bg-card/60 border border-border/50">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Total Notices</span>
              <Bell className="w-4 h-4 text-sky-400" />
            </div>
            <div className="text-xl font-bold text-foreground mt-1">{stats.total}</div>
            <div className="text-[11px] text-muted-foreground mt-0.5">Showing {filteredNotices.length} matches</div>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
            <div className="flex items-center justify-between">
              <span className="text-xs text-emerald-400">Active Notices</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-xl font-bold text-emerald-300 mt-1">{stats.active}</div>
            <div className="text-[11px] text-emerald-400/80 mt-0.5">Visible to members</div>
          </div>
          <div className="p-3 rounded-xl bg-muted/30 border border-border/50">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Expired Notices</span>
              <Clock className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="text-xl font-bold text-foreground/80 mt-1">{stats.expired}</div>
            <div className="text-[11px] text-muted-foreground mt-0.5">Archived from board</div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="rounded-2xl bg-card/80 border border-border/80 p-4 shadow-lg backdrop-blur-md">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by title, message, or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-muted/30 border border-border/80 text-foreground text-xs focus:ring-1 focus:ring-sky-500 focus:outline-none transition-all"
            />
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-muted-foreground font-medium">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'All' | 'Active' | 'Expired')}
                className="py-1.5 px-3 rounded-xl bg-muted/30 border border-border/80 text-foreground text-xs focus:ring-1 focus:ring-sky-500 focus:outline-none transition-all"
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active Only</option>
                <option value="Expired">Expired Only</option>
              </select>
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('All');
                }}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs text-muted-foreground hover:text-sky-300 hover:bg-muted/40 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-300 flex items-center gap-2" role="status">
        <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
        <span>{tCopy('COPY.CREATE_EDIT_DELETE_AND_BROADCAST_ACTIONS_ARE_PREVIEW_ONLY_OR_UNAVAILABLE_UNTIL_APPROVED_WRITE_BROADCAST_CONTRACTS_ARE_SUPPLIED')}</span>
      </p>

      {/* Table */}
      <div className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-xl p-4">
        {noticesQuery.isPending ? (
          <div className="flex items-center justify-center py-16">
            <p className="text-sm text-muted-foreground">{tCopy('COPY.LOADING_NOTICES')}</p>
          </div>
        ) : filteredNotices.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <span className="text-4xl">📢</span>
            <p className="text-sm font-semibold text-muted-foreground">{tCopy('COPY.NO_NOTICES_POSTED_YET')}</p>
            <button
              type="button"
              onClick={openAdd}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-500/15 border border-sky-500/30 text-xs font-semibold text-sky-300 hover:bg-sky-500/25 transition-all"
              data-testid="superadmin-communication-communication-notices-post-notice-16"
            >
              <Plus size={14} /> {tCopy('COPY.POST_NOTICE')}
            </button>
          </div>
        ) : (
          <div className="h-125">
            <SuperadminCommunicationNoticesSemanticTable
              rowData={filteredNotices}
              columnDefs={colDefs}
              rowHeight={56}
              headerHeight={48}
              pagination={true}
              paginationPageSize={10}
              defaultColDef={{ sortable: true, filter: true, resizable: true }}
            />
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-sky-500/30 bg-card/95 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border/60">
              <p className="text-base font-bold text-foreground flex items-center gap-2">
                <Plus size={18} className="text-sky-400" />
                {editItem ? tCopy('COPY.EDIT_NOTICE_ACTION') : tCopy('COPY.POST_NOTICE_ACTION')}
              </p>
              <button
                type="button"
                onClick={requestCloseAdd}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                aria-label={tCopy('COPY.CLOSE_ADD_EDIT_NOTICE_DIALOG')}
                data-testid="superadmin-communication-communication-notices-close-add-edit-notice-dialog-5"
              >
                <X size={16} />
              </button>
            </div>
            <form
              onSubmit={handleSubmit(handleSave)}
              noValidate
              className="space-y-4"
              data-testid="superadmin-superadmin-communication-notices-page-client-form-line-119"
            >
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5" htmlFor="notice-title">
                  {tCopy('COPY.TITLE')} <span className="text-rose-400">*</span>
                </label>
                <input
                  id="notice-title"
                  className="w-full rounded-xl border border-border/80 bg-muted/20 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
                  placeholder={tCopy('COPY.NOTICE_TITLE')}
                  aria-invalid={Boolean(errors.title)}
                  aria-describedby={errors.title ? 'notice-title-error' : undefined}
                  {...register('title')}
                  data-testid="superadmin-communication-communication-notices-notice-title-6"
                />
                {errors.title && (
                  <p id="notice-title-error" className="mt-1 text-xs text-rose-400" role="alert">
                    {translateValidationMessage(errors.title.message)}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5" htmlFor="notice-message">
                  {tCopy('COPY.MESSAGE')} <span className="text-rose-400">*</span>
                </label>
                <textarea
                  id="notice-message"
                  className="w-full rounded-xl border border-border/80 bg-muted/20 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400 resize-none"
                  rows={5}
                  placeholder={tCopy('COPY.NOTICE_MESSAGE')}
                  aria-invalid={Boolean(translateValidationMessage(errors.message?.message))}
                  aria-describedby={translateValidationMessage(errors.message?.message) ? 'notice-message-error' : undefined}
                  {...register('message')}
                  data-testid="superadmin-communication-communication-notices-notice-message-7"
                />
                {translateValidationMessage(errors.message?.message) && (
                  <p id="notice-message-error" className="mt-1 text-xs text-rose-400" role="alert">
                    {translateValidationMessage(errors.message?.message)}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5" htmlFor="notice-valid-till">
                  {tCopy('COPY.VALID_TILL')} <span className="text-rose-400">*</span>
                </label>
                <input
                  id="notice-valid-till"
                  type="date"
                  className="w-full rounded-xl border border-border/80 bg-muted/20 px-3.5 py-2.5 text-sm text-foreground focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400 [color-scheme:dark]"
                  min={today}
                  aria-invalid={Boolean(errors.validTill)}
                  aria-describedby={errors.validTill ? 'notice-valid-till-error' : undefined}
                  {...register('validTill')}
                  data-testid="superadmin-communication-communication-notices-notice-valid-till-8"
                />
                {errors.validTill && (
                  <p id="notice-valid-till-error" className="mt-1 text-xs text-rose-400" role="alert">
                    {translateValidationMessage(errors.validTill.message)}
                  </p>
                )}
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-border/60">
                <button
                  type="button"
                  onClick={requestCloseAdd}
                  className="px-4 py-2 rounded-xl border border-border/80 bg-muted/30 text-xs font-semibold text-foreground hover:bg-muted/60 transition-all"
                  data-testid="superadmin-communication-communication-notices-cancel-9"
                >
                  {tCopy('COPY.CANCEL')}
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-500 hover:to-sky-400 text-white text-xs font-bold shadow-md transition-all active:scale-95 disabled:opacity-50"
                  disabled={isSubmitting}
                  data-testid="superadmin-communication-communication-notices-update-notice-preview-10"
                >
                  {editItem ? tCopy('COPY.UPDATE_NOTICE_PREVIEW') : tCopy('COPY.POST_NOTICE_PREVIEW')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl border border-rose-500/30 bg-card/95 p-6 shadow-2xl space-y-4">
            <p className="text-base font-bold text-foreground">{tCopy('COPY.DELETE_NOTICE')}</p>
            <p className="text-xs text-muted-foreground" id="notice-delete-unavailable">
              {tCopy('COPY.NOTICE_DELETE_UNAVAILABLE_NO_CHANGE')}
            </p>
            <div className="flex justify-end gap-3 pt-3 border-t border-rose-500/20">
              <button
                type="button"
                onClick={() => setDeleteItem(null)}
                className="px-4 py-2 rounded-xl border border-border/80 bg-muted/30 text-xs font-semibold text-foreground hover:bg-muted/60 transition-all"
                data-testid="superadmin-communication-communication-notices-cancel-11"
              >
                {tCopy('COPY.CANCEL')}
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled
                className="px-4 py-2 rounded-xl bg-rose-600/50 text-white text-xs font-bold opacity-50 cursor-not-allowed"
                data-testid="superadmin-communication-communication-notices-delete-12"
              >
                {tCopy('COPY.DELETE')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Broadcast Confirmation */}
      {broadcastItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl border border-sky-500/30 bg-card/95 p-6 shadow-2xl space-y-4">
            <p className="text-base font-bold text-foreground">{tCopy('COPY.BROADCAST_VIA_WHATSAPP')}</p>
            <p className="text-xs text-muted-foreground" id="notice-broadcast-unavailable">
              {tCopy('COPY.NOTICE_BROADCAST_UNAVAILABLE_NO_CHANGE')}
            </p>
            <div className="flex justify-end gap-3 pt-3 border-t border-sky-500/20">
              <button
                type="button"
                onClick={() => setBroadcastItem(null)}
                className="px-4 py-2 rounded-xl border border-border/80 bg-muted/30 text-xs font-semibold text-foreground hover:bg-muted/60 transition-all"
                data-testid="superadmin-communication-communication-notices-cancel-13"
              >
                {tCopy('COPY.CANCEL')}
              </button>
              <button
                type="button"
                onClick={handleBroadcast}
                disabled
                className="px-4 py-2 rounded-xl bg-sky-600/50 text-white text-xs font-bold opacity-50 cursor-not-allowed"
                data-testid="superadmin-communication-communication-notices-broadcast-14"
              >
                {tCopy('COPY.BROADCAST')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
