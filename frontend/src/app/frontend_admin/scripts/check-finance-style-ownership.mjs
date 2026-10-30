import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];
const ignored = new Set(['node_modules', '.next', 'coverage', '.git']);
const sourceExtensions = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.css']);
const forbiddenClass = /(?<![A-Za-z0-9_-])fin-[A-Za-z0-9_-]+(?![A-Za-z0-9_-])/;
const financeCss = [];
const imports = [];
function walk(dir) {
  for (const entry of readdirSync(dir)) {
    if (ignored.has(entry)) continue;
    const absolute = path.join(dir, entry);
    const stat = statSync(absolute);
    if (stat.isDirectory()) walk(absolute);
    else if (sourceExtensions.has(path.extname(entry))) {
      const relative = path.relative(root, absolute).split(path.sep).join('/');
      const source = readFileSync(absolute, 'utf8');
      if (/(?:^|\/)tests?(?:\/|$)|(?:^|\/)__tests__(?:\/|$)|(?:^|\/)scripts(?:\/|$)|(?:^|\/)mocks?(?:\/|$)/.test(relative)) continue;
      if (absolute.includes(`${path.sep}admin_finance${path.sep}`) && entry.endsWith('Styles.css')) financeCss.push(relative);
      if (/\.(?:ts|tsx|js|jsx|mjs)$/.test(entry) && forbiddenClass.test(source)) errors.push(`${relative}: retired Finance-owned stylesheet selector remains; use module-local semantic Tailwind utilities.`);
      for (const match of source.matchAll(/import\s+(?:[^;\n]*?\s+from\s+)?['"]([^'"]+\.css)['"];?/g)) {
        if (match[1] !== './globals.css' && !match[1].endsWith('/application_infrastructure.css')) imports.push(`${relative}: unapproved feature CSS import ${match[1]}`);
      }
    }
  }
}
walk(root);
for (const file of financeCss) errors.push(`${file}: Finance feature stylesheet remains.`);
errors.push(...imports);
if (errors.length) {
  console.error(`Finance ownership/static style gate failed (${errors.length} issue(s)):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log('Finance ownership/static style gate passed: no Finance-owned style token leakage, legacy Finance stylesheets, or unapproved CSS imports across the Admin role.');
}
