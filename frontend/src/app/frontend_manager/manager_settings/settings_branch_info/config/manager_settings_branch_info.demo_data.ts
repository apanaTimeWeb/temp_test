import type { ManagerSettingsBranchInfoDraft } from '@/app/frontend_manager/manager_settings/settings_branch_info/schemas/ManagerSettingsBranchInfoSchema';

export const DEFAULT_BRANCH_CURRENCY = 'INR (\u20B9)' as const;

/** Runtime sample branch profile values detached from test-only mocks. */
export const MANAGER_BRANCH_INFO_DEMO_DRAFT: ManagerSettingsBranchInfoDraft = {
  branchName: 'Library OS - Connaught Place',
  branchCode: 'SL360-CP-01',
  address: 'Block A, Connaught Place, New Delhi, 110001',
  phone: '+91 9876543210',
  email: 'cp.branch@smartlibrary.com',
  managerName: 'Rahul Verma',
  workingHours: '08:00 AM - 10:00 PM (All Days)',
  libraryLogo: '',
  establishmentDate: '15 Aug 2021',
  libraryType: 'Private',
  totalSeatingCapacity: '120 Seats',
  totalFloors: '2 Floors (G + 1)',
  totalShifts: '3 Shifts (Morning, Evening, Night)',
  timezone: 'Asia/Kolkata (IST)',
  currency: DEFAULT_BRANCH_CURRENCY,
  supportPhone: '+91 9876543299',
  supportEmail: 'support.cp@smartlibrary.com',
  profileCreatedDate: '15 Jan 2023',
  lastUpdatedDate: '25 Oct 2026',
  wifiSsid: 'SmartLibrary_Student_5G',
  wifiPassword: 'StudyHub@2026',
  wifiSecurity: 'WPA',
  wifiFrequency: 'Dual-Band 5 GHz / 2.4 GHz High-Speed',
  wifiInstructions: 'Scan with camera or Wi-Fi settings to connect instantly',
};
