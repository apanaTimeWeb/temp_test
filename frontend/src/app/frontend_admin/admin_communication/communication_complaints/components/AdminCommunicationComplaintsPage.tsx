'use client';
// Responsibility: AdminCommunicationComplaintsPage component owned by admin_communication; responsibility folder: admin_communication_components_views.
import useAdminCommunicationComplaintsQuery from '@/app/frontend_admin/admin_communication/communication_complaints/hooks/useAdminCommunicationComplaintsQuery';
// RESPONSIBILITY: Entry page for the admin_communication module.
// DATA FLOW: Next.js Router -> Page -> Components

import Dialog from '@/app/frontend_admin/components/ui/dialog/Dialog';
import DialogContent from '@/app/frontend_admin/components/ui/dialog/DialogContent';
import DialogDescription from '@/app/frontend_admin/components/ui/dialog/DialogDescription';
import DialogTitle from '@/app/frontend_admin/components/ui/dialog/DialogTitle';
import { useEffect, useMemo, useRef, useState } from 'react';
import { format, isValid, parseISO } from 'date-fns';
import { enUS, hi } from 'date-fns/locale';
import { useLocale, useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronRight, Plus, X, Eye, RefreshCw, CheckCircle, SearchX } from 'lucide-react';
import { getAdminCommunicationComplaintStatus, ADMIN_COMMUNICATION_COMPLAINT_STATUS, type AdminCommunicationComplaintStatus } from '@/app/frontend_admin/admin_communication/communication_complaints/config/admin_communication_complaints.url_config';
import { createAdminCommunicationComplaintSchema, type AdminCommunicationComplaintFormValues } from '@/app/frontend_admin/admin_communication/communication_complaints/schemas/AdminCommunicationComplaintsSchema';
import AdminCommunicationComplaintAddModal from '@/app/frontend_admin/admin_communication/communication_complaints/components/AdminCommunicationComplaintsComplaintAddModal';
import AdminCommunicationEmptyState from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveEmptyState';
import { isFrontendDemoModeEnabled } from '@/app/frontend_admin/lib/runtimeFeatures';
import { ADMIN_COMMUNICATION_COMPLAINT_API_FIXTURE } from '@/app/frontend_admin/admin_communication/communication_complaints/mocks/AdminCommunicationComplaintsMSWHandlers';
import type { CStatus, Complaint } from '@/app/frontend_admin/admin_communication/communication_complaints/types/AdminCommunicationComplaintsComponentTypes';
import { AdminTablePagination } from '@/app/frontend_admin/components/ui/table/AdminTablePagination';


const TABS: (CStatus | 'All')[] = ['All', ADMIN_COMMUNICATION_COMPLAINT_STATUS.OPEN, ADMIN_COMMUNICATION_COMPLAINT_STATUS.IN_PROGRESS, ADMIN_COMMUNICATION_COMPLAINT_STATUS.RESOLVED];

