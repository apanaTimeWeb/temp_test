import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const hookSource = readFileSync(join(__dirname, '../hooks/useManagerMembersEnquiriesConfirm.tsx'), 'utf8');

describe('enquiries confirmation dialog accessibility', () => {
  it('uses the actual unsaved-change message as the dialog name, not the Cancel button label', () => {
    expect(hookSource).toContain('role="alertdialog"');
    expect(hookSource).toContain('aria-labelledby={titleId}');
    expect(hookSource).toContain('<h2 id={titleId} className="text-lg font-semibold text-foreground">{pending.message}</h2>');
    expect(hookSource).not.toContain('{pending.cancelLabel}</h2>');
  });
});
