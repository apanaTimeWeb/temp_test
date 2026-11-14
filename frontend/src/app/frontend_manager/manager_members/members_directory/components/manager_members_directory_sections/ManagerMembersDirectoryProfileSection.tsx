'use client';
// RESPONSIBILITY: Render the members directory profile section section of the components feature. It does not own backend persistence or cross-feature business logic.
import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { toast } from 'sonner';

import {
  Award, CheckCircle, Clock, ExternalLink, FileText, GraduationCap,
  Mail, MapPin, Pencil, Phone, Search, ShieldCheck, Users, ArrowLeft, MessageSquare, MessageCircle, PhoneCall, AlertTriangle
} from 'lucide-react';

import { maskManagerMemberPhone } from '@/app/frontend_manager/manager_members/members_directory/utils/ManagerMembersDirectoryPrivacy';
import { formatManagerMemberDirectoryCalendarDate } from '@/app/frontend_manager/manager_members/members_directory/utils/ManagerMembersDirectoryDateFormatting';
import { ManagerMembersDirectoryEditModal } from '@/app/frontend_manager/manager_members/members_directory/components/manager_members_directory_sections/ManagerMembersDirectoryEditModal';
import { ManagerMembersDirectoryExtendedCards } from '@/app/frontend_manager/manager_members/members_directory/components/manager_members_directory_sections/ManagerMembersDirectoryExtendedCards';
import { ManagerMembersDirectoryDocLightbox } from '@/app/frontend_manager/manager_members/members_directory/components/manager_members_directory_sections/ManagerMembersDirectoryDocLightbox';
import {
  ManagerMembersDirectoryGraduateAlumniModal,
  type ManagerGraduateAlumniDetails,
} from '@/app/frontend_manager/manager_members/members_directory/components/manager_members_directory_sections/ManagerMembersDirectoryGraduateAlumniModal';
import { graduateMemberToAlumni } from '@/app/frontend_manager/manager_members/members_directory/utils/ManagerMembersDirectoryGraduateAlumni';
import type { ManagerMembersDirectoryRecord } from '@/app/frontend_manager/manager_members/members_directory/types/ManagerMembersDirectoryTypes';
import type { ManagerMembersDirectoryProfileSectionProps } from '@/app/frontend_manager/manager_members/members_directory/types/ManagerMembersDirectoryComponentTypes';
export type { ManagerMembersDirectoryProfileSectionProps };

