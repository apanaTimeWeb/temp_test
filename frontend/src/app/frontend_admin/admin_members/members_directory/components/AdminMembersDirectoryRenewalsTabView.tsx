'use client';

import type { AdminMembersRenewal } from '@/app/frontend_admin/admin_members/members_directory/schemas/AdminMembersDirectorySchema';
import { ArrowDown, ArrowUp, ArrowUpDown, RotateCcw } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

type RenewalSortField = 'member' | 'plan' | 'expiresIn';

interface AdminMembersDirectoryRenewalsTabViewProps {
  demoRenewals: readonly AdminMembersRenewal[];
  onRecordReminder: (memberName: string) => void;
}

export function AdminMembersDirectoryRenewalsTabView({
  demoRenewals,
  onRecordReminder,
}: AdminMembersDirectoryRenewalsTabViewProps) {
  const t = useTranslations('ADMIN_MEMBERS');
  const [sortField, setSortField] = useState<RenewalSortField | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const toggleSort = (field: RenewalSortField) => {
    if (sortField === field) setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    else { setSortField(field); setSortDirection('asc'); }
  };

  const renewals = [...demoRenewals].sort((a, b) => {
    if (!sortField) return 0;
    if (sortField === 'member') {
      const cmp = a.member.localeCompare(b.member, undefined, { numeric: true, sensitivity: 'base' });
      return sortDirection === 'asc' ? cmp : -cmp;
    }
    if (sortField === 'plan') {
      const cmp = a.plan.localeCompare(b.plan, undefined, { numeric: true, sensitivity: 'base' });
      return sortDirection === 'asc' ? cmp : -cmp;
    }
    const aDays = a.expiresIn.unit === 'week' ? a.expiresIn.value * 7 : a.expiresIn.value;
    const bDays = b.expiresIn.unit === 'week' ? b.expiresIn.value * 7 : b.expiresIn.value;
    return sortDirection === 'asc' ? aDays - bDays : bDays - aDays;
  });

  const expiryLabel = (expiry: AdminMembersRenewal['expiresIn']) =>
    expiry.unit === 'week' ? t('RENEWAL_EXPIRY_WEEKS', { count: expiry.value }) : t('RENEWAL_EXPIRY_DAYS', { count: expiry.value });

  const renderHeader = (field: RenewalSortField, label: string) => {
    const isActive = sortField === field;
    return (
      <th scope="col" aria-sort={isActive ? (sortDirection === 'asc' ? 'ascending' : 'descending') : undefined} className="p-3">
        <button
          type="button"
          onClick={() => toggleSort(field)}
          className="group inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-text-secondary hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1 -mx-1"
          aria-label={`${label}, sort ${isActive ? (sortDirection === 'asc' ? 'descending' : 'ascending') : 'ascending'}`}
        >
          <span>{label}</span>
          {isActive ? (
            sortDirection === 'asc' ? (
              <ArrowUp className="text-warning-text font-bold shrink-0" size={14} aria-hidden="true" />
            ) : (
              <ArrowDown className="text-warning-text font-bold shrink-0" size={14} aria-hidden="true" />
            )
          ) : (
            <ArrowUpDown className="text-text-secondary opacity-60 group-hover:opacity-100 group-hover:text-warning-text motion-safe:transition-opacity shrink-0" size={14} aria-hidden="true" />
          )}
        </button>
      </th>
    );
  };

  return (
    <section className="admin-card admin-shared-card-padding" aria-labelledby="admin-members-renewals-title">
      <h2 id="admin-members-renewals-title" className="admin-shared-section-heading flex items-center gap-2">
        <RotateCcw size={20} className="text-warning-text" aria-hidden="true" />
        <span>{t('RENEWALS_TITLE')}</span>
      </h2>
      <div className="mt-4 grid gap-3 md:hidden" aria-label={t('RENEWALS_TITLE')}>
        {renewals.map((renewal) => (
          <article key={`mobile-${renewal.member}`} className="rounded-xl border border-border bg-surface-highlight p-4 shadow-card">
            <h3 className="font-semibold text-text-primary">{renewal.member}</h3>
            <dl className="mt-2 grid gap-2 text-sm">
              <div><dt className="text-text-secondary">{t('RENEWALS_CURRENT_PLAN')}</dt><dd className="text-purple font-medium">{renewal.plan}</dd></div>
              <div><dt className="text-text-secondary">{t('RENEWALS_EXPIRY_IN')}</dt><dd className="text-danger-text font-medium">{expiryLabel(renewal.expiresIn)}</dd></div>
            </dl>
            <button
              type="button"
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-warning bg-warning-bg px-3 py-1.5 text-xs font-semibold text-warning-text hover:opacity-90 motion-safe:transition-opacity disabled:opacity-50 mt-3"
              disabled={renewal.reminderRecorded}
              title={renewal.reminderRecorded ? t('RENEWAL_REMINDER_DISABLED_TITLE') : undefined}
              onClick={() => onRecordReminder(renewal.member)}
            >
              <RotateCcw size={14} aria-hidden="true" />
              <span>{renewal.reminderRecorded ? t('RENEWAL_REMINDER_RECORDED_LABEL') : t('RENEWAL_SEND_REMINDER')}</span>
            </button>
          </article>
        ))}
      </div>
      <div className="mt-4 hidden overflow-x-auto md:block">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="h-12 bg-surface-highlight uppercase text-xs text-text-secondary font-semibold border-b border-border">
              {renderHeader('member', t('RENEWALS_MEMBER'))}
              {renderHeader('plan', t('RENEWALS_CURRENT_PLAN'))}
              {renderHeader('expiresIn', t('RENEWALS_EXPIRY_IN'))}
              <th scope="col" className="p-3">{t('RENEWALS_ACTION')}</th>
            </tr>
          </thead>
          <tbody>
            {renewals.map((renewal) => (
              <tr key={renewal.member} className="h-12 border-b border-border text-text-primary motion-safe:transition-colors hover:bg-surface-hover even:bg-surface-zebra">
                <th scope="row" className="p-3 text-left font-medium text-text-primary">{renewal.member}</th>
                <td className="p-3 text-purple font-medium">{renewal.plan}</td>
                <td className="p-3 text-danger-text font-medium">{expiryLabel(renewal.expiresIn)}</td>
                <td className="p-3">
                  <button
                    type="button"
                    className="inline-flex min-h-9 items-center gap-1.5 rounded-xl border border-warning bg-warning-bg px-3 py-1.5 text-xs font-semibold text-warning-text hover:opacity-90 motion-safe:transition-opacity disabled:opacity-50"
                    disabled={renewal.reminderRecorded}
                    title={renewal.reminderRecorded ? t('RENEWAL_REMINDER_DISABLED_TITLE') : undefined}
                    onClick={() => onRecordReminder(renewal.member)}
                  >
                    <RotateCcw size={13} aria-hidden="true" />
                    <span>{renewal.reminderRecorded ? t('RENEWAL_REMINDER_RECORDED_LABEL') : t('RENEWAL_SEND_REMINDER')}</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
