'use client';
// RESPONSIBILITY: AdminMembersDirectoryMemberMobileCards component owned by admin_members.

import type { AdminMembersMember } from '@/app/frontend_admin/admin_members/members_directory/schemas/AdminMembersDirectorySchema';
import { displayValue } from '@/lib/display_value';
import { Armchair,CalendarClock,CreditCard,Eye,Mail,MessageSquare } from 'lucide-react';
import { useTranslations } from 'next-intl';

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
              <div className="mt-0.5">
                <span className="font-mono text-xs text-slate-400">{displayValue(member.id)}</span>
              </div>
            </div>
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${getStatusBadge(member.status)}`}>{statusLabel(member.status)}</span>
          </div>
          <dl className="grid grid-cols-1 gap-2 text-xs border-t border-slate-800/60 pt-2.5">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-medium min-w-[70px]">{t('TABLE_CONTACT')}:</span>
              <dd className="break-words text-slate-300 flex-1 font-mono">
                {displayValue(member.email)}
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
                Seat:
              </span>
              <dd className="text-slate-200">{member.seat ? `Seat ${member.seat}` : '—'}</dd>
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
            <button
              type="button"
              className="min-h-9 flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-sky-500/30 bg-sky-500/10 px-3 text-xs font-semibold text-sky-400 hover:text-sky-300 hover:bg-sky-500/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
              onClick={() => onSelectMember(member)}
            >
              <Eye size={14} className="text-sky-400" />
              {t('ACTION_VIEW_DETAILS')}
            </button>
            {member.email && (
              <a
                href={`mailto:${member.email}?subject=${encodeURIComponent('Smart Library Notice')}&body=${encodeURIComponent(`Dear ${member.name},\n\n`)}`}
                className="min-h-9 rounded-xl border border-purple-500/30 bg-purple-500/10 px-3 text-xs font-semibold text-purple-400 hover:bg-purple-500/20 inline-flex items-center justify-center gap-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
                aria-label={`Email ${member.name}`}
                title={`Email ${member.name}`}
              >
                <Mail size={14} className="text-purple-400" /> Email
              </a>
            )}
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
          </div>
        </article>
      ))}
    </div>
  );
}

