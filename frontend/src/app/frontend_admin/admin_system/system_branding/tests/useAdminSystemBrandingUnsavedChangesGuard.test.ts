import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import useAdminSystemBrandingUnsavedChangesGuard from '@/app/frontend_admin/admin_system/system_branding/hooks/useAdminSystemBrandingUnsavedChangesGuard';

let anchor: HTMLAnchorElement | null = null;
afterEach(() => { anchor?.remove(); anchor = null; });

describe('useAdminSystemBrandingUnsavedChangesGuard', () => {
  it('delegates same-origin route clicks to the confirmation owner while dirty', () => {
    const onBlockedNavigation = vi.fn();
    renderHook(() => useAdminSystemBrandingUnsavedChangesGuard(true, false, onBlockedNavigation));
    anchor = document.createElement('a'); anchor.href = '/admin/system?tab=branding'; document.body.appendChild(anchor);
    const event = new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 });
    act(() => { anchor?.dispatchEvent(event); });
    expect(event.defaultPrevented).toBe(true);
    expect(onBlockedNavigation).toHaveBeenCalledWith('/admin/system?tab=branding');
  });

  it('does not block clean drafts or a form submission', () => {
    const onBlockedNavigation = vi.fn();
    const { rerender } = renderHook(({ dirty, submitting }) => useAdminSystemBrandingUnsavedChangesGuard(dirty, submitting, onBlockedNavigation), { initialProps: { dirty: false, submitting: false } });
    anchor = document.createElement('a'); anchor.href = '/admin/other'; document.body.appendChild(anchor);
    const clean = new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 });
    act(() => { anchor?.dispatchEvent(clean); });
    expect(clean.defaultPrevented).toBe(false);
    rerender({ dirty: true, submitting: true });
    const submitting = new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 });
    act(() => { anchor?.dispatchEvent(submitting); });
    expect(submitting.defaultPrevented).toBe(false);
    expect(onBlockedNavigation).not.toHaveBeenCalled();
  });
});