export function AdminCommunicationComplaintsPage() {
  const t = useTranslations('ADMIN_COMMUNICATION');
  const locale = useLocale();
  const dateFnsLocale = locale === 'hi' ? hi : enUS;
  const formatComplaintDate = (value: string) => {
    if (!value || value === '—') return '—';
    const parsed = parseISO(value);
    return isValid(parsed) ? format(parsed, 'PP', { locale: dateFnsLocale }) : '—';
  };
  const isDemoMode = isFrontendDemoModeEnabled();
  const [tab, setTab]                   = useState<CStatus | 'All'>('All');
  const complaintsQuery = useAdminCommunicationComplaintsQuery(!isDemoMode);
  const apiComplaints = useMemo<Complaint[]>(() => (complaintsQuery.data ?? []).map((c) => ({ id: String(c.id), title: c.subject, student: '—', description: c.description, status: getAdminCommunicationComplaintStatus(c.status), date: c.createdAt.slice(0, 10), resolvedBy: '—', resolvedDate: '—', resolvedNote: '' })), [complaintsQuery.data]);
  const [demoComplaints, setDemoComplaints] = useState<Complaint[]>(() => isDemoMode ? ADMIN_COMMUNICATION_COMPLAINT_API_FIXTURE.map((complaint) => ({ id: String(complaint.id), title: complaint.subject, student: '—', description: complaint.description, status: getAdminCommunicationComplaintStatus(complaint.status), date: complaint.createdAt.slice(0, 10), resolvedBy: '—', resolvedDate: '—', resolvedNote: '' })) : []);
  const complaints = isDemoMode ? demoComplaints : apiComplaints;
  const [showAdd, setShowAdd]           = useState(false);
  const [viewItem, setViewItem]         = useState<Complaint | null>(null);
  const [resolveItem, setResolveItem]   = useState<Complaint | null>(null);
  const [resolveNote, setResolveNote]   = useState('');
  const [page, setPage]                 = useState(0);
  const [pageSize, setPageSize]         = useState(10);

  const isLoading = !isDemoMode && complaintsQuery.isPending;
  const errorMessage = !isDemoMode && complaintsQuery.isError ? t('COMPLAINT_UNKNOWN_ERROR') : null;
  const [toast, setToast]               = useState('');
  const toastTimeoutRef = useRef<number | null>(null);
  useEffect(() => () => { if (toastTimeoutRef.current !== null) window.clearTimeout(toastTimeoutRef.current); }, []);
  const complaintSchema = useMemo(() => createAdminCommunicationComplaintSchema({
    complaintTitleRequired: t('VALIDATION_COMPLAINT_TITLE_REQUIRED'),
    complaintDescriptionRequired: t('VALIDATION_COMPLAINT_DESCRIPTION_REQUIRED'),
  }), [t]);
  const complaintForm = useForm<AdminCommunicationComplaintFormValues>({
    resolver: zodResolver(complaintSchema),
    defaultValues: { student: '', anonymous: false, title: '', description: '' },
    mode: 'onBlur',
  });
  const openAdd = () => {
    complaintForm.reset({ student: '', anonymous: false, title: '', description: '' });
    setShowAdd(true);
  };
  const [expandedDesc, setExpandedDesc] = useState<string[]>([]);
  const showToast = (message: string) => {
    if (toastTimeoutRef.current !== null) window.clearTimeout(toastTimeoutRef.current);
    setToast(message);
    toastTimeoutRef.current = window.setTimeout(() => { setToast(''); toastTimeoutRef.current = null; }, 3000);
  };

  const filtered = tab === 'All' ? complaints : complaints.filter(c => c.status === tab);
  const paginated = useMemo(() => filtered.slice(page * pageSize, (page + 1) * pageSize), [filtered, page, pageSize]);

  const handleAdd = (values: AdminCommunicationComplaintFormValues) => {
    if (!isDemoMode) { showToast(t('COMPLAINT_SUBMISSION_BLOCKED')); return; }
    const now = format(new Date(), 'yyyy-MM-dd');
    const complaint: Complaint = { id: `CMP-DEMO-${Date.now()}`, title: values.title.trim(), student: values.anonymous ? t('COMPLAINT_ANONYMOUS') : values.student.trim() || t('COMPLAINT_UNKNOWN_STUDENT'), description: values.description.trim(), status: ADMIN_COMMUNICATION_COMPLAINT_STATUS.OPEN, date: now, resolvedBy: '—', resolvedDate: '—', resolvedNote: '' };
    setDemoComplaints((current) => [complaint, ...current]);
    setShowAdd(false);
    complaintForm.reset({ student: '', anonymous: false, title: '', description: '' });
    showToast(t('COMPLAINT_DEMO_CREATED', { title: complaint.title }));
  };

  const markInProgress = (id: string) => {
    if (!isDemoMode) { showToast(t('COMPLAINT_STATUS_UPDATE_BLOCKED')); return; }
    setDemoComplaints((current) => current.map((complaint) => complaint.id === id ? { ...complaint, status: ADMIN_COMMUNICATION_COMPLAINT_STATUS.IN_PROGRESS } : complaint));
    showToast(t('COMPLAINT_DEMO_STATUS_UPDATED'));
  };

  const handleResolve = () => {
    if (!resolveItem || !resolveNote.trim()) return;
    if (!isDemoMode) { showToast(t('COMPLAINT_RESOLUTION_BLOCKED')); return; }
    const resolvedDate = format(new Date(), 'yyyy-MM-dd');
    setDemoComplaints((current) => current.map((complaint) => complaint.id === resolveItem.id ? { ...complaint, status: ADMIN_COMMUNICATION_COMPLAINT_STATUS.RESOLVED, resolvedBy: t('DEMO_AUTHOR'), resolvedDate, resolvedNote: resolveNote.trim() } : complaint));
    showToast(t('COMPLAINT_DEMO_RESOLVED', { title: resolveItem.title }));
    setResolveItem(null);
    setResolveNote('');
  };

  const statusBadge = (s: CStatus) => {
    if (s === ADMIN_COMMUNICATION_COMPLAINT_STATUS.OPEN) return <span data-testid="admin_communication-page-state-001" className="inline-flex min-h-6 items-center gap-1 rounded-full border px-2 py-1 text-badge font-semibold whitespace-nowrap bg-danger-bg text-danger-text border-danger-bg">{t('COMPLAINT_STATUS_OPEN')}</span>;
    if (s === ADMIN_COMMUNICATION_COMPLAINT_STATUS.IN_PROGRESS) return <span data-testid="admin_communication-page-state-002" className="inline-flex min-h-6 items-center gap-1 rounded-full border px-2 py-1 text-badge font-semibold whitespace-nowrap bg-warning-bg text-warning-text border-warning-bg">{t('COMPLAINT_STATUS_IN_PROGRESS')}</span>;
    if (s === ADMIN_COMMUNICATION_COMPLAINT_STATUS.RESOLVED) return <span data-testid="admin_communication-page-state-003" className="inline-flex min-h-6 items-center gap-1 rounded-full border px-2 py-1 text-badge font-semibold whitespace-nowrap bg-success-bg text-success-text border-success-bg">{t('COMPLAINT_STATUS_RESOLVED')}</span>;
    return <span className="inline-flex min-h-6 items-center gap-1 rounded-full border px-2 py-1 text-badge font-semibold whitespace-nowrap bg-transparent text-text-secondary border-border">{t('COMPLAINT_STATUS_UNKNOWN')}</span>;
  };

  const toggleDesc = (id: string) =>
    setExpandedDesc(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  return (
    <div className="min-h-screen bg-page p-6 md:p-8">
      <p role="status" className={`mb-4 rounded-md border p-3 text-sm ${isDemoMode ? 'border-info bg-info-bg text-info-text' : 'border-warning-bg bg-warning-bg text-warning-text'}`}>{isDemoMode ? t('COMPLAINT_DEMO_BANNER') : t('COMPLAINT_ADD_API_UNAVAILABLE')}</p>
      {toast && <div className="fixed bottom-6 right-6 z-50 rounded-xl border border-border bg-card px-4 py-3 text-ui font-semibold text-text-primary shadow-toast" role="status" aria-live="polite" aria-atomic="true">{toast}</div>}

      {/* Complaint-entry UI is feature-owned and isolated from the list/detail orchestration. */}
      {showAdd && <AdminCommunicationComplaintAddModal form={complaintForm} onClose={() => setShowAdd(false)} onSubmit={handleAdd} isDemoMode={isDemoMode} />}

      {/* View Modal */}
      {viewItem && (
        <Dialog open onOpenChange={(nextOpen) => { if (!nextOpen) setViewItem(null); }}>
          <DialogContent className="relative w-full overflow-y-auto rounded-xl border border-border bg-overlay p-6 shadow-dialog max-w-[480px] space-y-4">
            <button type="button" aria-label={t('COMPLAINT_DIALOG_CLOSE_LABEL')} data-testid="admin_communication-page-control-007" onClick={() => setViewItem(null)} className="absolute right-4 top-4 inline-flex min-h-11 min-w-11 items-center justify-center rounded-md p-1 text-text-secondary hover:bg-surface-hover hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"><X size={18} strokeWidth={2}/></button>
            <DialogTitle className="mb-1.5 text-lg font-bold text-text-primary">{viewItem.title}</DialogTitle>
            <DialogDescription className="sr-only">{t('COMPLAINT_DIALOG_DESCRIPTION')}</DialogDescription>
            <div data-testid="admin_communication-page-state-008" className="mb-4 flex flex-wrap gap-2">
              {statusBadge(viewItem.status)}
              <span data-testid="admin_communication-page-state-009" className="inline-flex min-h-6 items-center gap-1 rounded-full border px-2 py-1 text-badge font-semibold whitespace-nowrap bg-transparent text-text-secondary border-border">{formatComplaintDate(viewItem.date)}</span>
            </div>
            <p className="mb-2 text-ui text-text-secondary">
              {t('LABEL_BY')} <span className="text-text-secondary">{viewItem.student}</span>
            </p>
            <p className="text-body text-text-primary">{viewItem.description}</p>
            {viewItem.resolvedNote && (
              <div className="rounded-lg border border-info-bg bg-info-bg p-3 text-ui text-info-text mt-4">
                {t('COMPLAINT_RESOLUTION_DETAILS', { note: viewItem.resolvedNote, by: viewItem.resolvedBy, date: formatComplaintDate(viewItem.resolvedDate) })}
              </div>
            )}
            <div className="mt-6 flex flex-wrap justify-end gap-2.5 border-border pt-3">
              <button type="button" data-testid="admin_communication-page-control-010" onClick={() => setViewItem(null)} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-ui font-medium text-text-primary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 motion-safe:transition-colors motion-safe:duration-base">{t('BUTTON_CLOSE')}</button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Resolve Modal */}
      {resolveItem && (
        <Dialog open onOpenChange={(nextOpen) => { if (!nextOpen) setResolveItem(null); }}>
          <DialogContent className="relative w-full overflow-y-auto rounded-xl border border-border bg-overlay p-6 shadow-dialog max-w-[480px] space-y-4">
            <button type="button" aria-label={t('COMPLAINT_DIALOG_CLOSE_LABEL')} data-testid="admin_communication-page-control-011" onClick={() => setResolveItem(null)} className="absolute right-4 top-4 inline-flex min-h-11 min-w-11 items-center justify-center rounded-md p-1 text-text-secondary hover:bg-surface-hover hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"><X size={18} strokeWidth={2}/></button>
            <DialogTitle className="mb-1.5 text-lg font-bold text-text-primary">{t('COMPLAINT_RESOLVE_TITLE')}</DialogTitle>
            <DialogDescription className="mb-5 text-ui text-text-secondary">&quot;{resolveItem.title}&quot;</DialogDescription>
            <div>
              <label className="mb-1.5 block text-badge font-semibold uppercase tracking-[0.07em] text-danger-text" htmlFor="admin-communication-resolution-note">{t('COMPLAINT_RESOLUTION_NOTE')} <span className="text-danger-text">*</span></label>
              <textarea id="admin-communication-resolution-note" className="min-h-24 w-full resize-y rounded-md border border-border bg-input px-3 py-2 text-body text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50" rows={3} placeholder={t('COMPLAINT_RESOLUTION_NOTE_PLACEHOLDER')} required
                value={resolveNote} onChange={e => setResolveNote(e.target.value)} />
            </div>
            <div className="mt-6 flex flex-wrap justify-end gap-2.5 border-border pt-3">
              <button type="button" data-testid="admin_communication-page-control-012" onClick={() => setResolveItem(null)} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-ui font-medium text-text-primary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 motion-safe:transition-colors motion-safe:duration-base">{t('BUTTON_CANCEL')}</button>
              <button type="button" data-testid="admin_communication-page-control-013" disabled={!isDemoMode || !resolveNote.trim()} title={!isDemoMode ? t('COMPLAINT_RESOLUTION_BLOCKED') : undefined} onClick={handleResolve} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-success bg-success px-4 py-2 text-body font-semibold text-on-success hover:bg-success focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary motion-safe:transition-colors motion-safe:duration-base disabled:cursor-not-allowed disabled:opacity-50">
                {t('BUTTON_MARK_RESOLVED')}
              </button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Header */}
      <div className="mb-8">
        <div className="mb-1.5 flex items-center gap-1.5 text-badge font-semibold uppercase tracking-[0.07em] text-text-secondary">
          <span>{t('BREADCRUMB_COMMUNICATION')}</span><ChevronRight size={18} strokeWidth={2} /><span>{t('COMPLAINTS_TITLE')}</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="flex items-center gap-3 text-2xl font-bold tracking-tight text-text-primary">💬 {t('COMPLAINTS_TITLE')}</h1>
            <p className="mt-1 text-ui text-text-secondary">{t('COMPLAINTS_SUBTITLE')}</p>
          </div>
          <button data-testid="admin_communication-page-control-014" onClick={openAdd} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-primary bg-primary px-4 py-2 text-body font-semibold text-on-primary hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 motion-safe:transition-colors motion-safe:duration-base">
            <Plus size={18}  strokeWidth={2}/> {t('COMPLAINTS_ADD_BUTTON')}
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="gap-1 rounded-lg border border-border bg-input p-1 inline-flex mb-6">
        {TABS.map((status) => (
          <button type="button" data-testid={`admin_communication-complaints-tab-${String(status).toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} key={status} onClick={() => { setTab(status); setPage(0); }} aria-pressed={tab === status} className={`inline-flex min-h-11 items-center rounded-md px-3 py-2 text-ui font-medium text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary${tab === status ? ' bg-card text-text-primary shadow-card' : ''}`}>
            {status === 'All' ? t('FILTER_ALL') : status === ADMIN_COMMUNICATION_COMPLAINT_STATUS.OPEN ? t('COMPLAINT_STATUS_OPEN') : status === ADMIN_COMMUNICATION_COMPLAINT_STATUS.IN_PROGRESS ? t('COMPLAINT_STATUS_IN_PROGRESS') : t('COMPLAINT_STATUS_RESOLVED')}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden p-0">
        {isLoading ? (
          <p role="status" aria-live="polite" className="p-8 text-center text-text-secondary">{t('COMPLAINT_LOADING')}</p>
        ) : errorMessage ? (
          <div role="alert" className="p-8 text-center text-danger-text">
            <p>{t('COMPLAINT_LOAD_ERROR_PREFIX')} {errorMessage}</p>
            <button type="button" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-ui font-medium text-text-primary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 motion-safe:transition-colors motion-safe:duration-base mt-3" onClick={() => { void complaintsQuery.refetch(); }}>{t('COMPLAINT_RETRY')}</button>
          </div>
        ) : filtered.length === 0 ? (
          <AdminCommunicationEmptyState
            icon={SearchX}
            testId="admin_communication-page-state-016"
            iconTestId="admin_communication-page-state-017"
            titleTestId="admin_communication-page-state-018"
            title={tab === 'All' ? t('COMPLAINT_EMPTY_ALL') : t('COMPLAINT_EMPTY_STATUS', { status: tab === ADMIN_COMMUNICATION_COMPLAINT_STATUS.OPEN ? t('COMPLAINT_STATUS_OPEN') : tab === ADMIN_COMMUNICATION_COMPLAINT_STATUS.IN_PROGRESS ? t('COMPLAINT_STATUS_IN_PROGRESS') : t('COMPLAINT_STATUS_RESOLVED') })}
            description={t('COMPLAINT_EMPTY_DESCRIPTION')}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-body text-left">
              <thead>
                <tr className="h-12 bg-surface-highlight uppercase text-xs text-text-secondary font-semibold border-b border-border">
                  <th className="py-3 px-4 text-left">{t('TABLE_NUMBER')}</th>
                  <th className="py-3 px-4 text-left">{t('TABLE_TITLE')}</th>
                  <th className="py-3 px-4 text-left">{t('TABLE_STUDENT')}</th>
                  <th className="py-3 px-4 text-left">{t('TABLE_DESCRIPTION')}</th>
                  <th className="py-3 px-4 text-left">{t('TABLE_STATUS')}</th>
                  <th className="py-3 px-4 text-left">{t('TABLE_DATE')}</th>
                  <th className="py-3 px-4 text-left">{t('TABLE_RESOLVED_BY')}</th>
                  <th className="py-3 px-4 text-left">{t('TABLE_RESOLVED_DATE')}</th>
                  <th className="py-3 px-4 text-right">{t('TABLE_ACTIONS')}</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((c, i) => {
                  const isExpanded = expandedDesc.includes(c.id);
                  const isLong = c.description.length > 60;
                  const globalIndex = page * pageSize + i;
                  return (
                    <tr key={c.id} className="h-12 border-b border-border text-text-primary motion-safe:transition-colors hover:bg-surface-hover even:bg-surface-zebra/30">
                      <td className="py-3 px-4 font-mono text-ui text-text-secondary">{globalIndex + 1}</td>
                      <td className="py-3 px-4 font-semibold">{c.title}</td>
                      <td className="py-3 px-4 text-text-secondary">{c.student}</td>
                      <td className="py-3 px-4">
                        <span id={`admin-communication-complaint-description-${c.id}`}>{isLong && !isExpanded ? c.description.slice(0, 60) + '…' : c.description}</span>
                        {isLong && (
                          <button type="button" aria-expanded={isExpanded} aria-controls={`admin-communication-complaint-description-${c.id}`} data-testid="admin_communication-page-control-019" onClick={() => toggleDesc(c.id)} className="inline-flex min-h-11 items-center rounded-md px-1.5 text-ui text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ml-1">
                            {isExpanded ? t('BUTTON_LESS') : t('BUTTON_MORE')}
                          </button>
                        )}
                      </td>
                      <td className="py-3 px-4">{statusBadge(c.status)}</td>
                      <td className="py-3 px-4 text-text-secondary">{formatComplaintDate(c.date)}</td>
                      <td className="py-3 px-4 text-text-secondary">{c.resolvedBy}</td>
                      <td className="py-3 px-4 text-text-secondary">{formatComplaintDate(c.resolvedDate)}</td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button data-testid={`admin_communication-complaint-view-${c.id}`} onClick={() => setViewItem(c)} className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border border-transparent text-text-secondary hover:bg-surface-hover hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 motion-safe:transition-colors motion-safe:duration-base" title={t('COMPLAINT_VIEW_ACTION')} aria-label={t('COMPLAINT_VIEW_ARIA', { title: c.title })}>
                            <Eye size={18}  strokeWidth={2}/>
                          </button>
                          {c.status === 'Open' && (
                            <button data-testid={`admin_communication-complaint-progress-${c.id}`} disabled={!isDemoMode} title={!isDemoMode ? t('COMPLAINT_STATUS_UPDATE_BLOCKED') : t('COMPLAINT_STATUS_IN_PROGRESS')} onClick={() => markInProgress(c.id)} className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border border-transparent text-text-secondary hover:bg-surface-hover hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary motion-safe:transition-colors motion-safe:duration-base disabled:cursor-not-allowed disabled:opacity-50" aria-label={t('COMPLAINT_MARK_IN_PROGRESS_ARIA', { title: c.title })}>
                              <RefreshCw size={18}  strokeWidth={2}/>
                            </button>
                          )}
                          {c.status !== 'Resolved' && (
                            <button data-testid={`admin_communication-complaint-resolve-${c.id}`} disabled={!isDemoMode} title={!isDemoMode ? t('COMPLAINT_RESOLUTION_BLOCKED') : t('COMPLAINT_RESOLVE_TITLE')} onClick={() => setResolveItem(c)} className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border border-transparent text-text-secondary hover:bg-surface-hover hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary motion-safe:transition-colors motion-safe:duration-base disabled:cursor-not-allowed disabled:opacity-50" aria-label={t('COMPLAINT_RESOLVE_ARIA', { title: c.title })}>
                              <CheckCircle size={18}  strokeWidth={2}/>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filtered.length > 0 && (
              <AdminTablePagination
                page={page}
                pageSize={pageSize}
                totalCount={filtered.length}
                onPageChange={setPage}
                onPageSizeChange={(newSize: number) => {
                  setPageSize(newSize);
                  setPage(0);
                }}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
