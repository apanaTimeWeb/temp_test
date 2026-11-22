// RESPONSIBILITY: Provide adjacent seat clusters, smart suggestions, and 1-click contiguous allocation for group/batch admissions.

export interface SeatCluster {
  id: string;
  name: string;
  zone: string;
  seats: string[];
}

export const ALL_SEAT_OPTIONS: string[] = Array.from({ length: 24 }, (_, i) => {
  return `S-${String(i + 1).padStart(2, '0')}`;
});

export const MANAGER_GROUP_SEAT_CLUSTERS: SeatCluster[] = [
  {
    id: 'row-a',
    name: 'Row A (Quiet Study Zone - Floor 1)',
    zone: 'Floor 1',
    seats: ['S-01', 'S-02', 'S-03', 'S-04', 'S-05', 'S-06'],
  },
  {
    id: 'row-b',
    name: 'Row B (AC Main Hall - Floor 1)',
    zone: 'Floor 1',
    seats: ['S-07', 'S-08', 'S-09', 'S-10', 'S-11', 'S-12'],
  },
  {
    id: 'row-c',
    name: 'Row C (Window Side - Floor 2)',
    zone: 'Floor 2',
    seats: ['S-13', 'S-14', 'S-15', 'S-16', 'S-17', 'S-18'],
  },
  {
    id: 'row-d',
    name: 'Row D (Dedicated Desk Hub - Floor 2)',
    zone: 'Floor 2',
    seats: ['S-19', 'S-20', 'S-21', 'S-22', 'S-23', 'S-24'],
  },
];

/**
 * Returns seat clusters that can accommodate the group size contiguously.
 */
export function getAdjacentSeatSuggestions(groupSize: number): {
  cluster: SeatCluster;
  suggestedSeats: string[];
  isExactOrSpill: boolean;
}[] {
  const safeCount = Math.max(1, groupSize);
  return MANAGER_GROUP_SEAT_CLUSTERS.map((cluster) => {
    return {
      cluster,
      suggestedSeats: cluster.seats.slice(0, Math.min(cluster.seats.length, safeCount)),
      isExactOrSpill: cluster.seats.length >= safeCount,
    };
  });
}

/**
 * Auto-allocates contiguous adjacent seats for a group from the chosen cluster or first available cluster.
 */
export function autoAllocateAdjacentSeats(
  studentsCount: number,
  preferredClusterId: string = 'row-a'
): string[] {
  const chosenIndex = MANAGER_GROUP_SEAT_CLUSTERS.findIndex((c) => c.id === preferredClusterId);
  const baseIndex = chosenIndex >= 0 ? chosenIndex : 0;
  const chosenCluster = MANAGER_GROUP_SEAT_CLUSTERS[baseIndex] || MANAGER_GROUP_SEAT_CLUSTERS[0];
  if (!chosenCluster) return [];

  const allocated: string[] = [];
  for (let i = 0; i < studentsCount; i++) {
    const clusterOffset = Math.floor(i / chosenCluster.seats.length);
    const activeClusterIndex = (baseIndex + clusterOffset) % MANAGER_GROUP_SEAT_CLUSTERS.length;
    const currentCluster = MANAGER_GROUP_SEAT_CLUSTERS[activeClusterIndex] || chosenCluster;
    const seatIndex = i % chosenCluster.seats.length;
    const seat = currentCluster.seats[seatIndex] || `S-${String(i + 1).padStart(2, '0')}`;
    allocated.push(seat);
  }
  return allocated;
}

/**
 * Helper to check if two seats are adjacent on the same table.
 */
export function isAdjacentSeat(seatA: string, seatB: string): boolean {
  if (!seatA || !seatB || seatA === seatB) return false;
  const numA = parseInt(seatA.replace(/\D/g, ''), 10);
  const numB = parseInt(seatB.replace(/\D/g, ''), 10);
  if (isNaN(numA) || isNaN(numB)) return false;
  return Math.abs(numA - numB) === 1;
}
