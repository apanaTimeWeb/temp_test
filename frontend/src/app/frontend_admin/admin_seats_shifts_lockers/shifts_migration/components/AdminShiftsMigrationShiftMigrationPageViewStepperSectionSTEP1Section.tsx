// RESPONSIBILITY: AdminShiftsShiftMigrationPageViewStepperSectionSTEP1Section component owned by admin_shifts; responsibility folder: admin_shifts_shift_migration_page_view_stepper_section_sections.
'use client';

import { useTranslations } from 'next-intl';
import { Banknote, CheckCircle, ChevronDown, Clock, CreditCard, QrCode, Search } from 'lucide-react';
import useAdminShiftsShiftMigrationPage from '@/app/frontend_admin/admin_seats_shifts_lockers/shifts_migration/hooks/useAdminShiftsMigrationShiftMigrationPage';
import type { PayMode, AdminShiftsShiftMigrationPageViewStepperSectionSTEP1SectionProps } from '@/app/frontend_admin/admin_seats_shifts_lockers/shifts_migration/types/AdminShiftsMigrationComponentTypes';


const PAY_MODE_TRANSLATION_KEYS: Record<PayMode, string> = { Cash: 'paymentModeCash', UPI: 'paymentModeUpi', Card: 'paymentModeCard' };

