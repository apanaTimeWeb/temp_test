import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { AdminSystemGapFillingPage } from '@/app/frontend_admin/admin_system/system_gap_filling/components/AdminSystemGapFillingPage';
import { isFrontendDemoModeEnabled } from '@/app/frontend_admin/lib/runtimeFeatures';

vi.mock('next-intl', () => ({ useTranslations: () => (key: string) => key }));
vi.mock('@/app/frontend_admin/lib/runtimeFeatures', () => ({ isFrontendDemoModeEnabled: vi.fn() }));
vi.mock('sonner', () => ({ toast: { info: vi.fn() } }));

describe('AdminSystemGapFillingPage control selectors', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(isFrontendDemoModeEnabled).mockReturnValue(true);
  });

  it('uses a stable unique test id for every mapped quick-assign action', () => {
    render(<AdminSystemGapFillingPage />);
    fireEvent.click(screen.getByRole('button', { name: 'PREVIEW_SAMPLE_GAPS' }));

    const actions = screen.getAllByRole('button', { name: 'QUICK_ASSIGN' });
    const testIds = actions.map((action) => action.getAttribute('data-testid'));

    expect(actions.length).toBeGreaterThan(1);
    expect(testIds.every((testId) => testId?.startsWith('admin_system-gap-filling-quick-assign-'))).toBe(true);
    expect(new Set(testIds).size).toBe(testIds.length);
  });
});


it('marks a seat as assigned in the local demo preview only', async () => {
  const { toast } = await import('sonner');
  render(<AdminSystemGapFillingPage />);
  fireEvent.click(screen.getByRole('button', { name: 'PREVIEW_SAMPLE_GAPS' }));

  const assignAction = screen.getAllByRole('button', { name: 'QUICK_ASSIGN' })[0];
  fireEvent.click(assignAction);

  expect(screen.getByText('ASSIGNED_DEMO')).toBeTruthy();
  expect(toast.info).toHaveBeenCalledWith('ASSIGN_DEMO_TOAST', expect.objectContaining({ id: expect.stringContaining('admin-system-gap-assign-') }));
});
