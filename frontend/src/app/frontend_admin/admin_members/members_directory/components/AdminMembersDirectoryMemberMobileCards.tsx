'use client';
// RESPONSIBILITY: AdminMembersDirectoryMemberMobileCards component owned by admin_members.

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { MoreVertical, MessageSquare } from 'lucide-react';
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

  return (
    <div className="grid gap-3 md:hidden" role="list" aria-label={t('TABLE_MEMBER')}>
      {visibleMembers.map((member) => (
        <article key={`mobile-${member.id}`} role="listitem" className="rounded-lg border border-border bg-card p-4 shadow-card">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <button type="button" className="text-left font-semibold text-primary underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" onClick={() => onSelectMember(member)}>{displayValue(member.name)}</button>
              <p className="mt-1 text-xs text-text-secondary">{member.id}{member.branch ? ` · ${member.branch}` : ''}</p>
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0">
              <span className="rounded-full bg-surface-highlight px-2.5 py-1 text-xs font-semibold">{statusLabel(member.status)}</span>
              {member.feeStatus && (
                <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${member.feeStatus === 'Paid' ? 'bg-success-bg text-success-text' : 'bg-danger-bg text-danger-text'}`}>
                  {member.feeStatus === 'Due' && member.dueFeeMinor ? `Due: ₹${(member.dueFeeMinor / 100).toLocaleString('en-IN')}` : `Fee: ${member.feeStatus}`}
                </span>
              )}
            </div>
          </div>
          <dl className="mt-3 grid grid-cols-1 gap-2 text-sm">
            <div><dt className="text-xs text-text-secondary">{t('TABLE_CONTACT')}</dt><dd className="break-words text-text-primary"><span className="block">{displayValue(member.email)}</span><span className="text-text-secondary">{displayValue(member.phone)}</span></dd></div>
            <div><dt className="text-xs text-text-secondary">{t('TABLE_PLAN')}</dt><dd className="text-text-primary">{displayValue(member.plan)}</dd></div>
            <div><dt className="text-xs text-text-secondary">Seat / Shift / Locker</dt><dd className="text-text-primary">{member.seat ? `Seat ${member.seat}` : '—'} · {member.shift || '—'}{member.locker ? ` · Locker ${member.locker}` : ''}</dd></div>
            <div><dt className="text-xs text-text-secondary">{t('TABLE_EXPIRY')}</dt><dd className="text-text-primary">{expiryLabel(member.expiryDate)}</dd></div>
          </dl>
          <div className="relative mt-3 flex flex-wrap items-center gap-2 border-t border-border pt-3">
            {onToggleSelectOne && (
              <label className="flex items-center gap-1.5 text-xs text-text-secondary cursor-pointer mr-1">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(member.id)}
                  onChange={() => onToggleSelectOne(member.id)}
                  className="rounded border-border"
                />
                <span>Select</span>
              </label>
            )}
            <button type="button" className="min-h-11 flex-1 rounded-md border border-border px-3 text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" onClick={() => onSelectMember(member)}>{t('ACTION_VIEW_DETAILS')}</button>
            <button
              type="button"
              className="min-h-11 rounded-md border border-border px-3 text-success-text hover:bg-success-bg inline-flex items-center justify-center gap-1 text-xs font-semibold"
              aria-label={`Chat with ${member.name} on WhatsApp`}
              onClick={() => {
                const digits = (member.phone || '').replace(/\D/g, '');
                const phone = digits.length === 10 ? `91${digits}` : digits;
                window.open(`https://wa.me/${phone}?text=${encodeURIComponent(`Hello ${member.name}, greetings from Smart Library admin!`)}`, '_blank', 'noopener,noreferrer');
              }}
            >
              <MessageSquare size={16} /> WhatsApp
            </button>
            <button type="button" className="min-h-11 min-w-11 rounded-md border border-border px-3 text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" aria-label={t('ACTION_OPEN_ACTIONS', { name: member.name })} aria-expanded={openActionsFor === member.id} aria-controls={`admin-member-actions-mobile-${member.id}`} onClick={() => setOpenActionsFor((current) => current === member.id ? null : member.id)}><MoreVertical size={18} strokeWidth={2} aria-hidden="true" /></button>
            {openActionsFor === member.id && <div id={`admin-member-actions-mobile-${member.id}`} aria-label={t('ACTION_OPEN_ACTIONS', { name: member.name })} onKeyDown={(event) => { if (event.key === 'Escape') setOpenActionsFor(null); }} className="absolute right-0 top-12 z-10 min-w-48 rounded-md border border-border bg-popover p-1 shadow-popover">
              <button type="button" className="block min-h-11 w-full rounded px-3 py-2 text-left text-primary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" onClick={() => { setOpenActionsFor(null); onSelectMember(member); }}>{t('ACTION_VIEW_DETAILS')}</button>
              <button type="button" disabled={!canMutate} title={!canMutate ? t('MEMBER_EDIT_UNAVAILABLE') : undefined} className="block min-h-11 w-full rounded px-3 py-2 text-left text-primary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50" onClick={() => { setOpenActionsFor(null); onAction('EDIT', member); }}>{t('ACTION_EDIT_MEMBER')}</button>
              <button type="button" className="block min-h-11 w-full rounded px-3 py-2 text-left text-primary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" onClick={() => setOpenActionsFor(null)}>{t('ACTION_CLOSE_MENU')}</button>
            </div>}
          </div>
        </article>
      ))}
    </div>
  );
}

