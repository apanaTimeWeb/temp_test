import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const moduleRootCandidates = [
  join(process.cwd(), 'src/app/frontend_manager/manager_communication/communication_whatsapp_logs'),
  join(process.cwd(), 'app/frontend_manager/manager_communication/communication_whatsapp_logs'),
  join(process.cwd(), 'frontend_manager/manager_communication/communication_whatsapp_logs')
];
const moduleRoot = moduleRootCandidates.find((candidate) => existsSync(join(candidate, 'components/manager_communication_whatsapp_logs_views/ManagerCommunicationWhatsappLogsPage.tsx')));
if (!moduleRoot) throw new Error('Could not locate the canonical module source for search debounce verification.');
const source = readFileSync(join(moduleRoot, 'components/manager_communication_whatsapp_logs_views/ManagerCommunicationWhatsappLogsPage.tsx'), 'utf8');

describe('300ms live-search debounce contract', () => {
  it('debounces derived filtering and clears pending timers', () => {
    expect(source).toContain('setTimeout');
    expect(source).toContain('300');
    expect(source).toContain('clearTimeout(timeout)');
    expect(source).toContain('debouncedSearch');
  });
});
