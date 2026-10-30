import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import useAdminSystemBackupsUnsavedChangesGuard from '@/app/frontend_admin/admin_system/system_backups/hooks/useAdminSystemBackupsUnsavedChangesGuard.ts';

let anchor: HTMLAnchorElement | null = null;
afterEach(() => { anchor?.remove(); anchor = null; });

describe('useAdminSystemBackupsUnsavedChangesGuard', () => {
  it('intercepts same-origin navigation while dirty and allows clean navigation', () => {
    const callback = vi.fn();
    const { rerender } = renderHook(({ dirty }) => useAdminSystemBackupsUnsavedChangesGuard(dirty, callback), { initialProps: { dirty: true } });
    anchor = document.createElement('a'); anchor.href = '/admin/next'; document.body.appendChild(anchor);
    act(() => anchor?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 })));
    expect(callback).toHaveBeenCalledWith('/admin/next');
    callback.mockClear(); rerender({ dirty: false });
    const clean = new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 });
    act(() => anchor?.dispatchEvent(clean));
    expect(clean.defaultPrevented).toBe(false); expect(callback).not.toHaveBeenCalled();
  });
});
