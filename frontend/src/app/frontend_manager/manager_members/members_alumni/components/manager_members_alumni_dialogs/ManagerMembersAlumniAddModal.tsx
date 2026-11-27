'use client';

import { ManagerMembersAlumniAddFormFields } from '@/app/frontend_manager/manager_members/members_alumni/components/manager_members_alumni_dialogs/ManagerMembersAlumniAddFormFields';
import { ManagerMembersAlumniDepositClearanceBox } from '@/app/frontend_manager/manager_members/members_alumni/components/manager_members_alumni_dialogs/ManagerMembersAlumniDepositClearanceBox';
import { MANAGER_MEMBERS_ALUMNI_DEMO_STUDENTS, type AlumniDemoStudentOption } from '@/app/frontend_manager/manager_members/members_alumni/config/manager_members_alumni.demo_data';
import type { MembersAlumniRow } from '@/app/frontend_manager/manager_members/members_alumni/types/ManagerMembersAlumniComponentTypes';
import {
  checkMemberDepositSettlement,
  readStoredJsonList,
  settleAndRefundDepositInLedger,
} from '@/app/frontend_manager/manager_members/members_alumni/utils/ManagerMembersAlumniDepositSettlement';
import { SearchableCombobox, type ComboboxOption } from '@/components/ui/combobox/SearchableCombobox';
import { Check, CheckCircle2, GraduationCap } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

export interface ManagerMembersAlumniAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (alumni: MembersAlumniRow) => void;
}

