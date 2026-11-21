// tests/SuperadminSecurityOverviewTenantIsolationAndCompliance.test.tsx
// Behavioral test suite verifying ISO 27001 Data Security, Tenant Isolation Probe, and SuperAdmin Governance.
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { describe, expect, it } from 'vitest';
import { SuperadminSecurityOverviewComplianceCard } from '../components/SuperadminSecurityOverviewComplianceCard';
import { SuperadminSecurityOverviewGovernanceCard } from '../components/SuperadminSecurityOverviewGovernanceCard';
import { SuperadminSecurityOverviewTenantIsolationCard } from '../components/SuperadminSecurityOverviewTenantIsolationCard';

describe('Superadmin Security Overview Compliance, Tenant Isolation & Governance', () => {
  it('renders ISO 27001 data security controls and encryption at rest', () => {
    render(<SuperadminSecurityOverviewComplianceCard />);

    expect(screen.getByText(/ISO 27001 Compliance & Data Security Controls/i)).toBeInTheDocument();
    expect(screen.getByText(/HTTPS \/ TLS 1\.3 Enforced/i)).toBeInTheDocument();
    expect(screen.getByText(/Database Encryption at Rest/i)).toBeInTheDocument();
    expect(screen.getByText(/AES-256 GCM Active/i)).toBeInTheDocument();
    expect(screen.getByText(/Encrypted Backup Snapshots/i)).toBeInTheDocument();
    expect(screen.getByText(/Expiring Signed S3 Media Links/i)).toBeInTheDocument();
  });

  it('renders tenant isolation card and simulates cross-tenant boundary probe test', async () => {
    render(<SuperadminSecurityOverviewTenantIsolationCard />);

    expect(screen.getByText(/Tenant & Branch Isolation Monitor/i)).toBeInTheDocument();
    expect(screen.getByText(/Zero Cross-Tenant Leakage Invariant/i)).toBeInTheDocument();
    expect(screen.getByText(/Live Cross-Tenant Security Probe Simulator/i)).toBeInTheDocument();

    const probeButton = screen.getByRole('button', { name: /Simulate API Attack/i });
    expect(probeButton).toBeInTheDocument();

    fireEvent.click(probeButton);

    await waitFor(
      () => {
        expect(screen.getByText(/HTTP_403_TENANT_BOUNDARY_FORBIDDEN/i)).toBeInTheDocument();
      },
      { timeout: 2000 }
    );

    expect(
      screen.getByText(/Cross-Tenant Access Violation Blocked: Actor session belongs to TENANT_001/i)
    ).toBeInTheDocument();
  });

  it('renders superadmin governance safeguards, break-glass accounts, and impersonation controls', () => {
    render(<SuperadminSecurityOverviewGovernanceCard />);

    expect(screen.getByText(/SuperAdmin Governance & Four-Eyes Safeguards/i)).toBeInTheDocument();
    expect(screen.getByText(/Dual-Authorization Law/i)).toBeInTheDocument();
    expect(screen.getByText(/2 Emergency Accounts/i)).toBeInTheDocument();
    expect(screen.getByText(/breakglass\.primary@libraryos\.internal/i)).toBeInTheDocument();
    expect(screen.getByText(/breakglass\.secondary@libraryos\.internal/i)).toBeInTheDocument();
    expect(screen.getByText(/Time-Limited & Logged Admin Impersonation/i)).toBeInTheDocument();
  });
});
