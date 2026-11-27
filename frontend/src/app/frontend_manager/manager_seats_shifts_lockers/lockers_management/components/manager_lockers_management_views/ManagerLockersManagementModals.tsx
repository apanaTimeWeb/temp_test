'use client';

import { ManagerLockersManagementAddModal } from '@/app/frontend_manager/manager_seats_shifts_lockers/lockers_management/components/manager_lockers_management_views/ManagerLockersManagementAddModal';
import { ManagerLockersManagementAssignModal } from '@/app/frontend_manager/manager_seats_shifts_lockers/lockers_management/components/manager_lockers_management_views/ManagerLockersManagementAssignModal';
import { ManagerLockersManagementLostKeyModal } from '@/app/frontend_manager/manager_seats_shifts_lockers/lockers_management/components/manager_lockers_management_views/ManagerLockersManagementLostKeyModal';
import { ManagerLockersManagementStudentModal } from '@/app/frontend_manager/manager_seats_shifts_lockers/lockers_management/components/manager_lockers_management_views/ManagerLockersManagementStudentModal';
import { ManagerLockersManagementVacateModal } from '@/app/frontend_manager/manager_seats_shifts_lockers/lockers_management/components/manager_lockers_management_views/ManagerLockersManagementVacateModal';
import type { ManagerLockersManagementSampleLocker as Locker } from '@/app/frontend_manager/manager_seats_shifts_lockers/lockers_management/config/manager_lockers_management.demo_data';
import type { RefObject } from 'react';

interface ManagerLockersManagementModalsProps {
  dialogRef: RefObject<HTMLDivElement>;
  showAddModal: boolean;
  newLockerId: string;
  addError?: string;
  onLockerIdChange: (val: string) => void;
  onCloseAdd: () => void;
  onSubmitAdd: () => void;
  showAssign: Locker | null;
  onCloseAssign: () => void;
  onAssignLocker: (studentName: string, studentId: string, keyNumber?: string, expiryDate?: string) => void;
  freeTarget: Locker | null;
  keyStatus: 'returned' | 'lost';
  setKeyStatus: (val: 'returned' | 'lost') => void;
  remarks: string;
  setRemarks: (val: string) => void;
  onCloseFree: () => void;
  onConfirmFree: () => void;
  selectedLockerStudent: Locker | null;
  onCloseStudent: () => void;
  onTriggerFreeFromStudent: (locker: Locker) => void;
  onTriggerLostKeyFromStudent: (locker: Locker) => void;
  lostKeyTarget: Locker | null;
  onCloseLostKey: () => void;
  onConfirmLostKey: (lockerId: string, fineAmount: number, deductFromDeposit: boolean, vacateNow: boolean) => void;
}

export function ManagerLockersManagementModals({
  dialogRef,
  showAddModal,
  newLockerId,
  addError,
  onLockerIdChange,
  onCloseAdd,
  onSubmitAdd,
  showAssign,
  onCloseAssign,
  onAssignLocker,
  freeTarget,
  keyStatus,
  setKeyStatus,
  remarks,
  setRemarks,
  onCloseFree,
  onConfirmFree,
  selectedLockerStudent,
  onCloseStudent,
  onTriggerFreeFromStudent,
  onTriggerLostKeyFromStudent,
  lostKeyTarget,
  onCloseLostKey,
  onConfirmLostKey,
}: ManagerLockersManagementModalsProps) {
  return (
    <>
      {showAddModal && (
        <ManagerLockersManagementAddModal
          dialogRef={dialogRef}
          newLockerId={newLockerId}
          addError={addError}
          onLockerIdChange={onLockerIdChange}
          onClose={onCloseAdd}
          onSubmit={onSubmitAdd}
        />
      )}

      {showAssign && (
        <ManagerLockersManagementAssignModal
          locker={showAssign}
          dialogRef={dialogRef}
          onClose={onCloseAssign}
          onAssign={onAssignLocker}
        />
      )}

      {freeTarget && (
        <ManagerLockersManagementVacateModal
          freeTarget={freeTarget}
          dialogRef={dialogRef}
          keyStatus={keyStatus}
          setKeyStatus={setKeyStatus}
          remarks={remarks}
          setRemarks={setRemarks}
          onClose={onCloseFree}
          onConfirm={onConfirmFree}
        />
      )}

      {selectedLockerStudent && (
        <ManagerLockersManagementStudentModal
          locker={selectedLockerStudent}
          onClose={onCloseStudent}
          onVacate={onTriggerFreeFromStudent}
          onReportLostKey={onTriggerLostKeyFromStudent}
        />
      )}

      {lostKeyTarget && (
        <ManagerLockersManagementLostKeyModal
          isOpen={Boolean(lostKeyTarget)}
          locker={lostKeyTarget}
          onClose={onCloseLostKey}
          onConfirmLostKey={onConfirmLostKey}
        />
      )}
    </>
  );
}
