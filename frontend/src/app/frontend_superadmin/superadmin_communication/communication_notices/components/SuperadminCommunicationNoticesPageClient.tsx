'use client';

import { useSuperadminCommunicationNoticesConfirm } from '@/app/frontend_superadmin/superadmin_communication/communication_notices/hooks/useSuperadminCommunicationNoticesConfirm';
import { toast } from 'sonner';
/** Responsibility: Superadmin Communication Notices Page Client; keep this view focused on its named module UI responsibility and delegate domain/state logic to module-owned hooks. */
/** Data-Flow: canonical route -> SuperadminCommunicationNoticesPageClient -> leaf-owned query/API boundary -> runtime schema validation -> rendered success/loading/error states. */
import SuperadminCommunicationNoticesSemanticTable from '@/app/frontend_superadmin/superadmin_communication/communication_notices/components/SuperadminCommunicationNoticesSemanticTable';

import { useSuperadminCommunicationNoticesValidationMessage } from '@/app/frontend_superadmin/superadmin_communication/communication_notices/hooks/useSuperadminCommunicationNoticesValidationMessage';
import type { SemanticCellParams } from '@/app/frontend_superadmin/superadmin_communication/communication_notices/components/SuperadminCommunicationNoticesSemanticTable';
type ICellRendererParams = SemanticCellParams<Notice>;
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SuperadminCommunicationNoticeSchema, type SuperadminCommunicationNoticeFormValues } from '@/app/frontend_superadmin/superadmin_communication/communication_notices/schemas/SuperadminCommunicationNoticesNoticeSchema';
import { useSuperadminCommunicationNoticesQuery } from '@/app/frontend_superadmin/superadmin_communication/communication_notices/hooks/useSuperadminCommunicationNoticesQueries';
import type { SuperadminCommunicationNotice as Notice } from '@/app/frontend_superadmin/superadmin_communication/communication_notices/types/SuperadminCommunicationNoticesTypes';
import { SUPERADMIN_COMMUNICATION_NOTICES_QUERY_KEYS } from '@/app/frontend_superadmin/superadmin_communication/communication_notices/api/superadmin_communication_notices.query_keys';
import { useQueryClient } from '@tanstack/react-query';
import { ChevronRight, Plus, X, Edit2, Trash2, Send } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useSuperadminCommunicationNoticesUnsavedChangesGuard } from '@/app/frontend_superadmin/superadmin_communication/communication_notices/hooks/useSuperadminCommunicationNoticesUnsavedChangesGuard';



const today = new Date().toISOString().split('T')[0];

