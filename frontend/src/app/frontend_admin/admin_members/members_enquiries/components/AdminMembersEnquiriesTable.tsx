'use client';
// RESPONSIBILITY: AdminEnquiriesTable component owned by admin_enquiries; responsibility folder: admin_enquiries_table.
import { useAdminApplicationInfrastructureUrlQueryState } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_hooks/useAdminApplicationInfrastructureUrlQueryState';

import { useEffect, useMemo, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { ArrowDown, ArrowUp, Clock, Eye, MessageSquare } from 'lucide-react';
import type { Enquiry, EnquiryStatus } from '@/app/frontend_admin/admin_members/members_enquiries/schemas/AdminMembersEnquiriesSchema';
import { ADMIN_ENQUIRIES_ENQUIRY_STATUS_BADGE } from '@/app/frontend_admin/admin_members/members_enquiries/config/admin_members_enquiries.url_config';
import { maskPhone } from '@/app/frontend_admin/admin_members/members_enquiries/utils/AdminMembersEnquiriesTextUtils';
import { formatAdminEnquiriesDate } from '@/app/frontend_admin/admin_members/members_enquiries/utils/AdminMembersEnquiriesTextUtils';
import type { AdminEnquiriesEnquirySortField, AdminEnquiriesEnquirySortDirection, AdminEnquiriesTableProps } from '@/app/frontend_admin/admin_members/members_enquiries/types/AdminMembersEnquiriesComponentTypes';

function getAdminEnquiriesEnquirySortValue(enquiry: Enquiry, field: AdminEnquiriesEnquirySortField): string {
  const value = enquiry[field];
  if (typeof value === 'string') return value;
  return value === undefined || value === null ? '' : String(value);
}

/** Accessible, sortable and paginated enquiry table with a mobile card-stack equivalent. */
export default function AdminEnquiriesTable({
  enquiries,
  onSelectEnquiry,
  selectedIds = [],
  onToggleSelectOne,
  onToggleSelectAll,
  onQuickWhatsApp,
}: AdminEnquiriesTableProps) {
  const t = useTranslations('ADMIN_ENQUIRIES');
  const locale = useLocale();
  const statusLabel = (status: EnquiryStatus) => {
    const keys: Record<EnquiryStatus, string> = { New: 'STATUS_NEW', Visited: 'STATUS_VISITED', Interested: 'STATUS_INTERESTED', Converted: 'STATUS_CONVERTED', Lost: 'STATUS_LOST' };
    return t(keys[status]);
  };
  const renderStatusBadge = (status: EnquiryStatus) => <span data-testid="admin_enquiries-AdminEnquiriesEnquiryStatusBadge-state-001" className={`inline-flex min-h-6 items-center rounded-full px-2 py-1 text-caption font-semibold ${ADMIN_ENQUIRIES_ENQUIRY_STATUS_BADGE[status]}`}>{statusLabel(status)}</span>;
  const [sortField, setSortField] = useAdminApplicationInfrastructureUrlQueryState<AdminEnquiriesEnquirySortField>('sortField', 'addedDate', { validValues: ['addedDate', 'name', 'phone', 'shift', 'status', 'handledBy'] });
  const [sortDirection, setSortDirection] = useAdminApplicationInfrastructureUrlQueryState<AdminEnquiriesEnquirySortDirection>('sortDirection', 'descending', { validValues: ['ascending', 'descending'] });
  const [page, setPage] = useAdminApplicationInfrastructureUrlQueryState<number>('page', 0);
  const [pageSize, setPageSize] = useAdminApplicationInfrastructureUrlQueryState<number>('pageSize', 25, { validValues: [10, 25, 50] });

  const sorted = useMemo(() => [...enquiries].sort((left, right) => {
    const a = getAdminEnquiriesEnquirySortValue(left, sortField).toLocaleLowerCase();
    const b = getAdminEnquiriesEnquirySortValue(right, sortField).toLocaleLowerCase();
    const result = a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
    return sortDirection === 'ascending' ? result : -result;
  }), [enquiries, sortDirection, sortField]);

  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePage = Math.min(page, pageCount - 1);
  const pageRows = sorted.slice(safePage * pageSize, (safePage + 1) * pageSize);

  useEffect(() => setPage(0), [enquiries, pageSize, sortDirection, sortField]);

  const toggleSort = (field: AdminEnquiriesEnquirySortField) => {
    setPage(0);
    if (field === sortField) {
      setSortDirection((current) => current === 'ascending' ? 'descending' : 'ascending');
    } else {
      setSortField(field);
      setSortDirection('ascending');
    }
  };

  const sortHeader = (label: string, field: AdminEnquiriesEnquirySortField) => {
    const active = sortField === field;
    const direction = active ? sortDirection : 'none';
    return (
      <th scope="col" aria-sort={direction}>
        <button type="button" className="inline-flex min-h-11 items-center gap-1 rounded px-1 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" aria-label={t('SORT_BY', { label })} onClick={() => toggleSort(field)}>
          {label}
          {active && (sortDirection === 'ascending' ? <ArrowUp aria-hidden="true" size={14} /> : <ArrowDown aria-hidden="true" size={14} />)}
        </button>
      </th>
    );
  };

  const resultsSummary = sorted.length === 0
    ? t('SHOWING_ZERO')
    : t('SHOWING_RANGE', { start: safePage * pageSize + 1, end: Math.min((safePage + 1) * pageSize, sorted.length), total: sorted.length });

  const handleWhatsAppClick = (enquiry: Enquiry) => {
    if (onQuickWhatsApp) {
      onQuickWhatsApp(enquiry);
    } else {
      const digits = enquiry.phone.replace(/\D/g, '');
      const phone = digits.length === 10 ? `91${digits}` : digits;
      const text = encodeURIComponent(`Hello ${enquiry.name}, greetings from Smart Library! We are reaching out regarding your enquiry.`);
      window.open(`https://wa.me/${phone}?text=${text}`, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="space-y-4">
      {sorted.length === 0 ? (
        <div role="status" className="flex min-h-56 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-card p-6 text-center">
          <p className="text-section-title font-semibold text-text-primary">{t('NO_ENQUIRIES_FOUND')}</p>
          <p className="max-w-lg text-body text-text-secondary">{t('TRY_FILTERS')}</p>
        </div>
      ) : (
        <>
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full border-collapse text-left text-body">
              <thead>
                <tr className="bg-surface-highlight uppercase text-xs text-text-secondary font-semibold h-12">
                  <th scope="col" className="w-10 px-3">
                    {onToggleSelectAll && (
                      <input
                        type="checkbox"
                        aria-label="Select all enquiries on this page"
                        checked={pageRows.length > 0 && pageRows.every((r) => selectedIds.includes(r.id))}
                        onChange={onToggleSelectAll}
                        className="rounded border-border"
                      />
                    )}
                  </th>
                  <th scope="col" className="px-3">#</th>
                  {sortHeader(t('NAME'), 'name')}
                  {sortHeader(t('PHONE'), 'phone')}
                  {sortHeader(t('PREFERRED_SHIFT'), 'shift')}
                  {sortHeader(t('STATUS'), 'status')}
                  {sortHeader(t('HANDLED_BY'), 'handledBy')}
                  {sortHeader(t('DATE_ADDED'), 'addedDate')}
                  <th scope="col">{t('FOLLOW_UP')}</th>
                  <th scope="col">{t('ACTIONS')}</th>
                </tr>
              </thead>
              <tbody>
                {pageRows.map((enquiry, index) => {
                  const isSelected = selectedIds.includes(enquiry.id);
                  return (
                    <tr
                      key={enquiry.id}
                      className={`border-b border-border hover:bg-surface-hover even:bg-surface-zebra h-12 ${isSelected ? 'bg-primary-subtle' : ''}`}
                      data-testid={`admin_enquiries-AdminEnquiriesTable-row-${enquiry.id}`}
                    >
                      <td className="w-10 px-3">
                        {onToggleSelectOne && (
                          <input
                            type="checkbox"
                            aria-label={`Select ${enquiry.name}`}
                            checked={isSelected}
                            onChange={() => onToggleSelectOne(enquiry.id)}
                            className="rounded border-border"
                          />
                        )}
                      </td>
                      <td className="w-12 text-caption text-text-secondary">{safePage * pageSize + index + 1}</td>
                      <td>
                        <button type="button" className="min-w-48 min-h-11 rounded text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" onClick={() => onSelectEnquiry(enquiry)} aria-label={t('VIEW_DETAILS_FOR', { name: enquiry.name })}>
                          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-subtle font-semibold text-primary h-8 w-8 text-caption" aria-hidden="true">{enquiry.avatar}</span>
                          <span className="font-semibold text-text-primary ml-2">{enquiry.name}</span>
                        </button>
                      </td>
                      <td className="select-none text-text-secondary">{maskPhone(enquiry.phone)}</td>
                      <td><span className="inline-flex min-h-6 items-center rounded-full px-2 py-1 text-caption font-semibold bg-info-bg text-info-text">{enquiry.shift || '—'}</span></td>
                      <td>{renderStatusBadge(enquiry.status)}</td>
                      <td className="text-text-secondary">{enquiry.handledBy || t('UNASSIGNED')}</td>
                      <td className="text-text-secondary">{formatAdminEnquiriesDate(enquiry.addedDate, locale)}</td>
                      <td>{enquiry.isOverdue ? <span data-testid="admin_enquiries-AdminMembersEnquiriesEnquiryFollowUpBadge-state-001" className="inline-flex min-h-6 items-center rounded-full px-2 py-1 text-caption font-semibold bg-danger-bg text-danger-text"><Clock size={18} strokeWidth={2}/>{t('FOLLOWUP_OVERDUE')}</span> : enquiry.isToday ? <span data-testid="admin_enquiries-AdminMembersEnquiriesEnquiryFollowUpBadge-state-002" className="inline-flex min-h-6 items-center rounded-full px-2 py-1 text-caption font-semibold bg-warning-bg text-warning-text"><Clock size={18} strokeWidth={2}/>{t('FOLLOWUP_TODAY')}</span> : enquiry.isUpcoming ? <span data-testid="admin_enquiries-AdminMembersEnquiriesEnquiryFollowUpBadge-state-003" className="inline-flex min-h-6 items-center rounded-full px-2 py-1 text-caption font-semibold bg-success-bg text-success-text"><Clock size={18} strokeWidth={2}/>{t('FOLLOWUP_UPCOMING')}</span> : null}</td>
                      <td className="whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <button type="button" className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border border-border bg-card text-text-primary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" aria-label={t('VIEW_DETAILS_FOR', { name: enquiry.name })} onClick={() => onSelectEnquiry(enquiry)}>
                            <Eye aria-hidden="true" size={18} strokeWidth={2} />
                          </button>
                          <button
                            type="button"
                            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border border-border bg-card text-success-text hover:bg-success-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                            title="Chat on WhatsApp"
                            aria-label={`Chat with ${enquiry.name} on WhatsApp`}
                            onClick={() => handleWhatsAppClick(enquiry)}
                          >
                            <MessageSquare aria-hidden="true" size={18} strokeWidth={2} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="grid gap-3 md:hidden" aria-label={t('ENQUIRY_RECORDS')}>
            {pageRows.map((enquiry) => (
              <article key={enquiry.id} className="rounded-lg border border-border bg-card p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    {onToggleSelectOne && (
                      <input
                        type="checkbox"
                        aria-label={`Select ${enquiry.name}`}
                        checked={selectedIds.includes(enquiry.id)}
                        onChange={() => onToggleSelectOne(enquiry.id)}
                        className="rounded border-border mt-1"
                      />
                    )}
                    <div>
                      <h2 className="font-semibold text-text-primary">{enquiry.name}</h2>
                      <p className="mt-1 text-sm text-text-secondary">{maskPhone(enquiry.phone)}</p>
                    </div>
                  </div>
                  {renderStatusBadge(enquiry.status)}
                </div>
                <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
                  <div><dt className="text-text-secondary">{t('PREFERRED_SHIFT')}</dt><dd className="text-text-primary">{enquiry.shift || '—'}</dd></div>
                  <div><dt className="text-text-secondary">{t('HANDLED_BY')}</dt><dd className="text-text-primary">{enquiry.handledBy || t('UNASSIGNED')}</dd></div>
                  <div><dt className="text-text-secondary">{t('DATE_ADDED')}</dt><dd className="text-text-primary">{formatAdminEnquiriesDate(enquiry.addedDate, locale)}</dd></div>
                  <div><dt className="text-text-secondary">{t('FOLLOW_UP')}</dt><dd>{enquiry.isOverdue ? <span data-testid="admin_enquiries-AdminMembersEnquiriesEnquiryFollowUpBadge-state-001" className="inline-flex min-h-6 items-center rounded-full px-2 py-1 text-caption font-semibold bg-danger-bg text-danger-text"><Clock size={18} strokeWidth={2}/>{t('FOLLOWUP_OVERDUE')}</span> : enquiry.isToday ? <span data-testid="admin_enquiries-AdminMembersEnquiriesEnquiryFollowUpBadge-state-002" className="inline-flex min-h-6 items-center rounded-full px-2 py-1 text-caption font-semibold bg-warning-bg text-warning-text"><Clock size={18} strokeWidth={2}/>{t('FOLLOWUP_TODAY')}</span> : enquiry.isUpcoming ? <span data-testid="admin_enquiries-AdminMembersEnquiriesEnquiryFollowUpBadge-state-003" className="inline-flex min-h-6 items-center rounded-full px-2 py-1 text-caption font-semibold bg-success-bg text-success-text"><Clock size={18} strokeWidth={2}/>{t('FOLLOWUP_UPCOMING')}</span> : null}</dd></div>
                </dl>
                <div className="mt-4 flex gap-2">
                  <button type="button" className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-body font-medium text-text-primary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" onClick={() => onSelectEnquiry(enquiry)}>
                    <Eye aria-hidden="true" size={18} strokeWidth={2} /> {t('VIEW_DETAILS')}
                  </button>
                  <button
                    type="button"
                    className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-md border border-border bg-card px-3 py-2 text-body font-medium text-success-text hover:bg-success-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    onClick={() => handleWhatsAppClick(enquiry)}
                  >
                    <MessageSquare aria-hidden="true" size={18} strokeWidth={2} /> WhatsApp
                  </button>
                </div>
              </article>
            ))}
          </div>

          <div className="flex flex-col gap-3 border-t border-border px-2 py-3 text-sm text-text-secondary sm:flex-row sm:items-center sm:justify-between">
            <p aria-live="polite">{resultsSummary}</p>
            <div className="flex flex-wrap items-center gap-2">
              <label htmlFor="admin-crm-enquiry-page-size">{t('ROWS_PER_PAGE')}</label>
              <select id="admin-crm-enquiry-page-size" className="min-h-11 w-full min-w-0 rounded-md border border-border bg-input px-3 py-2 text-body text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" value={pageSize} onChange={(event) => setPageSize(Number(event.target.value))}>
                <option value={10}>10</option><option value={25}>25</option><option value={50}>50</option>
              </select>
              <button type="button" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-body font-medium text-text-primary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50" disabled={safePage === 0} onClick={() => setPage((current) => Math.max(0, current - 1))}>{t('PREVIOUS')}</button>
              <span aria-current="page">{t('PAGE_OF', { page: safePage + 1, pages: pageCount })}</span>
              <button type="button" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-body font-medium text-text-primary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50" disabled={safePage >= pageCount - 1} onClick={() => setPage((current) => Math.min(pageCount - 1, current + 1))}>{t('NEXT')}</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export type { AdminEnquiriesTableProps };
