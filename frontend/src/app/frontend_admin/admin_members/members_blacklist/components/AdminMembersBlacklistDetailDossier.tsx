'use client';

import type { AdminBlacklistRecord } from '@/app/frontend_admin/admin_members/members_blacklist/types/AdminMembersBlacklistTypes';
import {
  formatAdminBlacklistDate,
  openBlacklistWhatsAppNotice,
  printDisciplinaryMemoHtml,
} from '@/app/frontend_admin/admin_members/members_blacklist/utils/adminMembersBlacklistExports';
import { AlertTriangle, Lock, MessageSquare, Printer, RotateCcw, ShieldAlert, ShieldCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface AdminMembersBlacklistDetailDossierProps {
  record: AdminBlacklistRecord;
  locale: string;
  isDemoMode: boolean;
  onPardon: (record: AdminBlacklistRecord) => void;
  onClose: () => void;
}

export function AdminMembersBlacklistDetailDossier({
  record,
  locale,
  isDemoMode,
  onPardon,
  onClose,
}: AdminMembersBlacklistDetailDossierProps) {
  const t = useTranslations('ADMIN_BLACKLIST');
  const isNetwork = record.banScope === 'NETWORK_WIDE' || !record.banScope;
  const isPardoned = record.status === 'Pardoned';

  return (
    <section
      className="rounded-2xl border border-danger bg-card p-5 md:p-6 shadow-card space-y-4"
      aria-labelledby="admin-blacklist-record-detail-title"
      aria-live="polite"
    >
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 id="admin-blacklist-record-detail-title" className="text-lg font-bold text-text-primary tracking-tight">
              {record.name}
            </h2>
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold border ${
                isPardoned ? 'bg-success-bg text-success-text border-success' : 'bg-danger-bg text-danger-text border-danger'
              }`}
            >
              {isPardoned ? <ShieldCheck size={12} aria-hidden="true" /> : <ShieldAlert size={12} aria-hidden="true" />}
              {record.status || 'Blacklisted'}
            </span>
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold border ${
                isNetwork ? 'bg-danger-bg text-danger-text border-danger' : 'bg-warning-bg text-warning-text border-warning'
              }`}
            >
              {isNetwork ? '🌐 Network-Wide Bar' : `🏢 ${record.branch || 'Branch Only'}`}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-surface-highlight px-2.5 py-0.5 text-xs font-medium text-text-secondary border border-border">
              {record.category || 'INDISCIPLINE_MISCONDUCT'}
            </span>
          </div>
          <p className="text-xs text-text-secondary font-mono">
            Phone: {record.phone} · Record Ref: {record.id} · Logged: {formatAdminBlacklistDate(record.blacklistedOn, locale)}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => printDisciplinaryMemoHtml(record)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-info bg-info-bg px-3 py-1.5 text-xs font-semibold text-info-text hover:opacity-90 motion-safe:transition-opacity shadow-card"
            title="Print Formal Disciplinary Memo"
          >
            <Printer size={14} aria-hidden="true" />
            <span>Print Expulsion Notice</span>
          </button>

          <button
            type="button"
            onClick={() => openBlacklistWhatsAppNotice(record)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-success bg-success-bg px-3 py-1.5 text-xs font-semibold text-success-text hover:opacity-90 motion-safe:transition-opacity shadow-card"
            title="Send Notice via WhatsApp"
          >
            <MessageSquare size={14} aria-hidden="true" />
            <span>WhatsApp Alert</span>
          </button>

          {!isPardoned && (
            <button
              type="button"
              disabled={!isDemoMode}
              onClick={() => onPardon(record)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-warning bg-warning-bg px-3 py-1.5 text-xs font-semibold text-warning-text hover:opacity-90 motion-safe:transition-opacity shadow-card disabled:opacity-40"
              title="Pardon student and revoke ban"
            >
              <RotateCcw size={14} aria-hidden="true" />
              <span>Pardon / Lift Ban</span>
            </button>
          )}

          <button
            type="button"
            className="min-h-8 rounded-xl border border-border bg-card px-3 py-1 text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-surface-hover motion-safe:transition-colors"
            onClick={onClose}
          >
            {t('DETAILS_CLOSE')}
          </button>
        </div>
      </div>

      <div
        className={`rounded-xl border p-3.5 text-xs flex items-start gap-3 ${
          isNetwork ? 'border-danger bg-danger-bg text-danger-text' : 'border-warning bg-warning-bg text-warning-text'
        }`}
      >
        <AlertTriangle size={18} className="shrink-0 mt-0.5" aria-hidden="true" />
        <div>
          <strong className="block font-bold">
            {isNetwork ? '🌐 Network-Wide Bar Enforced' : '🏢 Branch Bar Enforced'}
          </strong>
          <span>
            {isNetwork
              ? 'Student is strictly prohibited from admission, seat reservation, or turnstile entry across ALL smart library network branches.'
              : `Student is prohibited from entering ${record.branch || 'this branch'}.`}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="rounded-xl border border-border bg-surface-highlight p-3">
          <span className="text-[10px] uppercase font-bold text-text-secondary block tracking-wider">Sanctioning Officer</span>
          <span className="text-xs font-semibold text-text-primary mt-1 block">{record.blacklistedBy || 'Admin'}</span>
        </div>
        <div className="rounded-xl border border-border bg-surface-highlight p-3">
          <span className="text-[10px] uppercase font-bold text-text-secondary block tracking-wider">Vacated Seat</span>
          <span className="text-xs font-semibold text-text-primary mt-1 block">{record.previousSeat || 'None / Not Allocated'}</span>
        </div>
        <div className="rounded-xl border border-border bg-surface-highlight p-3">
          <span className="text-[10px] uppercase font-bold text-text-secondary block tracking-wider">Turnstile & QR Entry</span>
          <span className="text-xs font-semibold text-danger-text mt-1 flex items-center gap-1">
            <Lock size={12} aria-hidden="true" /> Permanently Blocked
          </span>
        </div>
        <div className="rounded-xl border border-border bg-surface-highlight p-3">
          <span className="text-[10px] uppercase font-bold text-text-secondary block tracking-wider">Ban Duration</span>
          <span className="text-xs font-semibold text-warning-text mt-1 block">{record.banDuration || 'Permanent'}</span>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-surface-highlight p-4 space-y-2">
        <span className="text-xs uppercase font-bold text-text-secondary tracking-wider block">Incident Description & Findings</span>
        <p className="text-xs text-text-primary leading-relaxed font-sans">{record.reason}</p>
        {record.firRefNo && (
          <div className="pt-2 text-xs text-danger-text font-mono">
            <strong>Police / FIR Reference:</strong> {record.firRefNo}
          </div>
        )}
        {record.pardonReason && (
          <div className="mt-3 rounded-lg border border-success bg-success-bg p-3 text-xs text-success-text">
            <strong>Reinstatement / Pardon Record:</strong> {record.pardonReason}
            <span className="block mt-1 text-[11px] opacity-80">Approved by {record.pardonedBy} on {record.pardonDate}</span>
          </div>
        )}
      </div>
    </section>
  );
}
