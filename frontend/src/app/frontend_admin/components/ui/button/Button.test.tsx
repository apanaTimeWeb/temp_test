import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/button/Button';

describe('global Button primitive', () => {
  it('keeps the documented minimum touch target and explicit focus styles for every size', () => {
    const { rerender } = render(<Button size="sm">Small action</Button>);
    const small = screen.getByRole('button', { name: 'Small action' });
    expect(small.className).toContain('min-h-11');
    expect(small.className).toContain('focus-visible:ring-2');
    expect(small.className).toContain('focus-visible:ring-offset-page');

    rerender(<Button size="icon" aria-label="Open details">+</Button>);
    const icon = screen.getByRole('button', { name: 'Open details' });
    expect(icon.className).toContain('h-11');
    expect(icon.className).toContain('w-11');
  });

  it('disables actions while loading and does not fire the supplied handler', () => {
    const onClick = vi.fn();
    render(<Button loading loadingLabel="Saving record" onClick={onClick}>Save</Button>);

    const button = screen.getByRole('button');
    expect((button as HTMLButtonElement).disabled).toBe(true);
    expect(button.querySelector('svg')?.getAttribute('class')).toContain('motion-safe:animate-spin');
    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });
  it('preserves child link attributes and composes child and Button click handlers', () => {
    const childClick = vi.fn();
    const buttonClick = vi.fn();
    render(
      <Button asChild data-testid="button-as-child" aria-label="Open details" onClick={buttonClick}>
        <a href="/details" className="child-link" data-child-marker="preserved" onClick={childClick}>Open</a>
      </Button>,
    );

    const link = screen.getByRole('link', { name: 'Open details' });
    expect(link.getAttribute('href')).toBe('/details');
    expect(link.getAttribute('data-child-marker')).toBe('preserved');
    expect(link.className).toContain('child-link');
    expect(link.className).toContain('focus-visible:ring-2');
    fireEvent.click(link);
    expect(childClick).toHaveBeenCalledTimes(1);
    expect(buttonClick).toHaveBeenCalledTimes(1);
  });

  it('exposes the loading state and disables an asChild link while loading', () => {
    const childClick = vi.fn();
    render(
      <Button asChild loading loadingLabel="Opening report">
        <a href="/reports" onClick={childClick}>Open report</a>
      </Button>,
    );

    const link = screen.getByRole('link');
    expect(link.getAttribute('aria-disabled')).toBe('true');
    expect(link.getAttribute('aria-busy')).toBe('true');
    expect(link.querySelector('svg')?.getAttribute('class')).toContain('motion-safe:animate-spin');
    fireEvent.click(link);
    expect(childClick).not.toHaveBeenCalled();
  });

  it('blocks an asChild link when the Button is disabled', () => {
    const childClick = vi.fn();
    render(<Button asChild disabled><a href="/details" onClick={childClick}>Disabled details</a></Button>);

    const link = screen.getByRole('link', { name: 'Disabled details' });
    expect(link.getAttribute('aria-disabled')).toBe('true');
    expect(link.getAttribute('tabindex')).toBe('-1');
    fireEvent.click(link);
    expect(childClick).not.toHaveBeenCalled();
  });

});


describe('Button loading fallback localization', () => {
  it('does not inject an English loading label when the owner supplies none', () => {
    render(<Button loading onClick={vi.fn()}>Save changes</Button>);
    expect(screen.queryByText('Loading')).toBeNull();
    expect(screen.getByRole('button', { name: 'Save changes' })).toHaveAttribute('aria-busy', 'true');
  });

});
