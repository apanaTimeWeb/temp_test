import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../components/SuperadminLibrariesOverviewLibraryCapacityScalingRecommendationsPageClient.tsx', import.meta.url), 'utf8');

describe('capacity recommendation warning semantic surface', () => {
  it('uses the warning surface token for both warning recommendation cards', () => {
    expect(source.match(/color === 'warning' \? 'bg-warning-bg border-border'/g)).toHaveLength(2);
    expect(source).not.toContain("color === 'warning' ? 'bg-info-bg");
    expect(source.match(/'bg-danger-bg border-border'/g)).toHaveLength(2);
    expect(source.match(/'bg-success-bg border-border'/g)).toHaveLength(2);
  });
});
