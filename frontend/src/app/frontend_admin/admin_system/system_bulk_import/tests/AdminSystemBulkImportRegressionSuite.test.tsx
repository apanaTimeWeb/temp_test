/** Consolidated module regression suites. Each original suite remains isolated under its named describe block. */
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import type useBulkImportPage from '@/app/frontend_admin/admin_system/system_bulk_import/hooks/useAdminSystemBulkImportPage';
import AdminSystemBulkImportCompletionSection from '@/app/frontend_admin/admin_system/system_bulk_import/components/AdminSystemBulkImportCompletionSection';
import { ADMIN_SYSTEM_BULK_IMPORT_STATUS_CONFIG, ADMIN_SYSTEM_BULK_IMPORT_TEMPLATE_HEADERS } from '@/app/frontend_admin/admin_system/system_bulk_import/config/admin_system_bulk_import.url_config';
import { ADMIN_SYSTEM_BULK_IMPORT_PREVIEW_ROWS } from '@/app/frontend_admin/admin_system/system_bulk_import/mocks/scenarios/admin_system_bulk_import.scenarios';
import { parseAdminSystemBulkImportCsv } from '@/app/frontend_admin/admin_system/system_bulk_import/utils/AdminSystemBulkImportUtils';

describe('Original suite: AdminSystemBulkImportCompletionSection.test.tsx', () => {
  function createCompletionModel() {
    return {
      step: 'done',
      okCount: 3,
      errorCount: 1,
      handleReset: vi.fn(),
    } as unknown as ReturnType<typeof useBulkImportPage>;
  }

  describe('AdminSystemBulkImportCompletionSection', () => {
    it('states the demo did not persist records and disables unverified student navigation', () => {
      render(<AdminSystemBulkImportCompletionSection model={createCompletionModel()} />);

      expect(screen.getByRole('heading', { name: 'Demo Import Simulation Complete' })).toBeTruthy();
      expect(screen.getByText(/No uploaded file was parsed and no student records were saved/i)).toBeTruthy();
      expect((screen.getByRole('button', { name: /View All Students/i }) as HTMLButtonElement).disabled).toBe(true);
    });

    it('allows the user to safely restart the local preview', () => {
      const model = createCompletionModel();
      render(<AdminSystemBulkImportCompletionSection model={model} />);

      fireEvent.click(screen.getByRole('button', { name: /Import Another File/i }));
      expect(model.handleReset).toHaveBeenCalledTimes(1);
    });
  });
});

describe('Original suite: AdminSystemBulkImportRegistry.test.ts', () => {
  describe('Admin System bulk import registry', () => {
    it('keeps the import template and fixture statuses in the local registry', () => {
      expect(ADMIN_SYSTEM_BULK_IMPORT_TEMPLATE_HEADERS[0]).toBe('Name*');
      expect(ADMIN_SYSTEM_BULK_IMPORT_STATUS_CONFIG).toHaveProperty('ok');
      expect(ADMIN_SYSTEM_BULK_IMPORT_STATUS_CONFIG).toHaveProperty('warning');
      expect(ADMIN_SYSTEM_BULK_IMPORT_STATUS_CONFIG).toHaveProperty('error');
      expect(ADMIN_SYSTEM_BULK_IMPORT_PREVIEW_ROWS.every((row) => row.status in ADMIN_SYSTEM_BULK_IMPORT_STATUS_CONFIG)).toBe(true);
    });
  });
});

describe('Original suite: AdminSystemBulkImportUtils.test.ts', () => {
  describe('AdminSystemBulkImport CSV local preview parser', () => {
    it('parses actual CSV rows including quoted commas and additional template columns', () => {
      const result = parseAdminSystemBulkImportCsv('Name*,Phone*,Email,Shift*,Seat,Plan,Fee Paid,Join Date\r\n\"Rao, Priya\",9876543210,priya@example.com,Morning,S-01,Monthly,500,2026-01-01');
      expect(result.errorCode).toBeUndefined();
      expect(result.rows).toHaveLength(1);
      expect(result.rows[0]).toMatchObject({ row: 2, name: 'Rao, Priya', phone: '9876543210', email: 'priya@example.com', shift: 'Morning', seat: 'S-01', plan: 'Monthly', feePaid: '500', joinDate: '2026-01-01', status: 'ok' });
    });

    it('marks only the template-required fields as errors and optional email as a warning', () => {
      const result = parseAdminSystemBulkImportCsv('Name*,Phone*,Email,Shift*,Seat\n,9876543210,,Morning,S-01\nPriya,9876543211,,Evening,');
      expect(result.rows[0]).toMatchObject({ status: 'error', issue: 'IMPORT_ROW_NAME_REQUIRED' });
      expect(result.rows[1]).toMatchObject({ status: 'warning', issue: 'IMPORT_ROW_EMAIL_OPTIONAL' });
    });

    it('rejects missing required headers, malformed quoted values and empty data', () => {
      expect(parseAdminSystemBulkImportCsv('Name*,Phone*\nPriya,9876543210').errorCode).toBe('IMPORT_CSV_HEADER_INVALID');
      expect(parseAdminSystemBulkImportCsv('Name*,Phone*,Shift*\n\"Priya,9876543210,Morning').errorCode).toBe('IMPORT_CSV_UNTERMINATED_QUOTE');
      expect(parseAdminSystemBulkImportCsv('Name*,Phone*,Shift*').errorCode).toBe('IMPORT_CSV_EMPTY');
    });
  });


  describe('malformed CSV quote placement', () => {
    it('rejects quotes inside unquoted cells and characters after a closing quote', () => {
      expect(parseAdminSystemBulkImportCsv('name,phone,shift\nAl"ice,123,Morning')).toEqual({ rows: [], errorCode: 'IMPORT_CSV_MALFORMED_QUOTES' });
      expect(parseAdminSystemBulkImportCsv('name,phone,shift\n"Alice"x,123,Morning')).toEqual({ rows: [], errorCode: 'IMPORT_CSV_MALFORMED_QUOTES' });
    });
  });
});
