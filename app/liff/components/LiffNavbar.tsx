'use client';

import { Box, Typography } from '@mui/material';
import { Home2, User, Calendar, Notification, FolderOpen } from 'iconsax-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function LiffNavbar() {
    const pathname = usePathname();

    // Check if on main liff page (my projects)
    const isMyProjectActive = pathname === '/liff' || pathname === '/liff/';

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
                    gridTemplateColumns: 'repeat(5, 1fr)',
                    alignItems: 'center',
                    justifyItems: 'center',
                    px: 1,
                    pointerEvents: 'auto',
                }}
            >
                <NavItem icon={Home2} label="หน้าแรก" href="/liff" isActive={isMyProjectActive} />
                <NavItem icon={Calendar} label="กำหนดการ" href="/liff/events" isActive={pathname?.startsWith('/liff/events')} />

                {/* Empty Middle Column for Floating Button */}
                <Box />

                <NavItem icon={Notification} label="แจ้งเตือน" href="/liff/notifications" isActive={pathname === '/liff/notifications'} />
                <NavItem icon={User} label="โปรไฟล์" href="/liff/profile" isActive={pathname === '/liff/profile'} />
            </Box>

            {/* Center Floating Button - My Project */}
            <Box
                component={Link}
                href="/liff"
                sx={{
                    position: 'absolute',
                    bottom: 20,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 64,
                    height: 64,
                    background: isMyProjectActive
                        ? 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)'
                        : 'linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)',
                    borderRadius: '50%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: isMyProjectActive
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
                <FolderOpen size={26} color="white" variant="Bold" />
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
                    โปรเจกต์
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
