import rawData from '@/app/frontend_manager/manager_members/members_enquiries/mocks/manager_members_enquiries_fixtures/manager_members_enquiries_en.json';
import type { ManagerMembersEnquiriesEnquiry } from '@/app/frontend_manager/manager_members/members_enquiries/types/ManagerMembersEnquiriesTypes';
import { normalizeManagerEnquiriesEnquiry } from '@/app/frontend_manager/manager_members/members_enquiries/utils/ManagerMembersEnquiriesUtilities';

type MockRow = {
  id: string; name: string; phone: string; shift: string; status: ManagerMembersEnquiriesEnquiry['status']; addedDate: string;
  source: string; handledBy: string; enquiryDate: string; preferredBranch: string; avatar: string;
  followUps: ManagerMembersEnquiriesEnquiry['followUps']; isOverdue?: boolean; isToday?: boolean; isUpcoming?: boolean; convertedDate?: string;
};

const managerCrmFixtureRows = rawData.enquiries as unknown as MockRow[];

const managerCrmMockEnquiries: ManagerMembersEnquiriesEnquiry[] = managerCrmFixtureRows.map((item: MockRow) => normalizeManagerEnquiriesEnquiry({
  id: item.id,
  name: item.name,
  phone: item.phone,
  preferredShift: item.shift,
  status: item.status,
  source: item.source,
  handledBy: { name: item.handledBy },
  createdAt: item.enquiryDate,
  preferredBranch: item.preferredBranch,
  followUps: item.followUps,
  convertedDate: item.convertedDate,
  isOverdue: item.isOverdue,
  isToday: item.isToday,
  isUpcoming: item.isUpcoming,
}));

export function getManagerEnquiriesMockEnquiries(): ManagerMembersEnquiriesEnquiry[] {
  return structuredClone(managerCrmMockEnquiries);
}

export function getManagerEnquiriesMockEnquiry(id: string): ManagerMembersEnquiriesEnquiry | null {
  const found = managerCrmMockEnquiries.find((item) => item.id === id);
  return found ? structuredClone(found) : null;
}


/** Sample-only option lists for the disabled enquiry draft form; not authoritative CRM enums or staff records. */
export const MANAGER_CRM_SAMPLE_SHIFT_OPTIONS = [
  { id: 'sample_shift_001', name: 'Morning', time: '6 AM – 12 PM' },
  { id: 'sample_shift_002', name: 'Afternoon', time: '12 PM – 5 PM' },
  { id: 'sample_shift_003', name: 'Evening', time: '5 PM – 10 PM' },
  { id: 'sample_shift_004', name: 'Night', time: '10 PM – 6 AM' },
  { id: 'sample_shift_005', name: 'Full Day', time: '6 AM – 10 PM' },
] as const;
export const MANAGER_CRM_SAMPLE_SOURCE_OPTIONS = [
  'Walk-in', 'WhatsApp', 'Referral', 'Social Media', 'Phone Call', 'Google Ads', 'Instagram', 'Facebook', 'Other',
] as const;
export const MANAGER_CRM_SAMPLE_STAFF_OPTIONS = [
  { id: 'sample_staff_001', name: 'Sample staff A' },
  { id: 'sample_staff_002', name: 'Sample staff B' },
  { id: 'sample_staff_003', name: 'Sample staff C' },
] as const;
