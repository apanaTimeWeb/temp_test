'use client';
import SuperadminLibrariesOverviewFacilityPowerManagementEmptyState from '@/app/frontend_superadmin/superadmin_libraries/libraries_facility_power_management/components/SuperadminLibrariesOverviewFacilityPowerManagementEmptyState';
import { useSuperadminLibrariesFacilityPowerManagementState } from '@/app/frontend_superadmin/superadmin_libraries/libraries_facility_power_management/hooks/useSuperadminLibrariesFacilityPowerManagementState';
/** Responsibility: Superadmin System Power Saving Page Client; keep this view focused on its named module UI responsibility and delegate domain/state logic to module-owned hooks. */
/** Data-Flow: canonical route -> SuperadminLibrariesOverviewFacilityPowerManagementPageClient -> feature-local sample fixtures and local UI state -> preview rendering; no persistence is claimed. */

import { useTranslations } from 'next-intl';

import { SuperadminLibrariesOverviewFacilityPowerManagementCard as Card } from '@/app/frontend_superadmin/superadmin_libraries/libraries_facility_power_management/components/SuperadminLibrariesOverviewFacilityPowerManagementCard';
import { SuperadminLibrariesOverviewFacilityPowerManagementCardHeader as CardHeader } from '@/app/frontend_superadmin/superadmin_libraries/libraries_facility_power_management/components/SuperadminLibrariesOverviewFacilityPowerManagementCardHeader';
import { SuperadminLibrariesOverviewFacilityPowerManagementCardTitle as CardTitle } from '@/app/frontend_superadmin/superadmin_libraries/libraries_facility_power_management/components/SuperadminLibrariesOverviewFacilityPowerManagementCardTitle';
import { SuperadminLibrariesOverviewFacilityPowerManagementCardDescription as CardDescription } from '@/app/frontend_superadmin/superadmin_libraries/libraries_facility_power_management/components/SuperadminLibrariesOverviewFacilityPowerManagementCardDescription';
import { SuperadminLibrariesOverviewFacilityPowerManagementCardContent as CardContent } from '@/app/frontend_superadmin/superadmin_libraries/libraries_facility_power_management/components/SuperadminLibrariesOverviewFacilityPowerManagementCardContent';
import { SuperadminLibrariesOverviewFacilityPowerManagementCardFooter as CardFooter } from '@/app/frontend_superadmin/superadmin_libraries/libraries_facility_power_management/components/SuperadminLibrariesOverviewFacilityPowerManagementCardFooter';
import { SuperadminLibrariesOverviewFacilityPowerManagementButton as Button } from '@/app/frontend_superadmin/superadmin_libraries/libraries_facility_power_management/components/SuperadminLibrariesOverviewFacilityPowerManagementButton';
import { SuperadminLibrariesOverviewFacilityPowerManagementInput as Input } from '@/app/frontend_superadmin/superadmin_libraries/libraries_facility_power_management/components/SuperadminLibrariesOverviewFacilityPowerManagementInput';
import { SuperadminLibrariesOverviewFacilityPowerManagementLabel as Label } from '@/app/frontend_superadmin/superadmin_libraries/libraries_facility_power_management/components/SuperadminLibrariesOverviewFacilityPowerManagementLabel';
import { SuperadminLibrariesOverviewFacilityPowerManagementSwitch as Switch } from '@/app/frontend_superadmin/superadmin_libraries/libraries_facility_power_management/components/SuperadminLibrariesOverviewFacilityPowerManagementSwitch';
import { SuperadminLibrariesOverviewFacilityPowerManagementBadge as Badge } from '@/app/frontend_superadmin/superadmin_libraries/libraries_facility_power_management/components/SuperadminLibrariesOverviewFacilityPowerManagementBadge';
import { SuperadminLibrariesOverviewFacilityPowerManagementProgress as Progress } from '@/app/frontend_superadmin/superadmin_libraries/libraries_facility_power_management/components/SuperadminLibrariesOverviewFacilityPowerManagementProgress';
import { Zap, ChevronRight } from 'lucide-react';
import { SUPERADMIN_SYSTEM_POWER_SAVING_SAMPLE_ZONES } from '@/app/frontend_superadmin/superadmin_libraries/libraries_facility_power_management/mocks/fixtures/SuperadminLibrariesOverviewFacilityPowerManagementMockFixtures';
import { SUPERADMIN_SYSTEM_POWER_SAVING_SAMPLE_ALERT_LOG } from '@/app/frontend_superadmin/superadmin_libraries/libraries_facility_power_management/mocks/fixtures/SuperadminLibrariesOverviewFacilityPowerManagementMockFixtures';





