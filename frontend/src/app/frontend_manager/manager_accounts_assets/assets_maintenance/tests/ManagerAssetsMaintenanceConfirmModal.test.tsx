import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { ManagerAssetsMaintenanceConfirmModal } from '../components/ManagerAssetsMaintenanceConfirmModal';
import type { MaintenanceLogItem } from '../components/ManagerAssetsMaintenanceTable';

const sampleLog: MaintenanceLogItem = {
  id: 101,
  assetName: 'AC Unit 1.5 Ton Inverter',
  issue: 'Cooling coil gas leak',
  reportedDate: '2026-05-10',
  scheduledDate: '2026-05-12',
  vendor: 'Daikin Care',
  cost: 2500,
  status: 'pending',
};

describe('ManagerAssetsMaintenanceConfirmModal', () => {
  it('renders nothing when isOpen is false', () => {
    const { container } = render(
      <ManagerAssetsMaintenanceConfirmModal
        isOpen={false}
        logItem={sampleLog}
        nextStatus="in-progress"
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders correctly with asset details when open', () => {
    render(
      <ManagerAssetsMaintenanceConfirmModal
        isOpen={true}
        logItem={sampleLog}
        nextStatus="in-progress"
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />
    );

    expect(screen.getByRole('alertdialog')).toBeDefined();
    expect(screen.getByText('Start Maintenance Work')).toBeDefined();
    expect(screen.getByText('AC Unit 1.5 Ton Inverter')).toBeDefined();
  });

  it('triggers onConfirm when Confirm & Advance button is clicked', () => {
    const handleConfirm = vi.fn();
    render(
      <ManagerAssetsMaintenanceConfirmModal
        isOpen={true}
        logItem={sampleLog}
        nextStatus="in-progress"
        onConfirm={handleConfirm}
        onCancel={vi.fn()}
      />
    );

    fireEvent.click(screen.getByText('Confirm & Advance'));
    expect(handleConfirm).toHaveBeenCalledTimes(1);
  });

  it('triggers onCancel when Cancel button or Escape key is pressed', () => {
    const handleCancel = vi.fn();
    render(
      <ManagerAssetsMaintenanceConfirmModal
        isOpen={true}
        logItem={sampleLog}
        nextStatus="in-progress"
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

