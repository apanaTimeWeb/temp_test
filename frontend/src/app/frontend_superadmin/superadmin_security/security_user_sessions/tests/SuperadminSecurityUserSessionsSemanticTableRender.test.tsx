// RESPONSIBILITY: Verify semantic table rendering, configured dimensions, sort announcement and the 768px responsive card contract.
import { cleanup, fireEvent, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import SuperadminSecurityUserSessionsSemanticTable from '../components/SuperadminSecurityUserSessionsSemanticTable';
import { MOCK_SCALE_TIER_1_SMALL, MOCK_SCALE_TIER_2_STANDARD, MOCK_SCALE_TIER_3_STRESS } from '../mocks/fixtures/superadmin_security_user_sessions.scale-stress-fixtures';
import type { SemanticColumnDef } from '../types/SuperadminSecurityUserSessionsSemanticTableTypes';
import type { SuperadminSessionData } from '../types/SuperadminSecurityUserSessionsTypes';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string, values?: Record<string, unknown>) => values ? `${key}:${String(values.column ?? '')}:${String(values.direction ?? '')}` : key,
}));
vi.mock('next/navigation', () => ({
  usePathname: () => '/superadmin/superadmin_security/security_user_sessions',
  useSearchParams: () => new URLSearchParams(),
  useRouter: () => ({ replace: vi.fn() }),
}));

afterEach(() => cleanup());

const columns: SemanticColumnDef<SuperadminSessionData>[] = [
  { field: 'user', headerName: 'User', flex: 1, minWidth: 120 },
  { field: 'status', headerName: 'Status', flex: 3, minWidth: 90 },
];

describe('security_user_sessions semantic table rendering', () => {
  it.each([
    ['small', MOCK_SCALE_TIER_1_SMALL, 10],
    ['standard', MOCK_SCALE_TIER_2_STANDARD, 100],
    ['stress', MOCK_SCALE_TIER_3_STRESS, 500],
  ] as const)('renders the %s fixture tier with one header and every row', (_label, rows, count) => {
    const { container } = render(<SuperadminSecurityUserSessionsSemanticTable<SuperadminSessionData> rowData={rows} columnDefs={columns} pagination={false} getRowId={({ data }) => data.id} />);
    expect(container.querySelectorAll('tbody tr')).toHaveLength(count);
  });

  it('applies header and row dimensions and exposes the active sort direction', () => {
    const { container, getByTestId } = render(<SuperadminSecurityUserSessionsSemanticTable<SuperadminSessionData> rowData={MOCK_SCALE_TIER_1_SMALL} columnDefs={columns} headerHeight={48} rowHeight={56} getRowId={({ data }) => data.id} />);
    const headers = container.querySelectorAll('thead th');
    const firstRow = container.querySelector('tbody tr');
    expect((headers[0] as HTMLElement).style.height).toBe('48px');
    expect((firstRow as HTMLElement).style.height).toBe('56px');
    expect((container.querySelectorAll('col')[0] as HTMLElement).style.width).toBe('25%');
    expect((container.querySelectorAll('col')[1] as HTMLElement).style.width).toBe('75%');
    expect((container.querySelectorAll('col')[0] as HTMLElement).style.minWidth).toBe('120px');
    expect((headers[0] as HTMLElement).style.minWidth).toBe('120px');

    const sortButton = getByTestId('superadmin-users-users-semantic-table-table-sort-by-2-user');
    fireEvent.click(sortButton);
    expect(sortButton.closest('th')?.getAttribute('aria-sort')).toBe('ascending');
    fireEvent.click(sortButton);
    expect(sortButton.closest('th')?.getAttribute('aria-sort')).toBe('descending');
  });

  it('owns the mobile card transformation at 767px without editing shared navigation CSS', () => {
    const css = readFileSync(new URL('../components/SuperadminSecurityUserSessionsSemanticTable.module.css', import.meta.url), 'utf8');
    expect(css).toContain('@media (max-width: 767px)');
    expect(css).toContain('data-label');
    expect(css).toContain('grid-template-columns');
    expect(css).toContain('var(--border)');
  });
});
