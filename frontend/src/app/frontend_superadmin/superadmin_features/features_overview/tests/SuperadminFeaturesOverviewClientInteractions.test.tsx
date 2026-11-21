// RESPONSIBILITY: Component interaction tests for SuperadminFeaturesOverviewPageClient.
import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SuperadminFeaturesOverviewPageClient from '@/app/frontend_superadmin/superadmin_features/features_overview/components/SuperadminFeaturesOverviewPageClient';

describe('Superadmin Features Overview - Client Interactive Controls', () => {
  it('renders all 16 library module cards initially in grid view', () => {
    render(<SuperadminFeaturesOverviewPageClient />);

    expect(screen.getByText('07. Feature & Module Control')).toBeDefined();
    expect(screen.getByText('Total Library Modules')).toBeDefined();

    // Verify key modules are visible
    expect(screen.getByText('Dashboard')).toBeDefined();
    expect(screen.getByText('Books')).toBeDefined();
    expect(screen.getByText('Members')).toBeDefined();
    expect(screen.getByText('Seat Management')).toBeDefined();
    expect(screen.getByText('Issue & Return')).toBeDefined();
    expect(screen.getByText('Finance')).toBeDefined();
    expect(screen.getByText('Accounts')).toBeDefined();
    expect(screen.getByText('Communication')).toBeDefined();
    expect(screen.getByText('Staff Management')).toBeDefined();
    expect(screen.getByText('Reports')).toBeDefined();
    expect(screen.getByText('Export & Import')).toBeDefined();
    expect(screen.getByText('Advanced Analytics')).toBeDefined();
    expect(screen.getByText('WhatsApp Integration')).toBeDefined();
    expect(screen.getByText('SMS Integration')).toBeDefined();
    expect(screen.getByText('Barcode/QR')).toBeDefined();
    expect(screen.getByText('API Access')).toBeDefined();
  });

  it('switches between Card Grid view and Matrix Table view', () => {
    render(<SuperadminFeaturesOverviewPageClient />);

    // Table view button with exact title "Matrix Table View"
    const tableBtn = screen.getByTitle('Matrix Table View');
    fireEvent.click(tableBtn);

    // Should show table headers
    expect(screen.getByText('Category')).toBeDefined();
    expect(screen.getByText('SuperAdmin Control')).toBeDefined();
    expect(screen.getByText('Starter')).toBeDefined();
    expect(screen.getByText('Pro')).toBeDefined();
    expect(screen.getByText('Enterprise')).toBeDefined();
  });

  it('filters modules using search bar and category tabs', () => {
    render(<SuperadminFeaturesOverviewPageClient />);

    const searchInput = screen.getByPlaceholderText('Search 16 modules, endpoints, or descriptions...');
    fireEvent.change(searchInput, { target: { value: 'WhatsApp' } });

    // Should match WhatsApp Integration
    expect(screen.getByText('WhatsApp Integration')).toBeDefined();

    // Reset search
    fireEvent.change(searchInput, { target: { value: '' } });

    // Filter by Finance category
    const financeTab = screen.getByText('Finance & Accounts');
    fireEvent.click(financeTab);

    expect(screen.getByText('Finance')).toBeDefined();
    expect(screen.getByText('Accounts')).toBeDefined();
  });

  it('switches governance scope to a specific library and shows bulk actions', () => {
    render(<SuperadminFeaturesOverviewPageClient />);

    const scopeSelect = screen.getByDisplayValue(/Platform-Wide Defaults/i);
    fireEvent.change(scopeSelect, { target: { value: 'tenant_patna' } });

    // Bulk action buttons should now be available
    expect(screen.getByText('Enable All')).toBeDefined();
    expect(screen.getByText('Disable All')).toBeDefined();
    expect(screen.getByText('Reset Plan')).toBeDefined();
  });

  it('opens and closes API Guard Simulator Modal', () => {
    render(<SuperadminFeaturesOverviewPageClient />);

    const testApiButtons = screen.getAllByText('Test API Guard');
    fireEvent.click(testApiButtons[0]);

    // Modal title should appear
    expect(screen.getByText('Backend API Guard Simulator')).toBeDefined();
    expect(screen.getByText('Select API Endpoint & Method to Probe:')).toBeDefined();

    // Close button
    const closeBtn = screen.getByText('Close');
    fireEvent.click(closeBtn);

    expect(screen.queryByText('Select API Endpoint & Method to Probe:')).toBeNull();
  });
});
