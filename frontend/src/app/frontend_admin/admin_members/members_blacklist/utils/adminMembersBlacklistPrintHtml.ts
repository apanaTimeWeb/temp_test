import type { AdminBlacklistRecord } from '@/app/frontend_admin/admin_members/members_blacklist/types/AdminMembersBlacklistTypes';
import { escapeBlacklistHtml } from '@/app/frontend_admin/admin_members/members_blacklist/utils/adminMembersBlacklistCsvExcel';

export function printBlacklistRosterHtml(records: readonly AdminBlacklistRecord[]): void {
  if (typeof window === 'undefined') return;
  const printWindow = window.open('', '_blank', 'width=900,height=700,noopener,noreferrer');
  if (!printWindow) { window.print(); return; }
  printWindow.opener = null;
  const dateStr = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  const html = `
    <!DOCTYPE html><html><head><title>Smart Library - Security Blacklist Roster</title>
      <style>
        @page { size: landscape; margin: 10mm; }
        body { font-family: system-ui, -apple-system, sans-serif; color: #0f172a; margin: 0; padding: 15px; }
        .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #e11d48; padding-bottom: 10px; margin-bottom: 12px; }
        .title { font-size: 18px; font-weight: 800; text-transform: uppercase; color: #be123c; letter-spacing: 0.5px; }
        .subtitle { font-size: 12px; color: #64748b; margin-top: 2px; } .meta { font-size: 11px; text-align: right; color: #475569; }
        table { width: 100%; border-collapse: collapse; font-size: 11px; }
        th { background-color: #ffe4e6; color: #9f1239; text-align: left; padding: 6px; border: 1px solid #fecdd3; font-weight: 700; text-transform: uppercase; font-size: 10px; }
        td { padding: 6px; border: 1px solid #e2e8f0; } tr:nth-child(even) { background-color: #fff1f2; }
        .badge { display: inline-block; padding: 2px 6px; border-radius: 4px; font-size: 9px; font-weight: 600; text-transform: uppercase; background: #fee2e2; color: #b91c1c; }
        .footer { margin-top: 14px; font-size: 10px; color: #94a3b8; display: flex; justify-content: space-between; border-top: 1px solid #e2e8f0; padding-top: 6px; }
      </style>
    </head>
    <body>
      <div class="header">
        <div><div class="title">Smart Library Network · Restricted Members Blacklist</div><div class="subtitle">Confidential Disciplinary Record · Total Records: ${records.length}</div></div>
        <div class="meta"><div><strong>Generated:</strong> ${dateStr}</div><div><strong>Security:</strong> Central Access Control</div></div>
      </div>
      <table><thead><tr><th>Student Name</th><th>Phone</th><th>Reason</th><th>Reported By</th><th>Date</th><th>Prev Seat</th><th>Status</th></tr></thead>
      <tbody>${records.map((r) => `<tr><td><strong>${escapeBlacklistHtml(r.name)}</strong></td><td>${escapeBlacklistHtml(r.phone || '—')}</td><td>${escapeBlacklistHtml(r.reason)}</td><td>${escapeBlacklistHtml(r.blacklistedBy || 'Admin')}</td><td>${escapeBlacklistHtml(r.blacklistedOn || '—')}</td><td>${escapeBlacklistHtml(r.previousSeat || '—')}</td><td><span class="badge">${escapeBlacklistHtml(r.status || 'Blacklisted')}</span></td></tr>`).join('')}</tbody></table>
      <div class="footer"><span>Smart Library Security & Compliance Registry</span><span>Page 1 of 1</span></div>
      <script>window.onload = function() { window.print(); };</script>
    </body></html>
  `;
  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}

