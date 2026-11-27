import type { Entry } from '@/app/frontend_manager/manager_accounts_assets/accounts_daily_settlement/hooks/ManagerAccountsDailySettlementDemoRepository';

export interface DenominationCounts {
  n500: number;
  n200: number;
  n100: number;
  n50: number;
  n20: number;
  n10: number;
  coins: number;
}

const INR_RUPEES_FORMATTER = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

export function formatInrRupees(rupees: number): string {
  return INR_RUPEES_FORMATTER.format(rupees);
}

export const DENOMINATIONS = [
  { key: 'n500', value: 500, badge: formatInrRupees(500), label: `${formatInrRupees(500)} Note` },
  { key: 'n200', value: 200, badge: formatInrRupees(200), label: `${formatInrRupees(200)} Note` },
  { key: 'n100', value: 100, badge: formatInrRupees(100), label: `${formatInrRupees(100)} Note` },
  { key: 'n50', value: 50, badge: formatInrRupees(50), label: `${formatInrRupees(50)} Note` },
  { key: 'n20', value: 20, badge: formatInrRupees(20), label: `${formatInrRupees(20)} Note` },
  { key: 'n10', value: 10, badge: formatInrRupees(10), label: `${formatInrRupees(10)} Note` },
  { key: 'coins', value: 1, badge: `${INR_RUPEES_FORMATTER.format(1).slice(0, 1)}Coins`, label: `Coins (${formatInrRupees(5)} / ${formatInrRupees(2)} / ${formatInrRupees(1)})` },
] as const;

export const CURRENCY_SYMBOL_TEXT = INR_RUPEES_FORMATTER.format(0).replace(/[0-9.,\s]/g, '');

export function buildWhatsAppHandoverSummary(params: {
  entry?: Entry | null;
  counts: DenominationCounts;
  totalPhysicalCash: number;
  expectedCashRupees: number;
  discrepancy: number;
  handoverAmount: number;
  retainedFloat: number;
  managerName: string;
  ownerName: string;
}): string {
  const { entry, counts, totalPhysicalCash, expectedCashRupees, discrepancy, handoverAmount, retainedFloat, managerName, ownerName } = params;
  const shift = entry ? entry.shift : 'Daily Shift';
  const date = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const discText =
    discrepancy === 0
      ? `${formatInrRupees(0)} (Exact Match ✓)`
      : discrepancy > 0
      ? `+${formatInrRupees(discrepancy)} (Surplus)`
      : `-${formatInrRupees(Math.abs(discrepancy))} (Shortage)`;

  return (
    `📋 *DAILY CASH HANDOVER & SETTLEMENT RECEIPT*\n` +
    `🏢 Central Study Hub — Branch 1\n` +
    `📅 Date: ${date} | Shift: ${shift}\n` +
    `────────────────────────\n` +
    `💵 *Denomination Breakdown:*\n` +
    `• ${formatInrRupees(500)} x ${counts.n500} = ${formatInrRupees(counts.n500 * 500)}\n` +
    `• ${formatInrRupees(200)} x ${counts.n200} = ${formatInrRupees(counts.n200 * 200)}\n` +
    `• ${formatInrRupees(100)} x ${counts.n100} = ${formatInrRupees(counts.n100 * 100)}\n` +
    `• ${formatInrRupees(50)} x ${counts.n50} = ${formatInrRupees(counts.n50 * 50)}\n` +
    `• ${formatInrRupees(20)} x ${counts.n20} = ${formatInrRupees(counts.n20 * 20)}\n` +
    `• ${formatInrRupees(10)} x ${counts.n10} = ${formatInrRupees(counts.n10 * 10)}\n` +
    `• Coins = ${formatInrRupees(counts.coins)}\n` +
    `────────────────────────\n` +
    `💰 *Total Cash in Drawer:* ${formatInrRupees(totalPhysicalCash)}\n` +
    `🎯 *Expected Cash:* ${formatInrRupees(expectedCashRupees)}\n` +
    `⚖️ *Discrepancy:* ${discText}\n` +
    `────────────────────────\n` +
    `🤝 *Handed Over to Owner:* ${formatInrRupees(handoverAmount)}\n` +
    `🔒 *Retained Drawer Float (Tomorrow):* ${formatInrRupees(retainedFloat)}\n` +
    `👤 Handed By: ${managerName}\n` +
    `👑 Received By: ${ownerName}\n` +
    `✅ Sign-off Status: Verified & Balanced`
  );
}
