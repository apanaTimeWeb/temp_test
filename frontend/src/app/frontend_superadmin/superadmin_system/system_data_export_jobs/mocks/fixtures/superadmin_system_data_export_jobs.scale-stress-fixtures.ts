// RESPONSIBILITY: Define local sample fixtures for system data export jobs; sample data does not represent live customer or backend records.
// FLOW: Feature preview/test -> superadmin_system/system_data_export_jobs/mocks/fixtures/superadmin_system_data_export_jobs.scale-stress-fixtures.ts -> typed local fixtures -> screen rendering or assertions.
/**
 * Deterministic 10/100/500 synthetic stress tiers derived from this module's existing local UI preview values.
 * These records exercise fixture sizing only; they do not define a backend API schema or imply persisted data.
 */
import { SUPERADMIN_SYSTEM_DATA_EXPORT_PAGE_CLIENT_EXPORT_MODULES } from '../../constants/SuperadminDataExportJobsStaticConstants';

type ScaleFixtureRecord = { fixtureId: string; previewData: Record<string, unknown> };
function cloneValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(cloneValue);
  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value as Record<string, unknown>).map(([key, item]) => [key, cloneValue(item)]));
  }
  return value;
}
const sourceRows = SUPERADMIN_SYSTEM_DATA_EXPORT_PAGE_CLIENT_EXPORT_MODULES as readonly Record<string, unknown>[];
const baseSource: Record<string, unknown> = sourceRows[0] ?? { source: 'local-preview-only' };
function sourceFor(index: number): Record<string, unknown> {
  const selected = sourceRows.length ? sourceRows[(index - 1) % sourceRows.length] : baseSource;
  return cloneValue(selected) as Record<string, unknown>;
}
function createScaleTier(count: number): readonly ScaleFixtureRecord[] {
  return Array.from({ length: count }, (_, index) => ({
    fixtureId: `${module}-preview-scale-${String(index + 1).padStart(4, '0')}`,
    previewData: sourceFor(index + 1),
  }));
}

export const MOCK_SCALE_TIER_1_SMALL = createScaleTier(10);
export const MOCK_SCALE_TIER_2_STANDARD = createScaleTier(100);
export const MOCK_SCALE_TIER_3_STRESS = createScaleTier(500);
