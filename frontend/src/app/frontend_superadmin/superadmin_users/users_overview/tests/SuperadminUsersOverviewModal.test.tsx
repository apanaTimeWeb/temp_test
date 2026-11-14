// RESPONSIBILITY: Verify guarded dismissal for the users overview Users modal against its real accessible confirmation dialog.
// FLOW: Test runner -> frontend_superadmin/superadmin_users/users_overview/tests/SuperadminUsersOverviewModal.test.tsx -> translated modal -> user dismissal event -> confirmation decision -> close callback assertion.
/* @vitest-environment jsdom */
import { NextIntlClientProvider } from 'next-intl';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import messages from '../locales/superadmin_users_overview_en.json';
import SuperadminUsersOverviewModal from '../components/SuperadminUsersOverviewModal';

afterEach(() => {
  cleanup();
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

type CloseSurface = 'Cancel button' | 'Escape key' | 'backdrop' | 'close button';
const CLOSE_SURFACES: CloseSurface[] = ['Cancel button', 'Escape key', 'backdrop', 'close button'];

function renderModal() {
  const onClose = vi.fn();
  const handleSave = vi.fn();
  const view = render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <SuperadminUsersOverviewModal showModal editUser={null} onClose={onClose} handleSave={handleSave} />
    </NextIntlClientProvider>,
  );
  return { ...view, onClose, handleSave };
}

function makeDirty() {
  fireEvent.change(screen.getByLabelText('Full Name'), { target: { value: 'Unsaved draft' } });
}

function requestClose(surface: CloseSurface, container: HTMLElement) {
  if (surface === 'Cancel button') {
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    return;
  }
  if (surface === 'Escape key') {
    fireEvent.keyDown(document, { key: 'Escape' });
    return;
  }
  if (surface === 'backdrop') {
    const overlay = container.querySelector('.sa-wizard-modal-overlay');
    expect(overlay).toBeTruthy();
    fireEvent.mouseDown(overlay!);
    return;
  }
  fireEvent.click(screen.getByRole('button', { name: 'Close user dialog' }));
}

async function settleConfirmation(approved: boolean) {
  const confirmation = document.querySelector('dialog[data-superadmin-confirm]') as HTMLDialogElement | null;
  expect(confirmation).toBeTruthy();
  const buttons = confirmation!.querySelectorAll('button');
  expect(buttons).toHaveLength(2);
  await act(async () => {
    buttons[approved ? 1 : 0].click();
    await Promise.resolve();
  });
}

describe('SuperadminUsersOverviewModal guarded dismissal', () => {
  it.each(CLOSE_SURFACES)('dismisses a clean form immediately through the %s without prompting', (surface) => {
    const { container, onClose } = renderModal();
    requestClose(surface, container);
    expect(document.querySelector('dialog[data-superadmin-confirm]')).toBeNull();
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it.each(CLOSE_SURFACES)('keeps a dirty draft open when the %s confirmation is cancelled', async (surface) => {
    const { container, onClose } = renderModal();
    makeDirty();
    requestClose(surface, container);

    const confirmation = document.querySelector('dialog[data-superadmin-confirm]');
    expect(confirmation).toBeTruthy();
    expect(onClose).not.toHaveBeenCalled();
    await settleConfirmation(false);

    expect(onClose).not.toHaveBeenCalled();
    expect(container.querySelector('[role="dialog"]')).toBeTruthy();
    expect((screen.getByLabelText('Full Name') as HTMLInputElement).value).toBe('Unsaved draft');
  });

  it.each(CLOSE_SURFACES)('closes a dirty draft only after the %s confirmation is accepted', async (surface) => {
    const { container, onClose } = renderModal();
    makeDirty();
    requestClose(surface, container);

    expect(onClose).not.toHaveBeenCalled();
    expect(document.querySelector('dialog[data-superadmin-confirm]')).toBeTruthy();
    await settleConfirmation(true);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('coalesces concurrent dirty-form dismissal requests into one confirmation', async () => {
    const { container, onClose } = renderModal();
    makeDirty();
    requestClose('Cancel button', container);
    requestClose('Escape key', container);
    requestClose('close button', container);

    expect(document.querySelectorAll('dialog[data-superadmin-confirm]')).toHaveLength(1);
    expect(onClose).not.toHaveBeenCalled();
    await settleConfirmation(false);
    expect(onClose).not.toHaveBeenCalled();
  });
});
