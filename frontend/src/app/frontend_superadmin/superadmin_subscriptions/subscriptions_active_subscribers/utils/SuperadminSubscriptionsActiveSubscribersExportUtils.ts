'use client';

import type { SuperadminSubscriptionRecord } from '@/app/frontend_superadmin/superadmin_subscriptions/subscriptions_active_subscribers/types/SuperadminSubscriptionsActiveSubscribersTypes';
export { printSuperadminSubscriptionsRoster } from '@/app/frontend_superadmin/superadmin_subscriptions/subscriptions_active_subscribers/utils/SuperadminSubscriptionsActiveSubscribersPrintUtils';

type SubscriberContactFields = SuperadminSubscriptionRecord & {
  billingContact?: string;
  phone?: string;
  email?: string;
};

function escapeCsv(val: unknown): string {
  if (val === null || val === undefined) return '""';
  const str = String(val);
  return `"${str.replace(/"/g, '""')}"`;
}

/**
 * Downloads subscriber records as CSV.
 */
export function downloadSuperadminSubscriptionsCsv(
  subscribers: SuperadminSubscriptionRecord[],
  filename = 'superadmin_subscriptions_export.csv'
): void {
  const headers = ['Subscription ID', 'Tenant / Library', 'Plan', 'Billing Cycle', 'MRR (INR)', 'Payment Status', 'Contact Person', 'Phone', 'Email'];
  const rows = subscribers.map((sub) => [
    escapeCsv(sub.id),
    escapeCsv(sub.tenant),
    escapeCsv(sub.plan),
    escapeCsv(sub.cycle),
    escapeCsv(sub.mrr),
    escapeCsv(sub.status),
    escapeCsv((sub as SubscriberContactFields).billingContact || 'Primary Admin'),
    escapeCsv((sub as SubscriberContactFields).phone || 'N/A'),
    escapeCsv((sub as SubscriberContactFields).email || 'N/A'),
  ]);

  const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.hidden = true;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Downloads subscriber records as Excel (.xls).
 */
export function downloadSuperadminSubscriptionsExcel(
  subscribers: SuperadminSubscriptionRecord[],
  filename = 'superadmin_subscriptions_export.xls'
): void {
  const tableRows = subscribers
    .map((sub, idx) => {
      const statusColor = sub.status === 'Paid' ? '#059669' : sub.status === 'Due Soon' ? '#d97706' : '#e11d48';
      return `
      <tr style="background-color: ${idx % 2 === 0 ? '#ffffff' : '#f8fafc'};">
        <td style="padding: 8px; border: 1px solid #cbd5e1; font-weight: bold;">${sub.tenant}</td>
        <td style="padding: 8px; border: 1px solid #cbd5e1; text-align: center;">${sub.plan}</td>
        <td style="padding: 8px; border: 1px solid #cbd5e1; text-align: center;">${sub.cycle}</td>
        <td style="padding: 8px; border: 1px solid #cbd5e1; text-align: right; font-weight: bold;">₹${sub.mrr?.toLocaleString('en-IN') ?? 0}</td>
        <td style="padding: 8px; border: 1px solid #cbd5e1; text-align: center; color: ${statusColor}; font-weight: bold;">${sub.status}</td>
        <td style="padding: 8px; border: 1px solid #cbd5e1;">${(sub as SubscriberContactFields).billingContact || 'Primary Admin'}</td>
        <td style="padding: 8px; border: 1px solid #cbd5e1;">${(sub as SubscriberContactFields).phone || 'N/A'}</td>
        <td style="padding: 8px; border: 1px solid #cbd5e1;">${(sub as SubscriberContactFields).email || 'N/A'}</td>
      </tr>`;
    })
    .join('');

  const html = `
  <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
  <head>
    <!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Active Subscribers</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
    <meta http-equiv="content-type" content="text/plain; charset=UTF-8"/>
    <style>
      body { font-family: Calibri, Arial, sans-serif; font-size: 11pt; }
      table { border-collapse: collapse; width: 100%; }
      th { background-color: #4f46e5; color: #ffffff; padding: 10px; font-weight: bold; border: 1px solid #4338ca; text-align: left; }
    </style>
  </head>
  <body>
    <h2>Smart Library SaaS - Active Subscribers Roster</h2>
    <p>Export Date: ${new Date().toLocaleString('en-IN')} | Total Subscribers: ${subscribers.length}</p>
    <table>
      <thead>
        <tr>
          <th>Tenant / Library</th>
          <th>Plan</th>
          <th>Cycle</th>
          <th>MRR Contribution</th>
          <th>Status</th>
          <th>Billing Contact</th>
          <th>Phone</th>
          <th>Email</th>
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
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.hidden = true;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
