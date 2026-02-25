import React from 'react';
import { Box, Container, Skeleton, Stack } from '@mui/material';

export default function Loading() {
    return (
        <Box sx={{ bgcolor: 'var(--background)', minHeight: '100vh', pb: 10, overflow: 'hidden' }}>
            {/* Hero Skeleton - More Minimal & Beautiful */}
            <Box sx={{
                pt: { xs: 15, md: 22 },
                pb: { xs: 8, md: 10 },
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 3
            }}>
                <Skeleton variant="rounded" width={140} height={32} sx={{ borderRadius: 10, bgcolor: 'var(--border-color)', opacity: 0.5 }} />
                <Skeleton variant="text" height={60} sx={{ width: { xs: '90%', md: 400 }, bgcolor: 'var(--border-color)', opacity: 0.8 }} />
                <Skeleton variant="text" height={24} sx={{ width: { xs: '80%', md: 600 }, bgcolor: 'var(--border-color)', opacity: 0.5 }} />
            </Box>

            {/* Grid Skeleton */}
            <Container maxWidth="lg" sx={{ mt: 8 }}>
                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
                    gap: 4
                }}>
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <Box key={i} sx={{
                            borderRadius: 4,
                            overflow: 'hidden',
                            height: { xs: 400, md: 440 },
                            position: 'relative',
                            bgcolor: 'var(--border-color)',
                            opacity: 0.3
                        }}>
                            <Skeleton variant="rectangular" height="100%" animation="wave" />
                            <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, p: 3, zIndex: 1 }}>
                                <Skeleton variant="text" width="80%" height={40} sx={{ mb: 1, bgcolor: 'rgba(255,255,255,0.2)' }} />
                                <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                                    <Skeleton variant="text" width="30%" height={20} sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
                                    <Skeleton variant="text" width="40%" height={20} sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
                                </Stack>
                                <Skeleton variant="text" width="100%" height={60} sx={{ bgcolor: 'rgba(255,255,255,0.05)' }} />
                            </Box>
                        </Box>
                    ))}
                </Box>
            </Container>
        </Box>
    );
}
