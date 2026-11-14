// RESPONSIBILITY: Define source-level test coverage for subscriptions overview using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_subscriptions/subscriptions_overview/tests/SuperadminSubscriptionsOverviewUnsavedChangesGuardHook.test.tsx -> module-local test harness/fixtures -> assertions and regression evidence.
import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useSuperadminSubscriptionsOverviewUnsavedChangesGuard } from '@/app/frontend_superadmin/superadmin_subscriptions/subscriptions_overview/hooks/useSuperadminSubscriptionsOverviewUnsavedChangesGuard';

afterEach(() => {
  document.querySelectorAll('dialog[data-superadmin-confirm]').forEach((dialog) => dialog.remove());
  vi.restoreAllMocks();
});

async function dismissConfirmation(approved: boolean) {
  const dialog = await waitFor(() => {
    const current = document.querySelector<HTMLDialogElement>('dialog[data-superadmin-confirm]');
    if (!current) throw new Error('Expected accessible confirmation dialog to be present');
    return current;
  });
  const buttons = dialog.querySelectorAll<HTMLButtonElement>('button');
  const target = approved ? buttons[1] : buttons[0];
  if (!target) throw new Error('Confirmation dialog action button is missing');
  await act(async () => { target.click(); });
}

describe('useSuperadminSubscriptionsOverviewUnsavedChangesGuard', () => {
  it('allows navigation when the form is clean without opening a dialog', async () => {
    const { result } = renderHook(() => useSuperadminSubscriptionsOverviewUnsavedChangesGuard(false, 'Unsaved changes'));
    await expect(result.current.confirmLeave()).resolves.toBe(true);
    expect(document.querySelector('dialog[data-superadmin-confirm]')).toBeNull();
  });

  it('blocks navigation when the user declines the dirty-form warning', async () => {
    const { result } = renderHook(() => useSuperadminSubscriptionsOverviewUnsavedChangesGuard(true, 'Unsaved changes'));
    let pending!: Promise<boolean>;
    act(() => { pending = result.current.confirmLeave(); });
    await dismissConfirmation(false);
    await expect(pending).resolves.toBe(false);
  });

  it('intercepts same-origin anchor navigation while a dirty form confirmation is pending', async () => {
    const { unmount } = renderHook(() => useSuperadminSubscriptionsOverviewUnsavedChangesGuard(true, 'Unsaved changes'));
    const anchor = document.createElement('a');
    anchor.href = '/superadmin/next';
    document.body.appendChild(anchor);
    const event = new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 });
    try {
      anchor.dispatchEvent(event);
      expect(event.defaultPrevented).toBe(true);
      await dismissConfirmation(false);
      expect(document.querySelector('dialog[data-superadmin-confirm]')).toBeNull();
    } finally {
      unmount();
      anchor.remove();
    }
  });

  it('restores the protected URL without assuming traversal direction and prompts before leaving a dirty route', async () => {
    const goSpy = vi.spyOn(window.history, 'go').mockImplementation(() => undefined);
    const { unmount } = renderHook(() => useSuperadminSubscriptionsOverviewUnsavedChangesGuard(true, 'Unsaved changes'));
    const protectedHref = window.location.href;
    try {
      window.history.pushState({ route: 'previous' }, '', '/superadmin/previous');
      window.dispatchEvent(new PopStateEvent('popstate', { state: { route: 'previous' } }));
      expect(goSpy).not.toHaveBeenCalled();
      expect(window.location.href).toBe(protectedHref);
      await dismissConfirmation(false);
      expect(document.querySelector('dialog[data-superadmin-confirm]')).toBeNull();
    } finally {
      unmount();
      window.history.replaceState({}, '', protectedHref);
      goSpy.mockRestore();
    }
  });
});
