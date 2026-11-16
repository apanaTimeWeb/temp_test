'use client';
import { useLocale, useTranslations } from 'next-intl';

import { PhoneCall, CalendarDays, CheckCircle, User, Clock, MessageCircle, Sun, Sunset, Moon } from 'lucide-react';
import { formatManagerEnquiriesDisplayDate, maskManagerEnquiriesPhone, getManagerEnquiriesDemoPassWhatsAppUrl } from '@/app/frontend_manager/manager_members/members_enquiries/utils/ManagerMembersEnquiriesUtilities';
import type { ManagerMembersEnquiriesKanbanCardProps } from '@/app/frontend_manager/manager_members/members_enquiries/types/ManagerMembersEnquiriesComponentTypes';

export function ManagerMembersEnquiriesKanbanCard({ enq, colClass, onClick }: ManagerMembersEnquiriesKanbanCardProps) {
  const tManagerUi = useTranslations('manager.manager_enquiries.ui');
  const locale = useLocale();
  const shiftLabels: Record<string, string> = {
    Morning: tManagerUi('shift_morning'),
    Afternoon: tManagerUi('shift_afternoon'),
    Evening: tManagerUi('shift_evening'),
    Night: tManagerUi('shift_night'),
    'Full Day': tManagerUi('shift_full_day'),
    'Not specified': tManagerUi('not_specified'),
  };

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = getManagerEnquiriesDemoPassWhatsAppUrl(enq);
    const win = window.open(url, '_blank', 'noopener,noreferrer');
    if (win) win.opener = null;
  };

  const renderShiftIcon = (shift: string) => {
    switch (shift) {
      case 'Morning':
        return <Sun size={10} className="text-amber-400" />;
      case 'Afternoon':
      case 'Evening':
        return <Sunset size={10} className="text-orange-400" />;
      case 'Night':
        return <Moon size={10} className="text-purple-400" />;
      default:
        return <Clock size={10} className="text-cyan-400" />;
    }
  };

  const cleanDigits = enq.phone.replace(/\D/g, '');

  return (
    <div
      className={`crm-kanban-card ${colClass} rounded-xl bg-[#0c0f28]/95 border border-indigo-500/25 p-3.5 shadow-sm hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div className="crm-card-name-block flex items-start justify-between gap-2 mb-2">
        <div className="flex-1 min-w-0">
          <p className="crm-card-name font-bold text-sm text-slate-100 truncate">{enq.name}</p>
          <a
            href={`tel:${cleanDigits}`}
            onClick={(e) => e.stopPropagation()}
            className="crm-card-phone inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-mono mt-0.5"
            title={`Call ${enq.name}`}
          >
            <PhoneCall size={11} className="text-amber-400" />
            {maskManagerEnquiriesPhone(enq.phone)}
          </a>
        </div>
        <button
          type="button"
          onClick={handleWhatsApp}
          className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/35 hover:text-emerald-200 transition-all shrink-0 cursor-pointer"
          title={`WhatsApp ${enq.name}`}
          aria-label={`WhatsApp ${enq.name}`}
        >
          <MessageCircle size={14} />
        </button>
      </div>

      <div className="crm-card-badges flex flex-wrap gap-1.5 mb-2.5">
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
          {renderShiftIcon(enq.shift)}
          {shiftLabels[enq.shift] ?? enq.shift}
        </span>
        {enq.isOverdue ? (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30">
            <Clock size={10} className="text-rose-400" /> {tManagerUi('overdue')}
          </span>
        ) : enq.isToday ? (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <Clock size={10} className="text-amber-400" /> {tManagerUi('today')}
          </span>
        ) : enq.isUpcoming ? (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <Clock size={10} className="text-emerald-400" /> {tManagerUi('upcoming')}
          </span>
        ) : null}
      </div>

      <div className="crm-card-footer flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-indigo-500/15">
        <span className="crm-card-footer-item inline-flex items-center gap-1 text-slate-400">
          <CalendarDays size={11} className="text-slate-400" />
          {formatManagerEnquiriesDisplayDate(enq.addedDate, locale, { today: tManagerUi('today'), yesterday: tManagerUi('yesterday') })}
        </span>
        {enq.convertedDate && (
          <span className="crm-card-footer-converted inline-flex items-center gap-1 text-emerald-400 font-semibold">
            <CheckCircle size={11} className="text-emerald-400" />
            {formatManagerEnquiriesDisplayDate(enq.convertedDate, locale, { today: tManagerUi('today'), yesterday: tManagerUi('yesterday') })}
          </span>
        )}
        <span className="crm-card-footer-item inline-flex items-center gap-1 text-slate-300">
          <User size={11} className="text-indigo-400" />
          {enq.handledBy === 'Unassigned' ? tManagerUi('unassigned') : enq.handledBy.split(' ')[0]}
        </span>
      </div>
    </div>
  );
}
