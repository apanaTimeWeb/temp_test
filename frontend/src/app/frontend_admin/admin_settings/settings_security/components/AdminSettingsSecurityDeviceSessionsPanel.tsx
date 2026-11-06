'use client';
// RESPONSIBILITY: AdminSecurityDeviceSessionsPanel component owned by admin_security; responsibility folder: admin_security_device_sessions_panel.

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { ADMIN_SECURITY_DEVICE_SESSION_FIXTURES } from '@/app/frontend_admin/admin_settings/settings_security/mocks/scenarios/admin_settings_security.scenarios';
import { AdminTablePagination } from '@/app/frontend_admin/components/ui/table/AdminTablePagination';

/** Renders synthetic device sessions; each revocation action explicitly reports the missing live contract. */
export default function AdminSecurityDeviceSessionsPanel() {
  const t = useTranslations('ADMIN_SECURITY');
  type DeviceSortField = 'managerKey' | 'deviceKey' | 'ip' | 'dateKey';
  const [sortField, setSortField] = useState<DeviceSortField | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const toggleSort = (field: DeviceSortField) => {
    setPage(0);
    if (sortField === field) setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    else { setSortField(field); setSortDirection('asc'); }
  };

  const sortedDevices = useMemo(() => {
    if (!sortField) return ADMIN_SECURITY_DEVICE_SESSION_FIXTURES;
    return [...ADMIN_SECURITY_DEVICE_SESSION_FIXTURES].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      const cmp = aVal.localeCompare(bVal, undefined, { numeric: true, sensitivity: 'base' });
      return sortDirection === 'asc' ? cmp : -cmp;
    });
  }, [sortField, sortDirection]);

  const paginatedDevices = useMemo(
    () => sortedDevices.slice(page * pageSize, (page + 1) * pageSize),
    [sortedDevices, page, pageSize]
  );

  const renderSortableHeader = (field: DeviceSortField, label: string) => {
    const isActive = sortField === field;
    return (
      <th scope="col" aria-sort={isActive ? (sortDirection === 'asc' ? 'ascending' : 'descending') : undefined} className="p-3 whitespace-nowrap">
        <button
          type="button"
          onClick={() => toggleSort(field)}
          className="group inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-text-secondary hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1 -mx-1"
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
            <ArrowUpDown className="text-text-secondary opacity-40 group-hover:opacity-100 transition-opacity shrink-0" size={14} aria-hidden="true" />
          )}
        </button>
      </th>
    );
  };

  return (
    <section className="admin-card p-6" aria-labelledby="admin-security-device-sessions-title">
      <h2 id="admin-security-device-sessions-title" className="text-section-title font-semibold text-text-primary">{t('DEVICE_SESSIONS_TITLE')}</h2>
      <p className="mt-1 text-sm text-text-secondary">{t('DEVICE_SESSIONS_DESCRIPTION')}</p>
      <div className="mt-4 space-y-3 md:hidden">
        {ADMIN_SECURITY_DEVICE_SESSION_FIXTURES.map((device) => (
          <article key={device.id} className="rounded-lg border border-border p-4">
            <dl className="grid grid-cols-1 gap-2 text-sm">
              <div><dt className="text-text-secondary">{t('COLUMN_MANAGER')}</dt><dd className="text-text-primary">{t(device.managerKey)}</dd></div>
              <div><dt className="text-text-secondary">{t('COLUMN_DEVICE')}</dt><dd className="text-text-primary">{t(device.deviceKey)}</dd></div>
              <div><dt className="text-text-secondary">{t('COLUMN_LOCATION_IP')}</dt><dd className="break-words text-text-primary">{t(device.locationKey)} ({device.ip})</dd></div>
              <div><dt className="text-text-secondary">{t('COLUMN_FIRST_SEEN')}</dt><dd className="text-text-primary">{t(device.dateKey)}</dd></div>
              <div><dt className="text-text-secondary">{t('COLUMN_ACTION')}</dt><dd><button type="button" className="admin-btn-ghost-danger min-h-11" disabled aria-describedby={`admin-security-revoke-help-${device.id}`}>{t('REVOKE')}</button><p id={`admin-security-revoke-help-${device.id}`} className="mt-1 text-sm text-text-secondary">{t('SESSION_REVOKE_BLOCKED')}</p></dd></div>
            </dl>
          </article>
        ))}
      </div>
      <div className="mt-4 hidden overflow-x-auto md:block">
        <table className="w-full min-w-190 text-left text-sm">
          <thead>
            <tr className="h-12 bg-surface-highlight uppercase text-xs text-text-secondary font-semibold border-b border-border">
              {renderSortableHeader('managerKey', t('COLUMN_MANAGER'))}
              {renderSortableHeader('deviceKey', t('COLUMN_DEVICE'))}
              {renderSortableHeader('ip', t('COLUMN_LOCATION_IP'))}
              {renderSortableHeader('dateKey', t('COLUMN_FIRST_SEEN'))}
              <th scope="col" className="p-3">{t('COLUMN_ACTION')}</th>
            </tr>
          </thead>
          <tbody>
            {paginatedDevices.map((device) => (
              <tr key={device.id} className="h-12 border-b border-border text-text-primary motion-safe:transition-colors hover:bg-surface-hover even:bg-surface-zebra">
                <td className="p-3 text-text-primary">{t(device.managerKey)}</td>
                <td className="p-3 text-text-primary">{t(device.deviceKey)}</td>
                <td className="p-3 text-text-secondary">{t(device.locationKey)} ({device.ip})</td>
                <td className="p-3 text-text-secondary">{t(device.dateKey)}</td>
                <td className="p-3">
                  <button type="button" data-testid={`admin_security-AdminSettingsSecurityMain-control-revoke-${device.id}`} className="admin-btn-ghost-danger min-h-11" disabled aria-describedby="admin-security-session-revoke-help" title={t('SESSION_REVOKE_BLOCKED')}>{t('REVOKE')}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {ADMIN_SECURITY_DEVICE_SESSION_FIXTURES.length > 0 && (
          <AdminTablePagination
            page={page}
            pageSize={pageSize}
            totalCount={ADMIN_SECURITY_DEVICE_SESSION_FIXTURES.length}
            onPageChange={setPage}
            onPageSizeChange={(newSize: number) => {
              setPageSize(newSize);
              setPage(0);
            }}
          />
        )}
        <p id="admin-security-session-revoke-help" className="mt-3 text-sm text-text-secondary" role="note">{t('SESSION_REVOKE_BLOCKED')}</p>
      </div>
    </section>
  );
}
