import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const packageRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const ignoredDirectories = new Set(['node_modules', '.next', 'coverage', '.git']);
const sourceExtensions = new Set(['.tsx', '.jsx']);
// Match a utility token only when it is not already scoped by a Tailwind variant.
// The negative lookbehind excludes tokens following ':' as well as identifier characters.
const unguardedMotionUtility = /(?<![A-Za-z0-9_:-])(?:transition(?:-[A-Za-z0-9-]+)?|animate-[A-Za-z0-9-]+)(?=$|[\s"'`},])/g;

export function findUnguardedMotionUtilities(source) {
  return [...source.matchAll(unguardedMotionUtility)].map((match) => ({
    token: match[0],
    index: match.index ?? -1,
  }));
}

async function walk(directory) {
  const result = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!ignoredDirectories.has(entry.name)) result.push(...await walk(path.join(directory, entry.name)));
    } else if (entry.isFile() && sourceExtensions.has(path.extname(entry.name))) {
      result.push(path.join(directory, entry.name));
    }
  }
  return result;
}

async function main() {
  const violations = [];
  const files = await walk(packageRoot);
  for (const file of files) {
    const source = await readFile(file, 'utf8');
    for (const match of findUnguardedMotionUtilities(source)) {
      const before = source.slice(0, match.index);
      const line = before.split('\n').length;
      const relative = path.relative(packageRoot, file).split(path.sep).join('/');
      violations.push(`${relative}:${line}: motion utility '${match.token}' must be guarded by motion-safe: or a deliberate motion-reduce: alternative.`);
    }
  }

  if (violations.length) {
    process.stderr.write(`Reduced-motion class check failed with ${violations.length} violation(s):\n${violations.map((item) => `- ${item}`).join('\n')}\n`);
    process.exitCode = 1;
    return;
  }
  process.stdout.write(`Reduced-motion class check passed: ${files.length} TSX/JSX files scanned; no unguarded transition or animation utilities.\n`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