/**
 * Renders the `superadmin_system` view owned by `SuperadminLibrariesOverviewFacilityPowerManagementPageClient`.
 * Owns local UI state for `threshold`, `alertsEnabled`.
 */
export default function SuperadminLibrariesOverviewFacilityPowerManagementPageClient() {
  const tCopy = useTranslations('SUPERADMIN_SYSTEM');
  const { threshold, setThreshold, alertsEnabled, setAlertsEnabled } = useSuperadminLibrariesFacilityPowerManagementState();

  const getZoneStatus = (occ: number) => {
    if (occ < threshold) return { labelKey: 'COPY.LOW_CONSOLIDATION_SUGGESTED', variant: 'warning' as const };
    return { labelKey: 'COPY.NORMAL', variant: 'success' as const };
  };

  return (
    <div>
      {(SUPERADMIN_SYSTEM_POWER_SAVING_SAMPLE_ALERT_LOG?.length === 0) && <SuperadminLibrariesOverviewFacilityPowerManagementEmptyState />}

      <div className="mb-8">
        <div className="flex items-center gap-2 text-secondary text-xs font-medium tracking-wide mb-1">
          <span>{tCopy("COPY.SYSTEM")}</span>
          <ChevronRight aria-hidden="true" size={18} strokeWidth={2} />
          <span>{tCopy("COPY.POWER_SAVING")}</span>
        </div>
        <h1 className="text-3xl font-bold text-primary flex items-center gap-3">
          <Zap aria-hidden="true" size={18} strokeWidth={2} className="text-primary" />
          {tCopy("COPY.POWER_SAVING_MODE")}</h1>
        <p className="text-secondary mt-1 text-sm">{tCopy("COPY.ILLUSTRATIVE_ZONE_OCCUPANCY_SUMMARY")}</p>
        <p className="mt-3 rounded-lg border border-border bg-info-bg p-3 text-sm text-info" role="status">{tCopy("COPY.SYNTHETIC_POWER_SAVING_PREVIEW_NOTICE")}</p>
      </div>

      {/* Config Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{tCopy("COPY.CONFIGURATION")}</CardTitle>
          <CardDescription>{tCopy("COPY.SET_THE_OCCUPANCY_THRESHOLD_BELOW_WHICH_CONSOLIDATION_IS_SUGGESTED")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="power-threshold">{tCopy("COPY.OCCUPANCY_THRESHOLD")}</Label>
            <div className="flex items-center gap-3">
              <Input
                id="power-threshold"
                type="number"
                value={threshold}
                onChange={e => setThreshold(+e.target.value)}
                step={1}
                inputMode="numeric"
                className="w-28"
                min={5}
                max={95}
               data-testid="superadmin_libraries_facility_power_management-power-threshold"/>
              <span className="text-sm text-secondary">
                {tCopy("COPY.IF_SHIFT_OCCUPANCY_DROPS_BELOW")}<strong className="text-primary">{threshold}%</strong>{tCopy("COPY.SUGGEST_CONSOLIDATION")}</span>
            </div>
          </div>
          <div className="flex items-center justify-between p-4 rounded-xl bg-card border border-border">
            <div>
              <p className="text-sm font-medium text-primary">{tCopy("COPY.ENABLE_POWER_SAVING_ALERTS")}</p>
              <p className="text-xs text-secondary">{tCopy("COPY.SEND_ALERTS_WHEN_ZONES_FALL_BELOW_THRESHOLD")}</p>
            </div>
            <Switch id="power-saving-toggle" checked={alertsEnabled} onCheckedChange={setAlertsEnabled}  aria-label={tCopy("COPY.ENABLE_POWER_SAVING_ALERTS")} data-testid="superadmin-system-facility_power_management-switch-1"/>
          </div>
        </CardContent>
        <CardFooter>
          <Button id="save-power-config-btn" variant="primary" disabled title={tCopy("COPY.UNAVAILABLE_NO_POWER_SAVING_CONFIGURATION_API_CONTRACT_IS_SUPPLIED")} data-testid="superadmin_libraries_facility_power_management-save-power-config-btn">{tCopy("COPY.SAVE_CONFIGURATION")}</Button>
        </CardFooter>
      </Card>

      {/* Zone Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {SUPERADMIN_SYSTEM_POWER_SAVING_SAMPLE_ZONES.map((zone) => {
          const status = getZoneStatus(zone.occupancy);
          const isLow = zone.occupancy < threshold;
          return (
            <Card key={zone.nameKey} className={isLow ? 'border-border' : ''}>
              <CardContent>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-sm font-semibold text-primary">{tCopy(zone.nameKey)}</p>
                    <p className="text-xs text-secondary">{zone.current} / {zone.capacity} {tCopy("COPY.SEATS_OCCUPIED")}</p>
                  </div>
                  <Badge variant={status.variant}>{tCopy(status.labelKey)}</Badge>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-secondary">
                    <span>{tCopy("COPY.OCCUPANCY")}</span>
                    <span className={isLow ? 'text-info font-semibold' : 'text-success font-semibold'}>{zone.occupancy}%</span>
                  </div>
                  <Progress value={zone.occupancy} ariaLabel={`${tCopy("COPY.OCCUPANCY")}: ${tCopy(zone.nameKey)}`} barClassName={isLow ? 'bg-info-bg' : 'bg-success text-on-success'} />
                </div>
                {isLow && (
                  <div className="mt-3 p-2.5 rounded-lg bg-info-bg border border-border text-xs text-info">
                    {tCopy("COPY.SUGGESTED_MOVE_STUDENTS_TO_ZONE_A_TURN_OFF")} {tCopy(zone.nameKey)} {tCopy("COPY.AC")}</div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Alert Log */}
      <Card>
        <CardHeader>
          <CardTitle>{tCopy("COPY.SUPERADMIN_SYSTEM_POWER_SAVING_SAMPLE_ALERT_LOG")}</CardTitle>
          <CardDescription>{tCopy("COPY.HISTORY_OF_POWER_SAVING_THRESHOLD_BREACHES_AND_ACTIONS_TAKEN")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-secondary text-xs uppercase tracking-wide">
                  <th className="text-left py-3 pr-4">{tCopy("COPY.DATE")}</th>
                  <th className="text-left py-3 pr-4">{tCopy("COPY.SHIFT")}</th>
                  <th className="text-left py-3 pr-4">{tCopy("COPY.ZONE")}</th>
                  <th className="text-left py-3 pr-4">{tCopy("COPY.THRESHOLD_BREACHED")}</th>
                  <th className="text-left py-3">{tCopy("COPY.ACTION_TAKEN")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {SUPERADMIN_SYSTEM_POWER_SAVING_SAMPLE_ALERT_LOG.map((log) => (
                  <tr key={log.date + log.zoneKey} className="hover:bg-card motion-safe:transition-colors motion-reduce:transition-none">
                    <td className="py-3 pr-4 text-secondary">{log.date}</td>
                    <td className="py-3 pr-4 text-primary">{tCopy(log.shiftKey)}</td>
                    <td className="py-3 pr-4 text-primary">{tCopy(log.zoneKey)}</td>
                    <td className="py-3 pr-4"><Badge variant="warning">{tCopy("COPY.TEXT")}{log.threshold}</Badge></td>
                    <td className="py-3 text-secondary">{tCopy(log.actionKey)}</td>
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
