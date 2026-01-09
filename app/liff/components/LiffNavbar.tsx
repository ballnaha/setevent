'use client';

import { Box, Typography } from '@mui/material';
import { Home2, User, Calendar, Notification, Add } from 'iconsax-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function LiffNavbar() {
    const pathname = usePathname();

    // Custom shape using clip-path or just clever positioning. 
    // For simplicity and robustness, we'll use a standard bar with a floating button 
    // that overlaps the top edge, which is a common implementation of this design.
    // If a true "cutout" is needed, SVG is better, but this usually looks good enough.

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
                pointerEvents: 'none', // Allow clicking through the empty space above
                height: 100, // Reserve space
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
                    gridTemplateColumns: 'repeat(5, 1fr)', // 5 equal columns
                    alignItems: 'center',
                    justifyItems: 'center', // Center items horizontally in their grid cells
                    px: 1, // Minimal padding as grid handles spacing
                    pointerEvents: 'auto',
                }}
            >
                <NavItem icon={Home2} label="Home" href="/liff" isActive={pathname === '/liff'} />
                <NavItem icon={User} label="Profile" href="/liff/profile" isActive={pathname === '/liff/profile'} />

                {/* Empty Middle Column for Button */}
                <Box />

                <NavItem icon={Calendar} label="Calendar" href="/liff/events" isActive={pathname?.startsWith('/liff/events')} />
                <NavItem icon={Notification} label="Alert" href="/liff/notifications" isActive={pathname === '/liff/notifications'} />
            </Box>

            {/* Center Floating Button */}
            <Box
                component={Link}
                href="/liff/create" // Or wherever the plus button goes
                sx={{
                    position: 'absolute',
                    bottom: 30, // Push it up to overlap half
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 64,
                    height: 64,
                    bgcolor: '#3B82F6',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 24px rgba(59, 130, 246, 0.4)',
                    pointerEvents: 'auto',
                    color: 'white',
                    border: '4px solid #F8FAFC', // Match page bg to fake a gap/cutout if needed, or white if bar is white
                    zIndex: 101,
                    transition: 'transform 0.2s',
                    '&:hover': {
                        transform: 'translateX(-50%) scale(1.05)',
                    }
                }}
            >
                <Add size={32} color="white" />
            </Box>
        </Box>
    );
}

// Sub-component for Nav Items to keep it clean
function NavItem({ icon: Icon, label, href, isActive }: { icon: any, label: string, href: string, isActive: boolean }) {
    const activeColor = '#1E293B'; // Dark Slate
    const inactiveColor = '#94A3B8'; // Slate 400

    return (
        <Link href={href} style={{ textDecoration: 'none' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                <Icon
                    size={24}
                    variant={isActive ? 'Bold' : 'Linear'}
                    color={isActive ? activeColor : inactiveColor}
                />
                <Typography
                    sx={{
                        fontFamily: 'var(--font-prompt)',
                        fontSize: '0.7rem',
                        fontWeight: isActive ? 600 : 500,
                        color: isActive ? activeColor : inactiveColor
                    }}
                >
                    {label}
                </Typography>
            </Box>
        </Link>
    );
}
