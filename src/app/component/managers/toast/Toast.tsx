import * as React from 'react';
import { Snackbar, SnackbarContent, Slide, IconButton } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

interface ToastNotificationProps {
  open: boolean;
  message: string;
  onClose: () => void;
  status?:  string;
}

const ToastNotification: React.FC<ToastNotificationProps> = ({ open, message, onClose, status }) => {

  const borderColorMap: Record<string, string> = {
    success: 'green',
    error: 'red',
    warning: 'orange',
  };

  const borderColor = status?  borderColorMap[status]  : 'green';

  return (
    <Snackbar
      open={open}
      autoHideDuration={2000}
      onClose={onClose}
      TransitionComponent={(props) => <Slide {...props} direction="left" />}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <SnackbarContent
        sx={{
          backgroundColor: 'white', 
          color: 'black', 
          borderTop: `2px solid ${borderColor}`,
          boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
          borderRadius: '0',
        }}
        message={message}
        action={
          <IconButton
            size="small"
            color="inherit"
            onClick={onClose}
          >
            <CloseIcon />
          </IconButton>
        }
      />
    </Snackbar>
  );
};

export default React.memo(ToastNotification);