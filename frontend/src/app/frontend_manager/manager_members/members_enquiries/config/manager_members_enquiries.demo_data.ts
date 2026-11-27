import type { ManagerMembersEnquiriesEnquiry } from '@/app/frontend_manager/manager_members/members_enquiries/types/ManagerMembersEnquiriesTypes';
import { normalizeManagerEnquiriesEnquiry } from '@/app/frontend_manager/manager_members/members_enquiries/utils/ManagerMembersEnquiriesUtilities';

const DEMO_ENQUIRIES: ManagerMembersEnquiriesEnquiry[] = [
  {
    id: 'enq_001', name: 'Aarav Sharma', phone: '9876500022', shift: 'Morning', status: 'New',
    addedDate: '24 May', source: 'Google Ads', handledBy: 'Sarah Jenkins', enquiryDate: 'May 24, 2025',
    preferredBranch: 'Downtown Hub', avatar: 'AS', isOverdue: true,
    followUps: [
      { id: 'fu_001', date: 'Today, 10:45 AM', time: '10:45 AM', by: 'Sarah Jenkins', remark: 'Called the student to discuss pricing. They are interested in a demo session tomorrow. Very high chance of conversion.' },
      { id: 'fu_002', date: 'Oct 14, 2025', time: '02:00 PM', by: 'System', remark: 'Automated WhatsApp brochure sent to the registered mobile number.' },
      { id: 'fu_003', date: 'Oct 12, 2025', time: '09:30 AM', by: 'Sarah Jenkins', remark: 'Initial enquiry captured via Google Ads. Needs morning shift availability check.' },
    ],
  },
  {
    id: 'enq_002', name: 'Ishani Gupta', phone: '9765444120', shift: 'Night', status: 'New',
    addedDate: '25 May', source: 'Instagram', handledBy: 'Mike Ross', enquiryDate: 'May 25, 2025',
    preferredBranch: 'Uptown Branch', avatar: 'IG', isToday: true,
    followUps: [{ id: 'fu_003', date: 'May 25, 2025', time: '02:30 PM', by: 'Mike Ross', remark: 'Enquiry added. Follow-up scheduled for today evening.' }],
  },
  {
    id: 'enq_003', name: 'Rajiv Verma', phone: '9123488330', shift: 'Evening', status: 'Visited',
    addedDate: '22 May', source: 'Walk-in', handledBy: 'Sarah Jenkins', enquiryDate: 'May 22, 2025',
    preferredBranch: 'Downtown Hub', avatar: 'RV', isUpcoming: true,
    followUps: [
      { id: 'fu_004', date: 'May 23, 2025', time: '11:00 AM', by: 'Sarah Jenkins', remark: 'Student visited the library. Liked the evening shift setup. Will confirm by weekend.' },
      { id: 'fu_005', date: 'May 22, 2025', time: '05:00 PM', by: 'Admin', remark: 'Walk-in enquiry. Showed interest in evening shift.' },
    ],
  },
  {
    id: 'enq_004', name: 'Sneha Patel', phone: '9901111000', shift: 'Morning', status: 'Converted',
    addedDate: '25 May', convertedDate: 'Today', source: 'Referral', handledBy: 'Mike Ross', enquiryDate: 'May 25, 2025',
    preferredBranch: 'Downtown Hub', avatar: 'SP',
    followUps: [
      { id: 'fu_006', date: 'May 26, 2025', time: '12:00 PM', by: 'Mike Ross', remark: 'Admission confirmed. Fee collected. Seat allocated in morning shift.' },
      { id: 'fu_007', date: 'May 25, 2025', time: '10:00 AM', by: 'Mike Ross', remark: 'Referred by existing student Rohan Mehta. Very keen to join immediately.' },
    ],
  },
  {
    id: 'enq_005', name: 'Vihaan Rao', phone: '9677887780', shift: 'Evening', status: 'Interested',
    addedDate: '26 May', source: 'WhatsApp', handledBy: 'Sarah Jenkins', enquiryDate: 'May 26, 2025',
    preferredBranch: 'Uptown Branch', avatar: 'VR', isToday: true,
    followUps: [{ id: 'fu_008', date: 'May 26, 2025', time: '08:00 PM', by: 'Sarah Jenkins', remark: 'Student messaged on WhatsApp. Interested in evening shift. Sent fee details and shift schedule.' }],
  },
  {
    id: 'enq_006', name: 'Priya Nair', phone: '9812345670', shift: 'Full Day', status: 'Lost',
    addedDate: '18 May', source: 'Phone Call', handledBy: 'Admin', enquiryDate: 'May 18, 2025',
    preferredBranch: 'Downtown Hub', avatar: 'PN',
    followUps: [
      { id: 'fu_009', date: 'May 20, 2025', time: '03:00 PM', by: 'Admin', remark: 'Called three times — no response. Marked as lost after 7-day follow-up window.' },
      { id: 'fu_010', date: 'May 18, 2025', time: '11:00 AM', by: 'Admin', remark: "Phone call enquiry. Interested in full-day seat. Couldn't decide on fees." },
    ],
  },
];

export const getManagerEnquiriesDemoEnquiries = (): ManagerMembersEnquiriesEnquiry[] =>
  structuredClone(DEMO_ENQUIRIES.map((item) => normalizeManagerEnquiriesEnquiry(item)));

export const getManagerEnquiriesDemoEnquiry = (id: string): ManagerMembersEnquiriesEnquiry | null => {
  const found = DEMO_ENQUIRIES.find((item) => item.id === id);
  return found ? structuredClone(normalizeManagerEnquiriesEnquiry(found)) : null;
};

export const MANAGER_CRM_DEMO_SHIFT_OPTIONS = [
  { id: 'sample_shift_001', name: 'Morning', time: '6 AM – 12 PM' },
  { id: 'sample_shift_002', name: 'Afternoon', time: '12 PM – 5 PM' },
  { id: 'sample_shift_003', name: 'Evening', time: '5 PM – 10 PM' },
  { id: 'sample_shift_004', name: 'Night', time: '10 PM – 6 AM' },
  { id: 'sample_shift_005', name: 'Full Day', time: '6 AM – 10 PM' },
] as const;

export const MANAGER_CRM_DEMO_SOURCE_OPTIONS = [
  'Walk-in', 'WhatsApp', 'Referral', 'Social Media', 'Phone Call', 'Google Ads', 'Instagram', 'Facebook', 'Other',
] as const;

export const MANAGER_CRM_DEMO_STAFF_OPTIONS = [
  { id: 'sample_staff_001', name: 'Sample staff A' },
  { id: 'sample_staff_002', name: 'Sample staff B' },
  { id: 'sample_staff_003', name: 'Sample staff C' },
] as const;
