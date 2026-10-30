import { readFileSync, readdirSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.join(root, '..');
const envPath = path.join(appRoot, 'lib', 'env.ts');
const examplePath = path.join(appRoot, '.env.example');
const apiPath = path.join(appRoot, 'lib', 'api.ts');
const flagsPath = path.join(appRoot, 'lib', 'runtimeFeatures.ts');
const testPath = path.join(appRoot, 'lib', 'env.test.ts');
const errors = [];

for (const file of [envPath, examplePath, apiPath, flagsPath, testPath]) {
  if (!existsSync(file)) errors.push(`Required environment artifact is missing: ${path.relative(appRoot, file)}`);
}
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

const env = readFileSync(envPath, 'utf8');
const example = readFileSync(examplePath, 'utf8');
const api = readFileSync(apiPath, 'utf8');
const flags = readFileSync(flagsPath, 'utf8');
const tests = readFileSync(testPath, 'utf8');
const expectedKeys = ['NODE_ENV', 'NEXT_PUBLIC_API_BASE_URL', 'NEXT_PUBLIC_FRONTEND_DEMO_MODE'];

if (!env.includes("from 'zod'")) errors.push('Central environment module must use the already-approved Zod dependency.');
if (!env.includes('FrontendRuntimeConfigSchema')) errors.push('Central environment module must define a Zod runtime schema.');
if (!env.includes('FrontendRuntimeConfigSchema.parse(source)')) errors.push('Central environment module must fail fast on invalid runtime configuration.');
for (const key of expectedKeys) {
  if (key !== 'NODE_ENV' && !env.includes(key)) errors.push(`Central schema does not validate ${key}.`);
  if (key === 'NODE_ENV') {
    if (!example.includes('NODE_ENV is managed by Next.js')) errors.push('.env.example must document how NODE_ENV is supplied by the framework.');
  } else if (!new RegExp(`^${key}=`, 'm').test(example)) errors.push(`.env.example does not document ${key}.`);
}
if (!env.includes('parsed.protocol !== \'https:\'') || !env.includes('parsed.protocol !== \'http:\'')) errors.push('API base URL must restrict protocols to HTTP(S).');
if (!env.includes('parsed.username') || !env.includes('parsed.password')) errors.push('API base URL must reject URL-embedded credentials.');
if (/\b(?:API_SECRET|DATABASE_URL|JWT_SECRET|WEBHOOK_SECRET|PRIVATE_API_KEY)\s*=/.test(example)) errors.push('.env.example must not include private secret values or keys.');
if (!api.includes("from '@/lib/env'") || /process\.env\./.test(api)) errors.push('Global API transport must consume the central environment config and must not read process.env directly.');
if (!flags.includes("from '@/lib/env'") || /process\.env\./.test(flags)) errors.push('Runtime feature flags must consume central environment config and must not read process.env directly.');
for (const key of ['parseFrontendRuntimeConfig', 'malformed', 'NEXT_PUBLIC_FRONTEND_DEMO_MODE']) {
  if (!tests.includes(key)) errors.push(`Environment regression tests are missing coverage for ${key}.`);
}

function walk(directory) {
  const files = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (['node_modules', '.next', 'coverage', '.git'].includes(entry.name)) continue;
      files.push(...walk(path.join(directory, entry.name)));
    } else if (entry.isFile() && ['.ts', '.tsx', '.js', '.jsx'].includes(path.extname(entry.name))) {
      files.push(path.join(directory, entry.name));
    }
  }
  return files;
}
for (const file of walk(appRoot)) {
  const relative = path.relative(appRoot, file).split(path.sep).join('/');
  if (relative === 'lib/env.ts' || relative.includes('/tests/') || relative.endsWith('.test.ts') || relative.startsWith('scripts/')) continue;
  const source = readFileSync(file, 'utf8');
  if (/process\.env\./.test(source)) errors.push(`${relative} reads process.env outside the central lib/env.ts module.`);
}

if (errors.length) {
  console.error(`Environment contract check failed (${errors.length} issue(s)):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log('Environment contract check passed: central Zod schema, documented public variables, HTTP(S)-only API base URL, no URL credentials, and no feature-level process.env reads.');
}
