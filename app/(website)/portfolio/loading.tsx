import React from 'react';
import { Box, Container, Skeleton } from '@mui/material';

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
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 4 }}>
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <Box key={i} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                            <Skeleton
                                variant="rounded"
                                height={320}
                                animation="wave"
                                sx={{
                                    bgcolor: 'var(--border-color)',
                                    opacity: 0.4,
                                    borderRadius: 6
                                }}
                            />
                            <Box sx={{ px: 1 }}>
                                <Skeleton variant="text" width="85%" height={32} sx={{ bgcolor: 'var(--border-color)', opacity: 0.7 }} />
                                <Skeleton variant="text" width="60%" height={24} sx={{ bgcolor: 'var(--border-color)', opacity: 0.4 }} />
                            </Box>
                        </Box>
                    ))}
                </Box>
            </Container>
        </Box>
    );
}
