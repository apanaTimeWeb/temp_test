import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const shellCssPath = [
  join(process.cwd(), 'src/app/frontend_manager/manager_navigation/navigation/components/ManagerNavigationNavigationManager_navigation.css'),
  join(process.cwd(), 'app/frontend_manager/manager_navigation/navigation/components/ManagerNavigationNavigationManager_navigation.css'),
  join(process.cwd(), 'frontend_manager/manager_navigation/navigation/components/ManagerNavigationNavigationManager_navigation.css'),
  join(process.cwd(), '../../manager_navigation/navigation/components/ManagerNavigationNavigationManager_navigation.css'),
].find(existsSync);
if (!shellCssPath) throw new Error('Could not locate the canonical nested Manager navigation stylesheet from the test working directory.');
const shellCss = readFileSync(shellCssPath, 'utf8');

describe('manager navigation styling boundary', () => {
  it('does not override browser printing globally for student ID cards', () => {
    expect(shellCss).not.toContain('@media print');
    expect(shellCss).not.toContain('body * { visibility: hidden; }');
    expect(shellCss).not.toContain('#student-id-card-print');
  });


  it('keeps student and sibling-feature business selectors out of the role-wide shell', () => {
    for (const selector of [
      '.mgr-back-link', '.mgr-section-number', '.mgr-smartid-badge',
      '.mgr-admission-layout', '.mgr-success-overlay', '.mgr-barcode-primary',
      '.mgr-trend-up', '.mgr-action-right', '.mgr-action-link',
    ]) {
      expect(shellCss).not.toContain(selector);
    }
  });

  it('uses documented semantic tokens for status foregrounds and info/purple surfaces', () => {
    expect(shellCss).toContain('--mgr-success: theme(--color-success)');
    expect(shellCss).toContain('--mgr-warning: theme(--color-warning)');
    expect(shellCss).toContain('--mgr-danger: theme(--color-danger)');
    expect(shellCss).toContain('--mgr-info-bg: theme(--color-info-bg)');
    expect(shellCss).toContain('theme(--color-purple-text)');
    expect(shellCss).not.toContain('var(--icon-bg-info)');
    expect(shellCss).not.toContain('var(--purple)');
  });
});
