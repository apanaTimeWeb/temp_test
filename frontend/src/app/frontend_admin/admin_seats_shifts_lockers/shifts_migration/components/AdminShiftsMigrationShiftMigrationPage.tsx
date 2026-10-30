// Responsibility: AdminShiftsShiftMigrationPage component owned by admin_shifts; responsibility folder: admin_shifts_components_views.
'use client';
import useShiftMigrationPage from '@/app/frontend_admin/admin_seats_shifts_lockers/shifts_migration/hooks/useAdminShiftsMigrationShiftMigrationPage';
import AdminShiftsShiftMigrationPageView from '@/app/frontend_admin/admin_seats_shifts_lockers/shifts_migration/components/AdminShiftsMigrationShiftMigrationPageView';

// RESPONSIBILITY: Owns orchestration only; the interactive state model is in the module hook and presentation is in the module view.
export function AdminShiftsShiftMigrationPage() {
  const model = useShiftMigrationPage();
  return <AdminShiftsShiftMigrationPageView model={model} />;
}
