'use client';
/** Responsibility: Superadmin Audit Logs Detail Drawer; keep this view focused on its named module UI responsibility and delegate domain/state logic to module-owned hooks. */
/** Data-Flow: owning feature event -> local dialog/confirmation state -> typed callback to the owning component; API writes remain contract-gated. */

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Shield, X, Clock, User, Building2, Globe, FileText, CheckCircle2, Copy } from 'lucide-react';
import SuperadminAuditLogsOverviewActionBadge from '@/app/frontend_superadmin/superadmin_system/system_audit_logs/components/SuperadminAuditLogsOverviewActionBadge';
import { useTranslations } from 'next-intl';
import { SUPERADMIN_AUDIT_LOGS_DETAIL_DRAWER_SELECTOR } from '@/app/frontend_superadmin/superadmin_system/system_audit_logs/constants/SuperadminAuditLogsOverviewStaticConstants';
import type { SuperadminAuditLogsDetailDrawerProps } from '@/app/frontend_superadmin/superadmin_system/system_audit_logs/types/SuperadminAuditLogsOverviewDetailDrawerComponentTypes';
import { useModalScrollLock } from '@/lib/useModalScrollLock';
import { toast } from 'sonner';

/**
 * Performs the superadmin audit logs overview detail drawer operation within audit logs; inputs and outputs follow the declared TypeScript contract.
 * @param parameter Input required by the declared feature contract. Declared type: SuperadminAuditLogsDetailDrawerProps.
 */
