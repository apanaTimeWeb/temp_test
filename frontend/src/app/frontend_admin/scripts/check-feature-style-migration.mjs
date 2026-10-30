import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const packageRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const violations = [];
const ignoredDirectories = new Set(['node_modules', '.next', 'coverage', '.git']);
const sourceExtensions = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.css']);
const permittedGlobalCss = new Set([
  'globals.css',
  'application_infrastructure/application_infrastructure_components/application_infrastructure.css',
]);
const legacyClass = /(?<![A-Za-z0-9_-])(?:fin-[A-Za-z0-9_-]+|crm-[A-Za-z0-9_-]+|eng-[A-Za-z0-9_-]+|admin-(?:members|plans|finance)-style-[a-f0-9]+)(?![A-Za-z0-9_-])/;
const orphanLegacyUtility = /(?<![A-Za-z0-9_-])(?:ss-[A-Za-z0-9_-]+|sys-[A-Za-z0-9_-]+|mgr-table-wrapper|ad-page-animate)(?![A-Za-z0-9_-])/;

async function walk(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!ignoredDirectories.has(entry.name)) files.push(...await walk(path.join(directory, entry.name)));
    } else if (entry.isFile() && sourceExtensions.has(path.extname(entry.name))) files.push(path.join(directory, entry.name));
  }
  return files;
}

const files = await walk(packageRoot);
const styleFiles = files.filter((file) => file.endsWith('.css'));
for (const file of styleFiles) {
  const relative = path.relative(packageRoot, file).split(path.sep).join('/');
  if (!permittedGlobalCss.has(relative)) violations.push(`${relative}: feature-owned CSS is forbidden; migrate the UI to semantic Tailwind utilities or record a narrowly justified non-business exception.`);
}
for (const file of files) {
  const relative = path.relative(packageRoot, file).split(path.sep).join('/');
  if (/(?:^|\/)tests?(?:\/|$)|(?:^|\/)__tests__(?:\/|$)|(?:^|\/)scripts(?:\/|$)|(?:^|\/)mocks?(?:\/|$)/.test(relative)) continue;
  const source = await readFile(file, 'utf8');
  if (/\bstyle\s*=\s*\{\s*\{/.test(source)) violations.push(`${relative}: inline JSX style object is forbidden.`);
  if (legacyClass.test(source)) violations.push(`${relative}: retired feature CSS selector token remains.`);
  if (orphanLegacyUtility.test(source)) violations.push(`${relative}: orphaned legacy presentation class remains; use semantic Tailwind utilities owned by this module.`);
  for (const match of source.matchAll(/import\s+(?:[^;\n]*?\s+from\s+)?['"]([^'"]+\.css)['"];?/g)) {
    const specifier = match[1];
    if (specifier === './globals.css') {
      if (relative !== 'layout.tsx') violations.push(`${relative}: globals.css may only be imported by the application root layout.`);
      continue;
    }
    if (specifier === '@/app/frontend_admin/application_infrastructure/application_infrastructure_components/application_infrastructure.css') {
      if (relative !== 'application_infrastructure/application_infrastructure_components/AdminShellRoute.tsx') violations.push(`${relative}: application infrastructure CSS is only owned by AdminShellRoute.`);
      continue;
    }
    violations.push(`${relative}: unapproved CSS import ${specifier}.`);
  }
}
// Existing migration controls remain as a regression guard for previously repaired leaves.
const requiredSourceMarkers = new Map([
  ['admin_settings/settings_branches/components/AdminSettingsBranchesView.tsx', ['mb-6', 'gap-4']],
  ['admin_settings/settings_branches/components/AdminSettingsBranchesViewSIDEBARNAVIGATIONSection.tsx', ['md:sticky', 'text-text-disabled']],
  ['admin_members/members_students/components/AdminMembersStudentsView.tsx', ['grid-cols-1', 'sm:grid-cols-2', 'md:grid-cols-3', 'bg-overlay-backdrop', 'focus-visible:ring-2', 'disabled:cursor-not-allowed']],
]);
for (const [relative, markers] of requiredSourceMarkers) {
  let source;
  try { source = await readFile(path.join(packageRoot, relative), 'utf8'); }
  catch { violations.push(`${relative}: migrated source file missing.`); continue; }
  for (const marker of markers) if (!source.includes(marker)) violations.push(`${relative}: required migrated utility marker ${marker} not found.`);
}
if (violations.length) {
  process.stderr.write(`Feature style migration check failed with ${violations.length} violation(s):\n${violations.map((item) => `- ${item}`).join('\n')}\n`);
  process.exit(1);
}
process.stdout.write(`Feature style migration check passed: ${styleFiles.length} permitted global CSS file(s), no unapproved feature styles/imports, no retired feature selectors, and migrated utility markers verified.\n`);