export function ManagerMembersDirectoryProfileSection({ searchValue, onSearchChange, member, onUpdateMember, initialEdit, onBack }: ManagerMembersDirectoryProfileSectionProps) {
  const tManagerUi = useTranslations('manager.manager_member_directory.ui');
  const locale = useLocale();
  const [isEditModalOpen, setIsEditModalOpen] = useState(Boolean(initialEdit));
  const [isGraduateModalOpen, setIsGraduateModalOpen] = useState(false);
  const [selectedDocPreview, setSelectedDocPreview] = useState<string | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);

  const handleSaveMember = (updated: ManagerMembersDirectoryRecord) => {
    onUpdateMember?.(updated);
    setIsEditModalOpen(false);
    toast.success(`Profile for ${updated.name} (${updated.id}) updated successfully!`);
  };

  const handleGraduateMember = (
    targetMember: ManagerMembersDirectoryRecord,
    details: ManagerGraduateAlumniDetails
  ) => {
    graduateMemberToAlumni(targetMember, details, onUpdateMember);
    setIsGraduateModalOpen(false);
  };

  const handleWhatsAppMember = () => {
    if (!member) return;
    let cleanPhone = member.phone.replace(/\D/g, '');
    if (cleanPhone.length === 11 && cleanPhone.startsWith('0')) cleanPhone = cleanPhone.slice(1);
    const targetPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    const text = encodeURIComponent(
      `Hello ${member.name},\nThis is Central Library Management regarding your membership (${member.id} • ${member.type} Plan).\n` +
      `Assigned Seat: ${member.seat || 'General Study'} • Shift: ${member.shift || 'Morning'}.\n\n` +
      `How may we assist you today?\n— Central Library Administration`
    );
    const popup = window.open(`https://wa.me/${targetPhone}?text=${text}`, '_blank', 'noopener,noreferrer');
    if (popup) popup.opener = null;
    toast.success(`WhatsApp opened for ${member.name} (+${targetPhone})`);
  };

  const membershipTypeLabels: Record<string, string> = { Basic: tManagerUi('basic'), Pro: tManagerUi('pro'), Enterprise: tManagerUi('enterprise') };
  const memberStatusLabels: Record<string, string> = { Active: tManagerUi('member_status_active'), Expired: tManagerUi('member_status_expired'), Suspended: tManagerUi('member_status_suspended'), Blocked: 'Blocked' };
  const membershipTypeLabel = member ? (membershipTypeLabels[member.type] ?? member.type) : '';
  const memberStatusLabel = member ? (memberStatusLabels[member.status] ?? member.status) : '';
  const displayDocuments = member?.documents && member.documents.length > 0 ? member.documents : [];
  const referralPoints = member?.referralPoints ?? 0;
  const referredBy = member?.referredBy || tManagerUi('direct_walkin');

  const statusConfig = member
    ? {
        Active: { container: 'bg-success-bg border-success text-success', icon: <CheckCircle size={18} aria-hidden="true" /> },
        Expired: { container: 'bg-danger-bg border-danger text-danger', icon: <Clock size={18} aria-hidden="true" /> },
        Suspended: { container: 'bg-warning-bg border-warning text-warning', icon: <AlertTriangle size={18} aria-hidden="true" /> },
        Blocked: { container: 'bg-danger-bg border-danger text-danger', icon: <AlertTriangle size={18} aria-hidden="true" /> },
      }[member.status] ?? { container: 'bg-card border-border text-primary', icon: <CheckCircle size={18} aria-hidden="true" /> }
    : { container: 'bg-card border-border text-primary', icon: <CheckCircle size={18} aria-hidden="true" /> };

  return (
    <section className="motion-safe:transition-all motion-safe:duration-base" aria-labelledby="manager-members-profile-title">
      <div className="flex items-center justify-between gap-4 mb-6 border-b border-border pb-4">
        <h2 id="manager-members-profile-title" className="text-xl font-bold text-primary">{tManagerUi('search_view_profile')}</h2>
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-indigo-500/30 bg-indigo-500/15 text-indigo-300 hover:text-white hover:bg-indigo-600/30 transition-all cursor-pointer font-semibold text-xs shadow-sm"
          >
            <ArrowLeft size={14} />
            <span>Back to All Members</span>
          </button>
        )}
      </div>
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <label className="sr-only" htmlFor="manager-members-profile-search">{tManagerUi('member_id_or_name')}</label>
        <input id="manager-members-profile-search" type="search" className="mgr-input flex-1" placeholder={tManagerUi('enter_member_id_or_name_e_g_lib_001')} value={searchValue} onChange={(event) => onSearchChange(event.target.value)} />
        <button
          type="button"
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-bold shadow-md shadow-indigo-950/50 transition-all cursor-pointer"
          onClick={() => onSearchChange(searchValue.trim())}
          aria-label={tManagerUi('search_member_profile')}
        >
          <Search size={15} />
          <span>{tManagerUi('search')}</span>
        </button>
      </div>
      {!member ? <div className="mgr-empty-state"><p className="mgr-empty-title">{tManagerUi('no_matching_member')}</p><p className="mgr-empty-sub">{tManagerUi('try_a_member_id_or_name_from_the_directory')}</p></div> : (
        <div className="space-y-6">
          {/* Main Profile Header Card */}
          <div className="p-6 rounded-2xl bg-floating border border-border flex flex-col md:flex-row gap-8">
            <div
              className="w-32 h-32 rounded-2xl bg-info-bg flex items-center justify-center shrink-0 border border-info cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => setIsZoomed(true)}
              title="Click to view enlarged photo"
            >
              <Users size={48} className="text-info" />
            </div>
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-start justify-between gap-3 mb-1">
                  <h3 className="text-2xl font-black text-primary">{member.name}</h3>
                  <div className="flex items-center gap-2 flex-wrap shrink-0">
                    {/* Call Button (Amber) */}
                    <a
                      href={`tel:${member.phone.replace(/\D/g, '')}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40 hover:bg-amber-500/35 hover:text-amber-200 shadow-sm shadow-amber-950/50 transition-all cursor-pointer"
                      title={`Call ${member.name}`}
                    >
                      <PhoneCall size={13} />
                      <span>Call</span>
                    </a>

                    {/* WhatsApp Button (Emerald) */}
                    <button
                      type="button"
                      onClick={handleWhatsAppMember}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/35 hover:text-emerald-200 shadow-sm shadow-emerald-950/50 transition-all cursor-pointer"
                      title="Send WhatsApp message"
                    >
                      <MessageCircle size={13} />
                      <span>WhatsApp</span>
                    </button>

                    {/* Edit Profile Button (Sky Blue) */}
                    <button
                      type="button"
                      onClick={() => setIsEditModalOpen(true)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-sky-500/20 text-sky-400 border border-sky-500/40 hover:bg-sky-500/35 hover:text-sky-200 shadow-sm shadow-sky-950/50 transition-all cursor-pointer"
                      title="Edit Member Profile"
                    >
                      <Pencil size={13} />
                      <span>Edit Profile</span>
                    </button>

                    {/* Convert to Alumni Button (Purple) */}
                    <button
                      type="button"
                      onClick={() => setIsGraduateModalOpen(true)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-purple-500/20 text-purple-400 border border-purple-500/40 hover:bg-purple-500/35 hover:text-purple-200 shadow-sm shadow-purple-950/50 transition-all cursor-pointer"
                      title="Graduate Member to Alumni Network"
                    >
                      <GraduationCap size={14} />
                      <span>Convert to Alumni</span>
                    </button>
                  </div>
                </div>
                <p className="text-sm text-info font-bold mb-4">{member.id} • {membershipTypeLabel} {tManagerUi('plan')}</p>
                <div className="space-y-2 text-sm">
                  <p className="flex items-center gap-2 text-secondary"><Phone size={14} />{maskManagerMemberPhone(member.phone)}</p>
                  <p className="flex items-center gap-2 text-secondary"><Mail size={14} />{member.email || tManagerUi('no_email_provided')}</p>
                  <p className="flex items-center gap-2 text-secondary"><MapPin size={14} />{member.address || tManagerUi('address_not_provided')}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className={`p-3 rounded-xl border ${statusConfig.container}`}>
                  <p className="text-xs font-bold uppercase mb-1">{tManagerUi('status')}</p>
                  <p className="text-lg font-black flex items-center gap-2">{statusConfig.icon} {memberStatusLabel}</p>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="bg-card p-2 rounded-lg">
                    <span className="text-xs text-secondary block">{tManagerUi('joined')}</span>
                    <span className="text-primary font-semibold">{formatManagerMemberDirectoryCalendarDate(member.joinDate, locale)}</span>
                  </div>
                  <div className="bg-card p-2 rounded-lg">
                    <span className="text-xs text-secondary block">{tManagerUi('expires')}</span>
                    <span className="text-primary font-semibold">{formatManagerMemberDirectoryCalendarDate(member.expiryDate, locale)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* New Admission Extended Details Grid */}
          <ManagerMembersDirectoryExtendedCards
            member={member}
            onEdit={() => setIsEditModalOpen(true)}
          />

          {/* Referral Rewards & Bonus Banner (Consolidated from Sidebar) */}
          <div className="p-5 rounded-2xl bg-card border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-warning-bg flex items-center justify-center text-warning shrink-0 border border-border">
                <Award size={24} />
              </div>
              <div>
                <h4 className="font-bold text-primary flex items-center gap-2">
                  {tManagerUi('referral_rewards')}
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-warning-bg text-warning border border-border">
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
            {displayDocuments.length === 0 ? (
              <div className="p-6 rounded-xl bg-card border border-border text-center text-xs text-secondary">
                <FileText size={24} className="mx-auto text-secondary mb-2 opacity-50" />
                <p className="font-semibold text-primary">No KYC Documents Attached</p>
                <p className="mt-1">Member identity proof documents have not been uploaded to this account yet.</p>
              </div>
            ) : (
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
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold flex items-center gap-1 ${doc.status === 'Verified' ? 'bg-success-bg text-success border border-border' : 'bg-warning-bg text-warning border border-border'
                        }`}>
                        {doc.status === 'Verified' ? <CheckCircle size={12} /> : <Clock size={12} />}
                        {doc.status === 'Verified' ? tManagerUi('verified') : tManagerUi('pending')}
                      </span>
                    </div>
                    <div className="pt-2 border-t border-border flex items-center justify-between text-xs text-secondary">
                      <span>{doc.uploadDate}</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedDocPreview(`${doc.type}: ${doc.number || doc.fileName || 'Verified Document'}`)}
                          className="text-primary hover:text-info flex items-center gap-1 text-xs cursor-pointer font-medium"
                          title={tManagerUi('preview')}
                        >
                          <ExternalLink size={12} /> {tManagerUi('preview')}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {member && (
        <>
          <ManagerMembersDirectoryEditModal
            member={member}
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            onSave={handleSaveMember}
          />
          <ManagerMembersDirectoryGraduateAlumniModal
            isOpen={isGraduateModalOpen}
            onClose={() => setIsGraduateModalOpen(false)}
            member={member}
            onGraduate={handleGraduateMember}
          />
          <ManagerMembersDirectoryDocLightbox
            isZoomed={isZoomed}
            setIsZoomed={setIsZoomed}
            selectedDocPreview={selectedDocPreview}
            setSelectedDocPreview={setSelectedDocPreview}
            mockPhotoUrl="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80"
            memberName={member.name}
            memberId={member.id}
            memberJoinDate={member.joinDate}
          />
        </>
      )}
    </section>
  );
}
