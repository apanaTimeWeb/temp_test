'use client';
// RESPONSIBILITY: Modal dialog allowing manager to edit any member attributes (seat, shift, locker, phone, name, guardian, plan, status).

import React, { useState, useEffect } from 'react';
import { Armchair, Check, CreditCard, GraduationCap, User, X } from 'lucide-react';
import type { ManagerMembersDirectoryRecord } from '@/app/frontend_manager/manager_members/members_directory/types/ManagerMembersDirectoryTypes';
import { ManagerMembersDirectoryEditFormTabs, type EditTab } from '@/app/frontend_manager/manager_members/members_directory/components/manager_members_directory_sections/ManagerMembersDirectoryEditFormTabs';

export interface ManagerMembersDirectoryEditModalProps {
  member: ManagerMembersDirectoryRecord;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: ManagerMembersDirectoryRecord) => void;
}

export function ManagerMembersDirectoryEditModal({ member, isOpen, onClose, onSave }: ManagerMembersDirectoryEditModalProps) {
  const [formData, setFormData] = useState<ManagerMembersDirectoryRecord>({ ...member });
  const [activeTab, setActiveTab] = useState<EditTab>('personal');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setFormData({ ...member });
    setError(null);
  }, [member, isOpen]);

  if (!isOpen) return null;

  const handleChange = (field: keyof ManagerMembersDirectoryRecord, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Member Name is required.');
      setActiveTab('personal');
      return;
    }
    if (!formData.phone.trim()) {
      setError('Phone number is required.');
      setActiveTab('personal');
      return;
    }
    onSave(formData);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="manager-edit-member-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto"
      onKeyDown={(e) => { if (e.key === 'Escape') onClose(); }}
    >
      <div className="bg-card border border-border rounded-2xl shadow-floating max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden motion-safe:animate-in motion-safe:fade-in-50 motion-safe:zoom-in-95">
        {/* Header */}
        <div className="p-5 border-b border-border flex items-center justify-between bg-surface-highlight">
          <div>
            <h3 id="manager-edit-member-modal-title" className="text-lg font-bold text-primary">
              Edit Member Profile
            </h3>
            <p className="text-xs text-secondary mt-0.5">
              Update details for <span className="font-semibold text-primary">{member.name}</span> ({member.id})
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-secondary hover:text-primary hover:bg-card transition-colors"
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Strip */}
        <div className="flex border-b border-border bg-surface px-4 gap-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('personal')}
            className={`flex items-center gap-2 py-3 px-3 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'personal'
                ? 'border-primary text-primary'
                : 'border-transparent text-secondary hover:text-primary'
            }`}
          >
            <User size={14} /> Personal & Contact
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('seat_locker')}
            className={`flex items-center gap-2 py-3 px-3 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'seat_locker'
                ? 'border-primary text-primary'
                : 'border-transparent text-secondary hover:text-primary'
            }`}
          >
            <Armchair size={14} /> Seat & Locker
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('guardian_goal')}
            className={`flex items-center gap-2 py-3 px-3 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'guardian_goal'
                ? 'border-primary text-primary'
                : 'border-transparent text-secondary hover:text-primary'
            }`}
          >
            <GraduationCap size={14} /> Guardian & Goals
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('plan_status')}
            className={`flex items-center gap-2 py-3 px-3 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'plan_status'
                ? 'border-primary text-primary'
                : 'border-transparent text-secondary hover:text-primary'
            }`}
          >
            <CreditCard size={14} /> Plan & Validity
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-danger-bg border border-danger/30 text-xs font-medium text-danger">
              {error}
            </div>
          )}

          <ManagerMembersDirectoryEditFormTabs
            activeTab={activeTab}
            formData={formData}
            onChange={handleChange}
          />

          {/* Dialog Actions Footer */}
          <div className="pt-4 border-t border-border flex items-center justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="mgr-btn-ghost"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="mgr-btn-primary inline-flex items-center gap-1.5"
            >
              <Check size={16} /> Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
