// frontend/src/app/frontend_superadmin/superadmin_data/data_archive_retention/mocks/handlers/superadmin_data_archive_retention.handlers.ts
/**
 * @file superadmin_data_archive_retention.handlers.ts
 * @description MSW-compatible REST API handlers for Data Archive & Retention Rules.
 */

import { ARCHIVE_RETENTION_URLS } from '../../config/superadmin_data_archive_retention.url_config';
import {
  MOCK_ARCHIVE_OVERVIEW,
  MOCK_RETENTION_RULES,
  MOCK_ARCHIVED_RECORDS,
} from '../fixtures/superadmin_data_archive_retention.fixtures';

export const mockArchiveRetentionHandlers = [
  {
    path: ARCHIVE_RETENTION_URLS.OVERVIEW,
    method: 'GET',
    handler: () => ({ status: 200, data: MOCK_ARCHIVE_OVERVIEW }),
  },
  {
    path: ARCHIVE_RETENTION_URLS.RULES_LIST,
    method: 'GET',
    handler: () => ({ status: 200, data: MOCK_RETENTION_RULES }),
  },
  {
    path: ARCHIVE_RETENTION_URLS.ARCHIVE_RECORDS_LIST,
    method: 'GET',
    handler: () => ({ status: 200, data: MOCK_ARCHIVED_RECORDS }),
  },
];
