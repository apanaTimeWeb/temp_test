'use client';
// Responsibility: Displays detailed member profile, photo preview, seat/shift allocation, fee status, and contact actions.

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
  UserRound,
  Users,
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
            {member.phone && (
              <a
                href={`https://wa.me/${member.phone.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="admin-btn-ghost inline-flex min-h-10 items-center gap-1.5 text-success-text hover:text-success-text"
              >
                <MessageSquare size={16} aria-hidden="true" /> WhatsApp
              </a>
            )}
            {member.status === 'Active' && (
              <button
                type="button"
                className="admin-btn-ghost inline-flex min-h-10 items-center gap-1.5 text-warning-text hover:text-warning-text"
                onClick={() => toast.info(`Member status change requested for ${member.name}`)}
              >
                <ShieldAlert size={16} aria-hidden="true" /> Suspend
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
        <div className="flex items-start gap-3">
          <FileText size={18} aria-hidden="true" />
          <div>
            <h3 className="font-medium">{t('DETAIL_MEMBER_DOCUMENTS')}</h3>
            {unavailable}
          </div>
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

