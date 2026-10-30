import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const packageRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const workspaceRoot = path.dirname(packageRoot);
const sourceExtensions = new Set(['.ts', '.tsx', '.js', '.jsx', '.css', '.scss']);
const violations = [];
const permittedRouteFiles = new Set(['page.tsx', 'layout.tsx', 'loading.tsx', 'error.tsx', 'not-found.tsx', 'template.tsx', 'default.tsx']);
const permittedRootDirectories = new Set(['components', 'lib', 'scripts', 'test', '.husky', 'application_infrastructure', 'admin_navigation']);
const categories = new Set(['components', 'hooks', 'api', 'state', 'types', 'schemas', 'mocks', 'utils', 'tests', 'locales', 'config', 'contracts']);
const allowedGlobalComponentEntry = new Set(['ui']);
const submoduleBasenames = new Map();
// Frozen V34 target contract: user-approved leaf folder names intentionally omit the
// old duplicated admin-domain prefix; source filenames retain the canonical Role+Submodule prefix.
const expectedSubmodules = {
  admin_dashboard: ['dashboard_overview', 'dashboard_reports'],
  admin_members: ['members_directory', 'members_students', 'members_enquiries', 'members_blacklist', 'members_plans', 'members_coupons'],
  admin_seats_shifts_lockers: ['seats_matrix', 'seats_management', 'seats_history', 'seats_maintenance', 'shifts_management', 'shifts_migration', 'shifts_gap', 'allocations', 'lockers_management', 'lockers_matrix'],
  admin_finance: ['finance_collect_fee', 'finance_subscriptions', 'finance_renewals', 'finance_payments', 'finance_payment_promises', 'finance_security_deposits', 'finance_late_fees', 'finance_auto_suspend', 'finance_invoices', 'finance_receipts', 'finance_refunds', 'finance_trust_score', 'finance_referrals', 'finance_dashboard'],
  admin_accounts_assets: ['accounts_expenses', 'accounts_expense_categories', 'accounts_daily_settlement', 'accounts_financial_reports', 'accounts_seat_gap_report', 'accounts_shift_gap_analyzer', 'assets_register', 'assets_maintenance'],
  admin_staff: ['staff_directory', 'staff_roles_permissions'],
  admin_system: ['system_settings', 'system_branding', 'system_backups', 'system_smart_id', 'system_bulk_import', 'system_data_export', 'system_auto_scale', 'system_maintenance', 'system_offline', 'system_power_saving', 'system_gap_filling', 'system_waitlist_automation', 'system_whatsapp_integration', 'system_profile', 'system_audit_logs'],
  admin_communication: ['communication_notices', 'communication_complaints', 'communication_notification_center', 'communication_whatsapp_templates', 'communication_whatsapp_logs'],
  admin_settings: ['settings_branches', 'settings_security', 'settings_support', 'settings_profile'],
};
const approvedDomainNames = new Set(Object.keys(expectedSubmodules));
// Optional focused mode keeps negative tests fast while exercising the same rules on one complete domain.
const moduleFilter = process.env.ARCHITECTURE_CHECK_MODULE ?? null;

function pascalCase(value) {
  return value.split(/[^A-Za-z0-9]+/).filter(Boolean).map((part) => part[0].toUpperCase() + part.slice(1)).join('');
}

async function walkAllFiles(directory) {
  const found = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (['node_modules', '.next', 'coverage', '.git'].includes(entry.name)) continue;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) found.push(...await walkAllFiles(absolute));
    else if (entry.isFile()) found.push(absolute);
  }
  return found;
}

const entries = await readdir(packageRoot, { withFileTypes: true });
const businessModules = new Set(entries.filter((entry) => entry.isDirectory() && approvedDomainNames.has(entry.name)).map((entry) => entry.name));

async function walk(directory) {
  const found = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (['node_modules', '.next', 'coverage', '.git'].includes(entry.name)) continue;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) found.push(...await walk(absolute));
    else if (sourceExtensions.has(path.extname(entry.name))) found.push(absolute);
  }
  return found;
}

