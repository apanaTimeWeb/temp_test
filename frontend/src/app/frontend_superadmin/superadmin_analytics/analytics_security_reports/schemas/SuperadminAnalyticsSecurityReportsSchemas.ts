// schemas/SuperadminAnalyticsSecurityReportsSchemas.ts
// Zod schemas for Superadmin Security Reports filters and export payloads

import { z } from 'zod';

export const SecurityReportsFiltersSchema = z.object({
  dateRange: z.string().default('THIS_MONTH'),
  libraryId: z.string().default('ALL'),
  branchId: z.string().default('ALL'),
  plan: z.string().default('ALL'),
  status: z.string().default('ALL'),
  adminId: z.string().default('ALL'),
  paymentStatus: z.string().default('ALL'),
  searchQuery: z.string().default(''),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
  sortBy: z.string().default('timestamp'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const SecurityReportExportRequestSchema = z.object({
  format: z.enum(['excel', 'pdf', 'csv', 'print', 'download']),
  filters: SecurityReportsFiltersSchema,
  idempotencyKey: z.string().min(10),
});
