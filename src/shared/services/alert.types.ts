export type AlertType = 'success' | 'error' | 'warning' | 'info';

export interface AlertState {
  open: boolean;
  message: string;
  type: AlertType;
}

export interface ConfirmState {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
}

export interface AlertContextType {
  showAlert: (message: string, type?: AlertType) => void;
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showWarning: (message: string) => void;
  showInfo: (message: string) => void;
  showConfirm: (
    message: string,
    onConfirm: () => void,
    options?: {
      title?: string;
      onCancel?: () => void;
      confirmText?: string;
      cancelText?: string;
    }
  ) => void;
}
