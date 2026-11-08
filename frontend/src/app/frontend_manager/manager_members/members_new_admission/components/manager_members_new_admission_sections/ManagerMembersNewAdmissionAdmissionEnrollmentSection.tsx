'use client';
// RESPONSIBILITY: Render the members new admission admission enrollment section with multi-shift support.
import { useTranslations } from 'next-intl';
import { Armchair, FileText, Layers, Lock, Clock, Check, IndianRupee } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import type { ManagerMembersNewAdmissionAdmissionEnrollmentSectionProps } from '@/app/frontend_manager/manager_members/members_new_admission/types/ManagerMembersNewAdmissionComponentTypes';
import { getLibraryPricingConfig, type LibraryPricingConfig } from '@/lib/pricing/libraryPricingEngine';

export type { ManagerMembersNewAdmissionAdmissionEnrollmentSectionProps };

export function ManagerMembersNewAdmissionAdmissionEnrollmentSection({
  register,
  errors,
  setValue,
  watch,
  selectedShifts: propSelectedShifts,
  onToggleShift: propOnToggleShift,
  watchedShift: propWatchedShift,
}: ManagerMembersNewAdmissionAdmissionEnrollmentSectionProps) {
  const tManagerUi = useTranslations('manager.manager_new_admission.ui');
  const watchedShift = propWatchedShift ?? (watch ? watch('shift') : '');
  const [pricingConfig, setPricingConfig] = useState<LibraryPricingConfig>(() => getLibraryPricingConfig());

  useEffect(() => {
    const handleUpdate = () => setPricingConfig(getLibraryPricingConfig());
    window.addEventListener('library_pricing_updated', handleUpdate);
    return () => window.removeEventListener('library_pricing_updated', handleUpdate);
  }, []);

  // Derive selected shifts directly from react-hook-form watchedShift
  const internalSelectedShifts = useMemo(() => {
    if (!watchedShift) return [];
    if (watchedShift.includes('+')) {
      return watchedShift.split('+').map(s => s.trim().replace(/\(.*\)/, '').trim());
    }
    return [watchedShift.replace(/\(.*\)/, '').trim()].filter(Boolean);
  }, [watchedShift]);

  const selectedShifts = propSelectedShifts ?? internalSelectedShifts;

  const handleToggleShift = (shiftId: string) => {
    if (propOnToggleShift) {
      propOnToggleShift(shiftId);
      return;
    }
    let nextShifts: string[];

    if (shiftId === 'Full Day') {
      nextShifts = selectedShifts.includes('Full Day') ? [] : ['Full Day'];
    } else {
      const filtered = selectedShifts.filter(s => s !== 'Full Day');
      if (filtered.includes(shiftId)) {
        nextShifts = filtered.filter(s => s !== shiftId);
      } else {
        nextShifts = [...filtered, shiftId];
      }
    }

    let consolidated = '';
    if (nextShifts.length === 0) {
      consolidated = '';
    } else {
      consolidated = nextShifts.join(' + ');
    }

    if (setValue) {
      setValue('shift', consolidated, { shouldValidate: true, shouldDirty: true });
    }
  };

  const shiftsToRender = pricingConfig.shifts;
  const currentTotalMonthlyShiftRate = selectedShifts.includes('Full Day')
    ? (pricingConfig.shifts.find(s => s.id === 'Full Day')?.monthlyPrice ?? 1500)
    : selectedShifts.reduce((acc, shiftId) => {
      const found = pricingConfig.shifts.find(s => s.id === shiftId);
      return acc + (found?.monthlyPrice ?? 700);
    }, 0);

  return (
    <section className="mgr-card" aria-labelledby="manager-students-admission-enrollment">
      <div className="mgr-card-header">
        <div className="mgr-section-number">02</div>
        <h2 id="manager-students-admission-enrollment" className="mgr-section-title">{tManagerUi('seat_membership')}</h2>
      </div>
      <div className="mgr-card-body space-y-6">
        {/* Multi-Shift Selection Pills */}
        <div className="space-y-2">
          <label className="mgr-label mgr-label-required flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Clock size={16} className="text-primary" />
              <span>Shift Selection (Multiple Allowed)</span>
            </span>
            <span className="text-xs text-secondary font-normal">
              {selectedShifts.length > 1 ? `Multi-Shift (${selectedShifts.length} selected)` : 'Select one or more shifts'}
            </span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {shiftsToRender.map((shift) => {
              const isSelected = selectedShifts.includes(shift.id);
              return (
                <button
                  type="button"
                  key={shift.id}
                  onClick={() => handleToggleShift(shift.id)}
                  aria-pressed={isSelected}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between motion-safe:transition-all focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 outline-none cursor-pointer ${isSelected
                      ? 'border-primary bg-primary-subtle shadow-sm ring-1 ring-primary'
                      : 'border-border bg-card hover:bg-floating'
                    }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className={`text-sm font-bold ${isSelected ? 'text-primary' : 'text-primary'}`}>
                      {shift.name}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${isSelected ? 'bg-primary text-on-primary' : 'bg-floating text-secondary'
                      }`}>
                      {isSelected ? <Check size={12} className="inline mr-0.5" /> : null}
                      ₹{shift.monthlyPrice}/mo
                    </span>
                  </div>
                  <span className="text-xs text-secondary">{shift.hours}</span>
                </button>
              );
            })}
          </div>

          {selectedShifts.length > 0 && (
            <div className="flex items-center justify-between rounded-lg border border-border bg-card px-3 py-2 text-xs">
              <span className="text-secondary font-medium">
                Selected: <strong className="text-primary">{selectedShifts.join(' + ')}</strong>
                {selectedShifts.length > 1 && !selectedShifts.includes('Full Day') ? (
                  <span className="ml-1 text-success-text font-bold">({pricingConfig.multiShiftDiscountPercent}% Combo Discount Applies)</span>
                ) : null}
              </span>
              <span className="font-bold text-primary flex items-center gap-1">
                <IndianRupee size={12} />
                <span>Base: ₹{currentTotalMonthlyShiftRate} / mo</span>
              </span>
            </div>
          )}

          {/* Hidden or synced shift input for react-hook-form */}
          <input type="hidden" {...register('shift')} />
          {errors.shift && <p className="mgr-error text-danger text-xs mt-1" role="alert">{errors.shift.message}</p>}
        </div>

        <div className="mgr-form-grid">
          {/* Floor Selection */}
          <div className="mgr-form-field">
            <label className="mgr-label" htmlFor="admission-floor">Floor Allotment</label>
            <div className="mgr-input-icon-wrap">
              <Layers size={18} strokeWidth={2} className="mgr-input-icon" />
              <select id="admission-floor" {...register('floor')} className="mgr-select mgr-input-with-icon">
                <option value="">-- Select Floor (Optional) --</option>
                <option value="1">1st Floor (General Study Hall)</option>
                <option value="2">2nd Floor (Silent Zone / AC)</option>
                <option value="3">3rd Floor (Reserved / Dedicated Cabin)</option>
              </select>
            </div>
          </div>

          {/* Seat Number Selection */}
          <div className="mgr-form-field">
            <label className="mgr-label mgr-label-required" htmlFor="admission-seat">{tManagerUi('seat_number')}</label>
            <div className="mgr-input-icon-wrap">
              <Armchair size={18} strokeWidth={2} className="mgr-input-icon" />
              <select id="admission-seat" {...register('seat')} className={`mgr-select mgr-input-with-icon${errors.seat ? ' mgr-input-error' : ''}`} aria-invalid={Boolean(errors.seat)}>
                <option value="">-- Select Available Seat --</option>
                {Array.from({ length: 24 }, (_, i) => {
                  const seatCode = `S-${String(i + 1).padStart(2, '0')}`;
                  return <option key={seatCode} value={seatCode}>{seatCode} (Available)</option>;
                })}
              </select>
            </div>
            {errors.seat && <p className="mgr-error" role="alert">{errors.seat.message}</p>}
          </div>

          {/* Locker Selection */}
          <div className="mgr-form-field">
            <label className="mgr-label" htmlFor="admission-locker">{tManagerUi('locker_optional')}</label>
            <div className="mgr-input-icon-wrap">
              <Lock size={18} strokeWidth={2} className="mgr-input-icon" />
              <select id="admission-locker" {...register('locker')} className="mgr-select mgr-input-with-icon">
                <option value="">No Locker Required</option>
                {Array.from({ length: 12 }, (_, i) => {
                  const lockerCode = `L-${String(i + 1).padStart(2, '0')}`;
                  return <option key={lockerCode} value={lockerCode}>{lockerCode} (Available - ₹200/mo)</option>;
                })}
              </select>
            </div>
          </div>

          {/* Direct Shift Selector Fallback / Confirmation */}
          <div className="mgr-form-field">
            <label className="mgr-label" htmlFor="admission-shift-summary">Consolidated Shift</label>
            <div className="mgr-input-icon-wrap">
              <FileText size={18} strokeWidth={2} className="mgr-input-icon" />
              <input
                id="admission-shift-summary"
                type="text"
                readOnly
                value={watchedShift || 'No shift selected'}
                className="mgr-input mgr-input-with-icon bg-floating cursor-not-allowed text-xs font-semibold"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