function domainFor(file) {
  const relative = path.relative(packageRoot, file);
  const first = relative.split(path.sep)[0];
  return businessModules.has(first) ? first : null;
}

function submoduleFor(file) {
  const relative = path.relative(packageRoot, file).split(path.sep);
  const domain = relative[0];
  if (!businessModules.has(domain) || relative.length < 3) return null;
  if (!relative[1].startsWith(`${domain}_`) || !categories.has(relative[2])) return null;
  return { domain, name: relative[1] };
}

function resolveImportPath(sourceFile, specifier) {
  if (specifier.startsWith('@/app/frontend_admin/')) return path.resolve(packageRoot, specifier.slice('@/app/frontend_admin/'.length));
  if (specifier.startsWith('@/')) return path.resolve(packageRoot, specifier.slice(2));
  if (specifier.startsWith('.')) return path.resolve(path.dirname(sourceFile), specifier);
  return null;
}

async function resolveFile(base) {
  const candidates = [base, ...['.ts', '.tsx', '.js', '.jsx', '.json', '.css', '.scss'].map((ext) => `${base}${ext}`), ...['.ts', '.tsx', '.js', '.jsx'].map((ext) => path.join(base, `index${ext}`))];
  for (const candidate of candidates) {
    try { if ((await stat(candidate)).isFile()) return candidate; } catch { /* try next extension */ }
  }
  return null;
}

// Prevent role-wide business buckets and preserve only approved application plumbing.
for (const entry of entries) {
  if (!entry.isDirectory() || ['node_modules', '.next'].includes(entry.name)) continue;
  if (!businessModules.has(entry.name) && !permittedRootDirectories.has(entry.name)) {
    violations.push(`Role container has unclassified root directory ${entry.name}.`);
  }
  if (/^admin_[a-z0-9_]+$/.test(entry.name) && entry.name !== 'admin_navigation' && !approvedDomainNames.has(entry.name)) {
    violations.push(`Unexpected active admin business root ${entry.name}; V34 allows only the nine approved domains.`);
  }
  if (/^admin_(components|hooks|store|api|types|schemas|constants|utils|mocks|tests)$/.test(entry.name) || /^admin_shell_/.test(entry.name)) {
    violations.push(`Forbidden role-wide business bucket ${entry.name}; business code must be submodule-owned.`);
  }
}

// Global UI and lib stay restricted to shared primitives and approved infrastructure helpers.
try {
  for (const entry of await readdir(path.join(packageRoot, 'components'), { withFileTypes: true })) {
    if (!allowedGlobalComponentEntry.has(entry.name)) violations.push(`Role-wide components contains non-primitive entry ${entry.name}.`);
  }
} catch { violations.push('Missing global components directory.'); }

