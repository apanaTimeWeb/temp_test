// DATA FLOW: system_audit_logs route/container -> this hook or store -> owning module components; state and query updates return through explicit typed callbacks.
'use client';

import { useEffect, useMemo, useState } from 'react';
import { useLocale } from 'next-intl';
import { useAdminApplicationInfrastructureUrlQueryState } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_hooks/useAdminApplicationInfrastructureUrlQueryState';
import { ADMIN_AUDIT_LOGS_FILTERS } from '@/app/frontend_admin/admin_system/system_audit_logs/config/admin_system_audit_logs.url_config';
import { formatAdminAuditLogsTimestamp } from '@/app/frontend_admin/admin_system/system_audit_logs/utils/AdminSystemAuditLogsViewUtils';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { fetchAdminAuditLogs } from '@/app/frontend_admin/admin_system/system_audit_logs/api/admin_system_audit_logs_api';
import { ADMIN_AUDIT_LOGS_QUERY_KEYS } from '@/app/frontend_admin/admin_system/system_audit_logs/api/admin_system_audit_logs.query_keys';
import type { AdminAuditLogsFilter, AdminAuditLogsRecord } from '@/app/frontend_admin/admin_system/system_audit_logs/types/AdminSystemAuditLogsTypes';
import { filterAdminAuditLogsRecords } from '@/app/frontend_admin/admin_system/system_audit_logs/utils/AdminSystemAuditLogsViewUtils';

export default function useAdminSystemAuditLogsMain() {
  const t = useTranslations('ADMIN_AUDIT_LOGS');
  const locale = useLocale();
  const [filter, setFilter] = useAdminApplicationInfrastructureUrlQueryState<AdminAuditLogsFilter>('admin-audit-logs-severity', 'all', { validValues: ADMIN_AUDIT_LOGS_FILTERS });
  const [search, setSearch] = useAdminApplicationInfrastructureUrlQueryState<string>('admin-audit-logs-search', '');
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  useEffect(() => {
    const timeoutId = window.setTimeout(() => setDebouncedSearch(search), 300);
    return () => window.clearTimeout(timeoutId);
  }, [search]);
  const [selectedRecord, setSelectedRecord] = useState<AdminAuditLogsRecord | null>(null);
  const logsQuery = useQuery({ queryKey: ADMIN_AUDIT_LOGS_QUERY_KEYS.list(), queryFn: fetchAdminAuditLogs });
  const logs = logsQuery.data ?? [];
  const filtered = useMemo(() => filterAdminAuditLogsRecords(logs, filter, debouncedSearch), [filter, logs, debouncedSearch]);
  const selectedRecordDetails = selectedRecord ? [
    [t('TABLE_TIME'), formatAdminAuditLogsTimestamp(selectedRecord.timestamp, locale)],
    [t('TABLE_ACTION'), selectedRecord.action],
    [t('TABLE_MODULE'), selectedRecord.module],
    [t('TABLE_PERFORMED_BY'), selectedRecord.performedBy],
    [t('DETAILS_ROLE'), selectedRecord.role],
    [t('TABLE_DETAILS'), selectedRecord.details],
    [t('TABLE_SEVERITY'), t(
      selectedRecord.severity === 'danger' ? 'SEVERITY_DANGER'
        : selectedRecord.severity === 'warning' ? 'SEVERITY_WARNING'
          : selectedRecord.severity === 'success' ? 'SEVERITY_SUCCESS'
            : selectedRecord.severity === 'unknown' ? 'SEVERITY_UNKNOWN'
              : 'SEVERITY_INFO',
    )],
    [t('DETAILS_IP'), selectedRecord.ip],
  ] : [];
  return { t, filter, setFilter, search, setSearch, logsQuery, filtered, selectedRecord, setSelectedRecord, selectedRecordDetails, formatTimestamp: (value: string) => formatAdminAuditLogsTimestamp(value, locale) } as const;
}
