'use client';
// RESPONSIBILITY: Modal dialog allowing manager to edit any member attributes (seat, shift, locker, phone, name, guardian, plan, status).

import React, { useState, useEffect, useMemo } from 'react';
import { Armchair, Check, CreditCard, GraduationCap, User, X, AlertTriangle } from 'lucide-react';
import { z } from 'zod';
import type { ManagerMembersDirectoryRecord } from '@/app/frontend_manager/manager_members/members_directory/types/ManagerMembersDirectoryTypes';
import { ManagerMembersDirectoryEditFormTabs, type EditTab } from '@/app/frontend_manager/manager_members/members_directory/components/manager_members_directory_sections/ManagerMembersDirectoryEditFormTabs';

export const memberEditSchema = z.object({
  name: z.string().trim().min(1, 'Student Full Name is required.'),
  phone: z.string().trim().min(7, 'Phone number must be at least 7 digits.'),
  email: z.string().trim().email('Invalid email address.').optional().or(z.literal('')),
  expiryDate: z.string().trim().min(1, 'Plan Expiry Date is required.'),
});

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
  const [showConfirmDiscard, setShowConfirmDiscard] = useState(false);

  useEffect(() => {
    setFormData({ ...member });
    setError(null);
    setShowConfirmDiscard(false);
  }, [member, isOpen]);

  const isDirty = useMemo(() => {
    return JSON.stringify(formData) !== JSON.stringify(member);
  }, [formData, member]);

  if (!isOpen) return null;

  const handleChange = (field: keyof ManagerMembersDirectoryRecord, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleAttemptClose = () => {
    if (isDirty) {
      setShowConfirmDiscard(true);
    } else {
      onClose();
    }
  };

  const handleConfirmDiscard = () => {
    setShowConfirmDiscard(false);
    onClose();
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const result = memberEditSchema.safeParse({
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      expiryDate: formData.expiryDate,
    });

    if (!result.success) {
      const firstIssue = result.error.issues[0]?.message ?? 'Invalid member data.';
      setError(firstIssue);
      if (firstIssue.includes('Name') || firstIssue.includes('Phone') || firstIssue.includes('Email')) {
        setActiveTab('personal');
      } else if (firstIssue.includes('Expiry')) {
        setActiveTab('plan_status');
      }
      return;
    }

    onSave(formData);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="manager-edit-member-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-overlay-backdrop backdrop-blur-xs p-4 overflow-y-auto"
      onKeyDown={(e) => { if (e.key === 'Escape') handleAttemptClose(); }}
    >
      <div className="bg-card border border-border rounded-2xl shadow-floating max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
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
            onClick={handleAttemptClose}
            className="p-1.5 rounded-lg text-secondary hover:text-primary hover:bg-card transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 outline-none cursor-pointer"
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
            className={`flex items-center gap-2 py-3 px-3 text-xs font-semibold border-b-2 transition-all whitespace-nowrap focus-visible:ring-2 focus-visible:ring-primary outline-none cursor-pointer ${
              activeTab === 'personal' ? 'border-primary text-primary' : 'border-transparent text-secondary hover:text-primary'
            }`}
          >
            <User size={14} /> Personal & Contact
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('seat_locker')}
            className={`flex items-center gap-2 py-3 px-3 text-xs font-semibold border-b-2 transition-all whitespace-nowrap focus-visible:ring-2 focus-visible:ring-primary outline-none cursor-pointer ${
              activeTab === 'seat_locker' ? 'border-primary text-primary' : 'border-transparent text-secondary hover:text-primary'
            }`}
          >
            <Armchair size={14} /> Seat & Locker
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('guardian_goal')}
            className={`flex items-center gap-2 py-3 px-3 text-xs font-semibold border-b-2 transition-all whitespace-nowrap focus-visible:ring-2 focus-visible:ring-primary outline-none cursor-pointer ${
              activeTab === 'guardian_goal' ? 'border-primary text-primary' : 'border-transparent text-secondary hover:text-primary'
            }`}
          >
            <GraduationCap size={14} /> Guardian & Goals
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('plan_status')}
            className={`flex items-center gap-2 py-3 px-3 text-xs font-semibold border-b-2 transition-all whitespace-nowrap focus-visible:ring-2 focus-visible:ring-primary outline-none cursor-pointer ${
              activeTab === 'plan_status' ? 'border-primary text-primary' : 'border-transparent text-secondary hover:text-primary'
            }`}
          >
            <CreditCard size={14} /> Plan & Validity
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-4">
          {error && (
            <div
              id="manager-edit-member-error"
              role="alert"
              aria-live="assertive"
              className="p-3 rounded-lg bg-danger-bg border border-border text-xs font-medium text-danger flex items-center gap-2"
            >
              <AlertTriangle size={15} />
              <span>{error}</span>
            </div>
          )}

          <ManagerMembersDirectoryEditFormTabs
            activeTab={activeTab}
            formData={formData}
            onChange={handleChange}
            errorId={error ? 'manager-edit-member-error' : undefined}
          />

          {/* Dialog Actions Footer */}
          <div className="pt-4 border-t border-border flex items-center justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={handleAttemptClose}
              className="mgr-btn-ghost cursor-pointer focus-visible:ring-2 focus-visible:ring-primary outline-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="mgr-btn-primary inline-flex items-center gap-1.5 cursor-pointer focus-visible:ring-2 focus-visible:ring-primary outline-none"
            >
              <Check size={16} /> Save Changes
            </button>
          </div>
        </form>

        {/* Confirmation Dialog on Discard */}
        {showConfirmDiscard && (
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-discard-title"
            className="absolute inset-0 z-60 bg-overlay-backdrop backdrop-blur-xs flex items-center justify-center p-4"
          >
            <div className="bg-card border border-border rounded-xl p-5 max-w-sm w-full shadow-lg text-center space-y-3">
              <div className="mx-auto w-10 h-10 rounded-full bg-warning-bg flex items-center justify-center text-warning">
                <AlertTriangle size={20} />
              </div>
              <h4 id="confirm-discard-title" className="text-sm font-bold text-primary">Discard Unsaved Changes?</h4>
              <p className="text-xs text-secondary">
                You have modified member information. Closing now will discard all unsaved edits.
              </p>
              <div className="flex items-center justify-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowConfirmDiscard(false)}
                  className="mgr-btn-ghost text-xs cursor-pointer focus-visible:ring-2 focus-visible:ring-primary outline-none"
                >
                  Keep Editing
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDiscard}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-danger text-on-danger hover:opacity-90 transition-opacity cursor-pointer focus-visible:ring-2 focus-visible:ring-primary outline-none"
                >
                  Discard Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
