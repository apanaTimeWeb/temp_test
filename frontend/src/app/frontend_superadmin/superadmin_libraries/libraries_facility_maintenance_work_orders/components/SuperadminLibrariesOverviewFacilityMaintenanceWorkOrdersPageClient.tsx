'use client';
import SuperadminLibrariesOverviewFacilityMaintenanceWorkOrdersEmptyState from '@/app/frontend_superadmin/superadmin_libraries/libraries_facility_maintenance_work_orders/components/SuperadminLibrariesOverviewFacilityMaintenanceWorkOrdersEmptyState';
/** Responsibility: Superadmin System Maintenance Page Client; keep this view focused on its named module UI responsibility and delegate domain/state logic to module-owned hooks. */
/** Data-Flow: canonical route -> SuperadminLibrariesOverviewFacilityMaintenanceWorkOrdersPageClient -> feature-local sample fixtures and local UI state -> preview rendering; no persistence is claimed. */

import { useTranslations } from 'next-intl';
import { SuperadminLibrariesOverviewFacilityMaintenanceWorkOrdersKpiCard as KpiCard } from '@/app/frontend_superadmin/superadmin_libraries/libraries_facility_maintenance_work_orders/components/SuperadminLibrariesOverviewFacilityMaintenanceWorkOrdersKpiCard';
import { SuperadminLibrariesOverviewFacilityMaintenanceWorkOrdersCard as Card } from '@/app/frontend_superadmin/superadmin_libraries/libraries_facility_maintenance_work_orders/components/SuperadminLibrariesOverviewFacilityMaintenanceWorkOrdersCard';
import { SuperadminLibrariesOverviewFacilityMaintenanceWorkOrdersCardHeader as CardHeader } from '@/app/frontend_superadmin/superadmin_libraries/libraries_facility_maintenance_work_orders/components/SuperadminLibrariesOverviewFacilityMaintenanceWorkOrdersCardHeader';
import { SuperadminLibrariesOverviewFacilityMaintenanceWorkOrdersCardTitle as CardTitle } from '@/app/frontend_superadmin/superadmin_libraries/libraries_facility_maintenance_work_orders/components/SuperadminLibrariesOverviewFacilityMaintenanceWorkOrdersCardTitle';
import { SuperadminLibrariesOverviewFacilityMaintenanceWorkOrdersCardDescription as CardDescription } from '@/app/frontend_superadmin/superadmin_libraries/libraries_facility_maintenance_work_orders/components/SuperadminLibrariesOverviewFacilityMaintenanceWorkOrdersCardDescription';
import { SuperadminLibrariesOverviewFacilityMaintenanceWorkOrdersCardContent as CardContent } from '@/app/frontend_superadmin/superadmin_libraries/libraries_facility_maintenance_work_orders/components/SuperadminLibrariesOverviewFacilityMaintenanceWorkOrdersCardContent';
import { SuperadminLibrariesOverviewFacilityMaintenanceWorkOrdersBadge as Badge } from '@/app/frontend_superadmin/superadmin_libraries/libraries_facility_maintenance_work_orders/components/SuperadminLibrariesOverviewFacilityMaintenanceWorkOrdersBadge';
import { SuperadminLibrariesOverviewFacilityMaintenanceWorkOrdersButton as Button } from '@/app/frontend_superadmin/superadmin_libraries/libraries_facility_maintenance_work_orders/components/SuperadminLibrariesOverviewFacilityMaintenanceWorkOrdersButton';
import { Wrench, Package, Lock, ChevronRight } from 'lucide-react';

import {
  SUPERADMIN_SYSTEM_ASSET_MAINTENANCE_SAMPLES as ASSETS,
  SUPERADMIN_SYSTEM_LOCKER_MAINTENANCE_SAMPLES as LOCKERS,
  SUPERADMIN_SYSTEM_SEAT_MAINTENANCE_SAMPLES as SEATS,
} from '@/app/frontend_superadmin/superadmin_libraries/libraries_facility_maintenance_work_orders/mocks/fixtures/SuperadminLibrariesOverviewFacilityMaintenanceWorkOrdersMockFixtures';

/**
 * Renders the `superadmin_system` view owned by `SuperadminLibrariesOverviewFacilityMaintenanceWorkOrdersPageClient`.
 * Demonstration mutations remain local preview behavior and do not imply server persistence.
 */
