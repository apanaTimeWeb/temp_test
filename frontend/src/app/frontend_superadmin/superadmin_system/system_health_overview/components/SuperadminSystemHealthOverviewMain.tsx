'use client';
import { useState, useEffect, useCallback } from 'react';
import SuperadminSystemHealthOverviewHeaderStatus from '@/app/frontend_superadmin/superadmin_system/system_health_overview/components/SuperadminSystemHealthOverviewHeaderStatus';
import SuperadminSystemHealthOverviewDashboardSections from '@/app/frontend_superadmin/superadmin_system/system_health_overview/components/SuperadminSystemHealthOverviewDashboardSections';

export default function SuperadminSystemHealthOverviewMain() {
  const [autoRefreshInterval, setAutoRefreshInterval] = useState<number>(15);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    setLastUpdated(new Date());
    setRefreshTrigger((prev) => prev + 1);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 400);
  }, []);

  useEffect(() => {
    if (autoRefreshInterval <= 0) return;
    const interval = setInterval(() => {
      setLastUpdated(new Date());
      setRefreshTrigger((prev) => prev + 1);
    }, autoRefreshInterval * 1000);

    return () => clearInterval(interval);
  }, [autoRefreshInterval]);

  return (
    <div className="sa-page-animate pb-16 min-w-0 max-w-full">
      <SuperadminSystemHealthOverviewHeaderStatus
        onRefresh={handleRefresh}
        lastUpdated={lastUpdated}
        isRefreshing={isRefreshing}
        autoRefreshInterval={autoRefreshInterval}
        setAutoRefreshInterval={setAutoRefreshInterval}
      />
      <SuperadminSystemHealthOverviewDashboardSections refreshTrigger={refreshTrigger} />
    </div>
  );
}
