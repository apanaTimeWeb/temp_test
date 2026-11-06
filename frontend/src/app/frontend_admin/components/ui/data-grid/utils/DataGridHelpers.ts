import type { DataGridColumn } from '@/app/frontend_admin/components/ui/data-grid/types/AdminUiDataGridComponentTypes';

export function readColumnValue<TRow extends object>(row: TRow, field?: Extract<keyof TRow, string>): TRow[keyof TRow] | undefined {
  return field ? row[field] : undefined;
}

const fallbackRowIdentity = new WeakMap<object, number>();
let nextFallbackRowIdentity = 1;

export function getObjectFallbackIdentity(row: object): string {
  let identity = fallbackRowIdentity.get(row);
  if (!identity) {
    identity = nextFallbackRowIdentity++;
    fallbackRowIdentity.set(row, identity);
  }
  return `object:${identity}`;
}

export function getStableRowIdentity<TRow extends object>(row: TRow): string {
  const identityKeys = ['id', 'uuid', 'code', 'key'] as const;
  for (const key of identityKeys) {
    if (!(key in row)) continue;
    const value = row[key as keyof TRow];
    if (typeof value === 'number' && Number.isFinite(value)) return `${key}:${String(value)}`;
    if (typeof value === 'string' && value.trim()) return `${key}:${value.trim()}`;
  }
  return getObjectFallbackIdentity(row);
}

export function uniqueRowIdentities<TRow extends object>(rows: readonly TRow[], getRowId?: (row: TRow, index: number) => string): string[] {
  const candidates = rows.map((row, index) => {
    const requested = getRowId?.(row, index);
    return typeof requested === 'string' && requested.trim() ? `custom:${requested.trim()}` : getStableRowIdentity(row);
  });
  const counts = new Map<string, number>();
  for (const candidate of candidates) counts.set(candidate, (counts.get(candidate) ?? 0) + 1);
  const seen = new Map<string, number>();
  return candidates.map((candidate, index) => {
    const row = rows[index];
    const identity = counts.get(candidate) === 1 || row === undefined ? candidate : getObjectFallbackIdentity(row);
    const occurrence = seen.get(identity) ?? 0;
    seen.set(identity, occurrence + 1);
    return occurrence === 0 ? identity : `${identity}:duplicate:${occurrence}`;
  });
}

export const GRID_LABELS = {
  en: { empty: 'No records found.', table: 'Data table', open: 'Open record', showing: 'Showing', of: 'of', previous: 'Previous', next: 'Next', sortBy: 'Sort by', currently: 'currently', ascending: 'ascending', descending: 'descending', cards: 'cards' },
  hi: { empty: 'कोई रिकॉर्ड नहीं मिला।', table: 'डेटा तालिका', open: 'रिकॉर्ड खोलें', showing: 'दिखाए जा रहे हैं', of: 'में से', previous: 'पिछला', next: 'अगला', sortBy: 'इसके अनुसार क्रमबद्ध करें', currently: 'वर्तमान क्रम', ascending: 'आरोही', descending: 'अवरोही', cards: 'कार्ड' },
} as const;

