'use client';
import { useAdminApplicationInfrastructureUrlQueryState } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_hooks/useAdminApplicationInfrastructureUrlQueryState';
import useAdminCommunicationNoticesQuery from '@/app/frontend_admin/admin_communication/communication_notices/hooks/useAdminCommunicationNoticesQuery';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import useAdminCommunicationNoticesUnsavedChangesGuard from '@/app/frontend_admin/admin_communication/communication_notices/hooks/useAdminCommunicationNoticesUnsavedChangesGuard';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronRight, Plus, Edit2, Trash2, Send, SearchX, Building2 } from 'lucide-react';
import { DataGrid } from '@/app/frontend_admin/components/ui/data-grid/DataGrid';
import type { DataGridCellParams, DataGridColumn } from '@/app/frontend_admin/components/ui/data-grid/DataGrid';
import { getAdminCommunicationNoticeStatus } from '@/app/frontend_admin/admin_communication/communication_notices/utils/AdminCommunicationNoticesDateUtils';
import { createAdminCommunicationNoticeSchema, type AdminCommunicationNoticeFormValues } from '@/app/frontend_admin/admin_communication/communication_notices/schemas/AdminCommunicationNoticesSchema';
import { isFrontendDemoModeEnabled } from '@/app/frontend_admin/lib/runtimeFeatures';
import { ADMIN_COMMUNICATION_NOTICE_API_FIXTURE } from '@/app/frontend_admin/admin_communication/communication_notices/mocks/scenarios/admin_communication_notices.scenarios';
import type { Notice, AdminCommunicationEmptyStateProps } from '@/app/frontend_admin/admin_communication/communication_notices/types/AdminCommunicationNoticesComponentTypes';
import { useAdminBranch } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_components/AdminBranchProvider';
import AdminCommunicationNoticeModal from '@/app/frontend_admin/admin_communication/communication_notices/components/AdminCommunicationNoticeModal';
import { AdminCommunicationNoticesConfirmDialogs } from '@/app/frontend_admin/admin_communication/communication_notices/components/AdminCommunicationNoticesConfirmDialogs';
import { AdminCommunicationNoticesBranchBar } from '@/app/frontend_admin/admin_communication/communication_notices/components/AdminCommunicationNoticesBranchBar';

// Responsibility: AdminCommunicationNoticesPage component owned by admin_communication; responsibility folder: admin_communication_components_views.

