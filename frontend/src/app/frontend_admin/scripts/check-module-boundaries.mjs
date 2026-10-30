import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const moduleRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const workspaceRoot = path.dirname(moduleRoot);
const domains = {
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
const errors = [];
const expectedLeafCount = Object.values(domains).reduce((count, submodules) => count + submodules.length, 0);
const slash = (value) => value.split(path.sep).join('/');
const exists = (relativePath) => fs.existsSync(path.join(moduleRoot, relativePath));
const read = (relativePath) => fs.readFileSync(path.join(moduleRoot, relativePath), 'utf8');
const allFiles = (directory) => {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (['node_modules', '.next', 'coverage', '.git'].includes(entry.name)) return [];
    const absolute = path.join(directory, entry.name);
    return entry.isDirectory() ? allFiles(absolute) : [absolute];
  });
};

// Verify exactly the frozen business domains and the user's exact leaf list.
const actualDomainDirs = fs.readdirSync(moduleRoot, { withFileTypes: true }).filter((entry) => entry.isDirectory() && /^admin_/.test(entry.name) && entry.name !== 'admin_navigation').map((entry) => entry.name).filter((name) => name !== 'application_infrastructure').sort();
const expectedDomainDirs = Object.keys(domains).sort();
if (JSON.stringify(actualDomainDirs) !== JSON.stringify(expectedDomainDirs)) {
  errors.push(`Active business domains mismatch. Expected ${expectedDomainDirs.join(', ')}; found ${actualDomainDirs.join(', ')}.`);
}

const e2eRoot = path.join(workspaceRoot, 'playwright_E2E', 'frontend_admin_e2e');
const e2eFiles = allFiles(e2eRoot).filter((file) => file.endsWith('.spec.ts'));
const allTargetRoutes = [];
const sourceFiles = allFiles(moduleRoot).filter((file) => /\.(?:ts|tsx|js|jsx|json)$/.test(file));
const moduleLocation = (file) => {
  const relative = path.relative(moduleRoot, file).split(path.sep);
  const domain = relative[0];
  const leaf = relative[1];
  return domains[domain]?.includes(leaf) ? { domain, leaf, parts: relative } : null;
};

