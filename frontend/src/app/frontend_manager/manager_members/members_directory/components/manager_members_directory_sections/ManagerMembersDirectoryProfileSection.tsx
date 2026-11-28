'use client';

import { ManagerMembersDirectoryDocLightbox } from '@/app/frontend_manager/manager_members/members_directory/components/manager_members_directory_sections/ManagerMembersDirectoryDocLightbox';
import { ManagerMembersDirectoryEditModal } from '@/app/frontend_manager/manager_members/members_directory/components/manager_members_directory_sections/ManagerMembersDirectoryEditModal';
import { ManagerMembersDirectoryExtendedCards } from '@/app/frontend_manager/manager_members/members_directory/components/manager_members_directory_sections/ManagerMembersDirectoryExtendedCards';
import { ManagerMembersDirectoryFreezeModal } from '@/app/frontend_manager/manager_members/members_directory/components/manager_members_directory_sections/ManagerMembersDirectoryFreezeModal';
import {
  ManagerMembersDirectoryGraduateAlumniModal,
  type ManagerGraduateAlumniDetails,
} from '@/app/frontend_manager/manager_members/members_directory/components/manager_members_directory_sections/ManagerMembersDirectoryGraduateAlumniModal';
import {
  ManagerMembersDirectoryProfileContactGrid,
  ManagerMembersDirectoryProfileKycAndRewards,
} from '@/app/frontend_manager/manager_members/members_directory/components/manager_members_directory_sections/ManagerMembersDirectoryProfileKycAndRewards';
import '@/app/frontend_manager/manager_members/members_directory/components/manager_members_directory_styles/ManagerMembersDirectoryStyles.css';
import type { ManagerMembersDirectoryProfileSectionProps } from '@/app/frontend_manager/manager_members/members_directory/types/ManagerMembersDirectoryComponentTypes';
import type { ManagerMembersDirectoryLeaveDetails, ManagerMembersDirectoryRecord } from '@/app/frontend_manager/manager_members/members_directory/types/ManagerMembersDirectoryTypes';
import { graduateMemberToAlumni } from '@/app/frontend_manager/manager_members/members_directory/utils/ManagerMembersDirectoryGraduateAlumni';
import { writeBrowserSessionStorageItem, writeBrowserStorageItem } from '@/lib/browserStorage';
import { AlertTriangle, ArrowLeft, CheckCircle, Clock, GraduationCap, IndianRupee, MessageCircle, PauseCircle, Pencil, PlayCircle, Search, Users, X } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

export type { ManagerMembersDirectoryProfileSectionProps };

