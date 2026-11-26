// frontend/src/app/frontend_superadmin/superadmin_data/data_archive_retention/page.tsx
/**
 * @file page.tsx
 * @description Page route for Data Archive & Retention Rules.
 */

import React from 'react';
import type { Metadata } from 'next';
import { SuperadminDataArchiveRetentionMain } from '@/app/frontend_superadmin/superadmin_data/data_archive_retention/components/SuperadminDataArchiveRetentionMain';

export const metadata: Metadata = {
  title: 'Data Archive & Retention | Superadmin Data',
  description:
    'Data retention rules, auto-purge scheduler, cold storage catalog, and statutory legal holds.',
};

export default function SuperadminDataArchiveRetentionPage() {
  return (
    <div className="space-y-6">
      <SuperadminDataArchiveRetentionMain />
    </div>
  );
}
