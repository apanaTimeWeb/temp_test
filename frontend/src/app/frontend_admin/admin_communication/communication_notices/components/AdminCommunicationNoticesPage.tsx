'use client';
import AdminCommunicationNoticeModal from '@/app/frontend_admin/admin_communication/communication_notices/components/AdminCommunicationNoticeModal';
import { AdminCommunicationNoticesBranchBar } from '@/app/frontend_admin/admin_communication/communication_notices/components/AdminCommunicationNoticesBranchBar';
import { AdminCommunicationNoticesConfirmDialogs } from '@/app/frontend_admin/admin_communication/communication_notices/components/AdminCommunicationNoticesConfirmDialogs';
import useAdminCommunicationNoticesQuery from '@/app/frontend_admin/admin_communication/communication_notices/hooks/useAdminCommunicationNoticesQuery';
import useAdminCommunicationNoticesUnsavedChangesGuard from '@/app/frontend_admin/admin_communication/communication_notices/hooks/useAdminCommunicationNoticesUnsavedChangesGuard';
import { ADMIN_COMMUNICATION_NOTICE_API_FIXTURE } from '@/app/frontend_admin/admin_communication/communication_notices/mocks/scenarios/admin_communication_notices.scenarios';
import { createAdminCommunicationNoticeSchema,type AdminCommunicationNoticeFormValues } from '@/app/frontend_admin/admin_communication/communication_notices/schemas/AdminCommunicationNoticesSchema';
import type { AdminCommunicationEmptyStateProps,Notice } from '@/app/frontend_admin/admin_communication/communication_notices/types/AdminCommunicationNoticesComponentTypes';
import { getAdminCommunicationNoticeStatus } from '@/app/frontend_admin/admin_communication/communication_notices/utils/AdminCommunicationNoticesDateUtils';
import { useAdminBranch } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_components/AdminBranchProvider';
import { useAdminApplicationInfrastructureUrlQueryState } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_hooks/useAdminApplicationInfrastructureUrlQueryState';
import type { DataGridCellParams,DataGridColumn } from '@/app/frontend_admin/components/ui/data-grid/DataGrid';
import { DataGrid } from '@/app/frontend_admin/components/ui/data-grid/DataGrid';
import { isFrontendDemoModeEnabled } from '@/lib/runtimeFeatures';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertTriangle,Building2,CheckCircle2,Clock,Edit2,Plus,Radio,SearchX,Send,Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useCallback,useEffect,useMemo,useRef,useState } from 'react';
import { useForm } from 'react-hook-form';

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

  const [isEmergencyMode, setIsEmergencyMode] = useState(false);
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
    defaultValues: {
      title: '',
      message: '',
      validTill: '',
      targetBranch: 'All Branches',
      sendWhatsApp: false,
      sendEmail: false,
      sendSms: false,
    },
    mode: 'onBlur',
  });

  const handleBlockedNavigation = useCallback((href: string) => { setPendingHref(href); setShowDiscardDialog(true); }, []);
  useAdminCommunicationNoticesUnsavedChangesGuard(showAdd && noticeForm.formState.isDirty, handleBlockedNavigation, noticeForm.formState.isSubmitting);

  const requestCloseForm = () => {
    if (noticeForm.formState.isDirty) { setPendingHref(null); setShowDiscardDialog(true); return; }
    setShowAdd(false); setEditItem(null); setIsEmergencyMode(false); noticeForm.reset({ title: '', message: '', validTill: '', targetBranch: 'All Branches' });
  };

  const discardFormDraft = () => {
    const destination = pendingHref;
    noticeForm.reset({ title: '', message: '', validTill: '', targetBranch: 'All Branches' });
    setEditItem(null); setShowAdd(false); setPendingHref(null); setShowDiscardDialog(false); setIsEmergencyMode(false);
    if (destination) router.push(destination);
  };

  const isLoading = !isDemoMode && noticesQuery.isPending;
  const errorMessage = !isDemoMode && noticesQuery.isError ? t('NOTICE_UNKNOWN_ERROR') : null;

  const showToast = (message: string) => {
    if (toastTimeoutRef.current !== null) window.clearTimeout(toastTimeoutRef.current);
    setToast(message);
    toastTimeoutRef.current = window.setTimeout(() => { setToast(''); toastTimeoutRef.current = null; }, 3000);
  };

  const openAdd = () => {
    setIsEmergencyMode(false);
    noticeForm.reset({
      title: '',
      message: '',
      validTill: '',
      targetBranch: 'All Branches',
      sendWhatsApp: true,
      sendEmail: true,
      sendSms: false,
      priority: 'STANDARD',
      isEmergency: false,
    });
    setEditItem(null);
    setShowAdd(true);
  };

  const openEmergencyBroadcast = () => {
    setIsEmergencyMode(true);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    noticeForm.reset({
      title: 'Urgent: All Library Branches Closed Today Due to Heavy Rainfall',
      message: 'Dear Students, Due to continuous heavy rainfall, severe waterlogging, and safety guidelines from municipal authorities, all Smart Library branch halls will remain CLOSED today. Digital portal and e-resources remain 24x7 active. Next operational advisory by 8:00 PM.',
      validTill: tomorrow.toISOString().slice(0, 10),
      targetBranch: 'All Branches',
      sendWhatsApp: true,
      sendEmail: true,
      sendSms: true,
      priority: 'EMERGENCY',
      isEmergency: true,
    });
    setEditItem(null);
    setShowAdd(true);
  };

  const openEdit = (n: Notice) => {
    const isEmerg = n.priority === 'EMERGENCY' || n.isEmergency || false;
    setIsEmergencyMode(isEmerg);
    noticeForm.reset({
      title: n.title,
      message: n.message,
      validTill: n.validTill,
      targetBranch: n.targetBranch || 'All Branches',
      sendWhatsApp: n.channels?.includes('whatsapp') ?? true,
      sendEmail: n.channels?.includes('email') ?? false,
      sendSms: n.channels?.includes('sms') ?? false,
      priority: n.priority ?? (isEmerg ? 'EMERGENCY' : 'STANDARD'),
      isEmergency: isEmerg,
    });
    setEditItem(n);
    setShowAdd(true);
  };

  const handleSave = (values: AdminCommunicationNoticeFormValues) => {
    if (!isDemoMode) { showToast(t('NOTICE_CREATE_BLOCKED_TOAST')); return; }
    const now = new Date();
    const postedDate = now.toISOString().slice(0, 10);
    const validTill = values.validTill;
    const targetBranch = values.targetBranch?.trim() || 'All Branches';
    const channels: Array<'whatsapp' | 'email' | 'sms'> = [];
    if (values.sendWhatsApp) channels.push('whatsapp');
    if (values.sendEmail) channels.push('email');
    if (values.sendSms) channels.push('sms');
    const isEmerg = isEmergencyMode || values.isEmergency || values.priority === 'EMERGENCY';
    const priority = isEmerg ? 'EMERGENCY' : (values.priority || 'STANDARD');

    if (editItem) {
      setDemoNotices((current) => current.map((notice) => notice.id === editItem.id ? { ...notice, title: values.title.trim(), message: values.message.trim(), validTill, targetBranch, channels, priority, isEmergency: isEmerg, status: getAdminCommunicationNoticeStatus(validTill) } : notice));
      showToast(t('NOTICE_DEMO_UPDATED', { title: values.title.trim() }));
    } else {
      const nextNotice: Notice = {
        id: `NOTICE-DEMO-${Date.now()}`,
        title: values.title.trim(),
        message: values.message.trim(),
        validTill,
        targetBranch,
        postedBy: t('DEMO_AUTHOR'),
        postedDate,
        channels,
        priority,
        isEmergency: isEmerg,
        status: getAdminCommunicationNoticeStatus(validTill),
      };
      setDemoNotices((current) => [nextNotice, ...current]);
      const channelText = channels.length > 0 ? ` & dispatched via ${channels.join(', ').toUpperCase()}` : '';
      if (isEmerg) {
        showToast(`🚨 Emergency broadcast transmitted to ALL branches via ${channels.join(', ').toUpperCase()}!`);
      } else {
        showToast(`${t('NOTICE_DEMO_CREATED', { title: nextNotice.title })}${channelText}`);
      }
    }
    setShowAdd(false);
    setEditItem(null);
    setIsEmergencyMode(false);
    noticeForm.reset({ title: '', message: '', validTill: '', targetBranch: 'All Branches', sendWhatsApp: false, sendEmail: false, sendSms: false });
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

  const activeEmergencyNotice = useMemo(() => {
    return notices.find((n) => (n.priority === 'EMERGENCY' || n.isEmergency) && n.status === 'Active');
  }, [notices]);

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
    {
      field: 'title',
      headerName: t('NOTICE_COLUMN_TITLE'),
      width: 250,
      sortable: true,
      cellRenderer: (p: DataGridCellParams<Notice>) => {
        const isEmerg = p.data.priority === 'EMERGENCY' || p.data.isEmergency;
        return (
          <div className="flex items-center gap-1.5 flex-wrap mt-2">
            <span className={`font-semibold ${isEmerg ? 'text-rose-400 font-bold' : 'text-primary'}`}>{p.data.title}</span>
            {isEmerg && (
              <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-extrabold bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse">
                🚨 EMERGENCY
              </span>
            )}
          </div>
        );
      },
    },
    {
      field: 'targetBranch',
      headerName: 'Target Branch',
      width: 160,
      sortable: true,
      cellRenderer: (p: DataGridCellParams<Notice>) => (
        <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1 text-xs font-medium text-text-primary mt-2 whitespace-nowrap">
          <Building2 size={12} className="text-primary shrink-0" />
          <span>{p.data.targetBranch ?? 'All Branches'}</span>
        </span>
      ),
    },
    {
      field: 'channels',
      headerName: 'Channels',
      width: 130,
      sortable: false,
      cellRenderer: (p: DataGridCellParams<Notice>) => {
        const channels = p.data.channels ?? ['whatsapp', 'email'];
        return (
          <div className="flex items-center gap-1 mt-2">
            {channels.includes('whatsapp') && (
              <span className="rounded px-1.5 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" title="WhatsApp Broadcast">
                WA
              </span>
            )}
            {channels.includes('email') && (
              <span className="rounded px-1.5 py-0.5 text-[10px] font-bold bg-sky-500/20 text-sky-400 border border-sky-500/30" title="Email Dispatch">
                Email
              </span>
            )}
            {channels.includes('sms') && (
              <span className="rounded px-1.5 py-0.5 text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30" title="SMS Alert">
                SMS
              </span>
            )}
            {channels.length === 0 && (
              <span className="text-[10px] text-text-secondary">Portal</span>
            )}
          </div>
        );
      },
    },
    { field: 'message', headerName: t('NOTICE_COLUMN_MESSAGE'), flex: 1, minWidth: 230, cellRenderer: (p: DataGridCellParams<Notice>) => <span className="text-text-secondary text-sm truncate block w-full pt-1" title={p.data.message}>{p.data.message}</span> },
    { 
      field: 'status', 
      headerName: t('NOTICE_COLUMN_STATUS'),
      width: 120,
      sortable: true,
      cellRenderer: (p: DataGridCellParams<Notice>) => (
        <span data-testid="admin_communication-page-state-001" className={`inline-flex min-h-6 items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap ${p.value === 'Active' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/15 text-amber-400 border-amber-500/30'} mt-2`}>
          <span className={`h-1.5 w-1.5 rounded-full ${p.value === 'Active' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
          {p.value === 'Active' ? t('NOTICE_STATUS_ACTIVE') : p.value === 'Expired' ? t('NOTICE_STATUS_EXPIRED') : t('NOTICE_STATUS_UNKNOWN')}
        </span>
      )
    },
    { field: 'validTill', headerName: t('NOTICE_COLUMN_VALID_TILL'), width: 130, sortable: true, cellRenderer: (p: DataGridCellParams<Notice>) => <span className="font-mono text-text-secondary text-sm">{p.data.validTill}</span> },
    { field: 'postedBy', headerName: t('NOTICE_COLUMN_POSTED_BY'), width: 130, sortable: true, cellRenderer: (p: DataGridCellParams<Notice>) => <span className="text-text-secondary text-sm">{p.data.postedBy}</span> },
    { field: 'postedDate', headerName: t('NOTICE_COLUMN_POSTED_DATE'), width: 130, sortable: true, cellRenderer: (p: DataGridCellParams<Notice>) => <span className="font-mono text-text-secondary text-sm">{p.data.postedDate}</span> },
    {
      headerName: t('NOTICE_COLUMN_ACTIONS'),
      width: 150,
      sortable: false,
      cellRenderer: (params: DataGridCellParams<Notice>) => (
        <div className="h-full flex items-center gap-1.5">
          <button
            data-testid={`admin_communication-notice-edit-${params.data.id}`}
            type="button"
            disabled={!isDemoMode}
            title={!isDemoMode ? t('NOTICE_PERSISTENCE_BLOCKED') : t('NOTICE_ROW_EDIT_ARIA', { title: params.data.title })}
            onClick={() => openEdit(params.data)}
            aria-label={t('NOTICE_ROW_EDIT_ARIA', { title: params.data.title })}
            className="inline-flex min-h-[34px] min-w-[34px] items-center justify-center rounded-lg border border-sky-500/30 bg-sky-500/10 text-sky-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 hover:bg-sky-500/20 hover:scale-105 motion-safe:transition-all disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Edit2 size={16} strokeWidth={2}/>
          </button>
          <button
            data-testid={`admin_communication-notice-broadcast-${params.data.id}`}
            type="button"
            onClick={() => setBroadcastItem(params.data)}
            aria-label={t('NOTICE_ROW_BROADCAST_ARIA', { title: params.data.title })}
            className="inline-flex min-h-[34px] min-w-[34px] items-center justify-center rounded-lg border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 hover:bg-indigo-500/20 hover:scale-105 motion-safe:transition-all disabled:cursor-not-allowed disabled:opacity-50"
            title={t('NOTICE_ROW_BROADCAST_ARIA', { title: params.data.title })}
          >
            <Send size={16} strokeWidth={2}/>
          </button>
          <button
            data-testid={`admin_communication-notice-delete-${params.data.id}`}
            type="button"
            disabled={!isDemoMode}
            title={!isDemoMode ? t('NOTICE_DELETE_BLOCKED_TOAST') : t('NOTICE_ROW_DELETE_ARIA', { title: params.data.title })}
            onClick={() => setDeleteItem(params.data)}
            aria-label={t('NOTICE_ROW_DELETE_ARIA', { title: params.data.title })}
            className="inline-flex min-h-[34px] min-w-[34px] items-center justify-center rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 hover:bg-rose-500/20 hover:scale-105 motion-safe:transition-all disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Trash2 size={16} strokeWidth={2}/>
          </button>
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
        isEmergencyMode={isEmergencyMode}
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
        <div className="flex flex-col gap-2">
          <div className="inline-flex items-center gap-2 self-start rounded-full border border-border bg-card/60 px-3 py-1 text-xs font-semibold text-text-secondary backdrop-blur-md">
            <Radio className="h-3.5 w-3.5 text-primary" />
            <span>Official Broadcasts</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">{t('NOTICE_PAGE_TITLE')}</h1>
          <p className="text-sm text-text-secondary">{t('NOTICE_PAGE_SUBTITLE')}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            data-testid="admin_communication-emergency-broadcast-btn"
            onClick={openEmergencyBroadcast}
            className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 via-rose-700 to-red-700 px-4 py-2.5 font-semibold text-white shadow-lg shadow-rose-950/40 hover:from-rose-500 hover:to-rose-600 border border-rose-500/30 motion-safe:transition-all"
          >
            <AlertTriangle size={18} strokeWidth={2} className="text-rose-200 animate-pulse" />
            <span>Emergency Broadcast (आपातकालीन नोटिस)</span>
          </button>
          <button data-testid="admin_communication-page-control-012" onClick={openAdd} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-4 py-2.5 font-semibold text-primary-contrast shadow-sm hover:bg-primary-hover motion-safe:transition-colors">
            <Plus size={18} strokeWidth={2}/> {t('NOTICE_POST_BUTTON')}
          </button>
        </div>
      </div>

      {/* Active Emergency Alert Banner */}
      {activeEmergencyNotice && (
        <div className="mb-6 rounded-2xl border border-rose-500/40 bg-gradient-to-r from-rose-950/50 via-red-950/30 to-slate-900/60 p-4 sm:p-5 backdrop-blur-xl shadow-xl shadow-rose-950/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 shrink-0 mt-0.5 animate-pulse">
              <AlertTriangle size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="rounded-full bg-rose-500/25 text-rose-400 border border-rose-500/40 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider">
                  Network-Wide Emergency Alert Active
                </span>
                <span className="text-xs text-slate-400 font-mono">Scope: {activeEmergencyNotice.targetBranch || 'All Branches'}</span>
              </div>
              <h3 className="text-base font-bold text-white mt-1">{activeEmergencyNotice.title}</h3>
              <p className="text-xs text-slate-300 line-clamp-2 mt-0.5">{activeEmergencyNotice.message}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
            <button
              type="button"
              onClick={() => {
                showToast(`🚨 Re-broadcasting emergency notice to ALL students across network branches via WhatsApp & SMS...`);
              }}
              className="inline-flex items-center gap-1.5 rounded-xl border border-rose-500/40 bg-rose-500/20 px-3.5 py-2 text-xs font-semibold text-rose-300 hover:text-white hover:bg-rose-500/30 transition-all shadow-sm"
            >
              <Send size={14} className="text-rose-400" />
              <span>Re-Broadcast Blast</span>
            </button>
          </div>
        </div>
      )}

      {/* KPI Summary Cards */}
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
        {/* Total Notices - Indigo */}
        <div className="group relative overflow-hidden rounded-2xl border border-indigo-500/25 bg-gradient-to-br from-[#0c0f28]/95 via-[#0c0f28]/90 to-[#12163a]/80 shadow-indigo-950/30 p-5 sm:p-6 shadow-md transition-all duration-300 hover:scale-[1.01] hover:shadow-xl">
          <svg aria-hidden="true" className="absolute bottom-0 right-0 w-36 h-20 opacity-20 group-hover:opacity-35 pointer-events-none" viewBox="0 0 150 45">
            <path d="M0,32 Q25,18 55,24 T95,14 T130,20 T150,8" fill="none" stroke="#818cf8" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <div className="relative z-10 flex items-start justify-between gap-2">
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-300">Total Notices</span>
            <div className="p-2.5 rounded-xl border border-indigo-500/30 bg-indigo-500/15 text-indigo-400 shrink-0 transition-transform group-hover:scale-110 shadow-xs">
              <Radio size={18} strokeWidth={2.2} />
            </div>
          </div>
          <p className="relative z-10 mt-3 sm:mt-4 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white tabular-nums">{filteredNotices.length}</p>
          <p className="relative z-10 mt-3.5 pt-2.5 border-t border-white/10 text-xs font-medium text-slate-400">Published broadcasts</p>
        </div>

        {/* Active Notices - Emerald */}
        <div className="group relative overflow-hidden rounded-2xl border border-emerald-500/25 bg-gradient-to-br from-[#091a16]/95 via-[#091a16]/90 to-[#0e2721]/80 shadow-emerald-950/30 p-5 sm:p-6 shadow-md transition-all duration-300 hover:scale-[1.01] hover:shadow-xl">
          <svg aria-hidden="true" className="absolute bottom-0 right-0 w-36 h-20 opacity-20 group-hover:opacity-35 pointer-events-none" viewBox="0 0 150 45">
            <path d="M0,32 Q25,18 55,24 T95,14 T130,20 T150,8" fill="none" stroke="#34d399" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <div className="relative z-10 flex items-start justify-between gap-2">
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-300">Active Notices</span>
            <div className="p-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/15 text-emerald-400 shrink-0 transition-transform group-hover:scale-110 shadow-xs">
              <CheckCircle2 size={18} strokeWidth={2.2} />
            </div>
          </div>
          <p className="relative z-10 mt-3 sm:mt-4 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-emerald-400 tabular-nums">
            {filteredNotices.filter((n) => n.status === 'Active').length}
          </p>
          <p className="relative z-10 mt-3.5 pt-2.5 border-t border-white/10 text-xs font-medium text-slate-400">Currently live to members</p>
        </div>

        {/* Expired - Amber */}
        <div className="group relative overflow-hidden rounded-2xl border border-amber-500/25 bg-gradient-to-br from-[#1c1408]/95 via-[#1c1408]/90 to-[#2c200c]/80 shadow-amber-950/30 p-5 sm:p-6 shadow-md transition-all duration-300 hover:scale-[1.01] hover:shadow-xl">
          <svg aria-hidden="true" className="absolute bottom-0 right-0 w-36 h-20 opacity-20 group-hover:opacity-35 pointer-events-none" viewBox="0 0 150 45">
            <path d="M0,32 Q25,18 55,24 T95,14 T130,20 T150,8" fill="none" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <div className="relative z-10 flex items-start justify-between gap-2">
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-300">Expired</span>
            <div className="p-2.5 rounded-xl border border-amber-500/30 bg-amber-500/15 text-amber-400 shrink-0 transition-transform group-hover:scale-110 shadow-xs">
              <Clock size={18} strokeWidth={2.2} />
            </div>
          </div>
          <p className="relative z-10 mt-3 sm:mt-4 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-amber-400 tabular-nums">
            {filteredNotices.filter((n) => n.status === 'Expired').length}
          </p>
          <p className="relative z-10 mt-3.5 pt-2.5 border-t border-white/10 text-xs font-medium text-slate-400">Passed validity threshold</p>
        </div>

        {/* Target Branches - Cyan */}
        <div className="group relative overflow-hidden rounded-2xl border border-cyan-500/25 bg-gradient-to-br from-[#081822]/95 via-[#081822]/90 to-[#0d2636]/80 shadow-cyan-950/30 p-5 sm:p-6 shadow-md transition-all duration-300 hover:scale-[1.01] hover:shadow-xl">
          <svg aria-hidden="true" className="absolute bottom-0 right-0 w-36 h-20 opacity-20 group-hover:opacity-35 pointer-events-none" viewBox="0 0 150 45">
            <path d="M0,32 Q25,18 55,24 T95,14 T130,20 T150,8" fill="none" stroke="#22d3ee" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <div className="relative z-10 flex items-start justify-between gap-2">
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-300">Target Branches</span>
            <div className="p-2.5 rounded-xl border border-cyan-500/30 bg-cyan-500/15 text-cyan-400 shrink-0 transition-transform group-hover:scale-110 shadow-xs">
              <Building2 size={18} strokeWidth={2.2} />
            </div>
          </div>
          <p className="relative z-10 mt-3 sm:mt-4 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white tabular-nums">
            {isAllBranches ? 'All Branches' : (selectedBranch?.name ?? '1 Branch')}
          </p>
          <p className="relative z-10 mt-3.5 pt-2.5 border-t border-white/10 text-xs font-medium text-slate-400">Notice recipient scope</p>
        </div>
      </div>

      {/* Notice Search Bar (Branch filtering is governed solely via the global Admin Shell Header) */}
      <AdminCommunicationNoticesBranchBar
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
