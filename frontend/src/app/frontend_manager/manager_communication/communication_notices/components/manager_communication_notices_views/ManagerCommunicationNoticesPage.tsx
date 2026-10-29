'use client';
import type { ManagerCommunicationNoticesMainProps } from '@/app/frontend_manager/manager_communication/communication_notices/types/ManagerCommunicationNoticesMainTypes';
import { useTranslations } from 'next-intl';
import ManagerCommunicationNoticesNativeTable, { type NativeColumn, type NativeCellParams } from '@/app/frontend_manager/manager_communication/communication_notices/components/manager_communication_notices_table_parts/ManagerCommunicationNoticesNativeTable';

import { ChevronRight, Edit2, Trash2, Send, RefreshCw } from 'lucide-react';
import { useManagerCommunicationNotices } from '@/app/frontend_manager/manager_communication/communication_notices/hooks/useManagerCommunicationNoticesNotices';


// RESPONSIBILITY: Render the communication_notices feature while preserving supported deep-link query state.
// DATA FLOW: Route searchParams -> Main props -> this view's route context.
export default function ManagerCommunicationNoticesPage({ view, id, name, phone, smartId }: ManagerCommunicationNoticesMainProps) {
  const tManagerUi = useTranslations('manager.manager_notices.ui');
  const { notices, isPending, isError, refetch } = useManagerCommunicationNotices();

  const colDefs: NativeColumn[] = [
    { field: 'title', headerName: tManagerUi('title'), width: 220, cellRenderer: (p: NativeCellParams) => <span className="mc-td-bold text-primary">{p.value}</span> },
    { field: 'message', headerName: tManagerUi('message'), flex: 1, minWidth: 250, cellRenderer: (p: NativeCellParams) => <span className="mc-td-muted text-sm truncate block w-full pt-1" title={String(p.value ?? '')}>{p.value}</span> },
    { field: 'status', headerName: tManagerUi('status'), width: 120, cellRenderer: (p: NativeCellParams) => <span className={`mc-badge ${p.value === 'Active' ? 'mc-badge--success' : 'mc-badge--outline'} mt-2 inline-block`}>{p.value === 'Active' ? tManagerUi('active') : tManagerUi('expired')}</span> },
    { field: 'validTill', headerName: tManagerUi('valid_till'), width: 130, cellRenderer: (p: NativeCellParams) => <span className="mc-td-mono text-sm">{p.value}</span> },
    { field: 'postedBy', headerName: tManagerUi('posted_by'), width: 130, cellRenderer: (p: NativeCellParams) => <span className="mc-td-muted text-sm">{p.value}</span> },
    { field: 'postedDate', headerName: tManagerUi('posted_date'), width: 130, cellRenderer: (p: NativeCellParams) => <span className="mc-td-mono text-sm">{p.value}</span> },
    { headerName: tManagerUi('actions'), width: 150, sortable: false, cellRenderer: () => (
      <div className="h-full flex items-center gap-2">
        <button className="mc-btn-icon cursor-not-allowed" type="button" disabled title={tManagerUi('notice_editing_unavailable_host_mutation_contract_not_su_0d5357')} aria-label={tManagerUi('edit_notice_unavailable')}><Edit2 size={14} /></button>
        <button className="mc-btn-icon cursor-not-allowed" type="button" disabled title={tManagerUi('broadcast_unavailable_host_messaging_contract_not_suppli_501d0a')} aria-label={tManagerUi('broadcast_notice_unavailable')}><Send size={14} /></button>
        <button className="mc-btn-icon mc-btn-icon--danger cursor-not-allowed" type="button" disabled title={tManagerUi('notice_deletion_unavailable_host_mutation_contract_not_s_c74aa3')} aria-label={tManagerUi('delete_notice_unavailable')}><Trash2 size={14} /></button>
      </div>
    ) },
  ];

  return <div className="mc-page" data-route-view={view} data-route-id={id} data-route-name={name} data-route-phone={phone} data-route-smart-id={smartId}>
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div><div className="mc-breadcrumb mb-2"><span>{tManagerUi('communication')}</span><ChevronRight size={12} /><span>{tManagerUi('notices')}</span></div><h1 className="mc-page-title text-2xl font-bold text-primary">{tManagerUi('notice_board')}</h1><p className="mc-page-subtitle text-secondary">{tManagerUi('review_notices_loaded_from_the_host_write_actions_remain_634b71')}</p><p role="status" className="mc-input-hint mc-text-warning" data-testid="manager-communication-notices-contract-warning">{tManagerUi('create_edit_delete_and_broadcast_are_disabled_this_modul_ec61db')}</p></div>
      <button type="button" disabled title={tManagerUi('notice_creation_unavailable_host_mutation_contract_not_s_819849')} className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded font-medium cursor-not-allowed">{tManagerUi('post_notice_unavailable')}</button>
    </div>

    <div className="mc-card mc-card--flush">
      {isPending ? <div className="mc-empty" role="status" aria-live="polite"><RefreshCw className="motion-safe:animate-spin" size={20} /><p className="mc-empty__title">{tManagerUi('loading_notices')}</p></div> : isError ? <div className="mc-empty"><p className="mc-empty__title">{tManagerUi('unable_to_load_notices')}</p><button type="button" className="mc-btn-ghost mt-3" onClick={() => refetch()}>{tManagerUi('retry')}</button></div> : notices.length === 0 ? <div className="mc-empty"><p className="mc-empty__title">{tManagerUi('no_notices_found')}</p><button type="button" className="mc-btn-primary mt-3" disabled title={tManagerUi('notice_creation_unavailable_host_mutation_contract_not_s_819849')}>{tManagerUi('post_notice_unavailable')}</button></div> : <div className="mc-scroll-x"><ManagerCommunicationNoticesNativeTable getRowKey={(row) => row.id} rows={notices} columns={colDefs} labels={{ previous: tManagerUi('previous_page'), next: tManagerUi('next_page') }} /></div>}
    </div>

  </div>;
}