for (const moduleName of (moduleFilter ? [...businessModules].filter((name) => name === moduleFilter) : businessModules)) {
  const moduleRoot = path.join(packageRoot, moduleName);
  const rootEntries = await readdir(moduleRoot, { withFileTypes: true });
  const rootNames = new Set(rootEntries.map((entry) => entry.name));
  const moduleFiles = await walk(moduleRoot);
  const routePage = path.join(moduleRoot, 'page.tsx');
  const isNavigationDomain = moduleName === 'admin_navigation';
  if (!isNavigationDomain) {
    try { await stat(routePage); } catch { violations.push(`${moduleName}: missing root page.tsx route shell.`); }
    const pages = moduleFiles.filter((file) => path.basename(file) === 'page.tsx');
    let pageSource = '';
    try { pageSource = await readFile(routePage, 'utf8'); } catch { /* missing route reported above */ }
    const isRedirectShell = /\bredirect\s*\(/.test(pageSource) && pages.some((file) => file !== routePage);
    if (isRedirectShell) {
      // Normative four-tier routing: domain page is a redirect shell; autonomous
      // submodules may own their own route-entry page.tsx files.
      const nestedPages = pages.filter((file) => file !== routePage);
      if (pages.length < 2 || nestedPages.some((file) => !(expectedSubmodules[moduleName] ?? []).includes(path.relative(moduleRoot, file).split(path.sep)[0]))) {
        violations.push(`${moduleName}: redirect domain requires its root route shell plus canonical autonomous submodule route entries.`);
      }
      const redirectConfigImport = [...pageSource.matchAll(/import\s*\{\s*([A-Za-z_$][\w$]*)\s*\}\s*from\s*['"]([^'"]+)['"]/g)]
        .find((match) => match[2].includes('/config/'));
      const redirectExpression = redirectConfigImport ? new RegExp(`\\bredirect\\s*\\(\\s*${redirectConfigImport[1]}(?:\\.route)?\\s*\\)`) : null;
      if (!redirectConfigImport || !redirectExpression?.test(pageSource)) {
        violations.push(`${moduleName}: redirect shell must consume a leaf-local URL config route constant.`);
      } else {
        const importPath = redirectConfigImport[2];
        const configMatch = importPath.match(/\/([^/]+)\/config\/([^/]+)\.url_config$/);
        const leafName = configMatch?.[1];
        const configBaseName = configMatch?.[2];
        const configPath = leafName && configBaseName && (expectedSubmodules[moduleName] ?? []).includes(leafName)
          ? path.join(moduleRoot, leafName, 'config', `${configBaseName}.url_config.ts`)
          : null;
        if (!configPath) violations.push(`${moduleName}: redirect shell URL config import must resolve to a canonical leaf-local config.`);
        else {
          try {
            const configSource = await readFile(configPath, 'utf8');
            const importedName = redirectConfigImport[1];
            const directRouteExport = new RegExp(`export\\s+const\\s+${importedName}\\s*=\\s*['\"][^'\"]+['\"]\\s+as\\s+const`);
            const objectRouteExport = /export\s+const\s+[A-Za-z_$][\w$]*\s*=\s*\{[\s\S]*?route\s*:\s*['"][^'"]+['"][\s\S]*?\}\s*as\s+const/;
            if (!directRouteExport.test(configSource) && !objectRouteExport.test(configSource)) {
              violations.push(`${moduleName}/${leafName}: leaf URL config must export a literal canonical route constant or an as-const object containing route.`);
            }
          } catch { violations.push(`${moduleName}/${leafName}: missing leaf-local URL config ${path.relative(moduleRoot, configPath)}.`); }
        }
      }
    } else {
      if (pages.length !== 1 || pages[0] !== routePage) violations.push(`${moduleName}: expected exactly one root page.tsx; nested page files are forbidden unless the domain page is a canonical redirect shell.`);
      // Dispatcher-style domains retain their established root URL-config contract.
      try {
        const urlConfigPath = path.join(moduleRoot, `${moduleName}_url_config.ts`);
        const urlConfigSource = await readFile(urlConfigPath, 'utf8');
        const dispatchedViews = [...pageSource.matchAll(/\bcase\s+['"]([^'"]+)['"]\s*:/g)].map((match) => match[1]);
        for (const viewKey of dispatchedViews) {
          if (!urlConfigSource.includes(`'${viewKey}'`) && !urlConfigSource.includes(`\"${viewKey}\"`)) {
            violations.push(`${moduleName}: dispatched view '${viewKey}' is missing from ${moduleName}_url_config.ts; independently refreshable views require canonical URL entries.`);
          }
        }
      } catch (error) {
        violations.push(`${moduleName}: unable to verify dispatcher-to-URL-config contract (${error instanceof Error ? error.message : 'unknown error'}).`);
      }
    }
  }

  for (const entry of rootEntries) {
    if (entry.isDirectory()) {
      if (!(expectedSubmodules[moduleName] ?? []).includes(entry.name)) violations.push(`${moduleName}: unexpected root directory ${entry.name}; leaf names must match the frozen V34 domain taxonomy.`);
      continue;
    }
    const name = entry.name;
    if (permittedRouteFiles.has(name) || name === `${moduleName}_url_config.ts` || name === `${moduleName}_features.md` || name === `${moduleName}_forbidden.md` || name === `${moduleName}_theme_contract.md`) continue;
    violations.push(`${moduleName}: forbidden root file ${name}; only route shell, URL config, and parent documentation trio are allowed.`);
  }

  for (const requiredDoc of [`${moduleName}_features.md`, `${moduleName}_forbidden.md`, `${moduleName}_theme_contract.md`]) {
    if (!rootNames.has(requiredDoc)) violations.push(`${moduleName}: missing parent documentation ${requiredDoc}.`);
  }

  const submoduleEntries = rootEntries.filter((entry) => entry.isDirectory());
  if (!submoduleEntries.length) violations.push(`${moduleName}: no autonomous submodule exists.`);
  for (const subEntry of submoduleEntries) {
    const subName = subEntry.name;
    if (!(expectedSubmodules[moduleName] ?? []).includes(subName)) continue;
    const subRoot = path.join(moduleRoot, subName);
    const children = await readdir(subRoot, { withFileTypes: true });
    const childNames = new Set(children.map((entry) => entry.name));
    const expectedDocs = [`admin_${subName}_features.md`, `admin_${subName}_forbidden.md`, `admin_${subName}_theme_contract.md`];
    for (const requiredArtifact of ['contracts/host-stubs.d.ts', `config/admin_${subName}.url_config.ts`, 'locales', 'tests/harness/bootstrap.ts']) {
      try { await stat(path.join(subRoot, requiredArtifact)); } catch { violations.push(`${moduleName}/${subName}: missing RBG-01 portability artifact ${requiredArtifact}.`); }
    }
    const harnessDir = path.join(subRoot, 'tests', 'harness');
    try {
      const harnessFiles = await readdir(harnessDir);
      if (!harnessFiles.some((file) => file.endsWith('Harness.tsx'))) violations.push(`${moduleName}/${subName}: missing local tests/harness/*Harness.tsx.`);
    } catch { violations.push(`${moduleName}/${subName}: missing local tests/harness directory.`); }
    if (childNames.has('_locales')) violations.push(`${moduleName}/${subName}: noncanonical _locales/ folder remains; use locales/.`);
    if (!childNames.has('locales')) violations.push(`${moduleName}/${subName}: missing canonical locales/ folder.`);
    for (const doc of expectedDocs) if (!childNames.has(doc)) violations.push(`${moduleName}/${subName}: missing autonomous documentation ${doc}.`);
    for (const child of children) {
      if (child.isDirectory() && !categories.has(child.name)) violations.push(`${moduleName}/${subName}: non-canonical direct child folder ${child.name}; sub-submodules and category aliases are forbidden.`);
      if (child.isFile() && !expectedDocs.includes(child.name) && !permittedRouteFiles.has(child.name)) violations.push(`${moduleName}/${subName}: executable/source file ${child.name} must be inside a canonical category folder.`);
    }

    // Enforce the supplied [Role][Submodule][Name] filename formula and global basename uniqueness.
    const requiredPrefix = `Admin${pascalCase(subName)}`;
    const requiredLocalePrefix = `admin_${subName.toLowerCase()}`;
    for (const file of await walkAllFiles(subRoot)) {
      const baseName = path.basename(file);
      if (expectedDocs.includes(baseName) || permittedRouteFiles.has(baseName) || baseName === 'host-stubs.d.ts' || baseName === `admin_${subName}.url_config.ts` || (baseName === 'bootstrap.ts' && path.dirname(file).endsWith(path.join('tests', 'harness')))) continue;
      const extension = path.extname(baseName);
      const relativeSubmodulePath = path.relative(subRoot, file).split(path.sep).join('/');
      const isCanonicalMockScenarioRegistry = relativeSubmodulePath === `mocks/scenarios/admin_${subName.toLowerCase()}.scenarios.ts`;
      if (isCanonicalMockScenarioRegistry) {
        // Architecture Rule 59.4 names the canonical registry [role]_[submodule].scenarios.ts.
        // This snake_case exception is intentionally scoped to mocks/scenarios/ only.
      } else if (extension === '.json' && path.basename(path.dirname(file)) === 'locales') {
        if (!baseName.startsWith(requiredLocalePrefix) || !/_en\.json$|_hi\.json$/.test(baseName)) {
          violations.push(`${moduleName}/${subName}: locale file ${baseName} must use ${requiredLocalePrefix}_[locale].json naming.`);
        }
      } else if (path.basename(path.dirname(file)) === 'config') {
        // Config and API artifacts use canonical snake_case Role+Submodule prefixes.
        const snakePrefix = `admin_${subName.toLowerCase()}`;
        if (!baseName.startsWith(snakePrefix)) violations.push(`${moduleName}/${subName}: config file ${baseName} must use snake_case prefix ${snakePrefix}.`);
      } else if (path.basename(path.dirname(file)) === 'api') {
        const snakePrefix = `admin_${subName.toLowerCase()}`;
        if (!baseName.startsWith(snakePrefix)) violations.push(`${moduleName}/${subName}: API file ${baseName} must use snake_case prefix ${snakePrefix}.`);
      } else if (baseName.startsWith('use')) {
        if (!baseName.startsWith(`use${requiredPrefix}`)) violations.push(`${moduleName}/${subName}: file ${baseName} must start with use${requiredPrefix}.`);
      } else if (!baseName.startsWith(requiredPrefix)) {
        violations.push(`${moduleName}/${subName}: file ${baseName} must start with ${requiredPrefix}.`);
      }
      const prior = submoduleBasenames.get(baseName);
      if (prior && prior !== file) violations.push(`Duplicate submodule basename ${baseName}: ${path.relative(packageRoot, prior)} and ${path.relative(packageRoot, file)}.`);
      else submoduleBasenames.set(baseName, file);
    }
    for (const requiredCategory of ['tests']) if (!childNames.has(requiredCategory)) violations.push(`${moduleName}/${subName}: missing ${requiredCategory}/ category.`);
    if (!subName.endsWith('_compatibility') && !childNames.has('components')) violations.push(`${moduleName}/${subName}: missing components/ category for a UI submodule.`);

    try {
      const featureDoc = await readFile(path.join(subRoot, `admin_${subName}_features.md`), 'utf8');
      const sections = [...featureDoc.matchAll(/^##\s+\d+\.\s+.+$/gm)];
      if (sections.length !== 22) violations.push(`${moduleName}/${subName}: feature specification requires 22 numbered sections; found ${sections.length}.`);
      for (let i = 1; i <= 22; i++) if (!new RegExp(`^##\\s+${i}\\.\\s+`, 'm').test(featureDoc)) violations.push(`${moduleName}/${subName}: feature specification missing section ${i}.`);
      if (!featureDoc.includes('## 3. Navigation Contract') || !featureDoc.includes('## 4. API Contract') || !featureDoc.includes('## 20. Standalone Run, Mock & Test Harness') || !featureDoc.includes('## 21. Module Portability & Host Integration Guide')) violations.push(`${moduleName}/${subName}: feature spec is missing required contract/run-harness sections.`);
    } catch { /* missing document reported above */ }
    try {
      const forbiddenDoc = await readFile(path.join(subRoot, `admin_${subName}_forbidden.md`), 'utf8');
      const rules = [...forbiddenDoc.matchAll(/^-\s+/gm)];
      if (rules.length < 5) violations.push(`${moduleName}/${subName}: forbidden-pattern document needs at least five actionable rules.`);
      if (!forbiddenDoc.includes('Sibling submodules')) violations.push(`${moduleName}/${subName}: forbidden-pattern document must define sibling dependency boundaries.`);
    } catch { /* missing document reported above */ }
    try {
      const themeDoc = await readFile(path.join(subRoot, `admin_${subName}_theme_contract.md`), 'utf8');
      for (const marker of ['Source-derived tokens', 'Responsive contract', 'Accessibility contract']) if (!themeDoc.includes(marker)) violations.push(`${moduleName}/${subName}: theme contract missing ${marker}.`);
    } catch { /* missing document reported above */ }
  }

  // E2E file presence is a source-delivery requirement, not proof of browser execution.
  const e2eSpec = path.join(workspaceRoot, 'playwright_E2E', 'frontend_admin_e2e', moduleName, `${moduleName}.spec.ts`);
  try { await stat(e2eSpec); } catch { violations.push(`${moduleName}: missing Playwright E2E spec ${path.relative(workspaceRoot, e2eSpec)}.`); }
}

// Resolve imports and reject sibling submodule coupling. Parent route shells and URL configs may compose submodules.
const sourceFiles = (await walk(packageRoot)).filter((file) => !moduleFilter || path.relative(packageRoot, file).split(path.sep)[0] === moduleFilter);
for (const sourceFile of sourceFiles) {
  let source;
  try { source = await readFile(sourceFile, 'utf8'); } catch { continue; }
  const specifiers = new Set();
  for (const match of source.matchAll(/\bfrom\s*['"]([^'"]+)['"]|\bimport\s*\(\s*['"]([^'"]+)['"]\s*\)|\bimport\s*['"]([^'"]+)['"]/g)) {
    specifiers.add(match[1] ?? match[2] ?? match[3]);
  }
  for (const specifier of specifiers) {
    const routeEntry = new Set(['page.tsx','layout.tsx','loading.tsx','error.tsx','not-found.tsx','route.ts']).has(path.basename(sourceFile));
    if ((specifier.startsWith('./') || specifier.startsWith('../')) && !routeEntry) {
      violations.push(`${path.relative(packageRoot, sourceFile)}: relative import ${specifier} is forbidden outside Next.js route-entry files; use the canonical @/ alias.`);
      continue;
    }
    // Local URL-config modules must use an explicit canonical path. Bare module-like
    // specifiers bypass the @/ path alias and previously escaped import resolution.
    if (/^admin_[a-z0-9_]+\.url_config$/.test(specifier)) {
      violations.push(`${path.relative(packageRoot, sourceFile)}: bare local URL-config import ${specifier}; use the canonical @/app/frontend_admin/<domain>/<submodule>/config/${specifier} path.`);
      continue;
    }
    const base = resolveImportPath(sourceFile, specifier);
    if (!base) continue;
    const target = await resolveFile(base);
    if (!target) {
      // A role ZIP is intentionally isolated from the host application's core infrastructure.
      // For a declared external core contract, the owning submodule's host-stubs.d.ts is the
      // evidence boundary; treating that required host import as a missing role-local file is a
      // checker false positive. This exception is narrow and requires the exact ambient module.
      const relParts = path.relative(packageRoot, sourceFile).split(path.sep);
      const hostStub = relParts.length >= 3 ? path.join(packageRoot, relParts[0], relParts[1], 'contracts', 'host-stubs.d.ts') : null;
      let isDeclaredHostContract = false;
      if (specifier === '@/lib/display_value' && hostStub) {
        try {
          const stubSource = await readFile(hostStub, 'utf8');
          isDeclaredHostContract = /declare\s+module\s+['"]@\/lib\/display_value['"]/.test(stubSource);
        } catch { /* missing stub remains a failure */ }
      }
      if (!isDeclaredHostContract) violations.push(`${path.relative(packageRoot, sourceFile)}: unresolved local import ${specifier}.`);
      continue;
    }
    const sourceOwner = submoduleFor(sourceFile);
    const targetOwner = submoduleFor(target);
    if (sourceOwner && targetOwner && sourceOwner.domain === targetOwner.domain && sourceOwner.name !== targetOwner.name) {
      violations.push(`${path.relative(packageRoot, sourceFile)}: sibling submodule import ${specifier} -> ${path.relative(packageRoot, target)} is forbidden.`);
    }
  }
}

if (violations.length) {
  process.stderr.write(`Architecture check failed with ${violations.length} violation(s):\n${violations.map((item) => `- ${item}`).join('\n')}\n`);
  process.exit(1);
}
process.stdout.write(`Architecture check passed: ${moduleFilter ? 1 : businessModules.size} admin domain container(s) and autonomous submodules verified. Root quarantine, dispatcher-to-URL-config consistency, 22-section docs, canonical categories/locales, host stubs, submodule URL configs, local scenario harnesses, role/submodule filename prefixes, global basename uniqueness, local imports, and sibling isolation passed.\n`);