for (const [domain, expectedLeaves] of Object.entries(domains)) {
  const domainRoot = path.join(moduleRoot, domain);
  if (!fs.existsSync(domainRoot) || !fs.statSync(domainRoot).isDirectory()) {
    errors.push(`Missing domain container: ${domain}`);
    continue;
  }
  const actualLeaves = fs.readdirSync(domainRoot, { withFileTypes: true }).filter((entry) => entry.isDirectory()).map((entry) => entry.name).sort();
  if (JSON.stringify(actualLeaves) !== JSON.stringify([...expectedLeaves].sort())) {
    errors.push(`${domain}: leaf folders mismatch. Expected ${[...expectedLeaves].sort().join(', ')}; found ${actualLeaves.join(', ')}.`);
  }
  const defaultLeaf = expectedLeaves[0];
  const shell = read(`${domain}/page.tsx`);
  const defaultRoute = `/admin/${domain}/${defaultLeaf}`;
  if (!/\bredirect\s*\(/.test(shell)) errors.push(`${domain}: root route must redirect to its canonical default leaf.`);
  const redirectImport = [...shell.matchAll(/import\s*\{\s*([A-Za-z_$][\w$]*)\s*\}\s*from\s*['\"]([^'\"]+)['\"]/g)].find((match) => match[2].includes('/config/'));
  if (!redirectImport) errors.push(`${domain}: root redirect must import the default route from a leaf-local URL config.`);
  else {
    const configPath = path.resolve(domainRoot, redirectImport[2]);
    const candidate = configPath.endsWith('.ts') ? configPath : `${configPath}.ts`;
    if (!fs.existsSync(candidate)) errors.push(`${domain}: default leaf URL config is missing at ${slash(path.relative(moduleRoot, candidate))}.`);
    else {
      const defaultConfig = fs.readFileSync(candidate, 'utf8');
      if (!defaultConfig.includes(defaultRoute)) errors.push(`${domain}: root redirect URL config lacks canonical default route ${defaultRoute}.`);
      if (!shell.includes(`redirect(${redirectImport[1]})`) && !shell.includes(`redirect(${redirectImport[1]}.route)`)) errors.push(`${domain}: root page must redirect using the imported canonical route constant.`);
    }
  }
  const domainE2E = path.join(e2eRoot, domain, `${domain}.spec.ts`);
  if (!fs.existsSync(domainE2E)) errors.push(`${domain}: missing Playwright domain route suite ${slash(path.relative(workspaceRoot, domainE2E))}.`);
  const domainSuiteText = fs.existsSync(domainE2E) ? fs.readFileSync(domainE2E, 'utf8') : '';
  if (!domainSuiteText.includes(`/admin/${domain}`)) errors.push(`${domain}: Playwright suite does not verify its canonical root URL.`);

  for (const leaf of expectedLeaves) {
    const leafRoot = `${domain}/${leaf}`;
    const route = `/admin/${domain}/${leaf}`;
    allTargetRoutes.push(route);
    const config = `${leafRoot}/config/admin_${leaf}.url_config.ts`;
    const needed = [
      `${leafRoot}/page.tsx`,
      config,
      `${leafRoot}/admin_${leaf}_features.md`,
      `${leafRoot}/admin_${leaf}_forbidden.md`,
      `${leafRoot}/admin_${leaf}_theme_contract.md`,
      `${leafRoot}/contracts/host-stubs.d.ts`,
      `${leafRoot}/tests/harness/bootstrap.ts`,
    ];
    for (const relative of needed) if (!exists(relative)) errors.push(`${route}: missing ${relative.slice(leafRoot.length + 1)}.`);
    if (exists(config)) {
      const configText = read(config);
      if (!configText.includes(route)) errors.push(`${route}: canonical URL config does not declare the route literal.`);
    }
    if (!exists(`${leafRoot}/tests/harness/bootstrap.ts`)) continue;
    const harnessDir = path.join(moduleRoot, leafRoot, 'tests', 'harness');
    if (!fs.readdirSync(harnessDir).some((name) => /Harness\.tsx$/.test(name))) errors.push(`${route}: no locally owned tests/harness/*Harness.tsx was found.`);
    const directSuiteCoverage = domainSuiteText.includes(route);
    if (!directSuiteCoverage) errors.push(`${route}: domain E2E suite does not include a direct canonical route assertion.`);
  }
}

// Prevent runtime-coupled business imports between autonomous sibling submodules.
const importPattern = /(?:import|export)\s+(?:type\s+)?(?:[^'";]*?\s+from\s+)?['"]([^'"]+)['"]/g;
for (const file of sourceFiles) {
  const owner = moduleLocation(file);
  if (!owner) continue;
  const source = fs.readFileSync(file, 'utf8');
  for (const match of source.matchAll(importPattern)) {
    const specifier = match[1];
    const absoluteTarget = specifier.startsWith('@/app/frontend_admin/')
      ? path.join(moduleRoot, specifier.slice('@/app/frontend_admin/'.length))
      : specifier.startsWith('@/')
        ? path.join(moduleRoot, specifier.slice(2))
        : specifier.startsWith('.')
          ? path.resolve(path.dirname(file), specifier)
          : null;
    if (!absoluteTarget) continue;
    const target = moduleLocation(absoluteTarget);
    if (target && (target.domain !== owner.domain || target.leaf !== owner.leaf)) {
      errors.push(`${slash(path.relative(moduleRoot, file))}: imports sibling business submodule ${target.domain}/${target.leaf} via ${specifier}.`);
    }
  }
}

// Detect any active source strings which accidentally route to retired standalone root URLs.
const retiredRoots = [
  'admin_accounting','admin_allocations','admin_audit_logs','admin_blacklist','admin_branches','admin_collect_fee','admin_coupons','admin_enquiries','admin_expense_categories','admin_expenses','admin_lockers','admin_permissions','admin_plans','admin_profile','admin_renewals','admin_seat_matrix','admin_seats','admin_security','admin_shifts','admin_staff_users','admin_students','admin_subscriptions','admin_reports',
];
for (const file of sourceFiles) {
  const relative = slash(path.relative(moduleRoot, file));
  if (!relative.endsWith('.ts') && !relative.endsWith('.tsx') && !relative.endsWith('.jsx') && !relative.endsWith('.json')) continue;
  const source = fs.readFileSync(file, 'utf8');
  for (const retired of retiredRoots) {
    const oldRoot = new RegExp(`['"\x60]/admin/${retired}(?:/|\\?|['"\x60])`);
    if (oldRoot.test(source)) errors.push(`${relative}: contains a retired standalone route literal for /admin/${retired}.`);
  }
}

const result = {
  generatedAt: new Date().toISOString(),
  targetDomains: Object.keys(domains).length,
  targetSubmodules: expectedLeafCount,
  targetRoutes: allTargetRoutes.length,
  activeE2ESpecs: e2eFiles.length,
  importIsolation: 'source-level sibling paths checked; host authorization remains outside frontend proof',
  status: errors.length ? 'FAIL' : 'PASS_SOURCE_LEVEL_BOUNDARY_CHECK',
  errors,
};
const outputPath = process.env.ADMIN_BOUNDARY_REPORT;
if (outputPath) fs.writeFileSync(path.resolve(outputPath), `${JSON.stringify(result, null, 2)}\n`);
if (errors.length) {
  console.error(`Admin module boundary check failed with ${errors.length} issue(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log(`Admin module boundary check passed: ${result.targetDomains} domains, ${result.targetSubmodules} autonomous submodules, ${result.targetRoutes} direct canonical routes, ${result.activeE2ESpecs} active E2E specs; sibling business imports and retired standalone route literals checked.`);
