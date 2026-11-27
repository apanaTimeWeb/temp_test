// frontend/src/app/frontend_superadmin/superadmin_data/data_import_migration/page.tsx
/**
 * @file page.tsx
 * @description Page route for Data Import & Migration Management.
 */

import React from 'react';
import type { Metadata } from 'next';
import { SuperadminDataImportMigrationMain } from '@/app/frontend_superadmin/superadmin_data/data_import_migration/components/SuperadminDataImportMigrationMain';

export const metadata: Metadata = {
  title: 'Data Import & Migration | Superadmin Data',
  description:
    'Library migration wizard, pre-flight dry-run validation, duplicate detection, and snapshot rollback history.',
};

export default function SuperadminDataImportMigrationPage() {
  return (
    <div className="space-y-6">
      <SuperadminDataImportMigrationMain />
    </div>
  );
}
