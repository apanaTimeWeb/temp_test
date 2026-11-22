// RESPONSIBILITY: Safe confirmation state hook replacing native browser dialogs (window.confirm).
import { useState, useCallback } from 'react';

export interface ConfirmDialogState {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  isDestructive: boolean;
  onConfirm: () => void;
}

const DEFAULT_STATE: ConfirmDialogState = {
  isOpen: false,
  title: '',
  message: '',
  confirmLabel: 'Confirm',
  cancelLabel: 'Cancel',
  isDestructive: false,
  onConfirm: () => {},
};

export function useSuperadminFeaturesOverviewConfirm() {
  const [dialogState, setDialogState] = useState<ConfirmDialogState>(DEFAULT_STATE);

  const requestConfirm = useCallback(
    (config: {
      title: string;
      message: string;
      confirmLabel?: string;
      cancelLabel?: string;
      isDestructive?: boolean;
      onConfirm: () => void;
    }) => {
      setDialogState({
        isOpen: true,
        title: config.title,
        message: config.message,
        confirmLabel: config.confirmLabel ?? 'Confirm',
        cancelLabel: config.cancelLabel ?? 'Cancel',
        isDestructive: config.isDestructive ?? false,
        onConfirm: config.onConfirm,
      });
    },
    []
  );

  const closeConfirm = useCallback(() => {
    setDialogState(DEFAULT_STATE);
  }, []);

  const handleConfirmed = useCallback(() => {
    dialogState.onConfirm();
    setDialogState(DEFAULT_STATE);
  }, [dialogState]);

  return {
    dialogState,
    requestConfirm,
    closeConfirm,
    handleConfirmed,
  };
}
