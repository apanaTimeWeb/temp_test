import * as HarnessVitest from 'vitest';
import * as HarnessTestingLibrary from '@testing-library/react';
import { AdminMembersCouponsHarness as HarnessScenarioComponent } from '@/app/frontend_admin/admin_members/members_coupons/tests/harness/AdminMembersCouponsHarness';
import { AdminMembersCouponsScenarios as HarnessScenarioList } from '@/app/frontend_admin/admin_members/members_coupons/tests/harness/bootstrap';

import { fireEvent, render, screen } from '@testing-library/react';

import { describe, expect, it } from 'vitest';

import { AdminMembersCouponsHarness } from '@/app/frontend_admin/admin_members/members_coupons/tests/harness/AdminMembersCouponsHarness';


import { createAdminCouponsFormSchema } from '@/app/frontend_admin/admin_members/members_coupons/schemas/AdminMembersCouponsSchema';

import { formatAdminCouponsDiscount } from '@/app/frontend_admin/admin_members/members_coupons/components/AdminMembersCouponsOverviewSection';

import { NextIntlClientProvider } from 'next-intl';

import AdminCouponsOverviewSection from '@/app/frontend_admin/admin_members/members_coupons/components/AdminMembersCouponsOverviewSection';

import englishMessages from '@/app/frontend_admin/admin_members/members_coupons/locales/admin_members_coupons_en.json';

import type { AdminCouponsCoupon } from '@/app/frontend_admin/admin_members/members_coupons/schemas/AdminMembersCouponsSchema';

describe("Consolidated: AdminMembersCouponsHarness", () => {
});

