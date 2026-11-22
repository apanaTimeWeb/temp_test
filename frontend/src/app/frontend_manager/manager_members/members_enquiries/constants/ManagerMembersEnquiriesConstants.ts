import { MANAGER_CRM_STATUS_VALUES,type ManagerMembersEnquiriesEnquiryStatus,type ManagerMembersEnquiriesKanbanColumn } from '@/app/frontend_manager/manager_members/members_enquiries/types/ManagerMembersEnquiriesTypes';

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
    id: 'demo_pass',
    label: '🎟️ 1-Day Demo Pass',
    text: '🎟️ *CENTRAL LIBRARY — 1-DAY FREE TRIAL DEMO PASS*\n\nHello *{name}*,\nThank you for reaching out to Central Library! We are pleased to offer you a complimentary *1-Day Free Study Pass*.\n\n🏢 *Amenities:* Silent AC Hall, Ergonomic Desks, 5G Wi-Fi, RO Water, Power Sockets.\n📍 *Map Pin:* https://maps.google.com/?q=Central+Library+Study+Center\n⏰ *Timings:* 06:00 AM – 10:00 PM\n\nShow this pass at our reception desk upon arrival!',
  },
  {
    id: 'location_pin',
    label: '📍 Location & Timings',
    text: '📍 *CENTRAL LIBRARY — LOCATION & DIRECTIONS*\n\nHello *{name}*,\nHere is the exact location and timings for Central Library:\n🗺️ *Google Maps Pin:* https://maps.google.com/?q=Central+Library+Study+Center\n🏢 *Address:* Main Road, Near Metro Gate #2, Central Market\n⏰ *Timings:* 06:00 AM – 10:00 PM (Open 7 Days)\n\nLooking forward to welcoming you!',
  },
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
