import { z } from 'zod';

/** Local draft validation only. This schema is not a server/API contract. */
export const managerBranchInfoDraftSchema = z.object({
  branchName: z.string().trim().min(1).max(120),
  branchCode: z.string().trim().min(1).max(40),
  address: z.string().trim().min(1).max(300),
  phone: z.string().trim().min(7).max(30),
  email: z.string().trim().email().max(254),
  managerName: z.string().trim().min(1).max(120),
  workingHours: z.string().trim().min(1).max(120),
  libraryLogo: z.string().trim().max(500).optional().default(''),
  establishmentDate: z.string().trim().min(1).max(50),
  libraryType: z.string().trim().min(1).max(50),
  totalSeatingCapacity: z.union([z.number().int().min(1), z.string().trim().min(1).max(30)]),
  totalFloors: z.union([z.number().int().min(1), z.string().trim().min(1).max(40)]),
  totalShifts: z.union([z.number().int().min(1), z.string().trim().min(1).max(60)]),
  timezone: z.string().trim().min(1).max(50),
  currency: z.string().trim().min(1).max(30),
  supportPhone: z.string().trim().min(7).max(30),
  supportEmail: z.string().trim().email().max(254),
  profileCreatedDate: z.string().trim().min(1).max(50),
  lastUpdatedDate: z.string().trim().min(1).max(50),
  // Student Wi-Fi Connect Configuration
  wifiSsid: z.string().trim().min(1).max(64).default('SmartLibrary_Student_5G'),
  wifiPassword: z.string().trim().max(64).default('StudyHub@2026'),
  wifiSecurity: z.enum(['WPA', 'WEP', 'nopass']).default('WPA'),
  wifiFrequency: z.string().trim().max(60).default('Dual-Band 5 GHz / 2.4 GHz High-Speed'),
  wifiInstructions: z.string().trim().max(200).default('Scan to connect to high-speed student Wi-Fi'),
});

export type ManagerSettingsBranchInfoDraft = z.infer<typeof managerBranchInfoDraftSchema>;
