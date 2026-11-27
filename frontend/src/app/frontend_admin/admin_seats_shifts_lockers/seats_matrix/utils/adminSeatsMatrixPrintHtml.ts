import type { AdminSeatMatrixSeatMatrixViewModel } from '@/app/frontend_admin/admin_seats_shifts_lockers/seats_matrix/types/AdminSeatsMatrixTypes';

const SEAT_ROSTER_CSS = `
  @page { size: landscape; margin: 10mm; }
  body { font-family: system-ui, -apple-system, sans-serif; color: #0f172a; margin: 0; padding: 15px; }
  .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #4338ca; padding-bottom: 10px; margin-bottom: 12px; }
  .title { font-size: 18px; font-weight: 800; text-transform: uppercase; color: #4338ca; }
  .subtitle { font-size: 12px; color: #64748b; margin-top: 2px; } .kpis { display: flex; gap: 16px; margin-bottom: 12px; }
  .kpi { padding: 8px 12px; background: #eef2ff; border-radius: 6px; font-size: 11px; }
  table { width: 100%; border-collapse: collapse; font-size: 11px; }
  th { background-color: #e0e7ff; color: #3730a3; text-align: left; padding: 6px; border: 1px solid #c7d2fe; font-weight: 700; text-transform: uppercase; font-size: 10px; }
  td { padding: 6px; border: 1px solid #e2e8f0; } tr:nth-child(even) { background-color: #f8fafc; }
  .badge { display: inline-block; padding: 2px 6px; border-radius: 4px; font-size: 9px; font-weight: 600; text-transform: uppercase; }
  .badge-free { background: #dcfce7; color: #15803d; } .badge-occupied { background: #fee2e2; color: #b91c1c; } .badge-maintenance { background: #fef3c7; color: #b45309; }
`;

export function printSeatMatrixRosterHtml(
  visible: readonly AdminSeatMatrixSeatMatrixViewModel[],
  activeBranchFilter: string,
  stats: { total: number; free: number; occupied: number; occupancyRate: number },
) {
  if (typeof window === 'undefined') return;
  const printWindow = window.open('', '_blank', 'width=950,height=750');
  if (!printWindow) {
    window.print();
    return;
  }
  const dateStr = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  const html = `
    <!DOCTYPE html><html><head><title>Smart Library - Seat Matrix & Floor Plan Roster</title><style>${SEAT_ROSTER_CSS}</style></head>
      <body>
        <div class="header">
          <div><div class="title">Smart Library Network · Seat Matrix Master Roster</div><div class="subtitle">Branch: ${activeBranchFilter} · Total Desks: ${visible.length}</div></div>
          <div style="font-size: 11px; text-align: right; color: #475569;"><div><strong>Generated:</strong> ${dateStr}</div><div><strong>Authority:</strong> Central Operations Desk</div></div>
        </div>
        <div class="kpis">
          <div class="kpi">Total Desks: <strong>${stats.total}</strong></div>
          <div class="kpi">Available Free: <strong style="color:#15803d">${stats.free}</strong></div>
          <div class="kpi">Occupied: <strong style="color:#b91c1c">${stats.occupied}</strong></div>
          <div class="kpi">Occupancy Rate: <strong>${stats.occupancyRate}%</strong></div>
        </div>
        <table>
          <thead><tr><th>Seat ID</th><th>Branch</th><th>Status</th><th>Student Name</th><th>Smart ID</th><th>Phone</th><th>Shift</th><th>Plan Type</th><th>Locker</th><th>Expiry Date</th></tr></thead>
          <tbody>
            ${visible.map((s) => `
              <tr>
                <td><strong style="color:#4338ca;">S-${s.id}</strong></td>
                <td>${s.branchName || 'Downtown Central'}</td>
                <td><span class="badge badge-${s.status}">${s.status}</span></td>
                <td>${s.student || '—'}</td><td>${s.smartId || '—'}</td><td>${s.phone || '—'}</td>
                <td>${s.shift || '—'}</td><td>${s.plan || '—'}</td><td>${s.locker || '—'}</td><td>${s.expiry || '—'}</td>
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
