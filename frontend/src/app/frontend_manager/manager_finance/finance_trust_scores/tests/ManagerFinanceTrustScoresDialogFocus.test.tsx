import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React, { useRef } from 'react';
import { useManagerTrustScoresDialogFocus } from '@/app/frontend_manager/manager_finance/finance_trust_scores/hooks/ManagerFinanceTrustScoresDialogFocus';

function TestDialogComponent({ onClose, active = true }: { onClose: () => void; active?: boolean }) {
  const dialogRef = useRef<HTMLDivElement>(null);
  useManagerTrustScoresDialogFocus(dialogRef, onClose, active);

  return (
    <div ref={dialogRef} tabIndex={-1} role="dialog" aria-modal="true">
      <button type="button" data-testid="first-btn">First</button>
      <input type="text" data-testid="text-input" />
      <button type="button" data-testid="last-btn">Last</button>
    </div>
  );
}

describe('useManagerTrustScoresDialogFocus', () => {
  it('focuses the first focusable element when active', () => {
    render(<TestDialogComponent onClose={() => {}} active={true} />);
    expect(document.activeElement).toBe(screen.getByTestId('first-btn'));
  });

  it('calls onClose when Escape key is pressed', () => {
    const handleClose = vi.fn();
    render(<TestDialogComponent onClose={handleClose} active={true} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('traps focus inside the dialog when Tab is pressed on last element', () => {
    render(<TestDialogComponent onClose={() => {}} active={true} />);
    const lastBtn = screen.getByTestId('last-btn');
    lastBtn.focus();
    expect(document.activeElement).toBe(lastBtn);

    fireEvent.keyDown(document, { key: 'Tab', shiftKey: false });
    expect(document.activeElement).toBe(screen.getByTestId('first-btn'));
  });

  it('traps focus backwards when Shift+Tab is pressed on first element', () => {
    render(<TestDialogComponent onClose={() => {}} active={true} />);
    const firstBtn = screen.getByTestId('first-btn');
    firstBtn.focus();
    expect(document.activeElement).toBe(firstBtn);

    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
    expect(document.activeElement).toBe(screen.getByTestId('last-btn'));
  });
});