export function ManagerMembersDirectoryProfileSection({
  searchValue,
  onSearchChange,
  member,
  onUpdateMember,
  initialEdit,
  onBack,
}: ManagerMembersDirectoryProfileSectionProps) {
  const tManagerUi = useTranslations('manager.manager_member_directory.ui');
  const locale = useLocale();
  const router = useRouter();
  const [isEditModalOpen, setIsEditModalOpen] = useState(Boolean(initialEdit));
  const [isGraduateModalOpen, setIsGraduateModalOpen] = useState(false);
  const [isFreezeModalOpen, setIsFreezeModalOpen] = useState(false);
  const [selectedDocPreview, setSelectedDocPreview] = useState<string | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);

  const isFrozen = Boolean(member?.isFrozen || member?.status === 'On Leave');

  const handleCollectFee = () => {
    if (!member) return;
    const prefillData = {
      memberId: member.id,
      memberName: member.name,
      phone: member.phone,
      seat: member.seat || '',
      shift: member.shift || '',
      plan: member.type || '',
      expiryDate: member.expiryDate || '',
    };
    try {
      const payload = JSON.stringify(prefillData);
      writeBrowserSessionStorageItem('manager_pending_fee_collection', payload);
      writeBrowserSessionStorageItem('enquiry_conversion_prefill', payload);
      writeBrowserStorageItem('manager_pending_fee_collection', payload);
    } catch {
      // storage unavailable
    }
    const params = new URLSearchParams({
      studentId: member.id,
      name: member.name,
      phone: member.phone,
      seat: member.seat || '',
      shift: member.shift || '',
      plan: member.type || '',
    });
    router.push(`/frontend_manager/manager_finance/finance_collect_fee?${params.toString()}`);
  };

  const handleConfirmFreeze = (details: ManagerMembersDirectoryLeaveDetails) => {
    if (!member) return;
    let newExpiry = member.expiryDate;
    if (details.extendExpiry && member.expiryDate) {
      const cur = new Date(member.expiryDate);
      if (!isNaN(cur.getTime())) {
        cur.setDate(cur.getDate() + details.days);
        newExpiry = cur.toISOString().slice(0, 10);
      }
    }
    onUpdateMember?.({ ...member, status: 'On Leave', isFrozen: true, leaveDetails: details, expiryDate: newExpiry });
    toast.success(`Membership paused for ${member.name} (${details.days} days leave registered). Plan expiry extended to ${newExpiry}!`, {
      id: `manager-members-freeze-${member.id}`,
    });
  };

  const handleResumeMember = () => {
    if (!member) return;
    onUpdateMember?.({ ...member, status: 'Active', isFrozen: false });
    toast.success(`Membership resumed for ${member.name}. Student status is now Active!`, {
      id: `manager-members-resume-${member.id}`,
    });
  };

  const handleSaveMember = (updated: ManagerMembersDirectoryRecord) => {
    onUpdateMember?.(updated);
    setIsEditModalOpen(false);
    toast.success(`Profile for ${updated.name} (${updated.id}) updated successfully!`, {
      id: `manager-members-save-${updated.id}`,
    });
  };

  const handleGraduateMember = (targetMember: ManagerMembersDirectoryRecord, details: ManagerGraduateAlumniDetails) => {
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
    toast.success(`WhatsApp opened for ${member.name} (+${targetPhone})`, { id: `manager-members-wa-${member.id}` });
  };

  const membershipTypeLabels: Record<string, string> = { Basic: tManagerUi('basic'), Pro: tManagerUi('pro'), Enterprise: tManagerUi('enterprise') };
  const memberStatusLabels: Record<string, string> = {
    Active: tManagerUi('member_status_active'),
    Expired: tManagerUi('member_status_expired'),
    Suspended: tManagerUi('member_status_suspended'),
    Blocked: 'Blocked',
    'On Leave': tManagerUi('member_status_on_leave') || 'On Leave',
  };
  const membershipTypeLabel = member ? (membershipTypeLabels[member.type] ?? member.type) : '';
  const memberStatusLabel = member ? (memberStatusLabels[member.status] ?? member.status) : '';
  const statusConfig = member
    ? {
        Active: { container: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400', icon: <CheckCircle size={13} aria-hidden="true" /> },
        Expired: { container: 'bg-rose-500/15 border-rose-500/30 text-rose-400', icon: <Clock size={13} aria-hidden="true" /> },
        Suspended: { container: 'bg-amber-500/15 border-amber-500/30 text-amber-400', icon: <AlertTriangle size={13} aria-hidden="true" /> },
        Blocked: { container: 'bg-rose-500/15 border-rose-500/30 text-rose-400', icon: <AlertTriangle size={13} aria-hidden="true" /> },
        'On Leave': { container: 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300', icon: <PauseCircle size={13} aria-hidden="true" /> },
      }[member.status] ?? { container: 'bg-card border-border text-primary', icon: <CheckCircle size={13} aria-hidden="true" /> }
    : { container: 'bg-card border-border text-primary', icon: <CheckCircle size={13} aria-hidden="true" /> };

  return (
    <section className="motion-safe:transition-all motion-safe:duration-base w-full max-w-full min-w-0" aria-labelledby="manager-members-profile-title">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 border-b border-border pb-4">
        <h2 id="manager-members-profile-title" className="text-xl font-bold text-primary">{tManagerUi('search_view_profile')}</h2>
        {onBack && (
          <button type="button" onClick={onBack} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-indigo-500/30 bg-indigo-500/15 text-indigo-300 hover:text-white hover:bg-indigo-600/30 motion-safe:transition-all cursor-pointer font-semibold text-xs shadow-sm self-start sm:self-auto">
            <ArrowLeft size={14} /><span>Back to All Members</span>
          </button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <label className="sr-only" htmlFor="manager-members-profile-search">{tManagerUi('member_id_or_name')}</label>
        <div className="relative flex-1 min-w-0">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-400 pointer-events-none z-10" />
          <input maxLength={30} id="manager-members-profile-search" type="search" className="mgr-input !pl-10 text-xs sm:text-sm w-full" placeholder={tManagerUi('enter_member_id_or_name_e_g_lib_001')} value={searchValue} onChange={(e) => onSearchChange(e.target.value)} />
          {searchValue && (
            <button type="button" onClick={() => onSearchChange('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-secondary hover:text-primary motion-safe:transition-colors cursor-pointer p-0.5" title="Clear search">
              <X size={13} />
            </button>
          )}
        </div>
        <button type="button" className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-950/50 motion-safe:transition-all cursor-pointer shrink-0" onClick={() => onSearchChange(searchValue.trim())} aria-label={tManagerUi('search_member_profile')}>
          <Search size={15} /><span>{tManagerUi('search')}</span>
        </button>
      </div>

      {!member ? (
        <div className="mgr-empty-state"><p className="mgr-empty-title">{tManagerUi('no_matching_member')}</p><p className="mgr-empty-sub">{tManagerUi('try_a_member_id_or_name_from_the_directory')}</p></div>
      ) : (
        <div className="space-y-6 w-full max-w-full min-w-0">
          <div className="p-5 sm:p-6 rounded-2xl bg-floating border border-border space-y-6 w-full max-w-full min-w-0 shadow-lg shadow-black/20">
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-5 min-w-0">
              <div className="flex items-start sm:items-center gap-4 min-w-0">
                <button
                  type="button"
                  onClick={() => setIsZoomed(true)}
                  title="Click to view enlarged photo"
                  aria-label="View enlarged member photo"
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-indigo-500/10 border-2 border-indigo-500/30 flex items-center justify-center shrink-0 cursor-pointer hover:border-indigo-400 hover:scale-105 motion-safe:transition-all shadow-md group relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <Users size={38} className="text-indigo-400 group-hover:scale-110 motion-safe:transition-transform" />
                </button>
                <div className="min-w-0 flex-1">
                  <h3 className="text-xl sm:text-2xl font-black text-primary tracking-tight truncate" title={member.name}>{member.name}</h3>
                  <div className="flex items-center gap-2 flex-wrap mt-1.5">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">{member.id}</span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-purple-500/15 text-purple-300 border border-purple-500/30">{membershipTypeLabel} {tManagerUi('plan')}</span>
                    <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-md border ${statusConfig.container}`}>{statusConfig.icon}<span>{memberStatusLabel}</span></span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap shrink-0">
                <button type="button" onClick={handleCollectFee} className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-950/40 motion-safe:transition-all cursor-pointer hover:scale-[1.02]" title={`Direct Collect Fee or Renew Plan for ${member.name}`}>
                  <IndianRupee size={13} /><span>Collect Fee</span>
                </button>
                {isFrozen ? (
                  <button type="button" onClick={handleResumeMember} className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/35 hover:text-white shadow-sm shadow-cyan-950/50 motion-safe:transition-all cursor-pointer" title="Resume active membership">
                    <PlayCircle size={13} /><span>Resume Membership</span>
                  </button>
                ) : (
                  <button type="button" onClick={() => setIsFreezeModalOpen(true)} className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/35 hover:text-white shadow-sm shadow-amber-950/50 motion-safe:transition-all cursor-pointer" title="Pause / Freeze Membership for student on leave">
                    <PauseCircle size={13} /><span>Freeze / Apply Leave</span>
                  </button>
                )}
                <button type="button" onClick={handleWhatsAppMember} className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/35 hover:text-emerald-200 shadow-sm shadow-emerald-950/50 motion-safe:transition-all cursor-pointer" title="Send WhatsApp message">
                  <MessageCircle size={13} /><span>WhatsApp</span>
                </button>
                <button type="button" onClick={() => setIsEditModalOpen(true)} className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold bg-sky-500/20 text-sky-400 border border-sky-500/40 hover:bg-sky-500/35 hover:text-sky-200 shadow-sm shadow-sky-950/50 motion-safe:transition-all cursor-pointer" title="Edit Member Profile">
                  <Pencil size={13} /><span>Edit Profile</span>
                </button>
                <button type="button" onClick={() => setIsGraduateModalOpen(true)} className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold bg-purple-500/20 text-purple-400 border border-purple-500/40 hover:bg-purple-500/35 hover:text-purple-200 shadow-sm shadow-purple-950/50 motion-safe:transition-all cursor-pointer" title="Graduate Member to Alumni Network">
                  <GraduationCap size={14} /><span>Convert to Alumni</span>
                </button>
              </div>
            </div>

            {isFrozen && (
              <div className="p-4 rounded-xl md-freeze-banner border border-cyan-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 flex items-center justify-center shrink-0 mt-0.5"><PauseCircle size={22} /></div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-cyan-200 text-sm">Membership Currently Paused / Frozen</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">{member.leaveDetails?.days || 15} Days Leave</span>
                    </div>
                    <p className="text-slate-300 mt-1">
                      <span className="text-slate-400">Duration: </span>
                      <span className="font-semibold text-white">{member.leaveDetails?.startDate || 'Today'} to {member.leaveDetails?.endDate || '15 days'}</span>
                      <span className="mx-2 text-slate-500">•</span>
                      <span className="text-slate-400">Reason: </span>
                      <span className="font-semibold text-cyan-200">{member.leaveDetails?.reason || 'Home visit / Exams'}</span>
                    </p>
                    {member.leaveDetails?.notes && <p className="text-slate-400 text-[11px] mt-0.5 italic">Remarks: &quot;{member.leaveDetails.notes}&quot;</p>}
                  </div>
                </div>
                <button type="button" onClick={handleResumeMember} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md shadow-cyan-950/50 motion-safe:transition-all cursor-pointer shrink-0 self-start sm:self-auto">
                  <PlayCircle size={14} /><span>Resume / Unfreeze Now</span>
                </button>
              </div>
            )}

            <ManagerMembersDirectoryProfileContactGrid member={member} locale={locale} tManagerUi={tManagerUi} />
          </div>

          <ManagerMembersDirectoryExtendedCards member={member} onEdit={() => setIsEditModalOpen(true)} />
          <ManagerMembersDirectoryProfileKycAndRewards
            referralPoints={member.referralPoints ?? 0}
            referredBy={member.referredBy || tManagerUi('direct_walkin')}
            displayDocuments={member.documents ?? []}
            onSelectDocPreview={setSelectedDocPreview}
            tManagerUi={tManagerUi}
          />
        </div>
      )}

      {member && (
        <>
          <ManagerMembersDirectoryEditModal member={member} isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} onSave={handleSaveMember} />
          <ManagerMembersDirectoryGraduateAlumniModal isOpen={isGraduateModalOpen} onClose={() => setIsGraduateModalOpen(false)} member={member} onGraduate={handleGraduateMember} />
          <ManagerMembersDirectoryFreezeModal isOpen={isFreezeModalOpen} onClose={() => setIsFreezeModalOpen(false)} member={member} onConfirmFreeze={handleConfirmFreeze} />
          <ManagerMembersDirectoryDocLightbox isZoomed={isZoomed} setIsZoomed={setIsZoomed} selectedDocPreview={selectedDocPreview} setSelectedDocPreview={setSelectedDocPreview} mockPhotoUrl="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80" memberName={member.name} memberId={member.id} memberJoinDate={member.joinDate} />
        </>
      )}
    </section>
  );
}
