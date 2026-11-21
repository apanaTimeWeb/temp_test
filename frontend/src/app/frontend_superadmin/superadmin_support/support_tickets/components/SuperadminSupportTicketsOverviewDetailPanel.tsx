'use client';

import { useSuperadminSupportTicketsOverviewConfirm } from '@/app/frontend_superadmin/superadmin_support/support_tickets/hooks/useSuperadminSupportTicketsOverviewConfirm';
import { useModalScrollLock } from '@/lib/useModalScrollLock';
/** Responsibility: Superadmin Support Tickets Detail Panel; keep this view focused on its named module UI responsibility and delegate domain/state logic to module-owned hooks. */
/** Data-Flow: leaf-owned props or hook state -> SuperadminSupportTicketsOverviewDetailPanel formatting/filtering -> accessible feature presentation; persistence stays at the leaf API boundary. */
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Clock,
  X,
  Send,
  Paperclip,
  User,
  HelpCircle,
  Bug,
  CreditCard,
  Lock,
  Flag,
  Check,
  MessageSquare,
  ShieldCheck,
  ShieldAlert,
  Building2,
  Headphones,
  AlertTriangle,
  RotateCcw,
  Zap,
  TrendingUp,
  Database,
  Key,
  Sparkles,
  Wrench,
  Download,
  Plus,
  Timer,
  CheckCircle2,
  FileText,
  FileCheck,
} from 'lucide-react';
import type {
  SuperadminSupportTicket,
  SuperadminSupportTicketsDetailPanelProps,
  SuperadminSupportTicketMessage,
  SuperadminSupportTicketAttachment,
  SuperadminSupportTicketStatus,
  SuperadminSupportTicketPriority,
  SuperadminSupportTicketEscalation,
  SuperadminSupportTicketResolution,
  SuperadminSupportTimeLimitedAccess,
} from '@/app/frontend_superadmin/superadmin_support/support_tickets/types/SuperadminSupportTicketsOverviewTypes';
import {
  SUPERADMIN_SUPPORT_TICKETS_ASSIGNEE_OPTIONS,
  SUPERADMIN_SUPPORT_ESCALATION_TIERS,
  SUPERADMIN_SUPPORT_ACCESS_DURATIONS,
} from '@/app/frontend_superadmin/superadmin_support/support_tickets/constants/SuperadminSupportTicketsOverviewConstants';
import { useTranslations } from 'next-intl';
import { SUPERADMIN_SUPPORT_TICKETS_DETAIL_PANEL_SELECTOR } from '@/app/frontend_superadmin/superadmin_support/support_tickets/constants/SuperadminSupportTicketsOverviewStaticConstants';
import { toast } from 'sonner';

