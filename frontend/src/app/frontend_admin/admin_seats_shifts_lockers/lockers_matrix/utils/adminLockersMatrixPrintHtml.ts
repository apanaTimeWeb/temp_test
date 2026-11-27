import type { LockerPricingPolicy } from '@/app/frontend_admin/admin_seats_shifts_lockers/lockers_matrix/components/AdminLockersMatrixSettingsModal';
import type { AdminLockersLockerMatrixViewModel } from '@/app/frontend_admin/admin_seats_shifts_lockers/lockers_matrix/types/AdminLockersMatrixTypes';

const LOCKER_ROSTER_CSS = `
  @page { size: landscape; margin: 10mm; }
  body { font-family: system-ui, -apple-system, sans-serif; color: #0f172a; margin: 0; padding: 15px; }
  .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #4338ca; padding-bottom: 10px; margin-bottom: 12px; }
  .title { font-size: 18px; font-weight: 800; text-transform: uppercase; color: #4338ca; }
  .subtitle { font-size: 12px; color: #64748b; margin-top: 2px; }
  .policy { font-size: 11px; padding: 8px 12px; background: #e0e7ff; border-radius: 6px; margin-bottom: 12px; color: #3730a3; }
  table { width: 100%; border-collapse: collapse; font-size: 11px; }
  th { background-color: #e0e7ff; color: #3730a3; text-align: left; padding: 6px; border: 1px solid #c7d2fe; font-weight: 700; text-transform: uppercase; font-size: 10px; }
  td { padding: 6px; border: 1px solid #e2e8f0; } tr:nth-child(even) { background-color: #f8fafc; }
  .badge { display: inline-block; padding: 2px 6px; border-radius: 4px; font-size: 9px; font-weight: 600; text-transform: uppercase; }
  .badge-free { background: #dcfce7; color: #15803d; } .badge-occupied { background: #fee2e2; color: #b91c1c; } .badge-maintenance { background: #fef3c7; color: #b45309; }
`;

export function printLockersMatrixRoster(
  visibleLockers: readonly AdminLockersLockerMatrixViewModel[],
  activeBranchFilter: string,
  stats: { free: number; occupied: number },
  pricingPolicy: LockerPricingPolicy,
) {
  if (typeof window === 'undefined') return;
  const printWindow = window.open('', '_blank', 'width=950,height=750');
  if (!printWindow) {
    window.print();
    return;
  }
  const dateStr = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  const html = `
    <!DOCTYPE html><html><head><title>Smart Library - Locker Allotment & Custody Roster</title><style>${LOCKER_ROSTER_CSS}</style></head>
      <body>
        <div class="header">
          <div><div class="title">Smart Library Network · Locker Asset Custody & Allotment Roster</div><div class="subtitle">Branch: ${activeBranchFilter} · Total Lockers: ${visibleLockers.length} · Free: ${stats.free} · Occupied: ${stats.occupied}</div></div>
          <div style="font-size: 11px; text-align: right; color: #475569;"><div><strong>Generated:</strong> ${dateStr}</div><div><strong>Custodian:</strong> Front Desk Administration</div></div>
        </div>
        <div class="policy"><strong>Active Policy:</strong> Monthly Rent: ₹${pricingPolicy.monthlyRent} · Key Security Deposit: ₹${pricingPolicy.securityDeposit} (Refundable) · Lost Key Replacement: ₹${pricingPolicy.lostKeyFee}</div>
        <table>
          <thead><tr><th>Locker #</th><th>Branch</th><th>Status</th><th>Student Name</th><th>Smart ID</th><th>Phone</th><th>Shift Plan</th><th>Expiry Date</th><th>Allotted By</th></tr></thead>
          <tbody>
            ${visibleLockers.map((l) => `
              <tr>
                <td><strong style="color:#4338ca;">#${l.id}</strong></td>
                <td>${l.branchName || 'Downtown Central'}</td>
                <td><span class="badge badge-${l.status}">${l.status}</span></td>
                <td>${l.student || '—'}</td><td>${l.smartId || '—'}</td><td>${l.phone || '—'}</td>
                <td>${l.shift || '—'}</td><td>${l.expiry || '—'}</td><td>${l.allottedByManager || '—'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <script>window.onload = function() { window.print(); };</script>
      </body></html>
  `;
  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}
