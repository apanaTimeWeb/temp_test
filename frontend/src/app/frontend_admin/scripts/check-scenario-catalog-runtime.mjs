import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import vm from 'node:vm';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
let ts;
try {
  ts = require('typescript');
} catch {
  process.stderr.write('Scenario catalog runtime check requires the package-declared TypeScript dev dependency. Run npm install in the host package first.\n');
  process.exit(2);
}

const root = path.resolve(process.cwd());
const expectedLeafCount = 67;
const errors = [];
const verified = [];
const isDirectory = async (candidate) => {
  try { return (await stat(candidate)).isDirectory(); } catch { return false; }
};
const domains = (await readdir(root, { withFileTypes: true }))
  .filter((entry) => entry.isDirectory() && entry.name.startsWith('admin_'));

for (const domain of domains) {
  const domainPath = path.join(root, domain.name);
  for (const child of (await readdir(domainPath, { withFileTypes: true })).filter((entry) => entry.isDirectory())) {
    const leaf = path.join(domainPath, child.name);
    const docs = (await readdir(leaf, { withFileTypes: true })).filter((entry) => entry.isFile() && entry.name.endsWith('_features.md'));
    if (!docs.length) continue;
    const modulePath = `${domain.name}/${child.name}`;
    const leafPrefix = child.name.toLowerCase().startsWith('admin_') ? child.name.toLowerCase() : `admin_${child.name.toLowerCase()}`;
    const scenarioPath = path.join(leaf, 'mocks', 'scenarios', `${leafPrefix}.scenarios.ts`);
    let source;
    try { source = await readFile(scenarioPath, 'utf8'); }
    catch { errors.push(`${modulePath}: missing canonical scenario catalog`); continue; }

    const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
    // Catalogs may colocate typed fixtures/transport handlers. The test below evaluates the
    // scenario factory contract, not imported MSW/network/config wiring, so imports are stubbed
    // with deterministic inert adapters rather than requiring an installed host dependency tree.
    const inertValue = (propertyName = '') => {
      if (propertyName === 'ADMIN_BRAND_CONFIG') return { displayName: 'Fixture Test Brand' };
      if (/Schema$/.test(propertyName)) return { parse: (value) => value };
      return new Proxy(function inertCall() { return {}; }, {
        get(_target, key) {
          if (key === 'displayName') return 'Fixture Test Brand';
          if (key === 'parse') return (value) => value;
          return inertValue(String(key));
        },
        apply() { return {}; },
      });
    };
    const scenarioRequire = (specifier) => {
      if (specifier === 'msw') return {
        http: new Proxy({}, { get: () => (...args) => ({ method: 'mock', args }) }),
        HttpResponse: { json: (body) => ({ body }) },
      };
      return new Proxy({}, { get: (_target, key) => key === '__esModule' ? true : inertValue(String(key)) });
    };
    const sandbox = { exports: {}, require: scenarioRequire };
    try { vm.runInNewContext(js, sandbox, { timeout: 1000, filename: scenarioPath }); }
    catch (error) { errors.push(`${modulePath}: scenario catalog evaluation failed: ${error.message}`); continue; }
    const functions = Object.entries(sandbox.exports).filter(([, value]) => typeof value === 'function');
    if (functions.length !== 1) { errors.push(`${modulePath}: expected one scenario factory; found ${functions.length}`); continue; }

    const fixture = { sentinel: `fixture:${modulePath}`, records: [{ id: 'record-1' }] };
    let catalog;
    try { catalog = functions[0][1](fixture); }
    catch (error) { errors.push(`${modulePath}: scenario factory threw: ${error.message}`); continue; }

    const expectedStates = ['ACTIVE_RECORDS', 'EMPTY_DATA', 'SERVER_500_ERROR', 'NETWORK_TIMEOUT', 'UNAUTHORIZED_401', 'FORBIDDEN_403', 'NETWORK_ERROR', 'INVALID_RESPONSE'];
    const stateNames = Object.keys(catalog ?? {});
    if (JSON.stringify(stateNames.slice().sort()) !== JSON.stringify(expectedStates.slice().sort())) {
      errors.push(`${modulePath}: scenario state set differs from the eight-state contract: ${stateNames.join(', ')}`);
      continue;
    }
    const active = catalog.ACTIVE_RECORDS;
    const empty = catalog.EMPTY_DATA;
    const server500 = catalog.SERVER_500_ERROR;
    const timeout = catalog.NETWORK_TIMEOUT;
    const unauthorized = catalog.UNAUTHORIZED_401;
    const forbidden = catalog.FORBIDDEN_403;
    const networkError = catalog.NETWORK_ERROR;
    const invalid = catalog.INVALID_RESPONSE;
    const behaviorChecks = [
      active?.status === 200 && active?.envelope?.success === true && JSON.stringify(active?.envelope?.data) === JSON.stringify(fixture),
      empty?.status === 200 && empty?.envelope?.success === true && Array.isArray(empty?.envelope?.data) && empty.envelope.data.length === 0,
      server500?.status === 500 && server500?.envelope?.success === false,
      timeout?.kind === 'delayed-http-response' && timeout?.delayMs === 15000 && timeout?.status === 504,
      unauthorized?.status === 401,
      forbidden?.status === 403,
      networkError?.kind === 'transport-error' && networkError?.transport === 'fetch-rejection',
      invalid?.kind === 'malformed-success-envelope' && invalid?.status === 200 && invalid?.envelope?.success === true && !('data' in invalid.envelope) && !('requestId' in invalid.envelope),
    ];
    if (behaviorChecks.some((pass) => !pass)) errors.push(`${modulePath}: one or more scenario runtime behavior assertions failed`);
    verified.push({ module: modulePath, states: stateNames, passed: behaviorChecks.every(Boolean) });
  }
}

if (verified.length !== expectedLeafCount) errors.push(`Expected ${expectedLeafCount} scenario catalogs, dynamically verified ${verified.length}`);
if (domains.length !== 10) errors.push(`Expected 10 admin domain/support containers, found ${domains.length}`);
if (errors.length) {
  process.stderr.write(`Scenario catalog runtime check failed (${errors.length} issue(s); ${verified.length}/${expectedLeafCount} evaluated):\n${errors.map((error) => `- ${error}`).join('\n')}\n`);
  process.exit(1);
}
process.stdout.write(`Scenario catalog runtime check passed: ${verified.length} factories evaluated; all eight named scenario states and injected-fixture/error semantics passed. This does not claim MSW/browser production wiring.\n`);
