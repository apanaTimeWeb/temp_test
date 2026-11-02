'use client';
// RESPONSIBILITY: Render the members new admission admission enrollment section with multi-shift support.
import { useTranslations } from 'next-intl';
import { Armchair, FileText, Layers, Lock, Clock, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { ManagerMembersNewAdmissionAdmissionEnrollmentSectionProps } from '@/app/frontend_manager/manager_members/members_new_admission/types/ManagerMembersNewAdmissionComponentTypes';

export type { ManagerMembersNewAdmissionAdmissionEnrollmentSectionProps };

interface ShiftOption {
  id: string;
  name: string;
  hours: string;
  badge: string;
}

const SHIFT_OPTIONS: ShiftOption[] = [
  { id: 'Morning', name: 'Morning Shift', hours: '06:00 AM – 02:00 PM', badge: '8 Hrs' },
  { id: 'Evening', name: 'Evening Shift', hours: '02:00 PM – 10:00 PM', badge: '8 Hrs' },
  { id: 'Night', name: 'Night Shift', hours: '10:00 PM – 06:00 AM', badge: '8 Hrs' },
  { id: 'Full Day', name: 'Full Day Access', hours: '06:00 AM – 10:00 PM', badge: '16 Hrs' },
];

export function ManagerMembersNewAdmissionAdmissionEnrollmentSection({
  register,
  errors,
  setValue,
  watch,
}: ManagerMembersNewAdmissionAdmissionEnrollmentSectionProps) {
  const tManagerUi = useTranslations('manager.manager_new_admission.ui');
  const watchedShift = watch ? watch('shift') : '';

  // Multi-shift toggle state
  const [selectedShifts, setSelectedShifts] = useState<string[]>(() => {
    if (!watchedShift) return [];
    if (watchedShift.includes('+')) {
      return watchedShift.split('+').map(s => s.trim().replace(/\(.*\)/, '').trim());
    }
    return [watchedShift];
  });

  const handleToggleShift = (shiftId: string) => {
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

    setSelectedShifts(nextShifts);

    // Format consolidated string for form submission
    let consolidated = '';
    if (nextShifts.length === 0) {
      consolidated = '';
    } else if (nextShifts.length === 1) {
      consolidated = nextShifts[0];
    } else {
      consolidated = `${nextShifts.join(' + ')} (Multi-Shift)`;
    }

    if (setValue) {
      setValue('shift', consolidated, { shouldValidate: true, shouldDirty: true });
    }
  };

  useEffect(() => {
    if (watchedShift && !selectedShifts.length) {
      if (watchedShift.includes('+')) {
        setSelectedShifts(watchedShift.split('+').map(s => s.trim().replace(/\(.*\)/, '').trim()));
      } else {
        setSelectedShifts([watchedShift]);
      }
    }
  }, [watchedShift, selectedShifts.length]);

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
            {SHIFT_OPTIONS.map((shift) => {
              const isSelected = selectedShifts.includes(shift.id);
              return (
                <button
                  type="button"
                  key={shift.id}
                  onClick={() => handleToggleShift(shift.id)}
                  aria-pressed={isSelected}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between motion-safe:transition-all ${
                    isSelected
                      ? 'border-primary bg-primary/10 shadow-sm ring-1 ring-primary'
                      : 'border-border bg-card hover:bg-floating'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className={`text-sm font-bold ${isSelected ? 'text-primary' : 'text-primary'}`}>
                      {shift.name}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                      isSelected ? 'bg-primary text-on-primary' : 'bg-floating text-secondary'
                    }`}>
                      {isSelected ? <Check size={12} className="inline mr-0.5" /> : null}
                      {shift.badge}
                    </span>
                  </div>
                  <span className="text-xs text-secondary">{shift.hours}</span>
                </button>
              );
            })}
          </div>

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
