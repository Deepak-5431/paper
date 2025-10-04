import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box
} from '@mui/material';
import { useUser } from '../context/UserContext';

const RefreshWarningDialog = () => {
  const { authState } = useUser();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (authState.accessToken) {
        event.preventDefault();
        
        setOpen(true);
        
        throw new Error('Refresh prevented by custom dialog');
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [authState.accessToken]);

  const handleConfirmRefresh = () => {
    setOpen(false);
    
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  const handleCancelRefresh = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={handleCancelRefresh} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ bgcolor: 'blue', color: 'white' }}>
         Refresh Warning
      </DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        <Typography variant="body1" gutterBottom>
          You were about to refresh the page.
        </Typography>
        <Typography variant="contained" sx={{ fontWeight: 'bold' }}>
          Refresh at your own risk
          Warning: Refreshing will log you out and you may lose any unsaved test progress!
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancelRefresh} variant="outlined">
          Cancel
        </Button>
        <Button onClick={handleConfirmRefresh}  variant="contained">
          Refresh Anyway
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RefreshWarningDialog;