export function ManagerMembersAlumniAddModal({ isOpen, onClose, onAdd }: ManagerMembersAlumniAddModalProps) {
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [exam, setExam] = useState('');
  const [duration, setDuration] = useState('12 Months');
  const [leftDate, setLeftDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [currentStatus, setCurrentStatus] = useState<MembersAlumniRow['currentStatus']>('Cleared Exam');
  const [designation, setDesignation] = useState('');
  const [testimonial, setTestimonial] = useState('');
  const [depositSettlementStatus, setDepositSettlementStatus] = useState<MembersAlumniRow['depositSettlementStatus']>('Refunded');
  const [depositAmount, setDepositAmount] = useState<number>(500);
  const [hasHeldDeposit, setHasHeldDeposit] = useState<boolean>(false);

  const handleResetForm = () => {
    setSelectedStudentId(''); setName(''); setPhone(''); setExam(''); setDuration('12 Months');
    setLeftDate(new Date().toISOString().slice(0, 10)); setCurrentStatus('Cleared Exam');
    setDesignation(''); setTestimonial(''); setHasHeldDeposit(false); setDepositAmount(500); setDepositSettlementStatus('Refunded');
  };

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { handleResetForm(); onClose(); }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  const availableStudents = useMemo<AlumniDemoStudentOption[]>(
    () => readStoredJsonList<AlumniDemoStudentOption>('manager_member_records') ?? MANAGER_MEMBERS_ALUMNI_DEMO_STUDENTS,
    [],
  );

  const studentOptions: ComboboxOption[] = useMemo(
    () => availableStudents.map((s) => ({ value: s.id, label: `${s.name} (${s.id})`, subLabel: `Phone: ${s.phone} · Target: ${s.department || s.preparationFor || 'Competitive Exams'}`, badge: s.status })),
    [availableStudents],
  );

  const selectedStudent = useMemo(() => availableStudents.find((s) => s.id === selectedStudentId), [availableStudents, selectedStudentId]);

  const handleSelectStudent = (studentId: string) => {
    setSelectedStudentId(studentId);
    if (!studentId) { handleResetForm(); return; }
    const found = availableStudents.find((s) => s.id === studentId);
    if (!found) return;
    setName(found.name);
    setPhone(found.phone.replace(/\D/g, '').slice(0, 10));
    if (found.department || found.preparationFor) setExam(found.department || found.preparationFor || '');
    const dep = checkMemberDepositSettlement(found);
    if (dep.hasHeldDeposit) { setHasHeldDeposit(true); setDepositAmount(dep.amount); setDepositSettlementStatus('Refunded'); }
    else if (dep.status === 'Refunded') { setHasHeldDeposit(false); setDepositAmount(0); setDepositSettlementStatus('Refunded'); }
    else { setHasHeldDeposit(false); setDepositAmount(0); setDepositSettlementStatus('No Deposit'); }
  };

  const handleClearSelectedStudent = () => {
    setSelectedStudentId(''); setName(''); setPhone(''); setExam('');
    setHasHeldDeposit(false); setDepositAmount(500); setDepositSettlementStatus('Refunded');
  };

  const handleClose = () => { handleResetForm(); onClose(); };
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName || trimmedName.length < 2) { toast.error('Student full name must be at least 2 characters.', { id: 'alumni-add-bad-name' }); return; }
    const cleanPhone = phone.trim().replace(/\D/g, '').slice(0, 10);
    if (cleanPhone.length !== 10) { toast.error('Valid 10-digit mobile number is required.', { id: 'alumni-add-bad-phone-len' }); return; }
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) { toast.error('Mobile number must start with 6, 7, 8, or 9.', { id: 'alumni-add-bad-phone-start' }); return; }
    const trimmedExam = exam.trim();
    if (!trimmedExam || trimmedExam.length < 2) { toast.error('Qualified Exam or Achievement is required.', { id: 'alumni-add-bad-exam' }); return; }

    const newRecord: MembersAlumniRow = {
      id: `ALM-${Date.now().toString().slice(-4)}`,
      name: trimmedName, phone: cleanPhone, leftDate, duration: duration.trim() || '1 Year',
      exam: trimmedExam, designation: designation.trim(), testimonial: testimonial.trim(), currentStatus,
      depositSettlementStatus: hasHeldDeposit ? depositSettlementStatus : 'No Deposit',
      depositAmount: hasHeldDeposit ? depositAmount : undefined,
    };

    if (hasHeldDeposit && depositSettlementStatus === 'Refunded') {
      settleAndRefundDepositInLedger({ id: selectedStudentId, name: trimmedName, phone: cleanPhone }, depositAmount, `Refunded upon alumni record creation (${trimmedExam})`);
    }
    onAdd(newRecord);
    toast.success(`Alumni record created for ${trimmedName} (${trimmedExam})`, { id: 'alumni-add-success' });
    handleResetForm();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay-backdrop p-3 sm:p-4 overflow-y-auto" role="dialog" aria-modal="true" aria-labelledby="add-alumni-title">
      <div className="w-full max-w-xl rounded-2xl border border-border bg-card p-4 sm:p-6 shadow-dialog space-y-4 sm:space-y-5 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between border-b border-border pb-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-subtle text-primary flex items-center justify-center shrink-0"><GraduationCap size={22} className="text-primary" /></div>
            <div>
              <h2 id="add-alumni-title" className="text-base sm:text-lg font-bold text-primary">Add Alumni Record</h2>
              <p className="text-xs text-secondary">Select an enrolled student or enter details to celebrate their achievement</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs">
          <div className="space-y-1.5 p-3 sm:p-3.5 rounded-xl bg-surface border border-border">
            <label className="font-semibold text-primary block">Select Student (Enrolled Library Member)</label>
            <SearchableCombobox options={studentOptions} value={selectedStudentId} onChange={handleSelectStudent} aria-label="Select Student" placeholder="Select student (e.g. Rahul, LIB-001)..." searchPlaceholder="Type student name, phone, or Smart ID..." />
            {selectedStudent && (
              <div className="mt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 rounded-xl bg-success-bg text-success border border-border font-medium">
                <span className="flex items-center gap-1.5 text-xs truncate">
                  <Check size={14} className="text-success shrink-0" />
                  <span>Selected: <strong>{selectedStudent.name}</strong> ({selectedStudent.id})</span>
                  <span className="text-secondary text-[11px] hidden sm:inline">· Seat: {selectedStudent.seat || 'General'} · Phone: +91 {selectedStudent.phone}</span>
                </span>
                <button type="button" onClick={handleClearSelectedStudent} className="text-xs text-danger font-bold hover:underline shrink-0 self-end sm:self-auto cursor-pointer">Clear / Change</button>
              </div>
            )}
            {hasHeldDeposit && (
              <ManagerMembersAlumniDepositClearanceBox name={name} phone={phone} depositAmount={depositAmount} depositSettlementStatus={depositSettlementStatus} onChangeSettlement={setDepositSettlementStatus} />
            )}
          </div>

          <ManagerMembersAlumniAddFormFields
            name={name} setName={setName} phone={phone} setPhone={setPhone} exam={exam} setExam={setExam}
            designation={designation} setDesignation={setDesignation} currentStatus={currentStatus} setCurrentStatus={setCurrentStatus}
            duration={duration} setDuration={setDuration} leftDate={leftDate} setLeftDate={setLeftDate} testimonial={testimonial} setTestimonial={setTestimonial}
          />

          <div className="flex flex-col-reverse sm:flex-row justify-end items-center gap-2 sm:gap-3 pt-4 border-t border-border">
            <button type="button" onClick={handleClose} className="inline-flex items-center justify-center text-xs h-9 px-4 w-full sm:w-auto font-semibold rounded-xl bg-danger-bg text-danger border border-border hover:opacity-90 motion-safe:transition-colors cursor-pointer">Cancel</button>
            <button type="submit" className="mgr-btn-primary inline-flex items-center justify-center gap-2 text-xs h-9 px-5 w-full sm:w-auto font-semibold motion-safe:transition-colors cursor-pointer">
              <CheckCircle2 size={16} className="text-on-primary shrink-0" />
              <span>Save Alumni Record</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ManagerMembersAlumniAddModal;
