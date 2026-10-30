// Consolidated from useAdminAssetsMaintenanceUnsavedChangesGuard.test.ts; preserves the module-owned guard hook and its navigation assertions.
import { afterEach, describe, expect, it, vi, describe as __mergedDescribe } from 'vitest';
import { cleanup, fireEvent, render, screen, act, renderHook } from '@testing-library/react';
import AdminAccountingMaintenanceSummarySection from '@/app/frontend_admin/admin_accounts_assets/assets_maintenance/components/AdminAssetsMaintenanceSummarySection';
import { ADMIN_ACCOUNTING_MAINTENANCE_FIXTURES } from '@/app/frontend_admin/admin_accounts_assets/assets_maintenance/mocks/scenarios/admin_assets_maintenance.scenarios';

import { createAdminAccountingMaintenanceFormSchema } from '@/app/frontend_admin/admin_accounts_assets/assets_maintenance/schemas/AdminAssetsMaintenanceFormSchemas';
import englishMessages from '@/app/frontend_admin/admin_accounts_assets/assets_maintenance/locales/admin_assets_maintenance_en.json';
import hindiMessages from '@/app/frontend_admin/admin_accounts_assets/assets_maintenance/locales/admin_assets_maintenance_hi.json';


import useAdminAssetsMaintenanceUnsavedChangesGuard from '@/app/frontend_admin/admin_accounts_assets/assets_maintenance/hooks/useAdminAssetsMaintenanceUnsavedChangesGuard.ts';


afterEach(() => cleanup());

describe('AdminAccountingMaintenanceSummarySection', () => {
  it('derives maintenance summary counts from the supplied rows', () => {
    render(<AdminAccountingMaintenanceSummarySection logs={ADMIN_ACCOUNTING_MAINTENANCE_FIXTURES} totalCostLabel="₹1,200.00" labels={{ pending: 'Pending', inProgress: 'In progress', completed: 'Completed', totalCost: 'Total cost' }} />);
        expect(screen.getByText('Pending')).toBeTruthy();
        expect(screen.getByText('₹1,200.00')).toBeTruthy();
  });
});

__mergedDescribe("Original suite: AdminAssetsMaintenanceSchema.test.ts", () => {
const english = englishMessages.ADMIN_ACCOUNTING.MAINTENANCE;
const hindi = hindiMessages.ADMIN_ACCOUNTING.MAINTENANCE;

const invalidDraft = { assetName: '', issue: '', reportedDate: '', scheduledDate: '', vendor: '', cost: -1 };

describe('AdminAccountingMaintenanceFormSchema', () => {
  it('returns localized English validation messages for required fields and negative costs', () => {
    const result = createAdminAccountingMaintenanceFormSchema((key) => english[key]).safeParse(invalidDraft);
    expect(result.success).toBe(false);
    if (result.success) throw new Error('Expected invalid maintenance draft to be rejected.');
    const messages = result.error.issues.map((issue) => issue.message);
    expect(messages).toContain(english.VALIDATION_ASSET_REQUIRED);
    expect(messages).toContain(english.VALIDATION_ISSUE_REQUIRED);
    expect(messages).toContain(english.VALIDATION_COST_NONNEGATIVE);
  });

  it('returns Hindi validation messages from the supplied translator', () => {
    const result = createAdminAccountingMaintenanceFormSchema((key) => hindi[key]).safeParse(invalidDraft);
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues[0]?.message).toBe(hindi.VALIDATION_ASSET_REQUIRED);
  });

  it('accepts a valid maintenance draft and finite nonnegative cost', () => {
    const result = createAdminAccountingMaintenanceFormSchema((key) => english[key]).safeParse({
      assetName: 'Air Conditioner', issue: 'Filter cleaning', reportedDate: '2026-10-12',
      scheduledDate: '2026-10-14', vendor: 'Service Team', cost: 1250.5,
    });
    expect(result.success).toBe(true);
  });
});
});

__mergedDescribe("Original suite: useAdminAssetsMaintenanceUnsavedChangesGuard.test.ts", () => {
let anchor: HTMLAnchorElement | null = null;
afterEach(() => { anchor?.remove(); anchor = null; });

describe('useAdminAssetsMaintenanceUnsavedChangesGuard', () => {
  it('requests confirmation before same-origin navigation while dirty', () => {
    const onBlockedNavigation = vi.fn();
    renderHook(() => useAdminAssetsMaintenanceUnsavedChangesGuard(true, onBlockedNavigation));
    anchor = document.createElement('a');
    anchor.href = '/admin/next?tab=details';
    document.body.appendChild(anchor);
    act(() => { anchor?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 })); });
    expect(onBlockedNavigation).toHaveBeenCalledWith('/admin/next?tab=details');
  });

  it('does not intercept clean forms or browser exits', () => {
    const onBlockedNavigation = vi.fn();
    renderHook(() => useAdminAssetsMaintenanceUnsavedChangesGuard(false, onBlockedNavigation));
    const event = new Event('beforeunload', { cancelable: true });
    window.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(false);
    expect(onBlockedNavigation).not.toHaveBeenCalled();
  });
});
});
