import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const packageRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const ignoredDirectories = new Set(['node_modules', '.next', 'coverage', '.git']);
const sourceExtensions = new Set(['.tsx', '.jsx']);

function duplicateTokens(classText) {
  const seen = new Set();
  const duplicates = new Set();
  for (const token of classText.split(/\s+/).filter(Boolean)) {
    if (seen.has(token)) duplicates.add(token);
    seen.add(token);
  }
  return [...duplicates];
}

function findDuplicateClassTokens(source) {
  const findings = [];
  const direct = /className\s*=\s*(["'])([^\n]*?)\1/g;
  for (const match of source.matchAll(direct)) {
    const duplicates = duplicateTokens(match[2]);
    if (duplicates.length) findings.push({ index: match.index ?? 0, duplicates, source: 'literal' });
  }

  const template = /className\s*=\s*\{`([\s\S]*?)`\s*\}/g;
  for (const match of source.matchAll(template)) {
    const body = match[1];
    // Don't interpret tokens inside JavaScript interpolation expressions as fixed class text.
    const chunks = body.split(/(\$\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\})/g);
    let offset = 0;
    for (const chunk of chunks) {
      const start = offset;
      offset += chunk.length;
      if (chunk.startsWith('${') && chunk.endsWith('}')) continue;
      const duplicates = duplicateTokens(chunk);
      if (duplicates.length) findings.push({ index: (match.index ?? 0) + start, duplicates, source: 'template-literal' });
    }
  }
  return findings;
}

function walk(directory) {
  const result = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!ignoredDirectories.has(entry.name)) result.push(...walk(path.join(directory, entry.name)));
    } else if (entry.isFile() && sourceExtensions.has(path.extname(entry.name))) {
      result.push(path.join(directory, entry.name));
    }
  }
  return result;
}

export { findDuplicateClassTokens };

async function main() {
  const violations = [];
  const files = walk(packageRoot);
  for (const file of files) {
    const source = readFileSync(file, 'utf8');
    for (const finding of findDuplicateClassTokens(source)) {
      const line = source.slice(0, finding.index).split('\n').length;
      violations.push(`${path.relative(packageRoot, file).split(path.sep).join('/')} :${line} repeats utility token(s) ${finding.duplicates.join(', ')} in a ${finding.source} className.`);
    }
  }
  if (violations.length) {
    console.error(`Duplicate class-token check failed (${violations.length} finding(s)):\n${violations.map((item) => `- ${item}`).join('\n')}`);
    process.exitCode = 1;
    return;
  }
  console.log(`Duplicate class-token check passed: ${files.length} TSX/JSX files scanned; no repeated utility tokens in static className segments.`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
