"use client";

import React, { useState } from "react";
import {
    AppBar,
    Box,
    Toolbar,
    Typography,
    Button,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Menu,
    MenuItem,
    Collapse,
    Fade
} from "@mui/material";
import { HambergerMenu, ArrowDown2, ArrowRight2, Speaker, Monitor, LampOn, Layer } from "iconsax-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

const navItems = [
    { label: "HOME", href: "/" },
    {
        label: "PRODUCTS",
        href: "/products",
        children: [
            { label: "Audio System", href: "/products/audio", icon: <Speaker size="20" color="currentColor" variant="Bulk" /> },
            { label: "Visual System", href: "/products/visual", icon: <Monitor size="20" color="currentColor" variant="Bulk" /> },
            { label: "Lighting", href: "/products/lighting", icon: <LampOn size="20" color="currentColor" variant="Bulk" /> },
            { label: "Structure & Stage", href: "/products/structure", icon: <Layer size="20" color="currentColor" variant="Bulk" /> },
        ]
    },
    { label: "SERVICES", href: "/services" },
    { label: "PORTFOLIO", href: "/portfolio" },
    { label: "RENTAL", href: "/rental" },
    { label: "CONTACT", href: "/contact" },
];

export default function Header() {
    const [mobileOpen, setMobileOpen] = useState(false);
    // State for Products Dropdown
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const openDropdown = Boolean(anchorEl);
    const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

    // State for Mobile Products Collapse
    const [mobileProductsOpen, setMobileProductsOpen] = useState(false);

    const pathname = usePathname();

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleHoverOpen = (event: React.MouseEvent<HTMLElement>) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setAnchorEl(event.currentTarget);
    };

    const handleHoverClose = () => {
        timeoutRef.current = setTimeout(() => {
            setAnchorEl(null);
        }, 150); // Small delay to allow moving to menu
    };

    const handleMenuEnter = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    };

    const handleMenuLeave = () => {
        handleHoverClose();
    };

    const isActive = (href: string) => {
        if (href === "/") return pathname === "/";
        return pathname.startsWith(href);
    };

    const drawer = (
        <Box sx={{ textAlign: "center", height: "100%", bgcolor: "var(--background)", color: "var(--foreground)" }}>
            <Box onClick={handleDrawerToggle} sx={{ py: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
                <Link href="/" style={{ display: 'block', position: 'relative', width: '150px', height: '60px' }}>
                    <Image
                        src="/images/logo1.png"
                        alt="SetEvent Logo"
                        fill
                        style={{ objectFit: 'contain' }}
                        priority
                    />
                </Link>
            </Box>
            <List>
                {navItems.map((item) => (
                    <React.Fragment key={item.label}>
                        {item.children ? (
                            <>
                                <ListItem disablePadding>
                                    <ListItemButton
                                        onClick={() => setMobileProductsOpen(!mobileProductsOpen)}
                                        sx={{
                                            textAlign: "center",
                                            bgcolor: isActive(item.href) ? 'rgba(0,194,203,0.1)' : 'transparent',
                                            borderLeft: isActive(item.href) ? '4px solid var(--primary)' : '4px solid transparent',
                                        }}
                                    >
                                        <ListItemText
                                            primary={
                                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                                                    {item.label}
                                                    <ArrowDown2 size="16" color="var(--foreground)" style={{ transform: mobileProductsOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }} />
                                                </Box>
                                            }
                                            primaryTypographyProps={{
                                                fontFamily: 'var(--font-prompt)',
                                                color: isActive(item.href) ? 'var(--primary)' : 'var(--foreground)',
                                                fontWeight: isActive(item.href) ? 600 : 400,
                                            }}
                                        />
                                    </ListItemButton>
                                </ListItem>
                                <Collapse in={mobileProductsOpen} timeout="auto" unmountOnExit>
                                    <List component="div" disablePadding sx={{ bgcolor: 'rgba(0,0,0,0.02)', mx: 2, borderRadius: 2, mb: 1 }}>
                                        {item.children.map((child) => (
                                            <ListItem key={child.label} disablePadding>
                                                <ListItemButton
                                                    component={Link}
                                                    href={child.href}
                                                    onClick={handleDrawerToggle} // Close drawer on selection
                                                    sx={{
                                                        pl: 2,
                                                        py: 1.5,
                                                        borderRadius: 2,
                                                        mb: 0.5,
                                                        '&:hover': {
                                                            bgcolor: 'rgba(0,194,203,0.08)',
                                                        }
                                                    }}
                                                >
                                                    <Box sx={{
                                                        mr: 2,
                                                        display: 'flex',
                                                        p: 0.8,
                                                        borderRadius: 1,
                                                        bgcolor: isActive(child.href) ? 'var(--primary)' : 'rgba(0,0,0,0.05)',
                                                        color: isActive(child.href) ? '#fff' : 'var(--foreground)'
                                                    }}>
                                                        {child.icon}
                                                    </Box>
                                                    <ListItemText
                                                        primary={child.label}
                                                        primaryTypographyProps={{
                                                            fontFamily: 'var(--font-prompt)',
                                                            fontSize: '0.9rem',
                                                            fontWeight: isActive(child.href) ? 600 : 400,
                                                            color: isActive(child.href) ? 'var(--primary)' : 'var(--foreground)',
                                                        }}
                                                    />
                                                </ListItemButton>
                                            </ListItem>
                                        ))}
                                    </List>
                                </Collapse>
                            </>
                        ) : (
                            <ListItem disablePadding>
                                <ListItemButton
                                    sx={{
                                        textAlign: "center",
                                        bgcolor: isActive(item.href) ? 'rgba(0,194,203,0.1)' : 'transparent',
                                        borderLeft: isActive(item.href) ? '4px solid var(--primary)' : '4px solid transparent',
                                        '&:hover': {
                                            bgcolor: 'rgba(0,194,203,0.05)',
                                        }
                                    }}
                                    component={Link}
                                    href={item.href}
                                    onClick={handleDrawerToggle}
                                >
                                    <ListItemText
                                        primary={item.label}
                                        primaryTypographyProps={{
                                            fontFamily: 'var(--font-prompt)',
                                            color: isActive(item.href) ? 'var(--primary)' : 'var(--foreground)',
                                            fontWeight: isActive(item.href) ? 600 : 400,
                                        }}
                                    />
                                </ListItemButton>
                            </ListItem>
                        )}
                    </React.Fragment>
                ))}
            </List>
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
                <Button
                    variant="contained"
                    fullWidth
                    sx={{
                        bgcolor: 'var(--tertiary)',
                        color: 'white',
                        borderRadius: '50px',
                        fontFamily: 'var(--font-prompt)',
                        py: 1.5,
                        boxShadow: '0 4px 15px rgba(204, 164, 59, 0.25)',
                        textTransform: 'none',
                        fontWeight: 600,
                        '&:hover': {
                            bgcolor: 'var(--secondary)',
                        }
                    }}
                >
                    ขอใบเสนอราคา
                </Button>
            </Box>
        </Box>
    );

    return (
        <Box sx={{ display: "flex" }}>
            <AppBar
                component="nav"
                position="sticky"
                color="default"
                sx={{
                    bgcolor: "var(--background)",
                    boxShadow: "0 4px 20px -10px rgba(0,0,0,0.1)",
                    borderBottom: "1px solid rgba(0,0,0,0.05)",
                    backgroundImage: 'none'
                }}
            >
                <Toolbar sx={{ justifyContent: "space-between", height: '80px' }}>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { md: "none" }, color: "var(--foreground)" }}
                    >
                        <HambergerMenu size="32" color="var(--foreground)" />
                    </IconButton>

                    <Box
                        component={Link}
                        href="/"
                        sx={{
                            display: { xs: "block", md: "block" },
                            position: 'relative',
                            width: { xs: 120, sm: 160 },
                            height: 60,
                            ml: { xs: 'auto', md: 0 },
                            mr: { xs: 'auto', md: 0 },
                        }}
                    >
                        <Image
                            src="/images/logo1.png"
                            alt="SetEvent Logo"
                            fill
                            style={{ objectFit: 'contain' }}
                            priority
                        />
                    </Box>

                    <Box sx={{ display: { xs: "none", md: "flex" }, gap: 5 }}>
                        {navItems.map((item) => {
                            const active = isActive(item.href) || (item.children && item.children.some(child => isActive(child.href)));

                            if (item.children) {
                                return (
                                    <Box
                                        key={item.label}
                                        onMouseLeave={handleHoverClose}
                                        onMouseEnter={handleHoverOpen}
                                    >
                                        <Box
                                            component={Link}
                                            href={item.href}
                                            sx={{
                                                position: 'relative',
                                                cursor: 'pointer',
                                                py: 1,
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 0.5,
                                                '&::after': {
                                                    content: '""',
                                                    position: 'absolute',
                                                    bottom: 0,
                                                    left: 0,
                                                    width: (active || openDropdown) ? '100%' : '0%',
                                                    height: '2px',
                                                    bgcolor: 'var(--tertiary)',
                                                    transition: 'width 0.3s ease-in-out',
                                                },
                                                '&:hover::after': {
                                                    width: '100%',
                                                }
                                            }}
                                        >
                                            <Typography
                                                sx={{
                                                    color: (active || openDropdown) ? 'var(--primary)' : 'var(--foreground)',
                                                    fontFamily: 'var(--font-prompt)',
                                                    fontWeight: (active || openDropdown) ? 700 : 500,
                                                    fontSize: '1rem',
                                                    transition: 'color 0.3s ease',
                                                    textTransform: 'none',
                                                    '&:hover': {
                                                        color: 'var(--primary)',
                                                    }
                                                }}
                                            >
                                                {item.label}
                                            </Typography>
                                            <ArrowDown2
                                                size="16"
                                                color={(active || openDropdown) ? 'var(--primary)' : 'var(--foreground)'}
                                                variant="Bold"
                                                style={{
                                                    transform: openDropdown ? 'rotate(180deg)' : 'rotate(0deg)',
                                                    transition: 'transform 0.3s'
                                                }}
                                            />
                                        </Box>
                                        <Menu
                                            anchorEl={anchorEl}
                                            open={openDropdown}
                                            onClose={handleHoverClose}
                                            TransitionComponent={Fade}
                                            disableScrollLock={true}
                                            MenuListProps={{
                                                onMouseEnter: handleMenuEnter,
                                                onMouseLeave: handleMenuLeave,
                                                sx: { py: 1 }
                                            }}
                                            PaperProps={{
                                                elevation: 0,
                                                sx: {
                                                    mt: 2,
                                                    overflow: 'visible',
                                                    filter: 'drop-shadow(0px 20px 50px rgba(0,0,0,0.1))',
                                                    bgcolor: 'rgba(255, 255, 255, 0.95)', // Increased opacity for readability
                                                    backdropFilter: 'blur(20px)',
                                                    border: '1px solid rgba(255, 255, 255, 0.8)',
                                                    borderRadius: 4,
                                                    minWidth: 260,
                                                },
                                            }}
                                            transformOrigin={{ horizontal: 'left', vertical: 'top' }}
                                            anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                                        >
                                            {item.children.map((child) => (
                                                <MenuItem
                                                    key={child.label}
                                                    onClick={handleHoverClose}
                                                    component={Link}
                                                    href={child.href}
                                                    sx={{
                                                        fontFamily: 'var(--font-prompt)',
                                                        color: 'var(--foreground)',
                                                        py: 1.5,
                                                        px: 2, // slightly less px to allow internal padding
                                                        mx: 1, // subtle margin for floating item look
                                                        my: 0.5,
                                                        borderRadius: 2,
                                                        gap: 2,
                                                        transition: 'all 0.3s ease',
                                                        '&:hover': {
                                                            bgcolor: 'rgba(10, 92, 90, 0.04)', // Very subtle primary tint
                                                            transform: 'translateX(4px)',
                                                            '& .menu-icon': {
                                                                bgcolor: 'var(--primary)',
                                                                color: 'white',
                                                                transform: 'scale(1.1)',
                                                                boxShadow: '0 4px 12px rgba(10, 92, 90, 0.2)'
                                                            }
                                                        }
                                                    }}
                                                >
                                                    <Box
                                                        className="menu-icon"
                                                        sx={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            p: 1,
                                                            borderRadius: '12px',
                                                            bgcolor: 'rgba(10, 92, 90, 0.08)', // Light primary bg
                                                            color: 'var(--primary)',
                                                            transition: 'all 0.3s ease'
                                                        }}
                                                    >
                                                        {child.icon}
                                                    </Box>
                                                    <Box>
                                                        <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.95rem', fontFamily: 'var(--font-prompt)' }}>{child.label}</Typography>
                                                        <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary', fontSize: '0.75rem', fontFamily: 'var(--font-prompt)' }}>
                                                            One-Stop Service
                                                        </Typography>
                                                    </Box>
                                                </MenuItem>
                                            ))}
                                        </Menu>
                                    </Box>
                                );
                            }

                            return (
                                <Link key={item.label} href={item.href} style={{ textDecoration: 'none' }}>
                                    <Box
                                        sx={{
                                            position: 'relative',
                                            cursor: 'pointer',
                                            py: 1,
                                            '&::after': {
                                                content: '""',
                                                position: 'absolute',
                                                bottom: 0,
                                                left: 0,
                                                width: active ? '100%' : '0%',
                                                height: '2px',
                                                bgcolor: 'var(--tertiary)',
                                                transition: 'width 0.3s ease-in-out',
                                            },
                                            '&:hover::after': {
                                                width: '100%',
                                            }
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                color: active ? 'var(--primary)' : 'var(--foreground)',
                                                fontFamily: 'var(--font-prompt)',
                                                fontWeight: active ? 700 : 500,
                                                fontSize: '1rem',
                                                transition: 'color 0.3s ease',
                                                textTransform: 'none',
                                                '&:hover': {
                                                    color: 'var(--primary)',
                                                }
                                            }}
                                        >
                                            {item.label}
                                        </Typography>
                                    </Box>
                                </Link>
                            );
                        })}
                    </Box>

                    <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                        <Button
                            variant="contained"
                            sx={{
                                bgcolor: 'var(--tertiary)', // Use Gold for CTA to be distinct
                                color: 'white',
                                borderRadius: '50px',
                                fontFamily: 'var(--font-prompt)',
                                px: 4,
                                py: 1,
                                boxShadow: '0 4px 15px rgba(204, 164, 59, 0.25)', // Gold shadow
                                textTransform: 'none',
                                fontWeight: 600,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    bgcolor: 'var(--secondary)', // Hover to Red (Ruby) for attention
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 6px 20px rgba(185, 28, 28, 0.3)',
                                }
                            }}
                        >
                            ขอใบเสนอราคา
                        </Button>
                    </Box>
                </Toolbar>
            </AppBar>
            <nav>
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: { xs: "block", sm: "none" },
                        "& .MuiDrawer-paper": { boxSizing: "border-box", width: 280, borderTopRightRadius: 20, borderBottomRightRadius: 20 },
                    }}
                >
                    {drawer}
                </Drawer>
            </nav>
        </Box>
    );
}
