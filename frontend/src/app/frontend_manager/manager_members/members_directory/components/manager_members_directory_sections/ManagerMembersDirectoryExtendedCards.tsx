'use client';

import React from 'react';
import { Armchair, Clock, Layers, Lock, User, GraduationCap, Pencil } from 'lucide-react';
import type { ManagerMembersDirectoryRecord } from '../../types/ManagerMembersDirectoryTypes';

interface ManagerMembersDirectoryExtendedCardsProps {
  member: ManagerMembersDirectoryRecord;
  onEdit: () => void;
}

export function ManagerMembersDirectoryExtendedCards({
  member,
  onEdit,
}: ManagerMembersDirectoryExtendedCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Seat & Shift Details */}
      <div className="p-5 rounded-2xl bg-card border border-border space-y-3">
        <div className="flex items-center justify-between border-b border-border pb-2">
          <h4 className="font-bold text-primary flex items-center gap-2 text-sm">
            <Armchair size={16} className="text-primary" /> Seat & Shift Allotment
          </h4>
          <button
            type="button"
            onClick={onEdit}
            className="text-xs text-info hover:text-info-hover font-semibold inline-flex items-center gap-1 cursor-pointer"
            title="Change Seat, Shift, or Locker"
          >
            <Pencil size={11} /> Edit
          </button>
        </div>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-secondary flex items-center gap-1.5"><Armchair size={14} /> Assigned Seat:</span>
            <span className="font-bold text-primary bg-primary-subtle px-2 py-0.5 rounded">{member.seat || 'Unassigned'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-secondary flex items-center gap-1.5"><Clock size={14} /> Shift Timing:</span>
            <span className="font-semibold text-primary">{member.shift || 'Not Selected'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-secondary flex items-center gap-1.5"><Layers size={14} /> Floor:</span>
            <span className="font-medium text-primary">{member.floor || 'Unallocated'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-secondary flex items-center gap-1.5"><Lock size={14} /> Locker:</span>
            <span className="font-medium text-primary">{member.locker || 'None'}</span>
          </div>
        </div>
      </div>

      {/* Parent & Guardian Information */}
      <div className="p-5 rounded-2xl bg-card border border-border space-y-3">
        <div className="flex items-center justify-between border-b border-border pb-2">
          <h4 className="font-bold text-primary flex items-center gap-2 text-sm">
            <User size={16} className="text-info" /> Guardian & Family Info
          </h4>
          <button
            type="button"
            onClick={onEdit}
            className="text-xs text-info hover:text-info-hover font-semibold inline-flex items-center gap-1 cursor-pointer"
            title="Edit Guardian Details"
          >
            <Pencil size={11} /> Edit
          </button>
        </div>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-secondary">Parent / Guardian:</span>
            <span className="font-bold text-primary">{member.guardian || 'Not Provided'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-secondary">Guardian Contact:</span>
            <span className="font-mono text-primary">{member.emergencyContact || 'Not Provided'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-secondary">Gender:</span>
            <span className="font-medium text-primary">{member.gender || 'Not Specified'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-secondary">Date of Birth:</span>
            <span className="font-medium text-primary">{member.dob || 'Not Provided'}</span>
          </div>
        </div>
      </div>

      {/* Academic & Goal Preparation */}
      <div className="p-5 rounded-2xl bg-card border border-border space-y-3">
        <div className="flex items-center justify-between border-b border-border pb-2">
          <h4 className="font-bold text-primary flex items-center gap-2 text-sm">
            <GraduationCap size={16} className="text-success" /> Academic & Target Goal
          </h4>
          <button
            type="button"
            onClick={onEdit}
            className="text-xs text-info hover:text-info-hover font-semibold inline-flex items-center gap-1 cursor-pointer"
            title="Edit Academic Goal"
          >
            <Pencil size={11} /> Edit
          </button>
        </div>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-secondary">Target Preparation:</span>
            <span className="font-bold text-success bg-success-bg px-2 py-0.5 rounded">{member.preparationFor || 'General Study'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-secondary">Course / Stream:</span>
            <span className="font-medium text-primary">{member.department || 'General Studies & Research'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

