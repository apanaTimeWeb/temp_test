import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { ManagerAssetsRegisterConfirmModal } from '../components/manager_assets_register_dialogs/ManagerAssetsRegisterConfirmModal';
import type { ManagerAssetsRegisterAsset } from '../hooks/ManagerAssetsRegisterDemoRepository';

const sampleAsset: ManagerAssetsRegisterAsset = {
  id: 201,
  name: 'Water Purifier RO+UV',
  category: 'Appliance',
  purchaseDate: '2026-05-10',
  purchaseValue: 1800000,
  currentValue: 1800000,
  location: 'Pantry Floor 1',
  status: 'active',
};

describe('ManagerAssetsRegisterConfirmModal', () => {
  it('renders nothing when closed', () => {
    const { container } = render(
      <ManagerAssetsRegisterConfirmModal
        isOpen={false}
        assetData={null}
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders correctly with asset details when open', () => {
    render(
      <ManagerAssetsRegisterConfirmModal
        isOpen={true}
        assetData={sampleAsset}
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />
    );

    expect(screen.getByRole('alertdialog')).toBeDefined();
    expect(screen.getByText('Confirm Asset Registration')).toBeDefined();
    expect(screen.getByText('Water Purifier RO+UV')).toBeDefined();
  });

  it('triggers onConfirm when Confirm & Register button is clicked', () => {
    const handleConfirm = vi.fn();
    render(
      <ManagerAssetsRegisterConfirmModal
        isOpen={true}
        assetData={sampleAsset}
        onConfirm={handleConfirm}
        onCancel={vi.fn()}
      />
    );

    fireEvent.click(screen.getByText('Confirm & Register'));
    expect(handleConfirm).toHaveBeenCalledTimes(1);
  });

  it('triggers onCancel when Cancel button or Escape key is pressed', () => {
    const handleCancel = vi.fn();
    render(
      <ManagerAssetsRegisterConfirmModal
        isOpen={true}
        assetData={sampleAsset}
        onConfirm={vi.fn()}
        onCancel={handleCancel}
      />
    );

    fireEvent.click(screen.getByText('Cancel'));
    expect(handleCancel).toHaveBeenCalledTimes(1);

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(handleCancel).toHaveBeenCalledTimes(2);
  });
});

