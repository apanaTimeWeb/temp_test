'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { SUPERADMIN_SUPPORT_ESCALATION_TIERS } from '../constants/SuperadminSupportTicketsOverviewConstants';
import type {
  SuperadminSupportTicket,
  SuperadminSupportTicketEscalation,
  SuperadminSupportTicketMessage,
  SuperadminSupportTicketPriority,
  SuperadminSupportTicketResolution,
  SuperadminSupportTicketStatus,
  SuperadminSupportTimeLimitedAccess,
} from '../types/SuperadminSupportTicketsOverviewTypes';

interface UseSupportTicketActionsParams {
  tkt: SuperadminSupportTicket;
  assignee: string;
  setStatus: React.Dispatch<React.SetStateAction<SuperadminSupportTicketStatus>>;
  setPriority: React.Dispatch<React.SetStateAction<SuperadminSupportTicketPriority>>;
  setMessages: React.Dispatch<React.SetStateAction<SuperadminSupportTicketMessage[]>>;
  setEscalation: React.Dispatch<React.SetStateAction<SuperadminSupportTicketEscalation>>;
  setResolution: React.Dispatch<React.SetStateAction<SuperadminSupportTicketResolution>>;
  setTimeLimitedAccess: React.Dispatch<React.SetStateAction<SuperadminSupportTimeLimitedAccess>>;
}

export function useSuperadminSupportTicketsDetailActions({
  tkt,
  assignee,
  setStatus,
  setPriority,
  setMessages,
  setEscalation,
  setResolution,
  setTimeLimitedAccess,
}: UseSupportTicketActionsParams) {
  const [showEscalateModal, setShowEscalateModal] = useState(false);
  const [escalateTier, setEscalateTier] = useState<(typeof SUPERADMIN_SUPPORT_ESCALATION_TIERS)[number]>('Tier-2 Technical Specialist');
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

  const handleEscalateSubmit = () => {
    if (!escalateReason.trim()) {
      toast.error('Please specify an escalation justification');
      return;
    }
    setEscalation({
      isEscalated: true,
      escalatedTo: escalateTier,
      escalatedAt: 'Just now',
      escalatedBy: 'SuperAdmin Duty Officer',
      reason: escalateReason.trim(),
    });
    setStatus('Escalated');
    setPriority('High');
    setMessages((prev) => [...prev, { id: `msg-esc-${Date.now()}`, sender: 'Escalation Dispatcher', role: 'system', timestamp: 'Just now', text: `Ticket escalated to ${escalateTier}. Justification: ${escalateReason.trim()}` }]);
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
    setMessages((prev) => [...prev, { id: `msg-res-${Date.now()}`, sender: 'Resolution Bot', role: 'system', timestamp: 'Just now', text: `Ticket resolved by ${res.resolvedBy}. Summary: ${resolutionNotes.trim()}` }]);
    setShowResolveModal(false);
    toast.success('Ticket marked as Resolved');
  };

  const handleReopenSubmit = () => {
    if (!reopenReason.trim()) {
      toast.error('Please state the reopen reason');
      return;
    }
    setStatus('Reopened');
    setMessages((prev) => [...prev, { id: `msg-reopen-${Date.now()}`, sender: 'Reopen Notice', role: 'system', timestamp: 'Just now', text: `Ticket reopened. Reason: ${reopenReason.trim()}` }]);
    setShowReopenModal(false);
    toast.info(`Ticket reopened: ${reopenReason.trim()}`);
  };

  const handleGrantAccessSubmit = () => {
    if (!accessJustification.trim()) {
      toast.error('A clear justification is required to grant time-limited access');
      return;
    }
    const auditToken = `AUD-SEC-${Math.floor(1000 + Math.random() * 9000)}`;
    setTimeLimitedAccess({
      hasActiveAccess: true,
      grantedTo: assignee !== 'Unassigned' ? assignee : 'Designated Support Specialist',
      grantedBy: 'SuperAdmin Security Policy Officer',
      scope: accessScope,
      justification: accessJustification.trim(),
      grantedAt: 'Just now',
      expiresAt: `${accessDuration}m remaining`,
      durationMinutes: accessDuration,
      auditId: auditToken,
    });
    setShowGrantAccessModal(false);
    setAccessJustification('');
    toast.success(`Authorized: Time-limited support access granted for ${accessDuration}m (Audit #${auditToken})`);
  };

  const handleRevokeAccess = () => {
    setTimeLimitedAccess({ hasActiveAccess: false });
    toast.warning('Time-limited support access revoked. Member records re-shielded.');
  };

  return {
    showEscalateModal, setShowEscalateModal, escalateTier, setEscalateTier, escalateReason, setEscalateReason, handleEscalateSubmit,
    showResolveModal, setShowResolveModal, resolutionNotes, setResolutionNotes, rootCause, setRootCause, handleResolveSubmit,
    showReopenModal, setShowReopenModal, reopenReason, setReopenReason, handleReopenSubmit,
    showGrantAccessModal, setShowGrantAccessModal, accessDuration, setAccessDuration, accessScope, setAccessScope, accessJustification, setAccessJustification, handleGrantAccessSubmit, handleRevokeAccess,
  };
}
