import { describe as suite0_describe, expect as suite0_expect, it as suite0_it } from "vitest";
import { ADMIN_COMMUNICATION_WHATSAPP_LOGS_FIXTURES as suite0_ADMIN_COMMUNICATION_WHATSAPP_LOGS_FIXTURES } from "@/app/frontend_admin/admin_communication/communication_whatsapp_logs/mocks/AdminCommunicationWhatsappLogsFixtures";
import { filterAdminCommunicationWhatsappLogs as suite0_filterAdminCommunicationWhatsappLogs } from "@/app/frontend_admin/admin_communication/communication_whatsapp_logs/utils/AdminCommunicationWhatsappLogsFilterUtils";
import { act as suite1_act, renderHook as suite1_renderHook } from "@testing-library/react";
import { afterEach as suite1_afterEach, describe as suite1_describe, expect as suite1_expect, it as suite1_it, vi as suite1_vi } from "vitest";
import suite1_useAdminCommunicationWhatsappLogsUnsavedChangesGuard from "@/app/frontend_admin/admin_communication/communication_whatsapp_logs/hooks/useAdminCommunicationWhatsappLogsUnsavedChangesGuard.ts";

describe("Consolidated from AdminCommunicationWhatsappLogsFilterUtils.test.ts", () => {




const defaults = { type: 'All', status: 'All', search: '', dateFrom: '', dateTo: '' } as const;

suite0_describe('filterAdminCommunicationWhatsappLogs', () => {
  suite0_it('filters by message type and status together', () => {
    const result = suite0_filterAdminCommunicationWhatsappLogs(suite0_ADMIN_COMMUNICATION_WHATSAPP_LOGS_FIXTURES, {
      ...defaults,
      type: 'fee_reminder',
      status: 'Failed',
    });
    suite0_expect(result).toHaveLength(1);
    suite0_expect(result[0]).toMatchObject({ id: '4', type: 'fee_reminder', status: 'Failed' });
  });

  suite0_it('matches trimmed student/phone search without changing the fixtures', () => {
    const result = suite0_filterAdminCommunicationWhatsappLogs(suite0_ADMIN_COMMUNICATION_WHATSAPP_LOGS_FIXTURES, { ...defaults, search: '  98****2310  ' });
    suite0_expect(result.map((record) => record.id)).toEqual(['1']);
    suite0_expect(suite0_ADMIN_COMMUNICATION_WHATSAPP_LOGS_FIXTURES).toHaveLength(7);
  });

  suite0_it('uses inclusive date boundaries and returns no results for a reversed range', () => {
    const inRange = suite0_filterAdminCommunicationWhatsappLogs(suite0_ADMIN_COMMUNICATION_WHATSAPP_LOGS_FIXTURES, { ...defaults, dateFrom: '2026-04-10', dateTo: '2026-04-10' });
    suite0_expect(inRange.map((record) => record.id)).toEqual(['5', '6']);
    suite0_expect(suite0_filterAdminCommunicationWhatsappLogs(suite0_ADMIN_COMMUNICATION_WHATSAPP_LOGS_FIXTURES, { ...defaults, dateFrom: '2026-04-12', dateTo: '2026-04-10' })).toEqual([]);
  });
});

});


describe("Consolidated from useAdminCommunicationWhatsappLogsUnsavedChangesGuard.test.ts", () => {




let anchor: HTMLAnchorElement | null = null;
suite1_afterEach(() => { anchor?.remove(); anchor = null; });

suite1_describe('useAdminCommunicationWhatsappLogsUnsavedChangesGuard', () => {
  suite1_it('intercepts same-origin navigation while dirty and allows clean navigation', () => {
    const callback = suite1_vi.fn();
    const { rerender } = suite1_renderHook(({ dirty }) => suite1_useAdminCommunicationWhatsappLogsUnsavedChangesGuard(dirty, callback), { initialProps: { dirty: true } });
    anchor = document.createElement('a'); anchor.href = '/admin/next'; document.body.appendChild(anchor);
    suite1_act(() => anchor?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 })));
    suite1_expect(callback).toHaveBeenCalledWith('/admin/next');
    callback.mockClear(); rerender({ dirty: false });
    const clean = new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 });
    suite1_act(() => anchor?.dispatchEvent(clean));
    suite1_expect(clean.defaultPrevented).toBe(false); suite1_expect(callback).not.toHaveBeenCalled();
  });
});

});

