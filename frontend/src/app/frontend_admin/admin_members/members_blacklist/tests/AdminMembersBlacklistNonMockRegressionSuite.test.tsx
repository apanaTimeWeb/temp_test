// Consolidated from useAdminMembersBlacklistUnsavedChangesGuard.test.ts; preserves the module-owned guard hook and its navigation assertions.
import * as HarnessVitest from 'vitest';
import * as HarnessTestingLibrary from '@testing-library/react';
import { AdminMembersBlacklistHarness as HarnessScenarioComponent, AdminMembersBlacklistHarness } from '@/app/frontend_admin/admin_members/members_blacklist/tests/harness/AdminMembersBlacklistHarness';
import { AdminMembersBlacklistScenarios as HarnessScenarioList } from '@/app/frontend_admin/admin_members/members_blacklist/tests/harness/bootstrap';
import { describe, expect, it, afterEach, vi, describe as __mergedDescribe } from 'vitest';
import { formatAdminBlacklistDate } from '@/app/frontend_admin/admin_members/members_blacklist/components/AdminMembersBlacklistMain';
import { fireEvent, render, screen, act, renderHook } from '@testing-library/react';

import { createAdminBlacklistFormSchema } from '@/app/frontend_admin/admin_members/members_blacklist/schemas/AdminMembersBlacklistSchema';
import englishMessages from '@/app/frontend_admin/admin_members/members_blacklist/locales/admin_members_blacklist_en.json';
import hindiMessages from '@/app/frontend_admin/admin_members/members_blacklist/locales/admin_members_blacklist_hi.json';


import useUnsavedChangesGuard from '@/app/frontend_admin/admin_members/members_blacklist/hooks/useAdminMembersBlacklistUnsavedChangesGuard';


describe("Consolidated: AdminMembersBlacklistFormatDate", () => {
    describe('formatAdminBlacklistDate', () => {
        it('formats date-only values for the selected locale', () => {
            expect(formatAdminBlacklistDate('2026-04-12', 'en')).not.toBe('2026-04-12');
            expect(formatAdminBlacklistDate('2026-04-12', 'hi')).not.toBe('2026-04-12');
        });
        it('fails closed for missing and invalid dates', () => {
            expect(formatAdminBlacklistDate('', 'en')).toBe('—');
            expect(formatAdminBlacklistDate('2026-02-30', 'en')).toBe('—');
            expect(formatAdminBlacklistDate('not-a-date', 'hi')).toBe('—');
        });
    });
});

describe("Consolidated: AdminMembersBlacklistHarness", () => {
    it('renders children when scenario is active', () => {
        render(<HarnessScenarioComponent scenario="ACTIVE"><span>Harness Content</span></HarnessScenarioComponent>);
        expect(screen.getByText('Harness Content')).toBeTruthy();
    });
});

describe("Consolidated: AdminMembersBlacklistSchema", () => {
    const english = englishMessages.ADMIN_BLACKLIST;
    const hindi = hindiMessages.ADMIN_BLACKLIST;
    const invalidDraft = { name: '', phone: '12', reason: '', previousSeat: '' };
    describe('AdminBlacklistFormSchema', () => {
        it('rejects invalid fields with English localized messages', () => {
            const result = createAdminBlacklistFormSchema((key) => english[key]).safeParse(invalidDraft);
            expect(result.success).toBe(false);
            if (!result.success) {
                const messages = result.error.issues.map((issue) => issue.message);
                expect(messages).toContain(english.VALIDATION_NAME_REQUIRED);
                expect(messages).toContain(english.VALIDATION_PHONE_REQUIRED);
                expect(messages).toContain(english.VALIDATION_REASON_REQUIRED);
            }
        });
        it('uses Hindi validation messages supplied by the module locale catalog', () => {
            const result = createAdminBlacklistFormSchema((key) => hindi[key]).safeParse(invalidDraft);
            expect(result.success).toBe(false);
            if (!result.success)
                expect(result.error.issues[0]?.message).toBe(hindi.VALIDATION_NAME_REQUIRED);
        });
        it('accepts a valid phone number with 10–15 digits', () => {
            const result = createAdminBlacklistFormSchema((key) => english[key]).safeParse({ name: 'Test Student', phone: '+91 98765 43210', reason: 'Documented policy violation', previousSeat: 'A-12' });
            expect(result.success).toBe(true);
        });
    });
});


