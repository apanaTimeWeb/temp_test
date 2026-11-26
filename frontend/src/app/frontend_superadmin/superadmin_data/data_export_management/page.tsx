// frontend/src/app/frontend_superadmin/superadmin_data/data_export_management/page.tsx
/**
 * @file page.tsx
 * @description Page route for Tenant & Branch Data Export Management.
 */

import React from 'react';
import type { Metadata } from 'next';
import { SuperadminDataExportManagementMain } from '@/app/frontend_superadmin/superadmin_data/data_export_management/components/SuperadminDataExportManagementMain';

export const metadata: Metadata = {
  title: 'Data Export Management | Superadmin Data',
  description:
    'Tenant-specific library data exports, isolated branch data extraction, and asynchronous packaging queue.',
};

export default function SuperadminDataExportManagementPage() {
  return (
    <div className="space-y-6">
      <SuperadminDataExportManagementMain />
    </div>
  );
}
