import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import {
  Snackbar,
  Alert as MuiAlert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';
import type { AlertType, AlertState, ConfirmState, AlertContextType } from './alert.types';

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const useAlert :any= () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within AlertProvider');
  }
  return context;
};

interface AlertProviderProps {
  children: ReactNode;
}

export const AlertProvider: React.FC<AlertProviderProps> = ({ children }) => {
  const [alertState, setAlertState] = useState<AlertState>({
    open: false,
    message: '',
    type: 'info',
  });

  const [confirmState, setConfirmState] = useState<ConfirmState>({
    open: false,
    title: '',
    message: '',
    onConfirm: () => {},
    confirmText: 'Confirm',
    cancelText: 'Cancel',
  });

  const showAlert = (message: string, type: AlertType = 'info') => {
    setAlertState({
      open: true,
      message,
      type,
    });
  };

  const showSuccess = (message: string) => showAlert(message, 'success');
  const showError = (message: string) => showAlert(message, 'error');
  const showWarning = (message: string) => showAlert(message, 'warning');
  const showInfo = (message: string) => showAlert(message, 'info');

  const showConfirm = (
    message: string,
    onConfirm: () => void,
    options?: {
      title?: string;
      onCancel?: () => void;
      confirmText?: string;
      cancelText?: string;
    }
  ) => {
    setConfirmState({
      open: true,
      title: options?.title || 'Confirm',
      message,
      onConfirm,
      onCancel: options?.onCancel,
      confirmText: options?.confirmText || 'Confirm',
      cancelText: options?.cancelText || 'Cancel',
    });
  };

  const handleAlertClose = () => {
    setAlertState((prev) => ({ ...prev, open: false }));
  };

  const handleConfirmClose = () => {
    if (confirmState.onCancel) {
      confirmState.onCancel();
    }
    setConfirmState((prev) => ({ ...prev, open: false }));
  };

  const handleConfirmAccept = () => {
    confirmState.onConfirm();
    setConfirmState((prev) => ({ ...prev, open: false }));
  };

  return (
    <AlertContext.Provider
      value={{
        showAlert,
        showSuccess,
        showError,
        showWarning,
        showInfo,
        showConfirm,
      }}
    >
      {children}

      {/* Snackbar for alerts */}
      <Snackbar
        open={alertState.open}
        autoHideDuration={6000}
        onClose={handleAlertClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MuiAlert
          onClose={handleAlertClose}
          severity={alertState.type}
          variant="filled"
          elevation={6}
          sx={{ width: '100%' }}
        >
          {alertState.message}
        </MuiAlert>
      </Snackbar>

      {/* Dialog for confirmations */}
      <Dialog
        open={confirmState.open}
        onClose={handleConfirmClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {confirmState.title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {confirmState.message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmClose} color="inherit">
            {confirmState.cancelText}
          </Button>
          <Button onClick={handleConfirmAccept} color="error" variant="contained" autoFocus>
            {confirmState.confirmText}
          </Button>
        </DialogActions>
      </Dialog>
    </AlertContext.Provider>
  );
};
