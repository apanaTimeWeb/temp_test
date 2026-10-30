import { AdminSeatsMatrixScenarios as HarnessScenarioList } from '@/app/frontend_admin/admin_seats_shifts_lockers/seats_matrix/tests/harness/bootstrap';
import { describe, expect, it } from 'vitest';

import { AdminSeatMatrixLockerListSchema, AdminSeatMatrixSeatListSchema } from '@/app/frontend_admin/admin_seats_shifts_lockers/seats_matrix/schemas/AdminSeatsMatrixApiSchema';

import { ADMIN_SEAT_MATRIX_API_LOCKERS_FIXTURE, ADMIN_SEAT_MATRIX_API_SEATS_FIXTURE } from '@/app/frontend_admin/admin_seats_shifts_lockers/seats_matrix/mocks/AdminSeatsMatrixMSWHandlers';

import { ADMIN_SEAT_MATRIX_MSW_HANDLERS } from '@/app/frontend_admin/admin_seats_shifts_lockers/seats_matrix/mocks/AdminSeatsMatrixMSWHandlers';

import { render, screen } from '@testing-library/react';

import { AdminSeatsMatrixHarness } from '@/app/frontend_admin/admin_seats_shifts_lockers/seats_matrix/tests/harness/AdminSeatsMatrixHarness';


import { ADMIN_SEAT_MATRIX_ROOT } from '@/app/frontend_admin/admin_seats_shifts_lockers/seats_matrix/config/admin_seats_matrix.url_config';

describe("Consolidated: AdminSeatsMatrixApiFixtures", () => {
    describe('admin seat matrix API/MSW contract', () => {
        it('rejects blank seat/locker identifiers while allowing empty optional details to be normalized', () => {
            expect(AdminSeatMatrixSeatListSchema.safeParse([{ id: '1', seatNumber: '   ', isActive: true }]).success).toBe(false);
            expect(AdminSeatMatrixLockerListSchema.safeParse([{ id: '1', lockerNumber: ' ', isActive: true }]).success).toBe(false);
            const normalized = AdminSeatMatrixSeatListSchema.parse([{ id: '1', seatNumber: 'S-9', isActive: true, student: ' ', smartId: '', validFrom: ' ' }]);
            expect(normalized[0]?.student).toBeUndefined();
            expect(normalized[0]?.smartId).toBeUndefined();
            expect(normalized[0]?.validFrom).toBeUndefined();
        });
        it('keeps synthetic handler payloads aligned with the Zod response schemas', () => {
            expect(AdminSeatMatrixLockerListSchema.safeParse(ADMIN_SEAT_MATRIX_API_LOCKERS_FIXTURE).success).toBe(true);
            expect(AdminSeatMatrixSeatListSchema.safeParse(ADMIN_SEAT_MATRIX_API_SEATS_FIXTURE).success).toBe(true);
            expect(ADMIN_SEAT_MATRIX_MSW_HANDLERS).toHaveLength(2);
        });
    });
});

describe("Consolidated: AdminSeatsMatrixHarness", () => {
    it('renders children when scenario is active', () => {
        render(<AdminSeatsMatrixHarness scenario="ACTIVE"><span>Harness Content</span></AdminSeatsMatrixHarness>);
        expect(screen.getByText('Harness Content')).toBeTruthy();
    });
});

describe("Consolidated: AdminSeatsMatrixMainSeatMatrixUrlContract", () => {
    describe('admin_seat_matrix canonical URL contract', () => {
        it('exports a stable route owned by this module', () => {
            expect(ADMIN_SEAT_MATRIX_ROOT).toBe('/admin/admin_seats_shifts_lockers/seats_matrix');
        });
    });
});
