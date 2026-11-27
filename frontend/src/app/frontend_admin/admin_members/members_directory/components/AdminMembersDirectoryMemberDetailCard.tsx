'use client';
// Responsibility: Displays comprehensive member profile with tabs for Profile, Attendance, Membership, Renewal, Payments, Lost/Damaged, Activity, and Documents.

import { AdminMembersDirectoryDetailModals } from '@/app/frontend_admin/admin_members/members_directory/components/AdminMembersDirectoryDetailModals';
import { AdminMembersDirectoryDetailOperationsTabs } from '@/app/frontend_admin/admin_members/members_directory/components/AdminMembersDirectoryDetailOperationsTabs';
import { AdminMembersDirectoryDetailPaymentTab } from '@/app/frontend_admin/admin_members/members_directory/components/AdminMembersDirectoryDetailPaymentTab';
import { AdminMembersDirectoryDetailProfileTab } from '@/app/frontend_admin/admin_members/members_directory/components/AdminMembersDirectoryDetailProfileTab';
import type { AdminMembersMember } from '@/app/frontend_admin/admin_members/members_directory/schemas/AdminMembersDirectorySchema';
import { formatAdminMembersDate } from '@/app/frontend_admin/admin_members/members_directory/utils/AdminMembersDirectoryExportUtils';
import {
  WAIVER_CATEGORY_LABELS,
  buildInitialMemberPayments,
  printMemberDossierHtml,
  type DocPreview,
  type MemberPaymentRecord,
  type ReceiptPreview,
  type WaiverCategory,
  type WaiverSlipPreview,
} from '@/app/frontend_admin/admin_members/members_directory/utils/adminMembersDirectoryDetailPrint';
import { Camera, Check, Copy, Mail, MessageSquare, Printer } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'sonner';

interface AdminMembersDirectoryMemberDetailCardProps {
  member: AdminMembersMember;
  detailTab: string;
  isDemoMode: boolean;
  onEdit?: (member: AdminMembersMember) => void;
  onSelectTab?: (tab: string) => void;
}

