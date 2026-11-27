'use client';

import React from 'react';
import { Download, FileCheck, FileText, Lock, Paperclip, Plus, User, Zap } from 'lucide-react';
import { toast } from 'sonner';
import type {
  SuperadminSupportTicket,
  SuperadminSupportTicketAttachment,
  SuperadminSupportTicketEscalation,
  SuperadminSupportTicketPriority,
  SuperadminSupportTicketResolution,
} from '@/app/frontend_superadmin/superadmin_support/support_tickets/types/SuperadminSupportTicketsOverviewTypes';

interface SuperadminSupportTicketsDetailTabsProps {
  activeTab: 'internal_notes' | 'attachments' | 'sla_escalation';
  internalNotes: Array<{ id: string; author: string; timestamp: string; note: string }>;
  attachments: SuperadminSupportTicketAttachment[];
  newAttachmentName: string;
  setNewAttachmentName: (val: string) => void;
  onAddAttachment: () => void;
  tkt: SuperadminSupportTicket;
  priority: SuperadminSupportTicketPriority;
  escalation: SuperadminSupportTicketEscalation;
  resolution: SuperadminSupportTicketResolution;
  t: (key: string, values?: Record<string, string | number>) => string;
}

export default function SuperadminSupportTicketsDetailTabs({
  activeTab,
  internalNotes,
  attachments,
  newAttachmentName,
  setNewAttachmentName,
  onAddAttachment,
  tkt,
  priority,
  escalation,
  resolution,
  t,
}: SuperadminSupportTicketsDetailTabsProps) {
  return (
    <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-5 space-y-4">
      {/* TAB 2: CONFIDENTIAL INTERNAL NOTES */}
      {activeTab === 'internal_notes' && (
        <div className="space-y-4">
          <div className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-950/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lock size={15} className="text-amber-400" />
              <span className="text-xs font-bold text-amber-200">
                Confidential Internal Staff Notes (Hidden from Library Admin)
              </span>
            </div>
            <span className="text-[11px] text-amber-300/80 font-mono">Restricted Access</span>
          </div>

          <div className="space-y-3">
            {internalNotes.map((note) => (
              <div
                key={note.id}
                className="p-3.5 rounded-xl border border-amber-500/25 bg-[#120d04]/80 shadow-sm space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-amber-300 flex items-center gap-1.5">
                    <User size={12} />
                    {note.author}
                  </span>
                  <span className="text-slate-400 font-mono text-[11px]">{note.timestamp}</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">{note.note}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: ATTACHMENTS */}
      {activeTab === 'attachments' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-indigo-500/20">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <Paperclip size={15} className="text-sky-400" />
              <span>Attached Diagnostic Files & Logs</span>
            </h3>
          </div>

          <div className="p-3.5 rounded-xl border border-sky-500/25 bg-[#081524]/60 flex flex-col sm:flex-row items-center gap-3">
            <input maxLength={100}
              type="text"
              placeholder="Enter file name (e.g. gateway_trace.log, screenshot.png)"
              value={newAttachmentName}
              onChange={(e) => setNewAttachmentName(e.target.value)}
              className="flex-1 rounded-xl border border-sky-500/30 bg-slate-950 px-3.5 py-2 text-xs text-white placeholder:text-slate-500 outline-none w-full"
            />
            <button
              type="button"
              onClick={onAddAttachment}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-xs font-bold text-white motion-safe:transition-all cursor-pointer shrink-0"
            >
              <Plus size={14} />
              <span>{t('COPY.UPLOAD_ATTACHMENT')}</span>
            </button>
          </div>

          <div className="grid gap-2.5">
            {attachments.map((att, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/60 hover:border-sky-500/30 flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 rounded-lg bg-sky-500/15 text-sky-400">
                    <FileText size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-100 truncate">{att.name}</p>
                    <p className="text-[11px] text-slate-400">
                      {att.size} • Uploaded {att.uploadedAt}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => toast.success(`Simulated download of ${att.name}`)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-sky-500/30 bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 text-xs font-semibold motion-safe:transition-all cursor-pointer shrink-0"
                >
                  <Download size={12} />
                  <span>{t('COPY.DOWNLOAD_FILE')}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: SLA TRACKING & ESCALATION */}
      {activeTab === 'sla_escalation' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl border border-indigo-500/25 bg-slate-900/60">
              <span className="text-[11px] font-bold text-slate-400 block mb-1">Target SLA Duration</span>
              <span className="text-lg font-extrabold text-indigo-300 font-mono">{tkt.slaTargetHours || 4} Hours</span>
              <span className="text-[10px] text-slate-500 block mt-1">Based on priority {priority}</span>
            </div>

            <div className="p-3.5 rounded-xl border border-indigo-500/25 bg-slate-900/60">
              <span className="text-[11px] font-bold text-slate-400 block mb-1">Time Elapsed</span>
              <span className="text-lg font-extrabold text-slate-200 font-mono">{tkt.age}</span>
              <span className="text-[10px] text-slate-500 block mt-1">Opened {tkt.age} ago</span>
            </div>

            <div className="p-3.5 rounded-xl border border-indigo-500/25 bg-slate-900/60">
              <span className="text-[11px] font-bold text-slate-400 block mb-1">SLA Compliance State</span>
              <span className={`text-lg font-extrabold font-mono ${tkt.slaBreach ? 'text-rose-400' : 'text-emerald-400'}`}>
                {tkt.slaBreach ? 'BREACHED' : 'IN SPEC'}
              </span>
              <span className="text-[10px] text-slate-500 block mt-1">{tkt.slaRemaining || 'Nominal tracking'}</span>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-red-500/25 bg-[#140608]/70 space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-red-300 flex items-center gap-2">
                <Zap size={14} className="text-red-400" />
                <span>{t('COPY.ESCALATION_DETAILS')}</span>
              </h3>
              <span
                className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                  escalation.isEscalated ? 'bg-red-500/20 border-red-500/40 text-red-300' : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
              >
                {escalation.isEscalated ? 'Tier-2 Escalated' : 'Tier-1 Standard'}
              </span>
            </div>

            {escalation.isEscalated ? (
              <div className="space-y-1.5 text-xs text-slate-200">
                <p>
                  <strong>Escalated To:</strong> <span className="text-red-300">{escalation.escalatedTo}</span>
                </p>
                <p>
                  <strong>Escalated At:</strong> <span className="font-mono text-slate-400">{escalation.escalatedAt}</span>
                </p>
                <p>
                  <strong>Reason:</strong> <span>{escalation.reason}</span>
                </p>
              </div>
            ) : (
              <p className="text-xs text-slate-400">
                This ticket is currently managed under Tier-1 Support. Click &quot;Escalate Ticket&quot; above if specialized architecture, security, or payment ops intervention is required.
              </p>
            )}
          </div>

          {resolution.resolvedAt && (
            <div className="p-4 rounded-xl border border-emerald-500/25 bg-[#06140e]/70 space-y-2.5">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-2">
                  <FileCheck size={14} className="text-emerald-400" />
                  <span>{t('COPY.RESOLUTION_DETAILS')}</span>
                </h3>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/20 border border-emerald-500/40 text-emerald-300">
                  Resolved {resolution.resolvedAt}
                </span>
              </div>
              <div className="space-y-1.5 text-xs text-slate-200">
                <p>
                  <strong>Resolved By:</strong> <span className="text-emerald-300">{resolution.resolvedBy}</span>
                </p>
                <p>
                  <strong>Resolution Notes:</strong> <span>{resolution.notes}</span>
                </p>
                {resolution.rootCause && (
                  <p>
                    <strong>Root Cause:</strong> <span className="text-slate-400">{resolution.rootCause}</span>
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
