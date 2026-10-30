import { readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tailwindcss from 'eslint-plugin-tailwindcss';
import boundaries from 'eslint-plugin-boundaries';
import importPlugin from 'eslint-plugin-import';
import globals from 'globals';

const packageRoot = path.dirname(fileURLToPath(import.meta.url));
const directories = readdirSync(packageRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name);
const businessModules = directories.filter((name) => /^admin_(?!shell_)[a-z0-9_]+$/.test(name));
const featureTypes = businessModules.map((name) => `feature_${name}`);
const boundaryElements = [
  ...businessModules.map((name) => ({ type: `feature_${name}`, pattern: `${name}/**`, mode: 'folder' })),
  { type: 'shell', pattern: 'admin_shell_*/**', mode: 'folder' },
  { type: 'shared-ui', pattern: 'components/**', mode: 'folder' },
  { type: 'shared-lib', pattern: 'lib/**', mode: 'folder' },
];
const boundaryRules = [
  ...featureTypes.map((type) => ({ from: type, allow: [type, 'shell', 'shared-ui', 'shared-lib'] })),
  { from: 'shell', allow: ['shell', 'shared-ui', 'shared-lib'] },
  { from: 'shared-ui', allow: ['shared-ui', 'shared-lib'] },
  { from: 'shared-lib', allow: ['shared-lib'] },
];

export default [
  {
    ignores: ['node_modules/**', '.next/**', 'coverage/**', 'playwright-report/**', 'test-results/**'],
  },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
      globals: { ...globals.browser, ...globals.node },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      tailwindcss,
      boundaries,
      import: importPlugin,
    },
    settings: {
      'tailwindcss/callee': ['clsx', 'cn', 'cva', 'twMerge'],
      'boundaries/elements': boundaryElements,
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/ban-ts-comment': 'error',
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: '@/app/frontend_admin',
              message: 'Import from an owning feature or approved infrastructure path, not the role-level business bucket.',
            },
          ],
        },
      ],
      'boundaries/element-types': [
        'error',
        {
          default: 'disallow',
          rules: boundaryRules,
        },
      ],
      'tailwindcss/no-arbitrary-value': 'error',
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'type'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
    },
  },
];
