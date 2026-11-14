// RESPONSIBILITY: Define local sample fixtures for libraries overview; sample data does not represent live customer or backend records.
// FLOW: Feature preview/test -> superadmin_libraries/libraries_overview/mocks/fixtures/SuperadminLibrariesOverviewMockFixtures.ts -> typed local fixtures -> screen rendering or assertions.
import type { SuperadminLibrariesLibrary } from '@/app/frontend_superadmin/superadmin_libraries/libraries_overview/types/SuperadminLibrariesOverviewTypes';

/** Synthetic, non-live sample records. Contact and tax identifiers are deliberately non-real. */
export const SUPERADMIN_LIBRARIES_INITIAL_FIXTURES: SuperadminLibrariesLibrary[] = [
  { id: 'sample-library-a', name: 'Sample Library A', location: 'Sample City A', branches: 3, students: 450, plan: 'Pro', status: 'Active', revenue: 150000, joinedAt: '2023-01-15', owner: 'Sample Owner A', email: 'owner-a@example.invalid', phone: 'Not supplied', gstNumber: 'SAMPLE-GST-A', nextRenewal: '2027-01-15' },
  { id: 'sample-library-b', name: 'Sample Library B', location: 'Sample City B', branches: 5, students: 1240, plan: 'Enterprise', status: 'Active', revenue: 520000, joinedAt: '2022-11-10', owner: 'Sample Owner B', email: 'owner-b@example.invalid', phone: 'Not supplied', gstNumber: 'SAMPLE-GST-B', nextRenewal: '2027-11-10' },
  { id: 'sample-library-c', name: 'Sample Library C', location: 'Sample City C', branches: 1, students: 890, plan: 'Starter', status: 'Maintenance', revenue: 0, joinedAt: '2024-02-20', owner: 'Sample Owner C', email: 'owner-c@example.invalid', phone: 'Not supplied', gstNumber: 'SAMPLE-GST-C', nextRenewal: 'Not available' },
];
