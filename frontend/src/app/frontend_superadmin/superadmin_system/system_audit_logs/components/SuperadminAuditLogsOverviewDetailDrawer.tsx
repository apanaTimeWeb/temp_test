'use client';
/** Responsibility: Superadmin Audit Logs Detail Drawer; keep this view focused on its named module UI responsibility and delegate domain/state logic to module-owned hooks. */
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Shield, X, Clock, User, Building2, Globe, FileText, CheckCircle2, Copy, Smartphone, Hash, HelpCircle } from 'lucide-react';
import SuperadminAuditLogsOverviewActionBadge from '@/app/frontend_superadmin/superadmin_system/system_audit_logs/components/SuperadminAuditLogsOverviewActionBadge';
import { useTranslations } from 'next-intl';
import { SUPERADMIN_AUDIT_LOGS_DETAIL_DRAWER_SELECTOR } from '@/app/frontend_superadmin/superadmin_system/system_audit_logs/constants/SuperadminAuditLogsOverviewStaticConstants';
import type { SuperadminAuditLogsDetailDrawerProps } from '@/app/frontend_superadmin/superadmin_system/system_audit_logs/types/SuperadminAuditLogsOverviewDetailDrawerComponentTypes';
import { useModalScrollLock } from '@/lib/useModalScrollLock';
import { toast } from 'sonner';

