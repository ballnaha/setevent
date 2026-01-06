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
import { HambergerMenu, ArrowDown2, ArrowRight2, Speaker, Monitor, LampOn, Layer, Call, Message } from "iconsax-react";
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

    // State for Contact Menu
    const [contactAnchorEl, setContactAnchorEl] = useState<null | HTMLElement>(null);
    const openContact = Boolean(contactAnchorEl);
    const handleContactClick = (event: React.MouseEvent<HTMLElement>) => {
        setContactAnchorEl(event.currentTarget);
    };
    const handleContactClose = () => {
        setContactAnchorEl(null);
    };

    // State for Mobile Products Collapse
    const [mobileProductsOpen, setMobileProductsOpen] = useState(false);

    const pathname = usePathname();
    // Check if we are on the home page
    const isHome = pathname === "/";

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
                        src="/images/logo.png"
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

        </Box>
    );

    return (
        <Box sx={{ display: "flex", position: 'relative', zIndex: 1200 }}>
            <AppBar
                component="nav"
                position={isHome ? "absolute" : "sticky"}
                color="transparent"
                elevation={0}
                sx={{
                    bgcolor: isHome ? "transparent" : "var(--background)",
                    boxShadow: isHome ? "none" : "0 4px 20px -10px rgba(0,0,0,0.1)",
                    borderBottom: isHome ? "none" : "1px solid rgba(0,0,0,0.05)",
                    transition: "all 0.3s ease",
                    paddingTop: isHome ? 2 : 0,
                }}
            >
                <Toolbar sx={{ justifyContent: "space-between", height: '90px' }}>


                    {/* Brand / Logo */}
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ mr: { xs: 1, sm: 2 }, display: { md: "none" }, color: isHome ? "white" : "var(--foreground)" }}
                        >
                            <HambergerMenu size="32" color={isHome ? "white" : "var(--foreground)"} />
                        </IconButton>

                        <Box
                            component={Link}
                            href="/"
                            sx={{
                                position: 'relative',
                                width: { xs: 120, sm: 150, md: 180 },
                                height: { xs: 40, md: 50 },
                                display: 'block'
                            }}
                        >
                            <Image
                                src="/images/logo_white.png"
                                alt="SETEVENT"
                                fill
                                style={{
                                    objectFit: 'contain',
                                }}
                                priority
                            />
                        </Box>

                        {/* Date/Location Text similar to reference - Hide on mobile, show on large screens */}
                        <Box sx={{ display: { xs: 'none', lg: 'block' }, ml: 3, borderLeft: '1px solid rgba(255,255,255,0.3)', pl: 3 }}>
                            <Typography variant="caption" sx={{ color: isHome ? 'rgba(255,255,255,0.8)' : 'text.secondary', display: 'block', lineHeight: 1.2, fontFamily: 'var(--font-prompt)' }}>
                                PROFESSIONAL TEAM
                            </Typography>
                            <Typography variant="caption" sx={{ color: isHome ? 'rgba(255,255,255,0.6)' : 'text.disabled', display: 'block', lineHeight: 1.2, fontFamily: 'var(--font-prompt)' }}>
                                ONE STOP SERVICE
                            </Typography>
                        </Box>
                    </Box>

                    {/* Navigation */}
                    <Box sx={{ display: { xs: "none", md: "flex" }, gap: 4, alignItems: 'center' }}>
                        {navItems.map((item) => {
                            const active = isActive(item.href) || (item.children && item.children.some(child => isActive(child.href)));
                            const textColor = isHome && !active ? 'white' : (active ? 'var(--secondary)' : 'var(--foreground)');

                            // Adjust text color for home page transparency
                            const finalColor = isHome
                                ? (active ? 'var(--secondary)' : 'rgba(255,255,255,0.9)')
                                : (active ? 'var(--primary)' : 'var(--foreground)');

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
                                            }}
                                        >
                                            <Typography
                                                sx={{
                                                    color: finalColor,
                                                    fontFamily: 'var(--font-prompt)',
                                                    fontWeight: 700,
                                                    fontSize: '0.9rem',
                                                    transition: 'color 0.3s ease',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: 1,
                                                    '&:hover': {
                                                        color: 'var(--secondary)',
                                                    }
                                                }}
                                            >
                                                {item.label}
                                            </Typography>
                                            <ArrowDown2
                                                size="14"
                                                color={finalColor}
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
                                                    bgcolor: 'rgba(255, 255, 255, 0.95)',
                                                    backdropFilter: 'blur(20px)',
                                                    border: '1px solid rgba(255, 255, 255, 0.8)',
                                                    borderRadius: 1, // Sharper corners for modern look
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
                                                        px: 2,
                                                        mx: 1,
                                                        my: 0.5,
                                                        borderRadius: 1,
                                                        gap: 2,
                                                        transition: 'all 0.3s ease',
                                                        '&:hover': {
                                                            bgcolor: 'rgba(10, 92, 90, 0.04)',
                                                            transform: 'translateX(4px)',
                                                        }
                                                    }}
                                                >
                                                    <Box
                                                        className="menu-icon"
                                                        sx={{ p: 0.5, borderRadius: 1, bgcolor: 'rgba(0,0,0,0.05)' }}
                                                    >
                                                        {child.icon}
                                                    </Box>
                                                    <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.95rem', fontFamily: 'var(--font-prompt)' }}>{child.label}</Typography>
                                                </MenuItem>
                                            ))}
                                        </Menu>
                                    </Box>
                                );
                            }

                            return (
                                <Link key={item.label} href={item.href} style={{ textDecoration: 'none' }}>
                                    <Box sx={{ position: 'relative', cursor: 'pointer', py: 1 }}>
                                        <Typography
                                            sx={{
                                                color: finalColor,
                                                fontFamily: 'var(--font-prompt)',
                                                fontWeight: 700,
                                                fontSize: '0.9rem',
                                                transition: 'color 0.3s ease',
                                                textTransform: 'uppercase',
                                                letterSpacing: 1,
                                                '&:hover': {
                                                    color: 'var(--secondary)',
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

                    {/* Right Action Area */}
                    <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: 'center', gap: 3 }}>
                        {/* Social Icons Placeholder - matching reference layout */}
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Box component="span" sx={{ width: 8, height: 8, bgcolor: 'white', borderRadius: '50%', opacity: 0.5 }} />
                            <Box component="span" sx={{ width: 8, height: 8, bgcolor: 'white', borderRadius: '50%', opacity: 0.5 }} />
                        </Box>

                        <Button
                            variant="outlined"
                            onClick={handleContactClick}
                            sx={{
                                color: isHome ? 'white' : 'var(--primary)',
                                borderColor: isHome ? 'rgba(255,255,255,0.5)' : 'var(--primary)',
                                borderRadius: '0',
                                fontFamily: 'var(--font-prompt)',
                                px: 3,
                                py: 1,
                                textTransform: 'none',
                                fontWeight: 600,
                                letterSpacing: 0.5,
                                fontSize: '0.9rem',
                                '&:hover': {
                                    bgcolor: 'var(--secondary)',
                                    borderColor: 'var(--secondary)',
                                    color: 'white'
                                }
                            }}
                        >
                            ติดต่อเราทันที
                        </Button>
                        <Menu
                            anchorEl={contactAnchorEl}
                            open={openContact}
                            onClose={handleContactClose}
                            TransitionComponent={Fade}
                            disableScrollLock={true}
                            PaperProps={{
                                elevation: 0,
                                sx: {
                                    mt: 1.5,
                                    overflow: 'visible',
                                    filter: 'drop-shadow(0px 20px 50px rgba(0,0,0,0.1))',
                                    bgcolor: 'rgba(255, 255, 255, 0.95)',
                                    backdropFilter: 'blur(20px)',
                                    border: '1px solid rgba(255, 255, 255, 0.8)',
                                    borderRadius: 2,
                                    minWidth: 200,
                                    '&:before': {
                                        content: '""',
                                        display: 'block',
                                        position: 'absolute',
                                        top: 0,
                                        right: 25,
                                        width: 10,
                                        height: 10,
                                        bgcolor: 'rgba(255, 255, 255, 0.95)',
                                        transform: 'translateY(-50%) rotate(45deg)',
                                        zIndex: 0,
                                        borderLeft: '1px solid rgba(255, 255, 255, 0.8)',
                                        borderTop: '1px solid rgba(255, 255, 255, 0.8)',
                                    },
                                },
                            }}
                            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                        >
                            <MenuItem onClick={handleContactClose} component="a" href="https://line.me/ti/p/~@setevent" target="_blank">
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                    <Box sx={{
                                        width: 36,
                                        height: 36,
                                        borderRadius: '50%',
                                        bgcolor: '#06C755',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <Message size="20" color="white" variant="Bold" />
                                    </Box>
                                    <Box>
                                        <Typography variant="body2" sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 600, color: 'var(--foreground)' }}>
                                            @setevent
                                        </Typography>
                                        <Typography variant="caption" sx={{ fontFamily: 'var(--font-prompt)', color: 'text.secondary' }}>
                                            Line Official
                                        </Typography>
                                    </Box>
                                </Box>
                            </MenuItem>
                            <MenuItem onClick={handleContactClose} component="a" href="tel:0812345678">
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                    <Box sx={{
                                        width: 36,
                                        height: 36,
                                        borderRadius: '50%',
                                        bgcolor: 'var(--secondary)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <Call size="20" color="white" variant="Bold" />
                                    </Box>
                                    <Box>
                                        <Typography variant="body2" sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 600, color: 'var(--foreground)' }}>
                                            081-234-5678
                                        </Typography>
                                        <Typography variant="caption" sx={{ fontFamily: 'var(--font-prompt)', color: 'text.secondary' }}>
                                            ติดต่อด่วน
                                        </Typography>
                                    </Box>
                                </Box>
                            </MenuItem>
                        </Menu>
                    </Box>

                </Toolbar>
            </AppBar>
            <nav>
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    sx={{
                        display: { xs: "block", md: "none" },
                        "& .MuiDrawer-paper": { boxSizing: "border-box", width: 280 },
                    }}
                >
                    {drawer}
                </Drawer>
            </nav>
        </Box>
    );
}

