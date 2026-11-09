'use client';
// RESPONSIBILITY: Orchestrate the client-side view and local interactions for components. It does not own backend persistence or cross-feature business logic.

import { useRef, useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Search, UserPlus, Download, LayoutGrid, List } from 'lucide-react';

import { ManagerLockersManagementNativeTable } from '@/app/frontend_manager/manager_seats_shifts_lockers/lockers_management/components/manager_lockers_management_table_parts/ManagerLockersManagementNativeTable';
import { managerSeatsLockerDraftSchema } from '@/app/frontend_manager/manager_seats_shifts_lockers/lockers_management/schemas/ManagerLockersManagementDraftSchemas';
import { useManagerLockersDialogFocus } from '@/app/frontend_manager/manager_seats_shifts_lockers/lockers_management/hooks/ManagerLockersManagementDialogFocus';
import { sanitizeManagerLockersCsvCell } from '@/app/frontend_manager/manager_seats_shifts_lockers/lockers_management/utils/ManagerLockersManagementCsv';
import { MANAGER_SEATS_SHIFTS_LOCKERS_SAMPLE_LOCKERS, type ManagerLockersManagementSampleLocker as Locker } from '@/app/frontend_manager/manager_seats_shifts_lockers/lockers_management/mocks/manager_lockers_management_fixtures/ManagerLockersManagementSampleFixtures';
import { getLockerColumns } from './ManagerLockersManagementColumns';
import { ManagerLockersManagementVacateModal } from './ManagerLockersManagementVacateModal';
import { ManagerLockersManagementAddModal } from './ManagerLockersManagementAddModal';
import { ManagerLockersManagementToolbar } from './ManagerLockersManagementToolbar';
import { ManagerLockersManagementGridView } from './ManagerLockersManagementGridView';
import { ManagerLockersManagementStudentModal } from './ManagerLockersManagementStudentModal';

