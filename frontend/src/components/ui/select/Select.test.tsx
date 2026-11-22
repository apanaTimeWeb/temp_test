import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import Select from '@/components/ui/select/Select';
import { SelectContent } from '@/components/ui/select/SelectContent';
import { SelectItem } from '@/components/ui/select/SelectItem';
import { SelectTrigger } from '@/components/ui/select/SelectTrigger';
import { SelectValue } from '@/components/ui/select/SelectValue';

describe('global Select primitive', () => {
  it('renders choices as children of a native select and emits value changes', () => {
    const onValueChange = vi.fn();
    render(
      <Select defaultValue="all" onValueChange={onValueChange}>
        <SelectTrigger aria-label="Branch"><SelectValue placeholder="Choose a branch" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Branches</SelectItem>
          <SelectItem value="main">Main Branch</SelectItem>
        </SelectContent>
      </Select>,
    );

    const select = screen.getByRole('combobox', { name: 'Branch' }) as HTMLSelectElement;
    expect(select.value).toBe('all');
    expect(select.querySelectorAll('option')).toHaveLength(3);
    expect(select.querySelector('option[value=""]')?.textContent).toBe('Choose a branch');
    fireEvent.change(select, { target: { value: 'main' } });
    expect(onValueChange).toHaveBeenCalledWith('main');
  });

  it('preserves data attributes on native options', () => {
    render(
      <Select defaultValue="branch-1">
        <SelectTrigger aria-label="Branch"><SelectValue placeholder="Select a branch" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="branch-1" data-admin-style="branch-option-1">Downtown Branch</SelectItem>
          <SelectItem value="branch-2" data-admin-style="branch-option-2">Westside Branch</SelectItem>
        </SelectContent>
      </Select>,
    );

    expect(screen.getByRole('option', { name: 'Downtown Branch' }).getAttribute('data-admin-style')).toBe('branch-option-1');
  });
  it('applies SelectContent className to the native select element', () => {
    render(
      <Select defaultValue="main">
        <SelectTrigger aria-label="Branch"><SelectValue placeholder="Select a branch" /></SelectTrigger>
        <SelectContent className="branch-select-density">
          <SelectItem value="main">Main Branch</SelectItem>
        </SelectContent>
      </Select>,
    );

    expect((screen.getByRole('combobox', { name: 'Branch' }) as HTMLSelectElement).classList.contains('branch-select-density')).toBe(true);
  });

});
