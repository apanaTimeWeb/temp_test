import { describe, expect, it } from 'vitest';
import * as api from '@/app/frontend_manager/manager_communication/communication_whatsapp_templates/api/manager_communication_whatsapp_templates.api';
import { MANAGERWHATSAPPTEMPLATESWHATSAPPTEMPLATES_CONTRACT_GAP_MOCK } from '@/app/frontend_manager/manager_communication/communication_whatsapp_templates/mocks/ManagerCommunicationWhatsappTemplatesContractGapMock';

describe('manager_whatsapp_templates fail-closed API contract', () => {
  it('does not make an undocumented network request and exposes a machine-readable gap', async () => {
    expect(MANAGERWHATSAPPTEMPLATESWHATSAPPTEMPLATES_CONTRACT_GAP_MOCK).toMatchObject({ code: 'CONTRACT_NOT_FOUND_IN_WEB_ZIP', status: 501 });
    const calls = [
    api.fetchManagerWhatsappTemplatesNotices as (...args: never[]) => Promise<unknown>,
    api.fetchManagerWhatsappTemplatesComplaints as (...args: never[]) => Promise<unknown>,
    ];
    for (const call of calls) {
      await expect(call(...([] as never[]))).rejects.toMatchObject({ code: 'CONTRACT_NOT_FOUND_IN_WEB_ZIP', status: 501 });
    }
  });
});
