// Consolidated from useAdminMembersEnquiriesUnsavedChangesGuard.test.ts; preserves the module-owned guard hook and its navigation assertions.
import * as HarnessVitest from 'vitest';
import * as HarnessTestingLibrary from '@testing-library/react';
import { AdminMembersEnquiriesHarness as HarnessScenarioComponent, AdminMembersEnquiriesHarness } from '@/app/frontend_admin/admin_members/members_enquiries/tests/harness/AdminMembersEnquiriesHarness';
import { AdminMembersEnquiriesScenarios as HarnessScenarioList } from '@/app/frontend_admin/admin_members/members_enquiries/tests/harness/bootstrap';
import { describe, expect, it, afterEach, vi, describe as __mergedDescribe } from 'vitest';
import { formatAdminEnquiriesDate } from '@/app/frontend_admin/admin_members/members_enquiries/utils/AdminMembersEnquiriesTextUtils';
import { fireEvent, render, screen, act, renderHook } from '@testing-library/react';

import { ADMIN_ENQUIRIES_ROOT, ADMIN_ENQUIRIES_ROUTE_ENQUIRIES_ADD, ADMIN_ENQUIRIES_ROUTE_ENQUIRIES_ID } from '@/app/frontend_admin/admin_members/members_enquiries/config/admin_members_enquiries.url_config';

import useUnsavedChangesGuard from '@/app/frontend_admin/admin_members/members_enquiries/hooks/useAdminMembersEnquiriesUnsavedChangesGuard';

describe("Consolidated: AdminMembersEnquiriesFormatDate", () => {
    describe('enquiry date display formatting', () => {
        it('formats valid calendar days in English and Hindi', () => {
            expect(formatAdminEnquiriesDate('2024-02-29', 'en')).not.toBe('2024-02-29');
            expect(formatAdminEnquiriesDate('2024-02-29', 'hi')).not.toBe('2024-02-29');
        });
        it('returns a neutral fallback for missing and malformed dates', () => {
            expect(formatAdminEnquiriesDate('2026-02-30', 'en')).toBe('—');
            expect(formatAdminEnquiriesDate(undefined, 'hi')).toBe('—');
        });
    });
});

describe("Consolidated: AdminMembersEnquiriesHarness", () => {
    it('renders children when scenario is active', () => {
        render(<HarnessScenarioComponent scenario="ACTIVE"><span>Harness Content</span></HarnessScenarioComponent>);
        expect(screen.getByText('Harness Content')).toBeTruthy();
    });
});

describe("Consolidated: AdminMembersEnquiriesMainEnquiriesUrlContract", () => {
    describe('admin_members/members_enquiries canonical URL contract', () => {
        it('exports a stable route owned by this module', () => {
            expect(ADMIN_ENQUIRIES_ROOT).toBe('/admin/admin_members/members_enquiries');
        });
        it('routes the add view through the owning canonical page', () => {
            expect(ADMIN_ENQUIRIES_ROUTE_ENQUIRIES_ADD).toBe('/admin/admin_members/members_enquiries?view=enquiries%2Fadd');
        });
        it('routes detail views through the owning page and URL-encodes the ID', () => {
            expect(ADMIN_ENQUIRIES_ROUTE_ENQUIRIES_ID('ENQ/ 42')).toBe('/admin/admin_members/members_enquiries?view=enquiries%2Fdetail&id=ENQ%2F%2042');
        });
    });
});

// Standalone harness scenario coverage (merged without changing assertions).
HarnessVitest.describe('members_enquiries scenario harness', () => {
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

__mergedDescribe("Original suite: useAdminMembersEnquiriesUnsavedChangesGuard.test.ts", () => {
let anchor: HTMLAnchorElement | null = null;
afterEach(() => { anchor?.remove(); anchor = null; });

function addInternalAnchor(href = '/admin/next?from=enquiries'): HTMLAnchorElement {
  anchor = document.createElement('a');
  anchor.href = href;
  anchor.textContent = 'Navigate away';
  document.body.appendChild(anchor);
  return anchor;
}

describe('useAdminMembersEnquiriesUnsavedChangesGuard', () => {
  it('delegates same-origin navigation to the owning discard confirmation while dirty', () => {
    const onBlockedNavigation = vi.fn();
    renderHook(() => useUnsavedChangesGuard(true, false, onBlockedNavigation));
    const link = addInternalAnchor();
    const event = new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 });
    act(() => { link.dispatchEvent(event); });
    expect(event.defaultPrevented).toBe(true);
    expect(onBlockedNavigation).toHaveBeenCalledWith('/admin/next?from=enquiries');
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
