'use client';
// RESPONSIBILITY: Primary client orchestrator for Platform Notices in Cyber-Luxury Dark Theme.
// FLOW: Route page.tsx -> SuperadminCommunicationNoticesPageClient -> Header, Filters, Table, Modals.

import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { Plus, AlertCircle, ShieldCheck } from 'lucide-react';

import { useSuperadminCommunicationNoticesConfirm } from '@/app/frontend_superadmin/superadmin_communication/communication_notices/hooks/useSuperadminCommunicationNoticesConfirm';
import { useSuperadminCommunicationNoticesUnsavedChangesGuard } from '@/app/frontend_superadmin/superadmin_communication/communication_notices/hooks/useSuperadminCommunicationNoticesUnsavedChangesGuard';
import { useSuperadminCommunicationNoticesQuery } from '@/app/frontend_superadmin/superadmin_communication/communication_notices/hooks/useSuperadminCommunicationNoticesQueries';
import { SUPERADMIN_COMMUNICATION_NOTICES_QUERY_KEYS } from '@/app/frontend_superadmin/superadmin_communication/communication_notices/api/superadmin_communication_notices.query_keys';
import {
  SuperadminCommunicationNoticeSchema,
  type SuperadminCommunicationNoticeFormValues,
} from '@/app/frontend_superadmin/superadmin_communication/communication_notices/schemas/SuperadminCommunicationNoticesNoticeSchema';
import type { SuperadminCommunicationNotice as Notice } from '@/app/frontend_superadmin/superadmin_communication/communication_notices/types/SuperadminCommunicationNoticesTypes';
import SuperadminCommunicationNoticesSemanticTable from '@/app/frontend_superadmin/superadmin_communication/communication_notices/components/SuperadminCommunicationNoticesSemanticTable';
import { SuperadminCommunicationNoticesHeader } from '@/app/frontend_superadmin/superadmin_communication/communication_notices/components/SuperadminCommunicationNoticesHeader';
import { SuperadminCommunicationNoticesFilters } from '@/app/frontend_superadmin/superadmin_communication/communication_notices/components/SuperadminCommunicationNoticesFilters';
import { SuperadminCommunicationNoticesModals } from '@/app/frontend_superadmin/superadmin_communication/communication_notices/components/SuperadminCommunicationNoticesModals';
import { useSuperadminCommunicationNoticesColumns } from '@/app/frontend_superadmin/superadmin_communication/communication_notices/components/SuperadminCommunicationNoticesTableColumns';
import {
  downloadSuperadminNoticesCsv,
  downloadSuperadminNoticesExcel,
  printSuperadminNoticesRoster,
} from '@/app/frontend_superadmin/superadmin_communication/communication_notices/utils/SuperadminCommunicationNoticesExportUtils';

