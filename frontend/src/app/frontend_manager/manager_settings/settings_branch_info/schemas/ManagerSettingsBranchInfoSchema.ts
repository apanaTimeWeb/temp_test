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
});

export type ManagerSettingsBranchInfoDraft = z.infer<typeof managerBranchInfoDraftSchema>;
