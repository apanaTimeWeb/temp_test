// RESPONSIBILITY: Verify the module-owned dialog keyboard and focus lifecycle.
import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { useSuperadminCommunicationWhatsappTemplatesDialog } from '@/app/frontend_superadmin/superadmin_communication/communication_whatsapp_templates/hooks/useSuperadminCommunicationWhatsappTemplatesDialog';

function DialogFixture({ onClose }: { onClose: () => void }) {
  const [open, setOpen] = useState(false);
  const dialogRef = useSuperadminCommunicationWhatsappTemplatesDialog(open, () => { onClose(); setOpen(false); });
  return <><button type="button" onClick={() => setOpen(true)}>Open dialog</button>{open && <div ref={dialogRef} role="dialog" tabIndex={-1}><button type="button">First</button><button type="button">Last</button></div>}</>;
}

describe('useSuperadminCommunicationWhatsappTemplatesDialog', () => {
  it('traps Tab at the dialog boundary and restores focus after Escape', () => {
    const onClose = vi.fn(); render(<DialogFixture onClose={onClose} />);
    const trigger = screen.getByRole('button', { name: 'Open dialog' }); fireEvent.click(trigger);
    const first = screen.getByRole('button', { name: 'First' }); const last = screen.getByRole('button', { name: 'Last' });
    Object.defineProperty(first, 'offsetParent', { configurable: true, value: document.body });
    Object.defineProperty(last, 'offsetParent', { configurable: true, value: document.body });
    first.focus(); last.focus(); fireEvent.keyDown(document, { key: 'Tab' }); expect(document.activeElement).toBe(first);
    fireEvent.keyDown(document, { key: 'Escape' }); expect(onClose).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('dialog')).toBeNull(); expect(document.activeElement).toBe(trigger);
  });
});
