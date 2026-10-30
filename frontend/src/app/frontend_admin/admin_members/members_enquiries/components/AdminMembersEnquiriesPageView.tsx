'use client';
import { useTranslations } from 'next-intl';
import { isFrontendDemoModeEnabled } from '@/app/frontend_admin/lib/runtimeFeatures';
import { Search, LayoutGrid, List, MoreHorizontal, PhoneCall, Upload, Download, Printer, MessageSquare, Send, Mail, CalendarDays, CheckCircle, Clock, Phone, User } from 'lucide-react';
import { toast } from 'sonner';
import { ADMIN_ENQUIRIES_ENQUIRY_KANBAN_COLUMNS, ADMIN_ENQUIRIES_ENQUIRY_STATUS_FILTERS, ADMIN_ENQUIRIES_URLS, ADMIN_ENQUIRIES_ENQUIRY_DOT_CLASSES } from '@/app/frontend_admin/admin_members/members_enquiries/config/admin_members_enquiries.url_config';
import useEnquiriesPage from '@/app/frontend_admin/admin_members/members_enquiries/hooks/useAdminMembersEnquiriesPage';
import AdminEnquiriesTable from '@/app/frontend_admin/admin_members/members_enquiries/components/AdminMembersEnquiriesTable';

import AdminEmptyState from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveEmptyState';

import { buildAdminEnquiriesCsv, maskPhone } from '@/app/frontend_admin/admin_members/members_enquiries/utils/AdminMembersEnquiriesTextUtils';

import type { Enquiry } from '@/app/frontend_admin/admin_members/members_enquiries/schemas/AdminMembersEnquiriesSchema';

import type { AdminEnquiriesEnquiryKanbanCardProps } from '@/app/frontend_admin/admin_members/members_enquiries/types/AdminMembersEnquiriesComponentTypes';

// RESPONSIBILITY: AdminEnquiriesPageView component owned by admin_enquiries; responsibility folder: admin_enquiries_components_views.

