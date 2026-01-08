'use client';

import { Box, Container, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, AppBar, Toolbar, Typography, IconButton, Avatar, Paper, BottomNavigation, BottomNavigationAction, Tooltip } from '@mui/material';
import { Home3, Calendar, People, Message, Setting2, Logout, HambergerMenu, ProfileCircle } from 'iconsax-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { signOut, useSession } from 'next-auth/react';

const drawerWidth = 260;

// Menu items with allowed roles
// Sidebar Menu Items
const sidebarItems = [
    { label: 'Dashboard', href: '/admin', icon: Home3, roles: ['admin'] },
    { label: 'Events', href: '/admin/events', icon: Calendar, roles: ['admin'] },
    { label: 'Customers', href: '/admin/customers', icon: People, roles: ['admin', 'sales'] },
    { label: 'ส่งอัพเดทลูกค้า', href: '/admin/progress', icon: Message, roles: ['admin', 'sales'] },
    { label: 'จัดการผู้ใช้', href: '/admin/users', icon: ProfileCircle, roles: ['admin'] },
    { label: 'Settings', href: '/admin/settings', icon: Setting2, roles: ['admin'] },
];

// Bottom Navigation Items (Mobile) - Can be different from Sidebar
const bottomNavItems = [
    { label: 'Home', href: '/admin', icon: Home3, roles: ['admin'] },
    { label: 'Events', href: '/admin/events', icon: Calendar, roles: ['admin'] },
    { label: 'ลูกค้า', href: '/admin/customers', icon: People, roles: ['admin', 'sales'] },
    { label: 'แชท', href: '/admin/progress', icon: Message, roles: ['admin', 'sales'] },
    { label: 'More', href: '/admin/settings', icon: Setting2, roles: ['admin'] },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);
    const { data: session } = useSession();
    const [userRole, setUserRole] = useState<string>('user');

    // Fetch user role from API
    useEffect(() => {
        async function fetchUserRole() {
            if (session?.user?.email) {
                try {
                    const res = await fetch('/api/admin/users');
                    const users = await res.json();
                    const currentUser = users.find((u: any) => u.email === session.user?.email);
                    if (currentUser) {
                        setUserRole(currentUser.role);
                    }
                } catch (error) {
                    console.error('Error fetching user role:', error);
                }
            }
        }
        fetchUserRole();
    }, [session]);

    // Filter menu items based on user role
    const desktopMenuItems = sidebarItems.filter(item => item.roles.includes(userRole));
    const mobileMenuItems = bottomNavItems.filter(item => item.roles.includes(userRole));

    const handleLogout = () => {
        signOut({ callbackUrl: '/admin/login' });
    };

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const drawer = (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflowX: 'hidden', background: 'linear-gradient(180deg, #111827 0%, #000000 100%)' }}>
            {/* Nav Items */}
            <Box sx={{ p: 2 }}>
                <Typography sx={{
                    fontFamily: 'var(--font-prompt)',
                    fontSize: '0.75rem',
                    color: 'rgba(255,255,255,0.4)',
                    mb: 1,
                    pl: 1.5,
                    textTransform: 'uppercase',
                    fontWeight: 600,
                    letterSpacing: 1
                }}>
                    Menu
                </Typography>
                <List sx={{ flex: 1 }}>
                    {desktopMenuItems.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;
                        return (
                            <ListItem key={item.href} disablePadding sx={{ mb: 1 }}>
                                <ListItemButton
                                    component={Link}
                                    href={item.href}
                                    onClick={() => setMobileOpen(false)}
                                    sx={{
                                        borderRadius: 3,
                                        mx: 1,
                                        py: 1.2,
                                        px: 2,
                                        position: 'relative',
                                        overflow: 'hidden',
                                        bgcolor: isActive ? '#0A5C5A' : 'transparent',
                                        background: isActive ? 'linear-gradient(135deg, #0A5C5A 0%, #053b3a 100%)' : 'transparent',
                                        boxShadow: isActive ? '0 8px 16px -4px rgba(10, 92, 90, 0.5)' : 'none',
                                        '&:hover': {
                                            bgcolor: isActive ? '#0A5C5A' : 'rgba(255,255,255,0.05)',
                                        },
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        '&::before': isActive ? {
                                            content: '""',
                                            position: 'absolute',
                                            left: 0,
                                            top: 0,
                                            width: '100%',
                                            height: '100%',
                                            background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
                                            pointerEvents: 'none'
                                        } : {}
                                    }}
                                >
                                    <ListItemIcon sx={{ minWidth: 36 }}>
                                        <Icon
                                            size={22}
                                            color={isActive ? '#FFFFFF' : '#9CA3AF'}
                                            variant={isActive ? 'Bold' : 'Outline'}
                                        />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={item.label}
                                        primaryTypographyProps={{
                                            fontFamily: 'var(--font-prompt)',
                                            fontSize: '0.9rem',
                                            fontWeight: isActive ? 600 : 400,
                                            color: isActive ? '#FFFFFF' : '#D1D5DB',
                                            letterSpacing: 0.3
                                        }}
                                    />
                                    {isActive && (
                                        <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.8)' }} />
                                    )}
                                </ListItemButton>
                            </ListItem>
                        );
                    })}
                </List>
            </Box>
        </Box>
    );


    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#F3F4F6' }}>
            {/* Global AppBar (Header) */}
            <AppBar
                position="fixed"
                sx={{
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                    bgcolor: 'rgba(17, 24, 39, 0.95)', // Deep slate almost black
                    backdropFilter: 'blur(20px)',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
                    borderBottom: '1px solid rgba(255,255,255,0.08)'
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
                            <HambergerMenu size="28" color="#FFF" />
                        </IconButton>

                        {/* Logo for Admin */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <img src="/images/logo_white.png" alt="Logo" style={{ height: 32, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }} />
                            <Box sx={{ height: 24, width: '1px', bgcolor: 'rgba(255,255,255,0.15)', display: { xs: 'none', sm: 'block' } }} />
                            <Typography
                                sx={{
                                    fontFamily: 'var(--font-prompt)',
                                    fontSize: '0.85rem',
                                    fontWeight: 500,
                                    color: 'rgba(255,255,255,0.7)',
                                    letterSpacing: 2,
                                    textTransform: 'uppercase',
                                    display: { xs: 'none', sm: 'block' }
                                }}
                            >
                                Admin Panel
                            </Typography>
                        </Box>
                    </Box>

                    {/* Right Side: User Profile */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                        <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
                            <Typography sx={{ fontFamily: 'var(--font-prompt)', fontSize: '0.9rem', color: '#fff', fontWeight: 500, lineHeight: 1.2 }}>
                                {session?.user?.name || 'Admin'}
                            </Typography>
                            <Typography sx={{ fontFamily: 'var(--font-prompt)', fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.2 }}>
                                {userRole}
                            </Typography>
                        </Box>
                        <Avatar sx={{
                            width: 40,
                            height: 40,
                            bgcolor: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            boxShadow: '0 0 15px rgba(255,255,255,0.05)'
                        }}>
                            {session?.user?.name?.charAt(0).toUpperCase() || 'A'}
                        </Avatar>
                        <Tooltip title="ออกจากระบบ" arrow>
                            <IconButton
                                size="small"
                                onClick={handleLogout}
                                sx={{
                                    color: 'rgba(255,255,255,0.5)',
                                    transition: 'all 0.2s',
                                    '&:hover': { color: '#EF4444', bgcolor: 'rgba(239, 68, 68, 0.1)' }
                                }}
                            >
                                <Logout size={20} color="white" />
                            </IconButton>
                        </Tooltip>
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
                        bgcolor: '#111827',
                        backgroundImage: 'none',
                        boxSizing: 'border-box',
                        pt: '70px',
                        borderRight: '1px solid rgba(255,255,255,0.05)'
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
                    zIndex: (theme) => theme.zIndex.drawer,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                        bgcolor: '#111827',
                        borderRight: '1px solid rgba(255,255,255,0.05)',
                    },
                }}
            >
                <Toolbar sx={{ minHeight: { xs: 64, md: 70 } }} />
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
                    pt: { xs: '64px', md: '70px' },
                    pb: { xs: '80px', md: 0 },
                    overflowX: 'hidden'
                }}
            >
                {/* Content Area */}
                <Box sx={{ flex: 1 }}>
                    <Container maxWidth="xl" sx={{ py: 4 }}>
                        {children}
                    </Container>
                </Box>
            </Box>

            {/* Mobile Bottom Navigation Menu */}
            <Paper
                sx={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    display: { xs: 'block', md: 'none' },
                    zIndex: 1200,
                    borderRadius: '20px 20px 0 0',
                    boxShadow: '0 -4px 25px rgba(0,0,0,0.05)',
                    borderTop: '1px solid rgba(0,0,0,0.03)',
                    overflow: 'hidden'
                }}
                elevation={0}
            >
                <BottomNavigation
                    showLabels
                    value={pathname}
                    sx={{
                        height: 60,
                        bgcolor: 'rgba(255,255,255,0.95)',
                        backdropFilter: 'blur(10px)',
                    }}
                >
                    {mobileMenuItems.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;
                        return (
                            <BottomNavigationAction
                                key={item.href}
                                label={item.label}
                                value={item.href}
                                component={Link}
                                href={item.href}
                                icon={
                                    <Box sx={{
                                        p: 0.5,
                                        borderRadius: '12px',
                                        bgcolor: isActive ? '#0A5C5A' : 'transparent',
                                        color: isActive ? 'white' : '#9CA3AF',
                                        mb: 0.5,
                                        transition: 'all 0.2s',
                                        boxShadow: isActive ? '0 4px 12px rgba(10, 92, 90, 0.3)' : 'none'
                                    }}>
                                        <Icon size={22} variant={isActive ? 'Bold' : 'Outline'} color="currentColor" />
                                    </Box>
                                }
                                sx={{
                                    fontFamily: 'var(--font-prompt)',
                                    color: isActive ? '#0A5C5A' : '#9CA3AF',
                                    minWidth: 'auto',
                                    padding: '6px 0',
                                    '&.Mui-selected': {
                                        color: '#0A5C5A',
                                    },
                                    '& .MuiBottomNavigationAction-label': {
                                        fontFamily: 'var(--font-prompt)',
                                        fontSize: '0.65rem',
                                        fontWeight: isActive ? 600 : 500,
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
