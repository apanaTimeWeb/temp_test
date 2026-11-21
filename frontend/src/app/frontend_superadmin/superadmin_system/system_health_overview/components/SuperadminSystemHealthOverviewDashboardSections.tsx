'use client';
import { useState, useEffect } from 'react';
import { Sliders, Server, Database, Globe, Shield, Rocket } from 'lucide-react';
import SuperadminSystemHealthOverviewNetworkMetrics from '@/app/frontend_superadmin/superadmin_system/system_health_overview/components/SuperadminSystemHealthOverviewNetworkMetrics';
import SuperadminSystemHealthOverviewInfrastructure from '@/app/frontend_superadmin/superadmin_system/system_health_overview/components/SuperadminSystemHealthOverviewInfrastructure';
import SuperadminSystemHealthOverviewIntegrations from '@/app/frontend_superadmin/superadmin_system/system_health_overview/components/SuperadminSystemHealthOverviewIntegrations';
import SuperadminSystemHealthOverviewServicesTable from '@/app/frontend_superadmin/superadmin_system/system_health_overview/components/SuperadminSystemHealthOverviewServicesTable';
import { SuperadminSystemHealthOverviewSecurityMaintenanceCard } from '@/app/frontend_superadmin/superadmin_system/system_health_overview/components/SuperadminSystemHealthOverviewSecurityMaintenanceCard';
import { SuperadminSystemHealthOverviewReleasesControlsCard } from '@/app/frontend_superadmin/superadmin_system/system_health_overview/components/SuperadminSystemHealthOverviewReleasesControlsCard';

interface DashboardSectionsProps {
  refreshTrigger?: number;
}

const HEALTH_CATEGORIES = [
  { id: 'all', label: 'All Technical Monitors', icon: Sliders },
  { id: 'server', label: 'Server & Application Nodes', icon: Server },
  { id: 'database', label: 'Database & Storage', icon: Database },
  { id: 'queues', label: 'API, Queues & Webhooks', icon: Globe },
  { id: 'security', label: 'Security & Maintenance', icon: Shield },
  { id: 'releases', label: 'Releases & Killswitches', icon: Rocket },
] as const;

type HealthCategoryId = typeof HEALTH_CATEGORIES[number]['id'];

export default function SuperadminSystemHealthOverviewDashboardSections({
  refreshTrigger = 0,
}: DashboardSectionsProps) {
  const [activeCategory, setActiveCategory] = useState<HealthCategoryId>('all');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get('tab') as HealthCategoryId | null;
      if (tab && HEALTH_CATEGORIES.some((c) => c.id === tab)) {
        setActiveCategory(tab);
      }
    }
  }, []);

  const isVisible = (cat: HealthCategoryId) => {
    return activeCategory === 'all' || activeCategory === cat;
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Category Navigation Bar */}
      <nav
        role="tablist"
        aria-label="Technical Health Monitors"
        className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-border/80 hide-scrollbar"
      >
        {HEALTH_CATEGORIES.map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeCategory === tab.id;
          return (
            <button
              type="button"
              key={tab.id}
              role="tab"
              aria-selected={isSelected}
              onClick={() => {
                setActiveCategory(tab.id);
                if (typeof window !== 'undefined') {
                  const url = new URL(window.location.href);
                  if (tab.id === 'all') {
                    url.searchParams.delete('tab');
                  } else {
                    url.searchParams.set('tab', tab.id);
                  }
                  window.history.replaceState({}, '', url.toString());
                }
              }}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-xs'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
              data-testid={`system-health-tab-${tab.id}`}
            >
              <Icon size={14} aria-hidden="true" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* 1. Network Metrics KPI Banner (API Response Times, Error Rate, Requests, Sockets) */}
      {(isVisible('server') || isVisible('queues')) && (
        <SuperadminSystemHealthOverviewNetworkMetrics refreshTrigger={refreshTrigger} />
      )}

      {/* 2. Core Microservices Table (Application/Server Status, Latency, CPU, Memory) */}
      {(isVisible('server') || isVisible('database')) && (
        <SuperadminSystemHealthOverviewServicesTable />
      )}

      {/* 3. Compute & Database Capacity Infrastructure */}
      {(isVisible('server') || isVisible('database')) && (
        <SuperadminSystemHealthOverviewInfrastructure />
      )}

      {/* 4. API Integrations, Webhooks, Background Queues & Cron Jobs */}
      {(isVisible('queues') || isVisible('database')) && (
        <SuperadminSystemHealthOverviewIntegrations />
      )}

      {/* 5. Security Alerts, Scheduled Maintenance, Storage & Webhook Ingress */}
      {(isVisible('security') || isVisible('database')) && (
        <SuperadminSystemHealthOverviewSecurityMaintenanceCard />
      )}

      {/* 6. Releases, Deployment History & Feature Controls */}
      {(isVisible('releases') || isVisible('server')) && (
        <SuperadminSystemHealthOverviewReleasesControlsCard />
      )}
    </div>
  );
}
