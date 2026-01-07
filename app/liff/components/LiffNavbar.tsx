'use client';

import { Box } from '@mui/material';
import { Home2, Calendar, DocumentText, User } from 'iconsax-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
    { icon: Home2, label: 'หน้าหลัก', href: '/liff' },
    { icon: Calendar, label: 'งานของฉัน', href: '/liff/events' },
    { icon: DocumentText, label: 'ใบเสนอราคา', href: '/liff/quotations' },
    { icon: User, label: 'โปรไฟล์', href: '/liff/profile' },
];

export default function LiffNavbar() {
    const pathname = usePathname();

    return (
        <Box
            component="nav"
            sx={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 100,
                bgcolor: 'white',
                borderTop: '1px solid rgba(0,0,0,0.06)',
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center',
                py: 1, // Reduced from 1.5
                px: 2,
                boxShadow: '0 -10px 40px rgba(0,0,0,0.05)',
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
                backdropFilter: 'blur(20px)',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
            }}
        >
            {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href ||
                    (item.href !== '/liff' && pathname?.startsWith(item.href));

                const activeColor = '#2563EB'; // Blue-600
                const inactiveColor = '#94A3B8'; // Slate-400

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        style={{ textDecoration: 'none', flex: 1 }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: 0.25, // Reduced gap
                                position: 'relative',
                                py: 0.5, // Reduced from 1
                                borderRadius: 3,
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                // Active State Styling
                                color: isActive ? activeColor : inactiveColor,
                            }}
                        >
                            {/* Icon Container with subtle animation */}
                            <Box
                                sx={{
                                    p: 0.5, // Reduced from 0.8
                                    borderRadius: '50%',
                                    bgcolor: isActive ? 'rgba(37, 99, 235, 0.1)' : 'transparent',
                                    transition: 'all 0.3s ease',
                                    transform: isActive ? 'translateY(-2px)' : 'none',
                                }}
                            >
                                <Icon
                                    size={24}
                                    variant={isActive ? 'Bold' : 'Outline'}
                                    color="currentColor"
                                />
                            </Box>

                            <Box
                                component="span"
                                sx={{
                                    fontFamily: 'var(--font-prompt)',
                                    fontSize: '0.7rem',
                                    fontWeight: isActive ? 600 : 500,
                                    color: 'currentColor',
                                    opacity: isActive ? 1 : 0.8,
                                }}
                            >
                                {item.label}
                            </Box>
                        </Box>
                    </Link>
                );
            })}
        </Box>
    );
}
