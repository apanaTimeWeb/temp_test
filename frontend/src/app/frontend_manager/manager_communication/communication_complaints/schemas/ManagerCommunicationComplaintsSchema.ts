import { z } from 'zod';
const managerComplaintsIsoDateSchema = z.string().refine((value) => {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) { const [y,m,d]=value.split('-').map(Number); const date=new Date(Date.UTC(y,m-1,d)); return date.getUTCFullYear()===y&&date.getUTCMonth()===m-1&&date.getUTCDate()===d; }
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:?\d{2})$/.test(value)) return false;
  const [datePart]=value.split('T');const [y,m,d]=datePart.split('-').map(Number);const date=new Date(Date.UTC(y,m-1,d));return date.getUTCFullYear()===y&&date.getUTCMonth()===m-1&&date.getUTCDate()===d&&Number.isFinite(Date.parse(value));
}, 'Expected a valid ISO calendar date or ISO date-time');
export const managerComplaintsComplaintResponseSchema = z.object({ id:z.string().min(1), subject:z.string(), description:z.string(), createdAt:managerComplaintsIsoDateSchema, status:z.enum(['open','in_progress','resolved']) });
export const managerComplaintsComplaintResponseListSchema = z.array(managerComplaintsComplaintResponseSchema);
