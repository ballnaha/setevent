"use client";

import { Modal, Box, IconButton } from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function ModalWrapper({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [open, setOpen] = useState(true);

    const handleClose = () => {
        setOpen(false);
        router.back();
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: { xs: 0, md: 0 },
                '& .MuiBackdrop-root': {
                    bgcolor: 'rgba(0,0,0,0.85)',
                    backdropFilter: 'blur(8px)',
                    opacity: '1 !important'
                }
            }}
        >
            <Box sx={{
                width: '100%',
                maxWidth: '100vw',
                height: '100vh',
                bgcolor: 'var(--background)',
                outline: 'none',
                boxShadow: 24,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
            }}>
                {/* Clone the children but pass the handleClose if possible */}
                {React.Children.map(children, child => {
                    if (React.isValidElement(child)) {
                        return React.cloneElement(child, { onClose: handleClose } as any);
                    }
                    return child;
                })}
            </Box>
        </Modal>
    );
}
