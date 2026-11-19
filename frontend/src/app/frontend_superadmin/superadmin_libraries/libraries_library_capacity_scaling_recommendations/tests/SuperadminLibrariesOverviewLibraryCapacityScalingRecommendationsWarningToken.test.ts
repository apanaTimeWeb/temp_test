import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const source = readFileSync(resolve(__dirname, '../components/SuperadminLibrariesOverviewLibraryCapacityScalingRecommendationsPageClient.tsx'), 'utf8');

describe('capacity recommendation warning semantic surface', () => {
  it('uses the warning surface token for both warning recommendation cards', () => {
    expect(source.match(/color === 'warning' \? 'bg-warning-bg border-border'/g)).toHaveLength(2);
    expect(source).not.toContain("color === 'warning' ? 'bg-info-bg");
    expect(source.match(/'bg-danger-bg border-border'/g)).toHaveLength(2);
    expect(source.match(/'bg-success-bg border-border'/g)).toHaveLength(2);
  });
});
