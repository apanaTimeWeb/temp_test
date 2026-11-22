// RESPONSIBILITY: Prove the health panel renders its supplied lastBackup value, not a fixed display label.
import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { describe, expect, it } from 'vitest';
import messages from '@/app/frontend_superadmin/superadmin_dashboard/dashboard_overview/locales/superadmin_dashboard_overview_en.json';
import SuperadminDashboardOverviewSystemHealthPanel from '@/app/frontend_superadmin/superadmin_dashboard/dashboard_overview/components/SuperadminDashboardOverviewSystemHealthPanel';

const data = { uptime: '99.9%', activeUsers: 17, apiLatency: '42ms', lastBackup: 'Backup completed at 10:45 UTC' };
function renderPanel(lastBackup: string) {
  return render(<NextIntlClientProvider locale="en" messages={messages}><SuperadminDashboardOverviewSystemHealthPanel data={{ ...data, lastBackup }} /></NextIntlClientProvider>);
}

describe('dashboard system health lastBackup fidelity', () => {
  it('renders the caller-supplied timestamp and changes when the input changes', () => {
    const view = renderPanel('Backup completed at 10:45 UTC');
    expect(screen.getByText('Backup completed at 10:45 UTC')).toBeTruthy();
    view.rerender(<NextIntlClientProvider locale="en" messages={messages}><SuperadminDashboardOverviewSystemHealthPanel data={{ ...data, lastBackup: 'Backup completed at 11:10 UTC' }} /></NextIntlClientProvider>);
    expect(screen.getByText('Backup completed at 11:10 UTC')).toBeTruthy();
    expect(screen.queryByText('2 hours ago')).toBeNull();
  });
  it('renders a stable fallback for a missing value', () => {
    render(<NextIntlClientProvider locale="en" messages={messages}><SuperadminDashboardOverviewSystemHealthPanel data={{ ...data, lastBackup: '' }} /></NextIntlClientProvider>);
    expect(screen.getAllByText('—').length).toBeGreaterThan(0);
  });
});
