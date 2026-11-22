// schemas/SuperadminAnalyticsPlatformReportsSchemas.ts
// Zod runtime contracts for Superadmin Platform Reports

import { z } from 'zod';

export const SuperadminAnalyticsPlatformReportsFiltersSchema = z.object({
  dateRange: z.string().default('last_30_days'),
  libraryId: z.string().default('ALL'),
  branchId: z.string().default('ALL'),
  plan: z.string().default('ALL'),
  status: z.string().default('ALL'),
  adminId: z.string().default('ALL'),
  paymentStatus: z.string().default('ALL'),
  searchQuery: z.string().default(''),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().default(10),
  sortBy: z.string().default('createdDate'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const PlatformReportExportSchema = z.object({
  format: z.enum(['excel', 'pdf', 'csv', 'print', 'download']),
  dateRange: z.string(),
  libraryId: z.string().optional(),
  branchId: z.string().optional(),
  plan: z.string().optional(),
  status: z.string().optional(),
  adminId: z.string().optional(),
  paymentStatus: z.string().optional(),
  searchQuery: z.string().optional(),
});
