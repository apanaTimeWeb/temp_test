// tests/superadmin_integrations_overview.integration.test.tsx
// Behavioral integration test suite verifying user flows and contracts.
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SuperadminIntegrationsOverviewMain } from '../components/SuperadminIntegrationsOverviewMain';
import { setupIntegrationsOverviewMockServer } from './harness/bootstrap';
import SuperadminIntegrationsOverviewHarness from './harness/SuperadminIntegrationsOverviewHarness';

// Mock Next.js navigation hooks
vi.mock('next/navigation', () => {
  const searchParams = new URLSearchParams();
  return {
    useRouter: () => ({
      replace: vi.fn(),
      push: vi.fn(),
    }),
    usePathname: () => '/superadmin/superadmin_integrations/integrations_overview',
    useSearchParams: () => searchParams,
  };
});

setupIntegrationsOverviewMockServer();

describe('Superadmin Integrations Overview Module Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders top heading, subtitle, and KPI summary stats', async () => {
    render(
      <SuperadminIntegrationsOverviewHarness>
        <SuperadminIntegrationsOverviewMain />
      </SuperadminIntegrationsOverviewHarness>
    );

    await waitFor(() => {
      expect(screen.getByText(/13\. Integration & API Management/i)).toBeInTheDocument();
    });

    expect(
      screen.getByText(/Control payment gateways, SMS, WhatsApp, Email, Cloud Storage, Barcode\/QR, Biometrics/i)
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/Total Providers/i)).toBeInTheDocument();
      expect(screen.getByText(/Active Live/i)).toBeInTheDocument();
    });
  });

  it('renders gateway cards for Razorpay, WhatsApp, and eSSL biometrics', async () => {
    render(
      <SuperadminIntegrationsOverviewHarness>
        <SuperadminIntegrationsOverviewMain />
      </SuperadminIntegrationsOverviewHarness>
    );

    await waitFor(() => {
      expect(screen.getByText(/Razorpay Payment Gateway/i)).toBeInTheDocument();
      expect(screen.getByText(/Meta WhatsApp Business Cloud API/i)).toBeInTheDocument();
      expect(screen.getByText(/eSSL & ZKTeco Biometric Push Sync/i)).toBeInTheDocument();
    });
  });

  it('filters gateways when typing in the search input', async () => {
    render(
      <SuperadminIntegrationsOverviewHarness>
        <SuperadminIntegrationsOverviewMain />
      </SuperadminIntegrationsOverviewHarness>
    );

    await waitFor(() => {
      expect(screen.getByText(/Razorpay Payment Gateway/i)).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/Search providers, gateways.../i);
    fireEvent.change(searchInput, { target: { value: 'biometric' } });

    await waitFor(() => {
      expect(screen.getByText(/eSSL & ZKTeco Biometric Push Sync/i)).toBeInTheDocument();
      expect(screen.queryByText(/Razorpay Payment Gateway/i)).not.toBeInTheDocument();
    });
  });

  it('switches to Webhooks tab and displays registered endpoints and retries', async () => {
    render(
      <SuperadminIntegrationsOverviewHarness>
        <SuperadminIntegrationsOverviewMain />
      </SuperadminIntegrationsOverviewHarness>
    );

    await waitFor(() => {
      expect(screen.getByRole('tab', { name: /Webhooks/i })).toBeInTheDocument();
    });

    const webhooksTab = screen.getByRole('tab', { name: /Webhooks/i });
    fireEvent.click(webhooksTab);

    await waitFor(() => {
      expect(screen.getByText(/Registered Webhook Endpoints/i)).toBeInTheDocument();
      expect(screen.getByText(/Failed Webhook Retries & Dead-Letter Queue/i)).toBeInTheDocument();
      expect(screen.getByText(/https:\/\/api\.libraryos\.io\/hooks\/tenant-provisioned/i)).toBeInTheDocument();
    });
  });

  it('switches to API Keys tab and displays masked keys and rate limit controls', async () => {
    render(
      <SuperadminIntegrationsOverviewHarness>
        <SuperadminIntegrationsOverviewMain />
      </SuperadminIntegrationsOverviewHarness>
    );

    await waitFor(() => {
      expect(screen.getByRole('tab', { name: /API Keys/i })).toBeInTheDocument();
    });

    const apiKeysTab = screen.getByRole('tab', { name: /API Keys/i });
    fireEvent.click(apiKeysTab);

    await waitFor(() => {
      expect(screen.getByText(/Machine & Platform API Keys/i)).toBeInTheDocument();
      expect(screen.getByText(/Production Worker Daemon Key/i)).toBeInTheDocument();
      expect(screen.getByText(/API Usage Quotas, Rate Limits & IP Allowlisting/i)).toBeInTheDocument();
    });
  });

  it('switches to Live Logs tab and displays HTTP log table', async () => {
    render(
      <SuperadminIntegrationsOverviewHarness>
        <SuperadminIntegrationsOverviewMain />
      </SuperadminIntegrationsOverviewHarness>
    );

    await waitFor(() => {
      expect(screen.getByRole('tab', { name: /Live Logs/i })).toBeInTheDocument();
    });

    const logsTab = screen.getByRole('tab', { name: /Live Logs/i });
    fireEvent.click(logsTab);

    await waitFor(() => {
      expect(screen.getByText(/Direction/i)).toBeInTheDocument();
      expect(screen.getByText(/Method & Endpoint/i)).toBeInTheDocument();
      expect(screen.getByText(/\/api\/v1\/payments\/create-order/i)).toBeInTheDocument();
    });
  });

  it('switches to Plan Access tab and displays tier entitlements matrix', async () => {
    render(
      <SuperadminIntegrationsOverviewHarness>
        <SuperadminIntegrationsOverviewMain />
      </SuperadminIntegrationsOverviewHarness>
    );

    await waitFor(() => {
      expect(screen.getByRole('tab', { name: /Plan Access/i })).toBeInTheDocument();
    });

    const entitlementsTab = screen.getByRole('tab', { name: /Plan Access/i });
    fireEvent.click(entitlementsTab);

    await waitFor(() => {
      expect(screen.getByText(/Integration Feature Entitlements per Plan Tier/i)).toBeInTheDocument();
      expect(screen.getByText(/Starter Single Branch/i)).toBeInTheDocument();
      expect(screen.getByText(/Enterprise SaaS Unlimited/i)).toBeInTheDocument();
    });
  });
});