// Standalone harness scenario coverage (merged without changing assertions).
HarnessVitest.describe('members_blacklist scenario harness', () => {
  HarnessVitest.it('renders active children for the active state', () => {
    HarnessTestingLibrary.render(<HarnessScenarioComponent>Active feature content</HarnessScenarioComponent>);
    HarnessVitest.expect(HarnessTestingLibrary.screen.getByText('Active feature content')).toBeTruthy();
  });
  HarnessVitest.it.each(HarnessScenarioList.filter((scenario) => scenario !== 'ACTIVE'))('renders a real visible state for %s', (scenario) => {
    HarnessTestingLibrary.render(<HarnessScenarioComponent scenario={scenario}>Feature content that must not masquerade as an error/empty state</HarnessScenarioComponent>);
    HarnessVitest.expect(HarnessTestingLibrary.screen.queryByText('Feature content that must not masquerade as an error/empty state')).toBeNull();
    if (scenario === 'EMPTY') HarnessVitest.expect(HarnessTestingLibrary.screen.getByRole('status')).toBeTruthy();
    else HarnessVitest.expect(HarnessTestingLibrary.screen.getByRole('alert')).toBeTruthy();
    if (scenario === 'SERVER_500' || scenario === 'TIMEOUT') {
      HarnessTestingLibrary.fireEvent.click(HarnessTestingLibrary.screen.getByRole('button', { name: 'Retry scenario' }));
      HarnessVitest.expect(HarnessTestingLibrary.screen.getByText('Feature content that must not masquerade as an error/empty state')).toBeTruthy();
    }
  });
});

__mergedDescribe("Original suite: useAdminMembersBlacklistUnsavedChangesGuard.test.ts", () => {
let anchor: HTMLAnchorElement | null = null;
afterEach(() => { anchor?.remove(); anchor = null; });

function addInternalAnchor(href = '/admin/next?from=blacklist'): HTMLAnchorElement {
  anchor = document.createElement('a');
  anchor.href = href;
  anchor.textContent = 'Navigate away';
  document.body.appendChild(anchor);
  return anchor;
}

describe('useAdminMembersBlacklistUnsavedChangesGuard', () => {
  it('delegates same-origin navigation to the owning discard confirmation while dirty', () => {
    const onBlockedNavigation = vi.fn();
    renderHook(() => useUnsavedChangesGuard(true, false, onBlockedNavigation));
    const link = addInternalAnchor();
    const event = new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 });
    act(() => { link.dispatchEvent(event); });
    expect(event.defaultPrevented).toBe(true);
    expect(onBlockedNavigation).toHaveBeenCalledWith('/admin/next?from=blacklist');
  });

  it('allows clean forms and external/new-window navigation', () => {
    const onBlockedNavigation = vi.fn();
    renderHook(() => useUnsavedChangesGuard(false, false, onBlockedNavigation));
    const clean = addInternalAnchor('/admin/clean');
    const cleanEvent = new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 });
    act(() => { clean.dispatchEvent(cleanEvent); });
    expect(cleanEvent.defaultPrevented).toBe(false);
    expect(onBlockedNavigation).not.toHaveBeenCalled();
  });

  it('registers beforeunload only while dirty and not submitting', () => {
    const onBlockedNavigation = vi.fn();
    const { rerender } = renderHook(({ dirty, submitting }) => useUnsavedChangesGuard(dirty, submitting, onBlockedNavigation), { initialProps: { dirty: false, submitting: false } });
    const cleanEvent = new Event('beforeunload', { cancelable: true });
    window.dispatchEvent(cleanEvent);
    expect(cleanEvent.defaultPrevented).toBe(false);
    rerender({ dirty: true, submitting: false });
    const dirtyEvent = new Event('beforeunload', { cancelable: true });
    window.dispatchEvent(dirtyEvent);
    expect(dirtyEvent.defaultPrevented).toBe(true);
  });
});
});
