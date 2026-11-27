import { existsSync,readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe,expect,it } from 'vitest';
import {
autoAllocateAdjacentSeats,
getAdjacentSeatSuggestions,
isAdjacentSeat
} from '../utils/ManagerMembersGroupAdmissionAdjacentSeats';

const moduleRoot = [
  join(process.cwd(), 'src/app/frontend_manager/manager_members/members_group_admission'),
  join(process.cwd(), 'frontend/src/app/frontend_manager/manager_members/members_group_admission'),
].find(existsSync);

const readSource = (relativePath: string) => {
  if (!moduleRoot) throw new Error('Could not locate module root');
  return readFileSync(join(moduleRoot, relativePath), 'utf8');
};

describe('Manager Members Group Admission - Smart Adjacent Seat Allocation', () => {
  it('generates adjacent seat clusters and suggestions for various group sizes', () => {
    const suggestionsFor3 = getAdjacentSeatSuggestions(3);
    expect(suggestionsFor3.length).toBe(4);
    expect(suggestionsFor3[0]?.suggestedSeats).toEqual(['S-01', 'S-02', 'S-03']);
    expect(suggestionsFor3[1]?.suggestedSeats).toEqual(['S-07', 'S-08', 'S-09']);
    expect(suggestionsFor3[0]?.isExactOrSpill).toBe(true);

    const suggestionsFor4 = getAdjacentSeatSuggestions(4);
    expect(suggestionsFor4[0]?.suggestedSeats).toEqual(['S-01', 'S-02', 'S-03', 'S-04']);
  });

  it('allocates contiguous adjacent seats in 1-click for study groups and batches', () => {
    // 3 students in Row A
    const allocatedRowA = autoAllocateAdjacentSeats(3, 'row-a');
    expect(allocatedRowA).toEqual(['S-01', 'S-02', 'S-03']);

    // 4 students in Row B
    const allocatedRowB = autoAllocateAdjacentSeats(4, 'row-b');
    expect(allocatedRowB).toEqual(['S-07', 'S-08', 'S-09', 'S-10']);

    // 2 students in Row C
    const allocatedRowC = autoAllocateAdjacentSeats(2, 'row-c');
    expect(allocatedRowC).toEqual(['S-13', 'S-14']);
  });

  it('correctly detects adjacent desk pairings', () => {
    expect(isAdjacentSeat('S-01', 'S-02')).toBe(true);
    expect(isAdjacentSeat('S-02', 'S-03')).toBe(true);
    expect(isAdjacentSeat('S-01', 'S-03')).toBe(false);
    expect(isAdjacentSeat('S-05', 'S-12')).toBe(false);
    expect(isAdjacentSeat('S-01', 'S-01')).toBe(false);
  });

  it('renders smart adjacent seat allocation panel in Manual Modal', () => {
    const modalSource =
      readSource('components/manager_members_group_admission_forms/ManagerMembersGroupAdmissionManualModal.tsx') +
      readSource('components/manager_members_group_admission_forms/ManagerMembersGroupAdmissionAdjacentClusterPanel.tsx');
    expect(modalSource).toContain('Smart Adjacent Seat Allocation');
    expect(modalSource).toContain('1-Click Auto Assign Adjacent Seats');
    expect(modalSource).toContain('Auto-allocate contiguous desks so friends and batchmates sit side-by-side');
    expect(modalSource).toContain('Assigned Desks:');
  });

  it('renders assigned seat selection and adjacent pairing in Card View and Table View', () => {
    const cardSource = readSource('components/manager_members_group_admission_forms/ManagerMembersGroupAdmissionCardView.tsx');
    expect(cardSource).toContain('Assigned Seat *');
    expect(cardSource).toContain('Adjacent Pair');

    const tableSource = readSource('components/manager_members_group_admission_forms/ManagerMembersGroupAdmissionTableView.tsx');
    expect(tableSource).toContain('Assigned Seat');
    expect(tableSource).toContain('ALL_SEAT_OPTIONS');
  });

  it('auto-allocates adjacent seats during bulk CSV upload preview', () => {
    const bulkSource = readSource('components/manager_members_group_admission_dialogs/ManagerMembersGroupAdmissionBulkModal.tsx');
    expect(bulkSource).toContain('autoAllocateAdjacentSeats');
    expect(bulkSource).toContain('Assigned Adjacent Seat');
    expect(bulkSource).toContain('(Adjacent)');
  });
});
