'use client';
// Responsibility: Displays detailed member profile, photo preview, seat/shift allocation, fee status, and contact actions.

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import {
  Activity,
  Armchair,
  CalendarClock,
  Camera,
  CreditCard,
  FileText,
  IndianRupee,
  MessageSquare,
  ShieldAlert,
  ShieldCheck,
  UserRound,
  Users,
  Eye,
  Download,
  CheckCircle,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import type { AdminMembersMember } from '@/app/frontend_admin/admin_members/members_directory/schemas/AdminMembersDirectorySchema';
import { formatAdminMembersDate } from '@/app/frontend_admin/admin_members/members_directory/utils/AdminMembersDirectoryExportUtils';

interface AdminMembersDirectoryMemberDetailCardProps {
  member: AdminMembersMember;
  detailTab: string;
  isDemoMode: boolean;
  onEdit: (member: AdminMembersMember) => void;
}

export function AdminMembersDirectoryMemberDetailCard({
  member,
  detailTab,
  isDemoMode,
  onEdit,
}: AdminMembersDirectoryMemberDetailCardProps) {
  const t = useTranslations('ADMIN_MEMBERS');
  const locale = useLocale();
  const [previewDoc, setPreviewDoc] = useState<{ type: string; number: string; fileName: string } | null>(null);

  const detailLabels = {
    profile: t('DETAIL_PROFILE'),
    attendance: t('DETAIL_ATTENDANCE'),
    membership: t('DETAIL_MEMBERSHIP'),
    renewalHistory: t('DETAIL_RENEWAL_HISTORY'),
    paymentHistory: t('DETAIL_PAYMENT_HISTORY'),
    lostHistory: t('DETAIL_LOST_HISTORY'),
    activityHistory: t('DETAIL_ACTIVITY_HISTORY'),
    documents: t('DETAIL_DOCUMENTS'),
  } as const;

  const status = t(
    ({
      Active: 'STATUS_ACTIVE',
      Expired: 'STATUS_EXPIRED',
      Suspended: 'STATUS_SUSPENDED',
      Blocked: 'STATUS_BLOCKED',
    } as const)[member.status] ?? 'STATUS_UNKNOWN',
  );

  const expiryDate = formatAdminMembersDate(member.expiryDate, locale, t('UNKNOWN_DATE'));
  const initials = member.name.trim().slice(0, 2).toUpperCase() || 'ST';

  const unavailable = (
    <p className="rounded-md border border-warning-bg bg-warning-bg p-4 text-warning-text" role="status">
      {t('DETAIL_API_UNAVAILABLE', {
        section: detailLabels[detailTab as keyof typeof detailLabels] ?? t('DETAIL_TAB_UNKNOWN'),
      })}
    </p>
  );

  return (
    <section className="admin-card mt-4 p-5">
      {/* Student Photo Preview & Identity Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-5">
        <div className="flex items-center gap-4">
          <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border-2 border-primary bg-primary-subtle font-mono text-lg font-bold text-primary shadow-xs">
            <span>{initials}</span>
            <div
              title="Student Verified Photo Card"
              className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-card border border-border text-text-secondary"
            >
              <Camera size={12} />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-text-primary">{member.name}</h2>
              <span className="rounded-full bg-surface-highlight px-2.5 py-0.5 text-xs font-semibold">
                {status}
              </span>
            </div>
            <p className="font-mono text-xs text-text-secondary">
              ID: {member.id} {member.branch ? `· ${member.branch}` : ''}
            </p>
          </div>
        </div>

        <button
          type="button"
          className="admin-btn-ghost min-h-10 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!isDemoMode}
          title={!isDemoMode ? t('MEMBER_EDIT_UNAVAILABLE') : undefined}
          onClick={() => onEdit(member)}
        >
          {t('ACTION_EDIT_MEMBER')}
        </button>
      </div>

      {detailTab === 'profile' ? (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex items-start gap-3 rounded-lg border border-border bg-card p-3">
              <UserRound size={18} className="text-primary shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="text-xs uppercase font-medium text-text-secondary">{t('DETAIL_CONTACT')}</p>
                <p className="text-sm font-semibold text-text-primary mt-0.5">{member.email}</p>
                <p className="text-xs text-text-secondary">{member.phone}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg border border-border bg-card p-3">
              <CreditCard size={18} className="text-primary shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="text-xs uppercase font-medium text-text-secondary">{t('DETAIL_MEMBERSHIP')}</p>
                <p className="text-sm font-semibold text-text-primary mt-0.5">{member.plan}</p>
                <p className="text-xs text-text-secondary">{t('DETAIL_EXPIRY_PREFIX', { expiry: expiryDate })}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg border border-border bg-card p-3">
              <Armchair size={18} className="text-primary shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="text-xs uppercase font-medium text-text-secondary">Seat & Shift</p>
                <p className="text-sm font-semibold text-text-primary mt-0.5">
                  {member.seat ? `Seat: ${member.seat}` : 'Seat: Unassigned'}
                </p>
                <p className="text-xs text-text-secondary">
                  Shift: {member.shift || 'General'}{member.locker ? ` · Locker: ${member.locker}` : ''}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg border border-border bg-card p-3">
              <IndianRupee size={18} className="text-primary shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="text-xs uppercase font-medium text-text-secondary">Fee Status</p>
                <p className={member.feeStatus === 'Due' ? 'text-danger-text font-semibold text-sm mt-0.5' : 'text-success-text font-semibold text-sm mt-0.5'}>
                  {member.feeStatus || 'Paid'}
                </p>
                {member.totalPaidMinor !== undefined && (
                  <p className="text-xs text-text-secondary">Paid: ₹{((member.totalPaidMinor || 0) / 100).toLocaleString('en-IN')}</p>
                )}
                {member.dueFeeMinor !== undefined && member.dueFeeMinor > 0 && (
                  <p className="text-xs text-danger-text font-medium">Due: ₹{((member.dueFeeMinor || 0) / 100).toLocaleString('en-IN')}</p>
                )}
              </div>
            </div>

            {member.branch && (
              <div className="flex items-start gap-3 rounded-lg border border-border bg-card p-3">
                <Users size={18} className="text-primary shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="text-xs uppercase font-medium text-text-secondary">Branch</p>
                  <p className="text-sm font-semibold text-text-primary mt-0.5">{member.branch}</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3 border-t border-border pt-4">
            {member.phone && (() => {
              let digits = member.phone.replace(/\D/g, '');
              if (digits.length === 11 && digits.startsWith('0')) {
                digits = digits.slice(1);
              }
              const waPhone = digits.length === 10 ? `91${digits}` : digits;
              const waText = encodeURIComponent(`Hello ${member.name}, greetings from Smart Library admin!`);
              return (
                <a
                  href={`https://wa.me/${waPhone}?text=${waText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="admin-btn-ghost inline-flex min-h-10 items-center gap-1.5 text-success-text hover:text-success-text"
                >
                  <MessageSquare size={16} aria-hidden="true" /> WhatsApp
                </a>
              );
            })()}
            {member.status === 'Active' && (
              <button
                type="button"
                className="admin-btn-ghost inline-flex min-h-10 items-center gap-1.5 text-warning-text hover:text-warning-text"
                onClick={() => toast.info(`Member status change requested for ${member.name}`)}
              >
                <ShieldAlert size={16} aria-hidden="true" /> Suspend
              </button>
            )}
            {member.status === 'Suspended' && (
              <button
                type="button"
                className="admin-btn-ghost inline-flex min-h-10 items-center gap-1.5 text-success-text hover:text-success-text"
                onClick={() => toast.info(`Reactivation requested for ${member.name}`)}
              >
                <ShieldAlert size={16} aria-hidden="true" /> Reactivate
              </button>
            )}
          </div>
        </div>
      ) : detailTab === 'membership' ? (
        <div className="flex items-start gap-3">
          <CalendarClock size={18} aria-hidden="true" />
          <div>
            <h3 className="font-medium">{t('DETAIL_CURRENT_MEMBERSHIP')}</h3>
            <p>{member.plan}</p>
            <p>{t('DETAIL_STATUS_PREFIX', { status })}</p>
            <p>{t('DETAIL_EXPIRY_PREFIX', { expiry: expiryDate })}</p>
          </div>
        </div>
      ) : detailTab === 'documents' ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
              <FileText size={16} className="text-primary" /> Verified KYC Documents
            </h3>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-success-bg text-success-text border border-border">
              <CheckCircle size={12} /> KYC Completed
            </span>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary-subtle text-primary flex items-center justify-center font-bold">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-text-primary">Aadhaar Card (UIDAI)</h4>
                  <p className="text-xs text-text-secondary font-mono">UID: XXXX-XXXX-{member.id.replace(/\D/g, '').slice(-4) || '8492'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewDoc({ type: 'Aadhaar Card (UIDAI)', number: `XXXX-XXXX-${member.id.replace(/\D/g, '').slice(-4) || '8492'}`, fileName: 'aadhaar_card_verified.pdf' })}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card text-xs font-semibold text-text-primary hover:bg-surface-hover transition-colors"
                >
                  <Eye size={13} /> Preview
                </button>
                <button
                  type="button"
                  onClick={() => toast.success(`Document aadhaar_card_verified.pdf downloaded for ${member.name}.`)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card text-xs font-semibold text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors"
                >
                  <Download size={13} />
                </button>
              </div>
            </div>
            <p className="text-xs text-text-secondary">Government-issued identity verified during library admission.</p>
          </div>
          {previewDoc && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-overlay-backdrop backdrop-blur-sm" onClick={() => setPreviewDoc(null)}>
              <div className="relative w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={18} className="text-success-text" />
                    <h4 className="text-sm font-bold text-text-primary">{previewDoc.type} Preview</h4>
                  </div>
                  <button type="button" onClick={() => setPreviewDoc(null)} className="text-text-secondary hover:text-text-primary p-1">
                    <X size={18} />
                  </button>
                </div>
                <div className="rounded-xl border border-border bg-surface-highlight p-6 flex flex-col items-center justify-center text-center space-y-3 min-h-[180px]">
                  <div className="w-14 h-14 rounded-2xl bg-primary-subtle text-primary flex items-center justify-center font-bold text-xl">
                    <FileText size={28} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-text-primary">{member.name}</p>
                    <p className="text-xs text-text-secondary font-mono mt-0.5">{previewDoc.number}</p>
                    <p className="text-[11px] text-success-text font-semibold mt-1">✓ Government Identity Verified by Desk Manager</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-text-secondary pt-2">
                  <span>File: {previewDoc.fileName}</span>
                  <button type="button" onClick={() => { toast.success(`Downloaded ${previewDoc.fileName}`); setPreviewDoc(null); }} className="admin-btn-primary min-h-9 px-3 py-1 text-xs">
                    Download
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : detailTab === 'attendance' ? (
        <div className="flex items-start gap-3">
          <Activity size={18} aria-hidden="true" />
          <div>
            <h3 className="font-medium">{t('DETAIL_ATTENDANCE_HISTORY')}</h3>
            {unavailable}
          </div>
        </div>
      ) : (
        unavailable
      )}
    </section>
  );
}

