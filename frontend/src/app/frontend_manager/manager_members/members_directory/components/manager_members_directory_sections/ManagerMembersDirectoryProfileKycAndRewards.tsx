'use client';

import type { ManagerMembersDirectoryDocumentRecord, ManagerMembersDirectoryRecord } from '@/app/frontend_manager/manager_members/members_directory/types/ManagerMembersDirectoryTypes';
import { formatManagerMemberDirectoryCalendarDate } from '@/app/frontend_manager/manager_members/members_directory/utils/ManagerMembersDirectoryDateFormatting';
import { maskManagerMemberPhone } from '@/app/frontend_manager/manager_members/members_directory/utils/ManagerMembersDirectoryPrivacy';
import { Award, CheckCircle, Clock, ExternalLink, FileText, Mail, MapPin, Phone, ShieldCheck } from 'lucide-react';

export function ManagerMembersDirectoryProfileContactGrid({
  member,
  locale,
  tManagerUi,
}: {
  member: ManagerMembersDirectoryRecord;
  locale: string;
  tManagerUi: (k: string) => string;
}) {
  return (
    <div className="pt-5 border-t border-border grid grid-cols-1 lg:grid-cols-2 gap-5 min-w-0">
      <div className="p-4 rounded-xl bg-card border border-border space-y-3 min-w-0">
        <p className="text-xs font-bold uppercase text-secondary tracking-wider">Contact & Location</p>
        <div className="space-y-2.5 text-xs sm:text-sm">
          <div className="flex items-center gap-2.5 text-secondary min-w-0">
            <Phone size={15} className="text-amber-400 shrink-0" />
            <span className="font-semibold text-primary">{maskManagerMemberPhone(member.phone)}</span>
          </div>
          <div className="flex items-center gap-2.5 text-secondary min-w-0">
            <Mail size={15} className="text-sky-400 shrink-0" />
            <span className="truncate text-primary" title={member.email || 'No email'}>{member.email || tManagerUi('no_email_provided')}</span>
          </div>
          <div className="flex items-start gap-2.5 text-secondary min-w-0">
            <MapPin size={15} className="text-rose-400 shrink-0 mt-0.5" />
            <span className="text-primary break-words">{member.address || tManagerUi('address_not_provided')}</span>
          </div>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-card border border-border flex flex-col justify-between gap-3 min-w-0">
        <p className="text-xs font-bold uppercase text-secondary tracking-wider">Membership Validity</p>
        <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
          <div className="bg-surface p-3 rounded-lg border border-border min-w-0">
            <span className="text-[11px] text-secondary font-medium block uppercase tracking-wider mb-1">{tManagerUi('joined')}</span>
            <span className="text-primary font-bold block truncate">{formatManagerMemberDirectoryCalendarDate(member.joinDate, locale)}</span>
          </div>
          <div className="bg-surface p-3 rounded-lg border border-border min-w-0">
            <span className="text-[11px] text-secondary font-medium block uppercase tracking-wider mb-1">{tManagerUi('expires')}</span>
            <span className="text-primary font-bold block truncate">{formatManagerMemberDirectoryCalendarDate(member.expiryDate, locale)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ManagerMembersDirectoryProfileKycAndRewards({
  referralPoints,
  referredBy,
  displayDocuments,
  onSelectDocPreview,
  tManagerUi,
}: {
  referralPoints: number;
  referredBy: string;
  displayDocuments: ManagerMembersDirectoryDocumentRecord[];
  onSelectDocPreview: (label: string) => void;
  tManagerUi: (k: string) => string;
}) {
  return (
    <>
      <div className="p-4 sm:p-5 rounded-2xl bg-card border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 min-w-0">
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-12 h-12 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-400 shrink-0 border border-amber-500/30">
            <Award size={24} />
          </div>
          <div className="min-w-0">
            <h4 className="font-bold text-primary flex items-center gap-2 flex-wrap">
              <span>{tManagerUi('referral_rewards')}</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                {referralPoints} {tManagerUi('points')}
              </span>
            </h4>
            <p className="text-xs text-secondary mt-0.5 truncate">
              {tManagerUi('referred_by')}: <span className="font-medium text-primary">{referredBy}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
          <span className="text-xs font-mono text-secondary px-3 py-1.5 rounded-lg bg-surface border border-border">
            {referralPoints > 0 ? 'Active Referral Contributor' : 'Standard Member'}
          </span>
        </div>
      </div>

      <div className="p-5 sm:p-6 rounded-2xl bg-floating border border-border min-w-0">
        <div className="flex items-center justify-between gap-2 mb-4 flex-wrap">
          <h4 className="font-bold text-primary flex items-center gap-2">
            <ShieldCheck size={20} className="text-emerald-400" />
            <span>{tManagerUi('kyc_documents')}</span>
          </h4>
          <span className="text-xs text-secondary">{displayDocuments.length} files attached</span>
        </div>
        {displayDocuments.length === 0 ? (
          <div className="p-6 rounded-xl bg-card border border-border text-center text-xs text-secondary">
            <FileText size={24} className="mx-auto text-secondary mb-2 opacity-50" />
            <p className="font-semibold text-primary">No KYC Documents Attached</p>
            <p className="mt-1">Member identity proof documents have not been uploaded to this account yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 min-w-0">
            {displayDocuments.map((doc) => (
              <div key={doc.id} className="p-4 rounded-xl bg-card border border-border flex flex-col justify-between gap-3 min-w-0">
                <div className="flex items-start justify-between gap-2 min-w-0">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText size={18} className="text-indigo-400 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-primary leading-tight truncate">{doc.type}</p>
                      <p className="text-xs text-secondary font-mono mt-0.5 truncate">{doc.number || doc.fileName}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold flex items-center gap-1 shrink-0 ${doc.status === 'Verified' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'}`}>
                    {doc.status === 'Verified' ? <CheckCircle size={12} /> : <Clock size={12} />}
                    <span>{doc.status === 'Verified' ? tManagerUi('verified') : tManagerUi('pending')}</span>
                  </span>
                </div>
                <div className="pt-2 border-t border-border flex items-center justify-between text-xs text-secondary gap-2">
                  <span className="truncate">{doc.uploadDate}</span>
                  <button
                    type="button"
                    onClick={() => onSelectDocPreview(`${doc.type}: ${doc.number || doc.fileName || 'Verified Document'}`)}
                    className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 text-xs cursor-pointer font-medium shrink-0"
                    title={tManagerUi('preview')}
                  >
                    <ExternalLink size={12} /> <span>{tManagerUi('preview')}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
