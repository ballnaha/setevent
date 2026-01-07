'use client';

import { useEffect, useState } from 'react';
import { Box, Avatar, Typography, Skeleton, IconButton, Chip } from '@mui/material';
import { Home2, Notification, Setting2 } from 'iconsax-react';
import Link from 'next/link';
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
                position: 'sticky',
                top: 0,
                zIndex: 100,
                bgcolor: '#1a1a1a',
                borderBottom: '1px solid rgba(0,0,0,0.08)',
                px: 2,
                py: 1.5,
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                {/* Profile Section */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    {loading ? (
                        <>
                            <Skeleton variant="circular" width={44} height={44} />
                            <Box>
                                <Skeleton variant="text" width={100} height={20} />
                                <Skeleton variant="text" width={60} height={16} />
                            </Box>
                        </>
                    ) : profile ? (
                        <>
                            <Avatar
                                src={profile.pictureUrl}
                                alt={profile.displayName}
                                sx={{ width: 44, height: 44, border: '2px solid var(--primary)' }}
                            />
                            <Box>
                                <Typography
                                    sx={{
                                        fontFamily: 'var(--font-prompt)',
                                        fontWeight: 600,
                                        fontSize: '0.95rem',
                                        color: '#fff',
                                        lineHeight: 1.2,
                                    }}
                                >
                                    {profile.displayName}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Typography
                                        sx={{
                                            fontFamily: 'var(--font-prompt)',
                                            fontSize: '0.75rem',
                                            color: 'var(--primary)',
                                            fontWeight: 500,
                                        }}
                                    >
                                        SETEVENT Member
                                    </Typography>
                                    {isMockMode() && (
                                        <Chip
                                            label="🧪 Mock"
                                            size="small"
                                            sx={{
                                                height: 18,
                                                fontSize: '0.6rem',
                                                bgcolor: '#fef3c7',
                                                color: '#d97706',
                                                fontWeight: 600,
                                            }}
                                        />
                                    )}
                                </Box>
                            </Box>
                        </>
                    ) : (
                        <Typography sx={{ fontFamily: 'var(--font-prompt)', color: 'gray' }}>
                            กรุณาเข้าสู่ระบบ
                        </Typography>
                    )}
                </Box>

                {/* Action Icons */}
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <IconButton
                        component={Link}
                        href="/liff"
                        sx={{ color: 'var(--foreground)' }}
                    >
                        <Home2 size={22} variant="Outline" color="#fff" />
                    </IconButton>
                    <IconButton sx={{ color: 'var(--foreground)' }}>
                        <Notification size={22} variant="Outline" color="#fff" />
                    </IconButton>
                    <IconButton
                        component={Link}
                        href="/liff/settings"
                        sx={{ color: 'var(--foreground)' }}
                    >
                        <Setting2 size={22} variant="Outline" color="#fff" />
                    </IconButton>
                </Box>
            </Box>
        </Box>
    );
}
