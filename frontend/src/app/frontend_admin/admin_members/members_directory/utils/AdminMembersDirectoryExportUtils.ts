import { format, isValid, parseISO } from 'date-fns';
import { enIN, hi } from 'date-fns/locale';

/** Formats date-only values through date-fns without applying a UTC timestamp conversion. */
export function formatAdminMembersDate(date: string, locale: string, fallback: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return fallback;
  const parsed = parseISO(date);
  if (!isValid(parsed) || format(parsed, 'yyyy-MM-dd') !== date) return fallback;
  return format(parsed, 'dd MMM yyyy', { locale: locale.toLowerCase().startsWith('hi') ? hi : enIN });
}

import type { AdminMembersMember } from '@/app/frontend_admin/admin_members/members_directory/schemas/AdminMembersDirectorySchema';

function quoteCsvCell(value: string): string {
  const formulaSafeValue = /^[\u0000-\u0020]*[=+\-@]/.test(value) ? `'${value}` : value;
  return `"${formulaSafeValue.replaceAll('"', '""')}"`;
}

/** Builds a client-side CSV from exactly the provided member rows; the caller must label demo-only sources. */
export function buildAdminMembersDemoCsv(members: readonly AdminMembersMember[]): string {
  const columns: ReadonlyArray<keyof AdminMembersMember> = ['id', 'name', 'email', 'phone', 'plan', 'status', 'expiryDate'];
  const rows = [
    columns.map((column) => quoteCsvCell(column)).join(','),
    ...members.map((member) => columns.map((column) => quoteCsvCell(String(member[column] ?? ''))).join(',')),
  ];
  return `\uFEFF${rows.join('\r\n')}`;
}

/** Downloads the explicitly-labelled demo CSV; it never implies a server export. */
export function downloadAdminMembersDemoCsv(members: readonly AdminMembersMember[]): void {
  if (typeof window === 'undefined') return;
  const blob = new Blob([buildAdminMembersDemoCsv(members)], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'smart-gym-360-demo-members.csv';
  anchor.hidden = true;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
