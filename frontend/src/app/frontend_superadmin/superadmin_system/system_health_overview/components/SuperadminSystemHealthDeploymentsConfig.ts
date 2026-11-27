export interface DeploymentRecord {
  version: string;
  commitSha: string;
  author: string;
  timestamp: string;
  status: 'Live' | 'Superseded' | 'Rolled Back';
  notes: string;
}

export const INITIAL_DEPLOYMENTS: DeploymentRecord[] = [
  {
    version: 'v2.4.1-prod',
    commitSha: '8f7b32c',
    author: 'DevOps Automated Pipeline',
    timestamp: 'Today, 14:20 UTC',
    status: 'Live',
    notes: 'Performance patches for PgBouncer & Redis cache eviction.',
  },
  {
    version: 'v2.4.0-prod',
    commitSha: '4a1e90d',
    author: 'Lead Architect',
    timestamp: 'Yesterday, 19:15 UTC',
    status: 'Superseded',
    notes: 'Global Settings 11 Domains release & TanStack Query v5 rollout.',
  },
  {
    version: 'v2.3.9-prod',
    commitSha: '9c8821f',
    author: 'Release Engineer',
    timestamp: '17 Nov 2026, 11:00 UTC',
    status: 'Superseded',
    notes: 'WhatsApp Business Bridge throughput scaling.',
  },
];
