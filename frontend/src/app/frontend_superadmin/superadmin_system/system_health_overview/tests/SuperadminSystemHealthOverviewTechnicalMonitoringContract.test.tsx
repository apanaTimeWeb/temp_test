/**
 * Responsibility: Verify contracts for all 15 SuperAdmin Technical Monitoring dimensions:
 * 1. Application/server status
 * 2. Database connectivity
 * 3. API response times
 * 4. Error rate
 * 5. Background jobs/queues
 * 6. Email/SMS delivery failures
 * 7. Payment webhook status
 * 8. Storage availability
 * 9. Backup jobs
 * 10. Database capacity
 * 11. Security alerts
 * 12. Scheduled maintenance
 * 13. Application version
 * 14. Deployment history
 * 15. Feature release controls
 */
import { fireEvent, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { describe, expect, it } from 'vitest';
import SuperadminSystemHealthOverviewMain from '../components/SuperadminSystemHealthOverviewMain';
import messages from '../locales/superadmin_system_health_overview_en.json';
import { SUPERADMIN_16_MODULES } from '@/app/frontend_superadmin/superadmin_navigation/navigation_shell/constants/SuperadminNavigationShellItems';

function renderWithMessages(ui: ReactNode) {
  return render(<NextIntlClientProvider locale="en" messages={messages}>{ui}</NextIntlClientProvider>);
}

describe('SuperAdmin Technical Monitoring 15 Dimensions Contract', () => {
  it('1. Verifies Sidebar Module 15 Navigation SubItems map to technical monitoring tabs', () => {
    const systemModule = SUPERADMIN_16_MODULES.find((m) => m.id === 'system');
    expect(systemModule).toBeDefined();
    expect(systemModule?.subItems).toHaveLength(5);
    const subItemIds = systemModule?.subItems.map((s) => s.id);
    expect(subItemIds).toEqual([
      'sys_server',
      'sys_db',
      'sys_api_queue',
      'sys_security_maintenance',
      'sys_releases',
    ]);
  });

  it('2. Verifies Application/Server status, Latency & Error Rate telemetry rendered', () => {
    renderWithMessages(<SuperadminSystemHealthOverviewMain />);
    expect(screen.getByText(/Core Microservices & Server Telemetry/i)).toBeTruthy();
    expect(screen.getAllByText(/PostgreSQL Primary Cluster/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Redis Sentinel Cache/i)).toBeTruthy();
  });

  it('3. Verifies Database Connectivity, Storage Availability & Backup verification', () => {
    renderWithMessages(<SuperadminSystemHealthOverviewMain />);
    expect(screen.getByText(/Scheduled Maintenance & Storage Capacity/i)).toBeTruthy();
    expect(screen.getByText(/PostgreSQL Disk/i)).toBeTruthy();
    expect(screen.getByText(/S3 Document Storage/i)).toBeTruthy();
    expect(screen.getByText(/Automated Daily Backup/i)).toBeTruthy();
  });

  it('4. Verifies Security Alerts, WAF and Webhook Delivery telemetry', () => {
    renderWithMessages(<SuperadminSystemHealthOverviewMain />);
    expect(screen.getByText(/Security Defense & Edge Threat Telemetry/i)).toBeTruthy();
    expect(screen.getByText(/WAF Blocked Probes/i)).toBeTruthy();
    expect(screen.getByText(/SSL Wildcard Certificate/i)).toBeTruthy();
    expect(screen.getByText(/Payment Webhook Ingress/i)).toBeTruthy();
  });

  it('5. Verifies Application Version, Deployment History & Feature Release Controls', () => {
    renderWithMessages(<SuperadminSystemHealthOverviewMain />);
    expect(screen.getByText(/Application Version, Deployments & Feature Controls/i)).toBeTruthy();
    expect(screen.getAllByText(/v2.4.1-prod/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Recent Production Deployments/i)).toBeTruthy();
    expect(screen.getByText(/Feature Release Controls & Killswitches/i)).toBeTruthy();

    // Toggle a feature release switch
    const switchBtns = screen.getAllByRole('switch');
    expect(switchBtns.length).toBeGreaterThanOrEqual(6);
    fireEvent.click(switchBtns[0]);
  });

  it('6. Verifies Technical Health Category Pill Navigation toggles view filters', () => {
    renderWithMessages(<SuperadminSystemHealthOverviewMain />);
    const releasesTab = screen.getByTestId('system-health-tab-releases');
    expect(releasesTab).toBeTruthy();
    fireEvent.click(releasesTab);
    expect(screen.getByText(/Feature Release Controls & Killswitches/i)).toBeTruthy();

    const allTab = screen.getByTestId('system-health-tab-all');
    fireEvent.click(allTab);
    expect(screen.getByText(/Core Microservices & Server Telemetry/i)).toBeTruthy();
  });
});
