import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { findDuplicateClassTokens } from './check-duplicate-class-tokens.mjs';

const cases = [
  { name: 'quoted duplicate', source: '<div className="flex flex gap-2" />', expected: ['flex'] },
  { name: 'template duplicate', source: '<div className={`items-center p-2 items-center ${active ? "bg-primary" : "bg-card"}`} />', expected: ['items-center'] },
  { name: 'separate variants are not duplicate tokens', source: '<div className="text-text-secondary hover:text-primary" />', expected: [] },
  { name: 'different dynamic branches are left alone', source: '<div className={`${active ? "text-primary" : "text-text-primary"} flex`} />', expected: [] },
];

for (const test of cases) {
  const actual = findDuplicateClassTokens(test.source).flatMap((finding) => finding.duplicates).sort();
  const expected = [...test.expected].sort();
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    console.error(`FAIL ${test.name}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
    process.exitCode = 1;
  } else {
    console.log(`PASS ${test.name}`);
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url) && !process.exitCode) {
  console.log('Duplicate class-token negative tests passed.');
}