export default function AdminEnquiriesPageView() {
  const t = useTranslations('ADMIN_ENQUIRIES');
  const model = useEnquiriesPage();
  const { router, isDemoMode, view, setView, search, setSearch, statusFilter, setStatusFilter, filtered, colEnquiries } = model;
  if (!isFrontendDemoModeEnabled()) return <section className="space-y-3 rounded-lg border border-warning-bg bg-card p-6"><h1 className="text-section-title font-semibold text-text-primary">{t('CRM_UNAVAILABLE_TITLE')}</h1><p role="status" className="text-warning-text">{t('CRM_UNAVAILABLE_DESC')}</p></section>;
  const statusLabel = (status: string) => {
    const keys: Record<string, string> = { New: 'STATUS_NEW', Visited: 'STATUS_VISITED', Interested: 'STATUS_INTERESTED', Converted: 'STATUS_CONVERTED', Lost: 'STATUS_LOST' };
    return t(keys[status] ?? 'STATUS');
  };
  const downloadCsv = () => {
    if (!isDemoMode) {
      toast.error(t('LIVE_EXPORT_UNAVAILABLE'), { id: 'admin_members-members_enquiries-components-AdminMembersEnquiriesPageView-toast-35-1' });
      return;
    }
    const blob = new Blob([buildAdminEnquiriesCsv(filtered)], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'admin-crm-demo-enquiries.csv';
    anchor.hidden = true;
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast.success(t('EXPORT_SUCCESS', { count: filtered.length }), { id: 'admin_members-members_enquiries-components-AdminMembersEnquiriesPageView-toast-48-2' });
  };
  const printCurrentView = () => {
    if (typeof window !== 'undefined') window.print();
  };
  return (
    <div className="space-y-4"><p className="rounded-md border border-warning-bg bg-warning-bg p-3 text-warning-text" role="status">{t('CRM_DEMO_BANNER')}</p><div className="min-w-0 space-y-6 text-text-primary">

      {/* ── Page Header ── */}
      <div className="flex flex-col gap-4 border-b border-border pb-4">
        <nav className="text-caption text-text-secondary">{t('BREADCRUMB')}</nav>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-page-title font-bold text-text-primary">{t('PAGE_TITLE')}</h1>
            <p className="mt-1 text-body text-text-secondary">
              {isDemoMode ? t('DEMO_SUBTITLE', { count: filtered.length }) : t('LIVE_SUBTITLE')}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {/* View toggle */}
            <div className="inline-flex items-center gap-1 rounded-lg border border-border bg-card p-1">
              <button data-testid="admin_enquiries-AdminEnquiriesPageView-control-001"
                className={`inline-flex min-h-11 min-w-11 items-center justify-center rounded-md text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${view === 'kanban' ? 'bg-primary-subtle text-primary' : ''}`}
                onClick={() => setView('kanban')}
                title={t('KANBAN_TITLE')}
                aria-label={t('KANBAN_SWITCH')}
                aria-pressed={view === 'kanban'}
              >
                <LayoutGrid size={18}  strokeWidth={2}/>
              </button>
              <button data-testid="admin_enquiries-AdminEnquiriesPageView-control-002"
                className={`inline-flex min-h-11 min-w-11 items-center justify-center rounded-md text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${view === 'table' ? 'bg-primary-subtle text-primary' : ''}`}
                onClick={() => setView('table')}
                title={t('TABLE_TITLE')}
                aria-label={t('TABLE_SWITCH')}
                aria-pressed={view === 'table'}
              >
                <List size={18}  strokeWidth={2}/>
              </button>
            </div>

            <button data-testid="admin_enquiries-AdminEnquiriesPageView-control-003" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-body font-medium text-text-primary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50" type="button" disabled title={t('IMPORT_TITLE')}>
              <Upload size={18}  strokeWidth={2}/> {t('IMPORT')}
            </button>
            <button data-testid="admin_enquiries-AdminEnquiriesPageView-control-004" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-body font-medium text-text-primary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50" type="button" disabled={!isDemoMode || filtered.length === 0} title={isDemoMode ? t('EXPORT_DEMO_TITLE') : t('EXPORT_LIVE_TITLE')} onClick={downloadCsv}>
              <Download size={18}  strokeWidth={2}/> {t('CSV')}
            </button>
            <button data-testid="admin_enquiries-AdminEnquiriesPageView-control-005" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-body font-medium text-text-primary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50" type="button" onClick={printCurrentView}>
              <Printer size={18}  strokeWidth={2}/> {t('PRINT')}
            </button>
            <button data-testid="admin_enquiries-AdminEnquiriesPageView-control-006" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-body font-medium text-text-primary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 admin-shared-text-success" type="button" disabled title={t('WHATSAPP_TITLE')} >
              <MessageSquare size={18}  strokeWidth={2}/> {t('WHATSAPP')}
            </button>
            <button data-testid="admin_enquiries-AdminEnquiriesPageView-control-007" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-body font-medium text-text-primary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 admin-shared-text-info" type="button" disabled title={t('TELEGRAM_TITLE')} >
              <Send size={18}  strokeWidth={2}/> {t('TELEGRAM')}
            </button>
            <button data-testid="admin_enquiries-AdminEnquiriesPageView-control-008" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-body font-medium text-text-primary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 admin-shared-text-primary" type="button" disabled title={t('EMAIL_TITLE')} >
              <Mail size={18}  strokeWidth={2}/> {t('EMAIL')}
            </button>

            {/* Admin is View-Only: No Add Enquiry Button */}
          </div>
        </div>
      </div>

      {/* ── Toolbar ── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Search */}
        <div className="relative min-w-0 flex-1">
          <Search size={18} strokeWidth={2} />
          <input
            type="text"
            aria-label={t('SEARCH_ARIA')}
            disabled={!isDemoMode}
            className="min-h-11 w-full rounded-md border border-border bg-input px-3 py-2 pl-10 text-body text-text-primary placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            placeholder={t('SEARCH_PLACEHOLDER')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Status filter */}
        <select data-testid="admin_enquiries-AdminEnquiriesPageView-control-009"
          aria-label={t('FILTER_ARIA')}
          disabled={!isDemoMode}
          className="min-h-11 w-full min-w-0 rounded-md border border-border bg-input px-3 py-2 text-body text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary flex flex-wrap items-center gap-2"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          {ADMIN_ENQUIRIES_ENQUIRY_STATUS_FILTERS.map((status) => (
            <option key={status} value={status}>{status === 'All' ? t('ALL_STATUSES') : statusLabel(status)}</option>
          ))}
        </select>
      </div>

      {/* ════════════════════════════════════════
          KANBAN VIEW
      ════════════════════════════════════════ */}
      {view === 'kanban' && (
        <>
          {!isDemoMode ? (
            <p data-testid="admin_enquiries-AdminEnquiriesPageView-state-live-unavailable" role="status" className="mt-12 rounded-lg border border-warning-bg bg-warning-bg p-4 text-warning-text">
              {t('LIVE_WARNING')}
            </p>
          ) : filtered.length === 0 ? (
            <div data-testid="admin_enquiries-AdminEnquiriesPageView-state-010" className="mt-12">
              <AdminEmptyState showIcon={false} title={t('NO_ENQUIRIES')} description={t('NO_MATCHING_ENQUIRIES')} />
            </div>
          ) : (
            <div className="grid min-w-0 grid-cols-[repeat(5,minmax(15rem,84vw))] gap-4 overflow-x-auto pb-2 md:grid-cols-[repeat(5,minmax(15rem,1fr))]">
              {ADMIN_ENQUIRIES_ENQUIRY_KANBAN_COLUMNS.map((col) => {
                const cards = colEnquiries(col.id);
                return (
                  <div key={col.id} className="flex min-w-0 flex-col overflow-hidden rounded-xl border border-border bg-surface-zebra">
                    {/* Column header */}
                    <div className="flex items-center justify-between gap-2 border-b border-border bg-card p-3">
                      <div className="flex min-w-0 items-center gap-2">
                        <span className={`h-2 w-2 shrink-0 rounded-full bg-primary ${ADMIN_ENQUIRIES_ENQUIRY_DOT_CLASSES[col.id]}`} />
                        <span className="truncate text-body font-semibold text-text-primary">{statusLabel(col.label)}</span>
                        <span className="inline-flex min-h-6 min-w-6 items-center justify-center rounded-full bg-surface-highlight px-2 text-caption font-semibold text-text-secondary">{cards.length}</span>
                      </div>
                      <button data-testid="admin_enquiries-AdminEnquiriesPageView-control-013" className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border border-border bg-card text-text-primary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50" title={t('COLUMN_ACTIONS_UNAVAILABLE')} aria-label={t('COLUMN_OPTIONS')} disabled>
                        <MoreHorizontal size={18}  strokeWidth={2}/>
                      </button>
                    </div>

                    {/* Column body */}
                    <div className="flex min-h-40 flex-col gap-3 p-3">
                      {cards.length === 0 ? (
                        <div data-testid="admin_enquiries-AdminEnquiriesPageView-state-014" className="rounded-md border border-dashed border-border p-4 text-center">
                          <PhoneCall size={18}  strokeWidth={2}/>
                          <p data-testid="admin_enquiries-AdminEnquiriesPageView-state-015" className="text-body font-medium text-text-primary">{t('NO_STATUS_LEADS', { status: statusLabel(col.label) })}</p>
                          <p data-testid="admin_enquiries-AdminEnquiriesPageView-state-016" className="mt-1 text-caption text-text-secondary">
                            {t('LEADS_MOVE_HINT', { status: statusLabel(col.label) })}
                          </p>
                        </div>
                      ) : (
                        cards.map((enq) => (
                          <AdminEnquiriesEnquiryKanbanCard
                            key={enq.id}
                            enq={enq}
                            colClass={col.cardClass}
                            onClick={() => router.push(ADMIN_ENQUIRIES_URLS.ENQUIRY_DETAIL(enq.id))}
                          />
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* ════════════════════════════════════════
          TABLE VIEW
      ════════════════════════════════════════ */}
      {view === 'table' && (
        isDemoMode ? <AdminEnquiriesTable
          enquiries={filtered}
          onSelectEnquiry={(enquiry) => router.push(ADMIN_ENQUIRIES_URLS.ENQUIRY_DETAIL(enquiry.id))}
        /> : <p role="status" className="mt-12 rounded-lg border border-warning-bg bg-warning-bg p-4 text-warning-text">{t('TABLE_UNAVAILABLE')}</p>
      )}
    </div></div>
  );
}

// RESPONSIBILITY: AdminEnquiriesEnquiryKanbanCard component owned by admin_enquiries; responsibility folder: admin_enquiries_helpers.

export function AdminEnquiriesEnquiryKanbanCard({ enq, colClass, onClick }: AdminEnquiriesEnquiryKanbanCardProps) {
  const t = useTranslations('ADMIN_ENQUIRIES');
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onClick(); } };
  const handledBy = typeof enq.handledBy === 'string' ? enq.handledBy.split(' ')[0] || t('UNASSIGNED') : t('UNASSIGNED');
  return <div data-testid="admin_enquiries-AdminEnquiriesEnquiryKanbanCard-control-001" className={`rounded-lg border border-border bg-card p-3 shadow-card ${colClass}`} onClick={onClick} role="button" tabIndex={0} onKeyDown={handleKeyDown}>
    <div className="flex min-w-0 items-start gap-2"><p className="truncate text-body font-semibold text-text-primary">{enq.name}</p><p className="mt-1 text-caption text-text-secondary"><Phone size={18}  strokeWidth={2}/>{maskPhone(enq.phone)}</p></div>
    <div data-testid="admin_enquiries-AdminEnquiriesEnquiryKanbanCard-state-002" className="mt-3 flex flex-wrap gap-1"><span data-testid="admin_enquiries-AdminEnquiriesEnquiryKanbanCard-state-003" className="inline-flex min-h-6 items-center rounded-full px-2 py-1 text-caption font-semibold bg-info-bg text-info-text">{enq.shift}</span>{enq.isOverdue ? <span data-testid="admin_enquiries-AdminMembersEnquiriesEnquiryFollowUpBadge-state-001" className="inline-flex min-h-6 items-center rounded-full px-2 py-1 text-caption font-semibold bg-danger-bg text-danger-text"><Clock size={18} strokeWidth={2}/>{t('FOLLOWUP_OVERDUE')}</span> : enq.isToday ? <span data-testid="admin_enquiries-AdminMembersEnquiriesEnquiryFollowUpBadge-state-002" className="inline-flex min-h-6 items-center rounded-full px-2 py-1 text-caption font-semibold bg-warning-bg text-warning-text"><Clock size={18} strokeWidth={2}/>{t('FOLLOWUP_TODAY')}</span> : enq.isUpcoming ? <span data-testid="admin_enquiries-AdminMembersEnquiriesEnquiryFollowUpBadge-state-003" className="inline-flex min-h-6 items-center rounded-full px-2 py-1 text-caption font-semibold bg-success-bg text-success-text"><Clock size={18} strokeWidth={2}/>{t('FOLLOWUP_UPCOMING')}</span> : null}</div>
    <div className="mt-3 border-t border-border pt-3"><span className="inline-flex items-center gap-1 text-caption text-text-secondary"><CalendarDays size={18}  strokeWidth={2}/>{enq.addedDate}</span>{enq.convertedDate && <span className="bg-success-bg text-success-text"><CheckCircle size={18}  strokeWidth={2}/>{enq.convertedDate}</span>}<span className="inline-flex items-center gap-1 text-caption text-text-secondary"><User size={18}  strokeWidth={2}/>{handledBy}</span></div>
  </div>;
}

export type { AdminEnquiriesEnquiryKanbanCardProps };
