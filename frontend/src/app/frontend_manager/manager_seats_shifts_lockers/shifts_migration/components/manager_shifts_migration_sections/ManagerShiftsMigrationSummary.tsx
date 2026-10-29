// RESPONSIBILITY: Render the shifts migration summary section of the components feature. It does not own backend persistence or cross-feature business logic.
import { useTranslations } from 'next-intl';
import type { ManagerShiftsMigrationSummaryProps } from '@/app/frontend_manager/manager_seats_shifts_lockers/shifts_migration/types/ManagerShiftsMigrationTypes';

export function ManagerShiftsMigrationSummary({ student, daysLeft, newShift, newSeat, showCustomSlot, customStart, customEnd }: ManagerShiftsMigrationSummaryProps) {
  const tManagerUi = useTranslations('manager.manager_shift_migration.ui');
  const shiftLabel = (value: string) => ({ Morning: tManagerUi('morning'), Afternoon: tManagerUi('afternoon'), Evening: tManagerUi('evening'), Night: tManagerUi('night'), 'Full Day': tManagerUi('full_day') } as Record<string, string>)[value] ?? value;
  const details = [
    { id: 'current-shift', label: tManagerUi('migration_summary_current_shift'), value: shiftLabel(student.currentShift) },
    { id: 'current-seat', label: tManagerUi('migration_summary_current_seat'), value: student.currentSeat },
    { id: 'valid-till', label: tManagerUi('migration_summary_valid_till'), value: student.validTill },
    { id: 'days-left', label: tManagerUi('migration_summary_days_left'), value: `${daysLeft} ${tManagerUi('day_unit')}` },
    ...(newShift ? [{ id: 'new-shift', label: tManagerUi('migration_summary_new_shift'), value: shiftLabel(newShift) }] : []),
    ...(newSeat ? [{ id: 'new-seat', label: tManagerUi('migration_summary_new_seat'), value: newSeat }] : []),
    ...(showCustomSlot && customStart && customEnd ? [{ id: 'custom-slot', label: tManagerUi('migration_summary_custom_slot'), value: `${customStart} – ${customEnd}` }] : []),
  ];
  return (
    <div className="ss-migration-aside">
      <div className="ss-profile-card">
        <h4 className="ss-profile-card__name">{student.name}</h4>
        <p className="ss-profile-card__id">{student.smartId}</p>
        <div className="ss-profile-card__details">
          {details.map(({ id, label, value }) => (
            <div key={id} className="ss-profile-detail"><p className="ss-profile-detail__label">{label}</p><p className="ss-profile-detail__value">{value}</p></div>
          ))}
        </div>
      </div>
    </div>
  );
}
