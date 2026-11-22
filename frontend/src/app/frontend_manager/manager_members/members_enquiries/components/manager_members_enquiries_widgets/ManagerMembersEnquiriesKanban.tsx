'use client';
import { ManagerMembersEnquiriesEmptyState } from '@/app/frontend_manager/manager_members/members_enquiries/components/ManagerMembersEnquiriesEmptyState';
import { useTranslations } from 'next-intl';

import { MANAGER_MEMBERS_ENQUIRIES_ROUTES } from '@/app/frontend_manager/manager_members/members_enquiries/config/manager_members_enquiries.url_config';

import { MANAGER_CRM_KANBAN_COLUMNS } from '@/app/frontend_manager/manager_members/members_enquiries/constants/ManagerMembersEnquiriesConstants';
import { CheckCircle2,Flame,MapPin,PhoneCall,Plus,UserPlus,XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { ManagerMembersEnquiriesKanbanCard } from '@/app/frontend_manager/manager_members/members_enquiries/components/manager_members_enquiries_sections/ManagerMembersEnquiriesKanbanCard';
import type { ManagerMembersEnquiriesKanbanProps } from '@/app/frontend_manager/manager_members/members_enquiries/types/ManagerMembersEnquiriesComponentTypes';
import type { ManagerMembersEnquiriesEnquiryStatus } from '@/app/frontend_manager/manager_members/members_enquiries/types/ManagerMembersEnquiriesTypes';

export function ManagerMembersEnquiriesKanban({ isEmpty, getCardsByStatus }: ManagerMembersEnquiriesKanbanProps) {
  const tManagerUi = useTranslations('manager.manager_enquiries.ui');
  const router = useRouter();

  const getColumnIcon = (status: ManagerMembersEnquiriesEnquiryStatus, size = 14) => {
    switch (status) {
      case 'New':
        return <UserPlus size={size} className="text-sky-400 shrink-0" />;
      case 'Visited':
        return <MapPin size={size} className="text-amber-400 shrink-0" />;
      case 'Interested':
        return <Flame size={size} className="text-purple-400 shrink-0" />;
      case 'Converted':
        return <CheckCircle2 size={size} className="text-emerald-400 shrink-0" />;
      case 'Lost':
        return <XCircle size={size} className="text-rose-400 shrink-0" />;
    }
  };

  if (isEmpty) {
    return (
      <ManagerMembersEnquiriesEmptyState className="crm-empty-state rounded-2xl bg-[#0c0f28]/95 border border-indigo-500/25 p-12 text-center shadow-xl" testId="manager-enquiries-kanban-empty">
        <PhoneCall size={44} className="text-indigo-400 mx-auto mb-4 opacity-80" />
        <p className="text-white font-bold text-lg mb-2">{tManagerUi('no_enquiries_yet')}</p>
        <p className="text-slate-400 text-sm mb-6">{tManagerUi('add_your_first_lead_to_start_the_pipeline')}</p>
        <button
          type="button"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-sm shadow-lg shadow-indigo-950/50 transition-all cursor-pointer"
          onClick={() => router.push(MANAGER_MEMBERS_ENQUIRIES_ROUTES.ADD)}
        >
          <Plus size={16} /> {tManagerUi('add_enquiry')}
        </button>
      </ManagerMembersEnquiriesEmptyState>
    );
  }

  return (
    <div className="crm-kanban-board flex gap-4 overflow-x-auto pb-4 pt-1 scrollbar-thin">
      {MANAGER_CRM_KANBAN_COLUMNS.map((col) => {
        const cards = getCardsByStatus(col.id);
        const columnLabel = tManagerUi(({ New: 'kanban_new_leads', Visited: 'kanban_visited_leads', Interested: 'kanban_interested_leads', Converted: 'kanban_converted_leads', Lost: 'kanban_lost_leads' } as const)[col.id]);
        return (
          <div key={col.id} className="crm-kanban-col flex-1 min-w-[240px] max-w-[320px] rounded-2xl bg-[#080a22]/80 border border-indigo-500/20 p-3 flex flex-col gap-3 shadow-md">
            <div className="crm-kanban-col-header flex items-center justify-between pb-2.5 border-b border-indigo-500/20">
              <div className="crm-kanban-col-header-left flex items-center gap-2">
                {getColumnIcon(col.id, 15)}
                <span className="crm-kanban-col-label font-bold text-xs uppercase tracking-wider text-slate-200">{columnLabel}</span>
              </div>
              <span className="crm-col-count inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {cards.length}
              </span>
            </div>
            <div className="crm-kanban-col-body flex flex-col gap-2.5 min-h-[350px]">
              {cards.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-center rounded-xl border border-dashed border-indigo-500/20 bg-[#060818]/60 flex-1 my-2">
                  <div className="opacity-40 mb-2">
                    {getColumnIcon(col.id, 26)}
                  </div>
                  <p className="text-xs font-semibold text-slate-400">{tManagerUi('no_leads_in_this_column')}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{tManagerUi('leads_will_appear_when_status_changes')}</p>
                </div>
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
