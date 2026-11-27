'use client';

import { AdminCommunicationEmptyState } from '@/app/frontend_admin/admin_communication/communication_notices/components/AdminCommunicationEmptyState';
import AdminCommunicationNoticeModal from '@/app/frontend_admin/admin_communication/communication_notices/components/AdminCommunicationNoticeModal';
import { AdminCommunicationNoticesBranchBar } from '@/app/frontend_admin/admin_communication/communication_notices/components/AdminCommunicationNoticesBranchBar';
import { buildAdminCommunicationNoticeColumns } from '@/app/frontend_admin/admin_communication/communication_notices/components/AdminCommunicationNoticesColumns';
import { AdminCommunicationNoticesConfirmDialogs } from '@/app/frontend_admin/admin_communication/communication_notices/components/AdminCommunicationNoticesConfirmDialogs';
import { AdminCommunicationNoticesEmergencyBanner } from '@/app/frontend_admin/admin_communication/communication_notices/components/AdminCommunicationNoticesEmergencyBanner';
import { AdminCommunicationNoticesKpiGrid } from '@/app/frontend_admin/admin_communication/communication_notices/components/AdminCommunicationNoticesKpiGrid';
import { ADMIN_COMMUNICATION_NOTICE_DEMO_DATA } from '@/app/frontend_admin/admin_communication/communication_notices/config/admin_communication_notices.demo_data';
import useAdminCommunicationNoticesQuery from '@/app/frontend_admin/admin_communication/communication_notices/hooks/useAdminCommunicationNoticesQuery';
import useAdminCommunicationNoticesUnsavedChangesGuard from '@/app/frontend_admin/admin_communication/communication_notices/hooks/useAdminCommunicationNoticesUnsavedChangesGuard';
import { createAdminCommunicationNoticeSchema, type AdminCommunicationNoticeFormValues } from '@/app/frontend_admin/admin_communication/communication_notices/schemas/AdminCommunicationNoticesSchema';
import type { Notice } from '@/app/frontend_admin/admin_communication/communication_notices/types/AdminCommunicationNoticesComponentTypes';
import { getAdminCommunicationNoticeStatus } from '@/app/frontend_admin/admin_communication/communication_notices/utils/AdminCommunicationNoticesDateUtils';
import { useAdminBranch } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_components/AdminBranchProvider';
import { useAdminApplicationInfrastructureUrlQueryState } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_hooks/useAdminApplicationInfrastructureUrlQueryState';
import { DataGrid } from '@/app/frontend_admin/components/ui/data-grid/DataGrid';
import { isFrontendDemoModeEnabled } from '@/lib/runtimeFeatures';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertTriangle, Plus, Radio } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

export { AdminCommunicationEmptyState };

const BLANK_NOTICE_DEFAULTS: AdminCommunicationNoticeFormValues = {
  title: '',
  message: '',
  validTill: '',
  targetBranch: 'All Branches',
  sendWhatsApp: false,
  sendEmail: false,
  sendSms: false,
};

