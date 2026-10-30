import assert from 'node:assert/strict';
import { cpSync, mkdtempSync, mkdirSync, rmSync, writeFileSync, readFileSync, unlinkSync, renameSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const scriptsDir = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.dirname(scriptsDir);
const workspaceRoot = path.dirname(packageRoot);
const temp = mkdtempSync(path.join(os.tmpdir(), 'admin-v34-architecture-negative-'));
const fixturePackage = path.join(temp, 'frontend_admin');
const fixtureE2E = path.join(temp, 'playwright_E2E');
const domain = 'admin_dashboard';
const leaf = 'dashboard_overview';
const leafRoot = path.join(fixturePackage, domain, leaf);
const run = () => spawnSync(process.execPath, [path.join(fixturePackage, 'scripts', 'check-architecture.mjs')], {
  encoding: 'utf8',
  env: { ...process.env, ARCHITECTURE_CHECK_MODULE: domain },
});
const expectFail = (label) => {
  const result = run();
  assert.notEqual(result.status, 0, `${label}: architecture checker should reject defect\n${result.stdout}\n${result.stderr}`);
};

try {
  cpSync(packageRoot, fixturePackage, { recursive: true, filter: (source) => !source.split(path.sep).includes('node_modules') && !source.split(path.sep).includes('.next') });
  cpSync(path.join(workspaceRoot, 'playwright_E2E'), fixtureE2E, { recursive: true });
  const baseline = run();
  assert.equal(baseline.status, 0, `canonical V34 fixture must pass before negative checks:\n${baseline.stdout}\n${baseline.stderr}`);

  const badNamedFile = path.join(leafRoot, 'utils', 'UnprefixedUtilities.ts');
  mkdirSync(path.dirname(badNamedFile), { recursive: true });
  writeFileSync(badNamedFile, 'export const badName = true;\n');
  expectFail('submodule filename prefix');
  unlinkSync(badNamedFile);

  const hostStub = path.join(leafRoot, 'contracts', 'host-stubs.d.ts');
  const hostStubContent = readFileSync(hostStub, 'utf8');
  unlinkSync(hostStub);
  expectFail('missing ambient host stubs');
  writeFileSync(hostStub, hostStubContent, 'utf8');

  const routeConfig = path.join(leafRoot, 'config', 'admin_dashboard_overview.url_config.ts');
  const routeConfigContent = readFileSync(routeConfig, 'utf8');
  unlinkSync(routeConfig);
  expectFail('missing leaf-local URL config');
  writeFileSync(routeConfig, routeConfigContent, 'utf8');

  const featureDoc = path.join(leafRoot, 'admin_dashboard_overview_features.md');
  const featureDocContent = readFileSync(featureDoc, 'utf8');
  writeFileSync(featureDoc, featureDocContent.replace(/^## 20\..*$/m, '## 20. Missing Standalone Harness Contract'), 'utf8');
  expectFail('missing mandatory feature specification section');
  writeFileSync(featureDoc, featureDocContent, 'utf8');

  const legacyLocales = path.join(leafRoot, '_locales');
  mkdirSync(legacyLocales, { recursive: true });
  expectFail('noncanonical _locales directory');
  rmSync(legacyLocales, { recursive: true, force: true });

  const rootRoute = path.join(fixturePackage, domain, 'page.tsx');
  const rootRouteContent = readFileSync(rootRoute, 'utf8');
  writeFileSync(rootRoute, "export default function Page(){ return <main>Business UI must not live in the domain shell</main>; }\n", 'utf8');
  expectFail('domain root business UI instead of canonical redirect');
  writeFileSync(rootRoute, rootRouteContent, 'utf8');

  const e2eSpec = path.join(fixtureE2E, 'frontend_admin_e2e', domain, `${domain}.spec.ts`);
  const e2eContent = readFileSync(e2eSpec, 'utf8');
  unlinkSync(e2eSpec);
  expectFail('missing required domain E2E suite');
  mkdirSync(path.dirname(e2eSpec), { recursive: true });
  writeFileSync(e2eSpec, e2eContent, 'utf8');

  const wrongLeaf = path.join(fixturePackage, domain, 'overview');
  renameSync(leafRoot, wrongLeaf);
  expectFail('leaf folder not matching the frozen V34 taxonomy');
  renameSync(wrongLeaf, leafRoot);

  process.stdout.write('V34 architecture negative tests passed: unprefixed file, missing host stubs, missing URL config, missing feature-spec section, noncanonical locales folder, invalid domain shell, missing E2E, and wrong leaf name are rejected.\n');
} finally {
  rmSync(temp, { recursive: true, force: true });
}
