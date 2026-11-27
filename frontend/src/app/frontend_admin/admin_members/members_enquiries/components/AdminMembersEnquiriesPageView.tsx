'use client';

import AdminEnquiriesEnquiryKanbanCard from '@/app/frontend_admin/admin_members/members_enquiries/components/AdminEnquiriesEnquiryKanbanCard';
import AdminMembersEnquiriesBulkWhatsAppModal from '@/app/frontend_admin/admin_members/members_enquiries/components/AdminMembersEnquiriesBulkWhatsAppModal';
import AdminMembersEnquiriesDetailModal from '@/app/frontend_admin/admin_members/members_enquiries/components/AdminMembersEnquiriesDetailModal';
import {
  AdminMembersEnquiriesHeaderKpis,
  type AdminCrmTimeRange,
} from '@/app/frontend_admin/admin_members/members_enquiries/components/AdminMembersEnquiriesHeaderKpis';
import AdminMembersEnquiriesImportModal from '@/app/frontend_admin/admin_members/members_enquiries/components/AdminMembersEnquiriesImportModal';
import AdminEnquiriesTable from '@/app/frontend_admin/admin_members/members_enquiries/components/AdminMembersEnquiriesTable';
import {
  ADMIN_ENQUIRIES_ENQUIRY_DOT_CLASSES,
  ADMIN_ENQUIRIES_ENQUIRY_KANBAN_COLUMNS,
  ADMIN_ENQUIRIES_ENQUIRY_STATUS_FILTERS,
  ADMIN_ENQUIRIES_URLS,
} from '@/app/frontend_admin/admin_members/members_enquiries/config/admin_members_enquiries.url_config';
import useEnquiriesPage from '@/app/frontend_admin/admin_members/members_enquiries/hooks/useAdminMembersEnquiriesPage';
import type { Enquiry } from '@/app/frontend_admin/admin_members/members_enquiries/schemas/AdminMembersEnquiriesSchema';
import type { AdminEnquiriesEnquiryKanbanCardProps } from '@/app/frontend_admin/admin_members/members_enquiries/types/AdminMembersEnquiriesComponentTypes';
import {
  buildAdminEnquiriesCsv,
  downloadAdminEnquiriesExcel,
  printAdminEnquiriesRoster,
} from '@/app/frontend_admin/admin_members/members_enquiries/utils/AdminMembersEnquiriesTextUtils';
import AdminEmptyState from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveEmptyState';
import { isFrontendDemoModeEnabled } from '@/lib/runtimeFeatures';
import { Download, FileSpreadsheet, LayoutGrid, List, Mail, MessageSquare, MoreHorizontal, PhoneCall, Printer, Search, Smartphone, Upload } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

export { AdminEnquiriesEnquiryKanbanCard };
export type { AdminEnquiriesEnquiryKanbanCardProps };

