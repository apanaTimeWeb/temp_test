// frontend/src/app/frontend_superadmin/superadmin_data/data_restore_operations/page.tsx
/**
 * @file page.tsx
 * @description Page route for Data Restore Operations, Snapshot Catalog, and Sandbox Drills.
 */

import React from 'react';
import type { Metadata } from 'next';
import { SuperadminDataRestoreOperationsMain } from '@/app/frontend_superadmin/superadmin_data/data_restore_operations/components/SuperadminDataRestoreOperationsMain';

export const metadata: Metadata = {
  title: 'Restore Operations & Disaster Drills | Superadmin Data',
  description:
    'Authorized data restore, backup history catalog, automated sandbox drills, and multi-tenant isolation assurance.',
};

export default function SuperadminDataRestoreOperationsPage() {
  return (
    <div className="space-y-6">
      <SuperadminDataRestoreOperationsMain />
    </div>
  );
}
