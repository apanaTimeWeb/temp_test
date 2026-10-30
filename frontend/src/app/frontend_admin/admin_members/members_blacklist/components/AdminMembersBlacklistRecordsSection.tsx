// RESPONSIBILITY: AdminBlacklistRecordsSection component owned by admin_blacklist; responsibility folder: admin_blacklist_records_section.
'use client';

import { useTranslations } from 'next-intl';
import { type DataGridColumn } from '@/app/frontend_admin/components/ui/data-grid/DataGrid';
import type { AdminBlacklistRecord } from '@/app/frontend_admin/admin_members/members_blacklist/types/AdminMembersBlacklistTypes';
import AdminBlacklistRecordsTable from '@/app/frontend_admin/admin_members/members_blacklist/components/AdminMembersBlacklistRecordsTable';
import AdminEmptyState from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveEmptyState';
import { SearchX, ShieldAlert } from 'lucide-react';
import type { AdminBlacklistRecordsSectionProps } from '@/app/frontend_admin/admin_members/members_blacklist/types/AdminMembersBlacklistTypes';


/** Owns the record-count, loading, error, empty and table states as one coherent data section. */
export default function AdminBlacklistRecordsSection({ records, columns, isLoading, isError, errorMessage, onRetry, onRowClicked }: AdminBlacklistRecordsSectionProps) {
  const t = useTranslations('ADMIN_BLACKLIST');
  return (
    <section aria-label={t('RECORDS_SECTION')} className="space-y-4">
      <div className="flex items-start gap-3 rounded-lg border border-border bg-danger-bg p-4" role={isError ? 'alert' : 'status'} aria-live="polite">
        <ShieldAlert size={18} strokeWidth={2} aria-hidden="true" className="mt-0.5 shrink-0 text-danger-text" />
        <p className="text-text-secondary"><strong className="text-primary">{isLoading ? t('COUNT_LOADING') : isError ? t('COUNT_UNAVAILABLE') : t('COUNT_MESSAGE', { count: records.length })}</strong>{isLoading ? t('COUNT_LOADING_DESCRIPTION') : isError ? t('COUNT_FAILED_DESCRIPTION') : t('CURRENTLY_BLACKLISTED')}</p>
      </div>
      {isError ? (
        <div className="rounded-lg border border-border bg-overlay p-6 text-danger-text" role="alert">
          {errorMessage ?? t('LOAD_ERROR')}
          <button type="button" className="ml-3 min-h-11 rounded border border-border px-3 py-2 text-primary" onClick={onRetry}>{t('RETRY')}</button>
        </div>
      ) : isLoading ? (
        <section role="status" aria-busy="true" aria-label={t('LOADING_ARIA')} className="space-y-4 rounded-lg border border-border bg-card p-4 sm:p-6">
          <span className="sr-only">{t('LOADING')}</span>
          <div className="h-8 w-56 max-w-full rounded bg-skeleton-highlight motion-safe:animate-pulse" />
          <div className="grid gap-3 sm:grid-cols-2"><div className="h-11 rounded bg-skeleton-base motion-safe:animate-pulse" /><div className="h-11 rounded bg-skeleton-highlight motion-safe:animate-pulse" /></div>
          <div className="space-y-2">{Array.from({ length: 5 }, (_, index) => <div key={`skeleton-${index + 1}`} className="h-12 rounded bg-skeleton-base motion-safe:animate-pulse" />)}</div>
        </section>)
        : records.length === 0 ? <AdminEmptyState icon={SearchX} title={t('EMPTY_TITLE')} description={t('EMPTY_DESCRIPTION')} />
          : <AdminBlacklistRecordsTable records={records} columns={columns} onRowClicked={onRowClicked} />}
    </section>
  );
}


export type { AdminBlacklistRecordsSectionProps };
