// FLOW: Feature source -> superadmin_support/support_tickets/types/SuperadminSupportTicketsOverviewTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Responsibility: Superadmin Support Tickets Types; defines module-owned type contracts for the named data boundary. */

export type SuperadminSupportTicketCategory =
  | 'Technical issue'
  | 'Billing issue'
  | 'Branch creation request'
  | 'Plan upgrade request'
  | 'Account access issue'
  | 'Data correction request'
  | 'Feature request'
  | 'Bug report'
  | 'Security complaint'
  | 'Billing'
  | 'Bug'
  | 'Account'
  | 'Support';

export type SuperadminSupportTicketPriority = 'Urgent' | 'High' | 'Medium' | 'Low';

export type SuperadminSupportTicketStatus = 'Open' | 'In-Progress' | 'Escalated' | 'Resolved' | 'Closed' | 'Reopened';

export interface SuperadminSupportTicketAttachment {
  name: string;
  size: string;
  type: string;
  uploadedAt: string;
}

export interface SuperadminSupportTicketMessage {
  id: string;
  sender: string;
  role: 'tenant_admin' | 'support_agent' | 'system';
  avatar?: string;
  timestamp: string;
  text: string;
  isInternalNote?: boolean;
  attachments?: SuperadminSupportTicketAttachment[];
}

export interface SuperadminSupportTicketEscalation {
  isEscalated: boolean;
  escalatedTo?: 'Tier-2 Technical Specialist' | 'Lead Cloud Architect' | 'Security Incident Response Team' | 'Billing Operations Lead';
  escalatedAt?: string;
  escalatedBy?: string;
  reason?: string;
}

export interface SuperadminSupportTicketResolution {
  resolvedAt?: string;
  resolvedBy?: string;
  notes?: string;
  rootCause?: string;
  preventiveAction?: string;
}

export interface SuperadminSupportTimeLimitedAccess {
  hasActiveAccess: boolean;
  grantedTo?: string;
  grantedBy?: string;
  scope?: 'Read-Only Diagnostics' | 'Full Troubleshooting Mutation';
  justification?: string;
  grantedAt?: string;
  expiresAt?: string;
  durationMinutes?: number;
  auditId?: string;
}

export interface SuperadminSupportTicket {
  id: string;
  subject: string;
  tenant: string;
  priority: SuperadminSupportTicketPriority;
  status: SuperadminSupportTicketStatus;
  category: SuperadminSupportTicketCategory;
  assignee: string;
  slaBreach: boolean;
  age: string;
  replies: number;
  hasAttachment: boolean;
  desc: string;
  phone?: string;
  email?: string;
  contact?: string;

  // Rich Lifecycle & Security Controls
  slaTargetHours?: number;
  slaRemaining?: string;
  messages?: SuperadminSupportTicketMessage[];
  internalNotes?: Array<{ id: string; author: string; timestamp: string; note: string }>;
  attachmentsList?: SuperadminSupportTicketAttachment[];
  escalation?: SuperadminSupportTicketEscalation;
  resolution?: SuperadminSupportTicketResolution;
  reopenReason?: string;
  reopenedAt?: string;
  timeLimitedAccess?: SuperadminSupportTimeLimitedAccess;
}

/**
 * Defines the public SuperadminSupportTicketsDetailPanelProps contract for support tickets. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 * @property tkt Value defined by the existing feature-local contract. Declared type: SuperadminSupportTicket.
 * @property onClose Callback for the corresponding user interaction. Declared type: () => void.
 * @property onSave Callback for the corresponding user interaction. Declared type: (ticket: SuperadminSupportTicket) => void.
 */
export interface SuperadminSupportTicketsDetailPanelProps {
  tkt: SuperadminSupportTicket;
  onClose: () => void;
  onSave: (ticket: SuperadminSupportTicket) => void;
}

/**
 * Defines the public SuperadminSupportTicketsFilter contract for support tickets. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 */
export type SuperadminSupportTicketsFilter = 'All' | SuperadminSupportTicket['status'];

/**
 * Defines the public SuperadminSupportTicketsKpiCardsProps contract for support tickets. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 * @property openCount Value defined by the existing feature-local contract. Declared type: number.
 * @property slaBreachCount Value defined by the existing feature-local contract. Declared type: number.
 * @property avgResponse Value defined by the existing feature-local contract. Declared type: string.
 */
export interface SuperadminSupportTicketsKpiCardsProps {
  openCount: number;
  slaBreachCount: number;
  avgResponse: string;
}
