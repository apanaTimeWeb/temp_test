'use client';
// RESPONSIBILITY: Render the members directory profile section section of the components feature. It does not own backend persistence or cross-feature business logic.
// RESPONSIBILITY: Render the members directory profile section section of the components feature. It does not own backend persistence or cross-feature business logic.
import { useLocale, useTranslations } from 'next-intl';

import { Award, CheckCircle, Clock, Download, ExternalLink, FileText, Mail, MapPin, Phone, Search, ShieldCheck, Users } from 'lucide-react';

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

  const defaultDocuments = member ? [
    { id: 'DOC-DEF-1', type: 'Aadhaar Card', number: '•••• •••• 5678', status: 'Verified' as const, fileName: 'aadhaar_card.pdf', uploadDate: member.joinDate },
    { id: 'DOC-DEF-2', type: 'Student Photo', number: 'PHOTO-01', status: 'Verified' as const, fileName: 'passport_photo.png', uploadDate: member.joinDate },
  ] : [];
  const displayDocuments = member?.documents && member.documents.length > 0 ? member.documents : defaultDocuments;
  const referralPoints = member?.referralPoints ?? 150;
  const referredBy = member?.referredBy || tManagerUi('direct_walkin');

  return (
    <section className="motion-safe:transition-all motion-safe:duration-base" aria-labelledby="manager-members-profile-title">
      <h2 id="manager-members-profile-title" className="text-xl font-bold text-primary mb-6 border-b border-border pb-4">{tManagerUi('search_view_profile')}</h2>
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <label className="sr-only" htmlFor="manager-members-profile-search">{tManagerUi('member_id_or_name')}</label>
        <input id="manager-members-profile-search" type="search" className="mgr-input flex-1" placeholder={tManagerUi('enter_member_id_or_name_e_g_lib_001')} value={searchValue} onChange={(event) => onSearchChange(event.target.value)} />
        <button type="button" className="mgr-btn-primary" onClick={() => onSearchChange(searchValue.trim())} aria-label={tManagerUi('search_member_profile')}><Search size={16}/> {tManagerUi('search')}</button>
      </div>
      {!member ? <div className="mgr-empty-state"><p className="mgr-empty-title">{tManagerUi('no_matching_member')}</p><p className="mgr-empty-sub">{tManagerUi('try_a_member_id_or_name_from_the_directory')}</p></div> : (
        <div className="space-y-6">
          {/* Main Profile Info Card */}
          <div className="p-6 rounded-2xl bg-floating border border-border flex flex-col md:flex-row gap-8">
            <div className="w-32 h-32 rounded-2xl bg-info-bg flex items-center justify-center shrink-0 border border-info"><Users size={48} className="text-info" /></div>
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-2xl font-black text-primary mb-1">{member.name}</h3>
                <p className="text-sm text-info font-bold mb-4">{member.id} • {membershipTypeLabel} {tManagerUi('plan')}</p>
                <div className="space-y-2 text-sm">
                  <p className="flex items-center gap-2 text-secondary"><Phone size={14}/>{maskManagerMemberPhone(member.phone)}</p>
                  <p className="flex items-center gap-2 text-secondary"><Mail size={14}/>{member.email || tManagerUi('no_email_provided')}</p>
                  <p className="flex items-center gap-2 text-secondary"><MapPin size={14}/>{member.address || tManagerUi('address_not_provided')}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="p-3 rounded-xl bg-success-bg border border-success text-success">
                  <p className="text-xs font-bold uppercase mb-1">{tManagerUi('status')}</p>
                  <p className="text-lg font-black flex items-center gap-2"><CheckCircle size={18}/> {memberStatusLabel}</p>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="bg-card p-2 rounded-lg">
                    <span className="text-xs text-secondary block">{tManagerUi('joined')}</span>
                    <span className="text-primary font-semibold">{formatKnownIsoCalendarDate(member.joinDate, locale)}</span>
                  </div>
                  <div className="bg-card p-2 rounded-lg">
                    <span className="text-xs text-secondary block">{tManagerUi('expires')}</span>
                    <span className="text-primary font-semibold">{formatKnownIsoCalendarDate(member.expiryDate, locale)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Referral Rewards & Bonus Banner (Consolidated from Sidebar) */}
          <div className="p-5 rounded-2xl bg-card border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-warning-bg flex items-center justify-center text-warning shrink-0 border border-warning/30">
                <Award size={24} />
              </div>
              <div>
                <h4 className="font-bold text-primary flex items-center gap-2">
                  {tManagerUi('referral_rewards')}
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-warning-bg text-warning border border-warning/30">
                    {referralPoints} {tManagerUi('points')}
                  </span>
                </h4>
                <p className="text-xs text-secondary mt-0.5">
                  {tManagerUi('referred_by')}: <span className="font-medium text-primary">{referredBy}</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-secondary px-3 py-1.5 rounded-lg bg-surface border border-border">
                {referralPoints > 0 ? 'Active Referral Contributor' : 'Standard Member'}
              </span>
            </div>
          </div>

          {/* KYC Documents Section */}
          <div className="p-6 rounded-2xl bg-floating border border-border">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-primary flex items-center gap-2">
                <ShieldCheck size={20} className="text-success" />
                {tManagerUi('kyc_documents')}
              </h4>
              <span className="text-xs text-secondary">
                {displayDocuments.length} files attached
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayDocuments.map((doc) => (
                <div key={doc.id} className="p-4 rounded-xl bg-card border border-border flex flex-col justify-between gap-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <FileText size={18} className="text-info shrink-0" />
                      <div>
                        <p className="text-sm font-bold text-primary leading-tight">{doc.type}</p>
                        <p className="text-xs text-secondary font-mono mt-0.5">{doc.number || doc.fileName}</p>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold flex items-center gap-1 ${
                      doc.status === 'Verified' ? 'bg-success-bg text-success border border-success/30' : 'bg-warning-bg text-warning border border-warning/30'
                    }`}>
                      {doc.status === 'Verified' ? <CheckCircle size={12} /> : <Clock size={12} />}
                      {doc.status === 'Verified' ? tManagerUi('verified') : tManagerUi('pending')}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-border flex items-center justify-between text-xs text-secondary">
                    <span>{doc.uploadDate}</span>
                    <div className="flex items-center gap-2">
                      <button type="button" className="text-primary hover:text-info flex items-center gap-1 text-xs" title={tManagerUi('preview')}>
                        <ExternalLink size={12} /> {tManagerUi('preview')}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