export function printDisciplinaryMemoHtml(record: AdminBlacklistRecord): void {
  if (typeof window === 'undefined') return;
  const printWindow = window.open('', '_blank', 'width=850,height=900,noopener,noreferrer');
  if (!printWindow) { window.print(); return; }
  printWindow.opener = null;
  const isNetwork = record.banScope === 'NETWORK_WIDE' || !record.banScope;
  const catLabels: Record<string, string> = {
    THEFT_STOLEN_PROPERTY: 'Theft / Stolen Property (चोरी)',
    INDISCIPLINE_MISCONDUCT: 'Gross Indiscipline & Misconduct (अनुशासनहीनता)',
    PHYSICAL_ALTERCATION: 'Physical Altercation & Threat (मारपीट/अभद्र व्यवहार)',
    PROPERTY_VANDALISM: 'Property Damage & Vandalism (संपत्ति तोड़फोड़)',
    UNAUTHORIZED_OCCUPANCY: 'Unauthorized Seat Occupancy (अवैध कब्जा)',
    FEE_DEFAULT_FRAUD: 'Severe Fee Fraud & Default (फीस धोखाधड़ी)',
    OTHER: 'Disciplinary Policy Violation',
  };
  const html = `
    <!DOCTYPE html><html><head><title>DISCIPLINARY EXPULSION ORDER - ${escapeBlacklistHtml(record.name)}</title>
      <style>
        @page { size: A4 portrait; margin: 15mm; }
        body { font-family: system-ui, -apple-system, sans-serif; color: #0f172a; margin: 0; padding: 20px; line-height: 1.5; }
        .header { text-align: center; border-bottom: 3px double #be123c; padding-bottom: 12px; margin-bottom: 20px; }
        .logo { font-size: 22px; font-weight: 800; letter-spacing: 1px; color: #9f1239; text-transform: uppercase; }
        .subtitle { font-size: 12px; color: #475569; margin-top: 4px; }
        .badge-order { display: inline-block; background: #ffe4e6; color: #9f1239; font-weight: 700; font-size: 13px; padding: 4px 14px; border-radius: 999px; margin-top: 8px; border: 1px solid #fecdd3; }
        .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 12px; margin-bottom: 20px; background: #f8fafc; padding: 12px; border: 1px solid #e2e8f0; border-radius: 8px; }
        .meta-item { display: flex; flex-direction: column; } .meta-label { font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; }
        .meta-val { font-size: 12px; font-weight: 600; color: #1e293b; margin-top: 2px; }
        .section-title { font-size: 13px; font-weight: 700; color: #9f1239; text-transform: uppercase; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px; margin-top: 16px; margin-bottom: 8px; }
        .desc-box { background: #fff1f2; border: 1px solid #fecdd3; border-radius: 6px; padding: 12px; font-size: 12px; color: #881337; margin-bottom: 14px; }
        .action-list { list-style: none; padding-left: 0; font-size: 12px; margin: 0; } .action-list li { padding: 4px 0; display: flex; align-items: center; gap: 6px; }
        .action-list li::before { content: "✖"; color: #e11d48; font-weight: bold; }
        .signatures { display: flex; justify-content: space-between; margin-top: 50px; padding-top: 20px; border-top: 1px solid #cbd5e1; font-size: 12px; }
        .sig-box { text-align: center; min-width: 180px; } .sig-line { border-top: 1px solid #0f172a; margin-top: 40px; padding-top: 4px; font-weight: 600; font-size: 11px; }
        .watermark { position: fixed; top: 40%; left: 20%; font-size: 60px; font-weight: 900; color: rgba(225, 29, 72, 0.06); transform: rotate(-30deg); text-transform: uppercase; pointer-events: none; }
      </style>
    </head>
    <body>
      <div class="watermark">BLACKLISTED</div>
      <div class="header"><div class="logo">Smart Library Network · Disciplinary Council</div><div class="subtitle">Central Governance & Security Administration</div><div class="badge-order">FORMAL EXPULSION & DISCIPLINARY ORDER</div></div>
      <div class="meta-grid">
        <div class="meta-item"><span class="meta-label">Member Name</span><span class="meta-val">${escapeBlacklistHtml(record.name)}</span></div>
        <div class="meta-item"><span class="meta-label">Registered Phone</span><span class="meta-val">${escapeBlacklistHtml(record.phone || '—')}</span></div>
        <div class="meta-item"><span class="meta-label">Incident Reference ID</span><span class="meta-val">${escapeBlacklistHtml(record.id)}</span></div>
        <div class="meta-item"><span class="meta-label">Ban Scope</span><span class="meta-val" style="color: #e11d48;">${isNetwork ? 'NETWORK-WIDE (All Branches Barred)' : escapeBlacklistHtml(record.branch || 'Single Branch')}</span></div>
        <div class="meta-item"><span class="meta-label">Disciplinary Category</span><span class="meta-val">${escapeBlacklistHtml(catLabels[record.category || ''] || record.category || 'INDISCIPLINE_MISCONDUCT')}</span></div>
        <div class="meta-item"><span class="meta-label">Effective Date</span><span class="meta-val">${escapeBlacklistHtml(record.blacklistedOn || '—')}</span></div>
        <div class="meta-item"><span class="meta-label">Previous Seat / Hall</span><span class="meta-val">${escapeBlacklistHtml(record.previousSeat || '—')}</span></div>
        <div class="meta-item"><span class="meta-label">Sanctioning Authority</span><span class="meta-val">${escapeBlacklistHtml(record.blacklistedBy || 'Chief Administrator')}</span></div>
      </div>
      <div class="section-title">Record of Violation & Disciplinary Findings</div>
      <div class="desc-box"><strong>Incident Report:</strong> ${escapeBlacklistHtml(record.reason)}${record.firRefNo ? `<div style="margin-top: 6px;"><strong>Police / Legal Reference:</strong> ${escapeBlacklistHtml(record.firRefNo)}</div>` : ''}${record.incidentLocation ? `<div><strong>Location:</strong> ${escapeBlacklistHtml(record.incidentLocation)}</div>` : ''}</div>
      <div class="section-title">Enforced Administrative Sanctions</div>
      <ul class="action-list">
        <li><strong>Seat & Locker Revocation:</strong> Assigned seat (${escapeBlacklistHtml(record.previousSeat || 'Active Desk')}) and locker immediately reclaimed and vacated.</li>
        <li><strong>Biometric / RFID Bar:</strong> Turnstile QR and biometric entry immediately invalidated across ${isNetwork ? 'all network branches' : 'this branch'}.</li>
        <li><strong>Premises Restriction:</strong> The named individual is strictly barred from entering library premises or disturbing silent study zones.</li>
        <li><strong>Financial Compliance:</strong> Security caution deposit confiscated or retained against damages/settlement.</li>
      </ul>
      <div class="signatures"><div class="sig-box"><div class="sig-line">Branch Supervisor / Security In-charge</div></div><div class="sig-box"><div class="sig-line">Chief Administrative Officer</div></div></div>
      <script>window.onload = function() { window.print(); };</script>
    </body></html>
  `;
  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}
