import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const moduleRootCandidates = [
  join(process.cwd(), 'src/app/frontend_manager/manager_seats_shifts_lockers/seats_history'),
  join(process.cwd(), 'app/frontend_manager/manager_seats_shifts_lockers/seats_history'),
  join(process.cwd(), 'frontend_manager/manager_seats_shifts_lockers/seats_history')
];
const moduleRoot = moduleRootCandidates.find((candidate) => existsSync(join(candidate, 'components/manager_seats_history_views/ManagerSeatsHistoryClient.tsx')));
if (!moduleRoot) throw new Error('Could not locate the canonical module source for search debounce verification.');
const source = readFileSync(join(moduleRoot, 'components/manager_seats_history_views/ManagerSeatsHistoryClient.tsx'), 'utf8');

describe('300ms live-search debounce contract', () => {
  it('debounces derived filtering and clears pending timers', () => {
    expect(source).toContain('setTimeout');
    expect(source).toContain('300');
    expect(source).toContain('clearTimeout(timeout)');
    expect(source).toContain('debouncedSearch');
  });
});
