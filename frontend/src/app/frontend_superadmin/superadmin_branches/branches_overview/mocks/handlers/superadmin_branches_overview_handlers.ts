// RESPONSIBILITY: MSW request handlers mocking Superadmin Branch Management endpoints.
import { MOCK_SUPERADMIN_BRANCHES_FIXTURES } from '../fixtures/superadmin_branches_overview_fixtures';

export const superadminBranchesOverviewHandlers = [
  {
    path: '/api/superadmin/branches',
    method: 'GET',
    handler: () => ({
      status: 200,
      body: {
        success: true,
        message: 'Mock branches loaded',
        data: MOCK_SUPERADMIN_BRANCHES_FIXTURES,
        requestId: 'req-mock-branches',
      },
    }),
  },
];
