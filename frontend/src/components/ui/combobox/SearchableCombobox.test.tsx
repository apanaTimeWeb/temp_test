import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SearchableCombobox } from './SearchableCombobox';

describe('SearchableCombobox primitive', () => {
  const sampleOptions = [
    { value: '1', label: 'Option One', subLabel: 'Desc 1' },
    { value: '2', label: 'Option Two', subLabel: 'Desc 2' },
    { value: '3', label: 'Third Choice', subLabel: 'Desc 3' },
  ];

  it('renders with placeholder when no value is selected', () => {
    render(
      <SearchableCombobox
        options={sampleOptions}
        value=""
        onChange={vi.fn()}
        placeholder="Choose something..."
      />
    );
    expect(screen.getByText('Choose something...')).toBeInTheDocument();
  });

  it('opens popover and allows searching options', () => {
    const handleChange = vi.fn();
    render(
      <SearchableCombobox
        options={sampleOptions}
        value=""
        onChange={handleChange}
      />
    );

    const trigger = screen.getByRole('button');
    fireEvent.click(trigger);

    expect(screen.getByPlaceholderText('Type to search...')).toBeInTheDocument();
    expect(screen.getByText('Option One')).toBeInTheDocument();

    const searchInput = screen.getByPlaceholderText('Type to search...');
    fireEvent.change(searchInput, { target: { value: 'Third' } });

    expect(screen.queryByText('Option One')).not.toBeInTheDocument();
    expect(screen.getByText('Third Choice')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Third Choice'));
    expect(handleChange).toHaveBeenCalledWith('3');
  });
});

