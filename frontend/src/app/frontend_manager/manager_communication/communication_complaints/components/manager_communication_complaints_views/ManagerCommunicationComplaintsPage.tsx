'use client';
import type { ManagerCommunicationComplaintsMainProps } from '@/app/frontend_manager/manager_communication/communication_complaints/types/ManagerCommunicationComplaintsMainTypes';
import { useLocale, useTranslations } from 'next-intl';

import { useCallback, useMemo, useRef, useState } from 'react';
import { useManagerComplaintsDialogFocus } from '@/app/frontend_manager/manager_communication/communication_complaints/hooks/ManagerCommunicationComplaintsDialogFocus';
import { ChevronRight, X, Eye, RefreshCw, CheckCircle } from 'lucide-react';
import { useManagerCommunicationComplaints } from '@/app/frontend_manager/manager_communication/communication_complaints/hooks/useManagerCommunicationComplaintsComplaints';
import type { ManagerCommunicationComplaintsComplaint, ManagerCommunicationComplaintsComplaintStatus } from '@/app/frontend_manager/manager_communication/communication_complaints/types/ManagerCommunicationComplaintsTypes';
import { MANAGER_COMMUNICATION_COMPLAINT_TABS } from '@/app/frontend_manager/manager_communication/communication_complaints/constants/ManagerCommunicationComplaintsComplaintConstants';
import { ManagerCommunicationComplaintsEmptyState } from '@/app/frontend_manager/manager_communication/communication_complaints/components/manager_communication_complaints_empty_states/ManagerCommunicationComplaintsEmptyState';

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
export default function ManagerCommunicationComplaintsPage({ view, id, name, phone, smartId }: ManagerCommunicationComplaintsMainProps) {
  const tManagerUi = useTranslations('manager.manager_complaints.ui');
  const locale = useLocale();
  const { complaints, isPending, isError, refetch } = useManagerCommunicationComplaints();
  const [tab, setTab] = useState<ManagerCommunicationComplaintsComplaintStatus | 'All'>('All');
  const [viewItem, setViewItem] = useState<ManagerCommunicationComplaintsComplaint | null>(null);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeComplaintDialog = useCallback(() => setViewItem(null), []);
  useManagerComplaintsDialogFocus(dialogRef, closeComplaintDialog, Boolean(viewItem));
  const [expandedDesc, setExpandedDesc] = useState<string[]>([]);
  const filtered = useMemo(() => tab === 'All' ? complaints : complaints.filter(c => c.status === tab), [complaints, tab]);
  const toggleDesc = (complaintId: string) => setExpandedDesc(current => current.includes(complaintId) ? current.filter(item => item !== complaintId) : [...current, complaintId]);
  const statusBadge = (status: ManagerCommunicationComplaintsComplaintStatus) => status === 'Open' ? <span className="mc-badge mc-badge--danger">{tManagerUi('open')}</span> : status === 'In-Progress' ? <span className="mc-badge mc-badge--warning">{tManagerUi('in_progress')}</span> : <span className="mc-badge mc-badge--success">{tManagerUi('resolved')}</span>;

  const totalRows = filtered.length;
  const pageCount = Math.max(1, Math.ceil(totalRows / pageSize));
  const effectivePage = Math.min(page, pageCount - 1);
  const paginated = filtered.slice(effectivePage * pageSize, (effectivePage + 1) * pageSize);
  const startItem = totalRows === 0 ? 0 : effectivePage * pageSize + 1;
  const endItem = Math.min((effectivePage + 1) * pageSize, totalRows);

  return (
    <div className="mc-page" data-route-view={view} data-route-id={id} data-route-name={name} data-route-phone={phone} data-route-smart-id={smartId}>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mc-breadcrumb">
            <span>{tManagerUi('communication')}</span>
            <ChevronRight size={12} />
            <span>{tManagerUi('complaints')}</span>
          </div>
          <h1 className="mc-page-title">{tManagerUi('complaints')}</h1>
          <p className="mc-page-subtitle">{tManagerUi('review_complaints_from_the_host_read_api_creating_changi_87c22f')}</p>
          <p className="mc-input-hint mc-text-warning" role="status" data-testid="manager-communication-complaints-contract-warning">
            {tManagerUi('write_actions_are_disabled_no_local_cache_edits_are_trea_59741e')}
          </p>
        </div>
        <button type="button" disabled title={tManagerUi('complaint_creation_unavailable_host_mutation_contract_no_0ffd8e')} className="mc-btn-primary cursor-not-allowed">
          {tManagerUi('add_complaint_unavailable')}
        </button>
      </div>

      <div className="mc-tabs mc-tabs-inline mb-6">
        {MANAGER_COMMUNICATION_COMPLAINT_TABS.map(item => (
          <button type="button" key={item} onClick={() => { setTab(item); setPage(0); }} className={`mc-tab${tab === item ? ' mc-tab--active' : ''}`} aria-pressed={tab === item}>
            {item}
          </button>
        ))}
      </div>

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
            <p className="mc-empty__title">{tManagerUi('no_complaints_in_this_view')}</p>
          </ManagerCommunicationComplaintsEmptyState>
        ) : (
          <div className="mc-scroll-x overflow-x-auto">
            <table className="mc-table w-full">
              <caption className="sr-only">{tManagerUi('complaints')}</caption>
              <thead>
                <tr className="border-b border-border bg-surface-highlight text-xs uppercase text-secondary font-semibold">
                  <th scope="col" className="px-3 py-3">#</th>
                  <th scope="col" className="px-3 py-3">{tManagerUi('title')}</th>
                  <th scope="col" className="px-3 py-3">{tManagerUi('student')}</th>
                  <th scope="col" className="px-3 py-3">{tManagerUi('description')}</th>
                  <th scope="col" className="px-3 py-3">{tManagerUi('status')}</th>
                  <th scope="col" className="px-3 py-3">{tManagerUi('date')}</th>
                  <th scope="col" className="px-3 py-3">{tManagerUi('resolved_by')}</th>
                  <th scope="col" className="px-3 py-3">{tManagerUi('resolved_date')}</th>
                  <th scope="col" className="px-3 py-3">{tManagerUi('actions')}</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((complaint, index) => {
                  const expanded = expandedDesc.includes(complaint.id);
                  const long = complaint.description.length > 60;
                  const rowNumber = effectivePage * pageSize + index + 1;
                  return (
                    <tr key={complaint.id} className="border-b border-border last:border-0 hover:bg-surface-hover even:bg-surface-zebra/30 h-12">
                      <td className="mc-td-mono px-3 py-3 align-middle">{rowNumber}</td>
                      <td className="mc-td-bold px-3 py-3 align-middle">{complaint.title}</td>
                      <td className="px-3 py-3 align-middle">{complaint.student ?? '—'}</td>
                      <td className="px-3 py-3 align-middle">
                        <span>{long && !expanded ? `${complaint.description.slice(0, 60)}…` : complaint.description}</span>
                        {long && (
                          <button type="button" onClick={() => toggleDesc(complaint.id)} className="mc-link-btn ml-1">
                            {expanded ? tManagerUi('less') : tManagerUi('more')}
                          </button>
                        )}
                      </td>
                      <td className="px-3 py-3 align-middle">{statusBadge(complaint.status)}</td>
                      <td className="mc-td-muted px-3 py-3 align-middle">{formatKnownIsoCalendarDate(complaint.date, locale)}</td>
                      <td className="mc-td-muted px-3 py-3 align-middle">{complaint.resolvedBy ?? '—'}</td>
                      <td className="mc-td-muted px-3 py-3 align-middle">{(complaint.resolvedDate ? formatKnownIsoCalendarDate(complaint.resolvedDate, locale) : '—')}</td>
                      <td className="px-3 py-3 align-middle">
                        <div className="flex items-center gap-1">
                          <button type="button" onClick={() => setViewItem(complaint)} className="mc-btn-icon" title={tManagerUi('view')} aria-label={tManagerUi('view_complaint')}>
                            <Eye size={14} />
                          </button>
                          {complaint.status === 'Open' && (
                            <button type="button" disabled className="mc-btn-icon cursor-not-allowed" title={tManagerUi('status_update_unavailable_host_mutation_contract_not_sup_953486')} aria-label={tManagerUi('mark_in_progress_unavailable')}>
                              <RefreshCw size={14} />
                            </button>
                          )}
                          {complaint.status !== 'Resolved' && (
                            <button type="button" disabled className="mc-btn-icon cursor-not-allowed" title={tManagerUi('resolution_unavailable_host_mutation_contract_not_suppli_e15b8c')} aria-label={tManagerUi('resolve_unavailable')}>
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

            {totalRows > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border px-4 py-3 text-sm text-secondary">
                <span>
                  Showing {startItem}–{endItem} of {totalRows} results
                </span>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <label htmlFor="rows-per-page-communication-complaints" className="text-xs text-secondary whitespace-nowrap">
                      Rows per page:
                    </label>
                    <select
                      id="rows-per-page-communication-complaints"
                      value={pageSize}
                      onChange={(e) => {
                        setPageSize(Number(e.target.value));
                        setPage(0);
                      }}
                      className="rounded border border-border bg-surface px-2 py-1 text-xs text-primary"
                    >
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="mgr-btn-ghost mgr-btn-sm"
                      disabled={effectivePage <= 0}
                      onClick={() => setPage((current) => Math.max(0, current - 1))}
                    >
                      Previous
                    </button>
                    <span className="text-xs text-secondary px-1">
                      Page {effectivePage + 1} of {pageCount}
                    </span>
                    <button
                      type="button"
                      className="mgr-btn-ghost mgr-btn-sm"
                      disabled={effectivePage >= pageCount - 1}
                      onClick={() => setPage((current) => Math.min(pageCount - 1, current + 1))}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {viewItem && (
        <div className="mc-overlay">
          <div ref={dialogRef} tabIndex={-1} className="mc-modal mc-modal--md bg-card" role="dialog" aria-modal="true" aria-labelledby="complaint-view-title">
            <button type="button" onClick={closeComplaintDialog} className="mc-modal-close" aria-label={tManagerUi('close_complaint')}><X size={16} /></button>
            <p id="complaint-view-title" className="mc-modal-title">{viewItem.title}</p>
            <div className="mc-modal-badge-row">{statusBadge(viewItem.status)}<span className="mc-badge mc-badge--outline">{formatKnownIsoCalendarDate(viewItem.date, locale)}</span></div>
            <p className="mc-complaint-by">{tManagerUi('by')} <span>{viewItem.student ?? '—'}</span></p>
            <p className="mc-complaint-desc">{viewItem.description}</p>
            {viewItem.resolvedNote && (
              <div className="mc-info-box mt-4">
                <strong>{tManagerUi('resolution')}</strong> {viewItem.resolvedNote}{viewItem.resolvedBy ? ` — ${viewItem.resolvedBy}` : ''}{viewItem.resolvedDate ? ` ${tManagerUi('on')} ${formatKnownIsoCalendarDate(viewItem.resolvedDate, locale)}` : ''}
              </div>
            )}
            <div className="mc-modal-footer"><button type="button" onClick={closeComplaintDialog} className="mc-btn-ghost">{tManagerUi('close')}</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