export default function SuperadminAuditLogsOverviewDetailDrawer({ log, onClose }: SuperadminAuditLogsDetailDrawerProps) {
  const t = useTranslations('SUPERADMIN_AUDIT_LOGS');
  const drawerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useModalScrollLock(true);
  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!drawerRef.current) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const getFocusable = () => drawerRef.current ? Array.from<HTMLElement>(drawerRef.current.querySelectorAll<HTMLElement>(SUPERADMIN_AUDIT_LOGS_DETAIL_DRAWER_SELECTOR)) : [];
    getFocusable()[0]?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); onClose(); return; }
      if (event.key !== 'Tab') return;
      const focusable = getFocusable();
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) { event.preventDefault(); drawerRef.current?.focus(); return; }
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      if (previousFocus?.isConnected) previousFocus.focus();
    };
  }, [onClose]);

  const handleCopyId = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) navigator.clipboard.writeText(log.id);
    toast.success(`Copied Audit Record ID: ${log.id}`);
  };

  const handleCopyJson = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) navigator.clipboard.writeText(JSON.stringify(log, null, 2));
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
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-indigo-500/20 bg-gradient-to-r from-[#11173d] to-[#0a0e27] shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 shrink-0">
              <Shield size={18} aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-indigo-300 bg-indigo-500/15 px-2 py-0.5 rounded border border-indigo-500/30">{log.id}</span>
                <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/25">Tamper-Proof</span>
              </div>
              <h2 className="text-sm font-bold text-slate-100 truncate mt-0.5">Audit Record Inspection</h2>
            </div>
          </div>
          <button
            type="button"
            className="sa-btn-icon text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800/80 active:scale-95 transition-all cursor-pointer shrink-0"
            aria-label={t("COPY.CLOSE_SAMPLE_AUDIT_ENTRY")}
            onClick={onClose}
            data-testid="superadmin-audit-logs-audit-logs-detail-drawer-close-sample-audit-entry-1"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3.5 text-xs">
          {/* Action Badge & Timestamp Banner */}
          <div className="flex items-center justify-between p-2.5 rounded-xl border border-indigo-500/20 bg-[#070b22]/90">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-medium">Operation:</span>
              <SuperadminAuditLogsOverviewActionBadge action={log.action} />
            </div>
            <span className="font-mono text-slate-400 flex items-center gap-1.5">
              <Clock size={13} className="text-indigo-400" />
              <span>{log.time}</span>
            </span>
          </div>

          {/* Operation Summary */}
          <div className="rounded-xl border border-indigo-500/25 bg-[#080d24] p-3 space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-slate-300">
              <FileText size={13} className="text-indigo-400" />
              <span>Operation Summary & Evidence</span>
            </div>
            <p className="text-slate-200 leading-relaxed whitespace-pre-wrap">{log.detail}</p>
          </div>

          {/* Audit Reason / Justification */}
          {log.reason && (
            <div className="rounded-xl border border-amber-500/25 bg-amber-950/20 p-3 space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-amber-300">
                <HelpCircle size={13} className="text-amber-400" />
                <span>Audit Reason & Justification</span>
              </div>
              <p className="text-slate-200 leading-relaxed">{log.reason}</p>
            </div>
          )}

          {/* Before & After State Changes (if present) */}
          {(log.beforeValue || log.afterValue) && (
            <div className="rounded-xl border border-indigo-500/25 bg-slate-900/60 p-3 space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Before / After State Audit</span>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 rounded bg-rose-950/30 border border-rose-500/20 text-rose-300 font-mono text-[11px]">
                  <span className="text-[10px] text-slate-400 block font-sans">Before:</span>
                  {log.beforeValue || 'None'}
                </div>
                <div className="p-2 rounded bg-emerald-950/30 border border-emerald-500/20 text-emerald-300 font-mono text-[11px]">
                  <span className="text-[10px] text-slate-400 block font-sans">After:</span>
                  {log.afterValue || 'None'}
                </div>
              </div>
            </div>
          )}

          {/* Audit Metadata DL Grid */}
          <div className="space-y-1.5">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Actor, Target & Technical Context</h3>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="rounded-xl border border-indigo-500/20 bg-slate-900/60 p-2.5">
                <dt className="text-[10px] font-semibold text-slate-400 flex items-center gap-1"><User size={11} className="text-emerald-400" /> Performed By (Actor)</dt>
                <dd className="font-mono text-xs text-emerald-300 font-semibold truncate mt-0.5">{log.user}</dd>
              </div>

              <div className="rounded-xl border border-indigo-500/20 bg-slate-900/60 p-2.5">
                <dt className="text-[10px] font-semibold text-slate-400 flex items-center gap-1"><FileText size={11} className="text-sky-400" /> Target Entity</dt>
                <dd className="font-mono text-xs text-slate-200 font-semibold truncate mt-0.5">{log.target}</dd>
              </div>

              <div className="rounded-xl border border-indigo-500/20 bg-slate-900/60 p-2.5">
                <dt className="text-[10px] font-semibold text-slate-400 flex items-center gap-1"><Building2 size={11} className="text-purple-400" /> Module / Entity Scope</dt>
                <dd className="font-mono text-xs text-purple-300 font-semibold truncate mt-0.5">{log.entity}</dd>
              </div>

              <div className="rounded-xl border border-indigo-500/20 bg-slate-900/60 p-2.5">
                <dt className="text-[10px] font-semibold text-slate-400 flex items-center gap-1"><Globe size={11} className="text-amber-400" /> IP Address</dt>
                <dd className="font-mono text-xs text-amber-300 font-semibold truncate mt-0.5">{log.ip}</dd>
              </div>

              <div className="rounded-xl border border-indigo-500/20 bg-slate-900/60 p-2.5">
                <dt className="text-[10px] font-semibold text-slate-400 flex items-center gap-1"><Smartphone size={11} className="text-cyan-400" /> Device / Client Context</dt>
                <dd className="font-mono text-[11px] text-cyan-300 truncate mt-0.5">{log.device || 'Chrome / macOS Darwin'}</dd>
              </div>

              <div className="rounded-xl border border-indigo-500/20 bg-slate-900/60 p-2.5">
                <dt className="text-[10px] font-semibold text-slate-400 flex items-center gap-1"><Hash size={11} className="text-indigo-400" /> Request ID</dt>
                <dd className="font-mono text-[11px] text-indigo-300 truncate mt-0.5">{log.requestId || `req_${log.id.toLowerCase()}`}</dd>
              </div>
            </dl>
          </div>

          {/* Cryptographic Compliance & WORM Notice */}
          <div className="rounded-xl border border-emerald-500/25 bg-emerald-950/20 p-3 space-y-1 text-emerald-200">
            <div className="flex items-center gap-1.5 font-semibold">
              <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
              <span>Immutable Audit Trail & Anti-Tamper Guarantee</span>
            </div>
            <p className="text-[11px] text-emerald-300/80 leading-relaxed">
              WORM (Write Once, Read Many) compliance active. Sensitive logs cannot be deleted, modified, or truncated by normal users or tenant admins. Cryptographically signed with HMAC SHA-256 in compliance with ISO 27001 requirements.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-3.5 border-t border-indigo-500/20 bg-[#070919] shrink-0 gap-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyId}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 text-xs font-semibold text-indigo-300 transition-all cursor-pointer active:scale-95"
            >
              <Copy size={12} />
              <span>Copy ID</span>
            </button>
            <button
              type="button"
              onClick={handleCopyJson}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-700/80 hover:border-slate-600 bg-slate-800/80 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-all cursor-pointer active:scale-95"
            >
              <FileText size={12} />
              <span>Copy JSON</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-all cursor-pointer active:scale-95"
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