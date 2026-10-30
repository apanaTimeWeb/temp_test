'use client';
// Responsibility: accessible category filter controls for the asset-register view.

export default function AdminAssetsRegisterFilterSection({ label, allLabel, categories, categoryFilter, onCategoryChange, getCategoryLabel }: {
  label: string; allLabel: string; categories: readonly string[]; categoryFilter: string; onCategoryChange: (value: string) => void; getCategoryLabel: (category: string) => string;
}) {
  return (
    <section className="flex flex-wrap items-end gap-3 rounded-xl border border-border bg-card p-4 shadow-card" aria-label={label}>
      <label className="block text-sm font-medium text-text-secondary" htmlFor="admin-assets-register-category-filter">{label}</label>
      <select id="admin-assets-register-category-filter" className="min-h-11 w-full rounded-md border border-border bg-input px-3 py-2 text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:w-60" value={categoryFilter} onChange={(event) => onCategoryChange(event.target.value)}>
        <option value="all">{allLabel}</option>
        {categories.map((category) => <option key={category} value={category}>{getCategoryLabel(category)}</option>)}
      </select>
    </section>
  );
}
