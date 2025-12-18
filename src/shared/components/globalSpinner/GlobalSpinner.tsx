import React, { useRef, useState } from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { useIsFetching, useIsMutating } from '@tanstack/react-query';

/**
 * GlobalSpinner overlays the entire app while there are active queries/mutations.
 * It ensures the spinner is visible for at least minDurationMs (default 1000ms)
 * so short requests are still noticeable.
 */
export const GlobalSpinner: React.FC<{ minDurationMs?: number }> = ({ minDurationMs = 1000 }) => {
  const fetching = useIsFetching();
  const mutating = useIsMutating();
  const hasActiveRequests = fetching + mutating > 0;

  const [open, setOpen] = useState(false);
  const startRef =  useRef<number | null>(null);
  const hideTimeoutRef = useRef<number | undefined>(undefined);

  React.useEffect(() => {
    // Clear any pending hide timeout when state changes
    if (hideTimeoutRef.current) {
      window.clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = undefined;
    }

    if (hasActiveRequests) {
      // Show spinner and note the start time
      if (!open) {
        setOpen(true);
        startRef.current = Date.now();
      }
    } else if (open) {
      // Ensure min visible duration before hiding
      const start = startRef.current ?? Date.now();
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, minDurationMs - elapsed);
      if (remaining > 0) {
        hideTimeoutRef.current = window.setTimeout(() => {
          setOpen(false);
          startRef.current = null;
          hideTimeoutRef.current = undefined;
        }, remaining);
      } else {
        setOpen(false);
        startRef.current = null;
      }
    }
  }, [hasActiveRequests, open, minDurationMs]);

  return (
    <Backdrop
      sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.modal + 1 })}
      open={open}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};