export function AdminMembersDirectoryMemberDetailCard({ member, detailTab, onSelectTab }: AdminMembersDirectoryMemberDetailCardProps) {
  const t = useTranslations('ADMIN_MEMBERS');
  const locale = useLocale();
  const [previewDoc, setPreviewDoc] = useState<DocPreview | null>(null);
  const [previewReceipt, setPreviewReceipt] = useState<ReceiptPreview | null>(null);
  const [attendanceMonth, setAttendanceMonth] = useState<'nov' | 'oct'>('nov');
  const [activityFilter, setActivityFilter] = useState<'all' | 'access' | 'billing' | 'admin'>('all');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const status = t(({ Active: 'STATUS_ACTIVE', Expired: 'STATUS_EXPIRED', Suspended: 'STATUS_SUSPENDED', Blocked: 'STATUS_BLOCKED' } as const)[member.status] ?? 'STATUS_UNKNOWN');
  const expiryDate = formatAdminMembersDate(member.expiryDate, locale, t('UNKNOWN_DATE'));
  const initials = member.name.trim().slice(0, 2).toUpperCase() || 'ST';
  const memberIdClean = member.id.replace(/\D/g, '') || '001';

  const [paymentRecords, setPaymentRecords] = useState<MemberPaymentRecord[]>(() => buildInitialMemberPayments(member, memberIdClean));
  const [showWaiverModal, setShowWaiverModal] = useState(false);
  const [waiverCategory, setWaiverCategory] = useState<WaiverCategory>('EWS_ASSISTANCE');
  const [waiverAmount, setWaiverAmount] = useState('1000');
  const [waiverReason, setWaiverReason] = useState('EWS verification completed by Admin; concession sanctioned.');
  const [previewWaiverSlip, setPreviewWaiverSlip] = useState<WaiverSlipPreview | null>(null);

  const totalWaivedAmount = paymentRecords.filter((p) => p.isWaiver).reduce((sum, p) => sum + (parseInt(p.amount.replace(/\D/g, ''), 10) || 0), 0);

  const copyToClipboard = (text: string, label: string) => {
    if (navigator?.clipboard) {
      void navigator.clipboard.writeText(text);
      setCopiedField(label);
      toast.success(`${label} copied to clipboard!`, { id: `admin-member-copy-${label}` });
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  const handleDirectWhatsApp = () => {
    const digits = member.phone.replace(/\D/g, '');
    const clean = digits.length === 11 && digits.startsWith('0') ? digits.slice(1) : digits;
    const phone = clean.length === 10 ? `91${clean}` : clean;
    const msg = encodeURIComponent(`Hello ${member.name}, greetings from Smart Library! We are contacting you regarding your library membership (ID: ${member.id}).`);
    const popup = window.open(`https://wa.me/${phone}?text=${msg}`, '_blank', 'noopener,noreferrer');
    if (popup) popup.opener = null;
  };

  const handleGrantWaiver = () => {
    const amt = parseInt(waiverAmount, 10);
    if (!amt || amt <= 0) {
      toast.error('Please enter a valid concession amount', { id: 'admin-member-waiver-invalid' });
      return;
    }
    const label = WAIVER_CATEGORY_LABELS[waiverCategory];
    const newWaiver: MemberPaymentRecord = {
      id: `WAV-2026-${memberIdClean}${Math.floor(10 + Math.random() * 89)}`,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      title: `Special Admin Credit: ${label}`,
      amount: `-₹${amt.toLocaleString('en-IN')}`,
      mode: 'Admin Credit Memo (Ref: ADM-AUTH)',
      ref: 'AUTH-SUPER-ADMIN',
      status: 'Approved by Admin',
      isWaiver: true,
      category: label,
      reason: waiverReason || 'Authorized under administrative powers',
    };
    setPaymentRecords((prev) => [newWaiver, ...prev]);
    setShowWaiverModal(false);
    toast.success(`Fee waiver of ₹${amt.toLocaleString('en-IN')} successfully authorized by Admin!`, { id: 'admin-member-waiver-success' });
    setPreviewWaiverSlip({ id: newWaiver.id, date: newWaiver.date, title: newWaiver.title, amount: `₹${amt.toLocaleString('en-IN')}`, category: label, reason: newWaiver.reason });
  };

  return (
    <section className="admin-card mt-4 p-5 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-5">
        <div className="flex items-center gap-4">
          <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border-2 border-primary bg-primary-subtle font-mono text-lg font-bold text-primary shadow-card">
            <span>{initials}</span>
            <div title="Student Verified Photo Card" className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-card border border-border text-text-secondary">
              <Camera size={12} aria-hidden="true" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-text-primary">{member.name}</h2>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold border ${member.status === 'Active' ? 'border-success bg-success-bg text-success-text' : member.status === 'Expired' ? 'border-danger bg-danger-bg text-danger-text' : 'border-warning bg-warning-bg text-warning-text'}`}>
                {status}
              </span>
            </div>
            <p className="font-mono text-xs text-text-secondary mt-0.5">ID: {member.id} {member.branch ? `· ${member.branch}` : ''} · Joined {member.joinDate || '01 Jan 2024'}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={handleDirectWhatsApp} className="inline-flex min-h-9 items-center gap-1.5 rounded-xl border border-success bg-success-bg px-3 py-1.5 text-xs font-semibold text-success-text hover:opacity-90 motion-safe:transition-opacity shadow-card" title="Chat directly with student on WhatsApp">
            <MessageSquare size={14} aria-hidden="true" /> <span>WhatsApp</span>
          </button>
          {member.email && (
            <a href={`mailto:${member.email}?subject=${encodeURIComponent('Smart Library Membership Update')}&body=${encodeURIComponent(`Dear ${member.name},\n\n`)}`} className="inline-flex min-h-9 items-center gap-1.5 rounded-xl border border-border bg-purple-bg px-3 py-1.5 text-xs font-semibold text-purple hover:opacity-90 motion-safe:transition-opacity shadow-card" title={`Send Email directly to ${member.name}`}>
              <Mail size={14} aria-hidden="true" /> <span>Email</span>
            </a>
          )}
          <button type="button" onClick={() => copyToClipboard(member.phone, 'Phone number')} className="inline-flex min-h-9 items-center gap-1.5 rounded-xl border border-border bg-surface-highlight px-3 py-1.5 text-xs font-medium text-text-primary hover:bg-surface-hover motion-safe:transition-colors" title="Copy Phone Number">
            {copiedField === 'Phone number' ? <Check size={13} className="text-success-text" aria-hidden="true" /> : <Copy size={13} className="text-text-secondary" aria-hidden="true" />} <span>Copy Phone</span>
          </button>
          <button type="button" onClick={() => copyToClipboard(member.email, 'Email address')} className="inline-flex min-h-9 items-center gap-1.5 rounded-xl border border-border bg-surface-highlight px-3 py-1.5 text-xs font-medium text-text-primary hover:bg-surface-hover motion-safe:transition-colors" title="Copy Email Address">
            {copiedField === 'Email address' ? <Check size={13} className="text-success-text" aria-hidden="true" /> : <Mail size={13} className="text-text-secondary" aria-hidden="true" />} <span>Copy Email</span>
          </button>
          <button type="button" onClick={() => printMemberDossierHtml(member)} className="inline-flex min-h-9 items-center gap-1.5 rounded-xl border border-info bg-info-bg px-3 py-1.5 text-xs font-medium text-info-text hover:opacity-90 motion-safe:transition-opacity" title="Print Member Dossier">
            <Printer size={13} aria-hidden="true" /> <span>Print Dossier</span>
          </button>
        </div>
      </div>

      {detailTab === 'profile' && <AdminMembersDirectoryDetailProfileTab member={member} status={status} expiryDate={expiryDate} memberIdClean={memberIdClean} onSelectTab={onSelectTab} onPreviewDoc={setPreviewDoc} />}
      {detailTab === 'paymentHistory' && <AdminMembersDirectoryDetailPaymentTab member={member} paymentRecords={paymentRecords} totalWaivedAmount={totalWaivedAmount} onOpenWaiverModal={() => setShowWaiverModal(true)} onPreviewWaiverSlip={setPreviewWaiverSlip} onPreviewReceipt={setPreviewReceipt} />}
      {detailTab !== 'profile' && detailTab !== 'paymentHistory' && <AdminMembersDirectoryDetailOperationsTabs detailTab={detailTab} member={member} expiryDate={expiryDate} memberIdClean={memberIdClean} attendanceMonth={attendanceMonth} onChangeAttendanceMonth={setAttendanceMonth} activityFilter={activityFilter} onChangeActivityFilter={setActivityFilter} onPreviewReceipt={setPreviewReceipt} onPreviewDoc={setPreviewDoc} />}

      <AdminMembersDirectoryDetailModals member={member} previewDoc={previewDoc} onCloseDoc={() => setPreviewDoc(null)} previewReceipt={previewReceipt} onCloseReceipt={() => setPreviewReceipt(null)} showWaiverModal={showWaiverModal} onCloseWaiverModal={() => setShowWaiverModal(false)} waiverCategory={waiverCategory} onChangeWaiverCategory={setWaiverCategory} waiverAmount={waiverAmount} onChangeWaiverAmount={setWaiverAmount} waiverReason={waiverReason} onChangeWaiverReason={setWaiverReason} onGrantWaiver={handleGrantWaiver} previewWaiverSlip={previewWaiverSlip} onCloseWaiverSlip={() => setPreviewWaiverSlip(null)} />
    </section>
  );
}
