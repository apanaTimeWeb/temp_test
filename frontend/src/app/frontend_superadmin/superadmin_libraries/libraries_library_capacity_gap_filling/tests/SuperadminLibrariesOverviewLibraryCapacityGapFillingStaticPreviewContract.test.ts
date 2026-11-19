import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { SUPERADMIN_SYSTEM_SAMPLE_SEAT_GAPS } from '@/app/frontend_superadmin/superadmin_libraries/libraries_library_capacity_gap_filling/mocks/fixtures/SuperadminLibrariesOverviewLibraryCapacityGapFillingMockFixtures';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const pageClient = readFileSync(resolve(__dirname, '../components/SuperadminLibrariesOverviewLibraryCapacityGapFillingPageClient.tsx'), 'utf8');
const hook = readFileSync(resolve(__dirname, '../hooks/useSuperadminLibrariesCapacityGapFillingState.ts'), 'utf8');
const skeleton = readFileSync(resolve(__dirname, '../components/SuperadminLibrariesOverviewLibraryCapacityGapFillingRouteSkeleton.tsx'), 'utf8');
const routePage = readFileSync(resolve(__dirname, '../page.tsx'), 'utf8');
const main = readFileSync(resolve(__dirname, '../components/SuperadminLibrariesOverviewLibraryCapacityGapFillingMain.tsx'), 'utf8');

describe('library capacity gap-filling static preview boundary', () => {
  it('makes no date or shift filtering claim when source samples contain neither field', () => {
    expect(SUPERADMIN_SYSTEM_SAMPLE_SEAT_GAPS.length).toBeGreaterThan(0);
    expect(SUPERADMIN_SYSTEM_SAMPLE_SEAT_GAPS.every((row) => !('date' in row) && !('shift' in row))).toBe(true);
    expect(pageClient).toContain('STATIC_SAMPLE_NO_FILTER_CONTRACT');
    expect(pageClient).not.toContain('RUN_GAP_ANALYSIS');
    expect(pageClient).not.toContain('setAnalyzed');
    expect(pageClient).not.toContain('gap-from-date');
    expect(pageClient).not.toContain('gap-shift-select');
  });

  it('keeps the future state hook behind a client boundary and the skeleton aligned to timeline cards', () => {
    expect(hook.startsWith("'use client';")).toBe(true);
    expect(skeleton).toContain('timelineKeys');
    expect(skeleton).not.toContain('kpi-1');
    expect(skeleton).not.toContain('column-1');
  });

  it('routes through the canonical Main while preserving the existing Screen', () => {
    expect(routePage).toContain('SuperadminLibrariesOverviewLibraryCapacityGapFillingMain');
    expect(routePage).not.toContain('SuperadminLibrariesOverviewLibraryCapacityGapFillingScreen');
    expect(main).toContain('SuperadminLibrariesOverviewLibraryCapacityGapFillingScreen');
  });
});