export function AdminCommunicationNoticesPage() {
  const [urlTablePage0, setUrlTablePage0] = useAdminApplicationInfrastructureUrlQueryState<number>('admin-communication-admin-communication-notices-page-1-page', 0);
  const t = useTranslations('ADMIN_COMMUNICATION');
  const router = useRouter();
  const isDemoMode = isFrontendDemoModeEnabled();
  const { branches, selectedBranchId, selectedBranch, setSelectedBranchId, isAllBranches } = useAdminBranch();

  const noticesQuery = useAdminCommunicationNoticesQuery(!isDemoMode);
  const apiNotices = useMemo<Notice[]>(() => (noticesQuery.data ?? []).map((n) => ({ id: String(n.id), title: n.title, message: n.message, postedBy: '—', postedDate: n.createdAt.slice(0, 10), validTill: n.validTill.slice(0, 10), targetBranch: 'All Branches', status: getAdminCommunicationNoticeStatus(n.validTill) })), [noticesQuery.data]);
  const [demoNotices, setDemoNotices] = useState<Notice[]>(() => isDemoMode ? ADMIN_COMMUNICATION_NOTICE_API_FIXTURE.map((notice) => ({ id: String(notice.id), title: notice.title, message: notice.message, postedBy: 'Demo session', postedDate: notice.createdAt.slice(0, 10), validTill: notice.validTill.slice(0, 10), targetBranch: 'All Branches', status: getAdminCommunicationNoticeStatus(notice.validTill) })) : []);
  const notices = isDemoMode ? demoNotices : apiNotices;

  const [showAdd, setShowAdd] = useState(false);
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const [editItem, setEditItem] = useState<Notice | null>(null);
  const [deleteItem, setDeleteItem] = useState<Notice | null>(null);
  const [broadcastItem, setBroadcastItem] = useState<Notice | null>(null);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState('');
  const toastTimeoutRef = useRef<number | null>(null);

  useEffect(() => () => { if (toastTimeoutRef.current !== null) window.clearTimeout(toastTimeoutRef.current); }, []);

  const noticeSchema = useMemo(() => createAdminCommunicationNoticeSchema({
    noticeTitleRequired: t('VALIDATION_NOTICE_TITLE_REQUIRED'),
    noticeMessageRequired: t('VALIDATION_NOTICE_MESSAGE_REQUIRED'),
    noticeDateInvalid: t('VALIDATION_NOTICE_DATE_INVALID'),
  }), [t]);

  const noticeForm = useForm<AdminCommunicationNoticeFormValues>({
    resolver: zodResolver(noticeSchema),
    defaultValues: { title: '', message: '', validTill: '', targetBranch: 'All Branches' },
    mode: 'onBlur',
  });

  const handleBlockedNavigation = useCallback((href: string) => { setPendingHref(href); setShowDiscardDialog(true); }, []);
  useAdminCommunicationNoticesUnsavedChangesGuard(showAdd && noticeForm.formState.isDirty, handleBlockedNavigation, noticeForm.formState.isSubmitting);

  const requestCloseForm = () => {
    if (noticeForm.formState.isDirty) { setPendingHref(null); setShowDiscardDialog(true); return; }
    setShowAdd(false); setEditItem(null); noticeForm.reset({ title: '', message: '', validTill: '', targetBranch: 'All Branches' });
  };

  const discardFormDraft = () => {
    const destination = pendingHref;
    noticeForm.reset({ title: '', message: '', validTill: '', targetBranch: 'All Branches' });
    setEditItem(null); setShowAdd(false); setPendingHref(null); setShowDiscardDialog(false);
    if (destination) router.push(destination);
  };

  const isLoading = !isDemoMode && noticesQuery.isPending;
  const errorMessage = !isDemoMode && noticesQuery.isError ? t('NOTICE_UNKNOWN_ERROR') : null;

  const showToast = (message: string) => {
    if (toastTimeoutRef.current !== null) window.clearTimeout(toastTimeoutRef.current);
    setToast(message);
    toastTimeoutRef.current = window.setTimeout(() => { setToast(''); toastTimeoutRef.current = null; }, 3000);
  };

  const openAdd = () => { noticeForm.reset({ title: '', message: '', validTill: '', targetBranch: 'All Branches' }); setEditItem(null); setShowAdd(true); };
  const openEdit = (n: Notice) => { noticeForm.reset({ title: n.title, message: n.message, validTill: n.validTill, targetBranch: n.targetBranch || 'All Branches' }); setEditItem(n); setShowAdd(true); };

  const handleSave = (values: AdminCommunicationNoticeFormValues) => {
    if (!isDemoMode) { showToast(t('NOTICE_CREATE_BLOCKED_TOAST')); return; }
    const now = new Date();
    const postedDate = now.toISOString().slice(0, 10);
    const validTill = values.validTill;
    const targetBranch = values.targetBranch?.trim() || 'All Branches';

    if (editItem) {
      setDemoNotices((current) => current.map((notice) => notice.id === editItem.id ? { ...notice, title: values.title.trim(), message: values.message.trim(), validTill, targetBranch, status: getAdminCommunicationNoticeStatus(validTill) } : notice));
      showToast(t('NOTICE_DEMO_UPDATED', { title: values.title.trim() }));
    } else {
      const nextNotice: Notice = { id: `NOTICE-DEMO-${Date.now()}`, title: values.title.trim(), message: values.message.trim(), validTill, targetBranch, postedBy: t('DEMO_AUTHOR'), postedDate, status: getAdminCommunicationNoticeStatus(validTill) };
      setDemoNotices((current) => [nextNotice, ...current]);
      showToast(t('NOTICE_DEMO_CREATED', { title: nextNotice.title }));
    }
    setShowAdd(false);
    setEditItem(null);
    noticeForm.reset({ title: '', message: '', validTill: '', targetBranch: 'All Branches' });
  };

  const handleDelete = () => {
    if (!deleteItem) return;
    if (!isDemoMode) { showToast(t('NOTICE_DELETE_BLOCKED_TOAST')); return; }
    setDemoNotices((current) => current.filter((notice) => notice.id !== deleteItem.id));
    showToast(t('NOTICE_DEMO_DELETED', { title: deleteItem.title }));
    setDeleteItem(null);
  };

  const handleBroadcast = () => {
    showToast(t('NOTICE_BROADCAST_BLOCKED_TOAST'));
  };

  const filteredNotices = useMemo(() => {
    let list = notices;
    if (!isAllBranches && selectedBranch) {
      list = list.filter((n) => {
        if (!n.targetBranch || n.targetBranch === 'All Branches') return true;
        return n.targetBranch.toLowerCase().includes(selectedBranch.name.toLowerCase());
      });
    }
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter((n) =>
        n.title.toLowerCase().includes(q) ||
        n.message.toLowerCase().includes(q) ||
        (n.targetBranch ? n.targetBranch.toLowerCase().includes(q) : false) ||
        (n.postedBy ? n.postedBy.toLowerCase().includes(q) : false)
      );
    }
    return list;
  }, [isAllBranches, selectedBranch, notices, search]);

  const colDefs: readonly DataGridColumn<Notice>[] = [
    { field: 'title', headerName: t('NOTICE_COLUMN_TITLE'), width: 200, sortable: true, cellRenderer: (p: DataGridCellParams<Notice>) => <span className="font-semibold text-primary">{p.value}</span> },
    {
      field: 'targetBranch',
      headerName: 'Target Branch',
      width: 160,
      sortable: true,
      cellRenderer: (p: DataGridCellParams<Notice>) => (
        <span className="inline-flex items-center gap-1 rounded-md border border-border bg-surface-highlight px-2 py-0.5 text-xs font-medium text-text-primary mt-2 whitespace-nowrap">
          <Building2 size={12} className="text-primary shrink-0" />
          <span>{p.data.targetBranch ?? 'All Branches'}</span>
        </span>
      ),
    },
    { field: 'message', headerName: t('NOTICE_COLUMN_MESSAGE'), flex: 1, minWidth: 230, cellRenderer: (p: DataGridCellParams<Notice>) => <span className="text-text-secondary text-sm truncate block w-full pt-1" title={p.value}>{p.value}</span> },
    { 
      field: 'status', 
      headerName: t('NOTICE_COLUMN_STATUS'),
      width: 120,
      sortable: true,
      cellRenderer: (p: DataGridCellParams<Notice>) => (
        <span data-testid="admin_communication-page-state-001" className={`inline-flex min-h-6 items-center gap-1 rounded-full border border-transparent px-2 py-1 text-caption font-semibold whitespace-nowrap ${p.value === 'Active' ? 'bg-success-bg text-success-text border-success-bg' : 'bg-transparent text-text-secondary border-border'} mt-2`}>
          {p.value === 'Active' ? t('NOTICE_STATUS_ACTIVE') : p.value === 'Expired' ? t('NOTICE_STATUS_EXPIRED') : t('NOTICE_STATUS_UNKNOWN')}
        </span>
      )
    },
    { field: 'validTill', headerName: t('NOTICE_COLUMN_VALID_TILL'), width: 130, sortable: true, cellRenderer: (p: DataGridCellParams<Notice>) => <span className="font-mono text-text-secondary text-sm">{p.value}</span> },
    { field: 'postedBy', headerName: t('NOTICE_COLUMN_POSTED_BY'), width: 130, sortable: true, cellRenderer: (p: DataGridCellParams<Notice>) => <span className="text-text-secondary text-sm">{p.value}</span> },
    { field: 'postedDate', headerName: t('NOTICE_COLUMN_POSTED_DATE'), width: 130, sortable: true, cellRenderer: (p: DataGridCellParams<Notice>) => <span className="font-mono text-text-secondary text-sm">{p.value}</span> },
    {
      headerName: t('NOTICE_COLUMN_ACTIONS'),
      width: 140,
      sortable: false,
      cellRenderer: (params: DataGridCellParams<Notice>) => (
        <div className="h-full flex items-center gap-2">
          <button data-testid={`admin_communication-notice-edit-${params.data.id}`} type="button" disabled={!isDemoMode} title={!isDemoMode ? t('NOTICE_PERSISTENCE_BLOCKED') : t('NOTICE_ROW_EDIT_ARIA', { title: params.data.title })} onClick={() => openEdit(params.data)} aria-label={t('NOTICE_ROW_EDIT_ARIA', { title: params.data.title })} className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border border-transparent text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary hover:bg-primary hover:text-on-primary motion-safe:transition-colors motion-safe:duration-base disabled:cursor-not-allowed disabled:opacity-50"><Edit2 size={18} strokeWidth={2}/></button>
          <button data-testid={`admin_communication-notice-broadcast-${params.data.id}`} type="button" onClick={() => setBroadcastItem(params.data)} aria-label={t('NOTICE_ROW_BROADCAST_ARIA', { title: params.data.title })} className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border border-transparent text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 hover:bg-primary hover:text-on-primary motion-safe:transition-colors motion-safe:duration-base" title={t('NOTICE_ROW_BROADCAST_ARIA', { title: params.data.title })}><Send size={18} strokeWidth={2}/></button>
          <button data-testid={`admin_communication-notice-delete-${params.data.id}`} type="button" disabled={!isDemoMode} title={!isDemoMode ? t('NOTICE_DELETE_BLOCKED_TOAST') : t('NOTICE_ROW_DELETE_ARIA', { title: params.data.title })} onClick={() => setDeleteItem(params.data)} aria-label={t('NOTICE_ROW_DELETE_ARIA', { title: params.data.title })} className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary text-danger-text hover:bg-danger-bg hover:text-danger-text motion-safe:transition-colors motion-safe:duration-base disabled:cursor-not-allowed disabled:opacity-50"><Trash2 size={18} strokeWidth={2}/></button>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-page p-6 md:p-8">
      {toast && (
        <div className="relative">
          <div className="fixed bottom-6 right-6 z-50 rounded-xl border border-border bg-card px-4 py-3 text-ui font-semibold text-text-primary shadow-toast" role="status" aria-live="polite" aria-atomic="true">{toast}</div>
        </div>
      )}

      {/* Add / Edit Modal Subcomponent */}
      <AdminCommunicationNoticeModal
        showAdd={showAdd}
        showDiscardDialog={showDiscardDialog}
        editItem={editItem}
        noticeForm={noticeForm}
        isDemoMode={isDemoMode}
        branches={branches}
        onRequestClose={requestCloseForm}
        onDiscard={discardFormDraft}
        onStay={() => { setShowDiscardDialog(false); setPendingHref(null); }}
        onSave={handleSave}
      />

      {/* Delete / Broadcast Dialogs */}
      <AdminCommunicationNoticesConfirmDialogs
        deleteItem={deleteItem}
        broadcastItem={broadcastItem}
        isDemoMode={isDemoMode}
        onCloseDelete={() => setDeleteItem(null)}
        onConfirmDelete={handleDelete}
        onCloseBroadcast={() => setBroadcastItem(null)}
        onConfirmBroadcast={handleBroadcast}
      />

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-badge font-semibold uppercase tracking-[0.07em] text-text-secondary mb-2">
            <span>{t('BREADCRUMB_COMMUNICATION')}</span><ChevronRight size={18} strokeWidth={2} /><span>{t('NOTICE_PAGE_TITLE')}</span>
          </div>
          <h1 className="flex items-center gap-3 tracking-tight text-2xl font-bold text-text-primary">{t('NOTICE_PAGE_TITLE')}</h1>
          <p className="mt-1 text-ui text-text-secondary">{t('NOTICE_PAGE_SUBTITLE')}</p>
        </div>
        <button data-testid="admin_communication-page-control-012" onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded hover:bg-primary-hover motion-safe:transition-colors font-medium">
          <Plus size={18} strokeWidth={2}/> {t('NOTICE_POST_BUTTON')}
        </button>
      </div>

      {/* Multi-Branch Notice Filter Pills & Search */}
      <AdminCommunicationNoticesBranchBar
        branches={branches}
        selectedBranchId={selectedBranchId}
        selectedBranch={selectedBranch}
        setSelectedBranchId={setSelectedBranchId}
        isAllBranches={isAllBranches}
        totalNotices={notices.length}
        search={search}
        onSearchChange={setSearch}
      />

      <div className="rounded-xl border border-border bg-card overflow-hidden p-4">
        {isLoading ? (
          <div className="py-12 text-center text-text-secondary" role="status">{t('NOTICE_LOADING')}</div>
        ) : errorMessage ? (
          <div className="py-12 text-center">
            <p className="text-danger-text mb-3">{errorMessage}</p>
            <button type="button" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-ui font-medium text-text-primary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 motion-safe:transition-colors motion-safe:duration-base" onClick={() => { void noticesQuery.refetch(); }}>{t('NOTICE_RETRY')}</button>
          </div>
        ) : filteredNotices.length === 0 ? (
          <div className="py-8 text-center">
            <AdminCommunicationEmptyState
              testId="admin_communication-page-state-013"
              iconTestId="admin_communication-page-state-014"
              titleTestId="admin_communication-page-state-015"
              title={t('NOTICE_EMPTY')}
              description={t('NOTICE_EMPTY_DESCRIPTION')}
            />
            <button type="button" data-testid="admin_communication-page-control-016" onClick={openAdd} className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded hover:bg-primary-hover motion-safe:transition-colors font-medium">
              <Plus size={18} strokeWidth={2}/> {t('NOTICE_POST_BUTTON')}
            </button>
          </div>
        ) : (
          <div className="min-w-0 overflow-x-auto rounded-lg border border-border bg-card h-96">
            <DataGrid
              rowData={filteredNotices}
              columnDefs={colDefs}
              rowHeight={56}
              pagination={true}
              pageSize={10}
              page={urlTablePage0}
              onPageChange={setUrlTablePage0}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export function AdminCommunicationEmptyState({ title = 'No data found', description = 'Try adjusting your filters.', testId, iconTestId, titleTestId }: AdminCommunicationEmptyStateProps) {
  return (
    <div data-testid={testId} role="status" className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border p-12 text-center text-text-secondary">
      <div data-testid={iconTestId}><SearchX aria-hidden="true" size={28} strokeWidth={2} /></div>
      <p data-testid={titleTestId} className="font-medium text-text-primary">{title}</p>
      <p className="text-sm mt-1">{description}</p>
    </div>
  );
}
export default AdminCommunicationNoticesPage;
