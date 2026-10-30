import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import AdminErrorBoundary from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveErrorBoundary';

afterEach(() => { vi.restoreAllMocks(); });

describe('AdminPrimitiveErrorBoundary retry and reset semantics', () => {
  it('forces a child remount on Retry so stale local state is not retained', () => {
    let mounts = 0;
    let shouldFail = true;
    function MountTrackedChild() {
      const [mountId] = useState(() => ++mounts);
      if (shouldFail) throw new Error('first mount fails');
      return <p>Child mount {mountId}</p>;
    }
    render(<AdminErrorBoundary title="Unavailable" description="Try again" retryLabel="Retry"><MountTrackedChild /></AdminErrorBoundary>);
    expect(screen.getByRole('alert')).toBeTruthy();
    shouldFail = false;
    fireEvent.click(screen.getByRole('button', { name: 'Retry' }));
    expect(screen.getByText(/Child mount/)).toBeTruthy();
  });

  it('calls onReset and remounts the child tree on Retry', () => {
    let shouldFail = true;
    function RecoveringChild() {
      if (shouldFail) throw new Error('transient child error');
      return <p>Recovered content</p>;
    }
    const onReset = vi.fn();
    render(<AdminErrorBoundary title="Unavailable" description="Try again" retryLabel="Retry" onReset={onReset}><RecoveringChild /></AdminErrorBoundary>);
    expect(screen.getByRole('alert')).toBeTruthy();
    shouldFail = false;
    fireEvent.click(screen.getByRole('button', { name: 'Retry' }));
    expect(onReset).toHaveBeenCalledOnce();
    expect(screen.getByText('Recovered content')).toBeTruthy();
  });

  it('resets an errored child when resetKeys change', () => {
    let shouldFail = true;
    function RecoveringChild() {
      if (shouldFail) throw new Error('reset-key child error');
      return <p>Reset-key content</p>;
    }
    const { rerender } = render(<AdminErrorBoundary title="Unavailable" description="Try again" retryLabel="Retry" resetKeys={['first']}><RecoveringChild /></AdminErrorBoundary>);
    expect(screen.getByRole('alert')).toBeTruthy();
    shouldFail = false;
    rerender(<AdminErrorBoundary title="Unavailable" description="Try again" retryLabel="Retry" resetKeys={['second']}><RecoveringChild /></AdminErrorBoundary>);
    expect(screen.getByText('Reset-key content')).toBeTruthy();
  });
});