export function ManagerLockersManagementClient() {
  const tManagerUi = useTranslations('manager.manager_lockers.ui');
  const [lockers, setLockers] = useState<Locker[]>([...MANAGER_SEATS_SHIFTS_LOCKERS_SAMPLE_LOCKERS]);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [selectedLockerStudent, setSelectedLockerStudent] = useState<Locker | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [mainTableSearch, setMainTableSearch] = useState('');
  const [showAssign, setShowAssign] = useState<Locker | null>(null);
  const [assignSearch, setAssignSearch] = useState('');
  const [freeTarget, setFreeTarget] = useState<Locker | null>(null);
  const [keyStatus, setKeyStatus] = useState<'returned' | 'lost'>('returned');
  const [remarks, setRemarks] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const activeDialog = showAddModal ? 'add-locker' : showAssign ? 'assign-locker' : freeTarget ? 'free-locker' : false;

  useManagerLockersDialogFocus(
    dialogRef,
    () => { setShowAddModal(false); setShowAssign(null); setFreeTarget(null); setSelectedLockerStudent(null); },
    activeDialog || Boolean(selectedLockerStudent)
  );

  const { watch, setValue, reset, clearErrors, formState } = useForm({
    resolver: zodResolver(managerSeatsLockerDraftSchema),
    defaultValues: { lockerId: '' },
    mode: 'onChange',
  });
  const newLockerId = watch('lockerId');
  const addError = formState.errors.lockerId?.message;

  const handleConfirmVacateLocker = () => {
    if (!freeTarget) return;
    const netRefund = keyStatus === 'lost' ? 350 : 500;
    setLockers((prev) =>
      prev.map((l) =>
        l.lockerId === freeTarget.lockerId
          ? { ...l, status: 'Free' as const, assignedTo: '-', assignedSince: '-' }
          : l
      )
    );
    toast.success(tManagerUi('vacate_success_toast', { id: freeTarget.lockerId, amount: netRefund }));
    setFreeTarget(null);
    setKeyStatus('returned');
    setRemarks('');
  };

  const handleAddLocker = () => {
    if (!newLockerId.trim()) {
      toast.error('Please enter a locker ID');
      return;
    }
    const id = newLockerId.trim().toUpperCase();
    if (lockers.some((l) => l.lockerId.toUpperCase() === id)) {
      toast.error(`Locker ${id} already exists`);
      return;
    }
    const newLocker: Locker = { id, lockerId: id, status: 'Free', assignedTo: '—', studentId: '—', assignedSince: '—' };
    setLockers((prev) => [newLocker, ...prev]);
    toast.success(`Locker ${id} added successfully`);
    setShowAddModal(false);
    reset({ lockerId: '' });
  };

  const handleExportCsv = () => {
    const headers = ['Locker ID', 'Status', 'Assigned To', 'Student ID', 'Assigned Since'];
    const rows = filtered.map((l) => [sanitizeManagerLockersCsvCell(l.lockerId), sanitizeManagerLockersCsvCell(l.status), sanitizeManagerLockersCsvCell(l.assignedTo), sanitizeManagerLockersCsvCell(l.studentId ?? '—'), sanitizeManagerLockersCsvCell(l.assignedSince)]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `lockers_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Lockers exported successfully');
  };

  const filtered = useMemo(() => {
    const q = mainTableSearch.trim().toLowerCase();
    return lockers.filter((l) => {
      const matchStatus = statusFilter === 'all' || l.status === statusFilter;
      const matchQ = !q || l.lockerId.toLowerCase().includes(q) || (l.assignedTo && l.assignedTo.toLowerCase().includes(q)) || (l.studentId && l.studentId.toLowerCase().includes(q));
      return matchStatus && matchQ;
    });
  }, [lockers, statusFilter, mainTableSearch]);

  const colDefs = useMemo(
    () =>
      getLockerColumns({
        tManagerUi,
        onShowAssign: setShowAssign,
        onSetFreeTarget: setFreeTarget,
      }),
    [tManagerUi]
  );

  return (
    <>
      <div className="ss-page">
        <div className="ss-page-header">
          <div>
            <h1 className="ss-page-title">{tManagerUi('lockers')}</h1>
            <p className="ss-page-subtitle">{tManagerUi('manage_locker_assignments_and_availability')}</p>
            <p className="ss-page-subtitle" role="status" data-testid="manager-seats-contract-warning">
              {tManagerUi('sample_data_only_writes_are_disabled_until_the_verified_8ca5b6')}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center p-1 rounded-xl bg-surface border border-border">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                aria-pressed={viewMode === 'grid'}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  viewMode === 'grid' ? 'bg-primary text-on-primary shadow-sm' : 'text-secondary hover:text-primary'
                }`}
              >
                <LayoutGrid size={13} /> Grid View
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                aria-pressed={viewMode === 'table'}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  viewMode === 'table' ? 'bg-primary text-on-primary shadow-sm' : 'text-secondary hover:text-primary'
                }`}
              >
                <List size={13} /> Table View
              </button>
            </div>

            <button
              type="button"
              className="mgr-btn-outline flex items-center gap-1.5 text-xs font-semibold py-1.5 px-3 rounded-lg border border-border bg-card hover:bg-surface-highlight transition-colors cursor-pointer"
              onClick={handleExportCsv}
            >
              <Download size={14} /> Export CSV
            </button>
            <button
              type="button"
              className="ss-btn-primary ss-btn-start"
              onClick={() => {
                reset({ lockerId: '' });
                clearErrors();
                setShowAddModal(true);
              }}
            >
              <Plus size={16} />
              {tManagerUi('add_locker')}
            </button>
          </div>
        </div>

        <ManagerLockersManagementToolbar
          lockers={lockers}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          mainTableSearch={mainTableSearch}
          setMainTableSearch={setMainTableSearch}
          tManagerUi={tManagerUi}
        />

        {filtered.length === 0 ? (
          <div className="ss-empty-state" role="status">
            <p className="ss-empty-state__icon">🔒</p>
            <p className="ss-empty-state__title">
              {statusFilter === 'all'
                ? tManagerUi('no_lockers_added_yet')
                : tManagerUi('no_lockers_match_current_filter')}
            </p>
            {statusFilter === 'all' && (
              <button
                type="button"
                className="ss-btn-primary"
                onClick={() => {
                  reset({ lockerId: '' });
                  clearErrors();
                  setShowAddModal(true);
                }}
              >
                <Plus size={15} />
                {tManagerUi('add_locker')}
              </button>
            )}
          </div>
        ) : viewMode === 'grid' ? (
          <ManagerLockersManagementGridView
            lockers={filtered}
            onSelectLocker={(l) => setSelectedLockerStudent(l)}
            onShowAssign={(l) => setShowAssign(l)}
          />
        ) : (
          <div className="ss-table-wrapper ss-grid-h-400">
            <ManagerLockersManagementNativeTable
              rows={filtered}
              columns={colDefs}
              label={tManagerUi('lockers')}
              getRowKey={(row) => String(row.lockerId)}
            />
          </div>
        )}
      </div>

      {showAddModal && (
        <ManagerLockersManagementAddModal
          dialogRef={dialogRef} newLockerId={newLockerId} addError={addError}
          onLockerIdChange={(val) => setValue('lockerId', val, { shouldDirty: true, shouldValidate: true })}
          onClose={() => setShowAddModal(false)} onSubmit={handleAddLocker}
        />
      )}

      {showAssign && (
        <div className="ss-modal-overlay" onClick={() => setShowAssign(null)}>
          <div
            ref={dialogRef}
            tabIndex={-1}
            className="ss-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="ss-locker-assign-title"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="ss-locker-assign-title" className="ss-modal-title">
              {tManagerUi('assign_locker_b581e8')} {showAssign.lockerId}
            </h2>
            <div className="ss-form-field">
              <label className="ss-label" htmlFor="rbg4-managerseatsshiftslockerslockersclient-175">
                {tManagerUi('student')} <span className="ss-text-danger">*</span>
              </label>
              <div className="ss-filter-bar__input-wrap">
                <Search size={14} className="ss-input-icon" />
                <input
                  id="rbg4-managerseatsshiftslockerslockersclient-175"
                  className="ss-input"
                  placeholder={tManagerUi('search_by_name_or_smart_id')}
                  value={assignSearch}
                  onChange={(e) => setAssignSearch(e.target.value)}
                  disabled
                  title={tManagerUi('locker_assignment_unavailable_host_mutation_contract_not_e5fc07')}
                />
              </div>
            </div>
            <div className="ss-modal-footer">
              <button type="button" className="ss-btn-ghost" onClick={() => setShowAssign(null)}>{tManagerUi('cancel')}</button>
              <button
                type="button"
                className="ss-btn-primary cursor-not-allowed"
                disabled
                title={tManagerUi('locker_assignment_unavailable_host_mutation_contract_not_e5fc07')}
              >
                <UserPlus size={14} /> {tManagerUi('assign_unavailable')}
              </button>
            </div>
          </div>
        </div>
      )}

      {freeTarget && (
        <ManagerLockersManagementVacateModal
          freeTarget={freeTarget} dialogRef={dialogRef} keyStatus={keyStatus}
          setKeyStatus={setKeyStatus} remarks={remarks} setRemarks={setRemarks}
          onClose={() => setFreeTarget(null)} onConfirm={handleConfirmVacateLocker}
        />
      )}

      {selectedLockerStudent && (
        <ManagerLockersManagementStudentModal
          locker={selectedLockerStudent}
          onClose={() => setSelectedLockerStudent(null)}
          onVacate={(l) => {
            setSelectedLockerStudent(null);
            setFreeTarget(l);
          }}
        />
      )}
    </>
  );
}
