import { toast } from 'sonner';
import type { ManagerMembersDirectoryRecord } from '@/app/frontend_manager/manager_members/members_directory/types/ManagerMembersDirectoryTypes';
import type { ManagerGraduateAlumniDetails } from '@/app/frontend_manager/manager_members/members_directory/components/manager_members_directory_sections/ManagerMembersDirectoryGraduateAlumniModal';

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
  };

  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem('manager_alumni_records') : null;
    const existing = raw ? JSON.parse(raw) : [];
    const list = Array.isArray(existing) ? existing : [];
    const updated = [
      alumniItem,
      ...list.filter((x: { id?: string; phone?: string }) => x.id !== alumniItem.id && x.phone !== alumniItem.phone),
    ];
    if (typeof window !== 'undefined') {
      localStorage.setItem('manager_alumni_records', JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('manager_alumni_created', { detail: alumniItem }));
    }
  } catch {
    // storage fallback
  }

  const updatedMember: ManagerMembersDirectoryRecord = {
    ...targetMember,
    seat: details.releaseSeat ? undefined : targetMember.seat,
    locker: details.releaseSeat ? undefined : targetMember.locker,
    remarks: targetMember.remarks
      ? `${targetMember.remarks} | Graduated to Alumni: ${details.exam}${details.designation ? ` (${details.designation})` : ''}`
      : `Graduated to Alumni: ${details.exam}${details.designation ? ` (${details.designation})` : ''} on ${details.leftDate}`,
  };

  onUpdateMember?.(updatedMember);
  toast.success(
    `🎉 ${targetMember.name} graduated to Alumni! ${details.releaseSeat && targetMember.seat ? `Seat ${targetMember.seat} released.` : ''}`
  );

  return updatedMember;
}

