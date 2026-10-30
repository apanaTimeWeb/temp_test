// Consolidated from useAdminMembersPlansUnsavedChangesGuard.test.ts; preserves the module-owned guard hook and its navigation assertions.
import * as HarnessVitest from 'vitest';
import * as HarnessTestingLibrary from '@testing-library/react';
import HarnessScenarioComponent from '@/app/frontend_admin/admin_members/members_plans/tests/harness/AdminMembersPlansHarness';
import { AdminMembersPlansScenarios as HarnessScenarioList } from '@/app/frontend_admin/admin_members/members_plans/tests/harness/bootstrap';
import { fireEvent, render, screen, act, renderHook } from '@testing-library/react';
import { describe, expect, it, afterEach, vi, describe as __mergedDescribe } from 'vitest';

import type { AdminPlansPlan } from '@/app/frontend_admin/admin_members/members_plans/schemas/AdminMembersPlansSchema';
import { removeAdminPlansDemoPlan, upsertAdminPlansDemoPlan, formatAdminPlansPrice, AdminPlansEmptyState } from '@/app/frontend_admin/admin_members/members_plans/components/AdminMembersPlansPage';

import { NextIntlClientProvider } from 'next-intl';
import type { ReactNode } from 'react';

import { AdminPlansErrorBoundary } from '@/app/frontend_admin/admin_members/members_plans/components/AdminMembersPlansErrorBoundary';
import RouteErrorBoundary from '@/app/frontend_admin/admin_members/members_plans/error';
import englishMessages from '@/app/frontend_admin/admin_members/members_plans/locales/admin_members_plans_en.json';
import hindiMessages from '@/app/frontend_admin/admin_members/members_plans/locales/admin_members_plans_hi.json';
import { AdminPlansApiResponseSchema, AdminPlansFormSchema } from '@/app/frontend_admin/admin_members/members_plans/schemas/AdminMembersPlansSchema';

import { ADMIN_PLANS_STATUS_VALUES } from '@/app/frontend_admin/admin_members/members_plans/config/admin_members_plans.url_config';


import useUnsavedChangesGuard from '@/app/frontend_admin/admin_members/members_plans/hooks/useAdminMembersPlansUnsavedChangesGuard';


describe("Consolidated: AdminMembersPlansHarness", () => {
});

