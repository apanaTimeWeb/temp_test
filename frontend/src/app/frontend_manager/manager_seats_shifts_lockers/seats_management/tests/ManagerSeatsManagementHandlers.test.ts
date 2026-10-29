// @vitest-environment jsdom
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { createElement } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NextIntlClientProvider } from 'next-intl';
import { render, screen } from '@testing-library/react';
import enMessages from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_management/locales/manager_seats_management_domain_en.json';
import { ManagerSeatsManagementSeatManagementClient } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_management/components/manager_seats_management_views/ManagerSeatsManagementSeatManagementClient';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { MANAGER_SEATS_MANAGEMENT_API } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_management/config/manager_seats_management.url_config';
import {
  MANAGER_SEATS_SHIFTS_LOCKERS_ALLOCATIONS_FIXTURE,
  MANAGER_SEATS_SHIFTS_LOCKERS_HISTORY_FIXTURE,
  MANAGER_SEATS_SHIFTS_LOCKERS_LOCKERS_FIXTURE,
  MANAGER_SEATS_SHIFTS_LOCKERS_SEAT_MATRIX_FIXTURE,
} from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_management/mocks/manager_seats_management_fixtures/ManagerSeatsManagementApiFixtures';
import { managerSeatsShiftsLockersHandlers } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_management/mocks/manager_seats_management_handlers/ManagerSeatsManagementHandlers';
import { normalizeManagerSeatsAllocationStatus } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_management/utils/ManagerSeatsManagementStatusNormalization';
import { normalizeManagerLockerMatrixStatus, normalizeManagerSeatMatrixStatus } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_management/utils/ManagerSeatsManagementMatrixStatus';

vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn(), replace: vi.fn(), refresh: vi.fn() }) }));

const server = setupServer(...managerSeatsShiftsLockersHandlers);
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Manager Seats/Shifts/Lockers read-only MSW fixtures', () => {
  it('serves mapper-compatible payloads from all four existing GET URLs', async () => {
    const paths = [MANAGER_SEATS_MANAGEMENT_API.SEAT_MATRIX, MANAGER_SEATS_MANAGEMENT_API.LOCKERS, MANAGER_SEATS_MANAGEMENT_API.ALLOCATIONS, MANAGER_SEATS_MANAGEMENT_API.HISTORY];
    const responses = await Promise.all(paths.map((url) => fetch(`http://localhost${url}`)));
    expect(responses.every((response) => response.ok)).toBe(true);
    const [seats, lockers, allocations, history] = await Promise.all(responses.map((response) => response.json()));
    expect(seats).toEqual(MANAGER_SEATS_SHIFTS_LOCKERS_SEAT_MATRIX_FIXTURE);
    expect(lockers).toEqual(MANAGER_SEATS_SHIFTS_LOCKERS_LOCKERS_FIXTURE);
    expect(allocations).toEqual(MANAGER_SEATS_SHIFTS_LOCKERS_ALLOCATIONS_FIXTURE);
    expect(history).toEqual(MANAGER_SEATS_SHIFTS_LOCKERS_HISTORY_FIXTURE);
    expect(allocations.every((row: Record<string, unknown>) => ['id', 'studentName', 'smartId', 'seatNo', 'shift', 'validFrom', 'validTill'].every((key) => typeof row[key] === 'string' && String(row[key]).trim().length > 0) && typeof row.daysLeft === 'number' && Number.isFinite(row.daysLeft))).toBe(true);
  });

  it('serves empty/error states through an existing GET handler only', async () => {
    const emptyResponse = await fetch(`http://localhost${MANAGER_SEATS_MANAGEMENT_API.SEAT_MATRIX}?__testMode=empty`);
    const errorResponse = await fetch(`http://localhost${MANAGER_SEATS_MANAGEMENT_API.SEAT_MATRIX}?__testMode=error`);
    expect(await emptyResponse.json()).toEqual([]);
    expect(errorResponse.status).toBe(503);
    expect(managerSeatsShiftsLockersHandlers).toHaveLength(4);
  });



  it('renders the live seat-matrix query result rather than the preview fixture', async () => {
    server.use(
      http.get(MANAGER_SEATS_MANAGEMENT_API.SEAT_MATRIX, () => HttpResponse.json({
        success: true, message: 'Seat matrix loaded', requestId: 'test-seat-matrix-ui',
        data: [{ id: 'S-API-017', seatNumber: 'S-API-017', status: 'occupied', studentName: 'Verified API Student', smartId: 'API-017', shift: 'Morning', expiryDate: '2026-11-30' }],
      })),
    );
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    render(createElement(NextIntlClientProvider, {
      locale: 'en',
      messages: enMessages,
      children: createElement(QueryClientProvider, { client: queryClient }, createElement(ManagerSeatsManagementSeatManagementClient)),
    }));
    expect(await screen.findByText('Verified API Student')).toBeTruthy();
    expect(screen.getByText('API-017')).toBeTruthy();
    expect(screen.getAllByText('—').length).toBeGreaterThan(0);
    queryClient.clear();
  });

  it('keeps unrecognized statuses unknown rather than implying a successful state', () => {
    expect(normalizeManagerSeatMatrixStatus('future-status-test')).toBe('unknown');
    expect(normalizeManagerLockerMatrixStatus('future-status-test')).toBe('unknown');
    expect(normalizeManagerSeatsAllocationStatus('UnrecognizedTestStatus')).toBe('unknown');
  });
});
