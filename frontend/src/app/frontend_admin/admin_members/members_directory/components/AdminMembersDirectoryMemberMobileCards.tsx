'use client';
// RESPONSIBILITY: AdminMembersDirectoryMemberMobileCards component owned by admin_members.

import type { AdminMembersMember } from '@/app/frontend_admin/admin_members/members_directory/schemas/AdminMembersDirectorySchema';
import { displayValue } from '@/lib/display_value';
import { Armchair, CalendarClock, CreditCard, Eye, Mail, MessageSquare } from 'lucide-react';
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
  onSelectMember,
  statusLabel,
  expiryLabel,
}: AdminMembersDirectoryMemberMobileCardsProps) {
  const t = useTranslations('ADMIN_MEMBERS');

  const getStatusBadge = (status: AdminMembersMember['status']) => {
    switch (status) {
      case 'Active': return 'border border-success bg-success-bg text-success-text';
      case 'Expired': return 'border border-danger bg-danger-bg text-danger-text';
      case 'Suspended': return 'border border-warning bg-warning-bg text-warning-text';
      case 'Blocked': return 'border border-danger bg-danger-bg text-danger-text';
      default: return 'border border-border bg-surface-highlight text-text-secondary';
    }
  };

  return (
    <div className="grid gap-3.5 md:hidden" role="list" aria-label={t('TABLE_MEMBER')}>
      {visibleMembers.map((member) => (
        <article key={`mobile-${member.id}`} role="listitem" className="rounded-2xl border border-border bg-card p-4 shadow-card space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <button type="button" className="text-left font-semibold text-text-primary underline-offset-2 hover:underline hover:text-primary motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" onClick={() => onSelectMember(member)}>
                {displayValue(member.name)}
              </button>
              <div className="mt-0.5"><span className="font-mono text-xs text-text-secondary">{displayValue(member.id)}</span></div>
            </div>
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${getStatusBadge(member.status)}`}>{statusLabel(member.status)}</span>
          </div>

          <dl className="grid grid-cols-1 gap-2 text-xs border-t border-border pt-2.5">
            <div className="flex items-center gap-1.5">
              <span className="text-text-secondary font-medium min-w-[70px]">{t('TABLE_CONTACT')}:</span>
              <dd className="break-words text-text-primary flex-1 font-mono">{displayValue(member.email)}</dd>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-text-secondary font-medium min-w-[70px] flex items-center gap-1"><CreditCard size={11} className="text-purple shrink-0" aria-hidden="true" /> {t('TABLE_PLAN')}:</span>
              <dd className="text-purple font-medium">{displayValue(member.plan)}</dd>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-text-secondary font-medium min-w-[70px] flex items-center gap-1"><Armchair size={11} className="text-info-text shrink-0" aria-hidden="true" /> Seat:</span>
              <dd className="text-text-primary">{member.seat ? `Seat ${member.seat}` : '—'}</dd>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-text-secondary font-medium min-w-[70px] flex items-center gap-1"><CalendarClock size={11} className="text-danger-text shrink-0" aria-hidden="true" /> {t('TABLE_EXPIRY')}:</span>
              <dd className="text-text-secondary">{expiryLabel(member.expiryDate)}</dd>
            </div>
          </dl>

          <div className="relative flex flex-wrap items-center gap-2 border-t border-border pt-3">
            <button type="button" className="min-h-9 flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-info bg-info-bg px-3 text-xs font-semibold text-info-text hover:opacity-90 motion-safe:transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" onClick={() => onSelectMember(member)}>
              <Eye size={14} aria-hidden="true" /> {t('ACTION_VIEW_DETAILS')}
            </button>
            {member.email && (
              <a href={`mailto:${member.email}?subject=${encodeURIComponent('Smart Library Notice')}&body=${encodeURIComponent(`Dear ${member.name},\n\n`)}`} className="min-h-9 rounded-xl border border-border bg-purple-bg px-3 text-xs font-semibold text-purple hover:opacity-90 inline-flex items-center justify-center gap-1.5 motion-safe:transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" aria-label={`Email ${member.name}`} title={`Email ${member.name}`}>
                <Mail size={14} aria-hidden="true" /> Email
              </a>
            )}
            <button
              type="button"
              className="min-h-9 rounded-xl border border-success bg-success-bg px-3 text-xs font-semibold text-success-text hover:opacity-90 inline-flex items-center justify-center gap-1.5 motion-safe:transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label={`Chat with ${member.name} on WhatsApp`}
              onClick={() => {
                const digits = (member.phone || '').replace(/\D/g, '');
                const clean = digits.length === 11 && digits.startsWith('0') ? digits.slice(1) : digits;
                const phone = clean.length === 10 ? `91${clean}` : clean;
                const popup = window.open(`https://wa.me/${phone}?text=${encodeURIComponent(`Hello ${member.name}, greetings from Smart Library admin!`)}`, '_blank', 'noopener,noreferrer');
                if (popup) popup.opener = null;
              }}
            >
              <MessageSquare size={14} aria-hidden="true" /> WhatsApp
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
