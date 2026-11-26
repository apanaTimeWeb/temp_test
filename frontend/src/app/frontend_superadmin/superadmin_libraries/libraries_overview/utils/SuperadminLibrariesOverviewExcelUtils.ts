'use client';

import type { SuperadminLibrariesLibrary } from '@/app/frontend_superadmin/superadmin_libraries/libraries_overview/types/SuperadminLibrariesOverviewTypes';

/**
 * Exports libraries to an Excel-compatible (.xls) HTML document with styling.
 */
export function downloadSuperadminLibrariesExcel(
  libraries: SuperadminLibrariesLibrary[],
  filename = 'superadmin_libraries_directory.xls'
): void {
  const tableRows = libraries
    .map(
      (lib, idx) => `
    <tr style="background-color: ${idx % 2 === 0 ? '#ffffff' : '#f8fafc'};">
      <td style="padding: 8px; border: 1px solid #cbd5e1; font-weight: bold;">${lib.name}</td>
      <td style="padding: 8px; border: 1px solid #cbd5e1;">${lib.location}</td>
      <td style="padding: 8px; border: 1px solid #cbd5e1; text-align: center;">${lib.branches}</td>
      <td style="padding: 8px; border: 1px solid #cbd5e1; text-align: right;">${lib.students?.toLocaleString() ?? 0}</td>
      <td style="padding: 8px; border: 1px solid #cbd5e1; text-align: center;">${lib.plan}</td>
      <td style="padding: 8px; border: 1px solid #cbd5e1; text-align: center; color: ${lib.status === 'Active' ? '#059669' : '#d97706'}; font-weight: bold;">${lib.status}</td>
      <td style="padding: 8px; border: 1px solid #cbd5e1; text-align: right; font-weight: bold;">₹${lib.revenue?.toLocaleString('en-IN') ?? 0}</td>
      <td style="padding: 8px; border: 1px solid #cbd5e1;">${lib.owner}</td>
      <td style="padding: 8px; border: 1px solid #cbd5e1;">${lib.email}</td>
      <td style="padding: 8px; border: 1px solid #cbd5e1;">${lib.phone || 'N/A'}</td>
      <td style="padding: 8px; border: 1px solid #cbd5e1;">${lib.nextRenewal}</td>
    </tr>`
    )
    .join('');

  const html = `
  <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
  <head>
    <!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Registered Libraries</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
    <meta http-equiv="content-type" content="text/plain; charset=UTF-8"/>
    <style>
      body { font-family: Calibri, Arial, sans-serif; font-size: 11pt; }
      table { border-collapse: collapse; width: 100%; }
      th { background-color: #4f46e5; color: #ffffff; padding: 10px; font-weight: bold; border: 1px solid #4338ca; text-align: left; }
    </style>
  </head>
  <body>
    <h2>Smart Library SaaS - Registered Facilities Directory</h2>
    <p>Export Date: ${new Date().toLocaleString('en-IN')} | Total Facilities: ${libraries.length}</p>
    <table>
      <thead>
        <tr>
          <th>Library Name</th>
          <th>Location</th>
          <th>Branches</th>
          <th>Active Students</th>
          <th>Plan</th>
          <th>Status</th>
          <th>LTV Revenue</th>
          <th>Owner Name</th>
          <th>Contact Email</th>
          <th>Contact Phone</th>
          <th>Next Renewal</th>
        </tr>
      </thead>
      <tbody>
        ${tableRows}
      </tbody>
    </table>
  </body>
  </html>`;

  const blob = new Blob(['\uFEFF' + html], { type: 'application/vnd.ms-excel;charset=utf-8;' });
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
