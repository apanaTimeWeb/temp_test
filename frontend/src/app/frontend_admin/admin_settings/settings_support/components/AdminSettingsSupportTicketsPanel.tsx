'use client';
// RESPONSIBILITY: AdminSupportTicketsPanel component owned by admin_support; responsibility folder: admin_support_components_sections.

import { useState, useMemo } from 'react';
import { MessageSquare, Plus, Ticket, AlertCircle, CheckCircle2, HelpCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ADMIN_SUPPORT_DEMO_TICKETS } from '@/app/frontend_admin/admin_settings/settings_support/mocks/scenarios/admin_settings_support.scenarios';
import AdminSupportCreateTicketForm from '@/app/frontend_admin/admin_settings/settings_support/components/AdminSettingsSupportCreateTicketForm';

/** Contains the ticket-list/draft-validation flow, limited to fixtures in explicit demo mode. */
export default function AdminSupportTicketsPanel() {
  const t = useTranslations('ADMIN_SUPPORT');
  const [showCreateForm, setShowCreateForm] = useState(false);

  const kpis = useMemo(() => {
    return {
      total: ADMIN_SUPPORT_DEMO_TICKETS.length,
      open: ADMIN_SUPPORT_DEMO_TICKETS.filter((t) => t.status === 'open').length,
      resolved: ADMIN_SUPPORT_DEMO_TICKETS.filter((t) => t.status === 'resolved').length,
    };
  }, []);

  if (showCreateForm) return <AdminSupportCreateTicketForm onCancel={() => setShowCreateForm(false)} />;

  return (
    <div className="space-y-6">
      {/* Support KPI Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {/* Total Raised - Indigo */}
        <div className="group relative overflow-hidden rounded-2xl border border-indigo-500/25 bg-gradient-to-br from-[#0c0f28]/95 via-[#0c0f28]/90 to-[#12163a]/80 p-5 shadow-lg shadow-indigo-950/30 transition-all duration-300 hover:scale-[1.01] hover:border-indigo-500/40 hover:shadow-xl hover:shadow-indigo-950/40">
          <div className="pointer-events-none absolute -right-6 -bottom-6 h-28 w-28 rounded-full bg-indigo-500/10 blur-2xl transition-all duration-500 group-hover:bg-indigo-500/20" />
          <svg className="pointer-events-none absolute right-0 bottom-0 h-16 w-36 opacity-25 overflow-visible transition-opacity duration-300 group-hover:opacity-40" viewBox="0 0 150 40" fill="none">
            <path d="M0,32 Q15,18 55,24 T95,14 T130,20 T150,8" fill="none" stroke="#818cf8" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          <div className="relative flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{t('TICKETS_TITLE')}</span>
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
          <svg className="pointer-events-none absolute right-0 bottom-0 h-16 w-36 opacity-25 overflow-visible transition-opacity duration-300 group-hover:opacity-40" viewBox="0 0 150 40" fill="none">
            <path d="M0,32 Q15,18 55,24 T95,14 T130,20 T150,8" fill="none" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          <div className="relative flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{t('TICKET_OPEN')}</span>
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
          <svg className="pointer-events-none absolute right-0 bottom-0 h-16 w-36 opacity-25 overflow-visible transition-opacity duration-300 group-hover:opacity-40" viewBox="0 0 150 40" fill="none">
            <path d="M0,32 Q15,18 55,24 T95,14 T130,20 T150,8" fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          <div className="relative flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{t('TICKET_RESOLVED')}</span>
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

        {/* Status - Cyan */}
        <div className="group relative overflow-hidden rounded-2xl border border-cyan-500/25 bg-gradient-to-br from-[#081822]/95 via-[#081822]/90 to-[#0d2636]/80 p-5 shadow-lg shadow-cyan-950/30 transition-all duration-300 hover:scale-[1.01] hover:border-cyan-500/40 hover:shadow-xl hover:shadow-cyan-950/40">
          <div className="pointer-events-none absolute -right-6 -bottom-6 h-28 w-28 rounded-full bg-cyan-500/10 blur-2xl transition-all duration-500 group-hover:bg-cyan-500/20" />
          <svg className="pointer-events-none absolute right-0 bottom-0 h-16 w-36 opacity-25 overflow-visible transition-opacity duration-300 group-hover:opacity-40" viewBox="0 0 150 40" fill="none">
            <path d="M0,32 Q15,18 55,24 T95,14 T130,20 T150,8" fill="none" stroke="#22d3ee" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          <div className="relative flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{t('STATUS_HEADING')}</span>
            <div className="p-2.5 rounded-xl border shrink-0 transition-transform group-hover:scale-110 shadow-xs bg-cyan-500/15 border-cyan-500/30 text-cyan-400">
              <HelpCircle size={18} strokeWidth={2.2} />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold tracking-tight text-cyan-400">Active</p>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1 font-semibold rounded-full px-2 py-0.5 border text-cyan-300 bg-cyan-500/10 border-cyan-500/25">
              Helpdesk Operational
            </span>
          </div>
        </div>
      </div>

      <section className="admin-card" aria-labelledby="admin-support-tickets-title">
      <div className="flex items-center justify-between gap-3">
        <h2 id="admin-support-tickets-title" className="text-base font-semibold text-text-primary">{t('TICKETS_TITLE')}</h2>
        <button type="button" data-testid="admin_support-AdminSettingsSupportMain-control-002" className="admin-btn-primary min-h-11" onClick={() => setShowCreateForm(true)}>
          <Plus size={18} strokeWidth={2} aria-hidden="true" /> {t('CREATE_TICKET')}
        </button>
      </div>
      <div className="mt-4 space-y-3">
        {ADMIN_SUPPORT_DEMO_TICKETS.map((ticket) => (
          <article key={ticket.id} className="flex flex-col gap-3 rounded-md border border-border p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-input text-text-secondary" aria-hidden="true"><Ticket size={18} strokeWidth={2} /></div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold text-text-primary">{t(ticket.subjectKey)}</h3>
                  <span className={`admin-badge ${ticket.status === 'open' ? 'admin-badge-warning' : 'admin-badge-success'}`}>{t(ticket.status === 'open' ? 'TICKET_OPEN' : 'TICKET_RESOLVED')}</span>
                </div>
                <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-text-secondary">
                  <span>#{ticket.id}</span>
                  <span>{t('FIELD_CATEGORY')}: {t(ticket.categoryKey)}</span>
                  <span className={ticket.priority === 'high' ? 'text-danger-text' : 'text-primary'}>{t('FIELD_PRIORITY')}: {t(ticket.priority === 'high' ? 'PRIORITY_HIGH' : 'PRIORITY_LOW')}</span>
                </div>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-3 text-xs text-text-secondary">
              <span className="inline-flex items-center gap-1"><MessageSquare size={16} strokeWidth={2} aria-hidden="true" /> {ticket.replies} {t('REPLIES')}</span>
              <span>{t(ticket.dateKey)}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  </div>
  );
}
