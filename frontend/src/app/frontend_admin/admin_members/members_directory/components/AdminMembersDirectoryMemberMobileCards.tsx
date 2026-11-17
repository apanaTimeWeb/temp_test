'use client';
// RESPONSIBILITY: AdminMembersDirectoryMemberMobileCards component owned by admin_members.

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { MoreVertical, MessageSquare, Building2, Eye, Edit, Mail, Phone, CreditCard, Armchair, CalendarClock, X } from 'lucide-react';
import type { AdminMembersMember } from '@/app/frontend_admin/admin_members/members_directory/schemas/AdminMembersDirectorySchema';
import { displayValue } from '@/lib/display_value';

export interface AdminMembersDirectoryMemberMobileCardsProps {
  visibleMembers: readonly AdminMembersMember[];
  selectedIds: string[];
  onToggleSelectOne?: (id: string) => void;
  onSelectMember: (member: AdminMembersMember) => void;
  onAction: (action: string, member: AdminMembersMember) => void;
  canMutate?: boolean;
  statusLabel: (status: AdminMembersMember['status']) => string;
  expiryLabel: (date: string) => string;
}

export default function AdminMembersDirectoryMemberMobileCards({
  visibleMembers,
  selectedIds,
  onToggleSelectOne,
  onSelectMember,
  onAction,
  canMutate = true,
  statusLabel,
  expiryLabel,
}: AdminMembersDirectoryMemberMobileCardsProps) {
  const t = useTranslations('ADMIN_MEMBERS');
  const [openActionsFor, setOpenActionsFor] = useState<string | null>(null);

  const getStatusBadge = (status: AdminMembersMember['status']) => {
    switch (status) {
      case 'Active':
        return 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-400';
      case 'Expired':
        return 'border border-rose-500/30 bg-rose-500/10 text-rose-400';
      case 'Suspended':
        return 'border border-amber-500/30 bg-amber-500/10 text-amber-400';
      case 'Blocked':
        return 'border border-red-500/30 bg-red-500/10 text-red-400';
      default:
        return 'border border-slate-700 bg-slate-800 text-slate-300';
    }
  };

  return (
    <div className="grid gap-3.5 md:hidden" role="list" aria-label={t('TABLE_MEMBER')}>
      {visibleMembers.map((member) => (
        <article key={`mobile-${member.id}`} role="listitem" className="rounded-2xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-xl p-4 shadow-lg shadow-black/20 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <button type="button" className="text-left font-semibold text-white underline-offset-2 hover:underline hover:text-indigo-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400" onClick={() => onSelectMember(member)}>{displayValue(member.name)}</button>
              <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                <span className="font-mono text-xs text-slate-400">{displayValue(member.id)}</span>
                <span className="inline-flex items-center gap-1 rounded-md border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[11px] font-medium text-amber-300">
                  <Building2 size={11} className="text-amber-400 shrink-0" />
                  <span>{member.branch || 'Downtown Central'}</span>
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0">
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${getStatusBadge(member.status)}`}>{statusLabel(member.status)}</span>
              {member.feeStatus && (
                <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${member.feeStatus === 'Paid' ? 'border border-emerald-500/20 bg-emerald-500/10 text-emerald-400' : 'border border-rose-500/20 bg-rose-500/10 text-rose-400'}`}>
                  {member.feeStatus === 'Due' && member.dueFeeMinor ? `Due: ₹${(member.dueFeeMinor / 100).toLocaleString('en-IN')}` : `Fee: ${member.feeStatus}`}
                </span>
              )}
            </div>
          </div>
          <dl className="grid grid-cols-1 gap-2 text-xs border-t border-slate-800/60 pt-2.5">
            <div className="flex items-start gap-1.5">
              <span className="text-slate-400 font-medium min-w-[70px]">{t('TABLE_CONTACT')}:</span>
              <dd className="break-words text-slate-200 flex-1">
                <span className="block text-slate-300">{displayValue(member.email)}</span>
                <span className="inline-flex items-center gap-1 text-emerald-400 mt-0.5">
                  <Phone size={11} className="text-emerald-400 shrink-0" />
                  {displayValue(member.phone)}
                </span>
              </dd>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-medium min-w-[70px] flex items-center gap-1">
                <CreditCard size={11} className="text-purple-400 shrink-0" />
                {t('TABLE_PLAN')}:
              </span>
              <dd className="text-purple-300 font-medium">{displayValue(member.plan)}</dd>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-medium min-w-[70px] flex items-center gap-1">
                <Armchair size={11} className="text-teal-400 shrink-0" />
                Seat/Shift:
              </span>
              <dd className="text-slate-200">{member.seat ? `Seat ${member.seat}` : '—'} · {member.shift || '—'}{member.locker ? ` · Locker ${member.locker}` : ''}</dd>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-medium min-w-[70px] flex items-center gap-1">
                <CalendarClock size={11} className="text-rose-400 shrink-0" />
                {t('TABLE_EXPIRY')}:
              </span>
              <dd className="text-slate-300">{expiryLabel(member.expiryDate)}</dd>
            </div>
          </dl>
          <div className="relative flex flex-wrap items-center gap-2 border-t border-slate-800/80 pt-3">
            {onToggleSelectOne && (
              <label className="flex items-center gap-1.5 text-xs text-slate-400 cursor-pointer mr-1">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(member.id)}
                  onChange={() => onToggleSelectOne(member.id)}
                  className="rounded border-slate-700 bg-slate-900 text-indigo-500 focus:ring-indigo-400"
                />
                <span>Select</span>
              </label>
            )}
            <button
              type="button"
              className="min-h-9 flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-sky-500/30 bg-sky-500/10 px-3 text-xs font-semibold text-sky-400 hover:text-sky-300 hover:bg-sky-500/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
              onClick={() => onSelectMember(member)}
            >
              <Eye size={14} className="text-sky-400" />
              {t('ACTION_VIEW_DETAILS')}
            </button>
            <button
              type="button"
              className="min-h-9 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 text-xs font-semibold text-emerald-400 hover:bg-emerald-500/20 inline-flex items-center justify-center gap-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
              aria-label={`Chat with ${member.name} on WhatsApp`}
              onClick={() => {
                const digits = (member.phone || '').replace(/\D/g, '');
                const clean = digits.length === 11 && digits.startsWith('0') ? digits.slice(1) : digits;
                const phone = clean.length === 10 ? `91${clean}` : clean;
                const popup = window.open(`https://wa.me/${phone}?text=${encodeURIComponent(`Hello ${member.name}, greetings from Smart Library admin!`)}`, '_blank', 'noopener,noreferrer');
                if (popup) {
                  popup.opener = null;
                }
              }}
            >
              <MessageSquare size={14} className="text-emerald-400" /> WhatsApp
            </button>
            <button
              type="button"
              className="min-h-9 min-w-9 rounded-xl border border-slate-700/60 bg-slate-800/50 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors inline-flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
              aria-label={t('ACTION_OPEN_ACTIONS', { name: member.name })}
              aria-expanded={openActionsFor === member.id}
              aria-controls={`admin-member-actions-mobile-${member.id}`}
              onClick={() => setOpenActionsFor((current) => current === member.id ? null : member.id)}
            >
              <MoreVertical size={16} strokeWidth={2} aria-hidden="true" />
            </button>
            {openActionsFor === member.id && (
              <div
                id={`admin-member-actions-mobile-${member.id}`}
                aria-label={t('ACTION_OPEN_ACTIONS', { name: member.name })}
                onKeyDown={(event) => { if (event.key === 'Escape') setOpenActionsFor(null); }}
                className="absolute right-0 top-12 z-20 min-w-48 rounded-xl border border-slate-700/80 bg-slate-900/95 backdrop-blur-xl p-1.5 shadow-2xl space-y-0.5"
              >
                <button
                  type="button"
                  className="flex items-center gap-2 min-h-10 w-full rounded-lg px-3 py-2 text-left text-xs font-medium text-slate-200 hover:text-white hover:bg-slate-800/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
                  onClick={() => { setOpenActionsFor(null); onSelectMember(member); }}
                >
                  <Eye size={14} className="text-sky-400 shrink-0" />
                  <span>{t('ACTION_VIEW_DETAILS')}</span>
                </button>
                <button
                  type="button"
                  disabled={!canMutate}
                  title={!canMutate ? t('MEMBER_EDIT_UNAVAILABLE') : undefined}
                  className="flex items-center gap-2 min-h-10 w-full rounded-lg px-3 py-2 text-left text-xs font-medium text-slate-200 hover:text-white hover:bg-slate-800/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 disabled:cursor-not-allowed disabled:opacity-40"
                  onClick={() => { setOpenActionsFor(null); onAction('EDIT', member); }}
                >
                  <Edit size={14} className="text-amber-400 shrink-0" />
                  <span>{t('ACTION_EDIT_MEMBER')}</span>
                </button>
                <button
                  type="button"
                  className="flex items-center gap-2 min-h-10 w-full rounded-lg px-3 py-2 text-left text-xs font-medium text-slate-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
                  onClick={() => setOpenActionsFor(null)}
                >
                  <X size={14} className="text-rose-400 shrink-0" />
                  <span>{t('ACTION_CLOSE_MENU')}</span>
                </button>
              </div>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}