describe("Consolidated: AdminMembersPlansRegressionSuite", () => {
    describe('Original suite: AdminMembersPlansDemoStateUtils.test.ts', () => {
        const plan: AdminPlansPlan = { id: 'demo-1', name: 'Basic', price: 100, duration: '30 days', durationDays: 30, features: ['Access'], status: 'Active', subscribers: 0 };
        describe('admin plans demo state', () => {
            it('creates, updates and deletes user-entered plans immutably', () => {
                const created = upsertAdminPlansDemoPlan([], plan);
                expect(created).toEqual([plan]);
                const updated = upsertAdminPlansDemoPlan(created, { ...plan, name: 'Basic Plus' });
                expect(updated).toHaveLength(1);
                expect(updated[0]?.name).toBe('Basic Plus');
                expect(created[0]?.name).toBe('Basic');
                expect(removeAdminPlansDemoPlan(updated, 'demo-1')).toEqual([]);
            });
        });
    });
    describe('Original suite: AdminMembersPlansFormatPrice.test.ts', () => {
        describe('formatAdminPlansPrice', () => {
            it('formats explicit major and minor units', () => {
                expect(formatAdminPlansPrice(1234.5, 'INR', 'major', 'en')).toContain('1,234.50');
                expect(formatAdminPlansPrice(123450, 'INR', 'minor', 'en')).toContain('1,234.50');
            });
            it('fails closed when currency or amount scale is missing', () => {
                expect(formatAdminPlansPrice(1234, undefined, 'major', 'en')).toBe('—');
                expect(formatAdminPlansPrice(1234, 'INR', undefined, 'en')).toBe('—');
            });
        });
    });
    describe('Original suite: AdminMembersPlansLocalizedFallbacks.test.tsx', () => {
        afterEach(() => {
            vi.restoreAllMocks();
        });
        function renderLocalized(locale: 'en' | 'hi', children: ReactNode) {
            const messages = locale === 'en' ? englishMessages : hindiMessages;
            return render(<NextIntlClientProvider locale={locale} messages={messages}>
        {children}
      </NextIntlClientProvider>);
        }
        function ThrowDuringRender(): never {
            throw new Error('intentional boundary test');
        }
        describe('Admin Plans localized fallback states', () => {
            it('renders the English empty-state defaults from the module catalog', () => {
                renderLocalized('en', <AdminPlansEmptyState />);
                expect(screen.getByText('No data found')).toBeTruthy();
                expect(screen.getByText('Create a membership plan to show it here.')).toBeTruthy();
            });
            it('renders the Hindi empty-state defaults from the module catalog', () => {
                renderLocalized('hi', <AdminPlansEmptyState />);
                expect(screen.getByText('कोई डेटा नहीं मिला')).toBeTruthy();
                expect(screen.getByText('इसे यहाँ दिखाने के लिए सदस्यता योजना बनाएँ।')).toBeTruthy();
            });
            it('localizes the route-level error and retry action', () => {
                const reset = vi.fn();
                renderLocalized('hi', <RouteErrorBoundary error={new Error('example')} reset={reset}/>);
                expect(screen.getByText('कुछ गलत हो गया।')).toBeTruthy();
                fireEvent.click(screen.getByRole('button', { name: 'फिर से कोशिश करें' }));
                expect(reset).toHaveBeenCalledTimes(1);
            });
            it('localizes the class error-boundary fallback', () => {
                vi.spyOn(console, 'error').mockImplementation(() => undefined);
                renderLocalized('en', <AdminPlansErrorBoundary><ThrowDuringRender /></AdminPlansErrorBoundary>);
                expect(screen.getByRole('alert').textContent).toBe('The Plans module could not display this view.');
            });
        });
    });
    describe('Original suite: AdminMembersPlansSchema.test.ts', () => {
        describe('AdminPlansFormSchema', () => {
            it('accepts valid plan input', () => {
                expect(AdminPlansFormSchema.safeParse({ name: 'Monthly', price: '1000', duration: '1 Month', durationDays: '30', features: 'Locker access' }).success).toBe(true);
            });
            it('rejects invalid price and non-positive/non-integer validity', () => {
                expect(AdminPlansFormSchema.safeParse({ name: 'A', price: '-3', duration: 'Month', durationDays: '0', features: '' }).success).toBe(false);
                expect(AdminPlansFormSchema.safeParse({ name: 'Monthly', price: '100', duration: 'Month', durationDays: '1.5', features: '' }).success).toBe(false);
            });
            it('rejects blank names, non-finite values, invalid duration and invalid subscriber counts at the API boundary', () => {
                const base = { id: 'plan-1', name: 'Monthly', price: 100, durationInDays: 30, features: ['Locker'], subscribers: 0 };
                expect(AdminPlansApiResponseSchema.safeParse([{ ...base, name: '   ' }]).success).toBe(false);
                expect(AdminPlansApiResponseSchema.safeParse([{ ...base, price: Number.POSITIVE_INFINITY }]).success).toBe(false);
                expect(AdminPlansApiResponseSchema.safeParse([{ ...base, durationInDays: 1.5 }]).success).toBe(false);
                expect(AdminPlansApiResponseSchema.safeParse([{ ...base, subscribers: -1 }]).success).toBe(false);
            });
            it('does not invent persistence behavior', () => {
                expect(AdminPlansFormSchema.safeParse({ name: 'Monthly', price: '1000', duration: '1 Month', durationDays: '30', features: '' }).success).toBe(true);
            });
        });
    });
    describe('Original suite: AdminMembersPlansStatusConstants.test.ts', () => {
        describe('AdminPlans status contract', () => {
            it('accepts every canonical status', () => {
                for (const status of ADMIN_PLANS_STATUS_VALUES) {
                    expect(AdminPlansApiResponseSchema.safeParse([{ id: 'plan-1', name: 'Demo', price: 100, durationInDays: 30, status }]).success).toBe(true);
                }
            });
            it('rejects unknown backend status values', () => {
                expect(AdminPlansApiResponseSchema.safeParse([{ id: 'plan-1', name: 'Demo', price: 100, durationInDays: 30, status: 'Archived' }]).success).toBe(false);
            });
        });
    });
});


// Standalone harness scenario coverage (merged without changing assertions).
HarnessVitest.describe('members_plans scenario harness', () => {
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

__mergedDescribe("Original suite: useAdminMembersPlansUnsavedChangesGuard.test.ts", () => {
let anchor: HTMLAnchorElement | null = null;
afterEach(() => { anchor?.remove(); anchor = null; });

function addInternalAnchor(href = '/admin/next?from=plans'): HTMLAnchorElement {
  anchor = document.createElement('a');
  anchor.href = href;
  anchor.textContent = 'Navigate away';
  document.body.appendChild(anchor);
  return anchor;
}

describe('useAdminMembersPlansUnsavedChangesGuard', () => {
  it('delegates same-origin navigation to the owning discard confirmation while dirty', () => {
    const onBlockedNavigation = vi.fn();
    renderHook(() => useUnsavedChangesGuard(true, false, onBlockedNavigation));
    const link = addInternalAnchor();
    const event = new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 });
    act(() => { link.dispatchEvent(event); });
    expect(event.defaultPrevented).toBe(true);
    expect(onBlockedNavigation).toHaveBeenCalledWith('/admin/next?from=plans');
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
