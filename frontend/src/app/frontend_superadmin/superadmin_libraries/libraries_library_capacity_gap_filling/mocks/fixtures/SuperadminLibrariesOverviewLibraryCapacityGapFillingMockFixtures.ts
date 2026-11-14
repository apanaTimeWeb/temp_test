// RESPONSIBILITY: Define local sample fixtures for libraries library capacity gap filling; sample data does not represent live customer or backend records.
// FLOW: Feature preview/test -> superadmin_libraries/libraries_library_capacity_gap_filling/mocks/fixtures/SuperadminLibrariesOverviewLibraryCapacityGapFillingMockFixtures.ts -> typed local fixtures -> screen rendering or assertions.

/** Synthetic local preview fixture; it does not represent persisted backend state. */
export const SUPERADMIN_SYSTEM_SAMPLE_SEAT_GAPS = [
  { seat: 'S-03', booked: [{ start: 0, end: 25 }, { start: 70, end: 100 }], gap: { start: 25, end: 70,  labelKey: 'COPY.TIME_SLOT_10AM_2PM', hours: 4  } },
  { seat: 'S-07', booked: [{ start: 0, end: 45 }],                          gap: { start: 45, end: 100, labelKey: 'COPY.TIME_SLOT_12PM_6PM', hours: 6  } },
  { seat: 'S-12', booked: [{ start: 30, end: 60 }, { start: 80, end: 100 }],gap: { start: 60, end: 80,  labelKey: 'COPY.TIME_SLOT_2PM_4PM',  hours: 2  } },
  { seat: 'S-15', booked: [{ start: 0, end: 15 }],                          gap: { start: 15, end: 100, labelKey: 'COPY.TIME_SLOT_8AM_6PM',  hours: 10 } },
];
