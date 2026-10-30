'use client';
import type { AdminStudentsColumnDefinitionsOptions } from '@/app/frontend_admin/admin_members/members_students/types/AdminMembersStudentsTypes';

// DATA FLOW: members_students route/container -> this hook or store -> owning module components; state and query updates return through explicit typed callbacks.
import { useMemo } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import type { DataGridColumn } from '@/app/frontend_admin/components/ui/data-grid/DataGrid';
import type { AdminStudentsStudent } from '@/app/frontend_admin/admin_members/members_students/types/AdminMembersStudentsTypes';
import { ADMIN_STUDENTS_BUSINESS_STATUSES, ADMIN_STUDENTS_STATUS_BADGE_CLASSES, ADMIN_STUDENTS_FEE_STATUS_BADGE_CLASSES } from '@/app/frontend_admin/admin_members/members_students/config/admin_members_students.url_config';
import { formatAdminStudentsDate, getAdminStudentsExpiryDatePresentation } from '@/app/frontend_admin/admin_members/members_students/utils/AdminMembersStudentsFormatUtils';

/** @description Builds the Students grid column model and keeps row actions connected to module state. @dependencies AdminStudents types and shell grid contract. @edge-case Missing nullable cell values render as em-dash through the grid primitive. */
export default function useAdminStudentsColumnDefinitions({ onSelectStudent }: AdminStudentsColumnDefinitionsOptions) {
  const t = useTranslations('ADMIN_STUDENTS');
  const locale = useLocale();
  const statusLabel = (value: unknown) => value === 'Active' ? t('STATUS_ACTIVE') : value === 'Suspended' ? t('STATUS_SUSPENDED') : value === 'Blocked' ? t('STATUS_BLOCKED') : t('STATUS_UNKNOWN');
  const feeLabel = (value: unknown) => value === 'Paid' ? t('FEE_PAID') : value === 'Due' ? t('FEE_DUE') : t('FEE_UNKNOWN');
  return useMemo<readonly DataGridColumn<AdminStudentsStudent>[]>(() => [
    { field: 'id', headerName: t('COLUMN_ID'), flex: 0.8, minWidth: 90,  },
    { field: 'name', headerName: t('COLUMN_STUDENT_NAME'), flex: 1.5, minWidth: 150 },
    { field: 'phone', headerName: t('COLUMN_MOBILE'), flex: 1.2, minWidth: 120 },
    { field: 'shift', headerName: t('COLUMN_SHIFT'), flex: 1, minWidth: 110 },
    { field: 'seat', headerName: t('COLUMN_SEAT'), flex: 0.8, minWidth: 90 },
    { field: 'plan', headerName: t('COLUMN_PLAN'), flex: 1, minWidth: 100 },
    { field: 'joinDate', headerName: t('COLUMN_JOINED'), flex: 1.2, minWidth: 120, cellRenderer: ({ value }) => formatAdminStudentsDate(value, locale) },
    { field: 'expiryDate', headerName: t('COLUMN_EXPIRES'), flex: 1.2, minWidth: 120, cellRenderer: ({ value }) => { const expiry = getAdminStudentsExpiryDatePresentation(value, new Date(), locale); return <span className={expiry.className} data-expiry-state={expiry.state}>{expiry.label}</span>; } },
    { field: 'feeStatus', headerName: t('COLUMN_FEE'), flex: 0.8, minWidth: 90, cellRenderer: ({ value }) => { const fee: keyof typeof ADMIN_STUDENTS_FEE_STATUS_BADGE_CLASSES = value === 'Paid' || value === 'Due' ? value : 'Unknown'; const cls = ADMIN_STUDENTS_FEE_STATUS_BADGE_CLASSES[fee]; return <span data-testid="admin_members_students-useAdminStudentsColumnDefinitions-state-001" className={`admin-badge ${cls}`}>{feeLabel(fee)}</span>; } },
    { field: 'status', headerName: t('COLUMN_STATUS'), flex: 1, minWidth: 110, cellRenderer: ({ value }) => <span data-testid="admin_members_students-useAdminStudentsColumnDefinitions-state-002" className={`admin-badge ${ADMIN_STUDENTS_STATUS_BADGE_CLASSES[ADMIN_STUDENTS_BUSINESS_STATUSES.find((status) => status === value) ?? 'Unknown']}`}>{statusLabel(value)}</span> },
    { headerName: t('COLUMN_ACTIONS'), flex: 1.2, minWidth: 220, sortable: false, cellRenderer: ({ data }) => { const student = data; return <div className="flex items-center gap-2">
<button data-testid="admin_members_students-useAdminStudentsColumnDefinitions-control-003" className="min-h-11 min-w-11 inline-flex items-center justify-center rounded-md border border-border px-2 py-1 text-caption text-primary" onClick={() => onSelectStudent(student)}>{t('ACTION_VIEW')}</button>
{student.status === 'Active' && <button type="button" data-testid="admin_members_students-useAdminStudentsColumnDefinitions-control-004" className="min-h-11 min-w-11 inline-flex items-center justify-center rounded-md border border-border px-2 py-1 text-caption text-warning-text opacity-60" disabled title={t('STATUS_CHANGE_BLOCKED')}>{t('ACTION_SUSPEND')}</button>}
{student.status !== 'Blocked' && <button type="button" data-testid="admin_members_students-useAdminStudentsColumnDefinitions-control-005" className="min-h-11 min-w-11 inline-flex items-center justify-center rounded-md border border-border px-2 py-1 text-caption text-danger-text opacity-60" disabled title={t('STATUS_CHANGE_BLOCKED')}>{t('ACTION_BLOCK')}</button>}</div>; } },
  ], [locale, onSelectStudent, t]);
}
