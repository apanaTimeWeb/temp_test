'use client';
// RESPONSIBILITY: Render the finance collect fee receipt preview component within the components feature. It does not own backend persistence or cross-feature business logic.
import { useTranslations } from 'next-intl';

import { maskManagerCollectFeePhone } from '@/app/frontend_manager/manager_finance/finance_collect_fee/utils/ManagerFinanceCollectFeeUtilities';
import { useManagerCollectFeeFormatting } from '@/app/frontend_manager/manager_finance/finance_collect_fee/hooks/ManagerFinanceCollectFeeFormattingHook';
import { AlertCircle, BookOpen, CheckCircle, X } from 'lucide-react';
import type { ManagerFinanceCollectFeeReceiptPreviewProps } from '@/app/frontend_manager/manager_finance/finance_collect_fee/types/ManagerFinanceCollectFeeTypes';


export function ManagerFinanceCollectFeeReceiptPreview({ selectedStudent, mode, modeLabels, amount, total, isSubmitting, isCollectAvailable, receiptNumber, onCollect, onCancel }: ManagerFinanceCollectFeeReceiptPreviewProps) {
  const tManagerUi = useTranslations('manager.manager_collect_fee.ui');
  const { formatCurrency, toMinorUnits, formatDate } = useManagerCollectFeeFormatting();
  return (
<div className="lg:col-span-2">
            <div className="fin-receipt-preview" data-testid="manager-finance-collect-preview">
              <div className="fin-receipt-thermal">
                <div className="fin-receipt-zigzag fin-receipt-zigzag--top">
                  {Array.from({ length: 20 }, (_, i) => `receipt-top-tooth-${i + 1}`).map((dotId) => <div key={dotId} className="fin-receipt-zigzag-dot" />)}
                </div>
                <div className="fin-receipt-body">
                  <div className="fin-receipt-logo-circle"><BookOpen size={28} className="fin-receipt-accent-icon" /></div>
                  <p className="fin-receipt-brand">{tManagerUi('library_os')}</p>
                  <p className="fin-receipt-title">{tManagerUi('receipt_preview_only')}</p>
                  <p className="fin-input-hint fin-text-warning" data-testid="manager-finance-receipt-preview-disclaimer" role="status">{tManagerUi('receipt_preview_not_proof_of_payment')}</p>
                  <div className="fin-receipt-id-box mt-6">
                    <p className="fin-receipt-id-label">{tManagerUi('receipt_number_37553f')}</p>
                    <p className="fin-receipt-id-value">{receiptNumber}</p>
                  </div>
                  <div className="space-y-3 text-left mb-6">
                    {[
                      { label: tManagerUi('date'), value: formatDate(new Date().toISOString()) },
                      { label: tManagerUi('student'), value: selectedStudent?.name || '—' },
                      { label: tManagerUi('smart_id'), value: selectedStudent?.smartId || '—' },
                      { label: tManagerUi('phone_label'), value: selectedStudent ? `+91-${maskManagerCollectFeePhone(selectedStudent.phone)}` : '—' },
                      { label: tManagerUi('payment_mode_23b35c'), value: modeLabels[mode] },
                    ].map((row) => (
                      <div key={row.label} className="flex justify-between">
                        <span className="fin-receipt-row-label">{row.label}</span>
                        <span className="fin-receipt-row-value">{row.value}</span>
                      </div>
                    ))}
                  </div>
                  <div className="fin-receipt-dashed-line">
                    <p className="fin-receipt-total-label">{tManagerUi('total_amount')}</p>
                    <p className="fin-receipt-total-amount">{total > 0 ? formatCurrency(toMinorUnits(total)) : formatCurrency(0)}</p>
                  </div>
                  <button type="button"
                    className={`fin-receipt-paid-badge w-full border-0 motion-safe:transition-all motion-safe:duration-base ${(!isCollectAvailable || !selectedStudent || !amount || parseFloat(amount) <= 0 || isSubmitting) ? 'fin-receipt-paid-badge--disabled cursor-not-allowed' : 'bg-success text-on-success cursor-pointer'}`}
                    data-testid="manager-finance-collect-submit"
                    onClick={onCollect}
                    disabled={!isCollectAvailable || !selectedStudent || !amount || parseFloat(amount) <= 0 || isSubmitting}
                  >
                    {isCollectAvailable ? <CheckCircle size={16} className={(!selectedStudent || !amount || parseFloat(amount) <= 0 || isSubmitting) ? 'text-secondary' : 'text-on-success'} /> : <AlertCircle size={16} className="text-secondary" />}
                    <span className={`fin-receipt-paid-text ${(!isCollectAvailable || !selectedStudent || !amount || parseFloat(amount) <= 0 || isSubmitting) ? 'text-secondary' : 'text-on-success'}`}>
                      {isSubmitting ? tManagerUi('processing_272bc0') : isCollectAvailable ? tManagerUi('received_by_manager') : tManagerUi('collection_unavailable')}
                    </span>
                  </button>
                  <p className="fin-input-hint fin-text-warning" role="status">{tManagerUi('payment_collection_is_disabled_until_a_verified_backend_42f394')}</p>
                  <p className="fin-receipt-footer-quote">{tManagerUi('knowledge_is_the_best_investment')}</p>
                  <p className="fin-receipt-footer-thanks">{tManagerUi('thank_you_see_you_again')}</p>
                </div>
                <div className="fin-receipt-zigzag fin-receipt-zigzag--bottom">
                  {Array.from({ length: 20 }, (_, i) => `receipt-bottom-tooth-${i + 1}`).map((dotId) => <div key={dotId} className="fin-receipt-zigzag-dot" />)}
                </div>
              </div>
              <div className="space-y-3 mt-4">
                <button type="button" className="fin-receipt-btn-secondary flex items-center justify-center gap-2 w-full" onClick={onCancel}><X size={16} /> {tManagerUi('cancel')}</button>
              </div>
            </div>
          </div>
  );
}
