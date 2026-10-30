import { act, fireEvent, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('next/navigation', () => ({
  usePathname: () => window.location.pathname,
  useSearchParams: () => new URLSearchParams(window.location.search),
}));

import useAdminSettingsProfileUnsavedChangesGuard from '@/app/frontend_admin/admin_settings/settings_profile/hooks/useAdminSettingsProfileUnsavedChangesGuard';

let testAnchor: HTMLAnchorElement | null = null;
const originalHref = `${window.location.pathname}${window.location.search}${window.location.hash}`;
afterEach(() => {
  testAnchor?.remove();
  testAnchor = null;
  window.history.replaceState({}, '', originalHref || '/');
});

function addNavigationAnchor(): HTMLAnchorElement {
  const anchor = document.createElement('a');
  anchor.href = '/admin/admin_settings/settings_profile?view=security';
  anchor.textContent = 'Navigate away';
  document.body.appendChild(anchor);
  testAnchor = anchor;
  return anchor;
}

describe('useAdminSettingsProfileUnsavedChangesGuard', () => {
  it('blocks same-origin anchor navigation while a profile draft is dirty', () => {
    const onBlockedNavigation = vi.fn();
    renderHook(() => useAdminSettingsProfileUnsavedChangesGuard(true, onBlockedNavigation));
    fireEvent.click(addNavigationAnchor());
    expect(onBlockedNavigation).toHaveBeenCalledWith('/admin/admin_settings/settings_profile?view=security');
  });

  it('allows same-origin anchor navigation when no draft is dirty', () => {
    const onBlockedNavigation = vi.fn();
    renderHook(() => useAdminSettingsProfileUnsavedChangesGuard(false, onBlockedNavigation));
    const event = new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 });
    act(() => { addNavigationAnchor().dispatchEvent(event); });
    expect(event.defaultPrevented).toBe(false);
    expect(onBlockedNavigation).not.toHaveBeenCalled();
  });


  it('restores the dirty entry before requesting confirmation on browser back/forward', () => {
    window.history.replaceState({}, '', '/admin/admin_settings/settings_profile?view=edit');
    const onBlockedNavigation = vi.fn();
    renderHook(() => useAdminSettingsProfileUnsavedChangesGuard(true, onBlockedNavigation));
    const forward = vi.spyOn(window.history, 'forward').mockImplementation(() => {
      window.history.replaceState({}, '', '/admin/admin_settings/settings_profile?view=edit');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });

    window.history.pushState({}, '', '/admin/admin_settings/dashboard');
    window.dispatchEvent(new PopStateEvent('popstate'));

    expect(forward).toHaveBeenCalledOnce();
    expect(onBlockedNavigation).toHaveBeenCalledWith('/admin/admin_settings/dashboard');
    forward.mockRestore();
  });

  it('registers the browser-exit guard only while dirty', () => {
    const onBlockedNavigation = vi.fn();
    const { rerender } = renderHook(({ isDirty }) => useAdminSettingsProfileUnsavedChangesGuard(isDirty, onBlockedNavigation), { initialProps: { isDirty: false } });
    const cleanEvent = new Event('beforeunload', { cancelable: true });
    window.dispatchEvent(cleanEvent);
    expect(cleanEvent.defaultPrevented).toBe(false);

    rerender({ isDirty: true });
    const dirtyEvent = new Event('beforeunload', { cancelable: true });
    window.dispatchEvent(dirtyEvent);
    expect(dirtyEvent.defaultPrevented).toBe(true);
  });
});
