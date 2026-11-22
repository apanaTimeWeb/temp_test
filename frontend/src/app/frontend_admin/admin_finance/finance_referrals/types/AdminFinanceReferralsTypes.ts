export interface ReferralPayoutVoucher {
  voucherId: string;
  referrerId: number;
  studentName: string;
  smartId: string;
  branch: string;
  amountMinor: number;
  mode: 'fee_adjustment' | 'cash_upi';
  subChannel?: string;
  utrReference?: string;
  invoiceCreditNote?: string;
  disbursedAt: string;
  authorizedBy: string;
  notes: string;
}

export type AdminFinanceDemoReferrer = {
  id: number;
  name: string;
  smartId: string;
  referredNames: string[];
  bonusEarned: number;
  redeemed: number;
  balance: number;
  branch?: string;
  phone?: string;
};
