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
