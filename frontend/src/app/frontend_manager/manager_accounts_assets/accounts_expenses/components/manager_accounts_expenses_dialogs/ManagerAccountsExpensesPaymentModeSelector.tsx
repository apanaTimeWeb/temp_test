'use client';

import type { ManagerAccountsExpensesAddExpenseModalFormData } from '@/app/frontend_manager/manager_accounts_assets/accounts_expenses/schemas/ManagerAccountsExpensesExpenseDraftSchema';
import { Building, CreditCard, Smartphone, Wallet } from 'lucide-react';
import type { UseFormSetValue } from 'react-hook-form';

const PAYMENT_MODES = [
  { id: 'cash' as const, label: 'Cash (Counter)', icon: Wallet, activeClass: 'mex-mode-cash-active' },
  { id: 'upi' as const, label: 'UPI / QR', icon: Smartphone, activeClass: 'mex-mode-upi-active' },
  { id: 'card' as const, label: 'Card (POS)', icon: CreditCard, activeClass: 'mex-mode-card-active' },
  { id: 'bank' as const, label: 'Bank Transfer', icon: Building, activeClass: 'mex-mode-bank-active' },
];

interface ManagerAccountsExpensesPaymentModeSelectorProps {
  selectedMode: ManagerAccountsExpensesAddExpenseModalFormData['mode'];
  selectedSource: string;
  setValue: UseFormSetValue<ManagerAccountsExpensesAddExpenseModalFormData>;
}

export function ManagerAccountsExpensesPaymentModeSelector({
  selectedMode,
  selectedSource,
  setValue,
}: ManagerAccountsExpensesPaymentModeSelectorProps) {
  return (
    <>
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-semibold text-secondary">
            Expense Fund Source <span className="text-destructive">*</span>
          </label>
          <span className="text-[11px] text-secondary">Separates counter cash float from bank</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => {
              setValue('source', 'petty_cash');
              if (selectedMode !== 'cash') setValue('mode', 'cash');
            }}
            className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-semibold motion-safe:transition-all cursor-pointer text-left ${
              selectedSource === 'petty_cash'
                ? 'border-emerald-500/50 bg-emerald-500/15 text-emerald-400 shadow-sm'
                : 'border-border bg-surface-highlight text-secondary hover:text-primary hover:bg-surface-hover'
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Wallet size={16} />
            </div>
            <div>
              <p className="font-bold">Petty Cash Float</p>
              <p className="text-[10px] opacity-80">Counter cash drawer spend</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              setValue('source', 'bank_direct');
              if (selectedMode === 'cash') setValue('mode', 'bank');
            }}
            className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-semibold motion-safe:transition-all cursor-pointer text-left ${
              selectedSource === 'bank_direct'
                ? 'border-sky-500/50 bg-sky-500/15 text-sky-400 shadow-sm'
                : 'border-border bg-surface-highlight text-secondary hover:text-primary hover:bg-surface-hover'
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
              <Building size={16} />
            </div>
            <div>
              <p className="font-bold">Bank / Owner Account</p>
              <p className="text-[10px] opacity-80">Direct bank/UPI/Owner outflow</p>
            </div>
          </button>
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-secondary block mb-1.5">
          Payment Mode <span className="text-destructive">*</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {PAYMENT_MODES.map((mode) => {
            const Icon = mode.icon;
            const isSelected = selectedMode === mode.id;
            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => {
                  setValue('mode', mode.id, { shouldValidate: true });
                  setValue('source', mode.id === 'cash' ? 'petty_cash' : 'bank_direct');
                }}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-semibold motion-safe:transition-all cursor-pointer ${
                  isSelected
                    ? `${mode.activeClass} font-bold`
                    : 'bg-surface-highlight text-secondary hover:text-primary hover:bg-surface-hover border-border'
                }`}
              >
                <Icon size={16} className="mb-1" />
                <span>{mode.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
