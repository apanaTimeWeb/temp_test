'use client';
// DATA FLOW: shifts_migration route/container -> this hook or store -> owning module components; state and query updates return through explicit typed callbacks.
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AdminShiftsMigrationSchema, type AdminShiftsMigrationFormValues } from '@/app/frontend_admin/admin_seats_shifts_lockers/shifts_migration/schemas/AdminShiftsMigrationSchema';
import { ADMIN_SHIFTS_MIGRATION_DEMO_SEATS, ADMIN_SHIFTS_MIGRATION_DEMO_SHIFTS, ADMIN_SHIFTS_MIGRATION_DEMO_STUDENTS, type AdminShiftsMigrationStudent } from '@/app/frontend_admin/admin_seats_shifts_lockers/shifts_migration/mocks/scenarios/admin_shifts_migration.scenarios';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { isFrontendDemoModeEnabled } from '@/app/frontend_admin/lib/runtimeFeatures';
import type { Student, PayMode } from '@/app/frontend_admin/admin_seats_shifts_lockers/shifts_migration/types/AdminShiftsMigrationComponentTypes';


function daysRemaining(validTill: string): number {
  const [year, month, day] = validTill.split('-').map(Number);
  if (!year || !month || !day) return 0;
  const today = new Date();
  const todayUtcDay = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  const expiryUtcDay = Date.UTC(year, month - 1, day);
  return Math.max(0, Math.round((expiryUtcDay - todayUtcDay) / 86_400_000));
}

export default function useAdminShiftsShiftMigrationPage() {
  const t = useTranslations('ADMIN_SHIFTS');
  const isDemoMode = isFrontendDemoModeEnabled();
  const [step, setStep] = useState(1);
  const [search, setSearch]                     = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  useEffect(() => {
    const timeoutId = window.setTimeout(() => setDebouncedSearch(search), 300);
    return () => window.clearTimeout(timeoutId);
  }, [search]);
  const [selectedStudent, setSelectedStudent]   = useState<Student | null>(null);
  const [newShift, setNewShiftState] = useState('');
  const [newSeat, setNewSeatState] = useState('');
  const [showCustomSlot, setShowCustomSlotState] = useState(false);
  const [customStart, setCustomStartState] = useState('');
  const [customEnd, setCustomEndState] = useState('');
  const [payMode, setPayModeState] = useState<PayMode>('Cash');
  const [txnId, setTxnIdState] = useState('');
  const [migrationValidationMessage, setMigrationValidationMessage] = useState('');
  const migrationForm = useForm<AdminShiftsMigrationFormValues>({ resolver: zodResolver(AdminShiftsMigrationSchema), mode: 'onSubmit', defaultValues: { newShift: '', newSeat: '', showCustomSlot: false, customStart: '', customEnd: '', payMode: 'Cash', txnId: '', isPaying: false } });
  const setNewShift = (value: string) => { setNewShiftState(value); migrationForm.setValue('newShift', value); };
  const setNewSeat = (value: string) => { setNewSeatState(value); migrationForm.setValue('newSeat', value); };
  const setShowCustomSlot = (value: boolean | ((current: boolean) => boolean)) => { const next = typeof value === 'function' ? value(showCustomSlot) : value; setShowCustomSlotState(next); migrationForm.setValue('showCustomSlot', next); };
  const setCustomStart = (value: string) => { setCustomStartState(value); migrationForm.setValue('customStart', value); };
  const setCustomEnd = (value: string) => { setCustomEndState(value); migrationForm.setValue('customEnd', value); };
  const setPayMode = (value: PayMode) => { setPayModeState(value); migrationForm.setValue('payMode', value); };
  const setTxnId = (value: string) => { setTxnIdState(value); migrationForm.setValue('txnId', value); };
  const [remark, setRemark]                     = useState('');
  const [showConfirm, setShowConfirm]           = useState(false);

  const filteredStudents = (isDemoMode ? ADMIN_SHIFTS_MIGRATION_DEMO_STUDENTS : []).filter(s =>
    s.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    s.smartId.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  const daysLeft       = selectedStudent ? daysRemaining(selectedStudent.validTill) : 0;
  const selectedShiftData = ADMIN_SHIFTS_MIGRATION_DEMO_SHIFTS.find(s => s.name === newShift);
  const newRate        = selectedShiftData?.rate ?? 0;
  const oldRate        = selectedStudent?.dailyRate ?? 0;
  const adjustment     = (newRate - oldRate) * daysLeft;
  const isPaying       = adjustment > 0;
  const hasSameSlot = Boolean(selectedStudent && newShift === selectedStudent.currentShift && newSeat === selectedStudent.currentSeat);
  const newShiftSeats = ADMIN_SHIFTS_MIGRATION_DEMO_SEATS[newShift] ?? [];

  async function validateMigrationStep(targetStep: number): Promise<boolean> {
    setMigrationValidationMessage('');
    if (targetStep === 1) { if (!selectedStudent) { setMigrationValidationMessage(t('migrationValidationFailed')); return false; } return true; }
    if (!newShift || !newSeat || hasSameSlot) { setMigrationValidationMessage(t('migrationValidationFailed')); return false; }
    migrationForm.setValue('newShift', newShift); migrationForm.setValue('newSeat', newSeat);
    migrationForm.setValue('showCustomSlot', showCustomSlot); migrationForm.setValue('customStart', customStart); migrationForm.setValue('customEnd', customEnd);
    migrationForm.setValue('payMode', payMode); migrationForm.setValue('txnId', txnId); migrationForm.setValue('isPaying', targetStep >= 3 && isPaying);
    const valid = await migrationForm.trigger();
    if (!valid) setMigrationValidationMessage(t('migrationValidationFailed'));
    return valid;
  }

  function handleConfirmMigration() {
    if (!isDemoMode) {
      toast.error(t('migrationBlockedDemo'), { id: 'admin_seats_shifts_lockers-shifts_migration-hooks-useAdminShiftsMigrationShiftMigrationPage-toast-76-1' });
      return;
    }
    toast.error(t('migrationBlockedLive'), { id: 'admin_seats_shifts_lockers-shifts_migration-hooks-useAdminShiftsMigrationShiftMigrationPage-toast-79-2' });
  }

  const STEPS = [
    { n: 1, label: t('selectStudent') },
    { n: 2, label: t('chooseNewSlot') },
    { n: 3, label: t('reviewAndPay') },
  ];

  return {
    STUDENTS: isDemoMode ? ADMIN_SHIFTS_MIGRATION_DEMO_STUDENTS : [],
    SHIFTS: isDemoMode ? ADMIN_SHIFTS_MIGRATION_DEMO_SHIFTS : [],
    isDemoMode,
    daysRemaining,
    step,
    setStep,
    search,
    setSearch,
    selectedStudent,
    setSelectedStudent,
    newShift,
    setNewShift,
    newSeat,
    setNewSeat,
    newShiftSeats,
    hasSameSlot,
    showCustomSlot,
    setShowCustomSlot,
    customStart,
    setCustomStart,
    customEnd,
    setCustomEnd,
    payMode,
    setPayMode,
    txnId,
    setTxnId,
    migrationValidationMessage,
    validateMigrationStep,
    remark,
    setRemark,
    showConfirm,
    setShowConfirm,
    filteredStudents,
    daysLeft,
    selectedShiftData,
    newRate,
    oldRate,
    adjustment,
    isPaying,
    handleConfirmMigration,
    STEPS,
  } as const;
}
