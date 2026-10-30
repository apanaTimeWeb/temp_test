// Consolidated from useAdminSystemWaitlistAutomationUnsavedChangesGuard.test.ts; preserves the module-owned guard hook and its navigation assertions.
import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi, describe as __mergedDescribe } from 'vitest';
import useAdminSystemWaitlistAutomationUnsavedChangesGuard from '@/app/frontend_admin/admin_system/system_waitlist_automation/hooks/useAdminSystemWaitlistAutomationUnsavedChangesGuard.ts';

import { createAdminSystemWaitlistPreviewSchema } from '@/app/frontend_admin/admin_system/system_waitlist_automation/schemas/AdminSystemWaitlistAutomationWaitlistPreviewSchema';


let anchor: HTMLAnchorElement | null = null;
afterEach(() => { anchor?.remove(); anchor = null; });

describe('useAdminSystemWaitlistAutomationUnsavedChangesGuard', () => {
  it('intercepts same-origin navigation while dirty and allows clean navigation', () => {
    const callback = vi.fn();
    const { rerender } = renderHook(({ dirty }) => useAdminSystemWaitlistAutomationUnsavedChangesGuard(dirty, callback), { initialProps: { dirty: true } });
    anchor = document.createElement('a'); anchor.href = '/admin/next'; document.body.appendChild(anchor);
    act(() => anchor?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 })));
    expect(callback).toHaveBeenCalledWith('/admin/next');
    callback.mockClear(); rerender({ dirty: false });
    const clean = new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 });
    act(() => anchor?.dispatchEvent(clean));
    expect(clean.defaultPrevented).toBe(false); expect(callback).not.toHaveBeenCalled();
  });
});

__mergedDescribe("Original suite: AdminSystemWaitlistAutomationStandaloneContract.test.ts", () => {
// Responsibility: verify the isolated admin_system_waitlist_automation contract remains discoverable by the host test runner.


describe('admin_system_waitlist_automation standalone contract', () => {
  it('has a module-owned test harness', () => {
    expect('admin_system_waitlist_automation').toMatch(/^admin_[a-z0-9_]+$/);
  });
});
});

__mergedDescribe("Original suite: AdminSystemWaitlistAutomationWaitlistPreviewSchema.test.ts", () => {
const messages={delayInvalid:'delay-invalid',templateRequired:'template-required',templateTooLong:'template-too-long'};
describe('Admin System waitlist preview schema', () => { it('validates delay and template values', () => { const schema=createAdminSystemWaitlistPreviewSchema(messages); expect(schema.safeParse({enabled:true,delay:0,template:'Hello {name}'}).success).toBe(true); expect(schema.safeParse({enabled:false,delay:-1,template:''}).success).toBe(false); }); });
});
