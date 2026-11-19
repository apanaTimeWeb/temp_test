import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { getSuperadminLibraryCapacityAnalysisStatusCopyKey } from '@/app/frontend_superadmin/superadmin_libraries/libraries_library_capacity_analysis/utils/superadmin_libraries_library_capacity_analysis.status';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const pageClient = readFileSync(resolve(__dirname, '../components/SuperadminLibrariesOverviewLibraryCapacityAnalysisPageClient.tsx'), 'utf8');

describe('library capacity-analysis status and preview contract', () => {
  it('keeps vacancy and maintenance as distinct statuses', () => {
    expect(getSuperadminLibraryCapacityAnalysisStatusCopyKey('vacant')).toBe('COPY.VACANT');
    expect(getSuperadminLibraryCapacityAnalysisStatusCopyKey('maintenance')).toBe('COPY.MAINTENANCE');
  });

  it('renders a single filtered empty state and avoids a fictitious detail route', () => {
    expect((pageClient.match(/SuperadminLibrariesOverviewLibraryCapacityAnalysisEmptyState filtered/g) ?? []).length).toBe(1);
    expect(pageClient).toContain('FINANCIAL_DETAIL_UNAVAILABLE_IN_PREVIEW');
    expect(pageClient).not.toContain('FINANCIAL_DETAIL_ONLY');
    expect(pageClient).not.toContain('NO_GAP_SEATS_FOUND');
  });
});
