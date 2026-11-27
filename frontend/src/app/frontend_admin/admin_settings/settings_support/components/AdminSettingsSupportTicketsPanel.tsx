'use client';

// RESPONSIBILITY: AdminSupportTicketsPanel component owned by admin_support; responsibility folder: admin_support_components_sections.

import AdminSupportCreateTicketForm from '@/app/frontend_admin/admin_settings/settings_support/components/AdminSettingsSupportCreateTicketForm';
import { AdminSettingsSupportKpiGrid } from '@/app/frontend_admin/admin_settings/settings_support/components/AdminSettingsSupportKpiGrid';
import { ADMIN_SUPPORT_DEMO_TICKETS } from '@/app/frontend_admin/admin_settings/settings_support/config/admin_settings_support.demo_data';
import {
  Clock,
  Mail,
  MessageSquare,
  PhoneCall,
  Plus,
  Search,
  Ticket,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';

export default function AdminSupportTicketsPanel() {
  const t = useTranslations('ADMIN_SUPPORT');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'resolved'>('all');

  const kpis = useMemo(() => {
    return {
      total: ADMIN_SUPPORT_DEMO_TICKETS.length,
      open: ADMIN_SUPPORT_DEMO_TICKETS.filter((ticket) => ticket.status === 'open').length,
      resolved: ADMIN_SUPPORT_DEMO_TICKETS.filter((ticket) => ticket.status === 'resolved').length,
    };
  }, []);

  const filteredTickets = useMemo(() => {
    return ADMIN_SUPPORT_DEMO_TICKETS.filter((ticket) => {
      const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        query === '' ||
        ticket.id.toLowerCase().includes(query) ||
        t(ticket.subjectKey).toLowerCase().includes(query) ||
        t(ticket.categoryKey).toLowerCase().includes(query);
      return matchesStatus && matchesSearch;
    });
  }, [searchQuery, statusFilter, t]);

  if (showCreateForm) return <AdminSupportCreateTicketForm onCancel={() => setShowCreateForm(false)} />;

  return (
    <div className="space-y-6">
      <AdminSettingsSupportKpiGrid total={kpis.total} open={kpis.open} resolved={kpis.resolved} />

      <section
        className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-card space-y-5"
        aria-labelledby="admin-support-tickets-title"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-4">
          <div>
            <h2 id="admin-support-tickets-title" className="text-lg font-bold text-text-primary flex items-center gap-2">
              <Ticket size={18} className="text-primary" aria-hidden="true" />
              <span>{t('TICKETS_TITLE')}</span>
            </h2>
            <p className="text-xs text-text-secondary mt-0.5">
              Track, inspect, and submit administrative assistance requests
            </p>
          </div>
          <button
            type="button"
            data-testid="admin_support-AdminSettingsSupportMain-control-002"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-on-primary hover:bg-primary-hover shadow-card motion-safe:transition-colors cursor-pointer self-start sm:self-auto"
            onClick={() => setShowCreateForm(true)}
          >
            <Plus size={16} strokeWidth={2.2} aria-hidden="true" />
            <span>{t('CREATE_TICKET')}</span>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold motion-safe:transition-colors cursor-pointer border ${
                statusFilter === 'all'
                  ? 'bg-primary-subtle border-border-focus text-primary'
                  : 'bg-surface-highlight border-border text-text-secondary hover:text-text-primary hover:bg-surface-hover'
              }`}
            >
              All ({ADMIN_SUPPORT_DEMO_TICKETS.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('open')}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold motion-safe:transition-colors cursor-pointer border ${
                statusFilter === 'open'
                  ? 'bg-warning-bg border-warning text-warning-text'
                  : 'bg-surface-highlight border-border text-text-secondary hover:text-text-primary hover:bg-surface-hover'
              }`}
            >
              {t('TICKET_OPEN')} ({kpis.open})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('resolved')}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold motion-safe:transition-colors cursor-pointer border ${
                statusFilter === 'resolved'
                  ? 'bg-success-bg border-success text-success-text'
                  : 'bg-surface-highlight border-border text-text-secondary hover:text-text-primary hover:bg-surface-hover'
              }`}
            >
              {t('TICKET_RESOLVED')} ({kpis.resolved})
            </button>
          </div>

          <div className="relative min-w-[220px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" aria-hidden="true" />
            <input
              maxLength={30}
              type="text"
              placeholder="Search tickets by subject or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-border bg-input pl-8 pr-3 py-1.5 text-xs text-text-primary placeholder:text-text-secondary focus:border-border-focus focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-3">
          {filteredTickets.map((ticket) => (
            <article
              key={ticket.id}
              className="flex flex-col gap-3.5 rounded-2xl border border-border bg-surface-highlight p-4 sm:p-5 motion-safe:transition-colors hover:border-border-focus hover:bg-surface-hover shadow-card sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex min-w-0 items-start gap-3.5">
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-subtle border border-border-focus text-primary mt-0.5"
                  aria-hidden="true"
                >
                  <Ticket size={18} strokeWidth={2} />
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold text-sm text-text-primary">{t(ticket.subjectKey)}</h3>
                    <span
                      className={`rounded-full border px-2.5 py-0.5 text-micro font-semibold tracking-wide uppercase ${
                        ticket.status === 'open'
                          ? 'border-warning bg-warning-bg text-warning-text'
                          : 'border-success bg-success-bg text-success-text'
                      }`}
                    >
                      {t(ticket.status === 'open' ? 'TICKET_OPEN' : 'TICKET_RESOLVED')}
                    </span>
                  </div>
                  <div className="mt-1.5 flex flex-wrap items-center gap-x-3.5 gap-y-1.5 text-xs text-text-secondary font-mono">
                    <span className="font-semibold text-text-primary">#{ticket.id}</span>
                    <span className="font-sans text-text-secondary">
                      {t('FIELD_CATEGORY')}:{' '}
                      <span className="text-text-primary font-medium">{t(ticket.categoryKey)}</span>
                    </span>
                    <span
                      className={`font-sans rounded-full px-2 py-0.5 border text-micro font-semibold ${
                        ticket.priority === 'high'
                          ? 'border-danger bg-danger-bg text-danger-text'
                          : 'border-border bg-card text-text-secondary'
                      }`}
                    >
                      {t('FIELD_PRIORITY')}:{' '}
                      {t(ticket.priority === 'high' ? 'PRIORITY_HIGH' : 'PRIORITY_LOW')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex shrink-0 items-center justify-between sm:justify-end gap-3 text-xs text-text-secondary pt-2 sm:pt-0 border-t sm:border-t-0 border-border">
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-card px-3 py-1.5 border border-border text-text-primary font-medium">
                  <MessageSquare size={13} strokeWidth={2} aria-hidden="true" className="text-primary" />
                  <span>
                    {ticket.replies} {t('REPLIES')}
                  </span>
                </span>
                <span className="font-mono text-text-secondary flex items-center gap-1 text-micro">
                  <Clock size={12} className="text-text-secondary" aria-hidden="true" />
                  {t(ticket.dateKey)}
                </span>
              </div>
            </article>
          ))}
          {filteredTickets.length === 0 && (
            <div className="p-8 text-center text-xs text-text-secondary rounded-xl border border-dashed border-border">
              No tickets matched your search query.
            </div>
          )}
        </div>
      </section>

      <div className="rounded-2xl border border-border bg-card p-5 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="h-11 w-11 rounded-2xl bg-primary-subtle border border-border-focus flex items-center justify-center text-primary shrink-0">
            <PhoneCall size={20} aria-hidden="true" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-text-primary flex items-center gap-2">
              <span>Priority Helpdesk Hotline</span>
              <span className="text-micro font-semibold text-success-text bg-success-bg border border-success px-2 py-0.5 rounded-full">
                Active 24/7
              </span>
            </h4>
            <p className="text-xs text-text-secondary mt-0.5">
              Urgent server or facility escalations can be dispatched directly to the engineering team.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <a
            href="mailto:support@smartlibrary.com"
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface-highlight px-3.5 py-2 text-xs font-semibold text-text-primary hover:bg-surface-hover motion-safe:transition-colors"
          >
            <Mail size={13} aria-hidden="true" />
            <span>Email Desk</span>
          </a>
        </div>
      </div>
    </div>
  );
}
