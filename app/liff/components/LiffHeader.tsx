'use client';

import { useEffect, useState } from 'react';
import { Box, Avatar, Typography, Skeleton, IconButton, Menu, MenuItem, ListItemIcon } from '@mui/material';
import { initializeLiff, LiffProfile } from '@/lib/liff';
import { Setting2, CloseCircle, User, LogoutCurve, SearchNormal } from 'iconsax-react';
import { useRouter } from 'next/navigation';

interface LiffHeaderProps {
    onSearch?: (query: string) => void;
    searchValue?: string;
    onClear?: () => void;
}

export default function LiffHeader({ onSearch, searchValue = '', onClear }: LiffHeaderProps) {
    const [profile, setProfile] = useState<LiffProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const router = useRouter();

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleNavigate = (path: string) => {
        handleClose();
        router.push(path);
    };

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
                    onClick={handleClick}
                    sx={{
                        border: '1px solid #F1F5F9',
                        borderRadius: '50%',
                        color: '#94A3B8'
                    }}
                >
                    <Setting2 size={24} color="#94A3B8" />
                </IconButton>

                <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    onClick={handleClose}
                    PaperProps={{
                        elevation: 0,
                        sx: {
                            overflow: 'visible',
                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
                            mt: 1.5,
                            borderRadius: 3,
                            minWidth: 180,
                            '&:before': {
                                content: '""',
                                display: 'block',
                                position: 'absolute',
                                top: 0,
                                right: 14,
                                width: 10,
                                height: 10,
                                bgcolor: 'background: paper',
                                transform: 'translateY(-50%) rotate(45deg)',
                                zIndex: 0,
                                margin: 0 // Resetting margin
                            },
                        },
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                    <MenuItem
                        onClick={() => handleNavigate('/liff/profile')}
                        sx={{
                            fontFamily: 'var(--font-prompt)',
                            py: 1.2
                        }}
                    >
                        <ListItemIcon>
                            <User size={20} variant="Bulk" color="#3B82F6" />
                        </ListItemIcon>
                        โปรไฟล์ของฉัน
                    </MenuItem>
                </Menu>
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
                <SearchNormal size={20} color="#94A3B8" />
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
