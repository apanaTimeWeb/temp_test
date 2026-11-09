'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  Armchair,
  Clock,
  Phone,
  MessageSquare,
  FileText,
  ExternalLink,
  ZoomIn,
  GraduationCap,
  Calendar,
  CheckCircle2,
} from 'lucide-react';
import type { ManagerMembersDirectoryRecord } from '@/app/frontend_manager/manager_members/members_directory/types/ManagerMembersDirectoryTypes';
import { maskManagerMemberPhone } from '@/app/frontend_manager/manager_members/members_directory/utils/ManagerMembersDirectoryPrivacy';
import { ManagerMembersDirectoryDocLightbox } from '@/app/frontend_manager/manager_members/members_directory/components/manager_members_directory_sections/ManagerMembersDirectoryDocLightbox';

export interface ManagerMembersDirectoryPhotoKycModalProps {
  isOpen: boolean;
  member: ManagerMembersDirectoryRecord | null;
  onClose: () => void;
  onViewFullProfile: (memberId: string) => void;
  onQuickWhatsApp?: (member: ManagerMembersDirectoryRecord) => void;
}

export function ManagerMembersDirectoryPhotoKycModal({
  isOpen,
  member,
  onClose,
  onViewFullProfile,
  onQuickWhatsApp,
}: ManagerMembersDirectoryPhotoKycModalProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [selectedDocPreview, setSelectedDocPreview] = useState<string | null>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isZoomed) {
          setIsZoomed(false);
        } else if (selectedDocPreview) {
          setSelectedDocPreview(null);
        } else {
          onClose();
        }
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isZoomed, selectedDocPreview, onClose]);

  if (!isOpen || !member) return null;

  const mockPhotoUrl = `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&h=400&q=80`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-overlay-backdrop p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="kyc-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-2xl border border-border bg-card p-6 shadow-dialog max-h-[90vh] flex flex-col space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary-subtle text-primary flex items-center justify-center">
              <ShieldCheck size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="kyc-modal-title" className="text-base font-bold text-primary">
                  {member.name}
                </h2>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-surface font-semibold text-primary border border-border">
                  {member.id}
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                    member.status === 'Active'
                      ? 'bg-success-bg text-success'
                      : 'bg-danger-bg text-danger'
                  }`}
                >
                  {member.status}
                </span>
              </div>
              <p className="text-xs text-secondary">Verified Student Identity & KYC Card</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-secondary hover:text-primary transition-colors p-1 rounded-lg hover:bg-surface-hover"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto space-y-5 pr-1 text-xs">
          {/* Top Row: Photo & Essential Info */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 p-4 rounded-xl bg-surface border border-border">
            {/* Student Photo Column */}
            <div className="sm:col-span-5 flex flex-col items-center justify-center text-center space-y-2">
              <div
                className="relative group w-32 h-36 rounded-xl border-2 border-primary overflow-hidden shadow-sm bg-surface-zebra flex items-center justify-center cursor-pointer"
                onClick={() => setIsZoomed(true)}
                title="Click to Zoom Photo"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={mockPhotoUrl}
                  alt={member.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
                <div className="absolute inset-0 bg-overlay-backdrop opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white gap-1 font-semibold text-[11px]">
                  <ZoomIn size={14} /> Zoom
                </div>
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-success bg-success-bg px-2 py-0.5 rounded-full">
                <CheckCircle2 size={12} /> Photo Verified
              </span>
            </div>

            {/* Quick Desk Parameters */}
            <div className="sm:col-span-7 space-y-2.5">
              <div className="flex items-center justify-between py-1 border-b border-border">
                <span className="text-secondary flex items-center gap-1.5">
                  <Armchair size={14} /> Assigned Seat:
                </span>
                <span className="font-bold text-primary font-mono text-sm bg-primary-subtle px-2 py-0.5 rounded">
                  {member.seat || 'S-01 (General)'}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-border">
                <span className="text-secondary flex items-center gap-1.5">
                  <Clock size={14} /> Shift Timing:
                </span>
                <span className="font-semibold text-primary">
                  {member.shift || 'Morning (06:00 AM – 02:00 PM)'}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-border">
                <span className="text-secondary flex items-center gap-1.5">
                  <GraduationCap size={14} /> Target Exam:
                </span>
                <span className="font-semibold text-primary">
                  {member.preparationFor || 'UPSC Civil Services'}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-border">
                <span className="text-secondary flex items-center gap-1.5">
                  <Phone size={14} /> Student Contact:
                </span>
                <span className="font-mono text-primary font-semibold">
                  +91 {maskManagerMemberPhone(member.phone)}
                </span>
              </div>

              <div className="flex items-center justify-between py-1">
                <span className="text-secondary flex items-center gap-1.5">
                  <Calendar size={14} /> Plan Expiry:
                </span>
                <span className="font-semibold text-primary">
                  {member.expiryDate || '31 Dec 2026'} ({member.type} Plan)
                </span>
              </div>
            </div>
          </div>

          {/* KYC Documents Section */}
          <div className="space-y-2">
            <h3 className="font-bold text-primary flex items-center gap-1.5 text-xs uppercase tracking-wider text-secondary">
              <FileText size={14} className="text-primary" /> Verified KYC Documents (2 Attached)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-xl border border-border bg-card flex items-center justify-between hover:border-primary transition-colors">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center text-primary">
                    <FileText size={16} />
                  </div>
                  <div>
                    <p className="font-semibold text-primary">Aadhaar Card (Front/Back)</p>
                    <p className="text-[11px] text-secondary">•••• •••• 4821 · PDF</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedDocPreview('Aadhaar Card (Verified Document #4821)')}
                  className="px-2 py-1 rounded-lg border border-border hover:bg-surface text-secondary hover:text-primary transition-colors"
                >
                  Preview
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4 shrink-0">
          <div className="flex items-center gap-2">
            {onQuickWhatsApp && (
              <button
                type="button"
                onClick={() => onQuickWhatsApp(member)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors cursor-pointer"
              >
                <MessageSquare size={14} /> Send WhatsApp
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 text-xs font-semibold rounded-xl border border-border bg-surface hover:bg-surface-hover text-secondary transition-colors"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onViewFullProfile(member.id);
              }}
              className="mgr-btn-primary mgr-btn-sm inline-flex items-center gap-1.5 text-xs font-semibold"
            >
              <ExternalLink size={13} /> View Full Profile
            </button>
          </div>
        </div>
      </div>

      {/* Lightboxes */}
      <ManagerMembersDirectoryDocLightbox
        isZoomed={isZoomed}
        setIsZoomed={setIsZoomed}
        selectedDocPreview={selectedDocPreview}
        setSelectedDocPreview={setSelectedDocPreview}
        mockPhotoUrl={mockPhotoUrl}
        memberName={member.name}
        memberId={member.id}
        memberJoinDate={member.joinDate}
      />
    </div>
  );
}
