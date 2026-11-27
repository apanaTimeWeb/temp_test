import { MANAGER_REFERRAL_DEMO_CANDIDATES } from '@/app/frontend_manager/manager_members/members_referral_bonus/config/manager_members_referral_bonus.demo_data';
import { readBrowserStorageItem, writeBrowserStorageItem } from '@/lib/browserStorage';

const INR_FMT = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
export const formatReferralInr = (rupees: number): string => INR_FMT.format(Number.isFinite(rupees) ? rupees : 0);

export interface ReferrerParsedDetails {
  name: string;
  smartId: string;
  phone?: string;
  seat?: string;
  currentPlan?: string;
  monthlyFee?: number;
  nextRenewalDate?: string;
}

export function parseBonusNumber(bonus: string | number): number {
  if (typeof bonus === 'number') return bonus;
  const digits = String(bonus).replace(/[^0-9.]/g, '');
  const num = parseFloat(digits);
  return isNaN(num) ? 500 : Math.round(num);
}

export function parseReferrerInfo(referrerStr: string): ReferrerParsedDetails {
  const match = (referrerStr || '').match(/^(.*?)\s*(?:\((.*?)\))?$/);
  const name = match && match[1] ? match[1].trim() : (referrerStr || '').trim();
  const smartId = match && match[2] ? match[2].trim() : '';
  const candidate = MANAGER_REFERRAL_DEMO_CANDIDATES.find(
    (c) => (smartId && c.id === smartId) || c.name.toLowerCase() === name.toLowerCase(),
  );
  return {
    name: candidate ? candidate.name : name,
    smartId: candidate ? candidate.id : smartId || 'LIB-MEMBER',
    phone: candidate?.phone || '9876543210',
    seat: candidate?.seat || 'Reserved Desk',
    currentPlan: '12 Hrs Full Day AC',
    monthlyFee: 1800,
    nextRenewalDate: new Date(Date.now() + 15 * 86400000).toISOString().slice(0, 10),
  };
}

export function getReferralRenewalFinanceUrl(referrerName: string, discount: number, refId: string): string {
  const params = new URLSearchParams();
  if (referrerName) params.set('name', referrerName.trim());
  if (discount) params.set('discount', String(discount));
  if (refId) params.set('refId', refId);
  return `/frontend_manager/manager_finance/finance_renewals?${params.toString()}`;
}

export function applyReferralBonusToNextRenewal(
  referralId: string, referrer: string, referred: string, discountAmount: number,
): { success: boolean; netFee: number; message: string } {
  const referrerDetails = parseReferrerInfo(referrer);
  const standardFee = referrerDetails.monthlyFee || 1800;
  const netFee = Math.max(0, standardFee - discountAmount);

  if (typeof window !== 'undefined') {
    try {
      const rawLedger = readBrowserStorageItem('manager_referral_renewals_ledger');
      const ledger = rawLedger.available && rawLedger.value ? JSON.parse(rawLedger.value) : [];
      const newEntry = {
        id: `RNW-ADJ-${Date.now().toString().slice(-4)}`,
        referralId, referrerName: referrerDetails.name, referrerSmartId: referrerDetails.smartId,
        referredStudent: referred, standardFee, discountAmount, netFee,
        appliedDate: new Date().toISOString().slice(0, 10), status: 'Adjusted in Renewal',
      };
      writeBrowserStorageItem('manager_referral_renewals_ledger', JSON.stringify([newEntry, ...(Array.isArray(ledger) ? ledger : [])]));

      const rawMembers = readBrowserStorageItem('manager_member_records');
      if (rawMembers.available && rawMembers.value) {
        const members = JSON.parse(rawMembers.value);
        if (Array.isArray(members)) {
          const updatedMembers = members.map((m: Record<string, unknown> | null) => {
            if (m && (m.id === referrerDetails.smartId || (typeof m.name === 'string' && m.name.toLowerCase() === referrerDetails.name.toLowerCase()))) {
              const note = `Referral Bonus Applied: -${formatReferralInr(discountAmount)} for referring ${referred} (Ref: ${referralId})`;
              return { ...m, remarks: m.remarks ? `${m.remarks} | ${note}` : note, renewalDiscountDue: discountAmount };
            }
            return m;
          });
          writeBrowserStorageItem('manager_member_records', JSON.stringify(updatedMembers));
        }
      }
      window.dispatchEvent(new CustomEvent('manager_referral_adjusted_in_renewal', { detail: newEntry }));
    } catch { /* storage fallback */ }
  }

  return {
    success: true,
    netFee,
    message: `${formatReferralInr(discountAmount)} referral discount applied to ${referrerDetails.name}'s next renewal. Net fee: ${formatReferralInr(netFee)}.`,
  };
}
