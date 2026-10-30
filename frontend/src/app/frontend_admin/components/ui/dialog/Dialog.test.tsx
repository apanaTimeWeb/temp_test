import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { Dialog } from '@/components/ui/dialog/Dialog';
import { DialogTrigger } from '@/components/ui/dialog/DialogTrigger';
import { DialogContent } from '@/components/ui/dialog/DialogContent';
import { DialogTitle } from '@/components/ui/dialog/DialogTitle';
import { DialogDescription } from '@/components/ui/dialog/DialogDescription';
import { DialogClose } from '@/components/ui/dialog/DialogClose';

describe('global Dialog primitive', () => {
  it('opens from its trigger and closes from Escape with an accessible name', () => {
    render(
      <Dialog>
        <DialogTrigger>Open details</DialogTrigger>
        <DialogContent>
          <DialogTitle>Resource details</DialogTitle>
          <DialogDescription>Details for the selected resource.</DialogDescription>
          <DialogClose>Close dialog</DialogClose>
        </DialogContent>
      </Dialog>,
    );

    expect(screen.queryByRole('dialog')).toBeNull();
    const trigger = screen.getByRole('button', { name: 'Open details' });
    expect(trigger.className).toContain('min-h-11');
    expect(trigger.className).toContain('focus-visible:ring-2');
    trigger.focus();
    fireEvent.click(trigger);
    expect(screen.getByRole('dialog', { name: 'Resource details' })).toBeTruthy();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });
});


describe('global Dialog close primitive', () => {
  it('provides a 44px minimum target and visible keyboard focus styles', () => {
    render(
      <Dialog defaultOpen>
        <DialogContent>
          <DialogTitle>Close test</DialogTitle>
          <DialogClose>Close</DialogClose>
        </DialogContent>
      </Dialog>,
    );

    const close = screen.getByRole('button', { name: 'Close' });
    expect(close.className).toContain('min-h-11');
    expect(close.className).toContain('focus-visible:ring-2');
  });
});


describe('global Dialog focus lifecycle', () => {
  it('keeps focus inside an open dialog when the controlled callback identity changes', () => {
    const firstCallback = vi.fn();
    const { rerender } = render(
      <Dialog open onOpenChange={firstCallback}>
        <DialogContent>
          <DialogTitle>Stable focus</DialogTitle>
          <DialogClose>Close stable focus dialog</DialogClose>
        </DialogContent>
      </Dialog>,
    );
    const closeButton = screen.getByRole('button', { name: 'Close stable focus dialog' });
    expect(document.activeElement).toBe(closeButton);

    const latestCallback = vi.fn();
    rerender(
      <Dialog open onOpenChange={latestCallback}>
        <DialogContent>
          <DialogTitle>Stable focus</DialogTitle>
          <DialogClose>Close stable focus dialog</DialogClose>
        </DialogContent>
      </Dialog>,
    );

    expect(screen.getByRole('dialog', { name: 'Stable focus' })).toBeTruthy();
    expect(document.activeElement).toBe(closeButton);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(latestCallback).toHaveBeenCalledWith(false);
    expect(firstCallback).not.toHaveBeenCalled();
  });
});


describe('global Dialog focus containment', () => {
  it('returns escaped keyboard focus to the first focusable dialog control', () => {
    render(
      <>
        <button type="button">Background action</button>
        <Dialog defaultOpen>
          <DialogContent>
            <DialogTitle>Contained focus</DialogTitle>
            <DialogClose>Close contained dialog</DialogClose>
          </DialogContent>
        </Dialog>
      </>,
    );

    const backgroundAction = screen.getByRole('button', { name: 'Background action' });
    const closeButton = screen.getByRole('button', { name: 'Close contained dialog' });
    backgroundAction.focus();

    expect(document.activeElement).toBe(closeButton);
  });
});


describe('global Dialog backdrop semantics', () => {
  it('keeps the decorative backdrop out of the accessibility tree while allowing pointer dismissal', () => {
    const onOpenChange = vi.fn();
    render(
      <Dialog open onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogTitle>Backdrop dismissal</DialogTitle>
          <DialogClose>Close</DialogClose>
        </DialogContent>
      </Dialog>,
    );

    const backdrop = document.querySelector('[data-dialog-backdrop="true"]');
    expect(backdrop).toBeTruthy();
    expect(backdrop?.getAttribute('aria-hidden')).toBe('true');
    expect(backdrop?.tagName.toLowerCase()).toBe('div');
    fireEvent.mouseDown(backdrop!);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
