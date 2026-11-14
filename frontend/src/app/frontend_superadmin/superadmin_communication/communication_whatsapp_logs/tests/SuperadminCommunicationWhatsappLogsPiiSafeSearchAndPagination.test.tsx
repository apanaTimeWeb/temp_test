// RESPONSIBILITY: Protect local-only PII search, accessible sort state, and the rows-per-page contract.
// Host Vitest/RTL execution requires the omitted host package and test configuration.
import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import messages from '@/app/frontend_superadmin/superadmin_communication/communication_whatsapp_logs/locales/superadmin_communication_whatsapp_logs_en.json';
import SuperadminCommunicationWhatsappLogsSemanticTable from '@/app/frontend_superadmin/superadmin_communication/communication_whatsapp_logs/components/SuperadminCommunicationWhatsappLogsSemanticTable';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const leaf = join(dirname(fileURLToPath(import.meta.url)), '..');
const hookSource = readFileSync(join(leaf, 'hooks/useSuperadminCommunicationWhatsappLogsSemanticTableState.ts'), 'utf8');
const tableSource = readFileSync(join(leaf, 'components/SuperadminCommunicationWhatsappLogsSemanticTable.tsx'), 'utf8');
const pageSource = readFileSync(join(leaf, 'components/SuperadminCommunicationWhatsappLogsPageClient.tsx'), 'utf8');
const rows = Array.from({ length: 60 }, (_, index) => ({ id: `row-${index}`, name: `Sample row ${index + 1}` }));
const columns = [{ field: 'name', headerName: 'Name' }];

describe('whatsapp logs privacy and semantic table contracts', () => {
  it('never writes free-text filter content to the URL and removes the legacy search key', () => {
    expect(hookSource).toContain("params.delete('sa_communication_whatsapp_logs_search')");
    expect(hookSource).not.toContain("params.set('sa_communication_whatsapp_logs_search'");
    expect(hookSource).not.toContain("params.get('sa_communication_whatsapp_logs_search'");
  });
  it('exposes sort state and the 10/25/50 page-size choices accessibly', () => {
    expect(tableSource).toContain('aria-sort={canSort ? ariaSort : undefined}');
    expect(tableSource).toContain('paginationPageSizeSelector = [10, 25, 50]');
    expect(pageSource).toContain('paginationPageSizeSelector={[10, 25, 50]}');
  });
  it('uses the module-owned polite live region for page-level filtered emptiness', () => {
    expect(pageSource).toContain('<SuperadminCommunicationWhatsappLogsEmptyState filtered />');
  });
  it('changes the visible row count for 10, 25, and 50 and resets the current page', () => {
    render(<NextIntlClientProvider locale="en" messages={messages}><SuperadminCommunicationWhatsappLogsSemanticTable rowData={rows} columnDefs={columns} pagination paginationPageSize={10} paginationPageSizeSelector={[10, 25, 50]} getRowId={({ data }) => data.id} /></NextIntlClientProvider>);
    const pageSize = screen.getByRole('combobox', { name: 'Rows per page' });
    expect(screen.getAllByRole('row')).toHaveLength(11);
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    fireEvent.change(pageSize, { target: { value: '25' } });
    expect(screen.getAllByRole('row')).toHaveLength(26);
    expect(screen.getByText('1–25 of 60')).toBeTruthy();
    fireEvent.change(pageSize, { target: { value: '50' } });
    expect(screen.getAllByRole('row')).toHaveLength(51);
    expect(screen.getByText('1–50 of 60')).toBeTruthy();
    fireEvent.change(pageSize, { target: { value: '10' } });
    expect(screen.getAllByRole('row')).toHaveLength(11);
    expect(screen.getByText('1–10 of 60')).toBeTruthy();
  });

});
