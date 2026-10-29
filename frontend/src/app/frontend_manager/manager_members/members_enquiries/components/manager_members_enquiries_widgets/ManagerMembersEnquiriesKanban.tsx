'use client';
import { ManagerMembersEnquiriesEmptyState } from '@/app/frontend_manager/manager_members/members_enquiries/components/ManagerMembersEnquiriesEmptyState';
import { useTranslations } from 'next-intl';

import { MANAGER_MEMBERS_ENQUIRIES_ROUTES } from '@/app/frontend_manager/manager_members/members_enquiries/config/manager_members_enquiries.url_config';

import { useRouter } from 'next/navigation';
import { PhoneCall, Plus } from 'lucide-react';
import { MANAGER_CRM_KANBAN_COLUMNS, MANAGER_CRM_DOT_CLASS } from '@/app/frontend_manager/manager_members/members_enquiries/constants/ManagerMembersEnquiriesConstants';

import { ManagerMembersEnquiriesKanbanCard } from '@/app/frontend_manager/manager_members/members_enquiries/components/manager_members_enquiries_sections/ManagerMembersEnquiriesKanbanCard.tsx';
import type { ManagerMembersEnquiriesKanbanProps } from '@/app/frontend_manager/manager_members/members_enquiries/types/ManagerMembersEnquiriesComponentTypes';



export function ManagerMembersEnquiriesKanban({ isEmpty, getCardsByStatus }: ManagerMembersEnquiriesKanbanProps) {
  const tManagerUi = useTranslations('manager.manager_enquiries.ui');
  const router = useRouter();

  if (isEmpty) {
    return (
      <ManagerMembersEnquiriesEmptyState className="crm-empty-state crm-mt-48 bg-card border border-border rounded-lg p-12 text-center" testId="manager-enquiries-kanban-empty">
        <PhoneCall size={48} className="text-secondary mx-auto mb-4" />
        <p className="text-primary font-semibold text-lg mb-2">{tManagerUi('no_enquiries_yet')}</p>
        <p className="text-secondary text-sm mb-6">{tManagerUi('add_your_first_lead_to_start_the_pipeline')}</p>
        <button type="button"
          className="mgr-btn-primary"
          onClick={() => router.push(MANAGER_MEMBERS_ENQUIRIES_ROUTES.ADD)}
        >
          <Plus size={15} /> {tManagerUi('add_enquiry')}
        </button>
      </ManagerMembersEnquiriesEmptyState>
    );
  }

  return (
    <div className="crm-kanban-board">
      {MANAGER_CRM_KANBAN_COLUMNS.map((col) => {
        const cards = getCardsByStatus(col.id);
        const columnLabel = tManagerUi(({ New: 'kanban_new_leads', Visited: 'kanban_visited_leads', Interested: 'kanban_interested_leads', Converted: 'kanban_converted_leads', Lost: 'kanban_lost_leads' } as const)[col.id]);
        return (
          <div key={col.id} className="crm-kanban-col">
            <div className="crm-kanban-col-header">
              <div className="crm-kanban-col-header-left">
                <span className={`crm-col-dot ${MANAGER_CRM_DOT_CLASS[col.id]}`} />
                <span className="crm-kanban-col-label">{columnLabel}</span>
                <span className="crm-col-count">{cards.length}</span>
              </div>
            </div>
            <div className="crm-kanban-col-body">
              {cards.length === 0 ? (
                <ManagerMembersEnquiriesEmptyState className="crm-kanban-empty" testId="manager-enquiries-kanban-column-empty">
                  <PhoneCall size={28} />
                  <p className="crm-kanban-empty-title">{tManagerUi('no_leads_in_this_column')}</p>
                  <p className="crm-kanban-empty-sub">{tManagerUi('leads_will_appear_when_status_changes')}</p>
                </ManagerMembersEnquiriesEmptyState>
              ) : (
                cards.map((enq) => (
                  <ManagerMembersEnquiriesKanbanCard
                    key={enq.id}
                    enq={enq}
                    colClass={col.cardClass}
                    onClick={() => router.push(MANAGER_MEMBERS_ENQUIRIES_ROUTES.DETAIL(enq.id))}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
