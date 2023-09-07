import { Alert, AlertColor, Snackbar } from "@mui/material"
import { useState } from "react";

export const useSnackbar = () => {
    const [data, setData] = useState<{ isOpen: boolean, message: string, severity: AlertColor }>({
        isOpen: false,
        message: '',
        severity: 'success'
    })

    const handleOpen = (message: string, severity: AlertColor = 'success') => {
        setData(state => ({...state, message, severity, isOpen: true }));
    };

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
        return;
        }

        setData(state => ({...state, isOpen: false }));
    };

    const Component = () => (
        <Snackbar 
            open={data.isOpen} 
            autoHideDuration={6000} 
            onClose={handleClose}
        >
            <Alert onClose={handleClose} severity={data.severity} sx={{ width: '100%' }}>
                {data.message}
            </Alert>
        </Snackbar>
    )
    
    return {
        Component,
        openSnackbar: handleOpen,
        closeSnackbar: handleClose
    }
}