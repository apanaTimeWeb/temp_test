// RESPONSIBILITY: Pin the source-level page decomposition, skeleton geometry and documented data contract.
// FLOW: Vitest source assertion -> same-leaf components/docs -> architecture regression evidence; this test does not claim host runtime execution.
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const leaf = resolve(process.cwd(), 'src/app/frontend_superadmin/superadmin_accounting/accounting_expense_categories');
const read = (relativePath: string) => readFileSync(resolve(leaf, relativePath), 'utf8');

describe('accounting expense categories layout contract', () => {
  it('keeps each major page region in a same-leaf component', () => {
    const page = read('components/SuperadminAccountingExpenseCategoriesPageClient.tsx');
    expect(page).toContain('SuperadminAccountingExpenseCategoriesPageHeader');
    expect(page).toContain('SuperadminAccountingExpenseCategoriesCategoryGrid');
    expect(page).toContain('SuperadminAccountingExpenseCategoriesAddDialog');
  });
  it('makes the loading state mirror the responsive category-card grid', () => {
    const skeleton = read('components/SuperadminAccountingExpenseCategoriesListSkeleton.tsx');
    expect(skeleton).toContain('grid-cols-1');
    expect(skeleton).toContain('md:grid-cols-2');
    expect(skeleton).toContain('lg:grid-cols-3');
    expect(skeleton).toContain('CARD_SKELETON_IDS');
    expect(skeleton).not.toContain('ROW_SKELETON_IDS');
  });
  it('documents every displayed field and stable record identity', () => {
    const docs = read('superadmin_accounting_expense_categories_features.md');
    for (const field of ['`id`', '`name`', '`budget`', '`spent`', '`color`']) expect(docs).toContain(field);
  });
});
