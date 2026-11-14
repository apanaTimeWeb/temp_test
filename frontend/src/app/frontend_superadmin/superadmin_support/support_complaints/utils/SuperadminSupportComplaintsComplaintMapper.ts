// RESPONSIBILITY: Normalize one validated complaint API row into the leaf model; redact anonymous identities at the boundary.
// FLOW: Validated API row -> canonical status + date normalization + privacy-safe complaint model.
import type { z } from 'zod';
import { SUPERADMIN_SUPPORT_COMPLAINT_STATUS } from '../constants/SuperadminSupportComplaintsStaticConstants';
import { SuperadminSupportComplaintResponseSchema } from '../schemas/SuperadminSupportComplaintsSchema';
import type { SuperadminSupportComplaint } from '../types/SuperadminSupportComplaintsTypes';

type ComplaintResponseRow = z.infer<typeof SuperadminSupportComplaintResponseSchema>;

function dateOnly(value: string | undefined): string {
  if (!value) return '';
  const dateOnly = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (dateOnly) {
    const year = Number(dateOnly[1]);
    const month = Number(dateOnly[2]);
    const day = Number(dateOnly[3]);
    const date = new Date(Date.UTC(year, month - 1, day));
    return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day ? value : '';
  }
  const date = new Date(value);
  return Number.isFinite(date.getTime()) ? date.toISOString().slice(0, 10) : '';
}

export function mapSuperadminSupportComplaintResponse(item: ComplaintResponseRow): SuperadminSupportComplaint {
  const normalizedStatus = (item.status ?? '').trim().toLowerCase().replace(/_/g, '-');
  const status = Object.values(SUPERADMIN_SUPPORT_COMPLAINT_STATUS).find(
    (candidate) => candidate.toLowerCase() === normalizedStatus,
  ) ?? SUPERADMIN_SUPPORT_COMPLAINT_STATUS.UNKNOWN;
  // Missing anonymity metadata is not proof of consent to disclose a student's identity.
  const isAnonymous = item.isAnonymous !== false;
  return {
    id: item.id,
    title: item.subject ?? item.title ?? '',
    description: item.description ?? '',
    date: dateOnly(item.createdAt ?? item.date),
    status,
    student: isAnonymous ? '' : item.student ?? '',
    isAnonymous,
    resolvedBy: item.resolvedBy ?? '',
    resolvedDate: dateOnly(item.resolvedDate),
    resolvedNote: item.resolvedNote ?? '',
  };
}
