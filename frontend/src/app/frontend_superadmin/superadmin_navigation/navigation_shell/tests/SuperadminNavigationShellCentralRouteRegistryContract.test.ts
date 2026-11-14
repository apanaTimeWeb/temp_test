// RESPONSIBILITY: Prevent duplicated domain-shell route maps from drifting away from the role-owned navigation registry; this test does not exercise host routing.
// FLOW: Vitest -> filesystem scan of role shell entry files -> central registry import assertions.
import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const ROLE_ROOT = new URL('../../../', import.meta.url);

function collectShellEntryFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = join(directory, entry.name);
    if (entry.isDirectory()) return collectShellEntryFiles(fullPath);
    return (entry.name === 'layout.tsx' || entry.name === 'page.tsx') ? [fullPath] : [];
  });
}

describe('Superadmin central route registry contract', () => {
  it('keeps domain shell navigation route maps centralized in the role navigation config', () => {
    const rootPath = decodeURIComponent(ROLE_ROOT.pathname);
    const shellFiles = collectShellEntryFiles(rootPath).filter((file) => {
      const source = readFileSync(file, 'utf8');
      return source.includes('SUPERADMIN_NAVIGATION_ROUTES');
    });
    expect(shellFiles).toHaveLength(26);
    for (const file of shellFiles) {
      const source = readFileSync(file, 'utf8');
      expect(source).toContain("@/app/frontend_superadmin/superadmin_navigation/navigation_shell/config/superadmin_navigation_routes");
      expect(source).not.toMatch(/const\s+SUPERADMIN_NAVIGATION_ROUTES\s*=/);
    }
  });
});
