'use client';
// RESPONSIBILITY: AdminAuditLogsFilters component owned by admin_audit_logs; responsibility folder: admin_audit_logs_filters.

import { useTranslations } from 'next-intl';
import { Search } from 'lucide-react';
import { ADMIN_AUDIT_LOGS_FILTERS } from '@/app/frontend_admin/admin_system/system_audit_logs/config/admin_system_audit_logs.url_config';
import type { AdminAuditLogsFilter } from '@/app/frontend_admin/admin_system/system_audit_logs/types/AdminSystemAuditLogsTypes';
import type { AdminAuditLogsFiltersProps } from '@/app/frontend_admin/admin_system/system_audit_logs/types/AdminSystemAuditLogsTypes';


const FILTER_TRANSLATION_KEYS = {
  all: 'FILTER_ALL', danger: 'SEVERITY_DANGER', warning: 'SEVERITY_WARNING', info: 'SEVERITY_INFO', success: 'SEVERITY_SUCCESS', unknown: 'FILTER_UNKNOWN',
} as const;

export default function AdminAuditLogsFilters({ filter, onFilterChange, search, onSearchChange }: AdminAuditLogsFiltersProps) {
  const t = useTranslations('ADMIN_AUDIT_LOGS');
  return (
    <section className="admin-card space-y-4 p-4" aria-label={t('FILTERS_LABEL')}>
      <div className="relative">
        <Search size={18} strokeWidth={2} aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
        <input aria-label={t('SEARCH_LABEL')} className="admin-input pl-10" placeholder={t('SEARCH_PLACEHOLDER')} value={search} onChange={(event) => onSearchChange(event.target.value)} />
      </div>
      <div className="flex flex-wrap gap-2" role="group" aria-label={t('SEVERITY_FILTER_LABEL')}>
        {ADMIN_AUDIT_LOGS_FILTERS.map((severity) => (
          <button key={severity} type="button" aria-pressed={filter === severity} className={`admin-tab ${filter === severity ? 'active' : ''}`} onClick={() => onFilterChange(severity)}>
            {t(FILTER_TRANSLATION_KEYS[severity])}
          </button>
        ))}
      </div>
    </section>
  );
}


export type { AdminAuditLogsFiltersProps };