describe("Consolidated: AdminMembersCouponsRegressionSuite", () => {
    describe('Original suite: AdminMembersCouponsFormSchema.test.ts', () => {
        const englishSchema = createAdminCouponsFormSchema({
            codeRequired: 'Coupon code is required.',
            discountPositive: 'Discount must be greater than zero.',
            discountPercentMax: 'Percentage discount cannot exceed 100%.',
            typeRequired: 'Choose a discount type.',
            maxUsesPositive: 'Maximum uses must be a positive whole number.',
            expiryRequired: 'Expiry date is required.',
            expiryInvalid: 'Enter a valid calendar date.',
        });
        const hindiSchema = createAdminCouponsFormSchema({
            codeRequired: 'कूपन कोड आवश्यक है।',
            discountPositive: 'डिस्काउंट शून्य से अधिक होना चाहिए।',
            discountPercentMax: 'प्रतिशत छूट 100% से अधिक नहीं हो सकती।',
            typeRequired: 'डिस्काउंट का प्रकार चुनें।',
            maxUsesPositive: 'अधिकतम उपयोग सकारात्मक पूर्ण संख्या होनी चाहिए।',
            expiryRequired: 'समाप्ति तिथि आवश्यक है।',
            expiryInvalid: 'मान्य कैलेंडर तिथि दर्ज करें।',
        });
        describe('AdminCoupons form validation', () => {
            it('accepts a valid flat discount draft and coerces numeric inputs', () => {
                const result = englishSchema.safeParse({ code: ' SAVE10 ', discount: '10', type: 'Flat', maxUses: '4', expiry: '2027-01-01' });
                expect(result.success).toBe(true);
                if (result.success)
                    expect(result.data).toMatchObject({ code: 'SAVE10', discount: 10, maxUses: 4 });
            });
            it('rejects invalid values with localized field messages', () => {
                const english = englishSchema.safeParse({ code: ' ', discount: '0', type: 'Flat', maxUses: '0.5', expiry: '' });
                const hindi = hindiSchema.safeParse({ code: ' ', discount: '0', type: 'Flat', maxUses: '0.5', expiry: '' });
                expect(english.success).toBe(false);
                expect(hindi.success).toBe(false);
                if (!english.success)
                    expect(english.error.issues.map((issue) => issue.message)).toEqual(expect.arrayContaining(['Coupon code is required.', 'Discount must be greater than zero.', 'Maximum uses must be a positive whole number.', 'Expiry date is required.']));
                if (!hindi.success)
                    expect(hindi.error.issues.map((issue) => issue.message)).toEqual(expect.arrayContaining(['कूपन कोड आवश्यक है।', 'डिस्काउंट शून्य से अधिक होना चाहिए।', 'अधिकतम उपयोग सकारात्मक पूर्ण संख्या होनी चाहिए।', 'समाप्ति तिथि आवश्यक है।']));
            });
        });
        describe('coupon discount and expiry boundaries', () => {
            const base = { code: 'TEST', maxUses: '1', expiry: '2024-02-29' };
            it('accepts 100 percent and rejects percentage discounts above 100', () => {
                expect(englishSchema.safeParse({ ...base, type: 'Percent', discount: '100' }).success).toBe(true);
                expect(englishSchema.safeParse({ ...base, type: 'Percent', discount: '100.01' }).success).toBe(false);
                expect(englishSchema.safeParse({ ...base, type: 'Percent', discount: '150' }).success).toBe(false);
                expect(englishSchema.safeParse({ ...base, type: 'Flat', discount: '-1' }).success).toBe(false);
            });
            it('rejects impossible dates and accepts a leap day', () => {
                expect(englishSchema.safeParse({ ...base, expiry: '2026-02-30', type: 'Flat', discount: '10' }).success).toBe(false);
                expect(englishSchema.safeParse({ ...base, expiry: '2024-02-29', type: 'Flat', discount: '10' }).success).toBe(true);
            });
        });
        describe('coupon date display formatting', () => {
            it('formats valid dates for English and Hindi and safely handles invalid data', async () => {
                const { formatAdminCouponsDate } = await import('@/app/frontend_admin/admin_members/members_coupons/components/AdminMembersCouponsOverviewSection');
                expect(formatAdminCouponsDate('2024-02-29', 'en')).not.toBe('2024-02-29');
                expect(formatAdminCouponsDate('2024-02-29', 'hi')).not.toBe('2024-02-29');
                expect(formatAdminCouponsDate('2026-02-30', 'en')).toBe('—');
            });
        });
    });
    describe('Original suite: AdminMembersCouponsFormatUtils.test.ts', () => {
        describe('formatAdminCouponsDiscount', () => {
            it('formats percentages without currency metadata', () => {
                expect(formatAdminCouponsDiscount({ discount: 15, type: 'Percent' }, 'en', 'off')).toBe('15% off');
            });
            it('does not display a flat discount without explicit currency', () => {
                expect(formatAdminCouponsDiscount({ discount: 15, type: 'Flat' }, 'en', 'off')).toBe('—');
                expect(formatAdminCouponsDiscount({ discount: 15, type: 'Flat', currencyCode: 'INR' }, 'en', 'off')).toBe('—');
                expect(formatAdminCouponsDiscount({ discount: 1500, type: 'Flat', currencyCode: 'INR', amountUnit: 'minor' }, 'en', 'off')).toContain('₹15.00');
            });
        });
    });
    describe('Original suite: AdminMembersCouponsKpiCards.test.tsx', () => {
        const completeUsageCoupon: AdminCouponsCoupon = {
            id: 'coupon-1', code: 'SAVE10', discount: 10, type: 'Percent', usedCount: 3, maxUses: 10, status: 'Active',
        };
        function renderKpis(coupons: readonly AdminCouponsCoupon[]) {
            return render(<NextIntlClientProvider locale="en" messages={englishMessages}>
        <AdminCouponsOverviewSection isDemoMode={true} onCreateCoupon={() => undefined} onValidateDraft={() => undefined} coupons={coupons} columns={[]} isError={false} isPending={false} onRetry={() => undefined}/>
      </NextIntlClientProvider>);
        }
        describe('AdminCouponsKpiCards', () => {
            it('shows total uses only when every coupon has a known usage count', () => {
                renderKpis([
                    completeUsageCoupon,
                    { id: 'coupon-2', code: 'MISSING-COUNT', discount: 5, type: 'Flat', maxUses: 20, status: 'Active' },
                ]);
                const totalUsesValue = screen.getByText('Total Uses').parentElement?.querySelector('p[aria-live]');
                expect(totalUsesValue?.textContent).toBe('—');
            });
            it('sums usage counts when all returned coupons provide a count', () => {
                renderKpis([
                    completeUsageCoupon,
                    { id: 'coupon-2', code: 'SAVE5', discount: 5, type: 'Flat', usedCount: 4, maxUses: 20, status: 'Active' },
                ]);
                const totalUsesValue = screen.getByText('Total Uses').parentElement?.querySelector('p[aria-live]');
                expect(totalUsesValue?.textContent).toBe('7');
            });
        });
    });
});


// Standalone harness scenario coverage (merged without changing assertions).
HarnessVitest.describe('members_coupons scenario harness', () => {
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
