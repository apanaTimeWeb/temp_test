export const MANAGER_CRM_STATUS_VALUES = ['New', 'Visited', 'Interested', 'Converted', 'Lost'] as const;
export type ManagerMembersEnquiriesEnquiryStatus = (typeof MANAGER_CRM_STATUS_VALUES)[number];

/** Source values are host-defined; do not hard-code an authoritative enum without the API contract. */
export type ManagerMembersEnquiriesEnquirySource = string;

export interface ManagerMembersEnquiriesFollowUp {
  id: string;
  date: string;
  time: string;
  by: string;
  remark: string;
}

export interface ManagerMembersEnquiriesEnquiry {
  id: string;
  name: string;
  phone: string;
  shift: string;
  status: ManagerMembersEnquiriesEnquiryStatus;
  source: ManagerMembersEnquiriesEnquirySource;
  handledBy: string;
  addedDate: string;
  enquiryDate: string;
  preferredBranch: string;
  avatar: string;
  followUps: ManagerMembersEnquiriesFollowUp[];
  isOverdue?: boolean;
  isToday?: boolean;
  isUpcoming?: boolean;
  convertedDate?: string;
}

export interface ManagerMembersEnquiriesApiEnquiry {
  id: string;
  name: string;
  phone: string;
  preferredShift?: string | null;
  status: ManagerMembersEnquiriesEnquiryStatus;
  source?: string | null;
  handledBy?: { name?: string | null } | null;
  createdAt: string;
  preferredBranch?: string | null;
  followUps?: ManagerMembersEnquiriesFollowUp[] | null;
  convertedDate?: string | null;
  isOverdue?: boolean;
  isToday?: boolean;
  isUpcoming?: boolean;
}

export interface ManagerMembersEnquiriesKanbanColumn {
  id: ManagerMembersEnquiriesEnquiryStatus;
  label: string;
  cardClass: string;
}

