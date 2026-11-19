import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AdminLoader, AdminPageLoader, ButtonLoader } from '@/app/frontend_admin/components/AdminLoader';

describe('AdminLoader (Aurora Cyber-Luxury)', () => {
  it('renders with accessible status role and default label', () => {
    render(<AdminLoader />);
    const el = screen.getByRole('status', { name: 'Loading' });
    expect(el).toBeInTheDocument();
    expect(el).toHaveAttribute('aria-busy', 'true');
  });

  it('renders with custom icon, variant, size, and screenReaderText', () => {
    render(
      <AdminLoader
        size="lg"
        icon="layout-dashboard"
        variant="contra"
        label="Dashboard Loading"
        screenReaderText="Screen reader status"
      />
    );
    expect(screen.getByRole('status', { name: 'Dashboard Loading' })).toBeInTheDocument();
    expect(screen.getByText('Screen reader status')).toBeInTheDocument();
  });

  it('AdminPageLoader renders full-width centered container with optional message', () => {
    render(
      <AdminPageLoader
        icon="key-round"
        variant="contra"
        label="Security Loading"
        message="Authenticating network credentials..."
      />
    );
    expect(screen.getByRole('status', { name: 'Security Loading' })).toBeInTheDocument();
    expect(screen.getByText('Authenticating network credentials...')).toBeInTheDocument();
  });

  it('ButtonLoader renders inline xs loader with button-loader class', () => {
    render(<ButtonLoader icon="refresh-cw" label="Saving data" />);
    const loader = screen.getByRole('status', { name: 'Saving data' });
    expect(loader).toBeInTheDocument();
    expect(loader.className).toContain('button-loader');
  });
});
