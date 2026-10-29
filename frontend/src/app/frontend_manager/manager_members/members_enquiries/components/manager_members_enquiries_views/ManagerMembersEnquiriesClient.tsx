'use client';
import { useTranslations } from 'next-intl';

import { MANAGER_MEMBERS_ENQUIRIES_ROUTES } from '@/app/frontend_manager/manager_members/members_enquiries/config/manager_members_enquiries.url_config';

import { useRouter } from 'next/navigation';
import { LayoutGrid, List, Plus, Search } from 'lucide-react';
import { useManagerMembersEnquiries } from '@/app/frontend_manager/manager_members/members_enquiries/hooks/useManagerMembersEnquiriesEnquiries';
import { ManagerMembersEnquiriesKanban } from '@/app/frontend_manager/manager_members/members_enquiries/components/manager_members_enquiries_widgets/ManagerMembersEnquiriesKanban';
import { ManagerMembersEnquiriesTable } from '@/app/frontend_manager/manager_members/members_enquiries/components/manager_members_enquiries_table_parts/ManagerMembersEnquiriesTable';
import { MANAGER_CRM_STATUS_OPTIONS } from '@/app/frontend_manager/manager_members/members_enquiries/constants/ManagerMembersEnquiriesConstants';

// RESPONSIBILITY: Main Client view for CRM Enquiries. It does not own backend persistence or cross-feature business logic.

export function ManagerMembersEnquiriesClient() {
  const tManagerUi = useTranslations('manager.manager_enquiries.ui');
  const router = useRouter();
  const {
    isError, isPending, isFetching, refetch, filtered,
    view, setView,
    search, setSearch,
    statusFilter, setStatusFilter,
    getCardsByStatus,
  } = useManagerMembersEnquiries();
  const statusLabels = {
    New: tManagerUi('new'),
    Visited: tManagerUi('visited'),
    Interested: tManagerUi('interested'),
    Converted: tManagerUi('converted'),
    Lost: tManagerUi('lost'),
  };

  if (isError) {
    return (
      <section className="crm-page p-8" role="alert" aria-live="assertive">
        <p className="text-danger font-semibold">{tManagerUi('unable_to_load_the_enquiry_pipeline')}</p>
        <p className="text-secondary mt-2">{tManagerUi('check_your_connection_and_try_again')}</p>
        <button type="button" className="mgr-btn-primary mt-4" onClick={() => { void refetch(); }} disabled={isFetching}>
          {isFetching ? tManagerUi('retrying') : tManagerUi('try_again')}
        </button>
      </section>
    );
  }

  return (
    <div className="crm-page">
      {/* ── Page Header ── */}
      <div className="crm-page-header">
        <nav className="crm-breadcrumb">{tManagerUi('crm_to_enquiries')}</nav>
        <div className="crm-page-header-row">
          <div>
            <h1 className="crm-page-title">{tManagerUi('enquiry_pipeline')}</h1>
            <p className="crm-page-subtitle">
              {isPending ? tManagerUi('loading') : tManagerUi('lead_count', { count: filtered.length })} {'•'} {tManagerUi('track_every_prospect_from_enquiry_to_admission')}
            </p>
            <p className="crm-contract-warning mt-3" role="status" data-testid="manager-crm-pipeline-contract-warning">{tManagerUi('crm_mutations_unavailable_host_contract')}</p>
          </div>
          <div className="crm-page-header-actions">
            {/* View toggle */}
            <div className="flex bg-floating p-1 rounded-md border border-border">
              <button type="button"
                className={`min-h-11 min-w-11 p-1.5 rounded text-secondary hover:text-primary motion-safe:transition-colors ${view === 'kanban' ? 'bg-card shadow-sm text-primary' : ''}`}
                onClick={() => setView('kanban')} title={tManagerUi('kanban_view')} aria-label={tManagerUi('show_kanban_view')} aria-pressed={view === 'kanban'}
              >
                <LayoutGrid size={16} />
              </button>
              <button type="button"
                className={`min-h-11 min-w-11 p-1.5 rounded text-secondary hover:text-primary motion-safe:transition-colors ${view === 'table' ? 'bg-card shadow-sm text-primary' : ''}`}
                onClick={() => setView('table')} title={tManagerUi('table_view')} aria-label={tManagerUi('show_table_view')} aria-pressed={view === 'table'}
              >
                <List size={16} />
              </button>
            </div>
            <button type="button" className="mgr-btn-primary" onClick={() => router.push(MANAGER_MEMBERS_ENQUIRIES_ROUTES.ADD)}>
              <Plus size={16} /> {tManagerUi('add_enquiry')}
            </button>
          </div>
        </div>
      </div>

      {/* ── Toolbar ── */}
      <div className="flex flex-wrap gap-3 mb-6 items-center">
        <div className="relative flex-grow max-w-md">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
          <input
            type="text"
            className="w-full pl-9 pr-3 py-2 bg-card border border-border rounded-md text-sm text-primary outline-none focus:border-primary motion-safe:transition-colors"
            placeholder={tManagerUi('search_by_name_or_phone')}
            aria-label={tManagerUi('search_by_name_or_phone')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="min-h-11 py-2 px-3 bg-card border border-border rounded-md text-sm text-primary outline-none focus:border-primary motion-safe:transition-colors"
          aria-label={tManagerUi('status')}
          value={statusFilter}
          onChange={(event) => {
            const nextStatus = event.currentTarget.value;
            if (nextStatus === 'All' || MANAGER_CRM_STATUS_OPTIONS.includes(nextStatus as (typeof MANAGER_CRM_STATUS_OPTIONS)[number])) {
              setStatusFilter(nextStatus as typeof statusFilter);
            }
          }}
        >
          <option value="All">{tManagerUi('all_statuses')}</option>
          {MANAGER_CRM_STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>{statusLabels[status]}</option>
          ))}
        </select>
      </div>

      {/* ── Views ── */}
      {isPending ? (
        <div className="flex items-center justify-center p-24 text-secondary">{tManagerUi('loading_pipeline')}</div>
      ) : view === 'kanban' ? (
        <ManagerMembersEnquiriesKanban isEmpty={filtered.length === 0} getCardsByStatus={getCardsByStatus} />
      ) : (
        <ManagerMembersEnquiriesTable filtered={filtered} />
      )}
    </div>
  );
}
