'use client';
// RESPONSIBILITY: Render the members directory profile section section of the components feature. It does not own backend persistence or cross-feature business logic.
// RESPONSIBILITY: Render the members directory profile section section of the components feature. It does not own backend persistence or cross-feature business logic.
import { useLocale, useTranslations } from 'next-intl';

import { CheckCircle, Mail, MapPin, Phone, Search, Users } from 'lucide-react';

import { maskManagerMemberPhone } from '@/app/frontend_manager/manager_members/members_directory/utils/ManagerMembersDirectoryPrivacy';
import type { ManagerMembersDirectoryProfileSectionProps } from '@/app/frontend_manager/manager_members/members_directory/types/ManagerMembersDirectoryComponentTypes';
export type { ManagerMembersDirectoryProfileSectionProps };


function formatKnownIsoCalendarDate(value: string, locale: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return value;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return value;
  return new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'short', day: 'numeric' }).format(date);
}


export function ManagerMembersDirectoryProfileSection({ searchValue, onSearchChange, member }: ManagerMembersDirectoryProfileSectionProps) {
  const tManagerUi = useTranslations('manager.manager_member_directory.ui');
  const locale = useLocale();
  const membershipTypeLabels: Record<string, string> = { Basic: tManagerUi('basic'), Pro: tManagerUi('pro'), Enterprise: tManagerUi('enterprise') };
  const memberStatusLabels: Record<string, string> = { Active: tManagerUi('member_status_active'), Expired: tManagerUi('member_status_expired'), Suspended: tManagerUi('member_status_suspended') };
  const membershipTypeLabel = member ? (membershipTypeLabels[member.type] ?? member.type) : '';
  const memberStatusLabel = member ? (memberStatusLabels[member.status] ?? member.status) : '';
  return (
    <section className="motion-safe:transition-all motion-safe:duration-base" aria-labelledby="manager-members-profile-title">
      <h2 id="manager-members-profile-title" className="text-xl font-bold text-primary mb-6 border-b border-border pb-4">{tManagerUi('search_view_profile')}</h2>
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <label className="sr-only" htmlFor="manager-members-profile-search">{tManagerUi('member_id_or_name')}</label>
        <input id="manager-members-profile-search" type="search" className="mgr-input flex-1" placeholder={tManagerUi('enter_member_id_or_name_e_g_lib_001')} value={searchValue} onChange={(event) => onSearchChange(event.target.value)} />
        <button type="button" className="mgr-btn-primary" onClick={() => onSearchChange(searchValue.trim())} aria-label={tManagerUi('search_member_profile')}><Search size={16}/> {tManagerUi('search')}</button>
      </div>
      {!member ? <div className="mgr-empty-state"><p className="mgr-empty-title">{tManagerUi('no_matching_member')}</p><p className="mgr-empty-sub">{tManagerUi('try_a_member_id_or_name_from_the_directory')}</p></div> : (
        <div className="p-6 rounded-2xl bg-floating border border-border flex flex-col md:flex-row gap-8">
          <div className="w-32 h-32 rounded-2xl bg-info-bg flex items-center justify-center shrink-0 border border-info"><Users size={48} className="text-info" /></div>
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><h3 className="text-2xl font-black text-primary mb-1">{member.name}</h3><p className="text-sm text-info font-bold mb-4">{member.id} • {membershipTypeLabel} {tManagerUi('plan')}</p><div className="space-y-2 text-sm"><p className="flex items-center gap-2 text-secondary"><Phone size={14}/>{maskManagerMemberPhone(member.phone)}</p><p className="flex items-center gap-2 text-secondary"><Mail size={14}/>{member.email || tManagerUi('no_email_provided')}</p><p className="flex items-center gap-2 text-secondary"><MapPin size={14}/>{member.address || tManagerUi('address_not_provided')}</p></div></div>
            <div className="space-y-4"><div className="p-3 rounded-xl bg-success-bg border border-success text-success"><p className="text-xs font-bold uppercase mb-1">{tManagerUi('status')}</p><p className="text-lg font-black flex items-center gap-2"><CheckCircle size={18}/> {memberStatusLabel}</p></div><div className="grid grid-cols-2 gap-2 text-sm"><div className="bg-card p-2 rounded-lg"><span className="text-xs text-secondary block">{tManagerUi('joined')}</span><span className="text-primary font-semibold">{formatKnownIsoCalendarDate(member.joinDate, locale)}</span></div><div className="bg-card p-2 rounded-lg"><span className="text-xs text-secondary block">{tManagerUi('expires')}</span><span className="text-primary font-semibold">{formatKnownIsoCalendarDate(member.expiryDate, locale)}</span></div></div></div>
          </div>
        </div>
      )}
    </section>
  );
}