export function AdminCommunicationNoticesPage() {
  const [urlTablePage0, setUrlTablePage0] = useAdminApplicationInfrastructureUrlQueryState<number>('admin-communication-admin-communication-notices-page-1-page', 0);
  const t = useTranslations('ADMIN_COMMUNICATION');
  const router = useRouter();
  const isDemoMode = isFrontendDemoModeEnabled();
  const { branches, selectedBranch, isAllBranches } = useAdminBranch();

  const noticesQuery = useAdminCommunicationNoticesQuery(!isDemoMode);
  const apiNotices = useMemo<Notice[]>(
    () => (noticesQuery.data ?? []).map((n) => ({
      id: String(n.id),
      title: n.title,
      message: n.message,
      postedBy: '—',
      postedDate: n.createdAt.slice(0, 10),
      validTill: n.validTill.slice(0, 10),
      targetBranch: 'All Branches',
      status: getAdminCommunicationNoticeStatus(n.validTill),
    })),
    [noticesQuery.data]
  );
  const [demoNotices, setDemoNotices] = useState<Notice[]>(() =>
    isDemoMode
      ? ADMIN_COMMUNICATION_NOTICE_DEMO_DATA.map((notice) => ({
          id: String(notice.id),
          title: notice.title,
          message: notice.message,
          postedBy: 'Demo session',
          postedDate: notice.createdAt.slice(0, 10),
          validTill: notice.validTill.slice(0, 10),
          targetBranch: 'All Branches',
          status: getAdminCommunicationNoticeStatus(notice.validTill),
        }))
      : []
  );
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

  const noticeSchema = useMemo(
    () => createAdminCommunicationNoticeSchema({
      noticeTitleRequired: t('VALIDATION_NOTICE_TITLE_REQUIRED'),
      noticeMessageRequired: t('VALIDATION_NOTICE_MESSAGE_REQUIRED'),
      noticeDateInvalid: t('VALIDATION_NOTICE_DATE_INVALID'),
    }),
    [t]
  );

  const noticeForm = useForm<AdminCommunicationNoticeFormValues>({
    resolver: zodResolver(noticeSchema),
    defaultValues: BLANK_NOTICE_DEFAULTS,
    mode: 'onBlur',
  });

  const handleBlockedNavigation = useCallback((href: string) => { setPendingHref(href); setShowDiscardDialog(true); }, []);
  useAdminCommunicationNoticesUnsavedChangesGuard(showAdd && noticeForm.formState.isDirty, handleBlockedNavigation, noticeForm.formState.isSubmitting);

  const requestCloseForm = () => {
    if (noticeForm.formState.isDirty) { setPendingHref(null); setShowDiscardDialog(true); return; }
    setShowAdd(false); setEditItem(null); setIsEmergencyMode(false); noticeForm.reset(BLANK_NOTICE_DEFAULTS);
  };
  const discardFormDraft = () => {
    const destination = pendingHref; noticeForm.reset(BLANK_NOTICE_DEFAULTS);
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
    noticeForm.reset({ title: '', message: '', validTill: '', targetBranch: 'All Branches', sendWhatsApp: true, sendEmail: true, sendSms: false, priority: 'STANDARD', isEmergency: false });
    setEditItem(null); setShowAdd(true);
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
      sendWhatsApp: true, sendEmail: true, sendSms: true, priority: 'EMERGENCY', isEmergency: true,
    });
    setEditItem(null); setShowAdd(true);
  };

  const openEdit = useCallback((n: Notice) => {
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
    setEditItem(n); setShowAdd(true);
  }, [noticeForm]);

  const handleSave = (values: AdminCommunicationNoticeFormValues) => {
    if (!isDemoMode) { showToast(t('NOTICE_CREATE_BLOCKED_TOAST')); return; }
    const postedDate = new Date().toISOString().slice(0, 10);
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
        id: `NOTICE-DEMO-${Date.now()}`, title: values.title.trim(), message: values.message.trim(),
        validTill, targetBranch, postedBy: t('DEMO_AUTHOR'), postedDate, channels, priority, isEmergency: isEmerg,
        status: getAdminCommunicationNoticeStatus(validTill),
      };
      setDemoNotices((current) => [nextNotice, ...current]);
      const channelText = channels.length > 0 ? ` & dispatched via ${channels.join(', ').toUpperCase()}` : '';
      showToast(isEmerg ? `🚨 Emergency broadcast transmitted to ALL branches via ${channels.join(', ').toUpperCase()}!` : `${t('NOTICE_DEMO_CREATED', { title: nextNotice.title })}${channelText}`);
    }
    setShowAdd(false); setEditItem(null); setIsEmergencyMode(false);
    noticeForm.reset(BLANK_NOTICE_DEFAULTS);
  };

  const handleDelete = () => {
    if (!deleteItem) return;
    if (!isDemoMode) { showToast(t('NOTICE_DELETE_BLOCKED_TOAST')); return; }
    setDemoNotices((current) => current.filter((notice) => notice.id !== deleteItem.id));
    showToast(t('NOTICE_DEMO_DELETED', { title: deleteItem.title }));
    setDeleteItem(null);
  };

  const activeEmergencyNotice = useMemo(
    () => notices.find((n) => (n.priority === 'EMERGENCY' || n.isEmergency) && n.status === 'Active'),
    [notices]
  );

  const filteredNotices = useMemo(() => {
    let list = notices;
    if (!isAllBranches && selectedBranch) {
      list = list.filter((n) => !n.targetBranch || n.targetBranch === 'All Branches' || n.targetBranch.toLowerCase().includes(selectedBranch.name.toLowerCase()));
    }
    const q = search.trim().toLowerCase();
    if (!q) return list;
    return list.filter((n) => n.title.toLowerCase().includes(q) || n.message.toLowerCase().includes(q) || (n.targetBranch ? n.targetBranch.toLowerCase().includes(q) : false) || (n.postedBy ? n.postedBy.toLowerCase().includes(q) : false));
  }, [isAllBranches, selectedBranch, notices, search]);

  const colDefs = useMemo(
    () => buildAdminCommunicationNoticeColumns({ t, isDemoMode, onEdit: openEdit, onBroadcast: setBroadcastItem, onDelete: setDeleteItem }),
    [t, isDemoMode, openEdit]
  );

  return (
    <div className="min-h-screen bg-page p-6 md:p-8">
      {toast && (
        <div className="relative">
          <div className="fixed bottom-6 right-6 z-50 rounded-xl border border-border bg-card px-4 py-3 text-ui font-semibold text-text-primary shadow-toast" role="status" aria-live="polite" aria-atomic="true">{toast}</div>
        </div>
      )}

      <AdminCommunicationNoticeModal showAdd={showAdd} showDiscardDialog={showDiscardDialog} editItem={editItem} noticeForm={noticeForm} isDemoMode={isDemoMode} branches={branches} isEmergencyMode={isEmergencyMode} onRequestClose={requestCloseForm} onDiscard={discardFormDraft} onStay={() => { setShowDiscardDialog(false); setPendingHref(null); }} onSave={handleSave} />
      <AdminCommunicationNoticesConfirmDialogs deleteItem={deleteItem} broadcastItem={broadcastItem} isDemoMode={isDemoMode} onCloseDelete={() => setDeleteItem(null)} onConfirmDelete={handleDelete} onCloseBroadcast={() => setBroadcastItem(null)} onConfirmBroadcast={() => showToast(t('NOTICE_BROADCAST_BLOCKED_TOAST'))} />

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2">
          <div className="inline-flex items-center gap-2 self-start rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold text-text-secondary">
            <Radio className="h-3.5 w-3.5 text-primary-text" />
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
            className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-danger px-4 py-2.5 font-semibold text-on-primary shadow-lg hover:opacity-90 border border-danger motion-safe:transition-all"
          >
            <AlertTriangle size={18} strokeWidth={2} className="motion-safe:animate-pulse" />
            <span>Emergency Broadcast (आपातकालीन नोटिस)</span>
          </button>
          <button type="button" data-testid="admin_communication-page-control-012" onClick={openAdd} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-4 py-2.5 font-semibold text-on-primary shadow-sm hover:bg-primary-hover motion-safe:transition-colors">
            <Plus size={18} strokeWidth={2} /> {t('NOTICE_POST_BUTTON')}
          </button>
        </div>
      </div>

      {activeEmergencyNotice && (
        <AdminCommunicationNoticesEmergencyBanner
          title={activeEmergencyNotice.title}
          message={activeEmergencyNotice.message}
          targetBranch={activeEmergencyNotice.targetBranch}
          onRebroadcast={() => showToast('🚨 Re-broadcasting emergency notice to ALL students across network branches via WhatsApp & SMS...')}
        />
      )}

      <AdminCommunicationNoticesKpiGrid
        totalCount={filteredNotices.length}
        activeCount={filteredNotices.filter((n) => n.status === 'Active').length}
        expiredCount={filteredNotices.filter((n) => n.status === 'Expired').length}
        targetScopeLabel={isAllBranches ? 'All Branches' : (selectedBranch?.name ?? '1 Branch')}
      />

      <AdminCommunicationNoticesBranchBar search={search} onSearchChange={setSearch} />

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
            <AdminCommunicationEmptyState testId="admin_communication-page-state-013" iconTestId="admin_communication-page-state-014" titleTestId="admin_communication-page-state-015" title={t('NOTICE_EMPTY')} description={t('NOTICE_EMPTY_DESCRIPTION')} />
            <button type="button" data-testid="admin_communication-page-control-016" onClick={openAdd} className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded hover:bg-primary-hover motion-safe:transition-colors font-medium">
              <Plus size={18} strokeWidth={2} /> {t('NOTICE_POST_BUTTON')}
            </button>
          </div>
        ) : (
          <div className="min-w-0 overflow-x-auto rounded-lg border border-border bg-card h-96">
            <DataGrid rowData={filteredNotices} columnDefs={colDefs} rowHeight={56} pagination={true} pageSize={10} page={urlTablePage0} onPageChange={setUrlTablePage0} />
          </div>
        )}
      </div>
    </div>
  );
}
export default AdminCommunicationNoticesPage;