export default function SuperadminSupportTicketsOverviewDetailPanel({
  tkt,
  onClose,
  onSave,
}: SuperadminSupportTicketsDetailPanelProps) {
  const confirm = useSuperadminSupportTicketsOverviewConfirm();
  const t = useTranslations('SUPERADMIN_SUPPORT_TICKETS');

  const [status, setStatus] = useState<SuperadminSupportTicketStatus>(tkt.status);
  const [priority, setPriority] = useState<SuperadminSupportTicketPriority>(tkt.priority);
  const [assignee, setAssignee] = useState(tkt.assignee);
  const [activeTab, setActiveTab] = useState<'conversation' | 'internal_notes' | 'attachments' | 'sla_escalation' | 'privacy_shield'>('conversation');

  // Conversation and replies
  const [replyText, setReplyText] = useState('');
  const [isInternalNote, setIsInternalNote] = useState(false);
  const [operationMessage, setOperationMessage] = useState('');

  // Rich State
  const [messages, setMessages] = useState<SuperadminSupportTicketMessage[]>(() => {
    if (tkt.messages && tkt.messages.length > 0) return tkt.messages;
    const initialMsgs: SuperadminSupportTicketMessage[] = [
      {
        id: `msg-${tkt.id}-inbound`,
        sender: tkt.contact || tkt.tenant,
        role: 'tenant_admin',
        timestamp: `${tkt.age} ago`,
        text: tkt.desc,
      },
    ];
    if (tkt.replies > 0 || tkt.status === 'In-Progress' || tkt.status === 'Resolved') {
      initialMsgs.push({
        id: `msg-${tkt.id}-staff`,
        sender: tkt.assignee !== 'Unassigned' ? tkt.assignee : 'Support Staff',
        role: 'support_agent',
        timestamp: `${tkt.age} ago`,
        text: tkt.status === 'Resolved'
          ? 'The reported issue has been diagnosed, rectified, and validated on the cluster.'
          : 'We are actively investigating this report with our technical team.',
      });
    }
    return initialMsgs;
  });

  const [internalNotes, setInternalNotes] = useState<Array<{ id: string; author: string; timestamp: string; note: string }>>(() => {
    return tkt.internalNotes || [
      {
        id: `note-${tkt.id}-default`,
        author: 'Platform Ops',
        timestamp: `${tkt.age} ago`,
        note: `Ticket opened with priority ${tkt.priority} under category ${tkt.category}. Initial triage completed.`,
      },
    ];
  });

  const [attachments, setAttachments] = useState<SuperadminSupportTicketAttachment[]>(() => {
    if (tkt.attachmentsList && tkt.attachmentsList.length > 0) return tkt.attachmentsList;
    if (tkt.hasAttachment) {
      return [{ name: `${tkt.id.toLowerCase()}_diagnostic_evidence.pdf`, size: '1.2 MB', type: 'application/pdf', uploadedAt: `${tkt.age} ago` }];
    }
    return [];
  });

  const [escalation, setEscalation] = useState<SuperadminSupportTicketEscalation>(() => {
    return tkt.escalation || { isEscalated: tkt.status === 'Escalated' };
  });

  const [resolution, setResolution] = useState<SuperadminSupportTicketResolution>(() => {
    return tkt.resolution || {};
  });

  const [timeLimitedAccess, setTimeLimitedAccess] = useState<SuperadminSupportTimeLimitedAccess>(() => {
    return tkt.timeLimitedAccess || { hasActiveAccess: false };
  });

  // Modals state
  const [showEscalateModal, setShowEscalateModal] = useState(false);
  const [escalateTier, setEscalateTier] = useState<typeof SUPERADMIN_SUPPORT_ESCALATION_TIERS[number]>('Tier-2 Technical Specialist');
  const [escalateReason, setEscalateReason] = useState('');

  const [showResolveModal, setShowResolveModal] = useState(false);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [rootCause, setRootCause] = useState('');

  const [showReopenModal, setShowReopenModal] = useState(false);
  const [reopenReason, setReopenReason] = useState('');

  const [showGrantAccessModal, setShowGrantAccessModal] = useState(false);
  const [accessDuration, setAccessDuration] = useState<number>(30);
  const [accessScope, setAccessScope] = useState<'Read-Only Diagnostics' | 'Full Troubleshooting Mutation'>('Read-Only Diagnostics');
  const [accessJustification, setAccessJustification] = useState('');

  // Upload attachment state
  const [newAttachmentName, setNewAttachmentName] = useState('');

  useModalScrollLock(true);

  const dialogRef = useRef<HTMLDivElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const isDirty = status !== tkt.status || assignee !== tkt.assignee || priority !== tkt.priority || replyText.trim().length > 0;
  const isDirtyRef = useRef(isDirty);
  isDirtyRef.current = isDirty;

  const tRef = useRef(t);
  tRef.current = t;
  const requestClose = useCallback(async () => {
    if (isDirtyRef.current && !await confirm(tRef.current('COPY.UNSAVED_CHANGES_WARNING'))) return;
    onClose();
  }, [confirm, onClose]);

  useEffect(() => {
    previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const focusableElements = () =>
      Array.from<HTMLElement>(
        dialogRef.current?.querySelectorAll<HTMLElement>(SUPERADMIN_SUPPORT_TICKETS_DETAIL_PANEL_SELECTOR) ?? []
      ).filter((item) => item.offsetParent !== null);
    focusableElements()[0]?.focus();

    const handleDialogKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        requestClose();
        return;
      }
      if (event.key !== 'Tab') return;
      const items = focusableElements();
      if (!items.length) {
        event.preventDefault();
        dialogRef.current?.focus();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener('keydown', handleDialogKeyDown);
    return () => {
      document.removeEventListener('keydown', handleDialogKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [requestClose]);

  useEffect(() => {
    if (activeTab === 'conversation' && messagesEndRef.current && typeof messagesEndRef.current.scrollIntoView === 'function') {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, activeTab]);

  // Actions
  const handleSendReply = () => {
    if (!replyText.trim()) return;

    if (isInternalNote) {
      const newNote = {
        id: `note-${Date.now()}`,
        author: assignee !== 'Unassigned' ? assignee : 'SuperAdmin Staff',
        timestamp: 'Just now',
        note: replyText.trim(),
      };
      setInternalNotes((prev) => [newNote, ...prev]);
      setReplyText('');
      setOperationMessage('');
      toast.success('Internal confidential note added to ticket history');
    } else {
      const newMsg: SuperadminSupportTicketMessage = {
        id: `msg-${Date.now()}`,
        sender: assignee !== 'Unassigned' ? assignee : 'Support Staff',
        role: 'support_agent',
        timestamp: 'Just now',
        text: replyText.trim(),
      };
      setMessages((prev) => [...prev, newMsg]);
      setReplyText('');
      setOperationMessage('');
      toast.success(`Public reply dispatched to ${tkt.tenant}`);
    }
  };

  const handleEscalateSubmit = () => {
    if (!escalateReason.trim()) {
      toast.error('Please specify an escalation justification');
      return;
    }
    const esc: SuperadminSupportTicketEscalation = {
      isEscalated: true,
      escalatedTo: escalateTier,
      escalatedAt: 'Just now',
      escalatedBy: 'SuperAdmin Duty Officer',
      reason: escalateReason.trim(),
    };
    setEscalation(esc);
    setStatus('Escalated');
    setPriority('High');

    const sysMsg: SuperadminSupportTicketMessage = {
      id: `msg-esc-${Date.now()}`,
      sender: 'Escalation Dispatcher',
      role: 'system',
      timestamp: 'Just now',
      text: `Ticket escalated to ${escalateTier}. Justification: ${escalateReason.trim()}`,
    };
    setMessages((prev) => [...prev, sysMsg]);
    setShowEscalateModal(false);
    setEscalateReason('');
    toast.success(`Ticket escalated to ${escalateTier}`);
  };

  const handleResolveSubmit = () => {
    if (!resolutionNotes.trim()) {
      toast.error('Please enter resolution summary');
      return;
    }
    const res: SuperadminSupportTicketResolution = {
      resolvedAt: 'Just now',
      resolvedBy: assignee !== 'Unassigned' ? assignee : 'SuperAdmin Lead',
      notes: resolutionNotes.trim(),
      rootCause: rootCause.trim() || 'Software defect or configuration discrepancy resolved.',
    };
    setResolution(res);
    setStatus('Resolved');

    const sysMsg: SuperadminSupportTicketMessage = {
      id: `msg-res-${Date.now()}`,
      sender: 'Resolution Bot',
      role: 'system',
      timestamp: 'Just now',
      text: `Ticket resolved by ${res.resolvedBy}. Summary: ${resolutionNotes.trim()}`,
    };
    setMessages((prev) => [...prev, sysMsg]);
    setShowResolveModal(false);
    toast.success('Ticket marked as Resolved');
  };

  const handleReopenSubmit = () => {
    if (!reopenReason.trim()) {
      toast.error('Please state the reopen reason');
      return;
    }
    setStatus('Reopened');
    const sysMsg: SuperadminSupportTicketMessage = {
      id: `msg-reopen-${Date.now()}`,
      sender: 'Reopen Notice',
      role: 'system',
      timestamp: 'Just now',
      text: `Ticket reopened. Reason: ${reopenReason.trim()}`,
    };
    setMessages((prev) => [...prev, sysMsg]);
    setShowReopenModal(false);
    toast.info(`Ticket reopened: ${reopenReason.trim()}`);
  };

  const handleGrantAccessSubmit = () => {
    if (!accessJustification.trim()) {
      toast.error('A clear justification is required to grant time-limited access');
      return;
    }
    const auditToken = `AUD-SEC-${Math.floor(1000 + Math.random() * 9000)}`;
    const grant: SuperadminSupportTimeLimitedAccess = {
      hasActiveAccess: true,
      grantedTo: assignee !== 'Unassigned' ? assignee : 'Designated Support Specialist',
      grantedBy: 'SuperAdmin Security Policy Officer',
      scope: accessScope,
      justification: accessJustification.trim(),
      grantedAt: 'Just now',
      expiresAt: `${accessDuration}m remaining`,
      durationMinutes: accessDuration,
      auditId: auditToken,
    };
    setTimeLimitedAccess(grant);
    setShowGrantAccessModal(false);
    setAccessJustification('');
    toast.success(`Authorized: Time-limited support access granted for ${accessDuration}m (Audit #${auditToken})`);
  };

  const handleRevokeAccess = () => {
    setTimeLimitedAccess({ hasActiveAccess: false });
    toast.warning('Time-limited support access revoked. Member records re-shielded.');
  };

  const handleAddAttachment = () => {
    if (!newAttachmentName.trim()) {
      toast.error('Please enter attachment file name');
      return;
    }
    const newAtt: SuperadminSupportTicketAttachment = {
      name: newAttachmentName.trim(),
      size: '380 KB',
      type: newAttachmentName.endsWith('.pdf') ? 'application/pdf' : 'image/png',
      uploadedAt: 'Just now',
    };
    setAttachments((prev) => [newAtt, ...prev]);
    setNewAttachmentName('');
    toast.success(`Attached ${newAtt.name} to ticket`);
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Technical issue': return <Wrench size={13} className="text-sky-400" />;
      case 'Billing issue':
      case 'Billing': return <CreditCard size={13} className="text-emerald-400" />;
      case 'Branch creation request': return <Building2 size={13} className="text-indigo-400" />;
      case 'Plan upgrade request': return <TrendingUp size={13} className="text-purple-400" />;
      case 'Account access issue':
      case 'Account': return <Key size={13} className="text-amber-400" />;
      case 'Data correction request': return <Database size={13} className="text-rose-400" />;
      case 'Feature request': return <Sparkles size={13} className="text-teal-400" />;
      case 'Bug report':
      case 'Bug': return <Bug size={13} className="text-rose-400" />;
      case 'Security complaint': return <ShieldAlert size={13} className="text-red-400" />;
      default: return <HelpCircle size={13} className="text-indigo-400" />;
    }
  };

  return (
    <div
      className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-md flex justify-center items-center p-2 sm:p-4 md:p-6 overflow-hidden motion-safe:animate-in motion-safe:fade-in motion-reduce:animate-none"
      onClick={requestClose}
      data-testid="superadmin-superadmin-support-tickets-overview-detail-panel-div-line-72"
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="superadmin-support-ticket-detail-title"
        className="bg-[#0a0e27] border border-indigo-500/30 rounded-2xl shadow-2xl shadow-black/90 w-full max-w-5xl flex flex-col overflow-hidden text-slate-100 h-[92vh] max-h-[94vh] animate-in zoom-in-95 duration-200 ease-out"
        style={{ maxHeight: 'calc(100dvh - 32px)' }}
        onClick={(e) => e.stopPropagation()}
        data-testid="superadmin-superadmin-support-tickets-overview-detail-panel-div-line-73"
      >
        {/* Header - Fixed at Top */}
        <div className="p-5 sm:p-6 border-b border-indigo-500/20 bg-gradient-to-r from-[#11173d] via-[#0d1330] to-[#0a0e27] flex items-start justify-between gap-4 shrink-0">
          <div className="space-y-2.5 min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs font-bold text-indigo-300 bg-indigo-500/15 px-2.5 py-1 rounded-lg border border-indigo-500/30 shadow-xs">
                {tkt.id}
              </span>

              {/* Status Badge */}
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border shadow-xs ${
                  status === 'Resolved'
                    ? 'text-emerald-300 bg-emerald-500/15 border-emerald-500/30'
                    : status === 'Escalated'
                    ? 'text-red-300 bg-red-500/20 border-red-500/40 motion-safe:animate-pulse'
                    : status === 'Reopened'
                    ? 'text-purple-300 bg-purple-500/20 border-purple-500/40'
                    : status === 'Open'
                    ? 'text-rose-300 bg-rose-500/15 border-rose-500/30'
                    : 'text-amber-300 bg-amber-500/15 border-amber-500/30'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${status === 'Resolved' ? 'bg-emerald-400' : status === 'Escalated' ? 'bg-red-400' : status === 'Open' ? 'bg-rose-400' : 'bg-amber-400 animate-pulse'}`} />
                {status}
              </span>

              {/* Priority Badge & Selector */}
              <select
                aria-label={t("COPY.PRIORITY")}
                value={priority}
                onChange={(e) => setPriority(e.target.value as SuperadminSupportTicketPriority)}
                className={`text-xs font-bold px-2 py-0.5 rounded-full border shadow-xs bg-slate-900 cursor-pointer outline-none ${
                  priority === 'Urgent'
                    ? 'text-red-300 border-red-500/40'
                    : priority === 'High'
                    ? 'text-rose-300 border-rose-500/30'
                    : priority === 'Medium'
                    ? 'text-amber-300 border-amber-500/30'
                    : 'text-slate-300 border-slate-700/80'
                }`}
              >
                <option value="Urgent">Urgent Priority</option>
                <option value="High">High Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="Low">Low Priority</option>
              </select>

              {/* Category / Ticket Type Badge */}
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-medium text-xs">
                {getCategoryIcon(tkt.category)}
                <span>{tkt.category}</span>
              </span>

              {/* SLA Tracking Badge */}
              <span
                className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border shadow-xs ${
                  tkt.slaBreach
                    ? 'text-rose-300 bg-rose-500/15 border-rose-500/30 motion-safe:animate-pulse'
                    : 'text-emerald-300 bg-emerald-500/10 border-emerald-500/25'
                }`}
              >
                <Timer size={12} className={tkt.slaBreach ? 'text-rose-400' : 'text-emerald-400'} />
                <span>{tkt.slaBreach ? 'SLA Breached' : `SLA Target: ${tkt.slaTargetHours || 4}h (${tkt.slaRemaining || 'On Track'})`}</span>
              </span>
            </div>

            <h2 id="superadmin-support-ticket-detail-title" className="text-lg sm:text-xl font-bold text-slate-100 tracking-tight leading-snug">
              {tkt.subject}
            </h2>

            <div className="flex items-center gap-3 sm:gap-4 text-xs text-slate-400 flex-wrap pt-0.5">
              <span className="flex items-center gap-1.5 font-medium text-slate-300">
                <Building2 size={13} className="text-indigo-400 shrink-0" />
                <span className="text-slate-400">Tenant:</span>
                <strong className="text-slate-200">{tkt.tenant}</strong>
                {tkt.contact && <span className="text-slate-400">({tkt.contact})</span>}
              </span>
              <span className="text-slate-600 hidden sm:inline">•</span>
              <span className="flex items-center gap-1.5 font-medium text-slate-400">
                <Clock size={13} className="text-indigo-400 shrink-0" />
                <span>{t("COPY.OPENED")} {tkt.age} {t("COPY.AGO")}</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Escalate button */}
            {status !== 'Resolved' && status !== 'Closed' && (
              <button
                type="button"
                onClick={() => setShowEscalateModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-red-500/40 bg-red-500/15 hover:bg-red-500/25 text-red-300 text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-[0.97]"
                title={t("COPY.ESCALATE_TICKET")}
              >
                <Zap size={13} className="text-red-400" />
                <span className="hidden sm:inline">{t("COPY.ESCALATE_TICKET")}</span>
              </button>
            )}

            {/* Resolve or Reopen button */}
            {status === 'Resolved' || status === 'Closed' ? (
              <button
                type="button"
                onClick={() => setShowReopenModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-purple-500/40 bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-[0.97]"
                title={t("COPY.REOPEN_TICKET")}
              >
                <RotateCcw size={13} className="text-purple-400" />
                <span>{t("COPY.REOPEN_TICKET")}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setShowResolveModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-[0.97]"
                title={t("COPY.RESOLVE_TICKET")}
              >
                <CheckCircle2 size={13} className="text-emerald-400" />
                <span>{t("COPY.RESOLVE_TICKET")}</span>
              </button>
            )}

            {/* Close modal */}
            <button
              type="button"
              aria-label={t("COPY.CLOSE_TICKET_DETAILS")}
              className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800/80 border border-transparent hover:border-slate-700/80 transition-all cursor-pointer shrink-0"
              onClick={requestClose}
              data-testid="superadmin-support-tickets-support-tickets-detail-close-ticket-details-1"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Quick Controls Bar (Responsive 3-column toolbar: satisfying contract) - Fixed at Top */}
        <div className="px-5 sm:px-6 py-3 bg-[#080c21] border-b border-indigo-500/20 shrink-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 items-center">
            {/* Column 1: Assignee */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold shrink-0 flex items-center gap-1">
                <User size={12} className="text-indigo-400" />
                <span>{t("COPY.ASSIGNEE")}:</span>
              </span>
              <select
                aria-label={t("COPY.TICKET_ASSIGNEE_LOCAL_PREVIEW_ONLY")}
                className="flex-1 rounded-xl border border-indigo-500/30 bg-[#0a0f2c] px-3 py-1.5 text-xs font-semibold text-slate-200 outline-none hover:border-indigo-400 focus:border-indigo-400 transition-colors cursor-pointer shadow-xs"
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                data-testid="superadmin-support-tickets-support-tickets-detail-ticket-assignee-local-preview-only-2"
              >
                {SUPERADMIN_SUPPORT_TICKETS_ASSIGNEE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {/* Column 2: Status */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold shrink-0 flex items-center gap-1">
                <Clock size={12} className="text-emerald-400" />
                <span>{t("COPY.UPDATE_STATUS")}:</span>
              </span>
              <select
                aria-label={t("COPY.TICKET_STATUS_LOCAL_PREVIEW_ONLY")}
                className="flex-1 rounded-xl border border-indigo-500/30 bg-[#0a0f2c] px-3 py-1.5 text-xs font-semibold text-slate-200 outline-none hover:border-indigo-400 focus:border-indigo-400 transition-colors cursor-pointer shadow-xs"
                value={status}
                onChange={(e) => setStatus(e.target.value as SuperadminSupportTicketStatus)}
                data-testid="superadmin-support-tickets-support-tickets-detail-ticket-status-local-preview-only-3"
              >
                <option value="Open">{t("COPY.OPEN")}</option>
                <option value="In-Progress">{t("COPY.IN_PROGRESS")}</option>
                <option value="Escalated">Escalated</option>
                <option value="Resolved">{t("COPY.RESOLVED")}</option>
                <option value="Closed">Closed</option>
                <option value="Reopened">Reopened</option>
              </select>
            </div>

            {/* Column 3: Save button */}
            <div className="flex items-center justify-end sm:justify-start lg:justify-end gap-2">
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-md shadow-indigo-950/40 transition-all cursor-pointer active:scale-[0.97]"
                onClick={() => {
                  onSave({
                    ...tkt,
                    status,
                    assignee,
                    priority,
                    messages,
                    internalNotes,
                    attachmentsList: attachments,
                    escalation,
                    resolution,
                    timeLimitedAccess,
                  });
                  setOperationMessage(t('COPY.LOCAL_PREVIEW_APPLIED_MESSAGE'));
                  toast.success('Ticket preview state saved');
                }}
                data-testid="superadmin-support-tickets-support-tickets-detail-apply-local-preview-changes-4"
              >
                <Check size={13} />
                <span>{t("COPY.APPLY_LOCAL_PREVIEW_CHANGES")}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Member Privacy Shield & Authorized Time-Limited Support Access Banner */}
        <div className="px-5 sm:px-6 py-3 border-b border-indigo-500/20 bg-gradient-to-r from-[#070d24] via-[#09112e] to-[#070b22]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl border border-indigo-500/25 bg-[#05091c]/80">
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-xl border shrink-0 ${
                  timeLimitedAccess.hasActiveAccess
                    ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                    : 'bg-indigo-500/15 border-indigo-500/30 text-indigo-400'
                }`}
              >
                {timeLimitedAccess.hasActiveAccess ? <Timer size={18} className="animate-spin" /> : <ShieldCheck size={18} />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-100">{t("COPY.PRIVACY_SHIELD")}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      timeLimitedAccess.hasActiveAccess
                        ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                        : 'bg-indigo-500/20 border-indigo-500/30 text-indigo-300'
                    }`}
                  >
                    {timeLimitedAccess.hasActiveAccess ? `Elevated Access Active (${timeLimitedAccess.expiresAt})` : 'Zero-Trust Shield Enforced'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {timeLimitedAccess.hasActiveAccess
                    ? `Delegated to ${timeLimitedAccess.grantedTo} • Scope: ${timeLimitedAccess.scope} • Audit ID #${timeLimitedAccess.auditId}`
                    : 'Support employees are restricted from viewing library member personal records without explicit time-limited authorization.'}
                </p>
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-2">
              {timeLimitedAccess.hasActiveAccess ? (
                <button
                  type="button"
                  onClick={handleRevokeAccess}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-500/40 bg-red-500/15 hover:bg-red-500/25 text-red-300 text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-[0.97]"
                >
                  <Lock size={12} />
                  <span>{t("COPY.REVOKE_ACCESS")}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowGrantAccessModal(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-indigo-500/40 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-200 text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-[0.97]"
                >
                  <Key size={12} className="text-indigo-400" />
                  <span>{t("COPY.TIME_LIMITED_ACCESS")}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="px-5 sm:px-6 pt-3 pb-1 border-b border-indigo-500/15 bg-[#080c21] flex items-center gap-1.5 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('conversation')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap active:scale-[0.97] ${
              activeTab === 'conversation'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <MessageSquare size={13} />
            <span>{t("COPY.CONVERSATION_HISTORY")} ({messages.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('internal_notes')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap active:scale-[0.97] ${
              activeTab === 'internal_notes'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Lock size={13} />
            <span>{t("COPY.INTERNAL_NOTES")} ({internalNotes.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('attachments')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap active:scale-[0.97] ${
              activeTab === 'attachments'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Paperclip size={13} />
            <span>{t("COPY.ATTACHMENTS")} ({attachments.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('sla_escalation')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap active:scale-[0.97] ${
              activeTab === 'sla_escalation'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Timer size={13} />
            <span>{t("COPY.SLA_TRACKING")} & Escalation</span>
          </button>
        </div>

        {/* Content Body - Split between fixed conversation layout and scrollable secondary tabs */}
        {activeTab === 'conversation' ? (
          <div className="flex-1 min-h-0 flex flex-col p-4 sm:p-5 gap-3 overflow-hidden">
            {/* Messages Stream - Scrollable thread container */}
            <div className="flex-1 min-h-0 flex flex-col rounded-2xl border border-indigo-500/25 bg-[#070b22]/90 p-4 shadow-lg overflow-hidden">
              <div className="flex items-center justify-between pb-3 border-b border-indigo-500/15 shrink-0">
                <div className="flex items-center gap-2">
                  <MessageSquare size={16} className="text-indigo-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                    Helpdesk Message Stream
                  </h3>
                </div>
                <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                  <ShieldCheck size={13} className="text-emerald-400" /> End-to-end Audited Support Thread
                </span>
              </div>

              <div className="flex-1 min-h-0 overflow-y-auto space-y-3.5 pr-2 pt-3">
                {messages.map((msg) => {
                  const isStaff = msg.role === 'support_agent';
                  const isSystem = msg.role === 'system';

                  if (isSystem) {
                    return (
                      <div key={msg.id} className="flex items-center justify-center my-2">
                        <div className="px-3.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] text-slate-300 font-medium flex items-center gap-2">
                          <Zap size={11} className="text-amber-400 shrink-0" />
                          <span>{msg.text}</span>
                          <span className="text-slate-500 text-[10px]">• {msg.timestamp}</span>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={msg.id}
                      className={`flex items-start gap-3.5 ${isStaff ? 'flex-row-reverse' : ''}`}
                    >
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm font-bold text-xs ${
                          isStaff
                            ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-300'
                            : 'bg-indigo-500/20 border border-indigo-500/30 text-indigo-300'
                        }`}
                      >
                        {isStaff ? <Headphones size={16} /> : msg.sender.charAt(0)}
                      </div>

                      <div className={`flex-1 min-w-0 flex flex-col ${isStaff ? 'items-end' : 'items-start'}`}>
                        <div className={`flex items-center gap-2 mb-1 ${isStaff ? 'flex-row-reverse' : ''}`}>
                          <span className="text-xs font-bold text-slate-100">{msg.sender}</span>
                          <span
                            className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded ${
                              isStaff
                                ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30'
                                : 'bg-indigo-950/60 text-indigo-300 border border-indigo-500/30'
                            }`}
                          >
                            {isStaff ? 'Support Staff' : 'Library Admin'}
                          </span>
                          <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                        </div>

                        <div
                          className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-sm max-w-2xl ${
                            isStaff
                              ? 'bg-[#082218]/90 border border-emerald-500/30 rounded-tr-xs text-slate-100'
                              : 'bg-[#0e1538] border border-indigo-500/30 rounded-tl-xs text-slate-200'
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{msg.text}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Reply Composer Card - Fixed at Bottom & Always Visible */}
            <div className="shrink-0 rounded-2xl border border-indigo-500/25 bg-[#0b0f2a] p-3.5 sm:p-4 shadow-lg space-y-2.5">
              {operationMessage && (
                <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-2.5 text-xs text-amber-200 flex items-center gap-2" role="alert">
                  <span>{operationMessage}</span>
                </div>
              )}

              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-indigo-500/20">
                  <button
                    type="button"
                    aria-pressed={!isInternalNote}
                    className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 active:scale-[0.97] ${
                      !isInternalNote ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                    onClick={() => setIsInternalNote(false)}
                    data-testid="superadmin-support-tickets-support-tickets-detail-public-reply-5"
                  >
                    <Send size={12} />
                    <span>{t("COPY.PUBLIC_REPLY")}</span>
                  </button>
                  <button
                    type="button"
                    aria-pressed={isInternalNote}
                    className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 active:scale-[0.97] ${
                      isInternalNote ? 'bg-amber-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                    onClick={() => setIsInternalNote(true)}
                    data-testid="superadmin-support-tickets-support-tickets-detail-internal-note-hidden-6"
                  >
                    <Lock size={12} />
                    <span>{t("COPY.INTERNAL_NOTE_HIDDEN")}</span>
                  </button>
                </div>

                <span className="text-[11px] text-slate-400">
                  {isInternalNote ? '🔒 Visible only to platform team' : '✉️ Visible to library admin'}
                </span>
              </div>

              <div className={`relative rounded-xl border transition-colors ${isInternalNote ? 'border-amber-500/40 bg-amber-950/20 text-amber-200' : 'border-indigo-500/30 bg-[#070b22] text-slate-100'} p-3 shadow-inner`}>
                <label htmlFor="superadmin-support-ticket-reply-text" className="sr-only">
                  {isInternalNote ? t('COPY.INTERNAL_NOTE_TEXT') : t('COPY.PUBLIC_REPLY_TEXT')}
                </label>
                <textarea
                  id="superadmin-support-ticket-reply-text"
                  maxLength={5000}
                  rows={2}
                  className="w-full bg-transparent text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 outline-none resize-none min-h-[55px]"
                  placeholder={isInternalNote ? t('COPY.TYPE_PRIVATE_NOTE_PLACEHOLDER') : t('COPY.TYPE_REPLY_TO_TENANT_PLACEHOLDER')}
                  value={replyText}
                  onChange={(e) => {
                    setReplyText(e.target.value);
                    setOperationMessage('');
                  }}
                  data-testid="superadmin-support-tickets-support-tickets-detail-superadmin-support-ticket-reply-text-7"
                />
                <div className="flex items-center justify-between pt-2 border-t border-indigo-500/15 mt-1">
                  <button
                    type="button"
                    onClick={() => setActiveTab('attachments')}
                    aria-label={t("COPY.ATTACH_FILE_UNAVAILABLE")}
                    className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 cursor-pointer flex items-center gap-1.5 text-xs transition-colors"
                    data-testid="superadmin-support-tickets-support-tickets-detail-attach-file-unavailable-8"
                  >
                    <Paperclip size={14} />
                    <span className="text-[11px] hidden sm:inline">Attach diagnostics</span>
                  </button>

                  <button
                    type="button"
                    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md active:scale-[0.97] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                      isInternalNote
                        ? 'bg-amber-600 hover:bg-amber-500 text-white'
                        : 'bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white'
                    }`}
                    onClick={handleSendReply}
                    disabled={!replyText.trim()}
                    data-testid="superadmin-support-tickets-support-tickets-detail-add-note-9"
                  >
                    <Send size={13} />
                    <span>{isInternalNote ? t('COPY.ADD_NOTE') : t('COPY.SEND_REPLY')}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 min-h-0 overflow-y-auto p-5 sm:p-6 space-y-6">

          {/* TAB 2: CONFIDENTIAL INTERNAL NOTES */}
          {activeTab === 'internal_notes' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-950/20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lock size={16} className="text-amber-400" />
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
                    className="p-4 rounded-xl border border-amber-500/25 bg-[#120d04]/80 shadow-sm space-y-1.5"
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

              {/* Upload form */}
              <div className="p-4 rounded-xl border border-sky-500/25 bg-[#081524]/60 flex flex-col sm:flex-row items-center gap-3">
                <input
                  type="text"
                  placeholder="Enter file name (e.g. gateway_trace.log, screenshot.png)"
                  value={newAttachmentName}
                  onChange={(e) => setNewAttachmentName(e.target.value)}
                  className="flex-1 rounded-xl border border-sky-500/30 bg-slate-950 px-3.5 py-2 text-xs text-white placeholder:text-slate-500 outline-none w-full"
                />
                <button
                  type="button"
                  onClick={handleAddAttachment}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-xs font-bold text-white transition-all cursor-pointer shrink-0"
                >
                  <Plus size={14} />
                  <span>{t("COPY.UPLOAD_ATTACHMENT")}</span>
                </button>
              </div>

              {/* Attachments List */}
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
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-sky-500/30 bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 text-xs font-semibold transition-all cursor-pointer shrink-0"
                    >
                      <Download size={12} />
                      <span>{t("COPY.DOWNLOAD_FILE")}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: SLA TRACKING & ESCALATION */}
          {activeTab === 'sla_escalation' && (
            <div className="space-y-5">
              {/* SLA Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-xl border border-indigo-500/25 bg-slate-900/60">
                  <span className="text-[11px] font-bold text-slate-400 block mb-1">Target SLA Duration</span>
                  <span className="text-xl font-extrabold text-indigo-300 font-mono">{tkt.slaTargetHours || 4} Hours</span>
                  <span className="text-[10px] text-slate-500 block mt-1">Based on priority {priority}</span>
                </div>

                <div className="p-4 rounded-xl border border-indigo-500/25 bg-slate-900/60">
                  <span className="text-[11px] font-bold text-slate-400 block mb-1">Time Elapsed</span>
                  <span className="text-xl font-extrabold text-slate-200 font-mono">{tkt.age}</span>
                  <span className="text-[10px] text-slate-500 block mt-1">Opened {tkt.age} ago</span>
                </div>

                <div className="p-4 rounded-xl border border-indigo-500/25 bg-slate-900/60">
                  <span className="text-[11px] font-bold text-slate-400 block mb-1">SLA Compliance State</span>
                  <span
                    className={`text-xl font-extrabold font-mono ${
                      tkt.slaBreach ? 'text-rose-400' : 'text-emerald-400'
                    }`}
                  >
                    {tkt.slaBreach ? 'BREACHED' : 'IN SPEC'}
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-1">{tkt.slaRemaining || 'Nominal tracking'}</span>
                </div>
              </div>

              {/* Escalation Record */}
              <div className="p-5 rounded-2xl border border-red-500/25 bg-[#140608]/70 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-red-300 flex items-center gap-2">
                    <Zap size={15} className="text-red-400" />
                    <span>{t("COPY.ESCALATION_DETAILS")}</span>
                  </h3>
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                      escalation.isEscalated
                        ? 'bg-red-500/20 border-red-500/40 text-red-300'
                        : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}
                  >
                    {escalation.isEscalated ? 'Tier-2 Escalated' : 'Tier-1 Standard'}
                  </span>
                </div>

                {escalation.isEscalated ? (
                  <div className="space-y-2 text-xs text-slate-200">
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
                    This ticket is currently managed under Tier-1 Support. Click "Escalate Ticket" above if specialized architecture, security, or payment ops intervention is required.
                  </p>
                )}
              </div>

              {/* Resolution Record */}
              {resolution.resolvedAt && (
                <div className="p-5 rounded-2xl border border-emerald-500/25 bg-[#06140e]/70 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-2">
                      <FileCheck size={15} className="text-emerald-400" />
                      <span>{t("COPY.RESOLUTION_DETAILS")}</span>
                    </h3>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/20 border border-emerald-500/40 text-emerald-300">
                      Resolved {resolution.resolvedAt}
                    </span>
                  </div>
                  <div className="space-y-2 text-xs text-slate-200">
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
        )}
      </div>

      {/* Escalate Modal Dialog */}
      {showEscalateModal && (
        <div
          className="fixed inset-0 z-[80] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-hidden animate-in fade-in duration-150"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setShowEscalateModal(false);
          }}
        >
          <div className="bg-[#0e122b] border border-red-500/40 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl text-white animate-in zoom-in-95 duration-150 ease-out">
            <div className="flex items-center justify-between border-b border-red-500/20 pb-3">
              <h3 className="text-sm font-bold flex items-center gap-2 text-red-400">
                <Zap size={16} />
                <span>Escalate Support Ticket</span>
              </h3>
              <button type="button" onClick={() => setShowEscalateModal(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Target Escalation Tier</label>
                <select
                  value={escalateTier}
                  onChange={(e) => setEscalateTier(e.target.value as any)}
                  className="w-full rounded-xl border border-red-500/30 bg-slate-950 px-3 py-2 text-xs text-white outline-none cursor-pointer"
                >
                  {SUPERADMIN_SUPPORT_ESCALATION_TIERS.map((tier) => (
                    <option key={tier} value={tier}>
                      {tier}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Reason for Escalation *</label>
                <textarea
                  rows={3}
                  placeholder="Describe why standard Tier-1 resolution is blocked..."
                  value={escalateReason}
                  onChange={(e) => setEscalateReason(e.target.value)}
                  className="w-full rounded-xl border border-red-500/30 bg-slate-950 p-2.5 text-xs text-white outline-none resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowEscalateModal(false)}
                className="px-3.5 py-1.5 rounded-xl text-xs text-slate-400 hover:text-white active:scale-[0.97] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleEscalateSubmit}
                className="px-4 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-xs font-bold text-white shadow-md cursor-pointer active:scale-[0.97]"
              >
                Confirm Escalation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Resolve Modal Dialog */}
      {showResolveModal && (
        <div
          className="fixed inset-0 z-[80] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-hidden animate-in fade-in duration-150"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setShowResolveModal(false);
          }}
        >
          <div className="bg-[#0e122b] border border-emerald-500/40 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl text-white animate-in zoom-in-95 duration-150 ease-out">
            <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
              <h3 className="text-sm font-bold flex items-center gap-2 text-emerald-400">
                <CheckCircle2 size={16} />
                <span>Resolve Support Ticket</span>
              </h3>
              <button type="button" onClick={() => setShowResolveModal(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Resolution Summary *</label>
                <textarea
                  rows={3}
                  placeholder="Describe the fix or actions taken to resolve the tenant issue..."
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  className="w-full rounded-xl border border-emerald-500/30 bg-slate-950 p-2.5 text-xs text-white outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Root Cause Analysis</label>
                <input
                  type="text"
                  placeholder="e.g. Memory leak in background worker / Network gateway timeout"
                  value={rootCause}
                  onChange={(e) => setRootCause(e.target.value)}
                  className="w-full rounded-xl border border-emerald-500/30 bg-slate-950 px-3 py-2 text-xs text-white outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowResolveModal(false)}
                className="px-3.5 py-1.5 rounded-xl text-xs text-slate-400 hover:text-white active:scale-[0.97] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleResolveSubmit}
                className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-md cursor-pointer active:scale-[0.97]"
              >
                Mark as Resolved
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reopen Modal Dialog */}
      {showReopenModal && (
        <div
          className="fixed inset-0 z-[80] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-hidden animate-in fade-in duration-150"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setShowReopenModal(false);
          }}
        >
          <div className="bg-[#0e122b] border border-purple-500/40 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl text-white animate-in zoom-in-95 duration-150 ease-out">
            <div className="flex items-center justify-between border-b border-purple-500/20 pb-3">
              <h3 className="text-sm font-bold flex items-center gap-2 text-purple-400">
                <RotateCcw size={16} />
                <span>Reopen Ticket</span>
              </h3>
              <button type="button" onClick={() => setShowReopenModal(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Reason for Reopening *</label>
                <textarea
                  rows={3}
                  placeholder="Specify why the issue recurred or remains unresolved..."
                  value={reopenReason}
                  onChange={(e) => setReopenReason(e.target.value)}
                  className="w-full rounded-xl border border-purple-500/30 bg-slate-950 p-2.5 text-xs text-white outline-none resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowReopenModal(false)}
                className="px-3.5 py-1.5 rounded-xl text-xs text-slate-400 hover:text-white active:scale-[0.97] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReopenSubmit}
                className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white shadow-md cursor-pointer active:scale-[0.97]"
              >
                Reopen Ticket
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Grant Time-Limited Support Access Modal */}
      {showGrantAccessModal && (
        <div
          className="fixed inset-0 z-[80] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-hidden animate-in fade-in duration-150"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setShowGrantAccessModal(false);
          }}
        >
          <div className="bg-[#0a0e28] border border-indigo-500/40 rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-2xl text-white animate-in zoom-in-95 duration-150 ease-out">
            <div className="flex items-center justify-between border-b border-indigo-500/20 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300">
                  <Key size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-100">Authorize Time-Limited Support Access</h3>
                  <p className="text-[11px] text-slate-400">Zero-Trust elevated delegation for member record troubleshooting</p>
                </div>
              </div>
              <button type="button" onClick={() => setShowGrantAccessModal(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Access Lease Duration</label>
                <select
                  value={accessDuration}
                  onChange={(e) => setAccessDuration(Number(e.target.value))}
                  className="w-full rounded-xl border border-indigo-500/30 bg-slate-950 px-3 py-2 text-xs text-white outline-none cursor-pointer"
                >
                  {SUPERADMIN_SUPPORT_ACCESS_DURATIONS.map((d) => (
                    <option key={d.minutes} value={d.minutes}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Access Scope</label>
                <select
                  value={accessScope}
                  onChange={(e) => setAccessScope(e.target.value as any)}
                  className="w-full rounded-xl border border-indigo-500/30 bg-slate-950 px-3 py-2 text-xs text-white outline-none cursor-pointer"
                >
                  <option value="Read-Only Diagnostics">Read-Only Diagnostics (Masked Member Records)</option>
                  <option value="Full Troubleshooting Mutation">Full Troubleshooting Mutation (Audited Data Repair)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Mandatory Justification *</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Diagnosing corrupted student seat assignment ledger for Ticket #TKT-991"
                  value={accessJustification}
                  onChange={(e) => setAccessJustification(e.target.value)}
                  className="w-full rounded-xl border border-indigo-500/30 bg-slate-950 p-2.5 text-xs text-white outline-none resize-none"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                <p className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                  <ShieldCheck size={13} />
                  Privacy Governance Rule
                </p>
                <p>
                  Access automatically expires when duration lapses. Every member query during this session will be logged to immutable SuperAdmin audit logs.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowGrantAccessModal(false)}
                className="px-3.5 py-1.5 rounded-xl text-xs text-slate-400 hover:text-white active:scale-[0.97] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleGrantAccessSubmit}
                className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-xs font-bold text-white shadow-md cursor-pointer active:scale-[0.97]"
              >
                {t("COPY.GRANT_ACCESS")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
