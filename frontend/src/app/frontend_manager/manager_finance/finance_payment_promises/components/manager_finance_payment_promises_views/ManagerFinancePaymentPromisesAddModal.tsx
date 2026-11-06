'use client';

import React, { useState, useMemo } from 'react';
import { Calendar, CheckCircle, IndianRupee, Plus, X } from 'lucide-react';
import { SearchableCombobox, type ComboboxOption } from '@/components/ui/combobox/SearchableCombobox';
import { MANAGER_MEMBERS_DEMO_RECORDS } from '@/app/frontend_manager/manager_members/members_directory/mocks/manager_members_directory_fixtures/ManagerMembersDirectoryFixtures';
import type { ManagerFinancePaymentPromisesPaymentPromiseSample } from '@/app/frontend_manager/manager_finance/finance_payment_promises/mocks/manager_finance_payment_promises_fixtures/ManagerFinancePaymentPromisesPaymentPromiseSampleFixtures';

export interface ManagerFinancePaymentPromisesAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPromise: (promise: ManagerFinancePaymentPromisesPaymentPromiseSample) => void;
}

export function ManagerFinancePaymentPromisesAddModal({
  isOpen,
  onClose,
  onAddPromise,
}: ManagerFinancePaymentPromisesAddModalProps) {
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [studentName, setStudentName] = useState('');
  const [smartId, setSmartId] = useState('');
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('1500');
  const [expectedDate, setExpectedDate] = useState(() => {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    return nextWeek.toISOString().slice(0, 10);
  });
  const [remarks, setRemarks] = useState('');

  const studentOptions: ComboboxOption[] = useMemo(() => {
    return MANAGER_MEMBERS_DEMO_RECORDS.map((s) => ({
      value: s.id,
      label: `${s.name} (${s.id})`,
      subLabel: s.seat ? `Seat ${s.seat} · ${s.phone}` : s.phone,
      badge: s.status,
    }));
  }, []);

  if (!isOpen) return null;

  const handleSelectStudent = (val: string) => {
    if (!val) {
      setSelectedStudentId('');
      setStudentName('');
      setSmartId('');
      setPhone('');
      return;
    }
    const student = MANAGER_MEMBERS_DEMO_RECORDS.find((s) => s.id === val);
    if (student) {
      setSelectedStudentId(student.id);
      setStudentName(student.name);
      setSmartId(student.id);
      setPhone(student.phone);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !amount.trim()) return;

    const newPromise: ManagerFinancePaymentPromisesPaymentPromiseSample = {
      id: Date.now(),
      studentName: studentName.trim(),
      smartId: smartId || `LIB-${Math.floor(100 + Math.random() * 900)}`,
      promisedAmount: Number(amount) || 1000,
      expectedDate: expectedDate || new Date().toISOString().slice(0, 10),
      daysUntilDue: 7,
      status: 'pending',
      timesChanged: 0,
      remarks: remarks.trim() || 'Student counter commitment recorded by branch manager.',
    };

    onAddPromise(newPromise);
    setSelectedStudentId('');
    setStudentName('');
    setSmartId('');
    setPhone('');
    setRemarks('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay-backdrop p-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-dialog space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-primary-subtle text-primary flex items-center justify-center">
              <Plus size={18} />
            </div>
            <h2 className="text-base font-bold text-primary">Record Payment Commitment</h2>
          </div>
          <button type="button" onClick={onClose} className="text-secondary hover:text-primary p-1 rounded-lg hover:bg-surface-hover">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="text-xs font-semibold text-primary block mb-1">Select Student *</label>
            <SearchableCombobox
              options={studentOptions}
              value={selectedStudentId}
              onChange={handleSelectStudent}
              placeholder="Search student by name or Smart ID..."
              searchPlaceholder="Type name or LIB-ID..."
              aria-label="Select student for payment promise"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-primary block mb-1">Promised Amount (₹) *</label>
              <div className="relative">
                <IndianRupee size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
                <input
                  type="number"
                  required
                  min="1"
                  className="mgr-input pl-8 text-xs font-mono font-bold"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-primary block mb-1">Expected Date *</label>
              <input
                type="date"
                required
                className="mgr-input text-xs"
                value={expectedDate}
                onChange={(e) => setExpectedDate(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-primary block mb-1">Reason / Remarks</label>
            <textarea
              rows={2}
              className="mgr-input text-xs resize-none"
              placeholder="e.g. Student requested grace period until bank transfer from parents..."
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-3 border-t border-border">
            <button type="button" onClick={onClose} className="mgr-btn-ghost text-xs">
              Cancel
            </button>
            <button
              type="submit"
              disabled={!studentName.trim() || !amount.trim()}
              className="mgr-btn-primary text-xs flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCircle size={14} /> Record Commitment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