export default function AdminShiftsShiftMigrationPageViewStepperSectionSTEP1Section({ model }: AdminShiftsShiftMigrationPageViewStepperSectionSTEP1SectionProps) {
  const t = useTranslations('ADMIN_SHIFTS');
  const { STUDENTS, SHIFTS, daysRemaining, step, setStep, search, setSearch, selectedStudent, setSelectedStudent, newShift, setNewShift, newSeat, setNewSeat, showCustomSlot, setShowCustomSlot, customStart, setCustomStart, customEnd, setCustomEnd, payMode, setPayMode, txnId, setTxnId, remark, setRemark, showConfirm, setShowConfirm, filteredStudents, daysLeft, selectedShiftData, newRate, oldRate, adjustment, isPaying, handleConfirmMigration, STEPS } = model;
  return <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(16rem,1fr)]">
          <div className="min-w-0 space-y-5">

            {/* ── STEP 1 ── */}
            {step === 1 && (
              <div className="min-w-0 rounded-xl border border-border bg-card">
                <h3 className="text-sm font-semibold text-text-primary">
                  <Search size={18} className="text-primary"  strokeWidth={2}/>{t('selectStudent')}</h3>
                <div className="relative min-w-0 flex-1">
                  <Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"  strokeWidth={2}/>
                  <input
                    className="min-h-11 w-full rounded-md border border-border bg-input px-3 py-2 pl-10 text-text-primary placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-60"
                    aria-label={t('searchSmartIdAria')}
                    placeholder={t('searchSmartId')}
                    value={search}
                    onChange={e => { setSearch(e.target.value); setSelectedStudent(null); }}
                  />
                </div>
                {search && (
                  <div className="min-w-0 space-y-2">
                    {filteredStudents.length === 0 ? (
                      <p className="text-text-secondary text-xs">{t('noStudentsFound')}</p>
                    ) : filteredStudents.map(s => (
                      <button data-testid="admin_shifts-AdminShiftsShiftMigrationPageViewStepperSectionSTEP1Section-control-001"
                        key={s.id}
                        className={`min-w-0 rounded-lg border border-border bg-card p-3${selectedStudent?.id === s.id ? ' min-w-0 rounded-lg border border-border bg-card p-3' : ''}`}
                        onClick={() => {
                          setSelectedStudent(s);
                          setNewShift('');
                          setNewSeat('');
                        }}
                      >
                        <p className="flex min-w-0 items-center gap-2">{s.name}</p>
                        <p className="block text-xs text-text-secondary">{s.smartId} · {s.currentShift}</p>
                      </button>
                    ))}
                  </div>
                )}
                {selectedStudent && (
                  <div className="rounded-lg border border-info-text bg-info-bg p-4 text-info-text mt-4">
                    <div>
                      <p className="font-semibold text-text-primary">{t('currentDetails', { name: selectedStudent.name })}</p>
                      <p className="mt-1 text-sm text-text-secondary">
                        {t('currentDetailsShift')} <strong>{selectedStudent.currentShift}</strong> · {t('seatLabel')} <strong>{selectedStudent.currentSeat}</strong> · {t('validTill')} <strong>{selectedStudent.validTill}</strong> · {t('planLabel')} <strong>{selectedStudent.plan}</strong> · {t('daysLeftLabel')} <strong>{daysLeft}</strong>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── STEP 2 ── */}
            {step === 2 && (
              <div className="min-w-0 rounded-xl border border-border bg-card">
                <h3 className="text-sm font-semibold text-text-primary">
                  <ChevronDown size={18} className="text-primary"  strokeWidth={2}/>{t('newSlot')}</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label htmlFor="migration-new-shift" className="mb-1 block text-sm font-medium text-text-secondary text-danger-text">{t('newShift')}<span className="text-danger-text">*</span></label>
                    <div className="relative min-w-0">
                      <select id="migration-new-shift" data-testid="admin_shifts-migration-new-shift" className="min-h-11 w-full appearance-none rounded-md border border-border bg-input px-3 py-2 pr-9 text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-60" value={newShift} onChange={e => { setNewShift(e.target.value); setNewSeat(''); }}>
                        <option value="">{t('selectShift')}</option>
                        {SHIFTS.map(s => (
                          <option key={s.name} value={s.name}>{s.name} ({t('seatsFree', { count: s.seats })})</option>
                        ))}
                      </select>
                      <ChevronDown size={18} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary"  strokeWidth={2}/>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="migration-new-seat" className="mb-1 block text-sm font-medium text-text-secondary text-danger-text">{t('newSeat')}<span className="text-danger-text">*</span></label>
                    <div className="relative min-w-0">
                      <select id="migration-new-seat" data-testid="admin_shifts-migration-new-seat" className="min-h-11 w-full appearance-none rounded-md border border-border bg-input px-3 py-2 pr-9 text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-60" value={newSeat} onChange={e => setNewSeat(e.target.value)} disabled={!newShift}>
                        <option value="">{t('selectSeat')}</option>
                        {newShift && model.newShiftSeats.filter(seat => !(selectedStudent && newShift === selectedStudent.currentShift && seat === selectedStudent.currentSeat)).map(seat => (
                          <option key={seat} value={seat}>{seat}</option>
                        ))}
                      </select>
                      <ChevronDown size={18} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary"  strokeWidth={2}/>
                    </div>
                  </div>
                </div>

                {/* Optional Custom Slot */}
                <div className="flex min-h-11 items-center gap-3 rounded-lg border border-border p-3">
                  <button data-testid="admin_shifts-AdminShiftsShiftMigrationPageViewStepperSectionSTEP1Section-control-004"
                    className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-border bg-card px-3 py-2 font-medium text-primary motion-safe:transition-colors motion-safe:duration-base hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 text-sm min-w-0 rounded-lg p-3`}
                    onClick={() => setShowCustomSlot(v => !v)}
                  >
                    <Clock size={18}  strokeWidth={2}/>
                    {showCustomSlot ? t('removeCustomSlot') : t('addCustomSlot')}
                  </button>
                </div>
                {showCustomSlot && (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 gap-3 sm:grid-cols-2">
                    <div>
                      <label htmlFor="migration-custom-start" className="mb-1 block text-sm font-medium text-text-secondary">{t('customStart')}</label>
                      <input id="migration-custom-start" type="time" className="min-h-11 w-full rounded-md border border-border bg-input px-3 py-2 pl-10 text-text-primary placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-60" value={customStart} onChange={e => setCustomStart(e.target.value)} />
                    </div>
                    <div>
                      <label htmlFor="migration-custom-end" className="mb-1 block text-sm font-medium text-text-secondary">{t('customEnd')}</label>
                      <input id="migration-custom-end" type="time" className="min-h-11 w-full rounded-md border border-border bg-input px-3 py-2 pl-10 text-text-primary placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-60" value={customEnd} onChange={e => setCustomEnd(e.target.value)} min={customStart || undefined} />
                    </div>
                  </div>
                )}

                {newShift && <p className="text-xs text-text-secondary mt-2" role="note">{t('migrationSeatChoicesDemoNotice')}</p>}
                {newShift && (
                  <div className="rounded-lg border border-info-text bg-info-bg p-4 text-info-text mt-4">
                    <div>
                      <p className="font-semibold text-text-primary">{t('availability')}</p>
                      <p className="mt-1 text-sm text-text-secondary">
                        {t('shiftAvailabilityRate', { seats: selectedShiftData?.seats ?? 0, shift: newShift, rate: newRate })} 
                        {showCustomSlot && customStart && customEnd && (
                          <> {t('customSlotPreview')} <strong>{customStart} – {customEnd}</strong>.</>
                        )}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── STEP 3 ── */}
            {step === 3 && (
              <>
                <div className="min-w-0 rounded-xl border border-border bg-card">
                  <h3 className="text-sm font-semibold text-text-primary">
                    <CheckCircle size={18} className="text-primary"  strokeWidth={2}/>{t('feeAdjustment')}</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-3 rounded-md border border-border p-3">
                      <span className="text-sm text-text-secondary">{t('oldRate')}</span>
                      <span className="text-sm font-semibold tabular-nums text-primary font-mono text-xs">{t('ratePerDay', { rate: oldRate })}</span>
                    </div>
                    <div className="flex items-center justify-between gap-3 rounded-md border border-border p-3">
                      <span className="text-sm text-text-secondary">{t('newRate')}</span>
                      <span className="text-sm font-semibold tabular-nums text-primary font-mono text-xs">{t('ratePerDay', { rate: newRate })}</span>
                    </div>
                    <div className="flex items-center justify-between gap-3 rounded-md border border-border p-3">
                      <span className="text-sm text-text-secondary">{t('daysRemaining')}</span>
                      <span className="text-sm font-semibold tabular-nums text-primary font-mono text-xs">{t('daysCount', { count: daysLeft })}</span>
                    </div>
                    <div className="my-4 h-px w-full bg-surface-highlight" />
                    <div className="flex items-center justify-between gap-3 rounded-lg bg-surface-highlight p-4">
                      <span className="font-semibold text-primary">{t('feeAdjustment')}</span>
                      <span className={`text-lg font-bold tabular-nums text-primary ${isPaying ? 'text-danger-text' : 'text-success-text'}`}>
                        {isPaying ? '+' : ''}₹{Math.abs(adjustment)}
                      </span>
                    </div>
                  </div>
                  <div className="rounded-lg border border-info-text bg-info-bg p-4 text-info-text mt-4">
                    <div>
                      <p className="mt-1 text-sm text-text-secondary">
                        {isPaying
                          ? t('studentPaysMore', { amount: adjustment })
                          : adjustment < 0
                            ? t('refundStudent', { amount: Math.abs(adjustment) })
                            : t('noFeeAdjustment')}
                      </p>
                    </div>
                  </div>
                </div>

                {isPaying && (
                  <div className="min-w-0 rounded-xl border border-border bg-card">
                    <h3 className="text-sm font-semibold text-text-primary">{t('payment')}</h3>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3" role="group" aria-label={t('paymentMode')}>
                      {(['Cash', 'UPI', 'Card'] as PayMode[]).map(m => (
                        <button data-testid={`admin_shifts-migration-payment-${m.toLowerCase()}`}
                          key={m}
                          type="button"
                          aria-pressed={payMode === m}
                          onClick={() => setPayMode(m)}
                          className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 font-medium text-on-primary hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 ${payMode === m ? 'inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 font-medium text-on-primary motion-safe:transition-colors motion-safe:duration-base hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50' : 'inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-border bg-card px-3 py-2 font-medium text-primary motion-safe:transition-colors motion-safe:duration-base hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50'}`}
                        >
                          {m === 'Cash' ? <Banknote size={18}  strokeWidth={2}/> : m === 'UPI' ? <QrCode size={18}  strokeWidth={2}/> : <CreditCard size={18}  strokeWidth={2}/>}
                          {t(PAY_MODE_TRANSLATION_KEYS[m])}
                        </button>
                      ))}
                    </div>
                    {payMode !== 'Cash' && (
                      <div className="flex min-w-0 flex-col gap-2 mt-4">
                        <label htmlFor="migration-transaction-id" className="mb-1 block text-sm font-medium text-text-secondary">{t('transactionId')}</label>
                        <input id="migration-transaction-id" className="min-h-11 w-full rounded-md border border-border bg-input px-3 py-2 pl-10 text-text-primary placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-60" placeholder={t('transactionReference')} value={txnId} onChange={e => setTxnId(e.target.value)} />
                      </div>
                    )}
                  </div>
                )}

                <div className="min-w-0 rounded-xl border border-border bg-card">
                  <label htmlFor="migration-remark" className="mb-1 block text-sm font-medium text-text-secondary">{t('remarkOptional')}</label>
                  <textarea id="migration-remark" className="min-h-11 w-full rounded-md border border-border bg-input px-3 py-2 text-text-primary placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-60" rows={2} placeholder={t('migrationNotes')} value={remark} onChange={e => setRemark(e.target.value)} />
                </div>
              </>
            )}

          </div>

          {/* Sidebar summary */}
          {selectedStudent && (
            <div className="min-w-0 space-y-4">
              <div className="rounded-xl border border-border bg-card p-4">
                <h4 className="text-lg font-semibold text-text-primary">{selectedStudent.name}</h4>
                <p className="font-mono text-xs text-text-secondary">{selectedStudent.smartId}</p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {[
                    { label: 'Current Shift', value: selectedStudent.currentShift },
                    { label: 'Current Seat',  value: selectedStudent.currentSeat  },
                    { label: 'Valid Till',     value: selectedStudent.validTill    },
                    { label: 'Days Left',      value: `${daysLeft} days`           },
                    ...(newShift ? [{ label: 'New Shift', value: newShift }] : []),
                    ...(newSeat  ? [{ label: 'New Seat',  value: newSeat  }] : []),
                    ...(showCustomSlot && customStart && customEnd ? [{ label: 'Custom Slot', value: `${customStart} – ${customEnd}` }] : []),
                  ].map(({ label, value }) => (
                    <div key={label} className="rounded-lg border border-border bg-card p-3">
                      <p className="text-xs font-medium text-text-secondary">{label}</p>
                      <p className="mt-1 break-words text-sm font-medium text-text-primary">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>;
}


export type { AdminShiftsShiftMigrationPageViewStepperSectionSTEP1SectionProps };
