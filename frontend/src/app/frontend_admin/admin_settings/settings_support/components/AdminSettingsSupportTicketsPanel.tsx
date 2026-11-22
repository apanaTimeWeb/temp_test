'use client';
// RESPONSIBILITY: AdminSupportTicketsPanel component owned by admin_support; responsibility folder: admin_support_components_sections.

import AdminSupportCreateTicketForm from '@/app/frontend_admin/admin_settings/settings_support/components/AdminSettingsSupportCreateTicketForm';
import { ADMIN_SUPPORT_DEMO_TICKETS } from '@/app/frontend_admin/admin_settings/settings_support/mocks/scenarios/admin_settings_support.scenarios';
import {
AlertCircle,
CheckCircle2,
Clock,
Mail,
MessageSquare,
PhoneCall,
Plus,
Search,
Ticket,
Zap,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo,useState } from 'react';

/** Contains the ticket-list/draft-validation flow, limited to fixtures in explicit demo mode. */
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
      {/* Support KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Raised - Indigo */}
        <div className="group relative overflow-hidden rounded-2xl border border-indigo-500/25 bg-gradient-to-br from-[#0c0f28]/95 via-[#0c0f28]/90 to-[#12163a]/80 p-5 shadow-lg shadow-indigo-950/30 transition-all duration-300 hover:scale-[1.01] hover:border-indigo-500/40 hover:shadow-xl hover:shadow-indigo-950/40">
          <div className="pointer-events-none absolute -right-6 -bottom-6 h-28 w-28 rounded-full bg-indigo-500/10 blur-2xl transition-all duration-500 group-hover:bg-indigo-500/20" />
          <div className="relative flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              {t('TICKETS_TITLE')}
            </span>
            <div className="p-2.5 rounded-xl border shrink-0 transition-transform group-hover:scale-110 shadow-xs bg-indigo-500/15 border-indigo-500/30 text-indigo-400">
              <Ticket size={18} strokeWidth={2.2} />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold tracking-tight text-white">{kpis.total}</p>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1 font-semibold rounded-full px-2 py-0.5 border text-indigo-300 bg-indigo-500/10 border-indigo-500/25">
              Total Raised
            </span>
          </div>
        </div>

        {/* Open Tickets - Amber */}
        <div className="group relative overflow-hidden rounded-2xl border border-amber-500/25 bg-gradient-to-br from-[#1c1408]/95 via-[#1c1408]/90 to-[#2c200c]/80 p-5 shadow-lg shadow-amber-950/30 transition-all duration-300 hover:scale-[1.01] hover:border-amber-500/40 hover:shadow-xl hover:shadow-amber-950/40">
          <div className="pointer-events-none absolute -right-6 -bottom-6 h-28 w-28 rounded-full bg-amber-500/10 blur-2xl transition-all duration-500 group-hover:bg-amber-500/20" />
          <div className="relative flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              {t('TICKET_OPEN')}
            </span>
            <div className="p-2.5 rounded-xl border shrink-0 transition-transform group-hover:scale-110 shadow-xs bg-amber-500/15 border-amber-500/30 text-amber-400">
              <AlertCircle size={18} strokeWidth={2.2} />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold tracking-tight text-amber-400">{kpis.open}</p>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1 font-semibold rounded-full px-2 py-0.5 border text-amber-300 bg-amber-500/10 border-amber-500/25">
              Awaiting Action
            </span>
          </div>
        </div>

        {/* Resolved - Emerald */}
        <div className="group relative overflow-hidden rounded-2xl border border-emerald-500/25 bg-gradient-to-br from-[#091a16]/95 via-[#091a16]/90 to-[#0e2721]/80 p-5 shadow-lg shadow-emerald-950/30 transition-all duration-300 hover:scale-[1.01] hover:border-emerald-500/40 hover:shadow-xl hover:shadow-emerald-950/40">
          <div className="pointer-events-none absolute -right-6 -bottom-6 h-28 w-28 rounded-full bg-emerald-500/10 blur-2xl transition-all duration-500 group-hover:bg-emerald-500/20" />
          <div className="relative flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              {t('TICKET_RESOLVED')}
            </span>
            <div className="p-2.5 rounded-xl border shrink-0 transition-transform group-hover:scale-110 shadow-xs bg-emerald-500/15 border-emerald-500/30 text-emerald-400">
              <CheckCircle2 size={18} strokeWidth={2.2} />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold tracking-tight text-emerald-400">{kpis.resolved}</p>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1 font-semibold rounded-full px-2 py-0.5 border text-emerald-300 bg-emerald-500/10 border-emerald-500/25">
              Closed & Verified
            </span>
          </div>
        </div>

        {/* Priority SLA - Cyan */}
        <div className="group relative overflow-hidden rounded-2xl border border-cyan-500/25 bg-gradient-to-br from-[#081822]/95 via-[#081822]/90 to-[#0d2636]/80 p-5 shadow-lg shadow-cyan-950/30 transition-all duration-300 hover:scale-[1.01] hover:border-cyan-500/40 hover:shadow-xl hover:shadow-cyan-950/40">
          <div className="pointer-events-none absolute -right-6 -bottom-6 h-28 w-28 rounded-full bg-cyan-500/10 blur-2xl transition-all duration-500 group-hover:bg-cyan-500/20" />
          <div className="relative flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Response SLA
            </span>
            <div className="p-2.5 rounded-xl border shrink-0 transition-transform group-hover:scale-110 shadow-xs bg-cyan-500/15 border-cyan-500/30 text-cyan-400">
              <Zap size={18} strokeWidth={2.2} />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold tracking-tight text-cyan-400">&lt; 15 mins</p>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1 font-semibold rounded-full px-2 py-0.5 border text-cyan-300 bg-cyan-500/10 border-cyan-500/25">
              24/7 Priority Support
            </span>
          </div>
        </div>
      </div>

      {/* Main Tickets Section */}
      <section
        className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6 shadow-xl backdrop-blur-md space-y-5"
        aria-labelledby="admin-support-tickets-title"
      >
        {/* Header & Create Button */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h2 id="admin-support-tickets-title" className="text-lg font-bold text-white flex items-center gap-2">
              <Ticket size={18} className="text-indigo-400" />
              <span>{t('TICKETS_TITLE')}</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Track, inspect, and submit administrative assistance requests
            </p>
          </div>
          <button
            type="button"
            data-testid="admin_support-AdminSettingsSupportMain-control-002"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 shadow-md shadow-indigo-600/25 transition-all cursor-pointer self-start sm:self-auto"
            onClick={() => setShowCreateForm(true)}
          >
            <Plus size={16} strokeWidth={2.2} aria-hidden="true" />
            <span>{t('CREATE_TICKET')}</span>
          </button>
        </div>

        {/* Search & Status Filter Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-indigo-500/20 border border-indigo-500/40 text-indigo-300'
                  : 'bg-slate-800/60 border border-slate-700/60 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              All ({ADMIN_SUPPORT_DEMO_TICKETS.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('open')}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === 'open'
                  ? 'bg-amber-500/20 border border-amber-500/40 text-amber-300'
                  : 'bg-slate-800/60 border border-slate-700/60 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {t('TICKET_OPEN')} ({kpis.open})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('resolved')}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === 'resolved'
                  ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
                  : 'bg-slate-800/60 border border-slate-700/60 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {t('TICKET_RESOLVED')} ({kpis.resolved})
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative min-w-[220px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input maxLength={30}
              type="text"
              placeholder="Search tickets by subject or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-700/70 bg-slate-950/60 pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Tickets List */}
        <div className="space-y-3">
          {filteredTickets.map((ticket) => (
            <article
              key={ticket.id}
              className="flex flex-col gap-3.5 rounded-2xl border border-slate-800/80 bg-slate-950/50 p-4 sm:p-5 transition-all hover:border-slate-700 hover:bg-slate-900/60 shadow-md sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex min-w-0 items-start gap-3.5">
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 mt-0.5"
                  aria-hidden="true"
                >
                  <Ticket size={18} strokeWidth={2} />
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold text-sm text-slate-100">{t(ticket.subjectKey)}</h3>
                    <span
                      className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase ${
                        ticket.status === 'open'
                          ? 'border-amber-500/30 bg-amber-500/10 text-amber-400'
                          : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                      }`}
                    >
                      {t(ticket.status === 'open' ? 'TICKET_OPEN' : 'TICKET_RESOLVED')}
                    </span>
                  </div>
                  <div className="mt-1.5 flex flex-wrap items-center gap-x-3.5 gap-y-1.5 text-xs text-slate-400 font-mono">
                    <span className="font-semibold text-slate-300">#{ticket.id}</span>
                    <span className="font-sans text-slate-400">
                      {t('FIELD_CATEGORY')}:{' '}
                      <span className="text-slate-300 font-medium">{t(ticket.categoryKey)}</span>
                    </span>
                    <span
                      className={`font-sans rounded-full px-2 py-0.5 border text-[11px] font-semibold ${
                        ticket.priority === 'high'
                          ? 'border-rose-500/30 bg-rose-500/10 text-rose-400'
                          : 'border-slate-700 bg-slate-800/70 text-slate-300'
                      }`}
                    >
                      {t('FIELD_PRIORITY')}:{' '}
                      {t(ticket.priority === 'high' ? 'PRIORITY_HIGH' : 'PRIORITY_LOW')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex shrink-0 items-center justify-between sm:justify-end gap-3 text-xs text-slate-400 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800/60">
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900/90 px-3 py-1.5 border border-slate-800 text-slate-300 font-medium">
                  <MessageSquare size={13} strokeWidth={2} aria-hidden="true" className="text-indigo-400" />
                  <span>
                    {ticket.replies} {t('REPLIES')}
                  </span>
                </span>
                <span className="font-mono text-slate-400 flex items-center gap-1 text-[11px]">
                  <Clock size={12} className="text-slate-500" />
                  {t(ticket.dateKey)}
                </span>
              </div>
            </article>
          ))}
          {filteredTickets.length === 0 && (
            <div className="p-8 text-center text-xs text-slate-400 rounded-xl border border-dashed border-slate-800">
              No tickets matched your search query.
            </div>
          )}
        </div>
      </section>

      {/* Priority Escalation Hotline Card */}
      <div className="rounded-2xl border border-slate-800/80 bg-gradient-to-r from-slate-900/90 via-[#0d1326]/90 to-[#12163a]/80 p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="h-11 w-11 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
            <PhoneCall size={20} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Priority Helpdesk Hotline</span>
              <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                Active 24/7
              </span>
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Urgent server or facility escalations can be dispatched directly to the engineering team.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">

          <a
            href="mailto:support@smartlibrary.com"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition-all"
          >
            <Mail size={13} />
            <span>Email Desk</span>
          </a>
        </div>
      </div>
    </div>
  );
}
