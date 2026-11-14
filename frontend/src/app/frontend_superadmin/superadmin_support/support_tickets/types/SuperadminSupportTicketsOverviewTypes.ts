// FLOW: Feature source -> superadmin_support/support_tickets/types/SuperadminSupportTicketsOverviewTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Responsibility: Superadmin Support Tickets Types; defines module-owned type contracts for the named data boundary. */
export interface SuperadminSupportTicket {
  id: string;
  subject: string;
  tenant: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Open' | 'In-Progress' | 'Resolved';
  category: 'Billing' | 'Bug' | 'Account' | 'Support';
  assignee: string;
  slaBreach: boolean;
  age: string;
  replies: number;
  hasAttachment: boolean;
  desc: string;
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
