'use client';

import { useEffect, useState } from 'react';
import { Box, Avatar, Typography, Skeleton, IconButton } from '@mui/material';
import { initializeLiff, LiffProfile } from '@/lib/liff';
import { Setting2, CloseCircle } from 'iconsax-react';

interface LiffHeaderProps {
    onSearch?: (query: string) => void;
    searchValue?: string;
    onClear?: () => void;
}

export default function LiffHeader({ onSearch, searchValue = '', onClear }: LiffHeaderProps) {
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

                    </Box>

                    {/* Greeting & Name */}
                    <Box>
                        <Typography sx={{ fontFamily: 'var(--font-prompt)', fontSize: '0.875rem', color: '#94A3B8' }}>
                            สวัสดี คุณ
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
                    gap: 1.5,
                    border: searchValue ? '1px solid #3B82F6' : '1px solid transparent',
                    transition: 'border-color 0.2s',
                }}
            >
                {/* Search Icon */}
                <Typography sx={{ color: '#94A3B8', fontSize: '1.2rem' }}>🔍</Typography>
                <input
                    type="text"
                    placeholder="ค้นหาโปรเจกต์..."
                    value={searchValue}
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
                {/* Clear Button */}
                {searchValue && (
                    <IconButton
                        size="small"
                        onClick={onClear}
                        sx={{
                            p: 0.5,
                            color: '#3B82F6',
                            transition: 'all 0.2s',
                            '&:hover': {
                                color: '#2563EB',
                                bgcolor: 'rgba(59, 130, 246, 0.1)',
                            }
                        }}
                    >
                        <CloseCircle size={20} variant="Bold" color="#3B82F6" />
                    </IconButton>
                )}
            </Box>
        </Box>
    );
}