export default function AdminEnquiriesPageView() {
  const t = useTranslations('ADMIN_ENQUIRIES');
  const model = useEnquiriesPage();
  const { router, isDemoMode, view, setView, search, setSearch, statusFilter, setStatusFilter, filtered, setEnquiries } = model;
  const [timeRange, setTimeRange] = useState<AdminCrmTimeRange>('all');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [isBulkWhatsAppOpen, setIsBulkWhatsAppOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [selectedEnquiryModal, setSelectedEnquiryModal] = useState<Enquiry | null>(null);

  const handleImportLeads = (newLeads: Enquiry[]) => {
    setEnquiries((prev) => [...newLeads, ...prev]);
    toast.success(`Successfully imported ${newLeads.length} enquiry leads.`, { id: 'admin-enquiries-import-success' });
  };

  const statusLabel = (status: string) => {
    const keys: Record<string, string> = { New: 'STATUS_NEW', Visited: 'STATUS_VISITED', Interested: 'STATUS_INTERESTED', Converted: 'STATUS_CONVERTED', Lost: 'STATUS_LOST' };
    return t(keys[status] ?? 'STATUS');
  };

  const timeFiltered = useMemo(() => {
    if (timeRange === 'all') return filtered;
    return filtered.filter((enq) => {
      if (!enq.addedDate) return true;
      const d = new Date(enq.addedDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (timeRange === 'today') {
        const end = new Date(today);
        end.setHours(23, 59, 59, 999);
        return d >= today && d <= end;
      }
      if (timeRange === 'this_week') {
        const ws = new Date(today);
        ws.setDate(today.getDate() - today.getDay());
        return d >= ws;
      }
      if (timeRange === 'this_month') {
        const ms = new Date(today.getFullYear(), today.getMonth(), 1);
        return d >= ms;
      }
      if (timeRange === 'custom') {
        let ok = true;
        if (customStartDate) ok = ok && d >= new Date(customStartDate);
        if (customEndDate) {
          const ce = new Date(customEndDate);
          ce.setHours(23, 59, 59, 999);
          ok = ok && d <= ce;
        }
        return ok;
      }
      return true;
    });
  }, [filtered, timeRange, customStartDate, customEndDate]);

  const colTimeFiltered = (status: Enquiry['status']) => timeFiltered.filter((e) => e.status === status);

  const timeRangeLabel = useMemo(
    () => (timeRange === 'all' ? 'All Time' : timeRange === 'today' ? 'Today' : timeRange === 'this_week' ? 'This Week' : timeRange === 'this_month' ? 'This Month' : 'Custom Range'),
    [timeRange],
  );

  const downloadCsv = () => {
    if (!isDemoMode) { toast.error(t('LIVE_EXPORT_UNAVAILABLE'), { id: 'admin-enquiries-export-live-err' }); return; }
    const blob = new Blob([buildAdminEnquiriesCsv(timeFiltered)], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'admin-crm-demo-enquiries.csv';
    anchor.hidden = true;
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast.success(t('EXPORT_SUCCESS', { count: timeFiltered.length }), { id: 'admin-enquiries-export-csv' });
  };

  const downloadExcel = () => {
    if (!isDemoMode) { toast.error(t('LIVE_EXPORT_UNAVAILABLE'), { id: 'admin-enquiries-export-live-err' }); return; }
    downloadAdminEnquiriesExcel(timeFiltered, 'admin-crm-enquiries.xls');
    toast.success(`Exported ${timeFiltered.length} enquiries to Excel (.xls)`, { id: 'admin-enquiries-export-excel' });
  };

  if (!isFrontendDemoModeEnabled()) {
    return (
      <section className="space-y-3 rounded-lg border border-warning bg-card p-6">
        <h1 className="text-section-title font-semibold text-text-primary">{t('CRM_UNAVAILABLE_TITLE')}</h1>
        <p role="status" className="text-warning-text">{t('CRM_UNAVAILABLE_DESC')}</p>
      </section>
    );
  }

  return (
    <div className="w-full space-y-6 text-text-primary pb-10">
      <div role="status" className="sr-only"><span>{t('CRM_DEMO_BANNER')}</span></div>
      <div className="min-w-0 space-y-6 text-text-primary">
        <AdminMembersEnquiriesHeaderKpis
          timeFiltered={timeFiltered}
          timeRange={timeRange}
          onChangeTimeRange={setTimeRange}
          customStartDate={customStartDate}
          customEndDate={customEndDate}
          onChangeStartDate={setCustomStartDate}
          onChangeEndDate={setCustomEndDate}
          timeRangeLabel={timeRangeLabel}
        />

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card p-3 shadow-card">
          <div className="relative min-w-0 flex-1 max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary pointer-events-none" strokeWidth={2} aria-hidden="true" />
            <input
              maxLength={100}
              type="text"
              aria-label={t('SEARCH_ARIA')}
              disabled={!isDemoMode}
              className="min-h-9 w-full rounded-xl border border-border bg-input px-3 py-1.5 pl-9 text-xs text-text-primary placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              placeholder={t('SEARCH_PLACEHOLDER')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            data-testid="admin_enquiries-AdminEnquiriesPageView-control-009"
            aria-label={t('FILTER_ARIA')}
            disabled={!isDemoMode}
            className="min-h-9 rounded-xl border border-border bg-input px-3 py-1.5 text-xs text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            {ADMIN_ENQUIRIES_ENQUIRY_STATUS_FILTERS.map((status) => (
              <option key={status} value={status}>{status === 'All' ? t('ALL_STATUSES') : statusLabel(status)}</option>
            ))}
          </select>
          <div className="inline-flex items-center gap-1 rounded-xl border border-border bg-surface-highlight p-1">
            <button
              type="button"
              data-testid="admin_enquiries-AdminEnquiriesPageView-control-001"
              className={`inline-flex h-8 w-8 items-center justify-center rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary motion-safe:transition-colors ${view === 'kanban' ? 'bg-primary text-on-primary shadow-card' : 'text-primary hover:bg-surface-hover'}`}
              onClick={() => setView('kanban')}
              title={t('KANBAN_TITLE')}
              aria-label={t('KANBAN_SWITCH')}
              aria-pressed={view === 'kanban'}
            >
              <LayoutGrid size={15} strokeWidth={2} aria-hidden="true" />
            </button>
            <button
              type="button"
              data-testid="admin_enquiries-AdminEnquiriesPageView-control-002"
              className={`inline-flex h-8 w-8 items-center justify-center rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary motion-safe:transition-colors ${view === 'table' ? 'bg-primary text-on-primary shadow-card' : 'text-primary hover:bg-surface-hover'}`}
              onClick={() => setView('table')}
              title={t('TABLE_TITLE')}
              aria-label={t('TABLE_SWITCH')}
              aria-pressed={view === 'table'}
            >
              <List size={15} strokeWidth={2} aria-hidden="true" />
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button data-testid="admin_enquiries-AdminEnquiriesPageView-control-003" className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-warning bg-warning-bg px-3 py-1.5 text-xs font-medium text-warning-text hover:opacity-90 motion-safe:transition-opacity" type="button" onClick={() => setIsImportModalOpen(true)} title={t('IMPORT_TITLE')}>
              <Upload size={14} strokeWidth={2} aria-hidden="true" /> {t('IMPORT')}
            </button>
            <button data-testid="admin_enquiries-AdminEnquiriesPageView-control-004" className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-info bg-info-bg px-3 py-1.5 text-xs font-medium text-info-text hover:opacity-90 motion-safe:transition-opacity disabled:cursor-not-allowed disabled:opacity-40" type="button" disabled={!isDemoMode || timeFiltered.length === 0} title={isDemoMode ? t('EXPORT_DEMO_TITLE') : t('EXPORT_LIVE_TITLE')} onClick={downloadCsv}>
              <Download size={14} strokeWidth={2} aria-hidden="true" /> {t('CSV')}
            </button>
            <button className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-success bg-success-bg px-3 py-1.5 text-xs font-medium text-success-text hover:opacity-90 motion-safe:transition-opacity disabled:cursor-not-allowed disabled:opacity-40" type="button" disabled={!isDemoMode || timeFiltered.length === 0} title="Export Excel spreadsheet (.xls)" onClick={downloadExcel}>
              <FileSpreadsheet size={14} strokeWidth={2} aria-hidden="true" /> Excel
            </button>
            <button data-testid="admin_enquiries-AdminEnquiriesPageView-control-005" className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-border-focus bg-primary-subtle px-3 py-1.5 text-xs font-medium text-primary hover:opacity-90 motion-safe:transition-opacity disabled:cursor-not-allowed disabled:opacity-40" type="button" onClick={() => printAdminEnquiriesRoster(timeFiltered)}>
              <Printer size={14} strokeWidth={2} aria-hidden="true" /> {t('PRINT')}
            </button>
            <button data-testid="admin_enquiries-AdminEnquiriesPageView-control-006" className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-success bg-success-bg px-3 py-1.5 text-xs font-semibold text-success-text hover:opacity-90 motion-safe:transition-opacity disabled:cursor-not-allowed disabled:opacity-40" type="button" disabled={timeFiltered.length === 0} title={t('WHATSAPP_TITLE')} onClick={() => setIsBulkWhatsAppOpen(true)}>
              <MessageSquare size={14} strokeWidth={2} aria-hidden="true" />
              <span>Bulk WhatsApp ({timeFiltered.length})</span>
            </button>
            <button data-testid="admin_enquiries-AdminEnquiriesPageView-control-007" className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-border bg-surface-highlight px-3 py-1.5 text-xs font-medium text-info-text hover:bg-surface-hover motion-safe:transition-colors disabled:cursor-not-allowed disabled:opacity-40" type="button" disabled title={t('SMS_TITLE')}>
              <Smartphone size={14} strokeWidth={2} aria-hidden="true" /> {t('SMS')}
            </button>
            <button data-testid="admin_enquiries-AdminEnquiriesPageView-control-008" className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-border bg-surface-highlight px-3 py-1.5 text-xs font-medium text-primary hover:bg-surface-hover motion-safe:transition-colors disabled:cursor-not-allowed disabled:opacity-40" type="button" disabled title={t('EMAIL_TITLE')}>
              <Mail size={14} strokeWidth={2} aria-hidden="true" /> {t('EMAIL')}
            </button>
          </div>
        </div>

        {view === 'kanban' && (
          !isDemoMode ? (
            <p data-testid="admin_enquiries-AdminEnquiriesPageView-state-live-unavailable" role="status" className="mt-12 rounded-xl border border-warning bg-warning-bg p-4 text-warning-text">{t('LIVE_WARNING')}</p>
          ) : timeFiltered.length === 0 ? (
            <div data-testid="admin_enquiries-AdminEnquiriesPageView-state-010" className="mt-12"><AdminEmptyState showIcon={false} title={t('NO_ENQUIRIES')} description={t('NO_MATCHING_ENQUIRIES')} /></div>
          ) : (
            <div className="grid min-w-0 grid-cols-[repeat(5,minmax(15rem,84vw))] gap-4 overflow-x-auto pb-2 md:grid-cols-[repeat(5,minmax(15rem,1fr))]">
              {ADMIN_ENQUIRIES_ENQUIRY_KANBAN_COLUMNS.map((col) => {
                const cards = colTimeFiltered(col.id);
                return (
                  <div key={col.id} className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-card">
                    <div className="flex items-center justify-between gap-2 border-b border-border bg-surface-highlight p-3">
                      <div className="flex min-w-0 items-center gap-2">
                        <span className={`h-2 w-2 shrink-0 rounded-full bg-primary ${ADMIN_ENQUIRIES_ENQUIRY_DOT_CLASSES[col.id]}`} />
                        <span className="truncate text-xs font-bold text-text-primary uppercase tracking-wider">{statusLabel(col.label)}</span>
                        <span className="inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-card px-2 text-[11px] font-bold text-text-secondary border border-border">{cards.length}</span>
                      </div>
                      <button type="button" data-testid="admin_enquiries-AdminEnquiriesPageView-control-013" className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-text-secondary hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-40" title={t('COLUMN_ACTIONS_UNAVAILABLE')} aria-label={t('COLUMN_OPTIONS')} disabled>
                        <MoreHorizontal size={16} strokeWidth={2} aria-hidden="true" />
                      </button>
                    </div>
                    <div className="flex min-h-40 flex-col gap-3 p-3">
                      {cards.length === 0 ? (
                        <div data-testid="admin_enquiries-AdminEnquiriesPageView-state-014" className="rounded-xl border border-dashed border-border p-4 text-center">
                          <PhoneCall size={18} strokeWidth={2} className="mx-auto text-text-disabled mb-2" aria-hidden="true" />
                          <p data-testid="admin_enquiries-AdminEnquiriesPageView-state-015" className="text-xs font-medium text-text-primary">{t('NO_STATUS_LEADS', { status: statusLabel(col.label) })}</p>
                          <p data-testid="admin_enquiries-AdminEnquiriesPageView-state-016" className="mt-1 text-[11px] text-text-secondary">{t('LEADS_MOVE_HINT', { status: statusLabel(col.label) })}</p>
                        </div>
                      ) : (
                        cards.map((enq) => <AdminEnquiriesEnquiryKanbanCard key={enq.id} enq={enq} colClass={col.cardClass} onClick={() => setSelectedEnquiryModal(enq)} />)
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}

        {view === 'table' && (
          isDemoMode ? (
            <AdminEnquiriesTable enquiries={timeFiltered} onSelectEnquiry={setSelectedEnquiryModal} />
          ) : (
            <p role="status" className="mt-12 rounded-lg border border-warning bg-warning-bg p-4 text-warning-text">{t('TABLE_UNAVAILABLE')}</p>
          )
        )}
      </div>

      <AdminMembersEnquiriesDetailModal
        isOpen={Boolean(selectedEnquiryModal)}
        onClose={() => setSelectedEnquiryModal(null)}
        enquiry={selectedEnquiryModal}
        onNavigateFullPage={(id) => { setSelectedEnquiryModal(null); router.push(ADMIN_ENQUIRIES_URLS.ENQUIRY_DETAIL(id)); }}
      />
      <AdminMembersEnquiriesBulkWhatsAppModal isOpen={isBulkWhatsAppOpen} onClose={() => setIsBulkWhatsAppOpen(false)} enquiries={timeFiltered} />
      <AdminMembersEnquiriesImportModal isOpen={isImportModalOpen} onClose={() => setIsImportModalOpen(false)} onImport={handleImportLeads} />
    </div>
  );
}
