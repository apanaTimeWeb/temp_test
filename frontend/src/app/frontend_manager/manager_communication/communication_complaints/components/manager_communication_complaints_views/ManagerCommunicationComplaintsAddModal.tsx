'use client';

import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { X, MessageSquarePlus, AlertCircle, Armchair } from 'lucide-react';
import { SearchableCombobox, type ComboboxOption } from '@/components/ui/combobox/SearchableCombobox';
import { MANAGER_MEMBERS_DEMO_RECORDS } from '@/app/frontend_manager/manager_members/members_directory/mocks/manager_members_directory_fixtures/ManagerMembersDirectoryFixtures';
import type { ManagerCommunicationComplaintsComplaint } from '@/app/frontend_manager/manager_communication/communication_complaints/types/ManagerCommunicationComplaintsTypes';

export interface ManagerCommunicationComplaintsAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (complaint: ManagerCommunicationComplaintsComplaint) => void;
}

const CATEGORIES = [
  'Air Conditioning / Cooling',
  'Wi-Fi / Internet Connectivity',
  'Noise / Disturbance in Hall',
  'Cleanliness & Sanitation',
  'Lighting / Electrical Socket',
  'Locker Issue',
  'Seat Cleanliness / Chair Broken',
  'Other Operational Issue',
] as const;

export default function ManagerCommunicationComplaintsAddModal({
  isOpen,
  onClose,
  onSubmit,
}: ManagerCommunicationComplaintsAddModalProps) {
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [studentName, setStudentName] = useState('');
  const [seatNumber, setSeatNumber] = useState('');
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'Normal' | 'Urgent'>('Normal');

  const studentOptions: ComboboxOption[] = useMemo(() => {
    return MANAGER_MEMBERS_DEMO_RECORDS.map((s) => ({
      value: s.id,
      label: `${s.name} (${s.id})`,
      subLabel: `Seat: ${s.seat || 'General'} · Shift: ${s.shift || 'Morning'}`,
      badge: s.status,
    }));
  }, []);

  const handleSelectStudent = (studentId: string) => {
    setSelectedStudentId(studentId);
    const found = MANAGER_MEMBERS_DEMO_RECORDS.find((s) => s.id === studentId);
    if (found) {
      setStudentName(`${found.name} (${found.id})`);
      setSeatNumber(found.seat || 'S-01');
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !title.trim() || !description.trim()) {
      toast.error('Please select Student and fill in Issue Title & Description.');
      return;
    }

    const complaint: ManagerCommunicationComplaintsComplaint = {
      id: `CMP-${Date.now().toString().slice(-4)}`,
      title: `${category}: ${title.trim()}${priority === 'Urgent' ? ' [URGENT]' : ''}`,
      student: seatNumber.trim() ? `${studentName.trim()} (Seat #${seatNumber.trim()})` : studentName.trim(),
      description: description.trim(),
      status: 'Open',
      date: new Date().toISOString().slice(0, 10),
      resolvedBy: null,
      resolvedDate: null,
      resolvedNote: null,
    };

    onSubmit(complaint);
    toast.success(`Complaint registered for ${studentName}`);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-overlay-backdrop p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-dialog space-y-4 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between border-b border-border pb-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-danger-bg text-danger flex items-center justify-center">
              <MessageSquarePlus size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-primary">Lodge Student Complaint</h2>
              <p className="text-xs text-secondary">Record a maintenance, facility, or student concern ticket</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-secondary hover:text-primary transition-colors p-1"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto space-y-3.5 pr-1 text-xs">
          {/* Select Member from Directory */}
          <div className="space-y-1">
            <label className="font-semibold text-primary block">Select Student from Directory *</label>
            <SearchableCombobox
              options={studentOptions}
              value={selectedStudentId}
              onChange={handleSelectStudent}
              placeholder="Search student by name or Smart ID (e.g. Rahul, LIB-001)..."
              searchPlaceholder="Type name or ID..."
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-primary block mb-1">Student Identifier *</label>
              <input
                type="text"
                required
                className="mgr-input text-xs"
                placeholder="Student name"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
              />
            </div>
            <div>
              <label className="font-semibold text-primary block mb-1">Assigned Seat</label>
              <input
                type="text"
                className="mgr-input text-xs"
                placeholder="e.g. S-14"
                value={seatNumber}
                onChange={(e) => setSeatNumber(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-primary block mb-1">Issue Category *</label>
              <select
                className="mgr-select text-xs"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="font-semibold text-primary block mb-1">Priority Level</label>
              <select
                className="mgr-select text-xs font-semibold"
                value={priority}
                onChange={(e) => setPriority(e.target.value as 'Normal' | 'Urgent')}
              >
                <option value="Normal">🟢 Normal Priority</option>
                <option value="Urgent">🔴 Urgent Priority</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-semibold text-primary block mb-1">Issue Title / Summary *</label>
            <input
              type="text"
              required
              className="mgr-input text-xs"
              placeholder="e.g. Chair armrest broken at Desk #14"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="font-semibold text-primary block mb-1">Detailed Description *</label>
            <textarea
              required
              rows={3}
              className="mgr-input text-xs resize-none"
              placeholder="Describe the complaint in detail..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg border border-border text-secondary hover:text-primary transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="mgr-btn-primary mgr-btn-sm text-xs font-bold"
            >
              Submit Ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
