import { Box, Skeleton } from "@mui/material";
import ModalWrapper from "../../../../products/components/ModalWrapper";

export default function LoadingPromotionModal() {
    return (
        <ModalWrapper>
            <Box
                sx={{
                    width: '100%',
                    height: '100%',
                    bgcolor: 'var(--background)',
                    display: 'flex',
                    flexDirection: { xs: 'column', lg: 'row' },
                    overflow: 'hidden',
                }}
            >
                <Box
                    sx={{
                        flex: { xs: '0 0 auto', lg: 1 },
                        height: { xs: '60vh', lg: '100%' },
                        p: { xs: 2, md: 6 },
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: 'rgba(0,0,0,0.02)',
                        borderRight: { lg: '1px solid var(--border-color)' },
                    }}
                >
                    <Skeleton
                        variant="rounded"
                        width="100%"
                        height="100%"
                        sx={{
                            maxWidth: 1100,
                            bgcolor: 'var(--border-color)',
                            opacity: 0.35,
                        }}
                    />
                </Box>

                <Box
                    sx={{
                        width: { xs: '100%', lg: 550 },
                        p: { xs: 4, md: 6 },
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 3,
                        bgcolor: 'var(--card-bg)',
                    }}
                >
                    <Skeleton variant="text" width={140} height={28} sx={{ bgcolor: 'var(--border-color)', opacity: 0.5 }} />
                    <Skeleton variant="text" width="85%" height={64} sx={{ bgcolor: 'var(--border-color)', opacity: 0.8 }} />
                    <Skeleton variant="rounded" width="60%" height={110} sx={{ borderRadius: 4, bgcolor: 'var(--border-color)', opacity: 0.45 }} />
                    <Skeleton variant="text" width={220} height={36} sx={{ bgcolor: 'var(--border-color)', opacity: 0.7 }} />
                    <Skeleton variant="rounded" width="100%" height={84} sx={{ borderRadius: 3, bgcolor: 'var(--border-color)', opacity: 0.35 }} />
                    <Skeleton variant="rounded" width="100%" height={84} sx={{ borderRadius: 3, bgcolor: 'var(--border-color)', opacity: 0.35 }} />
                    <Skeleton variant="text" width={180} height={36} sx={{ bgcolor: 'var(--border-color)', opacity: 0.7, mt: 1 }} />
                    <Skeleton variant="rounded" width="100%" height={140} sx={{ borderRadius: 3, bgcolor: 'var(--border-color)', opacity: 0.3 }} />
                    <Box sx={{ mt: 'auto' }}>
                        <Skeleton variant="rounded" width="100%" height={56} sx={{ borderRadius: 4, bgcolor: 'var(--border-color)', opacity: 0.5 }} />
                    </Box>
                </Box>
            </Box>
        </ModalWrapper>
    );
}
