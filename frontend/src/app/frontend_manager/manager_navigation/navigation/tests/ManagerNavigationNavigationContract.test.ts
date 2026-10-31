import { describe, expect, it } from 'vitest';
import { MANAGER_NAVIGATION_HREFS, MANAGER_NAVIGATION_ITEMS } from '@/app/frontend_manager/manager_navigation/navigation/constants/ManagerNavigationNavigationConstants';

describe('manager navigation route contract', () => {
  it('keeps every configured primary navigation destination on the canonical frontend_manager route', () => {
    expect(MANAGER_NAVIGATION_ITEMS.length).toBeGreaterThan(0);
    const links = MANAGER_NAVIGATION_ITEMS.filter((item): item is Extract<(typeof MANAGER_NAVIGATION_ITEMS)[number], { kind: 'link' }> => item.kind === 'link');
    expect(links.length).toBe(36);
    for (const item of links) expect(item.href.startsWith('/frontend_manager/')).toBe(true);
  });
  it('keeps every route href unique while groups are rendered as expandable sections', () => {
    expect(new Set(MANAGER_NAVIGATION_HREFS).size).toBe(MANAGER_NAVIGATION_HREFS.length);
    expect(MANAGER_NAVIGATION_ITEMS.some((item) => item.kind === 'group')).toBe(true);
  });
  it('exposes a non-empty list of canonical hrefs', () => {
    expect(MANAGER_NAVIGATION_HREFS.length).toBeGreaterThan(0);
    expect(MANAGER_NAVIGATION_HREFS.every((href) => href.startsWith('/frontend_manager/'))).toBe(true);
  });
});
