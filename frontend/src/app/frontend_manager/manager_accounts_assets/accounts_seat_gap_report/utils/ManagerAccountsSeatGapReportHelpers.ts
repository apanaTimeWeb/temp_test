import type { ManagerSeatGapTimeHorizon } from '@/app/frontend_manager/manager_accounts_assets/accounts_seat_gap_report/components/manager_accounts_seat_gap_report_views/ManagerAccountsSeatGapReportTimeHorizonBar';
import type { MatchingLead } from '@/app/frontend_manager/manager_accounts_assets/accounts_seat_gap_report/config/manager_accounts_seat_gap_report.demo_data';
import type { GapRow } from '@/app/frontend_manager/manager_accounts_assets/accounts_seat_gap_report/hooks/ManagerAccountsSeatGapReportDemoRepository';

const INR_RUPEES_FORMATTER = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

const INR_FIXED_TWO = new Intl.NumberFormat('en-IN', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  useGrouping: false,
});

export function formatSeatGapInrRupees(rupees: number): string {
  return INR_RUPEES_FORMATTER.format(rupees);
}

export function formatSeatGapDailyRate(): string {
  return `${INR_RUPEES_FORMATTER.format(50)}.00/day`;
}

export function formatKnownIsoCalendarDate(value: string, locale: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return value;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return value;
  return new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'short', day: 'numeric' }).format(date);
}

export function filterGapRowsByTimeHorizon(
  gapList: GapRow[],
  timeHorizon: ManagerSeatGapTimeHorizon,
  customStartDate: string,
  customEndDate: string
): GapRow[] {
  if (timeHorizon === 'all') return gapList;
  const now = new Date();
  return gapList.filter((r) => {
    const recDate = new Date(r.lastOccupied);
    if (isNaN(recDate.getTime())) return true;
    if (timeHorizon === 'today') return recDate.toISOString().slice(0, 10) === now.toISOString().slice(0, 10);
    if (timeHorizon === 'this_week') {
      const diffDays = (now.getTime() - recDate.getTime()) / (1000 * 3600 * 24);
      return diffDays >= 0 && diffDays <= 7;
    }
    if (timeHorizon === 'this_month') return recDate.getFullYear() === now.getFullYear() && recDate.getMonth() === now.getMonth();
    if (timeHorizon === 'custom') {
      const dateStr = recDate.toISOString().slice(0, 10);
      if (customStartDate && dateStr < customStartDate) return false;
      if (customEndDate && dateStr > customEndDate) return false;
      return true;
    }
    return true;
  });
}

function escapeCsvCell(v: unknown): string {
  const s = String(v ?? '');
  return /^[\u0000-\u0020]*[=+\-@]/.test(s) ? `'"${s.replace(/"/g, '""')}"` : `"${s.replace(/"/g, '""')}"`;
}

export function exportSeatGapReportCsv(rows: GapRow[]): void {
  const headers = ['Seat No', 'Shift', 'Floor', 'Last Occupied Date', 'Gap Days', 'Revenue Loss (INR)', 'Status']
    .map(escapeCsvCell)
    .join(',');
  const csvRows = rows
    .map((r) =>
      [r.seatNo, r.shift, r.floor, r.lastOccupied, r.gapDays, INR_FIXED_TWO.format(r.revenueLoss / 100), r.status]
        .map(escapeCsvCell)
        .join(',')
    )
    .join('\r\n');

  const blob = new Blob([`\uFEFF${headers}\r\n${csvRows}`], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = Object.assign(document.createElement('a'), {
    href: url,
    download: `seat_gap_report_${new Date().toISOString().slice(0, 10)}.csv`,
    hidden: true,
  });
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function buildRetargetWhatsAppMessage(seat: GapRow, activeLead: MatchingLead, selectedOfferType: string): string {
  let discountText = `Special ${INR_RUPEES_FORMATTER.format(100)} instant registration waiver if claimed today!`;
  if (selectedOfferType === 'trial') {
    discountText = 'Complimentary 2-Day free study trial pass included!';
  } else if (selectedOfferType === 'percent') {
    discountText = 'Flat 10% discount on your first monthly admission!';
  } else if (selectedOfferType === 'immediate') {
    discountText = 'Priority reservation holding valid until 6 PM today!';
  }

  return (
    `👋 *Hello ${activeLead.name}!*\n\n` +
    `Great news from *Central Study Hub*: A premium seat matching your inquiry has just opened up!\n\n` +
    `📍 *Seat Details:*\n` +
    `• Seat Number: *${seat.seatNo}*\n` +
    `• Floor: ${seat.floor}\n` +
    `• Shift: *${seat.shift}*\n` +
    `• Amenities: High-speed Wi-Fi, AC, Ergonomic study desk\n\n` +
    `🎁 *Exclusive Offer:* ${discountText}\n\n` +
    `Since this shift fills fast, reply *YES* to lock your seat or visit our front desk to complete admission.`
  );
}
