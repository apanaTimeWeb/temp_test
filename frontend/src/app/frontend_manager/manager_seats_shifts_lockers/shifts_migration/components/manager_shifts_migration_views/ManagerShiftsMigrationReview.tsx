'use client';
// RESPONSIBILITY: Render the shifts migration review component within the components feature. It does not own backend persistence or cross-feature business logic.
import { useTranslations } from 'next-intl';

import { useManagerSeatsCurrencyFormatter } from '@/app/frontend_manager/manager_seats_shifts_lockers/shifts_migration/hooks/ManagerShiftsMigrationFormattingHook';

import { Calculator, Banknote, QrCode, CreditCard } from 'lucide-react';
import type { ManagerShiftsMigrationPayMode, ManagerShiftsMigrationReviewProps } from '@/app/frontend_manager/manager_seats_shifts_lockers/shifts_migration/types/ManagerShiftsMigrationTypes';

export function ManagerShiftsMigrationReview({ oldRate, newRate, daysLeft, adjustment, isPaying, payMode, txnId, remark, onPayModeChange, onTxnIdChange, onRemarkChange }: ManagerShiftsMigrationReviewProps) {
  const tManagerUi = useTranslations('manager.manager_shift_migration.ui');
  const formatManagerSeatsCurrency = useManagerSeatsCurrencyFormatter();
  return (
<>
                <div className="ss-card">
                  <h3 className="ss-card-section-heading">
                    <Calculator size={18} className="ss-text-primary-brand" />
                    {tManagerUi('fee_adjustment')}
                  </h3>
                  <div className="ss-reconcile-list">
                    <div className="ss-reconcile-row">
                      <span className="ss-reconcile-row__label">{tManagerUi('old_rate')}</span>
                      <span className="ss-reconcile-row__value ss-text-mono">{formatManagerSeatsCurrency(oldRate)}{tManagerUi('day_9613df')}</span>
                    </div>
                    <div className="ss-reconcile-row">
                      <span className="ss-reconcile-row__label">{tManagerUi('new_rate')}</span>
                      <span className="ss-reconcile-row__value ss-text-mono">{formatManagerSeatsCurrency(newRate)}{tManagerUi('day_9613df')}</span>
                    </div>
                    <div className="ss-reconcile-row">
                      <span className="ss-reconcile-row__label">{tManagerUi('days_remaining')}</span>
                      <span className="ss-reconcile-row__value ss-text-mono">{daysLeft} {tManagerUi('days')}</span>
                    </div>
                    <div className="ss-divider" />
                    <div className="ss-reconcile-total">
                      <span className="ss-reconcile-total__label">{tManagerUi('fee_adjustment')}</span>
                      <span className={`ss-reconcile-total__value ${isPaying ? 'ss-text-danger' : 'ss-text-success'}`}>
                        {isPaying ? '+ ' : ''}{formatManagerSeatsCurrency(Math.abs(adjustment))}
                      </span>
                    </div>
                  </div>
                  <div className="ss-info-box ss-info-box--mt">
                    <p
                      className="ss-info-box__desc"
                      role="status"
                      data-testid="manager-shift-migration-sample-fee-disclosure"
                    >
                      {tManagerUi('sample_fee_preview_only_no_payment_or_refund_action_available')}
                    </p>
                  </div>
                </div>

                {isPaying && (
                  <div className="ss-card">
                    <h3 className="ss-card-section-heading">{tManagerUi('payment')}</h3>
                    <div className="ss-payment-grid">
                      {(['Cash', 'UPI', 'Card'] as ManagerShiftsMigrationPayMode[]).map(m => (
                        <button type="button"
                          key={m}
                          aria-pressed={payMode === m}
                          onClick={() => onPayModeChange(m)}
                          className={`ss-toolkit-btn ss-btn--pad ${payMode === m ? 'ss-btn-primary' : 'ss-btn-ghost'}`}
                        >
                          {m === 'Cash' ? <Banknote size={15} aria-hidden="true" /> : m === 'UPI' ? <QrCode size={15} aria-hidden="true" /> : <CreditCard size={15} aria-hidden="true" />}
                          {m === 'Cash' ? tManagerUi('cash') : m === 'UPI' ? tManagerUi('upi') : tManagerUi('card')}
                        </button>
                      ))}
                    </div>
                    {payMode !== 'Cash' && (
                      <div className="ss-form-field ss-info-box--mt">
                        <label className="ss-label" htmlFor="rbg4-managerseatsshiftslockersshiftmigrationreview-70">{tManagerUi('transaction_id')}</label>
                        <input id="rbg4-managerseatsshiftslockersshiftmigrationreview-70" className="ss-input ss-input--no-icon" placeholder={tManagerUi('enter_transaction_reference')} value={txnId} onChange={e => onTxnIdChange(e.target.value)} />
                      </div>
                    )}
                  </div>
                )}

                <div className="ss-card">
                  <label className="ss-label" htmlFor="rbg4-managerseatsshiftslockersshiftmigrationreview-78">{tManagerUi('remark_optional')}</label>
                  <textarea id="rbg4-managerseatsshiftslockersshiftmigrationreview-78" className="ss-textarea" rows={2} placeholder={tManagerUi('any_notes_about_this_migration')} value={remark} onChange={e => onRemarkChange(e.target.value)} />
                </div>
              </>
  );
}
