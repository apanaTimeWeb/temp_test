import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const cssPath = path.join(root, '..', 'globals.css');
const tailwindPath = path.join(root, '..', 'tailwind.config.ts');
const css = readFileSync(cssPath, 'utf8');
const tailwind = readFileSync(tailwindPath, 'utf8');

function block(source, pattern, label) {
  const match = source.match(pattern);
  if (!match) throw new Error(`Missing required ${label} block.`);
  return match[1];
}
function declarations(source) {
  return new Set([...source.matchAll(/(--[a-zA-Z0-9_-]+)\s*:/g)].map((match) => match[1]));
}
function references(source) {
  return new Set([...source.matchAll(/var\(\s*(--[a-zA-Z0-9_-]+)/g)].map((match) => match[1]));
}
function withoutComments(source) {
  return source.replace(/\/\*[\s\S]*?\*\//g, '');
}

const cleanCss = withoutComments(css);
const light = block(cleanCss, /:root\s*\{([\s\S]*?)\n\}/, ':root');
const dark = block(cleanCss, /\.dark\s*\{([\s\S]*?)\n\}/, '.dark');
const theme = block(cleanCss, /@theme\s+inline\s*\{([\s\S]*?)\n\}/, '@theme inline');
const lightTokens = declarations(light);
const darkTokens = declarations(dark);
const themeDeclarations = declarations(theme);
const themeReferences = references(theme);
const allThemeTokens = new Set([...lightTokens, ...darkTokens]);
const errors = [];

for (const token of lightTokens) if (!darkTokens.has(token)) errors.push(`${token} is missing from .dark.`);
for (const token of darkTokens) if (!lightTokens.has(token)) errors.push(`${token} is missing from :root.`);
for (const token of themeReferences) if (!allThemeTokens.has(token)) errors.push(`@theme inline references undefined token ${token}.`);

const requiredMapped = [
  '--primary', '--primary-hover', '--primary-subtle', '--bg-page', '--bg-card', '--bg-sidebar', '--bg-header',
  '--bg-header-translucent', '--bg-input', '--bg-floating', '--bg-overlay', '--bg-popover', '--overlay-backdrop',
  '--surface-hover', '--surface-highlight', '--surface-zebra', '--text-primary', '--text-secondary', '--text-disabled',
  '--text-on-primary', '--text-on-danger', '--text-on-warning', '--text-on-success', '--text-on-info', '--success',
  '--success-bg', '--success-text', '--warning', '--warning-bg', '--warning-text', '--danger', '--danger-bg', '--danger-text',
  '--info', '--info-bg', '--info-text', '--purple-text', '--purple-bg', '--pay-cash-text', '--pay-cash-bg', '--pay-upi-text',
  '--pay-upi-bg', '--pay-card-text', '--pay-card-bg', '--pay-bank-text', '--pay-bank-bg', '--skeleton-base',
  '--skeleton-highlight', '--chart-primary', '--chart-success', '--chart-danger', '--chart-warning', '--chart-info',
  '--chart-secondary', '--chart-grid', '--chart-tooltip-bg', '--border', '--border-focus', '--focus-ring', '--shadow-card',
  '--shadow-popover', '--shadow-dialog', '--shadow-toast', '--radius-sm', '--radius-md', '--radius-lg', '--radius-xl',
  '--radius-full', '--font-size-page-title', '--font-size-section-title', '--font-size-badge', '--font-size-kpi',
  '--font-size-table-header', '--font-size-body', '--font-size-caption',
];
for (const token of requiredMapped) {
  if (!allThemeTokens.has(token)) errors.push(`Required design token ${token} is not defined in :root/.dark.`);
  if (!themeReferences.has(token)) errors.push(`Required design token ${token} is not mapped in @theme inline.`);
}
// Motion tokens are declared in :root/.dark and bridged through dedicated aliases so the
// @theme block never defines a CSS variable in terms of itself.
const motionAliases = new Map([
  ['--animate-duration-fast', '--motion-duration-fast'],
  ['--animate-duration-base', '--motion-duration-base'],
  ['--animate-duration-slow', '--motion-duration-slow'],
  ['--animate-duration-xslow', '--motion-duration-xslow'],
]);
for (const [token, alias] of motionAliases) {
  if (!allThemeTokens.has(token)) errors.push(`Required design token ${token} is not defined in :root/.dark.`);
  const mapping = theme.match(new RegExp(`${token}\\s*:\\s*var\\(\\s*(${alias})\\s*\\)`));
  if (!mapping) errors.push(`${token} must map to the non-self-referential ${alias} alias in @theme inline.`);
  if (!allThemeTokens.has(alias)) errors.push(`${alias} is not defined in :root/.dark.`);
}

const canonicalOnColorMappings = new Map([
  ['--color-on-primary', '--text-on-primary'],
  ['--color-on-danger', '--text-on-danger'],
  ['--color-on-warning', '--text-on-warning'],
  ['--color-on-success', '--text-on-success'],
  ['--color-on-info', '--text-on-info'],
]);
for (const [classToken, cssToken] of canonicalOnColorMappings) {
  const declaration = theme.match(new RegExp(`${classToken}\\s*:\\s*var\\(\\s*(${cssToken})\\s*\\)`));
  if (!declaration) errors.push(`${classToken} must map to var(${cssToken}) using the architecture's canonical text-on-background utility name.`);
}
if (/--color-text-on-(?:primary|danger|warning|success|info)\\s*:/.test(theme)) {
  errors.push('Obsolete --color-text-on-* aliases found in @theme inline; use canonical --color-on-* mappings.');
}

// Tailwind v4 resolves bg-* and text-* through the shared --color-{name} namespace.
// Keep the written `text-primary` naming conflict explicit while guarding ordinary text-bearing controls.
const sourceRoot = path.join(root, '..');
const conflictRegisterPath = path.join(root, '../../audit_reports/SOURCE_CONFLICTS.md');
const foregroundTags = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'td', 'th', 'dd', 'dt', 'label', 'input', 'textarea', 'select']);
const ambiguousForegroundUtility = /(?<![A-Za-z0-9_:-])text-(?:primary|secondary|disabled|success|danger|warning|info)(?![A-Za-z0-9_-])/g;
function walkSource(directory) {
  const result = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!['node_modules', '.next', 'coverage', '.git'].includes(entry.name)) result.push(...walkSource(path.join(directory, entry.name)));
    } else if (entry.isFile() && ['.tsx', '.jsx'].includes(path.extname(entry.name))) {
      result.push(path.join(directory, entry.name));
    }
  }
  return result;
}
function findOpenTagEnd(source, start) {
  let quote = null;
  let braces = 0;
  for (let index = start; index < source.length; index += 1) {
    const character = source[index];
    if (quote) {
      if (character === '\\') { index += 1; continue; }
      if (character === quote) quote = null;
      continue;
    }
    if (character === '"' || character === "'" || character === '`') { quote = character; continue; }
    if (character === '{') { braces += 1; continue; }
    if (character === '}' && braces > 0) { braces -= 1; continue; }
    if (character === '>' && braces === 0) return index;
  }
  return source.length;
}
for (const sourceFile of walkSource(sourceRoot)) {
  const source = readFileSync(sourceFile, 'utf8');
  const tagPattern = /<(h[1-6]|p|td|th|dd|dt|label|input|textarea|select)\b/g;
  for (const tagMatch of source.matchAll(tagPattern)) {
    const start = tagMatch.index ?? 0;
    const end = findOpenTagEnd(source, start);
    const openingTag = source.slice(start, end + 1);
    const classMatch = openingTag.match(/className\s*=\s*(?:"([^"]*)"|'([^']*)'|\{`([\s\S]*?)`|\{\s*(["'])(.*?)\4\s*\})/);
    if (!classMatch) continue;
    const classValue = [classMatch[1], classMatch[2], classMatch[3], classMatch[5]].filter(Boolean).join(' ');
    const badTokens = [...classValue.matchAll(ambiguousForegroundUtility)].map((match) => match[0]);
    if (badTokens.length) {
      const line = source.slice(0, start).split('\n').length;
      errors.push(`${path.relative(sourceRoot, sourceFile).split(path.sep).join('/')} :${line} <${tagMatch[1]}> uses ambiguous/unmapped foreground utility ${[...new Set(badTokens)].join(', ')}; use explicit mapped foreground/status token names.`);
    }
  }
}
// Explicit semantic-surface guards: these use generic notification/message/row text,
// so a gold brand-accent utility would violate the intended foreground contract even
// though the wrapper is a div or a library component rather than a native text tag.
for (const [relativePath, forbiddenPattern, reason] of [
  ['admin_communication/communication_whatsapp_logs/components/AdminCommunicationWhatsappLogsPage.tsx', /aria-labelledby="admin-communication-message-content-label"[^>]*className="[^"]*(?<![A-Za-z0-9_-])text-primary(?![A-Za-z0-9_-])/, 'WhatsApp message body must use the mapped foreground token.'],
  ['components/ui/data-grid/DataGridMobileCards.tsx', /className="mt-1 break-words text-body font-semibold text-primary"/, 'Data-grid mobile primary-cell text must use the mapped foreground token.'],
]) {
  const absolute = path.join(sourceRoot, relativePath);
  const source = readFileSync(absolute, 'utf8');
  if (forbiddenPattern.test(source)) errors.push(`${relativePath}: ${reason}`);
}
const toastLayouts = walkSource(path.join(sourceRoot, 'admin_finance')).filter((file) => file.endsWith('/layout.tsx'));
for (const layoutFile of toastLayouts) {
  const source = readFileSync(layoutFile, 'utf8');
  if (/toastOptions=\{\{[^}]*className:\s*['"][^'"]*(?<![A-Za-z0-9_-])text-primary(?![A-Za-z0-9_-])/.test(source)) {
    errors.push(`${path.relative(sourceRoot, layoutFile).split(path.sep).join('/')}: generic Sonner toast text must use the mapped foreground token.`);
  }
}

const conflictRegister = readFileSync(conflictRegisterPath, 'utf8');
if (!conflictRegister.includes('SRC-CONFLICT-01') || !conflictRegister.includes('`SOURCE_CONFLICT`')) {
  errors.push('The text-primary/Tailwind token-name SOURCE_CONFLICT must be documented; do not claim the written design mapping is universally resolved.');
}

const configRefs = references(withoutComments(tailwind));
for (const token of configRefs) if (!allThemeTokens.has(token)) errors.push(`tailwind.config.ts references undefined CSS token ${token}.`);
if (!cleanCss.includes('@import "tailwindcss";')) errors.push('globals.css must import Tailwind CSS v4.');
if (!cleanCss.includes('@config "./tailwind.config.ts";')) errors.push('globals.css must load the local Tailwind config.');

if (errors.length) {
  console.error(`CSS token contract check failed (${errors.length} issue(s)):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log(`CSS token contract check passed: ${lightTokens.size} light tokens, ${darkTokens.size} dark tokens, ${themeDeclarations.size} @theme mappings, ${requiredMapped.length} required semantic tokens mapped; ordinary text-bearing controls have no ambiguous foreground/status utilities.`);
}
