'use client';
import { useTranslations } from 'next-intl';
import { useRef, useState } from 'react';
import { useManagerSeatMatrixDialogFocus } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_matrix/hooks/ManagerSeatsMatrixDialogFocus';

import { UserPlus, User, LogOut, Wrench, CheckCircle, Settings, History, Layers, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { SHIFT_BADGE } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_matrix/constants/ManagerSeatsMatrixConstants';
import { MANAGER_SEATS_MATRIX_ROUTES } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_matrix/config/manager_seats_matrix.url_config';
import type { ManagerSeatsMatrixModalProps } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_matrix/types/ManagerSeatsMatrixComponentTypes';
import type { ShiftType } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_matrix/types/ManagerSeatsMatrixTypes';

export function ManagerSeatsMatrixModal({ selectedSeat, onClose, onUpdateSeat }: ManagerSeatsMatrixModalProps) {
  const tManagerUi = useTranslations('manager.manager_seat_matrix.ui');
  const router = useRouter();
  const dialogRef = useRef<HTMLDivElement>(null);
  const [activeModalTab, setActiveModalTab] = useState<'actions' | 'config' | 'history'>('actions');
  const [isAssigning, setIsAssigning] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [studentShift, setStudentShift] = useState<ShiftType>('Morning');
  const [feedback, setFeedback] = useState<string | null>(null);

  // Configuration editing states
  const [configuredWing, setConfiguredWing] = useState(selectedSeat?.wing ?? 'North Reading Hall (AC)');
  const [hasSocket, setHasSocket] = useState(selectedSeat?.socketAvailable ?? true);

  useManagerSeatMatrixDialogFocus(dialogRef, onClose, Boolean(selectedSeat));

  if (!selectedSeat) return null;

  const shiftLabels: Record<string, string> = {
    Morning: tManagerUi('morning'),
    Evening: tManagerUi('evening'),
    'Full Day': tManagerUi('full_day'),
  };
  const shiftLabel = selectedSeat.shift ? (shiftLabels[selectedSeat.shift] ?? selectedSeat.shift) : '';

  const handleQuickAssign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim()) return;
    const generatedId = `SM-${Math.floor(1000 + Math.random() * 9000)}`;
    if (onUpdateSeat) {
      onUpdateSeat(selectedSeat.id, {
        status: 'occupied',
        student: studentName.trim(),
        smartId: generatedId,
        shift: studentShift,
        expiry: '2026-12-31',
      });
    }
    setFeedback(`Seat ${selectedSeat.id} successfully allocated to ${studentName.trim()}`);
    setTimeout(() => {
      setFeedback(null);
      setIsAssigning(false);
      onClose();
    }, 1200);
  };

  const handleVacateSeat = () => {
    if (onUpdateSeat) {
      onUpdateSeat(selectedSeat.id, {
        status: 'free',
        student: '',
        smartId: '',
        shift: undefined,
        expiry: undefined,
      });
    }
    setFeedback(`Seat ${selectedSeat.id} has been vacated`);
    setTimeout(() => {
      setFeedback(null);
      onClose();
    }, 1000);
  };

  const handleToggleMaintenance = () => {
    const nextStatus = selectedSeat.status === 'maintenance' ? 'free' : 'maintenance';
    if (onUpdateSeat) {
      onUpdateSeat(selectedSeat.id, { status: nextStatus });
    }
    setFeedback(nextStatus === 'maintenance' ? `Seat ${selectedSeat.id} marked under maintenance` : `Seat ${selectedSeat.id} marked available`);
    setTimeout(() => {
      setFeedback(null);
      onClose();
    }, 1000);
  };

  const handleSaveConfiguration = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateSeat) {
      onUpdateSeat(selectedSeat.id, {
        wing: configuredWing,
        socketAvailable: hasSocket,
      });
    }
    setFeedback(`Seat ${selectedSeat.id} configuration updated`);
    setTimeout(() => {
      setFeedback(null);
      setActiveModalTab('actions');
    }, 1000);
  };

  return (
    <div className="ss-modal-overlay flex items-center justify-center fixed inset-0 z-50 bg-overlay" onClick={onClose}>
      <div ref={dialogRef} tabIndex={-1} className="ss-modal bg-card p-6 rounded-xl shadow-xl w-full max-w-lg border border-border" role="dialog" aria-modal="true" aria-labelledby="ss-seat-modal-title" onClick={e => e.stopPropagation()}>
        <h2 id="ss-seat-modal-title" className="sr-only">{tManagerUi('seat_b90b32')} {selectedSeat.id}</h2>

        {/* Modal Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setActiveModalTab('actions')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                activeModalTab === 'actions' ? 'bg-primary text-on-primary' : 'text-secondary hover:bg-floating hover:text-primary'
              }`}
            >
              <Layers size={14} /> Actions
            </button>
            <button
              type="button"
              onClick={() => setActiveModalTab('config')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                activeModalTab === 'config' ? 'bg-primary text-on-primary' : 'text-secondary hover:bg-floating hover:text-primary'
              }`}
            >
              <Settings size={14} /> Configure
            </button>
            <button
              type="button"
              onClick={() => setActiveModalTab('history')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                activeModalTab === 'history' ? 'bg-primary text-on-primary' : 'text-secondary hover:bg-floating hover:text-primary'
              }`}
            >
              <History size={14} /> History
            </button>
          </div>
          <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-floating text-secondary border border-border">
            {selectedSeat.id}
          </span>
        </div>

        {feedback && (
          <div className="mb-4 p-3 bg-success-bg border border-success text-success text-sm rounded-lg flex items-center gap-2" role="status">
            <CheckCircle size={16} />
            <span>{feedback}</span>
          </div>
        )}

        {/* TAB 1: ACTIONS TAB */}
        {activeModalTab === 'actions' && (
          <>
            {selectedSeat.status === 'free' ? (
              <>
                <div className="ss-occupied-header__row mb-4 flex justify-between items-center">
                  <span className="ss-badge ss-badge--success">{tManagerUi('free')}</span>
                  <span className="ss-occupied-header__seat text-lg font-bold">{tManagerUi('seat_b90b32')} {selectedSeat.id}</span>
                </div>

                {isAssigning ? (
                  <form onSubmit={handleQuickAssign} className="space-y-4 mb-4">
                    <div>
                      <label htmlFor="quick-student-name" className="text-xs font-semibold text-secondary uppercase block mb-1">Student Name</label>
                      <input
                        id="quick-student-name"
                        type="text"
                        required
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        placeholder="Enter student name"
                        className="mgr-input w-full"
                        autoFocus
                      />
                    </div>
                    <div>
                      <label htmlFor="quick-student-shift" className="text-xs font-semibold text-secondary uppercase block mb-1">Shift</label>
                      <select
                        id="quick-student-shift"
                        value={studentShift}
                        onChange={(e) => setStudentShift(e.target.value as ShiftType)}
                        className="mgr-select w-full"
                      >
                        <option value="Morning">Morning</option>
                        <option value="Evening">Evening</option>
                        <option value="Full Day">Full Day</option>
                      </select>
                    </div>
                    <div className="flex gap-2">
                      <button type="button" className="mgr-btn-ghost flex-1" onClick={() => setIsAssigning(false)}>{tManagerUi('close')}</button>
                      <button type="submit" className="mgr-btn-primary flex-1">Confirm Allocation</button>
                    </div>
                  </form>
                ) : (
                  <>
                    <p className="ss-text-secondary ss-text-caption mb-6">{tManagerUi('this_seat_is_available_for_assignment')}</p>
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <button type="button" className="mgr-btn-ghost flex-1" onClick={onClose}>{tManagerUi('close')}</button>
                        <button type="button"
                          className="mgr-btn-primary flex-1 flex items-center justify-center gap-2"
                          onClick={() => setIsAssigning(true)}
                        >
                          <UserPlus size={15} /> Quick Allocate
                        </button>
                      </div>
                      <div className="flex gap-2 pt-2 border-t border-border">
                        <button type="button"
                          className="mgr-btn-ghost flex-1 text-xs text-secondary flex items-center justify-center gap-1.5"
                          onClick={() => router.push(`${MANAGER_SEATS_MATRIX_ROUTES.ASSIGN_STUDENT}?seat=${encodeURIComponent(selectedSeat.id)}`)}
                        >
                          <UserPlus size={13} /> {tManagerUi('assign_student')} (Form)
                        </button>
                        <button type="button"
                          className="mgr-btn-ghost flex-1 text-xs text-warning flex items-center justify-center gap-1.5"
                          onClick={handleToggleMaintenance}
                        >
                          <Wrench size={13} /> Mark Maintenance
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </>
            ) : selectedSeat.status === 'unknown' ? (
              <>
                <div className="ss-occupied-header__row mb-4 flex justify-between items-center">
                  <span className="mgr-badge bg-floating text-secondary">{tManagerUi('unknown_status')}</span>
                  <span className="ss-occupied-header__seat text-lg font-bold">{tManagerUi('seat_b90b32')} {selectedSeat.id}</span>
                </div>
                <p className="ss-text-secondary ss-text-caption mb-6">{tManagerUi('unknown_status')}</p>
                <div className="ss-modal-footer flex">
                  <button type="button" className="mgr-btn-ghost w-full" onClick={onClose}>{tManagerUi('close')}</button>
                </div>
              </>
            ) : selectedSeat.status === 'maintenance' ? (
              <>
                <div className="ss-occupied-header__row mb-4 flex justify-between items-center">
                  <span className="mgr-badge bg-floating text-secondary">{tManagerUi('maintenance')}</span>
                  <span className="ss-occupied-header__seat text-lg font-bold">{tManagerUi('seat_b90b32')} {selectedSeat.id}</span>
                </div>
                <p className="ss-text-secondary ss-text-caption mb-6">{tManagerUi('this_seat_is_under_maintenance_and_unavailable')}</p>
                <div className="ss-modal-footer flex gap-3">
                  <button type="button" className="mgr-btn-ghost flex-1" onClick={onClose}>{tManagerUi('close')}</button>
                  <button type="button" className="mgr-btn-primary flex-1 flex items-center justify-center gap-2" onClick={handleToggleMaintenance}>
                    <CheckCircle size={15} /> Mark Available
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="ss-occupied-header -m-6 mb-6 p-6 bg-floating rounded-t-xl">
                  <div className="ss-occupied-header__row flex justify-between items-center mb-4">
                    <span className={`mgr-badge ${selectedSeat.status === 'expiring' ? 'mgr-badge--warning' : 'mgr-badge--danger'}`}>
                      {selectedSeat.status === 'expiring' ? tManagerUi('expiring_soon') : tManagerUi('occupied')}
                    </span>
                    <span className="ss-occupied-header__seat font-bold">{tManagerUi('seat_b90b32')} {selectedSeat.id}</span>
                  </div>
                  <div className="ss-occupied-avatar-wrap flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-card flex items-center justify-center mb-3">
                      <User size={32} className="text-secondary" />
                    </div>
                    <h3 className="text-primary font-semibold text-lg">{selectedSeat.student}</h3>
                    <p className="text-secondary text-sm">{selectedSeat.smartId}</p>
                  </div>
                </div>
                <div className="ss-detail-grid grid grid-cols-2 gap-4">
                  <div className="ss-detail-cell bg-floating p-3 rounded-lg">
                    <p className="text-secondary text-xs uppercase mb-1">{tManagerUi('shift_469d5b')}</p>
                    <span className={SHIFT_BADGE[selectedSeat.shift ?? ''] ?? 'mgr-badge bg-floating'}>
                      {shiftLabel}
                    </span>
                  </div>
                  <div className="ss-detail-cell bg-floating p-3 rounded-lg">
                    <p className="text-secondary text-xs uppercase mb-1">{tManagerUi('expires')}</p>
                    <p className={`font-semibold ${selectedSeat.status === 'expiring' ? 'text-danger' : 'text-primary'}`}>
                      {selectedSeat.expiry}
                    </p>
                  </div>
                </div>
                <div className="ss-modal-footer flex flex-col gap-3 mt-6">
                  <div className="flex gap-3">
                    <button type="button" className="mgr-btn-ghost flex-1" onClick={onClose}>{tManagerUi('close')}</button>
                    <button type="button" className="mgr-btn-primary flex-1" disabled={!selectedSeat.smartId} title={!selectedSeat.smartId ? tManagerUi('student_profile_cannot_be_opened_until_this_seat_respons_e570ab') : undefined} onClick={() => { if (selectedSeat.smartId) router.push(MANAGER_SEATS_MATRIX_ROUTES.STUDENTS_FILTER_BY_SMART_ID(selectedSeat.smartId)); }}>{tManagerUi('view_full_profile')}</button>
                  </div>
                  <div className="flex gap-2 pt-2 border-t border-border">
                    <button type="button" className="mgr-btn-ghost flex-1 text-xs text-danger flex items-center justify-center gap-1.5" onClick={handleVacateSeat}>
                      <LogOut size={13} /> Vacate Seat
                    </button>
                    <button type="button" className="mgr-btn-ghost flex-1 text-xs text-warning flex items-center justify-center gap-1.5" onClick={handleToggleMaintenance}>
                      <Wrench size={13} /> Maintenance
                    </button>
                  </div>
                </div>
              </>
            )}
          </>
        )}

        {/* TAB 2: EDIT CONFIGURATION TAB */}
        {activeModalTab === 'config' && (
          <form onSubmit={handleSaveConfiguration} className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="seat-config-wing" className="text-xs font-semibold text-secondary uppercase block">Wing / Reading Hall</label>
              <select
                id="seat-config-wing"
                value={configuredWing}
                onChange={(e) => setConfiguredWing(e.target.value)}
                className="mgr-select w-full"
              >
                <option value="North Reading Hall (AC)">North Reading Hall (AC)</option>
                <option value="South Reading Hall (AC)">South Reading Hall (AC)</option>
                <option value="Silent Study Zone">Silent Study Zone</option>
                <option value="First Floor Main Wing">First Floor Main Wing</option>
                <option value="Executive Cubicles">Executive Cubicles</option>
              </select>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-floating border border-border">
              <input
                id="seat-config-socket"
                type="checkbox"
                checked={hasSocket}
                onChange={(e) => setHasSocket(e.target.checked)}
                className="rounded border-border text-primary focus:ring-primary h-4 w-4"
              />
              <label htmlFor="seat-config-socket" className="text-sm font-medium text-primary flex items-center gap-2 cursor-pointer">
                <Zap size={16} className="text-warning" />
                Dedicated Electrical Power Socket Available
              </label>
            </div>

            <div className="p-3 rounded-xl bg-card border border-border text-xs space-y-1.5">
              <p className="font-semibold text-primary">Physical Desk Specifications</p>
              <p className="text-secondary">• Seat Numbering: <span className="font-mono font-bold text-primary">{selectedSeat.id}</span></p>
              <p className="text-secondary">• Desk Type: Standard Study Carrel with Partition</p>
              <p className="text-secondary">• Status: <span className="capitalize font-semibold text-primary">{selectedSeat.status}</span></p>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" className="mgr-btn-ghost flex-1" onClick={() => setActiveModalTab('actions')}>Back</button>
              <button type="submit" className="mgr-btn-primary flex-1">Save Configuration</button>
            </div>
          </form>
        )}

        {/* TAB 3: OCCUPANCY & MAINTENANCE HISTORY */}
        {activeModalTab === 'history' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-primary">Recent Seat Log & Audit</h3>
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1 text-xs">
              <div className="p-3 rounded-lg bg-floating border border-border">
                <div className="flex items-center justify-between font-semibold text-primary mb-1">
                  <span>Current Allotment</span>
                  <span className="text-success font-mono">Active</span>
                </div>
                <p className="text-secondary">Student: {selectedSeat.student || 'None (Seat Free)'}</p>
                <p className="text-secondary">Shift: {selectedSeat.shift || 'None'} • Expiry: {selectedSeat.expiry || 'N/A'}</p>
              </div>

              <div className="p-3 rounded-lg bg-card border border-border">
                <div className="flex items-center justify-between font-semibold text-primary mb-1">
                  <span>Maintenance Check</span>
                  <span className="text-secondary">2026-01-05</span>
                </div>
                <p className="text-secondary">Routine electrical safety inspection and chair armrest tightening completed.</p>
              </div>

              <div className="p-3 rounded-lg bg-card border border-border">
                <div className="flex items-center justify-between font-semibold text-primary mb-1">
                  <span>Previous Occupant (Priya Verma)</span>
                  <span className="text-secondary">Expired</span>
                </div>
                <p className="text-secondary">Evening Shift (SM-3190) • Completed without incidents.</p>
              </div>
            </div>

            <div className="pt-2">
              <button type="button" className="mgr-btn-ghost w-full" onClick={() => setActiveModalTab('actions')}>Back to Actions</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
