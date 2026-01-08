'use client';

import { Snackbar, Alert } from '@mui/material';

interface TopSnackbarProps {
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'warning' | 'info';
    onClose: () => void;
}

export default function TopSnackbar({ open, message, severity, onClose }: TopSnackbarProps) {
    return (
        <Snackbar
            open={open}
            autoHideDuration={4000}
            onClose={onClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            sx={{ mt: 10 }}
            TransitionProps={{ enter: true, exit: true }}
        >
            <Alert
                onClose={onClose}
                severity={severity}
                variant="standard"
                sx={{
                    fontFamily: 'var(--font-prompt)',
                    width: '100%',
                    minWidth: '300px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                    backdropFilter: 'blur(10px)',
                    backgroundColor: severity === 'success' ? 'rgba(209, 250, 229, 0.9)' :
                        severity === 'error' ? 'rgba(254, 226, 226, 0.9)' :
                            'rgba(255, 255, 255, 0.9)',
                    color: severity === 'success' ? '#065F46' :
                        severity === 'error' ? '#991B1B' : '#1F2937',
                    border: '1px solid',
                    borderColor: severity === 'success' ? 'rgba(16, 185, 129, 0.2)' :
                        severity === 'error' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(0,0,0,0.1)',
                    borderRadius: '16px',
                    fontWeight: 600,
                    alignItems: 'center',
                    '& .MuiAlert-icon': {
                        fontSize: '24px',
                        color: severity === 'success' ? '#059669' :
                            severity === 'error' ? '#DC2626' : 'inherit'
                    }
                }}
            >
                {message}
            </Alert>
        </Snackbar>
    );
}
