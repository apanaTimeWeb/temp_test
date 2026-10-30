import assert from 'node:assert/strict';
import { cpSync, mkdtempSync, mkdirSync, rmSync, writeFileSync, readFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const scriptsDir = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.dirname(scriptsDir);
const temp = mkdtempSync(path.join(os.tmpdir(), 'admin-style-migration-negative-'));
const fixturePackage = path.join(temp, 'frontend_admin');
const checker = path.join(fixturePackage, 'scripts', 'check-feature-style-migration.mjs');
const run = () => spawnSync(process.execPath, [checker], { encoding: 'utf8' });
const expectFail = (label) => { const result = run(); assert.notEqual(result.status, 0, `${label} should fail the style migration gate\n${result.stdout}\n${result.stderr}`); };
try {
  cpSync(packageRoot, fixturePackage, { recursive: true, filter: (source) => !source.split(path.sep).includes('node_modules') && !source.split(path.sep).includes('.next') && !source.split(path.sep).includes('coverage') });
  const baseline = run();
  assert.equal(baseline.status, 0, `clean fixture must pass before negative checks:\n${baseline.stdout}\n${baseline.stderr}`);
  const cssPath = path.join(fixturePackage, 'admin_members', 'members_directory', 'components', 'InjectedStyles.css');
  mkdirSync(path.dirname(cssPath), { recursive: true });
  writeFileSync(cssPath, '.injected { color: red; }\n');
  expectFail('feature stylesheet reintroduction');
  rmSync(cssPath, { force: true });
  const sourcePath = path.join(fixturePackage, 'admin_members', 'members_directory', 'components', 'AdminMembersDirectoryView.tsx');
  const original = readFileSync(sourcePath, 'utf8');
  const altered = original.replace(/className="([^"]*)"/, (_, classes) => `className="${classes} fin-card"`);
  assert.notEqual(altered, original, 'negative fixture must inject a known legacy class token');
  writeFileSync(sourcePath, altered, 'utf8');
  expectFail('legacy borrowed finance class reintroduction');
  writeFileSync(sourcePath, original, 'utf8');
  const engAltered = original.replace(/className="([^"]*)"/, (_, classes) => `className="${classes} eng-card"`);
  assert.notEqual(engAltered, original, 'negative fixture must inject a legacy eng class token');
  writeFileSync(sourcePath, engAltered, 'utf8');
  expectFail('legacy borrowed communication class reintroduction');
  writeFileSync(sourcePath, original, 'utf8');
  const orphanTokens = ['ss-card', 'sys-input', 'mgr-table-wrapper', 'ad-page-animate'];
  for (const token of orphanTokens) {
    const orphaned = original.replace(/className=\"([^\"]*)\"/, (_, classes) => `className=\"${classes} ${token}\"`);
    assert.notEqual(orphaned, original, `negative fixture must inject ${token}`);
    writeFileSync(sourcePath, orphaned, 'utf8');
    expectFail(`orphaned presentation class ${token} reintroduction`);
    writeFileSync(sourcePath, original, 'utf8');
  }
  process.stdout.write('Feature style negative regression tests passed: feature CSS, borrowed legacy classes, and orphaned ss-/sys-/mgr-/ad- presentation hooks are rejected.\n');
} finally {
  rmSync(temp, { recursive: true, force: true });
}
