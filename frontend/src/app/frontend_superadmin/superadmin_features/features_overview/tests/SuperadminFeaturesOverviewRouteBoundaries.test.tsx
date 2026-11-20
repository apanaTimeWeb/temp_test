// RESPONSIBILITY: Route boundaries and fallback unit tests.
import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import SuperadminFeaturesOverviewListSkeleton from '@/app/frontend_superadmin/superadmin_features/features_overview/components/SuperadminFeaturesOverviewListSkeleton';
import SuperadminFeaturesOverviewErrorFallback from '@/app/frontend_superadmin/superadmin_features/features_overview/components/SuperadminFeaturesOverviewErrorFallback';
import SuperadminFeaturesOverviewNotFound from '@/app/frontend_superadmin/superadmin_features/features_overview/not-found';

describe('Superadmin Features Overview - Route Boundaries', () => {
  it('renders loading skeleton with accessibility attributes', () => {
    const { container } = render(<SuperadminFeaturesOverviewListSkeleton />);
    const skeleton = container.querySelector('[aria-busy="true"]');
    expect(skeleton).not.toBeNull();
  });

  it('renders error fallback with custom message and retry button', () => {
    render(
      <SuperadminFeaturesOverviewErrorFallback
        error={new Error('Database connection failed')}
        resetErrorBoundary={() => {}}
      />
    );
    expect(screen.getByText('Feature Governance Failed to Load')).toBeDefined();
    expect(screen.getByText('Database connection failed')).toBeDefined();
    expect(screen.getByText('Retry Loading')).toBeDefined();
  });

  it('renders not found boundary with return link', () => {
    render(<SuperadminFeaturesOverviewNotFound />);
    expect(screen.getByText('Feature Route Not Found')).toBeDefined();
    expect(screen.getByText('Return to Feature Control')).toBeDefined();
  });
});
