import { MANAGER_CRM_STATUS_VALUES, type ManagerMembersEnquiriesEnquiryStatus, type ManagerMembersEnquiriesKanbanColumn } from '@/app/frontend_manager/manager_members/members_enquiries/types/ManagerMembersEnquiriesTypes';

// Keep UI options, schema validation, and domain status typing on one feature-owned source.
export const MANAGER_CRM_STATUS_OPTIONS: readonly ManagerMembersEnquiriesEnquiryStatus[] = MANAGER_CRM_STATUS_VALUES;
export const MANAGER_CRM_KANBAN_COLUMNS: ManagerMembersEnquiriesKanbanColumn[] = [
  { id: 'New', label: 'New Leads', cardClass: 'crm-col-new' },
  { id: 'Visited', label: 'Visited', cardClass: 'crm-col-visited' },
  { id: 'Interested', label: 'Interested', cardClass: 'crm-col-interested' },
  { id: 'Converted', label: 'Converted', cardClass: 'crm-col-converted' },
  { id: 'Lost', label: 'Lost', cardClass: 'crm-col-lost' },
];

export const MANAGER_CRM_STATUS_BADGE: Record<ManagerMembersEnquiriesEnquiryStatus, string> = {
  New: 'crm-badge--info',
  Visited: 'crm-badge--warning',
  Interested: 'crm-badge--primary',
  Converted: 'crm-badge--success',
  Lost: 'crm-badge--danger',
};

export const MANAGER_CRM_DOT_CLASS: Record<ManagerMembersEnquiriesEnquiryStatus, string> = {
  New: 'crm-col-dot--new',
  Visited: 'crm-col-dot--visited',
  Interested: 'crm-col-dot--interested',
  Converted: 'crm-col-dot--converted',
  Lost: 'crm-col-dot--lost',
};

export const MANAGER_CRM_DEFAULT_WHATSAPP_TEMPLATES = [
  {
    id: 'demo_session',
    label: 'Free Demo Invite',
    text: 'Hello {name}, thank you for inquiring about seat booking at Central Library! We have study slots available in your preferred shift. Would you like to visit today for a free demo session?',
  },
  {
    id: 'followup',
    label: 'Visit Follow-up',
    text: 'Hi {name}, following up on your recent visit to our library! We have reserved a trial seat for you. Let us know if you would like to confirm your membership this week.',
  },
  {
    id: 'fee_offer',
    label: 'Special Fee Offer',
    text: 'Dear {name}, we are offering a 10% discount on 3-month library plans this week! Reserved reserved silent zone seats are filling up fast. Reply here to secure your booking.',
  },
] as const;
