// RESPONSIBILITY: AdminSupportTicketsPanel component owned by admin_support; responsibility folder: admin_support_components_sections.
'use client';

import { useState } from 'react';
import { MessageSquare, Plus, Ticket } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ADMIN_SUPPORT_DEMO_TICKETS } from '@/app/frontend_admin/admin_settings/settings_support/mocks/scenarios/admin_settings_support.scenarios';
import AdminSupportCreateTicketForm from '@/app/frontend_admin/admin_settings/settings_support/components/AdminSettingsSupportCreateTicketForm';

/** Contains the ticket-list/draft-validation flow, limited to fixtures in explicit demo mode. */
export default function AdminSupportTicketsPanel() {
  const t = useTranslations('ADMIN_SUPPORT');
  const [showCreateForm, setShowCreateForm] = useState(false);

  if (showCreateForm) return <AdminSupportCreateTicketForm onCancel={() => setShowCreateForm(false)} />;

  return (
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
  );
}
