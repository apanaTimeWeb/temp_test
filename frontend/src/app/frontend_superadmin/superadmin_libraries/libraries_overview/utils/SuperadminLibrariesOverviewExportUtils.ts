'use client';

import type { SuperadminLibrariesLibrary } from '@/app/frontend_superadmin/superadmin_libraries/libraries_overview/types/SuperadminLibrariesOverviewTypes';

/**
 * Escapes a single CSV cell value according to RFC 4180.
 */
function escapeCsvValue(val: unknown): string {
  if (val === null || val === undefined) return '""';
  const str = String(val);
  return `"${str.replace(/"/g, '""')}"`;
}

/**
 * Exports libraries to a clean CSV file.
 */
export function downloadSuperadminLibrariesCsv(
  libraries: SuperadminLibrariesLibrary[],
  filename = 'superadmin_libraries_directory.csv'
): void {
  const headers = [
    'Library ID',
    'Library Name',
    'Location',
    'Branches',
    'Active Students',
    'Plan',
    'Status',
    'Revenue (INR)',
    'Owner',
    'Email',
    'Phone',
    'GST Number',
    'Joined Date',
    'Next Renewal',
  ];

  const rows = libraries.map((lib) => [
    escapeCsvValue(lib.id),
    escapeCsvValue(lib.name),
    escapeCsvValue(lib.location),
    escapeCsvValue(lib.branches),
    escapeCsvValue(lib.students),
    escapeCsvValue(lib.plan),
    escapeCsvValue(lib.status),
    escapeCsvValue(lib.revenue),
    escapeCsvValue(lib.owner),
    escapeCsvValue(lib.email),
    escapeCsvValue(lib.phone || 'N/A'),
    escapeCsvValue(lib.gstNumber || 'N/A'),
    escapeCsvValue(lib.joinedAt),
    escapeCsvValue(lib.nextRenewal),
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// Re-export excel and print utilities from dedicated modules to respect file limits
export { downloadSuperadminLibrariesExcel } from '@/app/frontend_superadmin/superadmin_libraries/libraries_overview/utils/SuperadminLibrariesOverviewExcelUtils';
export { printSuperadminLibrariesRoster } from '@/app/frontend_superadmin/superadmin_libraries/libraries_overview/utils/SuperadminLibrariesOverviewPrintUtils';
