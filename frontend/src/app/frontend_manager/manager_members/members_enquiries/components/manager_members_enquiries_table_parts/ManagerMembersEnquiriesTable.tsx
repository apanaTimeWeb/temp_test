'use client';
import { useLocale, useTranslations } from 'next-intl';

import { useRouter } from 'next/navigation';
import type { KeyboardEvent, MouseEvent } from 'react';
import { MANAGER_MEMBERS_ENQUIRIES_ROUTES } from '@/app/frontend_manager/manager_members/members_enquiries/config/manager_members_enquiries.url_config';
import { Eye, CheckCircle, XCircle, PhoneCall, Plus } from 'lucide-react';
import { formatManagerEnquiriesDisplayDate, maskManagerEnquiriesPhone } from '@/app/frontend_manager/manager_members/members_enquiries/utils/ManagerMembersEnquiriesUtilities';
import { MANAGER_CRM_STATUS_BADGE } from '@/app/frontend_manager/manager_members/members_enquiries/constants/ManagerMembersEnquiriesConstants';
import type { ManagerMembersEnquiriesTableProps } from '@/app/frontend_manager/manager_members/members_enquiries/types/ManagerMembersEnquiriesComponentTypes';




export function ManagerMembersEnquiriesTable({ filtered }: ManagerMembersEnquiriesTableProps) {
  const tManagerUi = useTranslations('manager.manager_enquiries.ui');
  const locale = useLocale();
  const router = useRouter();
  const statusLabels = { New: tManagerUi('new'), Visited: tManagerUi('visited'), Interested: tManagerUi('interested'), Converted: tManagerUi('converted'), Lost: tManagerUi('lost') };
  const shiftLabels: Record<string, string> = { Morning: tManagerUi('shift_morning'), Afternoon: tManagerUi('shift_afternoon'), Evening: tManagerUi('shift_evening'), Night: tManagerUi('shift_night'), 'Full Day': tManagerUi('shift_full_day'), 'Not specified': tManagerUi('not_specified') };

  if (filtered.length === 0) {
    return (
      <div className="crm-card crm-card--flush">
        <div className="crm-empty-state bg-card border border-border rounded-lg p-12 text-center">
          <PhoneCall size={40} className="text-secondary mx-auto mb-4" />
          <p className="text-primary font-semibold text-lg mb-2">{tManagerUi('no_enquiries_found')}</p>
          <p className="text-secondary text-sm mb-6">{tManagerUi('try_a_different_search_or_status_filter')}</p>
          <button type="button" className="mgr-btn-primary" onClick={() => router.push(MANAGER_MEMBERS_ENQUIRIES_ROUTES.ADD)}>
            <Plus size={15} /> {tManagerUi('add_enquiry')}
          </button>
        </div>
      </div>
    );
  }

  const openDetails = (id: string) => router.push(MANAGER_MEMBERS_ENQUIRIES_ROUTES.DETAIL(id));

  const handleRowKeyDown = (e: KeyboardEvent<HTMLTableRowElement>, id: string) => {
    if ((e.target as HTMLElement).closest('button, a, input, select, textarea')) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openDetails(id);
    }
  };

  const handleQuickConvert = (e: MouseEvent) => {
    e.stopPropagation();
    router.push(MANAGER_MEMBERS_ENQUIRIES_ROUTES.ADMISSION_CONVERSION());
  };

  return (
    <div className="crm-card crm-card--flush">
      <div className="crm-mobile-enquiry-list">
        {filtered.map((enq, idx) => (
          <article className="crm-mobile-enquiry-card" key={`mobile-${enq.id}`}>
            <button type="button" className="crm-mobile-enquiry-main" onClick={() => openDetails(enq.id)}>
              <span className="crm-mobile-enquiry-index">#{idx + 1}</span>
              <span className="crm-mobile-enquiry-name">{enq.name}</span>
              <span className="crm-mobile-enquiry-phone">{maskManagerEnquiriesPhone(enq.phone)}</span>
            </button>
            <div className="crm-mobile-enquiry-meta">
              <span><span className="crm-mobile-enquiry-label">{tManagerUi('shift')}</span><span className="mgr-badge mgr-badge--info">{shiftLabels[enq.shift] ?? enq.shift}</span></span>
              <span><span className="crm-mobile-enquiry-label">{tManagerUi('status')}</span><span className={`mgr-badge ${MANAGER_CRM_STATUS_BADGE[enq.status]}`}>{statusLabels[enq.status]}</span></span>
              <span><span className="crm-mobile-enquiry-label">{tManagerUi('handled_by')}</span><span>{enq.handledBy === 'Unassigned' ? tManagerUi('unassigned') : enq.handledBy}</span></span>
              <span><span className="crm-mobile-enquiry-label">{tManagerUi('date_added')}</span><span>{formatManagerEnquiriesDisplayDate(enq.addedDate, locale, { today: tManagerUi('today'), yesterday: tManagerUi('yesterday') })}</span></span>
            </div>
            <div className="crm-mobile-enquiry-actions">
              <button type="button" className="mgr-btn-icon" aria-label={tManagerUi('view_details')} title={tManagerUi('view_details')} onClick={() => openDetails(enq.id)}><Eye size={16} /></button>
              <button type="button" className="mgr-btn-icon text-success" aria-label={tManagerUi('convert_to_admission')} title={tManagerUi('convert_to_admission')} onClick={handleQuickConvert}><CheckCircle size={16} /></button>
              <button type="button" className="mgr-btn-icon text-danger cursor-not-allowed" aria-label={tManagerUi('crm_mark_lost_unavailable')} title={tManagerUi('crm_mutations_unavailable_host_contract')} disabled><XCircle size={16} /></button>
            </div>
          </article>
        ))}
      </div>
      <div className="crm-table-wrap">
        <table className="crm-table w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border text-secondary text-sm">
              <th className="p-3">#</th>
              <th className="p-3">{tManagerUi('name')}</th>
              <th className="p-3">{tManagerUi('phone')}</th>
              <th className="p-3">{tManagerUi('shift')}</th>
              <th className="p-3">{tManagerUi('status')}</th>
              <th className="p-3">{tManagerUi('handled_by')}</th>
              <th className="p-3">{tManagerUi('date_added')}</th>
              <th className="p-3">{tManagerUi('actions')}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((enq, idx) => (
              <tr
                key={enq.id}
                onClick={() => openDetails(enq.id)}
                onKeyDown={(e) => handleRowKeyDown(e, enq.id)}
                tabIndex={0}
                role="link"
                aria-label={`${tManagerUi('view_details')}: ${enq.name}`}
                className="border-b border-border hover:bg-surface-hover cursor-pointer motion-safe:transition-colors"
              >
                <td className="p-3 text-secondary">{idx + 1}</td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-floating flex items-center justify-center text-xs font-bold text-secondary">
                      {enq.avatar}
                    </div>
                    <span className="font-medium text-primary">{enq.name}</span>
                  </div>
                </td>
                <td className="p-3 font-mono text-sm text-secondary">{maskManagerEnquiriesPhone(enq.phone)}</td>
                <td className="p-3"><span className="mgr-badge mgr-badge--info">{shiftLabels[enq.shift] ?? enq.shift}</span></td>
                <td className="p-3"><span className={`mgr-badge ${MANAGER_CRM_STATUS_BADGE[enq.status]}`}>{statusLabels[enq.status]}</span></td>
                <td className="p-3 text-secondary">{enq.handledBy === 'Unassigned' ? tManagerUi('unassigned') : enq.handledBy}</td>
                <td className="p-3 text-secondary">{formatManagerEnquiriesDisplayDate(enq.addedDate, locale, { today: tManagerUi('today'), yesterday: tManagerUi('yesterday') })}</td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <button type="button" className="mgr-btn-icon" aria-label={tManagerUi('view_details')} title={tManagerUi('view_details')} onClick={(e) => { e.stopPropagation(); router.push(MANAGER_MEMBERS_ENQUIRIES_ROUTES.DETAIL(enq.id)); }}>
                      <Eye size={14} />
                    </button>
                    <button type="button" className="mgr-btn-icon text-success" aria-label={tManagerUi('convert_to_admission')} title={tManagerUi('convert_to_admission')} onClick={handleQuickConvert}>
                      <CheckCircle size={14} />
                    </button>
                    <button type="button" className="mgr-btn-icon text-danger cursor-not-allowed" title={tManagerUi('crm_mutations_unavailable_host_contract')} aria-label={tManagerUi('crm_mark_lost_unavailable')} disabled>
                      <XCircle size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