export default function SuperadminLibrariesOverviewFacilityMaintenanceWorkOrdersPageClient() {
  const tCopy = useTranslations('SUPERADMIN_SYSTEM');
  const seatsNeedingAttention = SEATS.filter(s => s.status === 'Needs Attention').length;
  const assetsOverdue = ASSETS.filter(a => a.daysOverdue > 0).length;
  const lockerIssues = LOCKERS.filter(l => l.status === 'Issue Reported').length;

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-2 text-secondary text-xs font-medium tracking-wide mb-1">
          <span>{tCopy("COPY.SYSTEM")}</span>
          <ChevronRight size={12} />
          <span>{tCopy("COPY.MAINTENANCE")}</span>
        </div>
        <h1 className="text-3xl font-bold text-primary flex items-center gap-3">
          <Wrench size={28} className="text-primary" />
          {tCopy("COPY.MAINTENANCE_DASHBOARD")}</h1>
        <p className="text-secondary mt-1 text-sm">{tCopy("COPY.TRACK_AND_MANAGE_MAINTENANCE_FOR_SEATS_ASSETS_AND_LOCKERS")}</p>
        <p className="mt-3 rounded-lg border border-border bg-warning-bg p-3 text-sm text-warning" role="status">{tCopy("COPY.PREVIEW_ONLY_SEAT_ASSET_AND_LOCKER_RECORDS_ARE_SYNTHETIC_EXAMPLES__C0136DBC")}</p>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <KpiCard title={tCopy("COPY.SEATS_NEEDING_ATTENTION")} value={seatsNeedingAttention} icon="🪑" trend="down" trendLabel={tCopy("COPY.ACTION_REQUIRED")} />
        <KpiCard title={tCopy("COPY.ASSETS_OVERDUE")} value={assetsOverdue} icon="⚙️" trend="down" trendLabel={tCopy("COPY.SERVICE_OVERDUE")} />
        <KpiCard title={tCopy("COPY.LOCKER_ISSUES")} value={lockerIssues} icon="🔒" trend="down" trendLabel={tCopy("COPY.REPORTED_ISSUES")} />
      </div>

      {/* Section 1 — Seats */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Wrench size={18} className="text-primary" /> {tCopy("COPY.SEATS")}</CardTitle>
          <CardDescription>{tCopy("COPY.SEAT_MAINTENANCE_STATUS_AND_LAST_SERVICE_LOG")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-secondary text-xs uppercase tracking-wide">
                  <th className="text-left py-3 pr-4">{tCopy("COPY.SEAT_2")}</th>
                  <th className="text-left py-3 pr-4">{tCopy("COPY.STATUS")}</th>
                  <th className="text-left py-3 pr-4">{tCopy("COPY.LAST_MAINTENANCE")}</th>
                  <th className="text-left py-3 pr-4">{tCopy("COPY.DAYS_SINCE")}</th>
                  <th className="text-left py-3">{tCopy("COPY.ACTION")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {SEATS.length === 0 ? (
                  <tr><td colSpan={5}><SuperadminLibrariesOverviewFacilityMaintenanceWorkOrdersEmptyState /></td></tr>
                ) : SEATS.map((seat) => (
                  <tr key={seat.id} className="hover:bg-card motion-safe:transition-colors motion-reduce:transition-none">
                    <td className="py-3 pr-4 font-mono font-medium text-primary">{seat.id}</td>
                    <td className="py-3 pr-4">
                      <Badge variant={seat.status === 'OK' ? 'success' : 'danger'}>{seat.status}</Badge>
                    </td>
                    <td className="py-3 pr-4 text-secondary">{seat.lastMaint}</td>
                    <td className="py-3 pr-4">
                      <span className={seat.daysSince > 30 ? 'text-danger font-semibold' : 'text-secondary'}>
                        {seat.daysSince}{tCopy("COPY.D")}</span>
                    </td>
                    <td className="py-3">
                      <Button id={`superadmin_libraries_facility_maintenance_work_orders-log-seat-maint-${seat.id}`} variant="ghost" size="sm" disabled title={tCopy("COPY.UNAVAILABLE_NO_MAINTENANCE_WRITE_API_CONTRACT_IS_SUPPLIED")} data-testid={`superadmin_libraries_facility_maintenance_work_orders-log-seat-maint-${seat.id}`}>{tCopy("COPY.LOG_MAINTENANCE")}</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Section 2 — Assets */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Package size={18} className="text-primary" /> {tCopy("COPY.ASSETS")}</CardTitle>
          <CardDescription>{tCopy("COPY.EQUIPMENT_AND_INVENTORY_MAINTENANCE_TRACKING")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-secondary text-xs uppercase tracking-wide">
                  <th className="text-left py-3 pr-4">{tCopy("COPY.ASSET")}</th>
                  <th className="text-center py-3 pr-4">{tCopy("COPY.QTY")}</th>
                  <th className="text-left py-3 pr-4">{tCopy("COPY.STATUS")}</th>
                  <th className="text-left py-3 pr-4">{tCopy("COPY.LAST_SERVICED")}</th>
                  <th className="text-left py-3 pr-4">{tCopy("COPY.NEXT_DUE")}</th>
                  <th className="text-left py-3 pr-4">{tCopy("COPY.DAYS_OVERDUE")}</th>
                  <th className="text-left py-3">{tCopy("COPY.ACTION")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {ASSETS.length === 0 ? (
                  <tr><td colSpan={7}><SuperadminLibrariesOverviewFacilityMaintenanceWorkOrdersEmptyState /></td></tr>
                ) : ASSETS.map((asset) => (
                  <tr key={asset.name} className="hover:bg-card motion-safe:transition-colors motion-reduce:transition-none">
                    <td className="py-3 pr-4 font-medium text-primary">{asset.name}</td>
                    <td className="py-3 pr-4 text-center text-secondary">{asset.qty}</td>
                    <td className="py-3 pr-4">
                      <Badge variant={asset.status === 'OK' ? 'success' : asset.status === 'Due Soon' ? 'warning' : 'danger'}>
                        {asset.status}
                      </Badge>
                    </td>
                    <td className="py-3 pr-4 text-secondary">{asset.lastServiced}</td>
                    <td className="py-3 pr-4 text-secondary">{asset.nextDue}</td>
                    <td className="py-3 pr-4">
                      {asset.daysOverdue > 0 ? (
                        <Badge variant="danger">+{asset.daysOverdue}{tCopy("COPY.D_OVERDUE")}</Badge>
                      ) : (
                        <span className="text-secondary text-xs">{Math.abs(asset.daysOverdue)}{tCopy("COPY.D_LEFT")}</span>
                      )}
                    </td>
                    <td className="py-3">
                      <Button id={`superadmin_libraries_facility_maintenance_work_orders-log-asset-service-${asset.name}`} variant="ghost" size="sm" disabled title={tCopy("COPY.UNAVAILABLE_NO_MAINTENANCE_WRITE_API_CONTRACT_IS_SUPPLIED")} data-testid={`superadmin_libraries_facility_maintenance_work_orders-log-asset-service-${asset.name}`}>{tCopy("COPY.LOG_SERVICE")}</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Section 3 — Lockers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Lock size={18} className="text-primary" /> {tCopy("COPY.LOCKERS")}</CardTitle>
          <CardDescription>{tCopy("COPY.LOCKER_ISSUE_REPORTS_AND_STATUS_UPDATES")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-secondary text-xs uppercase tracking-wide">
                  <th className="text-left py-3 pr-4">{tCopy("COPY.LOCKER")}</th>
                  <th className="text-left py-3 pr-4">{tCopy("COPY.STATUS")}</th>
                  <th className="text-left py-3 pr-4">{tCopy("COPY.LAST_REPORTED_ISSUE")}</th>
                  <th className="text-left py-3">{tCopy("COPY.ACTION")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {LOCKERS.length === 0 ? (
                  <tr><td colSpan={4}><SuperadminLibrariesOverviewFacilityMaintenanceWorkOrdersEmptyState /></td></tr>
                ) : LOCKERS.map((locker) => (
                  <tr key={locker.id} className="hover:bg-card motion-safe:transition-colors motion-reduce:transition-none">
                    <td className="py-3 pr-4 font-mono font-medium text-primary">{locker.id}</td>
                    <td className="py-3 pr-4">
                      <Badge variant={locker.status === 'OK' ? 'success' : 'danger'}>{locker.status}</Badge>
                    </td>
                    <td className="py-3 pr-4 text-secondary">{locker.lastIssue}</td>
                    <td className="py-3">
                      <Button id={`superadmin_libraries_facility_maintenance_work_orders-update-locker-${locker.id}`} variant="ghost" size="sm" disabled title={tCopy("COPY.UNAVAILABLE_NO_LOCKER_MAINTENANCE_API_CONTRACT_IS_SUPPLIED")} data-testid={`superadmin_libraries_facility_maintenance_work_orders-update-locker-${locker.id}`}>{tCopy("COPY.UPDATE_STATUS")}</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
