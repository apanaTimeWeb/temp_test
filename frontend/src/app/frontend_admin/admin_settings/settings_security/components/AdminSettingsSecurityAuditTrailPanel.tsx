// components/AdminSettingsSecurityAuditTrailPanel.tsx
'use client';
import { useState, useMemo, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import {
  ShieldAlert,
  AlertTriangle,
  Info,
  Search,
  Filter,
  CheckCircle2,
  Eye,
  ExternalLink,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { AdminTablePagination } from '@/app/frontend_admin/components/ui/table/AdminTablePagination';
import { ADMIN_SECURITY_ANTI_FRAUD_FIXTURES } from '@/app/frontend_admin/admin_settings/settings_security/mocks/scenarios/admin_settings_security.scenarios';
import type {
  AntiFraudSeverity,
  AntiFraudEntityType,
  AntiFraudAuditRecord,
} from '@/app/frontend_admin/admin_settings/settings_security/types/AdminSettingsSecurityTypes';

export function AdminSettingsSecurityAuditTrailPanel() {
  const t = useTranslations('ADMIN_SECURITY');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [entityFilter, setEntityFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [inspectingRecord, setInspectingRecord] = useState<AntiFraudAuditRecord | null>(null);

  type AuditSortField = 'timestamp' | 'severity' | 'actionTitle' | 'targetEntity' | 'managerName';
  const [sortField, setSortField] = useState<AuditSortField | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const toggleSort = (field: AuditSortField) => {
    setPage(0);
    if (sortField === field) setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    else { setSortField(field); setSortDirection('asc'); }
  };

  const filteredLogs = useMemo(() => {
    const list = ADMIN_SECURITY_ANTI_FRAUD_FIXTURES.filter((item) => {
      if (severityFilter !== 'ALL' && item.severity !== severityFilter) return false;
      if (entityFilter !== 'ALL' && item.entityType !== entityFilter) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesManager = item.managerName.toLowerCase().includes(query);
        const matchesAction = item.actionTitle.toLowerCase().includes(query);
        const matchesTarget = item.targetEntity.toLowerCase().includes(query);
        const matchesBranch = item.branchName.toLowerCase().includes(query);
        if (!matchesManager && !matchesAction && !matchesTarget && !matchesBranch) return false;
      }
      return true;
    });

    if (!sortField) return list;
    return [...list].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      const cmp = aVal.localeCompare(bVal, undefined, { numeric: true, sensitivity: 'base' });
      return sortDirection === 'asc' ? cmp : -cmp;
    });
  }, [severityFilter, entityFilter, searchQuery, sortField, sortDirection]);

  useEffect(() => {
    setPage(0);
  }, [severityFilter, entityFilter, searchQuery]);

  const paginatedLogs = useMemo(() => {
    return filteredLogs.slice(page * pageSize, (page + 1) * pageSize);
  }, [filteredLogs, page, pageSize]);

  const renderSortableHeader = (field: AuditSortField, label: string, align: 'left' | 'center' = 'left') => {
    const isActive = sortField === field;
    return (
      <th scope="col" aria-sort={isActive ? (sortDirection === 'asc' ? 'ascending' : 'descending') : undefined} className={`px-3.5 py-3 whitespace-nowrap ${align === 'center' ? 'text-center' : 'text-left'}`}>
        <button
          type="button"
          onClick={() => toggleSort(field)}
          className={`group inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1 -mx-1 ${align === 'center' ? 'mx-auto' : ''}`}
          aria-label={`${label}, sort ${isActive ? (sortDirection === 'asc' ? 'descending' : 'ascending') : 'ascending'}`}
        >
          <span>{label}</span>
          {isActive ? (
            sortDirection === 'asc' ? (
              <ArrowUp className="text-primary font-bold shrink-0" size={14} aria-hidden="true" />
            ) : (
              <ArrowDown className="text-primary font-bold shrink-0" size={14} aria-hidden="true" />
            )
          ) : (
            <ArrowUpDown className="text-muted-foreground/40 group-hover:text-muted-foreground transition-colors shrink-0" size={14} aria-hidden="true" />
          )}
        </button>
      </th>
    );
  };

  const highRiskCount = ADMIN_SECURITY_ANTI_FRAUD_FIXTURES.filter(
    (i) => i.severity === 'HIGH_RISK'
  ).length;
  const mediumCount = ADMIN_SECURITY_ANTI_FRAUD_FIXTURES.filter(
    (i) => i.severity === 'MEDIUM_WARNING'
  ).length;

  return (
    <section className="space-y-4" aria-labelledby="anti-fraud-audit-title">
      {/* Panel Header */}
      <div className="flex flex-col gap-2 border-b border-border pb-4">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-destructive" />
          <h2 id="anti-fraud-audit-title" className="text-lg font-bold text-foreground">
            {t('AUDIT_TRAIL_TITLE')}
          </h2>
        </div>
        <p className="text-xs text-muted-foreground sm:text-sm">
          {t('AUDIT_TRAIL_SUBTITLE')}
        </p>
      </div>

      {/* Summary KPI Badges */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-lg border border-border bg-card p-3 shadow-xs">
          <p className="text-xs text-muted-foreground">{t('AUDIT_TOTAL_ACTIONS')}</p>
          <p className="mt-1 text-xl font-bold text-foreground">
            {ADMIN_SECURITY_ANTI_FRAUD_FIXTURES.length}
          </p>
        </div>
        <div className="rounded-lg border border-destructive-bg bg-destructive-bg p-3 shadow-xs">
          <p className="text-xs font-semibold text-destructive">{t('AUDIT_HIGH_RISK')}</p>
          <p className="mt-1 text-xl font-bold text-destructive">{highRiskCount}</p>
        </div>
        <div className="rounded-lg border border-warning-bg bg-warning-bg p-3 shadow-xs">
          <p className="text-xs font-semibold text-warning">{t('AUDIT_MEDIUM_WARNING')}</p>
          <p className="mt-1 text-xl font-bold text-warning-text">{mediumCount}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-3 shadow-xs">
          <p className="text-xs text-muted-foreground">Immutable Protection</p>
          <p className="mt-1 text-sm font-semibold text-success flex items-center gap-1">
            <CheckCircle2 className="h-4 w-4" />
            <span>Audit Lock Active</span>
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder={t('AUDIT_SEARCH_PLACEHOLDER')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border border-border bg-card pl-9 pr-3 py-1.5 text-xs sm:text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            />
          </div>

          {/* Severity Dropdown */}
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="rounded-md border border-border bg-card px-3 py-1.5 text-xs sm:text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <option value="ALL">{t('AUDIT_ALL_SEVERITIES')}</option>
            <option value="HIGH_RISK">{t('AUDIT_SEV_HIGH')}</option>
            <option value="MEDIUM_WARNING">{t('AUDIT_SEV_MEDIUM')}</option>
            <option value="LOW_INFO">{t('AUDIT_SEV_LOW')}</option>
          </select>

          {/* Entity Type Dropdown */}
          <select
            value={entityFilter}
            onChange={(e) => setEntityFilter(e.target.value)}
            className="rounded-md border border-border bg-card px-3 py-1.5 text-xs sm:text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <option value="ALL">{t('AUDIT_ALL_ENTITIES')}</option>
            <option value="FEE_DISCOUNT">Fee Overrides & Discounts</option>
            <option value="SEAT_STATUS">Seat Matrix Overrides</option>
            <option value="PAYMENT">Cash Payment Adjustments</option>
            <option value="SECURITY_DEPOSIT">Deposit Refunds</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="rounded-xl border border-border bg-card shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse" aria-label="Anti-Fraud Audit Trail">
            <thead>
              <tr className="border-b border-border bg-muted/50 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {renderSortableHeader('timestamp', t('AUDIT_COL_TIMESTAMP'))}
                {renderSortableHeader('severity', t('AUDIT_COL_SEVERITY'), 'center')}
                {renderSortableHeader('actionTitle', t('AUDIT_COL_ACTION'))}
                {renderSortableHeader('targetEntity', t('AUDIT_COL_CHANGE'))}
                {renderSortableHeader('managerName', t('AUDIT_COL_ACTOR'))}
                <th scope="col" className="px-3.5 py-3 whitespace-nowrap">{t('AUDIT_COL_NOTES')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginatedLogs.map((log) => (
                <tr key={log.id} className="hover:bg-muted/20 motion-safe:transition-colors">
                  {/* Timestamp */}
                  <td className="px-3.5 py-3 whitespace-nowrap font-mono text-xs text-muted-foreground">
                    {log.timestamp}
                  </td>

                  {/* Severity Badge */}
                  <td className="px-3.5 py-3 text-center whitespace-nowrap">
                    {log.severity === 'HIGH_RISK' && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-destructive-bg px-2 py-0.5 text-xs font-bold text-destructive">
                        <ShieldAlert className="h-3 w-3" />
                        <span>High Risk</span>
                      </span>
                    )}
                    {log.severity === 'MEDIUM_WARNING' && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-warning-bg px-2 py-0.5 text-xs font-semibold text-warning-text">
                        <AlertTriangle className="h-3 w-3" />
                        <span>Warning</span>
                      </span>
                    )}
                    {log.severity === 'LOW_INFO' && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                        <Info className="h-3 w-3" />
                        <span>Info</span>
                      </span>
                    )}
                  </td>

                  {/* Action & Target Entity */}
                  <td className="px-3.5 py-3 whitespace-nowrap">
                    <p className="font-semibold text-foreground">{log.actionTitle}</p>
                    <p className="text-xs font-medium text-primary">{log.targetEntity}</p>
                  </td>

                  {/* Change: Old vs New */}
                  <td className="px-3.5 py-3 whitespace-nowrap text-xs">
                    <p className="line-through text-muted-foreground">{log.oldValue}</p>
                    <p className="font-semibold text-foreground">➔ {log.newValue}</p>
                  </td>

                  {/* Actor / Manager & Branch */}
                  <td className="px-3.5 py-3 whitespace-nowrap">
                    <p className="font-medium text-foreground">{log.managerName}</p>
                    <p className="text-xs text-muted-foreground">
                      {log.managerRole} · <span className="font-medium text-foreground">{log.branchName}</span>
                    </p>
                  </td>

                  {/* Justification & IP */}
                  <td className="px-3.5 py-3">
                    <p className="text-xs text-foreground max-w-xs">{log.justificationNotes}</p>
                    <p className="font-mono text-[11px] text-muted-foreground mt-0.5">IP: {log.ipAddress}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <AdminTablePagination
          page={page}
          pageSize={pageSize}
          totalRows={filteredLogs.length}
          onPageChange={setPage}
          onPageSizeChange={(newSize) => {
            setPageSize(newSize);
            setPage(0);
          }}
        />
      </div>
    </section>
  );
}

export default AdminSettingsSecurityAuditTrailPanel;