export default function SuperadminAuditLogsOverviewDetailDrawer({ log, onClose }: SuperadminAuditLogsDetailDrawerProps) {
  const t = useTranslations('SUPERADMIN_AUDIT_LOGS');
  const drawerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useModalScrollLock(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Effect contract: manage keyboard focus, Escape/Tab behavior, and focus restoration for the active dialog or drawer; dependency set [onClose] is the deliberate re-run boundary.
  useEffect(() => {
    if (!drawerRef.current) return;

    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const getFocusable = () => {
      if (!drawerRef.current) return [];
      return Array.from<HTMLElement>(drawerRef.current.querySelectorAll<HTMLElement>(SUPERADMIN_AUDIT_LOGS_DETAIL_DRAWER_SELECTOR));
    };
    getFocusable()[0]?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== 'Tab') return;
      const focusable = getFocusable();
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) {
        event.preventDefault();
        drawerRef.current?.focus();
        return;
      }
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      if (previousFocus?.isConnected) previousFocus.focus();
    };
  }, [onClose]);

  const handleCopyId = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(log.id);
    }
    toast.success(`Copied Audit Record ID: ${log.id}`);
  };

  const handleCopyJson = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(JSON.stringify(log, null, 2));
    }
    toast.success('Audit record payload copied to clipboard');
  };

  const drawerContent = (
    <div
      className="sa-panel-overlay fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex justify-end animate-in fade-in duration-200"
      role="presentation"
      onClick={onClose}
      data-testid="superadmin-superadmin-audit-logs-overview-detail-drawer-div-line-58"
    >
      <div className="sa-panel-backdrop sr-only" aria-hidden="true" />
      <div
        ref={drawerRef}
        className="sa-panel-drawer relative w-full max-w-lg bg-[#0a0e27] border-l border-indigo-500/30 text-white shadow-2xl shadow-black/90 h-full flex flex-col overflow-hidden animate-in slide-in-from-right duration-200 ease-out"
        role="dialog"
        aria-modal="true"
        aria-label={t("COPY.SAMPLE_AUDIT_ENTRY_ARIA_LABEL", { id: log.id })}
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
        data-testid="superadmin-superadmin-audit-logs-overview-detail-drawer-div-line-60"
      >
        {/* Header - Fixed Top Bar */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-indigo-500/20 bg-gradient-to-r from-[#11173d] to-[#0a0e27] shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 shrink-0">
              <Shield size={18} aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-indigo-300 bg-indigo-500/15 px-2 py-0.5 rounded border border-indigo-500/30">
                  {log.id}
                </span>
                <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/25">
                  Verified
                </span>
              </div>
              <h2 className="text-sm font-bold text-slate-100 truncate mt-0.5">
                Audit Record Inspection
              </h2>
            </div>
          </div>
          <button
            type="button"
            className="sa-btn-icon text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
            aria-label={t("COPY.CLOSE_SAMPLE_AUDIT_ENTRY")}
            onClick={onClose}
            data-testid="superadmin-audit-logs-audit-logs-detail-drawer-close-sample-audit-entry-1"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 space-y-4">
          {/* Action Badge & Timestamp Banner */}
          <div className="flex items-center justify-between p-3 rounded-xl border border-indigo-500/20 bg-[#070b22]/90">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">Operation:</span>
              <SuperadminAuditLogsOverviewActionBadge action={log.action} />
            </div>
            <span className="font-mono text-xs text-slate-400 flex items-center gap-1.5">
              <Clock size={13} className="text-indigo-400" />
              <span>{log.time}</span>
            </span>
          </div>

          {/* Detail Description Card */}
          <div className="sa-card rounded-xl border border-indigo-500/25 bg-[#080d24] p-4 shadow-sm space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
              <FileText size={14} className="text-indigo-400" />
              <span>Operation Summary & Evidence</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
              {log.detail}
            </p>
          </div>

          {/* Audit Metadata DL Grid */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Actor & Target Metadata
            </h3>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="sa-panel-info-cell rounded-xl border border-border/80 bg-slate-900/60 p-3 space-y-1">
                <dt className="sa-panel-info-label text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
                  <Clock size={12} className="text-indigo-400" />
                  <span>{t("COPY.TIMESTAMP")}</span>
                </dt>
                <dd className="sa-panel-info-value--mono font-mono text-xs text-slate-200 font-semibold truncate">
                  {log.time}
                </dd>
              </div>

              <div className="sa-panel-info-cell rounded-xl border border-border/80 bg-slate-900/60 p-3 space-y-1">
                <dt className="sa-panel-info-label text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
                  <User size={12} className="text-emerald-400" />
                  <span>{t("COPY.PERFORMED_BY")}</span>
                </dt>
                <dd className="sa-panel-info-value--mono font-mono text-xs text-emerald-300 font-semibold truncate">
                  {log.user}
                </dd>
              </div>

              <div className="sa-panel-info-cell rounded-xl border border-border/80 bg-slate-900/60 p-3 space-y-1">
                <dt className="sa-panel-info-label text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
                  <Building2 size={12} className="text-purple-400" />
                  <span>{t("COPY.ENTITY")}</span>
                </dt>
                <dd className="sa-panel-info-value--mono font-mono text-xs text-purple-300 font-semibold truncate">
                  {log.entity}
                </dd>
              </div>

              <div className="sa-panel-info-cell rounded-xl border border-border/80 bg-slate-900/60 p-3 space-y-1">
                <dt className="sa-panel-info-label text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
                  <FileText size={12} className="text-sky-400" />
                  <span>{t("COPY.TARGET")}</span>
                </dt>
                <dd className="sa-panel-info-value--mono font-mono text-xs text-slate-200 font-semibold truncate">
                  {log.target}
                </dd>
              </div>

              <div className="sa-panel-info-cell rounded-xl border border-border/80 bg-slate-900/60 p-3 space-y-1">
                <dt className="sa-panel-info-label text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
                  <Globe size={12} className="text-amber-400" />
                  <span>{t("COPY.IP_ADDRESS")}</span>
                </dt>
                <dd className="sa-panel-info-value--mono font-mono text-xs text-amber-300 font-semibold truncate">
                  {log.ip}
                </dd>
              </div>

              <div className="sa-panel-info-cell rounded-xl border border-border/80 bg-slate-900/60 p-3 space-y-1">
                <dt className="sa-panel-info-label text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
                  <CheckCircle2 size={12} className="text-teal-400" />
                  <span>{t("COPY.ACTION")}</span>
                </dt>
                <dd className="sa-panel-info-value--mono font-mono text-xs text-slate-200 font-semibold truncate">
                  {log.action}
                </dd>
              </div>
            </dl>
          </div>

          {/* Cryptographic Compliance Notice */}
          <div className="rounded-xl border border-emerald-500/25 bg-emerald-950/20 p-3.5 space-y-1 text-xs text-emerald-200">
            <div className="flex items-center gap-2 font-semibold">
              <CheckCircle2 size={14} className="text-emerald-400" />
              <span>Immutable Audit Trail Compliance</span>
            </div>
            <p className="text-[11px] text-emerald-300/80 leading-relaxed">
              Every audit record is cryptographically signed with HMAC SHA-256 and stored in tamper-proof append-only storage in compliance with ISO 27001 requirements.
            </p>
          </div>
        </div>

        {/* Footer - Fixed Bottom Actions */}
        <div className="flex items-center justify-between p-4 border-t border-indigo-500/20 bg-[#070919] shrink-0 gap-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyId}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 text-xs font-semibold text-indigo-300 transition-colors cursor-pointer"
            >
              <Copy size={12} />
              <span>Copy ID</span>
            </button>
            <button
              type="button"
              onClick={handleCopyJson}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 hover:border-slate-600 bg-slate-800/60 hover:bg-slate-800 text-xs font-semibold text-slate-300 transition-colors cursor-pointer"
            >
              <FileText size={12} />
              <span>Copy JSON</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors cursor-pointer active:scale-[0.97]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );

  if (!mounted || typeof document === 'undefined') return null;
  return createPortal(drawerContent, document.body);
}
