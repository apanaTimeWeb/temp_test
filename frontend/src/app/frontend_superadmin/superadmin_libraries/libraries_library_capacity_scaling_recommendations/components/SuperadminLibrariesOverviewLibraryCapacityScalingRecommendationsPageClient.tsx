'use client';
/** Responsibility: Superadmin System Auto Scale Page Client; keep this view focused on its named module UI responsibility and delegate domain/state logic to module-owned hooks. */
/** Data-Flow: canonical route -> SuperadminLibrariesOverviewLibraryCapacityScalingRecommendationsPageClient -> feature-local sample fixtures and local UI state -> preview rendering; no persistence is claimed. */

import { SuperadminLibrariesLibraryCapacityScalingRecommendationsDateLabel } from "@/app/frontend_superadmin/superadmin_libraries/libraries_library_capacity_scaling_recommendations/utils/SuperadminLibrariesLibraryCapacityScalingRecommendationsDateFormatter";
import { useSuperadminLibrariesCapacityScalingRecommendationsState } from '@/app/frontend_superadmin/superadmin_libraries/libraries_library_capacity_scaling_recommendations/hooks/useSuperadminLibrariesCapacityScalingRecommendationsState';
import { useLocale, useTranslations } from 'next-intl';

import { SuperadminLibrariesOverviewLibraryCapacityScalingRecommendationsKpiCard as KpiCard } from '@/app/frontend_superadmin/superadmin_libraries/libraries_library_capacity_scaling_recommendations/components/SuperadminLibrariesOverviewLibraryCapacityScalingRecommendationsKpiCard';
import { SuperadminLibrariesOverviewLibraryCapacityScalingRecommendationsCard as Card } from '@/app/frontend_superadmin/superadmin_libraries/libraries_library_capacity_scaling_recommendations/components/SuperadminLibrariesOverviewLibraryCapacityScalingRecommendationsCard';
import { SuperadminLibrariesOverviewLibraryCapacityScalingRecommendationsCardHeader as CardHeader } from '@/app/frontend_superadmin/superadmin_libraries/libraries_library_capacity_scaling_recommendations/components/SuperadminLibrariesOverviewLibraryCapacityScalingRecommendationsCardHeader';
import { SuperadminLibrariesOverviewLibraryCapacityScalingRecommendationsCardTitle as CardTitle } from '@/app/frontend_superadmin/superadmin_libraries/libraries_library_capacity_scaling_recommendations/components/SuperadminLibrariesOverviewLibraryCapacityScalingRecommendationsCardTitle';
import { SuperadminLibrariesOverviewLibraryCapacityScalingRecommendationsCardDescription as CardDescription } from '@/app/frontend_superadmin/superadmin_libraries/libraries_library_capacity_scaling_recommendations/components/SuperadminLibrariesOverviewLibraryCapacityScalingRecommendationsCardDescription';
import { SuperadminLibrariesOverviewLibraryCapacityScalingRecommendationsCardContent as CardContent } from '@/app/frontend_superadmin/superadmin_libraries/libraries_library_capacity_scaling_recommendations/components/SuperadminLibrariesOverviewLibraryCapacityScalingRecommendationsCardContent';
import { SuperadminLibrariesOverviewLibraryCapacityScalingRecommendationsCardFooter as CardFooter } from '@/app/frontend_superadmin/superadmin_libraries/libraries_library_capacity_scaling_recommendations/components/SuperadminLibrariesOverviewLibraryCapacityScalingRecommendationsCardFooter';
import { SuperadminLibrariesOverviewLibraryCapacityScalingRecommendationsButton as Button } from '@/app/frontend_superadmin/superadmin_libraries/libraries_library_capacity_scaling_recommendations/components/SuperadminLibrariesOverviewLibraryCapacityScalingRecommendationsButton';
import { SuperadminLibrariesOverviewLibraryCapacityScalingRecommendationsInput as Input } from '@/app/frontend_superadmin/superadmin_libraries/libraries_library_capacity_scaling_recommendations/components/SuperadminLibrariesOverviewLibraryCapacityScalingRecommendationsInput';
import { SuperadminLibrariesOverviewLibraryCapacityScalingRecommendationsLabel as Label } from '@/app/frontend_superadmin/superadmin_libraries/libraries_library_capacity_scaling_recommendations/components/SuperadminLibrariesOverviewLibraryCapacityScalingRecommendationsLabel';
import { SuperadminLibrariesOverviewLibraryCapacityScalingRecommendationsSwitch as Switch } from '@/app/frontend_superadmin/superadmin_libraries/libraries_library_capacity_scaling_recommendations/components/SuperadminLibrariesOverviewLibraryCapacityScalingRecommendationsSwitch';
import { SuperadminLibrariesOverviewLibraryCapacityScalingRecommendationsBadge as Badge } from '@/app/frontend_superadmin/superadmin_libraries/libraries_library_capacity_scaling_recommendations/components/SuperadminLibrariesOverviewLibraryCapacityScalingRecommendationsBadge';
import { BarChart3, ChevronRight, Zap, ArrowRight } from 'lucide-react';
import { SUPERADMIN_SYSTEM_AUTO_SCALE_PAGE_CLIENT_LOCKER_OCCUPANCY } from '@/app/frontend_superadmin/superadmin_libraries/libraries_library_capacity_scaling_recommendations/constants/SuperadminLibrariesOverviewLibraryCapacityScalingRecommendationsStaticConstants';
import { SUPERADMIN_SYSTEM_AUTO_SCALE_PAGE_CLIENT_SEAT_OCCUPANCY } from '@/app/frontend_superadmin/superadmin_libraries/libraries_library_capacity_scaling_recommendations/constants/SuperadminLibrariesOverviewLibraryCapacityScalingRecommendationsStaticConstants';

