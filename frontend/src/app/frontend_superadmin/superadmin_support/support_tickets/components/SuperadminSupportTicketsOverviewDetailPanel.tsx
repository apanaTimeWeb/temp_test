'use client';

import { useSuperadminSupportTicketsOverviewConfirm } from '@/app/frontend_superadmin/superadmin_support/support_tickets/hooks/useSuperadminSupportTicketsOverviewConfirm';
import { useModalScrollLock } from '@/lib/useModalScrollLock';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
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
import { useTranslations } from 'next-intl';
import { SUPERADMIN_SUPPORT_TICKETS_DETAIL_PANEL_SELECTOR } from '@/app/frontend_superadmin/superadmin_support/support_tickets/constants/SuperadminSupportTicketsOverviewStaticConstants';
import { toast } from 'sonner';
import SuperadminSupportTicketsDetailHeader from './SuperadminSupportTicketsDetailHeader';
import SuperadminSupportTicketsDetailModals from './SuperadminSupportTicketsDetailModals';
import SuperadminSupportTicketsDetailTabs from './SuperadminSupportTicketsDetailTabs';
import SuperadminSupportTicketsConversationThread from './SuperadminSupportTicketsConversationThread';
import SuperadminSupportTicketsDetailNavTabs from './SuperadminSupportTicketsDetailNavTabs';
import { useSuperadminSupportTicketsDetailActions } from '../hooks/useSuperadminSupportTicketsDetailActions';

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
  const [activeTab, setActiveTab] = useState<'conversation' | 'internal_notes' | 'attachments' | 'sla_escalation'>('conversation');
  const [mounted, setMounted] = useState(false);

  const [replyText, setReplyText] = useState('');
  const [isInternalNote, setIsInternalNote] = useState(false);
  const [operationMessage, setOperationMessage] = useState('');

  const [messages, setMessages] = useState<SuperadminSupportTicketMessage[]>(() => {
    if (tkt.messages && tkt.messages.length > 0) return tkt.messages;
    const initialMsgs: SuperadminSupportTicketMessage[] = [
      { id: `msg-${tkt.id}-inbound`, sender: tkt.contact || tkt.tenant, role: 'tenant_admin', timestamp: `${tkt.age} ago`, text: tkt.desc },
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

  const [internalNotes, setInternalNotes] = useState(() => tkt.internalNotes || [
    { id: `note-${tkt.id}-default`, author: 'Platform Ops', timestamp: `${tkt.age} ago`, note: `Ticket opened with priority ${tkt.priority} under category ${tkt.category}. Initial triage completed.` },
  ]);

  const [attachments, setAttachments] = useState<SuperadminSupportTicketAttachment[]>(() => {
    if (tkt.attachmentsList && tkt.attachmentsList.length > 0) return tkt.attachmentsList;
    if (tkt.hasAttachment) {
      return [{ name: `${tkt.id.toLowerCase()}_diagnostic_evidence.pdf`, size: '1.2 MB', type: 'application/pdf', uploadedAt: `${tkt.age} ago` }];
    }
    return [];
  });

  const [escalation, setEscalation] = useState<SuperadminSupportTicketEscalation>(() => tkt.escalation || { isEscalated: tkt.status === 'Escalated' });
  const [resolution, setResolution] = useState<SuperadminSupportTicketResolution>(() => tkt.resolution || {});
  const [timeLimitedAccess, setTimeLimitedAccess] = useState<SuperadminSupportTimeLimitedAccess>(() => tkt.timeLimitedAccess || { hasActiveAccess: false });
  const [newAttachmentName, setNewAttachmentName] = useState('');

  const actions = useSuperadminSupportTicketsDetailActions({
    tkt,
    assignee,
    setStatus,
    setPriority,
    setMessages,
    setEscalation,
    setResolution,
    setTimeLimitedAccess,
  });

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
    if (isDirtyRef.current && !(await confirm(tRef.current('COPY.UNSAVED_CHANGES_WARNING')))) return;
    onClose();
  }, [confirm, onClose]);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const handleSendReply = () => {
    if (!replyText.trim()) return;
    if (isInternalNote) {
      setInternalNotes((prev) => [
        { id: `note-${Date.now()}`, author: assignee !== 'Unassigned' ? assignee : 'SuperAdmin Staff', timestamp: 'Just now', note: replyText.trim() },
        ...prev,
      ]);
      setReplyText('');
      setOperationMessage('');
      toast.success('Internal confidential note added to ticket history');
    } else {
      setMessages((prev) => [
        ...prev,
        { id: `msg-${Date.now()}`, sender: assignee !== 'Unassigned' ? assignee : 'Support Staff', role: 'support_agent', timestamp: 'Just now', text: replyText.trim() },
      ]);
      setReplyText('');
      setOperationMessage('');
      toast.success(`Public reply dispatched to ${tkt.tenant}`);
    }
  };

  const handleAddAttachment = () => {
    if (!newAttachmentName.trim()) {
      toast.error('Please enter attachment file name');
      return;
    }
    setAttachments((prev) => [
      ...prev,
      { name: newAttachmentName.trim(), size: '380 KB', type: newAttachmentName.endsWith('.pdf') ? 'application/pdf' : 'image/png', uploadedAt: 'Just now' },
    ]);
    setNewAttachmentName('');
    toast.success(`Attached ${newAttachmentName.trim()} to ticket`);
  };

  const panelContent = (
    <div
      className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex justify-center items-center p-2 sm:p-4 md:p-6 overflow-y-auto motion-safe:animate-in motion-safe:fade-in motion-reduce:animate-none"
      onClick={requestClose}
      data-testid="superadmin-superadmin-support-tickets-overview-detail-panel-div-line-72"
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="superadmin-support-ticket-detail-title"
        className="bg-[#0a0e27] border border-indigo-500/30 rounded-2xl shadow-2xl shadow-black/95 w-full max-w-5xl flex flex-col my-auto overflow-hidden text-slate-100 animate-in zoom-in-95 duration-200 ease-out"
        style={{ height: 'calc(100dvh - 32px)', maxHeight: 'calc(100dvh - 32px)' }}
        onClick={(e) => e.stopPropagation()}
        data-testid="superadmin-superadmin-support-tickets-overview-detail-panel-div-line-73"
      >
        <SuperadminSupportTicketsDetailHeader
          tkt={tkt}
          status={status}
          setStatus={setStatus}
          priority={priority}
          setPriority={setPriority}
          assignee={assignee}
          setAssignee={setAssignee}
          timeLimitedAccess={timeLimitedAccess}
          onOpenEscalate={() => actions.setShowEscalateModal(true)}
          onOpenResolve={() => actions.setShowResolveModal(true)}
          onOpenReopen={() => actions.setShowReopenModal(true)}
          onOpenGrantAccess={() => actions.setShowGrantAccessModal(true)}
          onRevokeAccess={actions.handleRevokeAccess}
          onClose={requestClose}
          onSavePreview={() => {
            onSave({ ...tkt, status, assignee, priority, messages, internalNotes, attachmentsList: attachments, escalation, resolution, timeLimitedAccess });
            setOperationMessage(t('COPY.LOCAL_PREVIEW_APPLIED_MESSAGE'));
            toast.success('Ticket preview state saved');
          }}
          t={t}
        />

        <SuperadminSupportTicketsDetailNavTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          messagesCount={messages.length}
          internalNotesCount={internalNotes.length}
          attachmentsCount={attachments.length}
          t={t}
        />

        {activeTab === 'conversation' ? (
          <SuperadminSupportTicketsConversationThread
            messages={messages}
            messagesEndRef={messagesEndRef}
            isInternalNote={isInternalNote}
            setIsInternalNote={setIsInternalNote}
            replyText={replyText}
            setReplyText={setReplyText}
            operationMessage={operationMessage}
            setOperationMessage={setOperationMessage}
            handleSendReply={handleSendReply}
            onOpenAttachments={() => setActiveTab('attachments')}
            t={t}
          />
        ) : (
          <SuperadminSupportTicketsDetailTabs
            activeTab={activeTab}
            internalNotes={internalNotes}
            attachments={attachments}
            newAttachmentName={newAttachmentName}
            setNewAttachmentName={setNewAttachmentName}
            onAddAttachment={handleAddAttachment}
            tkt={tkt}
            priority={priority}
            escalation={escalation}
            resolution={resolution}
            t={t}
          />
        )}
      </div>

      <SuperadminSupportTicketsDetailModals
        showEscalateModal={actions.showEscalateModal} setShowEscalateModal={actions.setShowEscalateModal}
        escalateTier={actions.escalateTier} setEscalateTier={actions.setEscalateTier}
        escalateReason={actions.escalateReason} setEscalateReason={actions.setEscalateReason}
        onEscalateSubmit={actions.handleEscalateSubmit}
        showResolveModal={actions.showResolveModal} setShowResolveModal={actions.setShowResolveModal}
        resolutionNotes={actions.resolutionNotes} setResolutionNotes={actions.setResolutionNotes}
        rootCause={actions.rootCause} setRootCause={actions.setRootCause}
        onResolveSubmit={actions.handleResolveSubmit}
        showReopenModal={actions.showReopenModal} setShowReopenModal={actions.setShowReopenModal}
        reopenReason={actions.reopenReason} setReopenReason={actions.setReopenReason}
        onReopenSubmit={actions.handleReopenSubmit}
        showGrantAccessModal={actions.showGrantAccessModal} setShowGrantAccessModal={actions.setShowGrantAccessModal}
        accessDuration={actions.accessDuration} setAccessDuration={actions.setAccessDuration}
        accessScope={actions.accessScope} setAccessScope={actions.setAccessScope}
        accessJustification={actions.accessJustification} setAccessJustification={actions.setAccessJustification}
        onGrantAccessSubmit={actions.handleGrantAccessSubmit}
        t={t}
      />
    </div>
  );

  if (!mounted || typeof document === 'undefined') return null;
  return createPortal(panelContent, document.body);
}
