import { z } from 'zod';

/**
 * Minimal source-verified transport shape. Unknown report fields remain unknown until a host DTO
 * contract is supplied; the schema deliberately does not invent metric or authorization fields.
 */
export const AdminDashboardReportsAnalyticsApiRecordSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(),
}).passthrough();

export const AdminDashboardReportsAnalyticsApiResponseSchema = z.array(AdminDashboardReportsAnalyticsApiRecordSchema);
