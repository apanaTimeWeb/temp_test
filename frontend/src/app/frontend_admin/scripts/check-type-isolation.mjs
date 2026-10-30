import { createRequire } from 'node:module';
import { dirname, resolve, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readdirSync, readFileSync } from 'node:fs';

const require = createRequire(import.meta.url);
const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
function loadTypeScript() {
  try { return require('typescript'); } catch {}
  // Audit-container fallback only. Normal hosts resolve the package-local devDependency above.
  const candidates = [
    '/opt/nvm/versions/node/v22.16.0/lib/node_modules/typescript',
    '/usr/local/lib/node_modules/typescript',
  ];
  for (const candidate of candidates) {
    try { return require(candidate); } catch {}
  }
  throw new Error('TypeScript compiler API unavailable. Install the declared devDependency `typescript` before running this checker.');
}
const ts = loadTypeScript();
const findings = [];
const counts = { files: 0, nonTestTsx: 0, topLevelTsxTypes: 0, prohibitedInlineStringUnions: 0 };
const ceilings = {
  componentTsx: 300,
  hook: 150,
  utility: 120,
  store: 180,
  typeSchema: 200,
  apiService: 200,
};
const isTestPath = (rel) => /(^|\/)(tests?|__tests__)\//.test(rel) || /\.(test|spec)\.(ts|tsx)$/.test(rel);
function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const abs = resolve(dir, entry.name);
    if (entry.isDirectory()) {
      if (['node_modules', '.next', 'coverage', 'dist'].includes(entry.name)) continue;
      walk(abs);
      continue;
    }
    if (!/\.tsx?$/.test(entry.name) || entry.name.endsWith('.d.ts')) continue;
    const rel = relative(appRoot, abs).split(sep).join('/');
    if (rel.startsWith('scripts/')) continue;
    counts.files += 1;
    const content = readFileSync(abs, 'utf8');
    const lineCount = content.split(/\r?\n/).length;
    const test = isTestPath(rel);
    if (entry.name.endsWith('.tsx') && !test) {
      counts.nonTestTsx += 1;
      if (lineCount > ceilings.componentTsx) findings.push(`${rel}: ${lineCount} lines exceeds React component ceiling ${ceilings.componentTsx}`);
    }
    if (entry.name.startsWith('use') && entry.name.endsWith('.ts') && lineCount > ceilings.hook) findings.push(`${rel}: ${lineCount} lines exceeds hook ceiling ${ceilings.hook}`);
    if (rel.includes('/utils/') && entry.name.endsWith('.ts') && lineCount > ceilings.utility) findings.push(`${rel}: ${lineCount} lines exceeds utility ceiling ${ceilings.utility}`);
    if (entry.name.endsWith('Store.ts') && lineCount > ceilings.store) findings.push(`${rel}: ${lineCount} lines exceeds store ceiling ${ceilings.store}`);
    if ((rel.includes('/types/') || rel.includes('/schemas/')) && entry.name.endsWith('.ts') && lineCount > ceilings.typeSchema) findings.push(`${rel}: ${lineCount} lines exceeds type/schema ceiling ${ceilings.typeSchema}`);
    if (entry.name.endsWith('Api.ts') || entry.name.includes('.api.ts')) {
      if (lineCount > ceilings.apiService) findings.push(`${rel}: ${lineCount} lines exceeds API service ceiling ${ceilings.apiService}`);
    }
    const source = ts.createSourceFile(abs, content, ts.ScriptTarget.Latest, true, entry.name.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
    if (entry.name.endsWith('.tsx') && !test) {
      for (const node of source.statements) {
        if (ts.isInterfaceDeclaration(node) || ts.isTypeAliasDeclaration(node)) {
          counts.topLevelTsxTypes += 1;
          findings.push(`${rel}:${source.getLineAndCharacterOfPosition(node.getStart(source)).line + 1}: top-level type/interface must live in canonical types/`);
        }
      }
    }
    function visit(node) {
      if (ts.isUnionTypeNode(node) && node.types.length > 1 && node.types.every(t => ts.isLiteralTypeNode(t) && ts.isStringLiteralLike(t.literal))) {
        let ancestor = node.parent;
        let insideInterface = false;
        while (ancestor && ancestor !== source) {
          if (ts.isInterfaceDeclaration(ancestor)) { insideInterface = true; break; }
          if (ts.isTypeAliasDeclaration(ancestor)) break;
          ancestor = ancestor.parent;
        }
        let cursor = node;
        let hookGeneric = false;
        while (cursor && cursor !== source) {
          const parent = cursor.parent;
          if (parent && ts.isCallExpression(parent) && parent.typeArguments?.some(arg => arg === cursor)) {
            hookGeneric = /use(State|Reducer|Query|Mutation)/.test(parent.expression.getText(source));
            break;
          }
          cursor = parent;
        }
        if (insideInterface || hookGeneric) {
          counts.prohibitedInlineStringUnions += 1;
          findings.push(`${rel}:${source.getLineAndCharacterOfPosition(node.getStart(source)).line + 1}: inline string union belongs in a named canonical type`);
        }
      }
      ts.forEachChild(node, visit);
    }
    visit(source);
  }
}
walk(appRoot);
if (findings.length) {
  console.error(`Type isolation / file-ceiling check failed with ${findings.length} finding(s):`);
  for (const finding of findings) console.error(`- ${finding}`);
  process.exitCode = 1;
} else {
  console.log(`Type isolation / file-ceiling check passed: ${counts.files} TS/TSX files scanned; ${counts.nonTestTsx} non-test TSX files; 0 top-level types in TSX; 0 prohibited inline string unions; all file-type ceilings satisfied.`);
}
