'use client';
import SuperadminSupportComplaintsEmptyState from '@/app/frontend_superadmin/superadmin_support/support_complaints/components/SuperadminSupportComplaintsEmptyState';
import { toast } from 'sonner';
/** Responsibility: Superadmin Communication Complaints Page Client; keep this view focused on its named module UI responsibility and delegate domain/state logic to module-owned hooks. */
/** Data-Flow: canonical route -> SuperadminSupportComplaintsPageClient -> leaf-owned query/API boundary -> runtime schema validation -> rendered success/loading/error states. */
import { useSuperadminSupportComplaintsValidationMessage } from '@/app/frontend_superadmin/superadmin_support/support_complaints/hooks/useSuperadminSupportComplaintsValidationMessage';
import { useEffect, useRef, useState } from 'react';
import { useSuperadminSupportComplaintsDialog } from '@/app/frontend_superadmin/superadmin_support/support_complaints/hooks/useSuperadminSupportComplaintsDialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SuperadminSupportComplaintSchema, type SuperadminSupportComplaintFormValues } from '@/app/frontend_superadmin/superadmin_support/support_complaints/schemas/SuperadminSupportComplaintsComplaintSchema';
import { useSuperadminSupportComplaintsQuery } from '@/app/frontend_superadmin/superadmin_support/support_complaints/hooks/useSuperadminSupportComplaintsQueries';
import type { SuperadminSupportComplaint as Complaint, SuperadminSupportComplaintStatus as CStatus, SuperadminSupportComplaintStatusFilter } from '@/app/frontend_superadmin/superadmin_support/support_complaints/types/SuperadminSupportComplaintsTypes';
import { SUPERADMIN_SUPPORT_COMPLAINTS_QUERY_KEYS } from '@/app/frontend_superadmin/superadmin_support/support_complaints/api/superadmin_support_complaints.query_keys';
import { useQueryClient } from '@tanstack/react-query';
import { ChevronRight, Plus, X, Eye, RefreshCw, CheckCircle } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import SuperadminSupportComplaintsListSkeleton from '@/app/frontend_superadmin/superadmin_support/support_complaints/components/SuperadminSupportComplaintsListSkeleton';
import { formatSuperadminSupportComplaintDate } from '@/app/frontend_superadmin/superadmin_support/support_complaints/utils/SuperadminSupportComplaintsDateFormatter';
import { useSuperadminSupportComplaintsUnsavedChangesGuard } from '@/app/frontend_superadmin/superadmin_support/support_complaints/hooks/useSuperadminSupportComplaintsUnsavedChangesGuard';
import { SUPERADMIN_SUPPORT_COMPLAINT_STATUS, SUPERADMIN_SUPPORT_COMPLAINT_STATUS_FILTERS } from '@/app/frontend_superadmin/superadmin_support/support_complaints/constants/SuperadminSupportComplaintsStaticConstants';



/**
 * Renders the `superadmin_communication` view owned by `SuperadminSupportComplaintsPageClient`.
 * Owns local UI state for `tab`, `urlStateReady`, `showAdd`, `viewItem`, `resolveItem` and related form/selection state.
 * Reads module-owned query state and must keep loading, error, empty, and retry behavior distinct where the query exposes those states.
 * Effect lifecycle boundaries are `[]`, `[tab, urlStateReady]`.
 */