export default function SuperadminCommunicationNoticesPageClient({ id }: { id?: string } = {}) {
  const confirm = useSuperadminCommunicationNoticesConfirm();
  const tCopy = useTranslations('SUPERADMIN_COMMUNICATION');
  const queryClient = useQueryClient();
  const noticesQuery = useSuperadminCommunicationNoticesQuery();
  const notices = noticesQuery.data ?? [];

  const [showAdd, setShowAdd] = useState(false);
  const [editItem, setEditItem] = useState<Notice | null>(null);
  const [deleteItem, setDeleteItem] = useState<Notice | null>(null);
  const [broadcastItem, setBroadcastItem] = useState<Notice | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Expired'>('All');

  const form = useForm<SuperadminCommunicationNoticeFormValues>({
    resolver: zodResolver(SuperadminCommunicationNoticeSchema),
    defaultValues: { title: '', message: '', validTill: '' },
  });

  const { reset, formState: { isDirty } } = form;

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

  const handleSave = () => showToast(tCopy('COPY.TOAST_NOTICE_WRITE_API_UNAVAILABLE'));
  const handleDelete = () => { if (deleteItem) showToast(tCopy('COPY.TOAST_NOTICE_DELETE_API_UNAVAILABLE')); };
  const handleBroadcast = () => { setBroadcastItem(null); showToast(tCopy('COPY.TOAST_WHATSAPP_BROADCAST_UNAVAILABLE')); };

  const filteredNotices = useMemo(() => {
    return notices.filter((n) => {
      const q = searchTerm.trim().toLowerCase();
      const matchesSearch = !q || n.title.toLowerCase().includes(q) || n.message.toLowerCase().includes(q) || (n.postedBy?.toLowerCase().includes(q) ?? false);
      const matchesStatus = statusFilter === 'All' || (statusFilter === 'Active' && n.status === 'Active') || (statusFilter === 'Expired' && n.status !== 'Active');
      return matchesSearch && matchesStatus;
    });
  }, [notices, searchTerm, statusFilter]);

  const stats = useMemo(() => {
    const total = notices.length;
    const active = notices.filter((n) => n.status === 'Active').length;
    return { total, active, expired: total - active };
  }, [notices]);

  const handleExportCsv = () => {
    downloadSuperadminNoticesCsv(filteredNotices);
    showToast('Platform notices exported as CSV');
  };

  const handleExportExcel = () => {
    downloadSuperadminNoticesExcel(filteredNotices);
    showToast('Platform notices exported as Excel (.xls)');
  };

  const handlePrint = () => {
    printSuperadminNoticesRoster(filteredNotices);
  };

  const colDefs = useSuperadminCommunicationNoticesColumns({
    openEdit,
    setBroadcastItem,
    setDeleteItem,
    tCopy,
  });

  return (
    <div className="w-full max-w-full min-w-0 space-y-6 pb-12" data-resource-id={id || undefined}>
      {noticesQuery.isError && (
        <p className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs text-rose-200" role="alert">
          {tCopy('COPY.COULD_NOT_LOAD_NOTICES_FROM_THE_CONFIGURED_ENDPOINT')}{' '}
          <button
            type="button"
            className="underline ml-2 text-rose-300 font-semibold cursor-pointer"
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

      {/* Hero Header & KPI Cards */}
      <SuperadminCommunicationNoticesHeader
        stats={stats}
        matchedCount={filteredNotices.length}
        onOpenAdd={openAdd}
        onExportCsv={handleExportCsv}
        onExportExcel={handleExportExcel}
        onPrint={handlePrint}
      />

      {/* Cost Protection Notice Banner */}
      <div className="flex items-center gap-2 rounded-xl border border-sky-500/30 bg-sky-500/10 px-3.5 py-2 text-xs font-medium text-sky-300">
        <ShieldCheck className="h-4 w-4 text-sky-400 shrink-0" />
        <span><strong>Communication Cost Protection:</strong> Routine broadcasts utilize In-App Notifications and WhatsApp Web (Zero API Cost). Paid SMS/WhatsApp Cloud API transmissions are reserved for priority dispatches to preserve platform provider quota.</span>
      </div>

      {/* Search & Filter Bar */}
      <SuperadminCommunicationNoticesFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        hasActiveFilters={searchTerm !== '' || statusFilter !== 'All'}
        onReset={() => {
          setSearchTerm('');
          setStatusFilter('All');
        }}
      />

      {/* Operational Disclaimer Pill */}
      <p className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs text-amber-300 flex items-center gap-2.5 shadow-sm" role="status">
        <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
        <span>{tCopy('COPY.CREATE_EDIT_DELETE_AND_BROADCAST_ACTIONS_ARE_PREVIEW_ONLY_OR_UNAVAILABLE_UNTIL_APPROVED_WRITE_BROADCAST_CONTRACTS_ARE_SUPPLIED')}</span>
      </p>

      {/* Modern Semantic Table View */}
      <div className="rounded-3xl border border-indigo-500/20 bg-slate-950/80 overflow-hidden shadow-2xl p-4 sm:p-5 backdrop-blur-md">
        {noticesQuery.isPending ? (
          <div className="flex items-center justify-center py-16">
            <p className="text-sm text-slate-400">{tCopy('COPY.LOADING_NOTICES')}</p>
          </div>
        ) : filteredNotices.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <span className="text-4xl">📢</span>
            <p className="text-sm font-semibold text-slate-400">{tCopy('COPY.NO_NOTICES_POSTED_YET')}</p>
            <button
              type="button"
              onClick={openAdd}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-500/15 border border-sky-500/30 text-xs font-semibold text-sky-300 hover:bg-sky-500/25 transition-all cursor-pointer"
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

      {/* All Notice Modals */}
      <SuperadminCommunicationNoticesModals
        showAdd={showAdd}
        editItem={editItem}
        deleteItem={deleteItem}
        broadcastItem={broadcastItem}
        form={form}
        onCloseAdd={requestCloseAdd}
        onSave={handleSave}
        onCancelDelete={() => setDeleteItem(null)}
        onConfirmDelete={handleDelete}
        onCancelBroadcast={() => setBroadcastItem(null)}
        onConfirmBroadcast={handleBroadcast}
      />
    </div>
  );
}
