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
                borderTop: '1px solid rgba(0,0,0,0.08)',
                display: 'flex',
                justifyContent: 'space-around',
                py: 1,
                px: 2,
                boxShadow: '0 -4px 20px rgba(0,0,0,0.05)',
            }}
        >
            {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        style={{ textDecoration: 'none' }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: 0.5,
                                color: isActive ? 'var(--primary)' : 'rgba(0,0,0,0.4)',
                                transition: 'color 0.2s',
                            }}
                        >
                            <Icon
                                size={24}
                                variant={isActive ? 'Outline' : 'Linear'}
                                color={isActive ? 'var(--primary)' : 'rgba(0,0,0,0.4)'}
                            />
                            <Box
                                component="span"
                                sx={{
                                    fontFamily: 'var(--font-prompt)',
                                    fontSize: '0.7rem',
                                    fontWeight: isActive ? 600 : 400,
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
