import type { ManagerGraduateAlumniDetails } from '@/app/frontend_manager/manager_members/members_directory/components/manager_members_directory_sections/ManagerMembersDirectoryGraduateAlumniModal';
import type { ManagerMembersDirectoryRecord } from '@/app/frontend_manager/manager_members/members_directory/types/ManagerMembersDirectoryTypes';
import {
  formatDirectoryInrRupees,
  settleAndRefundDepositInLedger,
} from '@/app/frontend_manager/manager_members/members_directory/utils/ManagerMembersDirectoryDepositSettlement';
import { readBrowserStorageItem, writeBrowserStorageItem } from '@/lib/browserStorage';
import { toast } from 'sonner';

export function graduateMemberToAlumni(
  targetMember: ManagerMembersDirectoryRecord,
  details: ManagerGraduateAlumniDetails,
  onUpdateMember?: (updated: ManagerMembersDirectoryRecord) => void
): ManagerMembersDirectoryRecord {
  const cleanPhone = targetMember.phone.replace(/\D/g, '');
  const alumniItem = {
    id: `ALM-${Date.now().toString().slice(-4)}`,
    name: targetMember.name,
    phone: cleanPhone.length === 10 ? cleanPhone : targetMember.phone,
    leftDate: details.leftDate,
    duration: details.duration || '12 Months',
    exam: details.exam,
    designation: details.designation,
    testimonial: details.testimonial,
    currentStatus: details.currentStatus,
    depositSettlementStatus: details.depositSettlementStatus,
    depositAmount: details.depositAmount,
  };

  if (details.depositSettlementStatus === 'Refunded' && details.depositAmount) {
    settleAndRefundDepositInLedger(
      {
        id: targetMember.id,
        smartId: targetMember.smartId || targetMember.id,
        name: targetMember.name,
        phone: targetMember.phone,
        joinDate: targetMember.joinDate,
      },
      details.depositAmount,
      `Refunded upon graduation to Alumni (${details.exam}) on ${details.leftDate}`,
      details.leftDate
    );
  }

  try {
    const raw = readBrowserStorageItem('manager_alumni_records');
    const existing = raw.available && raw.value ? JSON.parse(raw.value) : [];
    const list = Array.isArray(existing) ? existing : [];
    const updated = [
      alumniItem,
      ...list.filter((x: { id?: string; phone?: string }) => x.id !== alumniItem.id && x.phone !== alumniItem.phone),
    ];
    writeBrowserStorageItem('manager_alumni_records', JSON.stringify(updated));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('manager_alumni_created', { detail: alumniItem }));
    }
  } catch {
    // storage fallback
  }

  const depositRemarksSuffix = details.depositSettlementStatus
    ? ` | Deposit: ${details.depositSettlementStatus}${details.depositAmount ? ` (${formatDirectoryInrRupees(details.depositAmount)})` : ''}`
    : '';

  const updatedMember: ManagerMembersDirectoryRecord = {
    ...targetMember,
    seat: details.releaseSeat ? undefined : targetMember.seat,
    locker: details.releaseSeat ? undefined : targetMember.locker,
    remarks: targetMember.remarks
      ? `${targetMember.remarks} | Graduated to Alumni: ${details.exam}${details.designation ? ` (${details.designation})` : ''}${depositRemarksSuffix}`
      : `Graduated to Alumni: ${details.exam}${details.designation ? ` (${details.designation})` : ''} on ${details.leftDate}${depositRemarksSuffix}`,
  };

  onUpdateMember?.(updatedMember);

  const depositToastNotice =
    details.depositSettlementStatus === 'Refunded' && details.depositAmount
      ? ` Deposit ${formatDirectoryInrRupees(details.depositAmount)} refunded.`
      : details.depositSettlementStatus === 'Held'
      ? ` Note: Deposit (${formatDirectoryInrRupees(details.depositAmount || 500)}) pending clearance.`
      : '';

  toast.success(
    `🎉 ${targetMember.name} graduated to Alumni!${depositToastNotice} ${details.releaseSeat && targetMember.seat ? `Seat ${targetMember.seat} released.` : ''}`,
    { id: `manager-members-graduate-${targetMember.id}` }
  );

  return updatedMember;
}