/**
 * Renders the `superadmin_system` view owned by `SuperadminLibrariesOverviewLibraryCapacityScalingRecommendationsPageClient`.
 * Owns local UI state for `seatThreshold`, `lockerThreshold`, `alertEnabled`.
 * Demonstration mutations remain local preview behavior and do not imply server persistence.
 */
export default function SuperadminLibrariesOverviewLibraryCapacityScalingRecommendationsPageClient() {
  const tCopy = useTranslations('SUPERADMIN_SYSTEM');
  const locale = useLocale();
  const peakDayLabel = SuperadminLibrariesLibraryCapacityScalingRecommendationsDateLabel('2025-04-08', locale);
  const { seatThreshold, setSeatThreshold, lockerThreshold, setLockerThreshold, alertEnabled, setAlertEnabled } = useSuperadminLibrariesCapacityScalingRecommendationsState();

  
  

  const getSeatRecommendation = () => {
    if (SUPERADMIN_SYSTEM_AUTO_SCALE_PAGE_CLIENT_SEAT_OCCUPANCY > seatThreshold)
      return { color: 'danger', msg: `🔴 System suggests adding more seats. Current utilization: ${SUPERADMIN_SYSTEM_AUTO_SCALE_PAGE_CLIENT_SEAT_OCCUPANCY}%`, action: '➕ Add Seats', link: '/seat-management' };
    if (SUPERADMIN_SYSTEM_AUTO_SCALE_PAGE_CLIENT_SEAT_OCCUPANCY < 40)
      return { color: 'warning', msg: `🟡 Low occupancy detected. Consider Power Saving mode.`, action: '⚡ Power Saving →', link: '/system/power-saving' };
    return { color: 'success', msg: `🟢 Seat occupancy is healthy at ${SUPERADMIN_SYSTEM_AUTO_SCALE_PAGE_CLIENT_SEAT_OCCUPANCY}%.`, action: null, link: null };
  };

  const getLockerRecommendation = () => {
    if (SUPERADMIN_SYSTEM_AUTO_SCALE_PAGE_CLIENT_LOCKER_OCCUPANCY < 40)
      return { color: 'warning', msg: `🟡 Lockers have low usage (${SUPERADMIN_SYSTEM_AUTO_SCALE_PAGE_CLIENT_LOCKER_OCCUPANCY}%). Consider offering locker promotions.`, action: null, link: null };
    if (SUPERADMIN_SYSTEM_AUTO_SCALE_PAGE_CLIENT_LOCKER_OCCUPANCY > lockerThreshold)
      return { color: 'danger', msg: `🔴 Locker capacity near limit. Consider adding locker units.`, action: '➕ Manage Lockers', link: '/locker-matrix' };
    return { color: 'success', msg: `🟢 Locker utilization looks good at ${SUPERADMIN_SYSTEM_AUTO_SCALE_PAGE_CLIENT_LOCKER_OCCUPANCY}%.`, action: null, link: null };
  };

  const seatRec = getSeatRecommendation();
  const lockerRec = getLockerRecommendation();

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-2 text-secondary text-xs font-medium tracking-wide mb-1">
          <span>{tCopy("COPY.SYSTEM")}</span>
          <ChevronRight size={12} />
          <span>{tCopy("COPY.AUTO_SCALE")}</span>
        </div>
        <h1 className="text-3xl font-bold text-primary flex items-center gap-3">
          <BarChart3 size={28} className="text-primary" />
          {tCopy("COPY.AUTO_SCALE_INTELLIGENCE")}</h1>
        <p className="text-secondary mt-1 text-sm">{tCopy("COPY.SMART_CAPACITY_MONITORING_WITH_AUTOMATED_RECOMMENDATIONS_FOR_SCALING_YOUR_LIBRARY")}</p>
      </div>

      <p className="mb-6 rounded-lg border border-border bg-warning-bg p-3 text-sm text-warning" role="status">{tCopy("COPY.PREVIEW_ONLY_OCCUPANCY_METRICS_ARE_HARDCODED_ILLUSTRATIVE_VALUES_T_C0574BBA")}</p>

      {/* Overview KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <KpiCard title={tCopy("COPY.TOTAL_SEATS")} value={120} icon="🪑" subtitle={tCopy("COPY.ACROSS_ALL_ZONES")} />
        <KpiCard title={tCopy("COPY.TOTAL_LOCKERS")} value={60} icon="🔒" subtitle={tCopy("COPY.ALL_BRANCHES")} />
        <KpiCard title={tCopy("COPY.AVG_OCCUPANCY_30D")} value="68%" icon="📈" trend="up" trendLabel={tCopy("COPY.TREND_VS_LAST_MONTH", { percent: 4 })} />
        <KpiCard title={tCopy("COPY.PEAK_DAY")} value={peakDayLabel} icon="🏆" subtitle={tCopy("COPY.OCCUPANCY_PERCENT", { percent: 94 })} />
      </div>

      {/* Threshold Config */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{tCopy("COPY.ALERT_THRESHOLDS")}</CardTitle>
          <CardDescription>{tCopy("COPY.CONFIGURE_OCCUPANCY_LEVELS_THAT_TRIGGER_SCALING_RECOMMENDATIONS")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="seat-alert-threshold">{tCopy("COPY.SEAT_ALERT_THRESHOLD")}</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="seat-alert-threshold"
                  type="number"
                  value={seatThreshold}
                  onChange={e => setSeatThreshold(+e.target.value)}
                  min={50}
                  max={99}
                  step={1}
                  inputMode="numeric"
                  className="w-28"
                  disabled
                  title={tCopy("COPY.READ_ONLY_SAMPLE_THRESHOLD_NO_AUTO_SCALE_CONFIGURATION_API_IS_SUPPLIED")}
                 data-testid="superadmin_libraries_library_capacity_scaling_recommendations-seat-alert-threshold"/>
                <span className="text-sm text-secondary">{tCopy("COPY.E_G_90_ALERT_AT_90_FULL")}</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="locker-alert-threshold">{tCopy("COPY.LOCKER_ALERT_THRESHOLD")}</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="locker-alert-threshold"
                  type="number"
                  value={lockerThreshold}
                  onChange={e => setLockerThreshold(+e.target.value)}
                  min={50}
                  max={99}
                  step={1}
                  inputMode="numeric"
                  className="w-28"
                  disabled
                  title={tCopy("COPY.READ_ONLY_SAMPLE_THRESHOLD_NO_AUTO_SCALE_CONFIGURATION_API_IS_SUPPLIED")}
                 data-testid="superadmin_libraries_library_capacity_scaling_recommendations-locker-alert-threshold"/>
                <span className="text-sm text-secondary">{tCopy("COPY.E_G_85_ALERT_AT_85_FULL")}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between p-4 rounded-xl bg-card border border-border">
            <div>
              <p className="text-sm font-medium text-primary">{tCopy("COPY.ALERT_ME_WHEN_OCCUPANCY_EXCEEDS_THRESHOLD")}</p>
              <p className="text-xs text-secondary">{tCopy("COPY.RECEIVE_IN_APP_NOTIFICATIONS_AND_DASHBOARD_BADGES")}</p>
            </div>
            <Switch id="auto-scale-alert-toggle" checked={alertEnabled} disabled onCheckedChange={setAlertEnabled} aria-label={tCopy("COPY.SAMPLE_OCCUPANCY_ALERT_STATE_NOT_CONNECTED")}  data-testid="superadmin-system-library_capacity_scaling_recommendations-switch-1"/>
          </div>
        </CardContent>
        <CardFooter>
          <Button id="save-autoscale-thresholds-btn" variant="primary" disabled title={tCopy("COPY.UNAVAILABLE_NO_AUTO_SCALE_CONFIGURATION_WRITE_API_IS_SUPPLIED")} data-testid="superadmin_libraries_library_capacity_scaling_recommendations-save-autoscale-thresholds-btn">{tCopy("COPY.SAVE_THRESHOLDS")}</Button>
        </CardFooter>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap size={18} className="text-primary" />
            {tCopy("COPY.SMART_RECOMMENDATIONS")}</CardTitle>
          <CardDescription>{tCopy("COPY.AI_DRIVEN_SUGGESTIONS_BASED_ON_CURRENT_OCCUPANCY_DATA")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Seat Recommendation */}
          <div className={`p-4 rounded-xl border ${
            seatRec.color === 'danger' ? 'bg-danger-bg border-border' :
            seatRec.color === 'warning' ? 'bg-warning-bg border-border' :
            'bg-success-bg border-border'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-3">
                <Badge variant={seatRec.color === 'danger' ? 'danger' : seatRec.color === 'warning' ? 'warning' : 'success'}>
                  {tCopy("COPY.SEATS")}</Badge>
                <p className="text-sm text-primary">{seatRec.msg}</p>
              </div>
              {seatRec.action && (
                <Button id="seat-rec-action-btn" variant="secondary" size="sm" disabled title={tCopy("COPY.UNAVAILABLE_THIS_RECOMMENDATION_DOES_NOT_HAVE_AN_EXECUTION_CONTRACT")} data-testid="superadmin_libraries_library_capacity_scaling_recommendations-seat-rec-action-btn">
                  {seatRec.action} <ArrowRight size={14} />
                </Button>
              )}
            </div>
          </div>

          {/* Locker Recommendation */}
          <div className={`p-4 rounded-xl border ${
            lockerRec.color === 'danger' ? 'bg-danger-bg border-border' :
            lockerRec.color === 'warning' ? 'bg-warning-bg border-border' :
            'bg-success-bg border-border'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-3">
                <Badge variant={lockerRec.color === 'danger' ? 'danger' : lockerRec.color === 'warning' ? 'warning' : 'success'}>
                  {tCopy("COPY.LOCKERS")}</Badge>
                <p className="text-sm text-primary">{lockerRec.msg}</p>
              </div>
              {lockerRec.action && (
                <Button id="locker-rec-action-btn" variant="secondary" size="sm" disabled title={tCopy("COPY.UNAVAILABLE_THIS_RECOMMENDATION_DOES_NOT_HAVE_AN_EXECUTION_CONTRACT")} data-testid="superadmin_libraries_library_capacity_scaling_recommendations-locker-rec-action-btn">
                  {lockerRec.action} <ArrowRight size={14} />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
