'use client';

import { useEffect, useState } from 'react';
import { Box, Avatar, Typography, Skeleton, Chip, IconButton } from '@mui/material';
import { initializeLiff, LiffProfile, isMockMode } from '@/lib/liff';
import { Notification } from 'iconsax-react';

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
                background: 'linear-gradient(135deg, #0F172A 0%, #334155 100%)', // Deep Slate for premium look
                px: 3,
                pt: 6, // Reduced top padding
                pb: 7, // Reduced bottom padding, still enough for overlap
                zIndex: 1,
            }}
        >
            {/* Background Pattern (Subtle) */}
            <Box sx={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                opacity: 0.1,
                backgroundImage: 'radial-gradient(circle at 90% 10%, #ffffff 0%, transparent 20%)',
                pointerEvents: 'none'
            }} />

            {/* Content Container */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, position: 'relative', zIndex: 2 }}>
                {/* Left - Avatar */}
                <Box sx={{ flexShrink: 0 }}>
                    {loading ? (
                        <Skeleton variant="circular" width={48} height={48} sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
                    ) : profile ? (
                        <Box sx={{ position: 'relative' }}>
                            <Avatar
                                src={profile.pictureUrl}
                                alt={profile.displayName}
                                sx={{
                                    width: 48,
                                    height: 48,
                                    border: '2px solid rgba(255,255,255,0.2)',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                                }}
                            />
                        </Box>
                    ) : (
                        <Avatar sx={{ width: 48, height: 48, bgcolor: 'rgba(255,255,255,0.1)', color: 'white' }} />
                    )}
                </Box>

                {/* Middle - Greeting */}
                <Box sx={{ flex: 1, pt: 0 }}>
                    {loading ? (
                        <Box>
                            <Skeleton variant="text" width={100} sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
                            <Skeleton variant="text" width={120} sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
                        </Box>
                    ) : profile ? (
                        <Box>
                            <Typography
                                sx={{
                                    fontFamily: 'var(--font-prompt)',
                                    fontSize: '1.1rem',
                                    fontWeight: 600,
                                    color: '#FFFFFF',
                                    lineHeight: 1.2,
                                    letterSpacing: '-0.01em'
                                }}
                            >
                                สวัสดี, {profile.displayName}
                            </Typography>
                            <Typography
                                sx={{
                                    fontFamily: 'var(--font-prompt)',
                                    fontSize: '0.8rem',
                                    color: '#94A3B8', // Slate 400
                                    mt: 0.25,
                                    lineHeight: 1.4,
                                    fontWeight: 300
                                }}
                            >
                                Set-Event Customer
                            </Typography>
                        </Box>
                    ) : (
                        <Typography sx={{ fontFamily: 'var(--font-prompt)', color: '#94A3B8' }}>
                            Guest User
                        </Typography>
                    )}
                </Box>
            </Box>
        </Box>
    );
}
