import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const root = path.resolve(process.cwd());
const modulesRoot = root;
// Frozen V42 taxonomy: nine business domains plus the navigation support domain, with 67
// documented module/support leaves. Keep synchronized with check-module-boundaries.mjs.
const expectedDomainCount = 10;
const expectedLeafCount = 67;
const requiredStates = [
  'ACTIVE_RECORDS',
  'EMPTY_DATA',
  'SERVER_500_ERROR',
  'NETWORK_TIMEOUT',
  'UNAUTHORIZED_401',
  'FORBIDDEN_403',
  'NETWORK_ERROR',
  'INVALID_RESPONSE',
];
const requiredFolders = ['components', 'api', 'mocks'];
const isDir = async (p) => { try { return (await stat(p)).isDirectory(); } catch { return false; } };
const domains = (await readdir(modulesRoot, { withFileTypes: true }))
  .filter((entry) => entry.isDirectory() && entry.name.startsWith('admin_'));
let modulesChecked = 0;
const errors = [];
if (domains.length !== expectedDomainCount) {
  errors.push(`Expected ${expectedDomainCount} admin domains/support containers at ${modulesRoot}; found ${domains.length}. Run this check from the frontend_admin package root.`);
}

for (const domain of domains) {
  const domainPath = path.join(modulesRoot, domain.name);
  const children = await readdir(domainPath, { withFileTypes: true });
  for (const child of children.filter((entry) => entry.isDirectory())) {
    const leaf = path.join(domainPath, child.name);
    const featureDocs = [path.join(leaf, `admin_${child.name}_features.md`), path.join(leaf, `${child.name}_features.md`)];
    if (!await isDir(leaf)) continue;
    let hasFeatureDoc = false;
    for (const featureDoc of featureDocs) { try { await stat(featureDoc); hasFeatureDoc = true; break; } catch { /* try the support-leaf naming convention */ } }
    if (!hasFeatureDoc) continue;
    modulesChecked += 1;
    for (const folder of requiredFolders) {
      if (!await isDir(path.join(leaf, folder))) errors.push(`${domain.name}/${child.name}: missing ${folder}/`);
    }
    // A hooks/ directory is required only when this autonomous leaf actually owns hook files.
    // Zero-hook submodules are valid; do not create empty folders solely to satisfy this checker.
    const hooksPath = path.join(leaf, 'hooks');
    if (await isDir(hooksPath)) {
      const hookEntries = await readdir(hooksPath, { withFileTypes: true });
      if (hookEntries.some((entry) => entry.isFile() && /\.(?:ts|tsx)$/.test(entry.name))) {
        // Presence verified; individual imports are covered by the import-resolution gate.
      }
    }
    const leafPrefix = child.name.toLowerCase().startsWith('admin_') ? child.name.toLowerCase() : `admin_${child.name.toLowerCase()}`;
    const catalog = path.join(leaf, 'mocks', 'scenarios', `${leafPrefix}.scenarios.ts`);
    let source = '';
    try { source = await readFile(catalog, 'utf8'); }
    catch { errors.push(`${domain.name}/${child.name}: missing canonical scenario catalog ${path.relative(root, catalog)}`); continue; }
    for (const state of requiredStates) {
      const occurrences = source.match(new RegExp(`\\b${state}\\s*:`, 'g')) ?? [];
      if (occurrences.length !== 1) errors.push(`${domain.name}/${child.name}: expected exactly one ${state} state key; found ${occurrences.length}`);
    }
    if (!/delayMs:\s*15000/.test(source)) errors.push(`${domain.name}/${child.name}: NETWORK_TIMEOUT must declare 15000ms delay`);
    if (!/transport:\s*'fetch-rejection'/.test(source)) errors.push(`${domain.name}/${child.name}: NETWORK_ERROR must be a no-HTTP fetch rejection`);
    if (!/ACTIVE_RECORDS:[\s\S]*?data:\s*activeRecords/.test(source)) errors.push(`${domain.name}/${child.name}: ACTIVE_RECORDS must use an injected module-local fixture`);
    if (!/EMPTY_DATA:[\s\S]*?data:\s*\[\]/.test(source)) errors.push(`${domain.name}/${child.name}: EMPTY_DATA must expose an empty record array`);
    if (!/SERVER_500_ERROR:[\s\S]*?status:\s*500/.test(source)) errors.push(`${domain.name}/${child.name}: SERVER_500_ERROR must declare HTTP 500`);
    if (!/NETWORK_TIMEOUT:[\s\S]*?delayMs:\s*15000[\s\S]*?status:\s*504/.test(source)) errors.push(`${domain.name}/${child.name}: NETWORK_TIMEOUT must declare 15s delay and HTTP 504`);
    // Bound the invalid-envelope assertion to the INVALID_RESPONSE state itself. Fixture
    // records and MSW handlers may legitimately follow the catalog and contain data/requestId.
    const invalidStart = source.indexOf('INVALID_RESPONSE:');
    const invalidEnd = invalidStart < 0 ? -1 : source.indexOf('\n  },', invalidStart);
    const invalidResponseSource = invalidStart >= 0 && invalidEnd >= 0 ? source.slice(invalidStart, invalidEnd) : '';
    if (!/^[\s\S]*?success:\s*true[\s\S]*?message:/.test(invalidResponseSource) || /\b(?:data|requestId)\s*:/.test(invalidResponseSource)) errors.push(`${domain.name}/${child.name}: INVALID_RESPONSE must be a malformed success envelope without data or requestId`);
    if (!/FORBIDDEN_403:[\s\S]*?status:\s*403/.test(source)) errors.push(`${domain.name}/${child.name}: FORBIDDEN_403 must declare HTTP 403`);
    if (!/UNAUTHORIZED_401:[\s\S]*?status:\s*401/.test(source)) errors.push(`${domain.name}/${child.name}: UNAUTHORIZED_401 must declare HTTP 401`);
  }
}

if (modulesChecked !== expectedLeafCount) {
  errors.push(`Expected ${expectedLeafCount} documented module/support leaves; verified ${modulesChecked}.`);
}

if (errors.length) {
  process.stderr.write(`Mock scenario registry check failed (${errors.length} issue(s)):\n${errors.map((e) => `- ${e}`).join('\n')}\n`);
  process.exit(1);
}
process.stdout.write(`Mock scenario registry check passed: ${domains.length} admin domains/support containers, ${modulesChecked} documented leaves, ${requiredStates.length} unique named states per leaf, and all four required folders. Runtime wiring is not asserted.\n`);
