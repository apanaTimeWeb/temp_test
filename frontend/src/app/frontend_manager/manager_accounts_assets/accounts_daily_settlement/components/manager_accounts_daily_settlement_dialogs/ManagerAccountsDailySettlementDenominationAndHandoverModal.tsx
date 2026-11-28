'use client';

import { ManagerAccountsDailySettlementDenominationCounterTab } from '@/app/frontend_manager/manager_accounts_assets/accounts_daily_settlement/components/manager_accounts_daily_settlement_dialogs/ManagerAccountsDailySettlementDenominationCounterTab';
import { ManagerAccountsDailySettlementHandoverReceiptTab } from '@/app/frontend_manager/manager_accounts_assets/accounts_daily_settlement/components/manager_accounts_daily_settlement_dialogs/ManagerAccountsDailySettlementHandoverReceiptTab';
import type { Entry } from '@/app/frontend_manager/manager_accounts_assets/accounts_daily_settlement/hooks/ManagerAccountsDailySettlementDemoRepository';
import {
  buildWhatsAppHandoverSummary,
  closingBalanceToMajorRupees,
  DENOMINATIONS,
  formatInrRupees,
  type DenominationCounts,
} from '@/app/frontend_manager/manager_accounts_assets/accounts_daily_settlement/utils/ManagerAccountsDailySettlementDenominationHelpers';
import { Check, CheckCircle2, Coins, Copy, Printer, Receipt, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';

export { DENOMINATIONS };
export type { DenominationCounts };

export interface ManagerAccountsDailySettlementDenominationAndHandoverModalProps {
  isOpen: boolean;
  onClose: () => void;
  entry?: Entry | null;
  formatCurrency?: (val: number) => string;
  onConfirmSettlement?: (data: {
    totalCounted: number;
    handoverToOwner: number;
    retainedFloat: number;
    discrepancy: number;
    ownerName: string;
  }) => void;
}

export function ManagerAccountsDailySettlementDenominationAndHandoverModal({
  isOpen,
  onClose,
  entry,
  onConfirmSettlement,
}: ManagerAccountsDailySettlementDenominationAndHandoverModalProps) {
  const expectedCashRupees = useMemo(() => closingBalanceToMajorRupees(entry?.closingBalance), [entry]);

  const [counts, setCounts] = useState<DenominationCounts>({
    n500: Math.floor(expectedCashRupees / 500),
    n200: Math.floor((expectedCashRupees % 500) / 200),
    n100: Math.floor(((expectedCashRupees % 500) % 200) / 100),
    n50: 0,
    n20: 0,
    n10: 0,
    coins: 0,
  });

  const [retainedFloat, setRetainedFloat] = useState<number>(500);
  const [ownerName, setOwnerName] = useState<string>('Library Owner (Mr. R.K. Agarwal)');
  const [managerName, setManagerName] = useState<string>('Branch Manager Satyam');
  const [copied, setCopied] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'counter' | 'receipt'>('counter');
  const copyTimerRef = useRef<number | null>(null);

  useEffect(() => () => {
    if (copyTimerRef.current !== null) window.clearTimeout(copyTimerRef.current);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const exp = closingBalanceToMajorRupees(entry?.closingBalance);
    setCounts({
      n500: Math.floor(exp / 500),
      n200: Math.floor((exp % 500) / 200),
      n100: Math.floor(((exp % 500) % 200) / 100),
      n50: 0,
      n20: 0,
      n10: 0,
      coins: 0,
    });
    setRetainedFloat(500);
    setActiveTab('counter');
  }, [isOpen, entry]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const totalPhysicalCash = useMemo(
    () =>
      (counts.n500 || 0) * 500 +
      (counts.n200 || 0) * 200 +
      (counts.n100 || 0) * 100 +
      (counts.n50 || 0) * 50 +
      (counts.n20 || 0) * 20 +
      (counts.n10 || 0) * 10 +
      (counts.coins || 0),
    [counts]
  );

  const discrepancy = totalPhysicalCash - expectedCashRupees;
  const handoverAmount = Math.max(0, totalPhysicalCash - (Number(retainedFloat) || 0));

  const handleCountChange = (key: keyof DenominationCounts, value: string) => {
    const n = Math.max(0, parseInt(value || '0', 10));
    setCounts((prev) => ({ ...prev, [key]: Number.isNaN(n) ? 0 : n }));
  };

  const handleReset = () => {
    setCounts({ n500: 0, n200: 0, n100: 0, n50: 0, n20: 0, n10: 0, coins: 0 });
    toast.info('Denominations reset to zero.', { id: 'manager-settlement-denomination-reset' });
  };

  const handleCopyWhatsApp = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(
        buildWhatsAppHandoverSummary({
          entry,
          counts,
          totalPhysicalCash,
          expectedCashRupees,
          discrepancy,
          handoverAmount,
          retainedFloat,
          managerName,
          ownerName,
        })
      );
      setCopied(true);
      toast.success('Cash handover receipt copied for WhatsApp!', { id: 'manager-settlement-copy-wa' });
      if (copyTimerRef.current !== null) window.clearTimeout(copyTimerRef.current);
      copyTimerRef.current = window.setTimeout(() => { setCopied(false); copyTimerRef.current = null; }, 2500);
    }
  };

  const handlePrintReceipt = () => window.print();

  const handleConfirm = () => {
    onConfirmSettlement?.({
      totalCounted: totalPhysicalCash,
      handoverToOwner: handoverAmount,
      retainedFloat: Number(retainedFloat) || 0,
      discrepancy,
      ownerName,
    });
    toast.success(`Shift settlement confirmed! Handed over ${formatInrRupees(handoverAmount)} to ${ownerName}.`, {
      id: 'manager-settlement-handover-confirm',
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="denomination-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs motion-safe:animate-in fade-in motion-safe:duration-fast overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-3xl rounded-2xl border border-border bg-card shadow-2xl overflow-hidden my-4">
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-border bg-surface-highlight">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <Coins size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 id="denomination-modal-title" className="text-base font-bold text-primary">
                  Currency Denomination Counter & Owner Handover
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  {entry?.shift || 'Daily Shift'}
                </span>
              </div>
              <p className="text-xs text-secondary mt-0.5">Physical note counting tool and transparent owner cash handover sign-off receipt</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-secondary hover:text-primary hover:bg-surface-hover motion-safe:transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex items-center justify-between px-5 pt-3 border-b border-border bg-card">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('counter')}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold border-b-2 motion-safe:transition-colors cursor-pointer ${
                activeTab === 'counter' ? 'border-emerald-500 text-emerald-400 font-bold' : 'border-transparent text-secondary hover:text-primary'
              }`}
            >
              <Coins size={14} />
              <span>Denomination Counter</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('receipt')}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold border-b-2 motion-safe:transition-colors cursor-pointer ${
                activeTab === 'receipt' ? 'border-sky-500 text-sky-400 font-bold' : 'border-transparent text-secondary hover:text-primary'
              }`}
            >
              <Receipt size={14} />
              <span>Owner Handover Receipt</span>
            </button>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyWhatsApp}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 motion-safe:transition-all cursor-pointer"
            >
              {copied ? <Check size={12} /> : <Copy size={12} />}
              <span>{copied ? 'Copied' : 'WhatsApp Summary'}</span>
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6 max-h-[72vh] overflow-y-auto space-y-5">
          {activeTab === 'counter' ? (
            <ManagerAccountsDailySettlementDenominationCounterTab
              counts={counts}
              totalPhysicalCash={totalPhysicalCash}
              expectedCashRupees={expectedCashRupees}
              discrepancy={discrepancy}
              retainedFloat={retainedFloat}
              setRetainedFloat={setRetainedFloat}
              handoverAmount={handoverAmount}
              ownerName={ownerName}
              setOwnerName={setOwnerName}
              managerName={managerName}
              setManagerName={setManagerName}
              onCountChange={handleCountChange}
              onReset={handleReset}
            />
          ) : (
            <ManagerAccountsDailySettlementHandoverReceiptTab
              entry={entry}
              counts={counts}
              totalPhysicalCash={totalPhysicalCash}
              discrepancy={discrepancy}
              handoverAmount={handoverAmount}
              retainedFloat={retainedFloat}
              managerName={managerName}
              ownerName={ownerName}
              onCopyWhatsApp={handleCopyWhatsApp}
              onPrintReceipt={handlePrintReceipt}
            />
          )}
        </div>

        <div className="flex items-center justify-between p-4 sm:p-5 border-t border-border bg-surface-highlight">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-border bg-card text-xs font-semibold text-secondary hover:text-primary hover:bg-surface-hover motion-safe:transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrintReceipt}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border bg-card text-xs font-semibold text-secondary hover:text-primary hover:bg-surface-hover motion-safe:transition-colors cursor-pointer"
            >
              <Printer size={13} />
              <span>Print Slip</span>
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md motion-safe:transition-all cursor-pointer"
            >
              <CheckCircle2 size={14} />
              <span>{`Confirm & Sign-Off Handover (${formatInrRupees(handoverAmount)})`}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManagerAccountsDailySettlementDenominationAndHandoverModal;
