'use client';
// Responsibility: AdminFinanceAutoSuspendStudentsTable component owned by admin_finance; responsibility folder: admin_finance_auto_suspend_sections.

// RESPONSIBILITY: Displays currently suspended students and raises reminder/restore intents.

import { Ban, Bell, RotateCcw } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { AdminFinanceSuspendedStudent } from '@/app/frontend_admin/admin_finance/finance_auto_suspend/types/AdminFinanceAutoSuspendTypes';
import type { AdminFinanceAutoSuspendStudentsTableProps } from '@/app/frontend_admin/admin_finance/finance_auto_suspend/types/AdminFinanceAutoSuspendTypes';


export default function AdminFinanceAutoSuspendStudentsTable({ students, isLoading, canRestore, onRestore }: AdminFinanceAutoSuspendStudentsTableProps) {
  const t = useTranslations('ADMIN_FINANCE_AUTO_SUSPEND');
  return (
    <section className="min-w-0 overflow-hidden rounded-xl border border-border bg-card shadow-card overflow-x-auto" aria-label={t('STUDENTS')}>
      <div className="flex items-center gap-2 p-4 border-b border-border pb-4">
<Ban size={18} className="text-danger-text" strokeWidth={2} />
<span className="text-body text-text-primary font-semibold">{t('STUDENTS')}</span>
</div>
      <table className="w-full">
        <thead>
<tr className="bg-surface-highlight text-caption text-text-secondary">
<th className="px-4 py-3 text-left">{t('STUDENT')}</th>
<th className="px-4 py-3 text-left">{t('SEAT')}</th>
<th className="px-4 py-3 text-left">{t('SHIFT')}</th>
<th className="px-4 py-3 text-left">{t('LAST_PAYMENT_DATE')}</th>
<th className="px-4 py-3 text-left">{t('DAYS_OVERDUE')}</th>
<th className="px-4 py-3 text-left">{t('SUSPENDED_SINCE')}</th>
<th className="px-4 py-3 text-right">{t('ACTIONS')}</th>
</tr>
</thead>
        <tbody>{isLoading ? Array.from({ length: 3 }).map((_, rowIndex) => <tr key={rowIndex} className="border-b border-border text-text-primary">{Array.from({ length: 7 }).map((__, cellIndex) => <td key={cellIndex} className="px-4 py-3">
<div className="motion-safe:animate-pulse rounded-sm bg-skeleton-base h-4 w-16" />
</td>)}</tr>) : students.length === 0 ? (
          <tr>
<td colSpan={7}>
<div className="flex min-h-56 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-card p-6 text-center">
<div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-subtle text-primary">🔓</div>
<p className="text-section-title font-semibold text-text-primary">{t('EMPTY')}</p>
</div>
</td>
</tr>
        ) : students.map((student) => (
          <tr key={student.id} className="motion-safe:transition-colors hover:bg-primary-subtle border-b border-border text-text-primary">
<td className="px-4 py-3">
<div className="text-body font-semibold text-text-primary">{student.studentName}</div>
<div className="text-caption text-text-secondary">{student.smartId}</div>
</td>
<td className="px-4 py-3 text-body text-text-primary">{student.seat}</td>
<td className="px-4 py-3">
<span className="inline-flex min-h-6 items-center gap-1 rounded-full border border-transparent px-2 py-1 text-badge font-semibold capitalize whitespace-nowrap bg-card text-text-secondary border-border">{student.shift}</span>
</td>
<td className="px-4 py-3 text-caption text-text-secondary">—</td>
<td className="px-4 py-3">
<span className="text-danger-text font-semibold">{student.daysOverdue}d</span>
</td>
<td className="px-4 py-3 text-caption text-text-secondary">{student.suspendedSince}</td>
<td className="px-4 py-3">
<div className="flex items-center justify-end gap-2">
<button type="button" data-testid={`admin-finance-suspend-reminder-${student.studentId}`} className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-md border border-border px-3 py-2 text-body font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 bg-card text-text-secondary cursor-not-allowed opacity-60" disabled title={t('REMINDER_BLOCKED')}>
<Bell size={18} strokeWidth={2} /> {t('SEND_REMINDER')}</button>
<button type="button" data-testid={`admin-finance-suspend-restore-${student.studentId}`} className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-md border border-border px-3 py-2 text-body font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 bg-success-bg text-success-text border-success-bg cursor-pointer" disabled={!canRestore} title={!canRestore ? t('RESTORE_BLOCKED') : undefined} onClick={() => onRestore(student)}>
<RotateCcw size={18} strokeWidth={2} /> {t('MANUAL_RESTORE')}</button>
</div>
</td>
</tr>
        ))}</tbody>
      </table>
    </section>
  );
}


export type { AdminFinanceAutoSuspendStudentsTableProps };