/** Derives a stable, non-index row identity for repeated interactive table controls. */
function getSuperadminInteractiveTestIdSuffix(value: unknown): string {
  const record = value && typeof value === 'object' ? value as Record<string, unknown> : {};
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
  const [showAdd, setShowAdd]             = useState(false);
  const [editItem, setEditItem]           = useState<Notice | null>(null);
  const [deleteItem, setDeleteItem]       = useState<Notice | null>(null);
  const [broadcastItem, setBroadcastItem] = useState<Notice | null>(null);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting , isDirty} } = useForm<SuperadminCommunicationNoticeFormValues>({ resolver: zodResolver(SuperadminCommunicationNoticeSchema), defaultValues: { title: '', message: '', validTill: '' } });
  useSuperadminCommunicationNoticesUnsavedChangesGuard(isDirty, tCopy('COPY.UNSAVED_CHANGES_WARNING'));
  const requestCloseAdd = async () => {
    if (isDirty && !await confirm(tCopy('COPY.UNSAVED_CHANGES_WARNING'))) return;
    reset({ title: '', message: '', validTill: '' });
    setEditItem(null);
    setShowAdd(false);
  };
  const showToast = (msg: string) => { toast.message(msg, { id: 'superadmin:superadmin_communication:SuperadminCommunicationNoticesPageClient:feedback' }); };

  const openAdd  = () => { reset({ title: '', message: '', validTill: '' }); setEditItem(null); setShowAdd(true); };
  const openEdit = (n: Notice) => { reset({ title: n.title, message: n.message, validTill: n.validTill }); setEditItem(n); setShowAdd(true); };

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

  const colDefs = [
    { field: 'title', headerName: tCopy('COPY.TITLE'), width: 220, cellRenderer: (p: ICellRendererParams) => <span className="eng-td-bold text-primary">{String(p.value || tCopy('COPY.UNKNOWN'))}</span> },
    { field: 'message', headerName: tCopy('COPY.MESSAGE'), flex: 1, minWidth: 250, cellRenderer: (p: ICellRendererParams) => <span className="eng-td-muted text-sm truncate block w-full pt-1" title={String(p.value ?? '')}>{String(p.value || tCopy('COPY.UNKNOWN'))}</span> },
    {
      field: 'status',
      headerName: tCopy('COPY.STATUS'),
      width: 120,
      cellRenderer: (p: ICellRendererParams) => (
        <span className={`eng-badge ${p.value === 'Active' ? 'eng-badge--success' : 'eng-badge--outline'} mt-2 inline-block`}>
          {p.value === 'Active' ? `✅ ${tCopy('COPY.ACTIVE_STATUS')}` : tCopy('COPY.EXPIRED_STATUS')}
        </span>
      )
    },
    { field: 'validTill', headerName: tCopy('COPY.VALID_TILL'), width: 130, cellRenderer: (p: ICellRendererParams) => <span className="eng-td-mono text-sm">{String(p.value || tCopy('COPY.UNKNOWN'))}</span> },
    { field: 'postedBy', headerName: tCopy('COPY.POSTED_BY'), width: 130, cellRenderer: (p: ICellRendererParams) => <span className="eng-td-muted text-sm">{String(p.value || tCopy('COPY.UNKNOWN'))}</span> },
    { field: 'postedDate', headerName: tCopy('COPY.POSTED_DATE'), width: 130, cellRenderer: (p: ICellRendererParams) => <span className="eng-td-mono text-sm">{String(p.value || tCopy('COPY.UNKNOWN'))}</span> },
    {
      headerName: tCopy('COPY.ACTIONS'),
      width: 140,
      sortable: false,
      cellRenderer: (params: ICellRendererParams) => (
        <div className="h-full flex items-center gap-2">
          <button type="button" onClick={() => openEdit(params.data)} className="eng-btn-icon hover:bg-primary hover:text-on-primary motion-safe:transition-colors motion-reduce:transition-none motion-safe:duration-200" title={tCopy("COPY.EDIT")} data-testid={`superadmin-communication-communication-notices-edit-1-${getSuperadminInteractiveTestIdSuffix(params.data)}`}><Edit2 size={14} /></button>
          <button type="button" onClick={() => setBroadcastItem(params.data)} className="eng-btn-icon hover:bg-primary hover:text-on-primary motion-safe:transition-colors motion-reduce:transition-none motion-safe:duration-200" title={tCopy("COPY.BROADCAST")} data-testid={`superadmin-communication-communication-notices-broadcast-2-${getSuperadminInteractiveTestIdSuffix(params.data)}`}><Send size={14} /></button>
          <button type="button" onClick={() => setDeleteItem(params.data)} className="eng-btn-icon eng-btn-icon--danger hover:bg-danger hover:text-on-danger motion-safe:transition-colors motion-reduce:transition-none motion-safe:duration-200" title={tCopy("COPY.DELETE")} data-testid={`superadmin-communication-communication-notices-delete-3-${getSuperadminInteractiveTestIdSuffix(params.data)}`}><Trash2 size={14} /></button>
        </div>
      )
    }
  ];

  return (
    <div className="eng-page" data-resource-id={id || undefined}>
      {noticesQuery.isError && <p className="eng-info-box mb-3" role="alert">{tCopy("COPY.COULD_NOT_LOAD_NOTICES_FROM_THE_CONFIGURED_ENDPOINT")} <button type="button" className="underline ml-2" onClick={() => { void queryClient.invalidateQueries({ queryKey: SUPERADMIN_COMMUNICATION_NOTICES_QUERY_KEYS.lists() }); void noticesQuery.refetch(); }} data-testid="superadmin-communication-communication-notices-retry-4">{tCopy("COPY.RETRY")}</button></p>}
      {noticesQuery.isPending && <p className="eng-info-box mb-3" role="status">{tCopy("COPY.LOADING_NOTICES")}</p>}
      <p className="eng-info-box mb-3" role="status">{tCopy("COPY.CREATE_EDIT_DELETE_AND_BROADCAST_ACTIONS_ARE_PREVIEW_ONLY_OR_UNAVAILABLE_UNTIL_APPROVED_WRITE_BROADCAST_CONTRACTS_ARE_SUPPLIED")}</p>

      {/* Add/Edit Modal */}
      {showAdd && (
        <div className="eng-overlay">
          <div className="eng-modal eng-modal--lg bg-card">
            <button type="button" onClick={requestCloseAdd} className="eng-modal-close hover:text-danger" aria-label={tCopy("COPY.CLOSE_ADD_EDIT_NOTICE_DIALOG")} data-testid="superadmin-communication-communication-notices-close-add-edit-notice-dialog-5"><X size={16} aria-hidden="true" /></button>
            <p className="eng-modal-title mb-4 font-bold text-primary">{editItem ? tCopy('COPY.EDIT_NOTICE_ACTION') : tCopy('COPY.POST_NOTICE_ACTION')}</p>
            <form onSubmit={handleSubmit(handleSave)} noValidate data-testid="superadmin-superadmin-communication-notices-page-client-form-line-119">
              <div className="eng-form-stack space-y-4">
                <div>
                  <label className="eng-label text-sm font-semibold mb-1 block" htmlFor="notice-title">{tCopy("COPY.TITLE")} <span className="eng-required text-danger">*</span></label>
                  <input id="notice-title" className="eng-input py-2 px-3 border rounded w-full" placeholder={tCopy("COPY.NOTICE_TITLE")} aria-invalid={Boolean(errors.title)} aria-describedby={errors.title ? 'notice-title-error' : undefined} {...register('title')}  data-testid="superadmin-communication-communication-notices-notice-title-6"/>
                  {errors.title && <p id="notice-title-error" className="text-xs text-danger" role="alert">{translateValidationMessage(errors.title.message)}</p>}
                </div>
                <div>
                  <label className="eng-label text-sm font-semibold mb-1 block" htmlFor="notice-message">{tCopy("COPY.MESSAGE")} <span className="eng-required text-danger">*</span></label>
                  <textarea id="notice-message" className="eng-textarea py-2 px-3 border rounded w-full" rows={6} placeholder={tCopy("COPY.NOTICE_MESSAGE")} aria-invalid={Boolean(translateValidationMessage(errors.message))} aria-describedby={translateValidationMessage(errors.message) ? 'notice-message-error' : undefined} {...register('message')}  data-testid="superadmin-communication-communication-notices-notice-message-7"/>
                  {translateValidationMessage(errors.message) && <p id="notice-message-error" className="text-xs text-danger" role="alert">{translateValidationMessage(errors.message.message)}</p>}
                </div>
                <div>
                  <label className="eng-label text-sm font-semibold mb-1 block" htmlFor="notice-valid-till">{tCopy("COPY.VALID_TILL")} <span className="eng-required text-danger">*</span></label>
                  <input id="notice-valid-till" type="date" className="eng-input py-2 px-3 border rounded w-full" min={today} aria-invalid={Boolean(errors.validTill)} aria-describedby={errors.validTill ? 'notice-valid-till-error' : undefined} {...register('validTill')}  data-testid="superadmin-communication-communication-notices-notice-valid-till-8"/>
                  {errors.validTill && <p id="notice-valid-till-error" className="text-xs text-danger" role="alert">{translateValidationMessage(errors.validTill.message)}</p>}
                </div>
              </div>
              <div className="eng-modal-footer mt-6 flex justify-end gap-3">
                <button type="button" onClick={requestCloseAdd} className="px-4 py-2 border border-border text-primary rounded hover:bg-card motion-safe:transition-colors motion-reduce:transition-none" data-testid="superadmin-communication-communication-notices-cancel-9">{tCopy("COPY.CANCEL")}</button>
                <button type="submit" className="px-4 py-2 bg-primary text-on-primary rounded hover:bg-primary-hover motion-safe:transition-colors motion-reduce:transition-none disabled:opacity-50 disabled:cursor-not-allowed" disabled={isSubmitting} data-testid="superadmin-communication-communication-notices-update-notice-preview-10">
                  {editItem ? tCopy('COPY.UPDATE_NOTICE_PREVIEW') : tCopy('COPY.POST_NOTICE_PREVIEW')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteItem && (
        <div className="eng-overlay">
          <div className="eng-modal eng-modal--sm bg-card">
            <p className="eng-modal-title mb-2 font-bold text-primary">{tCopy("COPY.DELETE_NOTICE")}</p>
            <p className="eng-modal-desc text-sm text-secondary" id="notice-delete-unavailable">{tCopy("COPY.NOTICE_DELETE_UNAVAILABLE_NO_CHANGE")}</p>
            <div className="eng-modal-footer mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setDeleteItem(null)} className="px-4 py-2 border border-border text-primary rounded hover:bg-card motion-safe:transition-colors motion-reduce:transition-none" data-testid="superadmin-communication-communication-notices-cancel-11">{tCopy("COPY.CANCEL")}</button>
              <button type="button" onClick={handleDelete} disabled title={tCopy("COPY.NOTICE_DELETE_UNAVAILABLE_NO_CHANGE")} aria-describedby="notice-delete-unavailable" className="px-4 py-2 bg-danger text-on-danger rounded hover:bg-danger hover:text-on-danger motion-safe:transition-colors motion-reduce:transition-none disabled:opacity-50 disabled:cursor-not-allowed" data-testid="superadmin-communication-communication-notices-delete-12">{tCopy("COPY.DELETE")}</button>
            </div>
          </div>
        </div>
      )}

      {/* Broadcast Confirmation */}
      {broadcastItem && (
        <div className="eng-overlay">
          <div className="eng-modal eng-modal--sm bg-card">
            <p className="eng-modal-title mb-2 font-bold text-primary">{tCopy("COPY.BROADCAST_VIA_WHATSAPP")}</p>
            <p className="eng-modal-desc text-sm text-secondary" id="notice-broadcast-unavailable">{tCopy("COPY.NOTICE_BROADCAST_UNAVAILABLE_NO_CHANGE")}</p>
            <div className="eng-modal-footer mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setBroadcastItem(null)} className="px-4 py-2 border border-border text-primary rounded hover:bg-card motion-safe:transition-colors motion-reduce:transition-none" data-testid="superadmin-communication-communication-notices-cancel-13">{tCopy("COPY.CANCEL")}</button>
              <button type="button" onClick={handleBroadcast} disabled title={tCopy("COPY.NOTICE_BROADCAST_UNAVAILABLE_NO_CHANGE")} aria-describedby="notice-broadcast-unavailable" className="px-4 py-2 bg-primary text-on-primary rounded hover:bg-primary-hover motion-safe:transition-colors motion-reduce:transition-none disabled:opacity-50 disabled:cursor-not-allowed" data-testid="superadmin-communication-communication-notices-broadcast-14">{tCopy("COPY.BROADCAST")}</button>
            </div>
          </div>
        </div>
      )}

      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="eng-breadcrumb mb-2">
            <span>{tCopy("COPY.COMMUNICATION")}</span><ChevronRight size={12} /><span>{tCopy("COPY.NOTICES")}</span>
          </div>
          <h1 className="eng-page-title text-2xl font-bold text-primary">{tCopy("COPY.NOTICE_BOARD")}</h1>
          <p className="eng-page-subtitle text-secondary">{tCopy("COPY.POST_AND_MANAGE_LIBRARY_NOTICES_FOR_STUDENTS")}</p>
        </div>
        <button type="button" onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded hover:bg-primary-hover motion-safe:transition-colors motion-reduce:transition-none font-medium" data-testid="superadmin-communication-communication-notices-post-notice-15">
          <Plus size={16} /> {tCopy("COPY.POST_NOTICE")}
        </button>
      </div>

      <div className="eng-card eng-card--flush p-4">
        {noticesQuery.isPending || noticesQuery.isError ? null : notices.length === 0 ? (
          <div className="eng-empty py-12 flex flex-col items-center justify-center text-center">
            <div className="eng-empty__icon text-4xl mb-4">📢</div>
            <p className="eng-empty__title text-lg font-semibold text-primary mb-4">{tCopy("COPY.NO_NOTICES_POSTED_YET")}</p>
            <button type="button" onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded hover:bg-primary-hover motion-safe:transition-colors motion-reduce:transition-none font-medium" data-testid="superadmin-communication-communication-notices-post-notice-16">
              <Plus size={16} /> {tCopy("COPY.POST_NOTICE")}
            </button>
          </div>
        ) : (
          <div className="mgr-table-wrapper h-125">
            <SuperadminCommunicationNoticesSemanticTable
             
              rowData={notices}
              columnDefs={colDefs}
              rowHeight={56}
              headerHeight={48}
              pagination={true}
              paginationPageSize={10}
              defaultColDef={{
                sortable: true,
                filter: true,
                resizable: true
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
