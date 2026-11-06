'use client';
import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { isFrontendDemoModeEnabled } from '@/app/frontend_admin/lib/runtimeFeatures';
import { Search, LayoutGrid, List, MoreHorizontal, PhoneCall, Upload, Download, Printer, MessageSquare, Send, Mail, CalendarDays, CheckCircle, Clock, Phone, User, Calendar, Users, TrendingUp, UserCheck, Target, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { ADMIN_ENQUIRIES_ENQUIRY_KANBAN_COLUMNS, ADMIN_ENQUIRIES_ENQUIRY_STATUS_FILTERS, ADMIN_ENQUIRIES_URLS, ADMIN_ENQUIRIES_ENQUIRY_DOT_CLASSES } from '@/app/frontend_admin/admin_members/members_enquiries/config/admin_members_enquiries.url_config';
import useEnquiriesPage from '@/app/frontend_admin/admin_members/members_enquiries/hooks/useAdminMembersEnquiriesPage';
import AdminEnquiriesTable from '@/app/frontend_admin/admin_members/members_enquiries/components/AdminMembersEnquiriesTable';
import AdminEnquiriesEnquiryKanbanCard from '@/app/frontend_admin/admin_members/members_enquiries/components/AdminEnquiriesEnquiryKanbanCard';
import AdminMembersEnquiriesBulkWhatsAppModal from '@/app/frontend_admin/admin_members/members_enquiries/components/AdminMembersEnquiriesBulkWhatsAppModal';

import AdminEmptyState from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveEmptyState';
import { buildAdminEnquiriesCsv } from '@/app/frontend_admin/admin_members/members_enquiries/utils/AdminMembersEnquiriesTextUtils';
import type { Enquiry } from '@/app/frontend_admin/admin_members/members_enquiries/schemas/AdminMembersEnquiriesSchema';
import type { AdminEnquiriesEnquiryKanbanCardProps } from '@/app/frontend_admin/admin_members/members_enquiries/types/AdminMembersEnquiriesComponentTypes';

type AdminCrmTimeRange = 'all' | 'today' | 'this_week' | 'this_month' | 'custom';

export default function AdminEnquiriesPageView() {
  const t = useTranslations('ADMIN_ENQUIRIES');
  const model = useEnquiriesPage();
  const { router, isDemoMode, view, setView, search, setSearch, statusFilter, setStatusFilter, filtered } = model;
  const [timeRange, setTimeRange] = useState<AdminCrmTimeRange>('all');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBulkWhatsAppOpen, setIsBulkWhatsAppOpen] = useState(false);

  if (!isFrontendDemoModeEnabled()) return <section className="space-y-3 rounded-lg border border-warning-bg bg-card p-6"><h1 className="text-section-title font-semibold text-text-primary">{t('CRM_UNAVAILABLE_TITLE')}</h1><p role="status" className="text-warning-text">{t('CRM_UNAVAILABLE_DESC')}</p></section>;
  const statusLabel = (status: string) => {
    const keys: Record<string, string> = { New: 'STATUS_NEW', Visited: 'STATUS_VISITED', Interested: 'STATUS_INTERESTED', Converted: 'STATUS_CONVERTED', Lost: 'STATUS_LOST' };
    return t(keys[status] ?? 'STATUS');
  };

  const timeFiltered = useMemo(() => {
    if (timeRange === 'all') return filtered;
    return filtered.filter((enq) => {
      if (!enq.addedDate) return true;
      const d = new Date(enq.addedDate);
      const today = new Date(); today.setHours(0, 0, 0, 0);
      if (timeRange === 'today') { const end = new Date(today); end.setHours(23,59,59,999); return d >= today && d <= end; }
      if (timeRange === 'this_week') { const ws = new Date(today); ws.setDate(today.getDate() - today.getDay()); return d >= ws; }
      if (timeRange === 'this_month') { const ms = new Date(today.getFullYear(), today.getMonth(), 1); return d >= ms; }
      if (timeRange === 'custom') {
        let ok = true;
        if (customStartDate) ok = ok && d >= new Date(customStartDate);
        if (customEndDate) { const ce = new Date(customEndDate); ce.setHours(23,59,59,999); ok = ok && d <= ce; }
        return ok;
      }
      return true;
    });
  }, [filtered, timeRange, customStartDate, customEndDate]);

  const totalLeads = timeFiltered.length;
  const newProspects = timeFiltered.filter((e) => e.status === 'New').length;
  const inPipeline = timeFiltered.filter((e) => ['Visited', 'Interested'].includes(e.status)).length;
  const converted = timeFiltered.filter((e) => e.status === 'Converted').length;
  const conversionRate = totalLeads > 0 ? Math.round((converted / totalLeads) * 100) : 0;
  const colTimeFiltered = (status: Enquiry['status']) => timeFiltered.filter((e) => e.status === status);

  const timeRangeLabel = useMemo(() => {
    return timeRange === 'all' ? 'All Time' : timeRange === 'today' ? 'Today' : timeRange === 'this_week' ? 'This Week' : timeRange === 'this_month' ? 'This Month' : 'Custom Range';
  }, [timeRange]);

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };
  const toggleSelectAll = () => {
    const allIds = timeFiltered.map((e) => e.id);
    setSelectedIds((prev) => prev.length === allIds.length ? [] : allIds);
  };
  const clearSelection = () => setSelectedIds([]);

  const downloadCsv = () => {
    if (!isDemoMode) { toast.error(t('LIVE_EXPORT_UNAVAILABLE')); return; }
    const blob = new Blob([buildAdminEnquiriesCsv(timeFiltered)], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url; anchor.download = 'admin-crm-demo-enquiries.csv'; anchor.hidden = true;
    document.body.append(anchor); anchor.click(); anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast.success(t('EXPORT_SUCCESS', { count: timeFiltered.length }));
  };

  const whatsappRecipients = useMemo(() => {
    return selectedIds.length > 0 ? timeFiltered.filter((e) => selectedIds.includes(e.id)) : timeFiltered;
  }, [selectedIds, timeFiltered]);

  return (
    <div className="space-y-6 pb-10">
      <p className="rounded-xl border border-warning-border bg-warning-bg p-3 text-xs font-medium text-warning-text" role="status">{t('CRM_DEMO_BANNER')}</p>
      <div className="min-w-0 space-y-6 text-text-primary">
        {/* Executive Header */}
        <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-r from-surface to-surface-elevated p-6 shadow-sm">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-md bg-info-bg px-2.5 py-0.5 text-xs font-semibold text-info-text"><Target className="h-3.5 w-3.5" />{t('BREADCRUMB')}</span>
                <span className="text-xs text-text-muted">• CRM Pipeline</span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">{t('PAGE_TITLE')}</h1>
              <p className="text-sm text-text-secondary">{isDemoMode ? t('DEMO_SUBTITLE', { count: timeFiltered.length }) : t('LIVE_SUBTITLE')} • Range: <span className="font-semibold text-primary">{timeRangeLabel}</span></p>
            </div>
            <div className="flex flex-wrap items-center gap-2.5 rounded-xl border border-border bg-surface p-2 shadow-sm backdrop-blur-md">
              <div className="flex items-center rounded-lg bg-surface-muted p-1 border border-border">
                {(['all', 'today', 'this_week', 'this_month', 'custom'] as const).map((r) => (
                  <button key={r} type="button" onClick={() => setTimeRange(r)} className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${timeRange === r ? 'bg-primary text-primary-contrast shadow-sm scale-[1.02]' : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'}`}>
                    {r === 'all' ? 'All Time' : r === 'today' ? 'Today' : r === 'this_week' ? 'This Week' : r === 'this_month' ? 'This Month' : <><Calendar className="h-3 w-3" />Custom</>}
                  </button>
                ))}
              </div>
              {timeRange === 'custom' && (
                <div className="flex items-center gap-1.5 text-xs">
                  <input type="date" value={customStartDate} onChange={(e) => setCustomStartDate(e.target.value)} aria-label="Start date" className="rounded-lg border border-border bg-surface px-2.5 py-1 text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-primary" />
                  <span className="text-text-muted">to</span>
                  <input type="date" value={customEndDate} onChange={(e) => setCustomEndDate(e.target.value)} aria-label="End date" className="rounded-lg border border-border bg-surface px-2.5 py-1 text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-primary" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 4 KPI Cards */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            { label: 'Total Leads', value: totalLeads, icon: Users, color: 'indigo', sub: `All enquiries in ${timeRangeLabel}` },
            { label: 'New Prospects', value: newProspects, icon: UserCheck, color: 'sky', sub: `Fresh inbound leads (${timeRangeLabel})` },
            { label: 'In Pipeline', value: inPipeline, icon: TrendingUp, color: 'amber', sub: `Visited + Interested (${timeRangeLabel})` },
            { label: 'Conversion Rate', value: `${conversionRate}%`, icon: Target, color: 'emerald', sub: `${converted} admitted in ${timeRangeLabel}` },
          ].map(({ label, value, icon: Icon, color, sub }) => (
            <div key={label} className="group relative overflow-hidden rounded-xl border border-border bg-surface p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">{label}</span>
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${color === 'indigo' || color === 'sky' ? 'bg-info-bg text-info-text' : color === 'amber' ? 'bg-warning-bg text-warning-text' : 'bg-success-bg text-success-text'}`}><Icon size={17} strokeWidth={2.2} /></div>
              </div>
              <p className="text-2xl font-bold tracking-tight text-text-primary">{value}</p>
              <p className="mt-1 text-xs text-text-muted">{sub}</p>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-surface p-3 shadow-sm">
          <div className="relative min-w-0 flex-1 max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" strokeWidth={2} />
            <input type="text" aria-label={t('SEARCH_ARIA')} disabled={!isDemoMode} className="min-h-9 w-full rounded-lg border border-border bg-input px-3 py-1.5 pl-9 text-xs text-text-primary placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" placeholder={t('SEARCH_PLACEHOLDER')} value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select data-testid="admin_enquiries-AdminEnquiriesPageView-control-009" aria-label={t('FILTER_ARIA')} disabled={!isDemoMode} className="min-h-9 rounded-lg border border-border bg-input px-3 py-1.5 text-xs text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            {ADMIN_ENQUIRIES_ENQUIRY_STATUS_FILTERS.map((status) => (<option key={status} value={status}>{status === 'All' ? t('ALL_STATUSES') : statusLabel(status)}</option>))}
          </select>
          <div className="inline-flex items-center gap-1 rounded-lg border border-border bg-surface-muted p-1">
            <button data-testid="admin_enquiries-AdminEnquiriesPageView-control-001" className={`inline-flex h-8 w-8 items-center justify-center rounded-md text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-all ${view === 'kanban' ? 'bg-primary text-primary-contrast shadow-sm' : 'hover:bg-surface-elevated'}`} onClick={() => setView('kanban')} title={t('KANBAN_TITLE')} aria-label={t('KANBAN_SWITCH')} aria-pressed={view === 'kanban'}><LayoutGrid size={15} strokeWidth={2}/></button>
            <button data-testid="admin_enquiries-AdminEnquiriesPageView-control-002" className={`inline-flex h-8 w-8 items-center justify-center rounded-md text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-all ${view === 'table' ? 'bg-primary text-primary-contrast shadow-sm' : 'hover:bg-surface-elevated'}`} onClick={() => setView('table')} title={t('TABLE_TITLE')} aria-label={t('TABLE_SWITCH')} aria-pressed={view === 'table'}><List size={15} strokeWidth={2}/></button>
          </div>
          <div className="flex items-center gap-1.5">
            {selectedIds.length > 0 && (
              <button type="button" onClick={clearSelection} className="inline-flex h-9 items-center gap-1 rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs font-medium text-text-secondary hover:bg-surface-elevated">
                <XCircle size={13} /> Clear ({selectedIds.length})
              </button>
            )}
            <button data-testid="admin_enquiries-AdminEnquiriesPageView-control-003" className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-text-secondary hover:bg-surface-elevated transition-colors disabled:cursor-not-allowed disabled:opacity-50" type="button" disabled title={t('IMPORT_TITLE')}><Upload size={14} strokeWidth={2}/> {t('IMPORT')}</button>
            <button data-testid="admin_enquiries-AdminEnquiriesPageView-control-004" className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-text-secondary hover:bg-surface-elevated transition-colors disabled:cursor-not-allowed disabled:opacity-50" type="button" disabled={!isDemoMode || timeFiltered.length === 0} title={isDemoMode ? t('EXPORT_DEMO_TITLE') : t('EXPORT_LIVE_TITLE')} onClick={downloadCsv}><Download size={14} strokeWidth={2}/> {t('CSV')}</button>
            <button data-testid="admin_enquiries-AdminEnquiriesPageView-control-005" className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-text-secondary hover:bg-surface-elevated transition-colors disabled:cursor-not-allowed disabled:opacity-50" type="button" onClick={() => window.print()}><Printer size={14} strokeWidth={2}/> {t('PRINT')}</button>
            <button data-testid="admin_enquiries-AdminEnquiriesPageView-control-006" className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-success-bg bg-success-bg px-3 py-1.5 text-xs font-semibold text-success-text hover:bg-success hover:text-on-success transition-all disabled:cursor-not-allowed disabled:opacity-50" type="button" disabled={timeFiltered.length === 0} title={t('WHATSAPP_TITLE')} onClick={() => setIsBulkWhatsAppOpen(true)}>
              <MessageSquare size={14} strokeWidth={2}/> {t('WHATSAPP')}
              {selectedIds.length > 0 && <span className="rounded-full bg-success text-on-success px-1.5 py-0.2 text-[10px] font-bold">{selectedIds.length}</span>}
            </button>
            <button data-testid="admin_enquiries-AdminEnquiriesPageView-control-007" className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-sky-600 hover:bg-surface-elevated transition-colors disabled:cursor-not-allowed disabled:opacity-50" type="button" disabled title={t('TELEGRAM_TITLE')}><Send size={14} strokeWidth={2}/> {t('TELEGRAM')}</button>
            <button data-testid="admin_enquiries-AdminEnquiriesPageView-control-008" className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-surface-elevated transition-colors disabled:cursor-not-allowed disabled:opacity-50" type="button" disabled title={t('EMAIL_TITLE')}><Mail size={14} strokeWidth={2}/> {t('EMAIL')}</button>
          </div>
        </div>

        {/* KANBAN VIEW */}
        {view === 'kanban' && (
          <>
            {!isDemoMode ? (
              <p data-testid="admin_enquiries-AdminEnquiriesPageView-state-live-unavailable" role="status" className="mt-12 rounded-lg border border-warning-bg bg-warning-bg p-4 text-warning-text">{t('LIVE_WARNING')}</p>
            ) : timeFiltered.length === 0 ? (
              <div data-testid="admin_enquiries-AdminEnquiriesPageView-state-010" className="mt-12"><AdminEmptyState showIcon={false} title={t('NO_ENQUIRIES')} description={t('NO_MATCHING_ENQUIRIES')} /></div>
            ) : (
              <div className="grid min-w-0 grid-cols-[repeat(5,minmax(15rem,84vw))] gap-4 overflow-x-auto pb-2 md:grid-cols-[repeat(5,minmax(15rem,1fr))]">
                {ADMIN_ENQUIRIES_ENQUIRY_KANBAN_COLUMNS.map((col) => {
                  const cards = colTimeFiltered(col.id);
                  return (
                    <div key={col.id} className="flex min-w-0 flex-col overflow-hidden rounded-xl border border-border bg-surface-zebra">
                      <div className="flex items-center justify-between gap-2 border-b border-border bg-card p-3">
                        <div className="flex min-w-0 items-center gap-2">
                          <span className={`h-2 w-2 shrink-0 rounded-full bg-primary ${ADMIN_ENQUIRIES_ENQUIRY_DOT_CLASSES[col.id]}`} />
                          <span className="truncate text-body font-semibold text-text-primary">{statusLabel(col.label)}</span>
                          <span className="inline-flex min-h-6 min-w-6 items-center justify-center rounded-full bg-surface-highlight px-2 text-caption font-semibold text-text-secondary">{cards.length}</span>
                        </div>
                        <button data-testid="admin_enquiries-AdminEnquiriesPageView-control-013" className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border border-border bg-card text-text-primary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50" title={t('COLUMN_ACTIONS_UNAVAILABLE')} aria-label={t('COLUMN_OPTIONS')} disabled><MoreHorizontal size={18} strokeWidth={2}/></button>
                      </div>
                      <div className="flex min-h-40 flex-col gap-3 p-3">
                        {cards.length === 0 ? (
                          <div data-testid="admin_enquiries-AdminEnquiriesPageView-state-014" className="rounded-md border border-dashed border-border p-4 text-center">
                            <PhoneCall size={18} strokeWidth={2}/>
                            <p data-testid="admin_enquiries-AdminEnquiriesPageView-state-015" className="text-body font-medium text-text-primary">{t('NO_STATUS_LEADS', { status: statusLabel(col.label) })}</p>
                            <p data-testid="admin_enquiries-AdminEnquiriesPageView-state-016" className="mt-1 text-caption text-text-secondary">{t('LEADS_MOVE_HINT', { status: statusLabel(col.label) })}</p>
                          </div>
                        ) : (
                          cards.map((enq) => (
                            <AdminEnquiriesEnquiryKanbanCard key={enq.id} enq={enq} colClass={col.cardClass} onClick={() => router.push(ADMIN_ENQUIRIES_URLS.ENQUIRY_DETAIL(enq.id))} />
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

        {/* TABLE VIEW */}
        {view === 'table' && (
          isDemoMode ? (
            <AdminEnquiriesTable
              enquiries={timeFiltered}
              selectedIds={selectedIds}
              onToggleSelectOne={toggleSelectOne}
              onToggleSelectAll={toggleSelectAll}
              onSelectEnquiry={(enquiry) => router.push(ADMIN_ENQUIRIES_URLS.ENQUIRY_DETAIL(enquiry.id))}
            />
          ) : (
            <p role="status" className="mt-12 rounded-lg border border-warning-bg bg-warning-bg p-4 text-warning-text">{t('TABLE_UNAVAILABLE')}</p>
          )
        )}
      </div>

      {/* Bulk WhatsApp Queue Dialog */}
      <AdminMembersEnquiriesBulkWhatsAppModal
        isOpen={isBulkWhatsAppOpen}
        onClose={() => setIsBulkWhatsAppOpen(false)}
        enquiries={whatsappRecipients}
      />
    </div>
  );
}

export { AdminEnquiriesEnquiryKanbanCard };
export type { AdminEnquiriesEnquiryKanbanCardProps };
