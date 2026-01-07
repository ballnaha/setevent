'use client';

import { useEffect, useState } from 'react';
import { Box, Avatar, Typography, Skeleton, Chip } from '@mui/material';
import { initializeLiff, LiffProfile, isMockMode } from '@/lib/liff';

export default function LiffHeader() {
    const [profile, setProfile] = useState<LiffProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function init() {
            try {
                const userProfile = await initializeLiff();
                setProfile(userProfile);
            } catch (error) {
                console.error('LIFF init error:', error);
            } finally {
                setLoading(false);
            }
        }
        init();
    }, []);

    return (
        <Box
            component="header"
            sx={{
                position: 'relative',
                background: 'linear-gradient(180deg, #F0F9FF 0%, #FFFFFF 100%)',
                px: 3,
                pt: 5, // Increased top padding for better spacing
                pb: 3,
                borderBottom: '1px solid rgba(0,0,0,0.04)',
            }}
        >
            {/* Content Container */}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                {/* Left - Text */}
                <Box sx={{ flex: 1 }}>
                    {loading ? (
                        <>
                            <Skeleton variant="text" width={100} height={20} sx={{ bgcolor: 'rgba(0,0,0,0.06)' }} />
                            <Skeleton variant="text" width={180} height={40} sx={{ bgcolor: 'rgba(0,0,0,0.06)', mt: 1 }} />
                        </>
                    ) : profile ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                            <Typography
                                sx={{
                                    fontFamily: 'var(--font-prompt)',
                                    fontSize: '0.9rem',
                                    color: '#64748B', // Slate-500
                                    fontWeight: 500,
                                }}
                            >
                                สวัสดี, {profile.displayName} 👋
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography
                                    component="h1"
                                    sx={{
                                        fontFamily: 'var(--font-prompt)',
                                        fontWeight: 800,
                                        fontSize: '1.75rem',
                                        color: '#1E293B', // Slate-800
                                        letterSpacing: '-0.02em',
                                        lineHeight: 1.1,
                                    }}
                                >
                                    ติดตามงาน
                                </Typography>
                                {isMockMode() && (
                                    <Chip
                                        label="DEV"
                                        size="small"
                                        sx={{
                                            height: 20,
                                            fontSize: '0.65rem',
                                            fontWeight: 700,
                                            bgcolor: 'rgba(37, 99, 235, 0.1)', // Blue-600 with opacity
                                            color: '#2563EB',
                                            borderRadius: 1,
                                        }}
                                    />
                                )}
                            </Box>
                        </Box>
                    ) : (
                        <Typography sx={{ fontFamily: 'var(--font-prompt)', color: '#64748B' }}>
                            กรุณาเข้าสู่ระบบ...
                        </Typography>
                    )}
                </Box>

                {/* Right - Avatar */}
                {!loading && profile && (
                    <Box sx={{ position: 'relative' }}>
                        <Box
                            sx={{
                                position: 'absolute',
                                inset: -2,
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
                                opacity: 0.2,
                                filter: 'blur(8px)',
                            }}
                        />
                        <Avatar
                            src={profile.pictureUrl}
                            alt={profile.displayName}
                            sx={{
                                width: 52,
                                height: 52,
                                border: '2px solid white',
                                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.15)',
                            }}
                        />
                    </Box>
                )}
                {loading && (
                    <Skeleton
                        variant="circular"
                        width={52}
                        height={52}
                        sx={{ bgcolor: 'rgba(0,0,0,0.06)' }}
                    />
                )}
            </Box>
        </Box>
    );
}
