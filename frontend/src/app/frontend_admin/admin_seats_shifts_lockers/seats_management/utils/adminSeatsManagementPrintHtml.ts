import type { Seat } from '@/app/frontend_admin/admin_seats_shifts_lockers/seats_management/types/AdminSeatsManagementComponentTypes';

const SEATS_INVENTORY_CSS = `
  @page { size: landscape; margin: 10mm; }
  body { font-family: system-ui, -apple-system, sans-serif; color: #0f172a; margin: 0; padding: 15px; }
  .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #0e7490; padding-bottom: 10px; margin-bottom: 12px; }
  .title { font-size: 18px; font-weight: 800; text-transform: uppercase; color: #0e7490; }
  .subtitle { font-size: 12px; color: #64748b; margin-top: 2px; }
  table { width: 100%; border-collapse: collapse; font-size: 11px; }
  th { background-color: #cffafe; color: #155e75; text-align: left; padding: 6px; border: 1px solid #a5f3fc; font-weight: 700; text-transform: uppercase; font-size: 10px; }
  td { padding: 6px; border: 1px solid #e2e8f0; } tr:nth-child(even) { background-color: #f8fafc; }
  .badge { display: inline-block; padding: 2px 6px; border-radius: 4px; font-size: 9px; font-weight: 600; text-transform: uppercase; }
  .badge-working { background: #dcfce7; color: #15803d; } .badge-maintenance { background: #fef3c7; color: #b45309; } .badge-broken { background: #fee2e2; color: #b91c1c; }
`;

export function printMasterSeatsRoster(filtered: readonly Seat[], branchLabel: string) {
  if (typeof window === 'undefined') return;
  const printWindow = window.open('', '_blank', 'width=950,height=750');
  if (!printWindow) {
    window.print();
    return;
  }
  const dateStr = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  const html = `
    <!DOCTYPE html><html><head><title>Smart Library - Seats Master Inventory Roster</title><style>${SEATS_INVENTORY_CSS}</style></head>
      <body>
        <div class="header">
          <div><div class="title">Smart Library Network · Seats Master Inventory Roster</div><div class="subtitle">Branch: ${branchLabel} · Total Seats: ${filtered.length}</div></div>
          <div style="font-size: 11px; text-align: right; color: #475569;"><div><strong>Generated:</strong> ${dateStr}</div><div><strong>Scope:</strong> Master Inventory Asset Audit</div></div>
        </div>
        <table>
          <thead><tr><th>Seat Number</th><th>Branch</th><th>Operational Status</th><th>Assigned Student</th><th>Last Maintenance Log</th></tr></thead>
          <tbody>
            ${filtered.map((s) => `<tr><td><strong style="color:#0891b2;">${s.seatNo}</strong></td><td>${s.branch}</td><td><span class="badge badge-${s.status.toLowerCase()}">${s.status}</span></td><td>${s.assignedTo || '—'}</td><td>${s.lastMaintenance || '—'}</td></tr>`).join('')}
          </tbody>
        </table>
        <script>window.onload = function() { window.print(); };</script>
      </body></html>
  `;
  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}
