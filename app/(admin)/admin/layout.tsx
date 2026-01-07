'use client';

import { Box, Container, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, AppBar, Toolbar, Typography, IconButton, Avatar, Paper, BottomNavigation, BottomNavigationAction } from '@mui/material';
import { Home3, Calendar, People, Message, Setting2, Logout, HambergerMenu } from 'iconsax-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const drawerWidth = 260;

const menuItems = [
    { label: 'Dashboard', href: '/admin', icon: Home3 },
    { label: 'Events', href: '/admin/events', icon: Calendar },
    { label: 'Customers', href: '/admin/customers', icon: People },
    { label: 'ส่งอัพเดทลูกค้า', href: '/admin/progress', icon: Message },
    { label: 'Settings', href: '/admin/settings', icon: Setting2 },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const drawer = (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflowX: 'hidden', bgcolor: '#0a0a0a' }}>
            {/* Nav Items */}
            <List sx={{ flex: 1, px: 2, py: 2 }}>
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    return (
                        <ListItem key={item.href} disablePadding sx={{ mb: 0.5 }}>
                            <ListItemButton
                                component={Link}
                                href={item.href}
                                sx={{
                                    borderRadius: 0,
                                    borderLeft: isActive ? '4px solid #0A5C5A' : '4px solid transparent',
                                    py: 1.5,
                                    bgcolor: isActive ? 'rgba(255,255,255,0.05)' : 'transparent',
                                    '&:hover': {
                                        bgcolor: 'rgba(255,255,255,0.08)',
                                    },
                                    transition: 'all 0.2s'
                                }}
                            >
                                <ListItemIcon sx={{ minWidth: 40 }}>
                                    <Icon
                                        size={20}
                                        color={isActive ? '#0A5C5A' : 'rgba(255,255,255,0.5)'}
                                        variant={isActive ? 'Bold' : 'Outline'}
                                    />
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.label}
                                    primaryTypographyProps={{
                                        fontFamily: 'var(--font-prompt)',
                                        fontSize: '0.9rem',
                                        fontWeight: isActive ? 600 : 400,
                                        color: isActive ? '#fff' : 'rgba(255,255,255,0.7)',
                                        letterSpacing: 0.5
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f8f9fa' }}>
            {/* Global AppBar (Header) */}
            <AppBar
                position="fixed"
                sx={{
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                    bgcolor: 'rgba(26, 26, 26, 0.9)',
                    backdropFilter: 'blur(20px)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    borderBottom: '1px solid rgba(255,255,255,0.1)'
                }}
            >
                <Toolbar sx={{ justifyContent: 'space-between', minHeight: { xs: 64, md: 70 } }}>
                    {/* Left Side: Menu Toggle + Logo */}
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ mr: 2, display: { md: 'none' }, color: '#FFF' }}
                        >
                            <HambergerMenu size="32" color="#FFF" variant="TwoTone" />
                        </IconButton>

                        {/* Logo for Admin */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src="/images/logo_white.png" alt="Logo" style={{ height: 32 }} />
                            <Box sx={{ height: 24, w: '1px', bgcolor: 'rgba(255,255,255,0.2)', mx: 2, display: { xs: 'none', sm: 'block' } }} />
                            <Typography
                                sx={{
                                    fontFamily: 'var(--font-prompt)',
                                    fontSize: '0.85rem',
                                    color: 'rgba(255,255,255,0.5)',
                                    letterSpacing: 1,
                                    textTransform: 'uppercase',
                                    display: { xs: 'none', sm: 'block' }
                                }}
                            >
                                Admin Panel
                            </Typography>
                        </Box>
                    </Box>

                    {/* Right Side: User Profile */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
                            <Typography sx={{ fontFamily: 'var(--font-prompt)', fontSize: '0.85rem', color: '#fff', fontWeight: 500 }}>
                                Admin
                            </Typography>
                        </Box>
                        <Avatar sx={{ width: 38, height: 38, bgcolor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}>A</Avatar>
                        <IconButton size="small" sx={{ color: 'rgba(255,255,255,0.6)', '&:hover': { color: '#fff' } }}>
                            <Logout size={20} color="#FFFFFF" />
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Mobile Drawer */}
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{ keepMounted: true }}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        bgcolor: '#0a0a0a',
                        backgroundImage: 'none',
                        boxSizing: 'border-box',
                        pt: '70px',
                    },
                }}
            >
                {drawer}
            </Drawer>

            {/* Desktop Drawer */}
            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: 'none', md: 'block' },
                    width: drawerWidth,
                    flexShrink: 0,
                    zIndex: (theme) => theme.zIndex.drawer, // Lower than AppBar
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                        bgcolor: '#0a0a0a',
                        backgroundImage: 'none',
                        border: 'none',
                        borderRight: '1px solid rgba(255,255,255,0.1)',
                    },
                }}
            >
                <Toolbar sx={{ minHeight: { xs: 64, md: 70 } }} /> {/* Spacer for Header */}
                {drawer}
            </Drawer>

            {/* Main Content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    width: { md: `calc(100% - ${drawerWidth}px)` },
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: '100vh',
                    pt: { xs: '64px', md: '70px' }, // Space for Header
                    pb: { xs: '65px', md: 0 }, // Space for Bottom Nav on Mobile
                }}
            >
                {/* Content Area */}
                <Box sx={{ flex: 1 }}>
                    <Container maxWidth="xl" sx={{ py: 4 }}>
                        {children}
                    </Container>
                </Box>

                {/* Admin Footer (Copyright) */}
                <Box
                    component="footer"
                    sx={{
                        py: 3,
                        px: 3,
                        bgcolor: 'white',
                        borderTop: '1px solid rgba(0,0,0,0.05)',
                        mt: 'auto',
                        mb: { xs: 2, md: 0 } // Lift up slightly on mobile
                    }}
                >
                    <Box sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 1
                    }}>
                        <Typography variant="body2" sx={{ fontFamily: 'var(--font-prompt)', color: '#666' }}>
                            &copy; {new Date().getFullYear()} SetEvent Admin Panel
                        </Typography>
                        <Typography variant="caption" sx={{ fontFamily: 'var(--font-prompt)', color: '#999' }}>
                            Version 1.0.0
                        </Typography>
                    </Box>
                </Box>
            </Box>

            {/* Mobile Bottom Navigation Menu */}
            <Paper
                sx={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    display: { xs: 'block', md: 'none' }, // Visible on Mobile Only
                    zIndex: 1200,
                    borderRadius: 0,
                    boxShadow: '0 -4px 20px rgba(0,0,0,0.05)',
                    borderTop: '1px solid rgba(0,0,0,0.05)'
                }}
                elevation={0}
            >
                <BottomNavigation
                    showLabels
                    value={pathname}
                    sx={{
                        height: 65,
                        bgcolor: 'white',
                    }}
                >
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;
                        // Shorten label for mobile if needed
                        let mobileLabel = item.label;
                        if (item.label === 'ส่งอัพเดทลูกค้า') mobileLabel = 'แชท';

                        return (
                            <BottomNavigationAction
                                key={item.href}
                                label={mobileLabel}
                                value={item.href}
                                component={Link}
                                href={item.href}
                                icon={<Icon size={24} variant={isActive ? 'Bold' : 'Outline'} color={isActive ? '#0A5C5A' : '#A5A5A5'} />}
                                sx={{
                                    fontFamily: 'var(--font-prompt)',
                                    color: isActive ? 'var(--primary)' : '#999',
                                    '&.Mui-selected': {
                                        color: 'var(--primary)',
                                    },
                                    '& .MuiBottomNavigationAction-label': {
                                        fontFamily: 'var(--font-prompt)',
                                        fontSize: '0.7rem',
                                        mt: 0.5
                                    }
                                }}
                            />
                        );
                    })}
                </BottomNavigation>
            </Paper>
        </Box>
    );
}
