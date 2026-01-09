'use client';

import { useEffect, useState } from 'react';
import { Box, Avatar, Typography, Skeleton, Chip, IconButton } from '@mui/material';
import { initializeLiff, LiffProfile, isMockMode } from '@/lib/liff';
import { Notification, Setting2 } from 'iconsax-react';

interface LiffHeaderProps {
    onSearch?: (query: string) => void;
}

export default function LiffHeader({ onSearch }: LiffHeaderProps) {
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
                bgcolor: '#FFFFFF',
                px: 3,
                pt: 3,
                pb: 2,
            }}
        >
            {/* Top Row: Profile & Actions */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {/* Avatar with Badge */}
                    <Box sx={{ position: 'relative' }}>
                        {loading ? (
                            <Skeleton variant="circular" width={50} height={50} />
                        ) : (
                            <Avatar
                                src={profile?.pictureUrl}
                                alt={profile?.displayName}
                                sx={{ width: 50, height: 50, border: '2px solid #fff', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                            />
                        )}
                        {/* Plus Badge */}
                        <Box
                            sx={{
                                position: 'absolute',
                                bottom: 0,
                                right: -4,
                                width: 20,
                                height: 20,
                                bgcolor: '#3B82F6',
                                borderRadius: '50%',
                                border: '2px solid #fff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontSize: '12px'
                            }}
                        >
                            +
                        </Box>
                    </Box>

                    {/* Greeting & Name */}
                    <Box>
                        <Typography sx={{ fontFamily: 'var(--font-prompt)', fontSize: '0.875rem', color: '#94A3B8' }}>
                            Good Day 👋
                        </Typography>
                        {loading ? (
                            <Skeleton variant="text" width={100} height={32} />
                        ) : (
                            <Typography
                                variant="h5"
                                sx={{
                                    fontFamily: 'var(--font-prompt)',
                                    fontWeight: 700,
                                    color: '#1E293B',
                                    lineHeight: 1.2
                                }}
                            >
                                {profile?.displayName || 'Guest'}
                            </Typography>
                        )}
                    </Box>
                </Box>

                {/* Settings Icon */}
                <IconButton
                    sx={{
                        border: '1px solid #F1F5F9',
                        borderRadius: '50%',
                        color: '#94A3B8'
                    }}
                >
                    <Setting2 size={24} color="#94A3B8" />
                    {/* Only iconsax Notification was imported, using it as placeholder for settings/bell */}
                </IconButton>
            </Box>

            {/* Search Bar */}
            <Box
                sx={{
                    bgcolor: '#F8FAFC',
                    borderRadius: 3,
                    px: 2,
                    py: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5
                }}
            >
                {/* Search Icon placeholder */}
                <Typography sx={{ color: '#94A3B8', fontSize: '1.2rem' }}>🔍</Typography>
                <input
                    type="text"
                    placeholder="Search Project ..."
                    onChange={(e) => onSearch?.(e.target.value)}
                    style={{
                        border: 'none',
                        background: 'transparent',
                        width: '100%',
                        fontSize: '0.95rem',
                        fontFamily: 'var(--font-prompt)',
                        color: '#1E293B',
                        outline: 'none'
                    }}
                />
            </Box>
        </Box>
    );
}
