'use client';

import { useState } from 'react';
import { X, MessageSquarePlus, AlertCircle } from 'lucide-react';
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
  const [studentName, setStudentName] = useState('');
  const [seatNumber, setSeatNumber] = useState('');
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'Normal' | 'Urgent'>('Normal');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !title.trim() || !description.trim()) {
      alert('Please fill in Student Name, Issue Title, and Description.');
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
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-overlay-backdrop p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-dialog space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-danger/10 text-danger flex items-center justify-center">
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

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-primary block mb-1">Student Name *</label>
              <input
                type="text"
                required
                className="mgr-input text-xs"
                placeholder="e.g. Rahul Sharma"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-primary block mb-1">Seat Number</label>
              <input
                type="text"
                className="mgr-input text-xs"
                placeholder="e.g. A-14 / B-02"
                value={seatNumber}
                onChange={(e) => setSeatNumber(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-primary block mb-1">Issue Category *</label>
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
              <label className="text-xs font-semibold text-primary block mb-1">Priority</label>
              <select
                className="mgr-select text-xs"
                value={priority}
                onChange={(e) => setPriority(e.target.value as 'Normal' | 'Urgent')}
              >
                <option value="Normal">Normal</option>
                <option value="Urgent">Urgent / Immediate Action</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-primary block mb-1">Issue Summary / Title *</label>
            <input
              type="text"
              required
              className="mgr-input text-xs"
              placeholder="e.g. AC cooling low in Row A"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-primary block mb-1">Detailed Description *</label>
            <textarea
              rows={3}
              required
              className="mgr-input text-xs resize-none"
              placeholder="Describe the complaint in detail for maintenance staff..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {priority === 'Urgent' && (
            <div className="flex items-center gap-2 rounded-lg bg-danger/10 border border-danger/20 p-2.5 text-xs text-danger">
              <AlertCircle size={15} className="shrink-0" />
              <span>Marked as urgent. This ticket will be prioritized on the supervisor dashboard.</span>
            </div>
          )}

          <div className="flex justify-end gap-2.5 pt-3 border-t border-border">
            <button type="button" onClick={onClose} className="mgr-btn-ghost text-xs">
              Cancel
            </button>
            <button type="submit" className="mgr-btn-primary text-xs flex items-center gap-1.5">
              <MessageSquarePlus size={14} />
              <span>Submit Complaint</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

