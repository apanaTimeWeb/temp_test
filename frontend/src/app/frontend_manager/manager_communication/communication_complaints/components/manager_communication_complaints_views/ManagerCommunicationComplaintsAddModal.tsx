'use client';

import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { X, MessageSquarePlus, AlertCircle, Armchair, MapPin } from 'lucide-react';
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

const QUICK_LOCATION_TAGS = [
  'Seat S-14 (Hall A)',
  'Discussion Room 2',
  'Silent Zone (Row 3)',
  'AC Duct Area (Desk S-08)',
  'Cabin B',
  'Reading Cubicle 5',
];

export default function ManagerCommunicationComplaintsAddModal({
  isOpen,
  onClose,
  onSubmit,
}: ManagerCommunicationComplaintsAddModalProps) {
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [studentName, setStudentName] = useState('');
  const [seatNumber, setSeatNumber] = useState('');
  const [seatTag, setSeatTag] = useState('');
  const [studentPhone, setStudentPhone] = useState('9876543210');
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
      setSeatNumber(found.seat || 'S-14');
      setSeatTag(found.seat ? `Seat ${found.seat} (Hall A)` : 'Seat S-14 (Hall A)');
      if (found.phone) setStudentPhone(found.phone);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !title.trim() || !description.trim()) {
      toast.error('Please select Student and fill in Issue Title & Description.');
      return;
    }

    const assignedTag =
      seatTag.trim() || (seatNumber.trim() ? `Seat ${seatNumber.trim()} (Hall A)` : 'General Study Area');

    const complaint: ManagerCommunicationComplaintsComplaint = {
      id: `CMP-${Date.now().toString().slice(-4)}`,
      title: `${category}: ${title.trim()}${priority === 'Urgent' ? ' [URGENT]' : ''}`,
      student: studentName.trim(),
      phone: studentPhone,
      seatTag: assignedTag,
      priority: priority,
      description: description.trim(),
      status: 'Open',
      date: new Date().toISOString().slice(0, 10),
      resolvedBy: null,
      resolvedDate: null,
      resolvedNote: null,
    };

    onSubmit(complaint);
    toast.success(`Complaint registered for ${studentName} at ${assignedTag}`);
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
              <label className="font-semibold text-primary block mb-1">Student WhatsApp Phone</label>
              <input
                type="text"
                className="mgr-input text-xs font-mono"
                placeholder="e.g. 9876543210"
                value={studentPhone}
                onChange={(e) => setStudentPhone(e.target.value)}
              />
            </div>
          </div>

          {/* Seat / Hall Tagging Section */}
          <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-amber-300 flex items-center gap-1.5">
                <Armchair size={13} className="text-amber-400" />
                <span>Seat / Hall / Cabin Location Tag *</span>
              </label>
              <span className="text-[10px] text-amber-200/80">e.g. Seat S-14 (Hall A)</span>
            </div>
            <input
              type="text"
              required
              className="mgr-input text-xs font-semibold border-amber-500/30 focus:border-amber-400"
              placeholder="e.g. Seat S-14 (Hall A) or Discussion Room"
              value={seatTag}
              onChange={(e) => setSeatTag(e.target.value)}
            />
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              <span className="text-[10px] text-secondary self-center mr-1">Quick Tag:</span>
              {QUICK_LOCATION_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSeatTag(tag)}
                  className={`text-[10px] px-2 py-0.5 rounded-md border font-mono transition-colors cursor-pointer ${
                    seatTag === tag
                      ? 'bg-amber-500/25 text-amber-200 border-amber-500/50 font-bold'
                      : 'bg-card text-secondary border-border hover:border-amber-500/30 hover:text-primary'
                  }`}
                >
                  + {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-primary block">Priority Level</label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setPriority('Normal')}
                style={
                  priority === 'Normal'
                    ? {
                        backgroundColor: 'rgba(16, 185, 129, 0.25)',
                        borderColor: '#10b981',
                        color: '#d1fae5',
                        boxShadow: '0 0 14px rgba(16, 185, 129, 0.45)',
                      }
                    : undefined
                }
                className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all flex items-center justify-between ${
                  priority === 'Normal'
                    ? 'font-bold'
                    : 'bg-card/60 border-border text-secondary hover:border-border-focus hover:text-primary'
                }`}
                aria-pressed={priority === 'Normal'}
              >
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="font-bold text-xs">Normal Priority</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPriority('Urgent')}
                style={
                  priority === 'Urgent'
                    ? {
                        backgroundColor: 'rgba(244, 63, 94, 0.25)',
                        borderColor: '#f43f5e',
                        color: '#ffe4e6',
                        boxShadow: '0 0 14px rgba(244, 63, 94, 0.45)',
                      }
                    : undefined
                }
                className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all flex items-center justify-between ${
                  priority === 'Urgent'
                    ? 'font-bold'
                    : 'bg-card/60 border-border text-secondary hover:border-border-focus hover:text-primary'
                }`}
                aria-pressed={priority === 'Urgent'}
              >
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                  <span className="font-bold text-xs">Urgent Priority</span>
                </div>
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-primary block">Issue Category *</label>
            <select
              className="mgr-select text-xs w-full"
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
            <label className="font-semibold text-primary block mb-1">Issue Title / Summary *</label>
            <input
              type="text"
              required
              className="mgr-input text-xs"
              placeholder="e.g. Water leaking from AC unit onto desk"
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
              className="px-3 py-1.5 rounded-lg border border-border text-secondary hover:text-primary transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="mgr-btn-primary mgr-btn-sm text-xs font-bold cursor-pointer"
            >
              Submit Ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