export default function SuperadminSupportComplaintsPageClient({ id }: { id?: string } = {}) {
  const tCopy = useTranslations('SUPERADMIN_COMMUNICATION');
  const locale = useLocale();
  const translateValidationMessage = useSuperadminSupportComplaintsValidationMessage();
  const queryClient = useQueryClient();
  const complaintsQuery = useSuperadminSupportComplaintsQuery();
  const complaints = complaintsQuery.data ?? [];
  const [tab, setTab]                   = useState<SuperadminSupportComplaintStatusFilter>('All');
  const [urlStateReady, setUrlStateReady] = useState(false);
  // Effect contract: hydrate URL-backed filter or route state from the current query string on mount; dependency set [] (intentional mount-only effect) is the deliberate re-run boundary.
  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get('status');
    
    setTab(SUPERADMIN_SUPPORT_COMPLAINT_STATUS_FILTERS.includes(requested as SuperadminSupportComplaintStatusFilter) ? requested as SuperadminSupportComplaintStatusFilter : 'All');
    setUrlStateReady(true);
  }, []);
  // Effect contract: serialize the current filter or view state into the URL only after initial URL hydration; dependency set [tab, urlStateReady] is the deliberate re-run boundary.
  useEffect(() => {
    if (!urlStateReady) return;
    const url = new URL(window.location.href);
    if (tab === 'All') url.searchParams.delete('status');
    else url.searchParams.set('status', tab);
    window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}${url.hash}`);
  }, [tab, urlStateReady]);
  const [showAdd, setShowAdd]           = useState(false);
  const [viewItem, setViewItem]         = useState<Complaint | null>(null);
  const [resolveItem, setResolveItem]   = useState<Complaint | null>(null);
  const [resolveNote, setResolveNote]   = useState('');
  const { register, handleSubmit, reset, formState: { errors, isSubmitting , isDirty} } = useForm<SuperadminSupportComplaintFormValues>({ resolver: zodResolver(SuperadminSupportComplaintSchema), defaultValues: { student: '', anonymous: false, title: '', description: '' } });
  const { confirmLeave } = useSuperadminSupportComplaintsUnsavedChangesGuard(isDirty, tCopy('COPY.UNSAVED_CHANGES_WARNING'));
  const closeRequestPendingRef = useRef(false);
  const requestCloseAdd = async () => {
    if (closeRequestPendingRef.current) return;
    closeRequestPendingRef.current = true;
    try { if (await confirmLeave()) setShowAdd(false); }
    finally { closeRequestPendingRef.current = false; }
  };
  const [expandedDesc, setExpandedDesc] = useState<string[]>([]);
  const addDialogRef = useSuperadminSupportComplaintsDialog(showAdd, () => { void requestCloseAdd(); });
  const viewDialogRef = useSuperadminSupportComplaintsDialog(Boolean(viewItem), () => setViewItem(null));
  const resolveDialogRef = useSuperadminSupportComplaintsDialog(Boolean(resolveItem), () => setResolveItem(null));

  const showToast = (msg: string) => { toast.message(msg, { id: 'superadmin:superadmin_communication:SuperadminSupportComplaintsPageClient:feedback' }); };

  const filtered = tab === 'All' ? complaints : complaints.filter(c => c.status === tab);

  const handleAdd = (_values: SuperadminSupportComplaintFormValues) => {
    showToast(tCopy('COPY.TOAST_COMPLAINT_WRITE_API_UNAVAILABLE'));
  };

  const markInProgress = (_id: string) => {
    showToast(tCopy('COPY.TOAST_COMPLAINT_WRITE_API_UNAVAILABLE'));
  };

  const handleResolve = () => {
    if (!resolveItem || !resolveNote) return;
    showToast(tCopy('COPY.TOAST_COMPLAINT_WRITE_API_UNAVAILABLE'));
  };

  const statusBadge = (s: CStatus) => {
    if (s === SUPERADMIN_SUPPORT_COMPLAINT_STATUS.OPEN) return <span className="eng-badge eng-badge--danger">{tCopy("COPY.OPEN")}</span>;
    if (s === SUPERADMIN_SUPPORT_COMPLAINT_STATUS.IN_PROGRESS) return <span className="eng-badge eng-badge--warning">{tCopy("COPY.IN_PROGRESS")}</span>;
    if (s === SUPERADMIN_SUPPORT_COMPLAINT_STATUS.UNKNOWN) return <span className="eng-badge eng-badge--neutral">{tCopy("COPY.UNKNOWN_STATUS")}</span>;
    return <span className="eng-badge eng-badge--success">{tCopy("COPY.RESOLVED")}</span>;
  };

  const toggleDesc = (id: string) =>
    setExpandedDesc(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  return (
    <div className="eng-page" data-resource-id={id || undefined}>
      {!complaintsQuery.isPending && !complaintsQuery.isError && filtered.length === 0 && <SuperadminSupportComplaintsEmptyState filtered />}

      <p className="eng-info-box mb-3" role="status">{tCopy('COPY.TOAST_COMPLAINT_WRITE_API_UNAVAILABLE')}</p>
      {complaintsQuery.isError && <p className="eng-info-box mb-3" role="alert">{tCopy("COPY.COULD_NOT_LOAD_COMPLAINTS_FROM_THE_CONFIGURED_ENDPOINT")} <button type="button" className="underline ml-2" onClick={() => { void queryClient.invalidateQueries({ queryKey: SUPERADMIN_SUPPORT_COMPLAINTS_QUERY_KEYS.lists() }); void complaintsQuery.refetch(); }} data-testid="superadmin-communication-communication-complaints-retry-1">{tCopy("COPY.RETRY")}</button></p>}
      <p className="eng-info-box mb-4" role="status">{tCopy("COPY.COMPLAINT_STATUS_AND_CREATION_CHANGES_ARE_LOCAL_PREVIEW_ONLY_THE_SUPPLIED_PACKAGE_CONTAINS_NO_VERIFIED_WRITE_CONTRACT")}</p>

      {/* Add Complaint Modal */}
      {showAdd && (
        <div className="eng-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) void requestCloseAdd(); }}>
          <div ref={addDialogRef} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="complaint-add-dialog-title" className="eng-modal eng-modal--md">
            <button type="button" onClick={requestCloseAdd} className="eng-modal-close" aria-label={tCopy("COPY.CLOSE_ADD_COMPLAINT_DIALOG")} data-testid="superadmin-communication-communication-complaints-close-add-complaint-dialog-2"><X size={16} /></button>
            <p id="complaint-add-dialog-title" className="eng-modal-title">{tCopy("COPY.ADD_COMPLAINT_2")}</p>
            <p className="eng-modal-desc">{tCopy("COPY.STAFF_RAISES_COMPLAINT_ON_STUDENT_APOS_S_BEHALF")}</p>
            <form className="space-y-4" onSubmit={handleSubmit(handleAdd)} noValidate data-testid="superadmin-superadmin-communication-complaints-page-client-form-line-106">
              <div className="eng-form-stack">
                <div>
                  <label className="eng-label" htmlFor="complaint-student">{tCopy("COPY.STUDENT_OPTIONAL")}</label>
                  <input id="complaint-student" className="eng-input" placeholder={tCopy("COPY.SEARCH_STUDENT_NAME")} {...register('student')}  data-testid="superadmin-communication-communication-complaints-complaint-student-3"/>
                  {errors.student && <p className="text-xs text-danger" role="alert">{translateValidationMessage(errors.student.message)}</p>}
                </div>
                <label className="eng-checkbox-row" htmlFor="complaint-anonymous">
                  <input id="complaint-anonymous" type="checkbox" {...register('anonymous')}  data-testid="superadmin-communication-communication-complaints-complaint-anonymous-4"/>
                  {tCopy("COPY.HIDE_STUDENT_IDENTITY_FROM_STAFF_VIEW")}
                </label>
                <div>
                  <label className="eng-label" htmlFor="complaint-title">{tCopy("COPY.TITLE")} <span className="eng-required">*</span></label>
                  <input id="complaint-title" className="eng-input" placeholder={tCopy("COPY.BRIEF_COMPLAINT_TITLE")} aria-invalid={Boolean(errors.title)} aria-describedby={errors.title ? 'complaint-title-error' : undefined} {...register('title')}  data-testid="superadmin-communication-communication-complaints-complaint-title-5"/>
                  {errors.title && <p id="complaint-title-error" className="text-xs text-danger" role="alert">{translateValidationMessage(errors.title.message)}</p>}
                </div>
                <div>
                  <label className="eng-label" htmlFor="complaint-description">{tCopy("COPY.DESCRIPTION")} <span className="eng-required">*</span></label>
                  <textarea id="complaint-description" className="eng-textarea" rows={4} placeholder={tCopy("COPY.DESCRIBE_THE_ISSUE_IN_DETAIL")} aria-invalid={Boolean(errors.description)} aria-describedby={errors.description ? 'complaint-description-error' : undefined} {...register('description')}  data-testid="superadmin-communication-communication-complaints-complaint-description-6"/>
                  {errors.description && <p id="complaint-description-error" className="text-xs text-danger" role="alert">{translateValidationMessage(errors.description.message)}</p>}
                </div>
              </div>
              <div className="eng-modal-footer">
                <button type="button" onClick={requestCloseAdd} className="eng-btn-ghost" data-testid="superadmin-communication-communication-complaints-cancel-7">{tCopy("COPY.CANCEL")}</button>
                <button type="submit" className="eng-btn-primary" disabled={isSubmitting} data-testid="superadmin-communication-communication-complaints-submit-complaint-preview-8">{tCopy("COPY.SUBMIT_COMPLAINT_PREVIEW")}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewItem && (
        <div className="eng-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) setViewItem(null); }}>
          <div ref={viewDialogRef} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="complaint-view-dialog-title" className="eng-modal eng-modal--md">
            <button type="button" onClick={() => setViewItem(null)} className="eng-modal-close" aria-label={tCopy("COPY.CLOSE_COMPLAINT_DETAILS_DIALOG")} data-testid="superadmin-communication-communication-complaints-close-complaint-details-dialog-9"><X size={16} /></button>
            <p id="complaint-view-dialog-title" className="eng-modal-title">{viewItem.title || tCopy('COPY.UNTITLED_COMPLAINT')}</p>
            <div className="eng-modal-badge-row">
              {statusBadge(viewItem.status)}
              <span className="eng-badge eng-badge--outline">{formatSuperadminSupportComplaintDate(viewItem.date, locale) || tCopy('COPY.UNKNOWN')}</span>
            </div>
            <p className="eng-complaint-by">
              {tCopy("COPY.BY")} <span className={viewItem.isAnonymous ? 'eng-complaint-anon' : 'eng-complaint-named'}>
                {viewItem.isAnonymous ? tCopy('COPY.ANONYMOUS') : viewItem.student || tCopy('COPY.UNKNOWN')}
              </span>
            </p>
            <p className="eng-complaint-desc">{viewItem.description}</p>
            {viewItem.resolvedNote && (
              <div className="eng-info-box mt-4">
                <strong>{tCopy("COPY.RESOLUTION")}</strong> {viewItem.resolvedNote} — {viewItem.resolvedBy || tCopy('COPY.UNKNOWN')} {tCopy("COPY.ON")} {formatSuperadminSupportComplaintDate(viewItem.resolvedDate, locale) || tCopy('COPY.UNKNOWN')}
              </div>
            )}
            <div className="eng-modal-footer">
              <button type="button" onClick={() => setViewItem(null)} className="eng-btn-ghost" data-testid="superadmin-communication-communication-complaints-close-10">{tCopy("COPY.CLOSE")}</button>
            </div>
          </div>
        </div>
      )}

      {/* Resolve Modal */}
      {resolveItem && (
        <div className="eng-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) setResolveItem(null); }}>
          <div ref={resolveDialogRef} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="complaint-resolve-dialog-title" className="eng-modal eng-modal--md">
            <button type="button" onClick={() => setResolveItem(null)} className="eng-modal-close" aria-label={tCopy("COPY.CLOSE_RESOLVE_COMPLAINT_DIALOG")} data-testid="superadmin-communication-communication-complaints-close-resolve-complaint-dialog-11"><X size={16} /></button>
            <p id="complaint-resolve-dialog-title" className="eng-modal-title">{tCopy("COPY.RESOLVE_COMPLAINT")}</p>
            <p className="eng-modal-desc">&quot;{resolveItem.title}&quot;</p>
            <div>
              <label className="eng-label" htmlFor="superadmin-superadmincommunicationcomplaintspageclient-154-textarea">{tCopy("COPY.RESOLUTION_NOTE")} <span className="eng-required">*</span></label>
              <textarea id="superadmin-superadmincommunicationcomplaintspageclient-154-textarea" className="eng-textarea" rows={3} placeholder={tCopy("COPY.DESCRIBE_HOW_THE_ISSUE_WAS_RESOLVED")}
                value={resolveNote} onChange={e => setResolveNote(e.target.value)}  data-testid="superadmin-communication-communication-complaints-superadmin-superadmincommunicationcomplaintspageclient-154-textarea-12"/>
            </div>
            <div className="eng-modal-footer">
              <button type="button" onClick={() => setResolveItem(null)} className="eng-btn-ghost" data-testid="superadmin-communication-communication-complaints-cancel-13">{tCopy("COPY.CANCEL")}</button>
              <button type="button" onClick={handleResolve} className="eng-btn-success disabled:opacity-50 disabled:cursor-not-allowed" disabled title={tCopy("COPY.TOAST_COMPLAINT_WRITE_API_UNAVAILABLE")} data-testid="superadmin-communication-communication-complaints-mark-resolved-14">
                {tCopy("COPY.MARK_RESOLVED")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <div className="eng-breadcrumb">
          <span>{tCopy("COPY.COMMUNICATION")}</span><ChevronRight size={12} /><span>{tCopy("COPY.COMPLAINTS")}</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="eng-page-title">{tCopy("COPY.COMPLAINTS_2")}</h1>
            <p className="eng-page-subtitle">{tCopy("COPY.TRACK_AND_RESOLVE_STUDENT_COMPLAINTS")}</p>
          </div>
          <button type="button" onClick={() => setShowAdd(true)} className="eng-btn-primary" data-testid="superadmin-communication-communication-complaints-add-complaint-15">
            <Plus size={16} /> {tCopy("COPY.ADD_COMPLAINT")}
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="eng-tabs eng-tabs-inline mb-6">
        {SUPERADMIN_SUPPORT_COMPLAINT_STATUS_FILTERS.map((t) => (
          <button type="button" key={t} aria-pressed={tab === t} onClick={() => setTab(t)} className={`eng-tab${tab === t ? ' eng-tab--active' : ''}`} data-testid={`superadmin-communication-communication-complaints-all-16-${String(t)}`}>
            {t === 'All' ? tCopy('COPY.ALL') : t === SUPERADMIN_SUPPORT_COMPLAINT_STATUS.OPEN ? tCopy('COPY.OPEN') : t === SUPERADMIN_SUPPORT_COMPLAINT_STATUS.IN_PROGRESS ? tCopy('COPY.IN_PROGRESS') : tCopy('COPY.RESOLVED')}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="eng-card eng-card--flush">
        {complaintsQuery.isPending ? <SuperadminSupportComplaintsListSkeleton /> : complaintsQuery.isError ? null : filtered.length === 0 ? (
          <div className="eng-empty">
            <div className="eng-empty__icon">😊</div>
            <p className="eng-empty__title">{tCopy("COPY.NO_COMPLAINTS_MATCH_CURRENT_FILTERS")}</p>
          </div>
        ) : (
          <div className="eng-scroll-x">
            <table className="eng-table">
              <thead>
                <tr>
                  <th>#</th><th>{tCopy("COPY.TITLE")}</th><th>{tCopy("COPY.STUDENT")}</th><th>{tCopy("COPY.DESCRIPTION")}</th>
                  <th>{tCopy("COPY.STATUS")}</th><th>{tCopy("COPY.DATE")}</th><th>{tCopy("COPY.RESOLVED_BY")}</th><th>{tCopy("COPY.RESOLVED_DATE")}</th><th>{tCopy("COPY.ACTIONS")}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c, i) => {
                  const isExpanded = expandedDesc.includes(c.id);
                  const isLong = c.description.length > 60;
                  return (
                    <tr key={c.id}>
                      <td className="eng-td-mono" data-label="#">{i + 1}</td>
                      <td className="eng-td-bold" data-label={tCopy("COPY.TITLE")}>{c.title || tCopy('COPY.UNTITLED_COMPLAINT')}</td>
                      <td data-label={tCopy("COPY.STUDENT")} className={c.isAnonymous ? 'eng-td-italic-muted' : ''}>{c.isAnonymous ? tCopy('COPY.ANONYMOUS') : c.student || tCopy('COPY.UNKNOWN')}</td>
                      <td data-label={tCopy("COPY.DESCRIPTION")}>
                        <span>{isLong && !isExpanded ? c.description.slice(0, 60) + '…' : c.description}</span>
                        {isLong && (
                          <button type="button" onClick={() => toggleDesc(c.id)} className="eng-link-btn ml-1" data-testid={`superadmin-communication-communication-complaints-less-17-${String(c.id)}`}>
                            {isExpanded ? tCopy('COPY.LESS') : tCopy('COPY.MORE')}
                          </button>
                        )}
                      </td>
                      <td data-label={tCopy("COPY.STATUS")}>{statusBadge(c.status)}</td>
                      <td className="eng-td-muted" data-label={tCopy("COPY.DATE")}>{formatSuperadminSupportComplaintDate(c.date, locale) || tCopy('COPY.UNKNOWN')}</td>
                      <td className="eng-td-muted" data-label={tCopy("COPY.RESOLVED_BY")}>{c.resolvedBy || tCopy('COPY.UNKNOWN')}</td>
                      <td className="eng-td-muted" data-label={tCopy("COPY.RESOLVED_DATE")}>{formatSuperadminSupportComplaintDate(c.resolvedDate, locale) || tCopy('COPY.UNKNOWN')}</td>
                      <td data-label={tCopy("COPY.ACTIONS")}>
                        <div className="flex items-center gap-1">
                          <button type="button" onClick={() => setViewItem(c)} className="eng-btn-icon" title={tCopy("COPY.VIEW")} data-testid={`superadmin-communication-communication-complaints-view-18-${String(c.id)}`}>
                            <Eye size={14} />
                          </button>
                          {c.status === SUPERADMIN_SUPPORT_COMPLAINT_STATUS.OPEN && (
                            <button type="button" onClick={() => markInProgress(c.id)} disabled title={tCopy("COPY.TOAST_COMPLAINT_WRITE_API_UNAVAILABLE")} className="eng-btn-icon disabled:opacity-50 disabled:cursor-not-allowed" data-testid={`superadmin-communication-communication-complaints-mark-in-progress-19-${String(c.id)}`}>
                              <RefreshCw size={14} />
                            </button>
                          )}
                          {c.status !== SUPERADMIN_SUPPORT_COMPLAINT_STATUS.RESOLVED && (
                            <button type="button" onClick={() => setResolveItem(c)} className="eng-btn-icon" title={tCopy("COPY.RESOLVE")} data-testid={`superadmin-communication-communication-complaints-resolve-20-${String(c.id)}`}>
                              <CheckCircle size={14} />
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
        )}
      </div>
    </div>
  );
}
