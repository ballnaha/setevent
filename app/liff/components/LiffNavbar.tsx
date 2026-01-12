'use client';

import { Box, Typography } from '@mui/material';
import { Home2, User, FolderOpen } from 'iconsax-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function LiffNavbar() {
    const pathname = usePathname();

    // Check if Home is active
    const isHomeActive = pathname === '/liff' || pathname === '/liff/';

    return (
        <Box
            component="nav"
            sx={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 100,
                bgcolor: 'transparent',
                pointerEvents: 'none',
                height: 100,
                display: 'flex',
                alignItems: 'flex-end'
            }}
        >
            {/* Main Bar Background */}
            <Box
                sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 60,
                    bgcolor: 'white',
                    borderTopLeftRadius: 30,
                    borderTopRightRadius: 30,
                    boxShadow: '0 -10px 40px rgba(0,0,0,0.08)',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr',
                    alignItems: 'center',
                    justifyItems: 'center',
                    px: 3,
                    pointerEvents: 'auto',
                }}
            >
                <NavItem
                    icon={FolderOpen}
                    label="โปรเจกต์"
                    href="/liff/events"
                    isActive={pathname?.startsWith('/liff/events')}
                />

                {/* Empty Middle Column */}
                <Box />

                <NavItem
                    icon={User}
                    label="โปรไฟล์"
                    href="/liff/profile"
                    isActive={pathname?.startsWith('/liff/profile')}
                />
            </Box>

            {/* Center Floating Button - Home */}
            <Box
                component={Link}
                href="/liff"
                sx={{
                    position: 'absolute',
                    bottom: 10,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 64,
                    height: 64,
                    background: isHomeActive
                        ? 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)'
                        : 'linear-gradient(135deg, #94A3B8 0%, #64748B 100%)',
                    borderRadius: '50%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: isHomeActive
                        ? '0 8px 24px rgba(59, 130, 246, 0.5), 0 0 0 4px rgba(59, 130, 246, 0.2)'
                        : '0 8px 24px rgba(59, 130, 246, 0.4)',
                    pointerEvents: 'auto',
                    color: 'white',
                    border: '4px solid white',
                    zIndex: 101,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    textDecoration: 'none',
                    '&:hover': {
                        transform: 'translateX(-50%) scale(1.05)',
                    },
                    '&:active': {
                        transform: 'translateX(-50%) scale(0.95)',
                    }
                }}
            >
                <Home2 size={26} color="white" variant="Bold" />
                <Typography
                    sx={{
                        fontFamily: 'var(--font-prompt)',
                        fontSize: '0.55rem',
                        fontWeight: 600,
                        color: 'white',
                        mt: 0.25,
                        lineHeight: 1,
                    }}
                >
                    หน้าแรก
                </Typography>
            </Box>
        </Box>
    );
}

// Sub-component for Nav Items
function NavItem({ icon: Icon, label, href, isActive }: { icon: any, label: string, href: string, isActive: boolean }) {
    const activeColor = '#3B82F6';
    const inactiveColor = '#94A3B8';

    return (
        <Link href={href} style={{ textDecoration: 'none' }}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 0.3,
                    transition: 'transform 0.2s',
                    '&:active': {
                        transform: 'scale(0.9)',
                    }
                }}
            >
                <Box
                    sx={{
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    {isActive && (
                        <Box
                            sx={{
                                position: 'absolute',
                                width: 32,
                                height: 32,
                                borderRadius: '50%',
                                bgcolor: 'rgba(59, 130, 246, 0.1)',
                            }}
                        />
                    )}
                    <Icon
                        size={22}
                        variant={isActive ? 'Bold' : 'Linear'}
                        color={isActive ? activeColor : inactiveColor}
                    />
                </Box>
                <Typography
                    sx={{
                        fontFamily: 'var(--font-prompt)',
                        fontSize: '0.65rem',
                        fontWeight: isActive ? 600 : 500,
                        color: isActive ? activeColor : inactiveColor,
                        lineHeight: 1,
                    }}
                >
                    {label}
                </Typography>
            </Box>
        </Link>
    );
}
