"use client";

import React, { useState, useMemo, useEffect } from "react";
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
    Fade,
    Stack,
    Divider
} from "@mui/material";
import { HambergerMenu, ArrowDown2, ArrowRight2, Call, Message, Add, Minus, Monitor, LampOn, Speaker, Layer, VideoCircle, MagicStar, Sun1, Moon, Map1, Gift } from "iconsax-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useMenuData } from "@/app/hooks/useMenuData";

// ---- Data Structures ----

type SubItem = {
    label: string;
    href: string;
    children?: SubItem[];
    icon?: React.ReactNode;
};

type NavItem = {
    label: string;
    href: string;
    children?: SubItem[]; // Simple dropdown
    isMega?: boolean; // For Products complex menu
    sections?: { title: string; items: SubItem[] }[];
};

// Import ContactSettings type from shared utility
import type { ContactSettings } from "@/lib/getContactSettings";

// Props interface
interface HeaderProps {
    contactSettings?: ContactSettings;
}

const DEFAULT_SETTINGS = {
    phone: "081-234-5678",
    line: "@setevent",
    lineUrl: "https://line.me/ti/p/~@setevent",
};

export default function Header({ contactSettings }: HeaderProps) {
    const { theme, setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    // Use passed contactSettings or fallback to defaults
    const settings = {
        phone: contactSettings?.phone || DEFAULT_SETTINGS.phone,
        line: contactSettings?.line || DEFAULT_SETTINGS.line,
        lineUrl: contactSettings?.lineUrl || DEFAULT_SETTINGS.lineUrl,
    };

    // Fetch product menu from database
    const { sections: productSections } = useMenuData();

    useEffect(() => {
        setMounted(true);
    }, []);

    // Build navItems dynamically based on fetched sections
    const navItems: NavItem[] = useMemo(() => [
        { label: "HOME", href: "/" },
        {
            label: "PRODUCTS",
            href: "/products",
            isMega: true,
            sections: productSections
        },
        { label: "PROMOTIONS", href: "/promotions" },
        { label: "PORTFOLIO", href: "/portfolio" },
        { label: "NEW DESIGN", href: "/designs" },
        { label: "FAQ", href: "/faq" },
    ], [productSections]);

    // Desktop Menu States
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const openDropdown = Boolean(anchorEl);
    const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

    // Mobile States
    // Track expanded items by ID/Label path
    const [expandedItems, setExpandedItems] = useState<string[]>([]);
    // Track expanded items for Desktop Mega Menu
    const [desktopExpandedItems, setDesktopExpandedItems] = useState<string[]>([]);

    // State for Contact Menu
    const [contactAnchorEl, setContactAnchorEl] = useState<null | HTMLElement>(null);
    const openContact = Boolean(contactAnchorEl);

    const pathname = usePathname();
    const isHome = pathname === "/" || pathname === "/contact" || pathname === "/promotions" || pathname === "/designs" || pathname === "/portfolio" || pathname.startsWith("/products") || pathname.startsWith("/blog") || pathname.startsWith("/faq") || pathname === "/privacy-policy" || pathname === "/terms-of-service";
    const isDarkText = (pathname.startsWith("/blog") || pathname.startsWith("/faq") || pathname === "/designs" || pathname === "/portfolio" || pathname === "/promotions" || pathname.startsWith("/products") || pathname === "/contact" || pathname === "/privacy-policy" || pathname === "/terms-of-service") && (mounted && resolvedTheme !== 'dark');

    // ---- Handlers ----

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleContactClick = (event: React.MouseEvent<HTMLElement>) => {
        setContactAnchorEl(event.currentTarget);
    };
    const handleContactClose = () => {
        setContactAnchorEl(null);
    };

    // Desktop Hover Handlers
    const handleHoverOpen = (event: React.MouseEvent<HTMLElement>, menuName: string) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setActiveMenu(menuName);
        setAnchorEl(event.currentTarget);
    };

    const handleHoverClose = () => {
        timeoutRef.current = setTimeout(() => {
            setAnchorEl(null);
            setActiveMenu(null);
        }, 150);
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

    // Mobile Expand/Collapse Handler
    const handleMobileExpand = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setExpandedItems(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const handleDesktopExpand = (id: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDesktopExpandedItems(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    // ---- Renderers ----

    // Recursive helper for Mobile List
    const renderMobileTree = (items: SubItem[] | undefined, level: number = 0, parentId: string) => {
        if (!items) return null;

        return items.map((child, index) => {
            const childId = `${parentId}-${child.label}`;
            const hasChildren = child.children && child.children.length > 0;
            const isExpanded = expandedItems.includes(childId);

            return (
                <React.Fragment key={childId}>
                    <ListItem disablePadding>
                        <ListItemButton
                            component={hasChildren ? "div" : Link}
                            href={hasChildren ? "#" : child.href}
                            onClick={hasChildren ? (e: React.MouseEvent) => handleMobileExpand(childId, e) : handleDrawerToggle}
                            sx={{
                                pl: 4 + (level * 2),
                                py: 1.5,
                                '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' }
                            }}
                        >
                            <ListItemText
                                primary={child.label}
                                primaryTypographyProps={{
                                    fontFamily: 'var(--font-prompt)',
                                    fontSize: '0.9rem',
                                    fontWeight: isActive(child.href) ? 600 : 400,
                                    color: isActive(child.href) ? 'var(--primary)' : 'rgba(255,255,255,0.7)',
                                }}
                            />
                            {hasChildren && (
                                <ArrowDown2
                                    size="16"
                                    color="rgba(255,255,255,0.5)"
                                    style={{
                                        transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                                        transition: 'transform 0.3s'
                                    }}
                                />
                            )}
                        </ListItemButton>
                    </ListItem>
                    {hasChildren && (
                        <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                {renderMobileTree(child.children, level + 1, childId)}
                            </List>
                        </Collapse>
                    )}
                </React.Fragment>
            );
        });
    };

    // Recursive helper for Desktop Mega Menu Item
    // We basically list them, if deeper, we can indent or show simple list
    // Designed to match the visual: Indented lists
    const renderDesktopTree = (items: SubItem[] | undefined, level: number = 0, parentId: string = 'root') => {
        if (!items) return null;
        return (
            <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0, pl: level > 0 ? 1.5 : 0 }}>
                {items.map((child) => {
                    const hasChildren = child.children && child.children.length > 0;
                    const childId = `${parentId}-${child.label}`;
                    const isExpanded = desktopExpandedItems.includes(childId);

                    return (
                        <Box component="li" key={child.label} sx={{ mb: 0.5, position: 'relative' }}>
                            {/* Connector line for nested items - cleaner look */}
                            {level > 0 && (
                                <Box sx={{
                                    position: 'absolute',
                                    left: -12,
                                    top: 15,
                                    width: 8,
                                    height: 1,
                                    bgcolor: isActive(child.href) ? 'var(--primary)' : 'rgba(0,0,0,0.1)'
                                }} />
                            )}

                            <Box
                                component={hasChildren ? "div" : Link}
                                href={hasChildren ? undefined : child.href}
                                onClick={hasChildren ? (e: React.MouseEvent) => handleDesktopExpand(childId, e) : undefined}
                                sx={{
                                    textDecoration: 'none',
                                    cursor: 'pointer',
                                    display: 'block',
                                    position: 'relative'
                                }}
                            >
                                <Box
                                    sx={{
                                        py: 0.8,
                                        px: 1.5,
                                        borderRadius: 1.5,
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        width: '100%',
                                        bgcolor: isActive(child.href) ? 'rgba(10, 92, 90, 0.06)' : 'transparent',
                                        border: '1px solid',
                                        borderColor: isActive(child.href) ? 'rgba(10, 92, 90, 0.1)' : 'transparent',
                                        '&:hover': {
                                            bgcolor: 'rgba(0,0,0,0.03)',
                                            transform: 'translateX(3px)',
                                            borderColor: 'rgba(0,0,0,0.05)'
                                        }
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                        {/* Icon Indication based on type or explicit icon */}
                                        {child.icon ? (
                                            <Box sx={{ display: 'flex', color: isActive(child.href) ? 'var(--primary)' : 'inherit' }}>
                                                {child.icon}
                                            </Box>
                                        ) : hasChildren ? (
                                            <Box sx={{
                                                width: 6,
                                                height: 6,
                                                borderRadius: '1px',
                                                bgcolor: isExpanded ? 'var(--primary)' : 'rgba(0,0,0,0.3)',
                                                transform: 'rotate(45deg)',
                                                transition: 'background-color 0.3s'
                                            }} />
                                        ) : (
                                            <Box sx={{
                                                width: 4,
                                                height: 4,
                                                borderRadius: '50%',
                                                bgcolor: isActive(child.href) ? 'var(--primary)' : 'rgba(0,0,0,0.2)'
                                            }} />
                                        )}

                                        <Typography
                                            sx={{
                                                fontFamily: 'var(--font-prompt)',
                                                fontSize: level === 0 ? '0.95rem' : '0.9rem',
                                                fontWeight: isActive(child.href) || hasChildren ? 600 : 400,
                                                color: isActive(child.href) ? 'var(--primary)' : 'var(--foreground)',
                                                letterSpacing: 0.3
                                            }}
                                        >
                                            {child.label}
                                        </Typography>
                                    </Box>

                                    {hasChildren && (
                                        <Box sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            width: 22,
                                            height: 22,
                                            borderRadius: '6px',
                                            bgcolor: isExpanded ? 'rgba(10, 92, 90, 0.1)' : 'transparent',
                                            color: isExpanded ? 'var(--primary)' : 'rgba(0,0,0,0.3)',
                                            transition: 'all 0.3s ease',
                                            border: '1px solid',
                                            borderColor: isExpanded ? 'rgba(10, 92, 90, 0.2)' : 'rgba(0,0,0,0.05)'
                                        }}>
                                            {isExpanded ? (
                                                <Minus size="12" variant="Linear" color="var(--primary)" />
                                            ) : (
                                                <Add size="12" variant="Linear" color="var(--primary)" />
                                            )}
                                        </Box>
                                    )}
                                </Box>
                            </Box>
                            {hasChildren && (
                                <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                                    <Box sx={{ position: 'relative', ml: 1, borderLeft: '1px solid rgba(0,0,0,0.05)', mt: 0.5, mb: 0.5 }}>
                                        {renderDesktopTree(child.children, level + 1, childId)}
                                    </Box>
                                </Collapse>
                            )}
                        </Box>
                    );
                })}
            </Box>
        );
    };

    // ---- Drawer Content ----

    const drawer = (
        <Box sx={{
            height: "100%",
            bgcolor: "#0a0a0a",
            color: "rgba(255,255,255,0.9)",
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
        }}>
            {/* Sticky Header */}
            <Box sx={{
                py: 2,
                px: 2,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                flexShrink: 0
            }}>
                <Box sx={{ width: 40 }} /> {/* Spacer */}
                <Link href="/" onClick={handleDrawerToggle} style={{ display: 'block', position: 'relative', width: '140px', height: '50px' }}>
                    <Image
                        src="/images/logo_white.png"
                        alt="SetEvent Logo"
                        fill
                        style={{ objectFit: 'contain' }}
                        priority
                    />
                </Link>
                <IconButton
                    onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                    aria-label={!mounted ? 'เปลี่ยนเป็นโหมดมืด' : (resolvedTheme === 'dark' ? 'เปลี่ยนเป็นโหมดสว่าง' : 'เปลี่ยนเป็นโหมดมืด')}
                    sx={{ color: 'white' }}
                >
                    {mounted && resolvedTheme === 'dark' ? (
                        <Sun1 size="24" variant="Bold" color="#FDB813" />
                    ) : (
                        <Moon size="24" variant="Bold" color="#4F46E5" />
                    )}
                </IconButton>
            </Box>

            {/* Scrollable Content Area */}
            <Box sx={{
                flexGrow: 1,
                overflowY: 'auto',
                pt: 1,
                '&::-webkit-scrollbar': { width: '4px' },
                '&::-webkit-scrollbar-thumb': { background: 'rgba(255,255,255,0.1)', borderRadius: '10px' },
            }}>
                <List>
                    {navItems.map((item) => {
                        const hasChildren = !!item.children || !!item.sections;
                        const itemId = `root-${item.label}`;
                        const isExpanded = expandedItems.includes(itemId);

                        return (
                            <React.Fragment key={item.label}>
                                <ListItem disablePadding>
                                    <ListItemButton
                                        onClick={hasChildren ? (e: React.MouseEvent) => handleMobileExpand(itemId, e) : handleDrawerToggle}
                                        component={hasChildren ? "div" : Link}
                                        href={hasChildren ? "#" : item.href}
                                        sx={{
                                            textAlign: "left",
                                            px: 4,
                                            py: 2,
                                            bgcolor: isActive(item.href) ? 'rgba(255,255,255,0.05)' : 'transparent',
                                            borderLeft: isActive(item.href) ? '4px solid var(--primary)' : '4px solid transparent',
                                        }}
                                    >
                                        <ListItemText
                                            primary={
                                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: 1 }}>
                                                    <Typography sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 600, fontSize: '1rem', color: isActive(item.href) ? 'var(--primary)' : 'inherit' }}>
                                                        {item.label}
                                                    </Typography>
                                                    {hasChildren && <ArrowDown2 size="18" color={isActive(item.href) ? 'var(--primary)' : 'rgba(255,255,255,0.5)'} style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }} />}
                                                </Box>
                                            }
                                        />
                                    </ListItemButton>
                                </ListItem>
                                {hasChildren && (
                                    <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                                        <List component="div" disablePadding sx={{ bgcolor: 'rgba(255,255,255,0.03)', mx: 0 }}>
                                            {item.children && renderMobileTree(item.children, 0, itemId)}
                                            {item.sections && item.sections.map((section, idx) => (
                                                <Box key={section.title} sx={{ mb: 1 }}>
                                                    <Typography variant="overline" sx={{ display: 'block', px: 4, pt: 2, color: 'rgba(255,255,255,0.4)', fontWeight: 'bold' }}>
                                                        {section.title}
                                                    </Typography>
                                                    {renderMobileTree(section.items, 0, `${itemId}-sec-${idx}`)}
                                                </Box>
                                            ))}
                                        </List>
                                    </Collapse>
                                )}
                            </React.Fragment>
                        );
                    })}
                </List>
            </Box>

            {/* Sticky Footer */}
            <Box sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.1)', flexShrink: 0 }}>
                <Stack spacing={1}>
                    <Button
                        fullWidth
                        variant="contained"
                        startIcon={<Message size="18" variant="Bold" color="currentColor" />}
                        href={settings.lineUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`ติดต่อเราผ่าน LINE ${settings.line}`}
                        sx={{
                            bgcolor: '#06C755',
                            fontFamily: 'var(--font-prompt)',
                            fontWeight: 600,
                            py: 1,
                            fontSize: '0.85rem',
                            '&:hover': { bgcolor: '#05b04a' }
                        }}
                    >
                        LINE: {settings.line}
                    </Button>
                    <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<Call size="18" variant="Bold" color="currentColor" />}
                        href={`tel:${settings.phone.replace(/[^0-9]/g, '')}`}
                        sx={{
                            color: 'white',
                            borderColor: 'rgba(255,255,255,0.3)',
                            fontFamily: 'var(--font-prompt)',
                            fontWeight: 600,
                            py: 1,
                            fontSize: '0.85rem',
                            '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.05)' }
                        }}
                    >
                        {settings.phone}
                    </Button>
                </Stack>
                <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 1.5, color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-prompt)', fontSize: '0.7rem' }}>
                    © {new Date().getFullYear()} SETEVENT ALL RIGHTS RESERVED
                </Typography>
            </Box>
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
                    bgcolor: isHome ? "transparent" : "#1a1a1a",
                    boxShadow: isHome ? "none" : "0 4px 20px -10px rgba(0,0,0,0.3)",
                    borderBottom: isHome ? "none" : "1px solid rgba(255,255,255,0.05)",
                    transition: "all 0.3s ease",
                    paddingTop: isHome ? 2 : 0,
                }}
            >
                <Toolbar sx={{ justifyContent: "space-between", height: '90px' }}>

                    {/* Brand / Logo */}
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: { xs: 'center', md: 'flex-start' },
                        flex: { xs: 1, md: 'unset' },
                        position: 'relative'
                    }}>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{
                                display: { md: "none" },
                                color: isDarkText ? "var(--foreground)" : "white",
                                position: { xs: 'absolute', md: 'static' },
                                left: { xs: 0, md: 'auto' },
                                zIndex: 1
                            }}
                        >
                            <HambergerMenu size="32" color={isDarkText ? "var(--foreground)" : "white"} />
                        </IconButton>

                        <Box
                            component={Link}
                            href="/"
                            className="logo-container"
                            sx={{
                                position: 'relative',
                                width: { xs: 140, sm: 160, md: 180 },
                                height: { xs: 40, sm: 50, md: 60 },
                                display: 'block',
                                flex: 'none',
                                mx: { xs: 'auto', md: 0 }
                            }}
                        >
                            {/* Home page: always white logo */}
                            {!isDarkText && (
                                <Image
                                    src="/images/logo_white.png"
                                    alt="SETEVENT"
                                    fill
                                    style={{ objectFit: 'contain' }}
                                    priority
                                />
                            )}
                            {/* Other pages: black logo in light mode, white in dark mode */}
                            {isDarkText && (
                                <>
                                    <Image
                                        src="/images/logo_black1.png"
                                        alt="SETEVENT"
                                        fill
                                        style={{ objectFit: 'contain' }}
                                        priority
                                        className="logo-light"
                                    />
                                    <Image
                                        src="/images/logo_white.png"
                                        alt="SETEVENT"
                                        fill
                                        style={{ objectFit: 'contain' }}
                                        priority
                                        className="logo-dark"
                                    />
                                </>
                            )}
                        </Box>

                        {/* Date/Location Text - Hide on mobile */}
                        <Box sx={{ display: { xs: 'none', lg: 'block' }, ml: 3, borderLeft: isDarkText ? '1px solid rgba(0,0,0,0.1)' : '1px solid rgba(255,255,255,0.3)', pl: 3 }}>
                            <Typography variant="caption" sx={{ color: isDarkText ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.8)', display: 'block', lineHeight: 1.2, fontFamily: 'var(--font-prompt)' }}>
                                PROFESSIONAL TEAM
                            </Typography>
                            <Typography variant="caption" sx={{ color: isDarkText ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.6)', display: 'block', lineHeight: 1.2, fontFamily: 'var(--font-prompt)' }}>
                                End-to-End Event Solution
                            </Typography>
                        </Box>
                    </Box>

                    {/* Navigation */}
                    <Box sx={{ display: { xs: "none", md: "flex" }, gap: 4, alignItems: 'center' }}>
                        {navItems.map((item) => {
                            const hasDropdown = !!item.children || !!item.isMega;
                            const active = isActive(item.href);
                            const isDarkTextLocal = isDarkText; // Use parent scope
                            const baseColor = isDarkTextLocal ? 'var(--foreground)' : 'rgba(255,255,255,0.9)';
                            const finalColor = active ? 'var(--secondary)' : baseColor;

                            if (hasDropdown) {
                                return (
                                    <Box
                                        key={item.label}
                                        onMouseLeave={['PRODUCTS', 'PORTFOLIO'].includes(item.label) ? undefined : handleHoverClose}
                                        onMouseEnter={(e) => ['PRODUCTS', 'PORTFOLIO'].includes(item.label) ? undefined : handleHoverOpen(e, item.label)}
                                    >
                                        <Box
                                            onClick={(e) => {
                                                e.preventDefault();
                                                if (openDropdown && activeMenu === item.label) {
                                                    setAnchorEl(null);
                                                    setActiveMenu(null);
                                                } else {
                                                    handleHoverOpen(e, item.label);
                                                }
                                            }}
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
                                                    '&:hover': { color: 'var(--secondary)' }
                                                }}
                                            >
                                                {item.label}
                                            </Typography>
                                            <ArrowDown2
                                                size="14"
                                                color={finalColor}
                                                variant="Bold"
                                                style={{
                                                    transform: openDropdown && activeMenu === item.label ? 'rotate(180deg)' : 'rotate(0deg)',
                                                    transition: 'transform 0.3s'
                                                }}
                                            />
                                        </Box>

                                        <Menu
                                            anchorEl={anchorEl}
                                            open={openDropdown && activeMenu === item.label}
                                            onClose={handleHoverClose}
                                            TransitionComponent={Fade}
                                            disableScrollLock={true}
                                            MenuListProps={{
                                                onMouseEnter: handleMenuEnter,
                                                onMouseLeave: handleMenuLeave,
                                                sx: { py: 0 }
                                            }}
                                            PaperProps={{
                                                elevation: 0,
                                                sx: {
                                                    mt: 2,
                                                    overflow: 'visible',
                                                    filter: 'drop-shadow(0px 30px 60px rgba(0,0,0,0.15))',
                                                    bgcolor: 'var(--card-bg)', // Use CSS Variable
                                                    backdropFilter: 'blur(40px)',
                                                    border: '1px solid var(--border-color)', // Use CSS Variable
                                                    borderRadius: 2,
                                                    minWidth: item.isMega ? 700 : 260,
                                                },
                                            }}
                                            transformOrigin={{ horizontal: 'left', vertical: 'top' }}
                                            anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                                        >
                                            {/* If Single List (Portfolio) */}
                                            {item.children && !item.isMega && (
                                                <Box sx={{ p: 2 }}>
                                                    {renderDesktopTree(item.children, 0, item.label)}
                                                </Box>
                                            )}

                                            {/* If Mega Menu (Products) */}
                                            {item.isMega && item.sections && (
                                                <Box>
                                                    <Box sx={{ display: 'flex', p: 0 }}>
                                                        {item.sections?.map((section, idx) => (
                                                            <Box
                                                                key={section.title}
                                                                sx={{
                                                                    p: 4,
                                                                    flex: idx === 0 ? '1 1 auto' : '0 0 250px',
                                                                    borderRight: idx !== (item.sections?.length ?? 0) - 1 ? '1px solid var(--border-color)' : 'none',
                                                                    bgcolor: idx === 0 ? 'transparent' : 'rgba(128,128,128,0.02)'
                                                                }}
                                                            >
                                                                <Typography variant="overline" sx={{
                                                                    fontFamily: 'var(--font-prompt)',
                                                                    fontWeight: 800,
                                                                    mb: 3,
                                                                    color: 'var(--primary)',
                                                                    letterSpacing: 1.5,
                                                                    display: 'block',
                                                                    borderBottom: '2px solid var(--primary)',
                                                                    pb: 1,
                                                                    width: 'fit-content'
                                                                }}>
                                                                    {section.title}
                                                                </Typography>
                                                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                                                    {renderDesktopTree(section.items)}
                                                                </Box>
                                                            </Box>
                                                        ))}
                                                    </Box>
                                                    {/* View All Link */}
                                                    <Box sx={{
                                                        p: 2,
                                                        borderTop: '1px solid var(--border-color)',
                                                        textAlign: 'center',
                                                        bgcolor: 'rgba(128,128,128,0.02)'
                                                    }}>
                                                        <Box
                                                            component={Link}
                                                            href="/products"
                                                            onClick={() => {
                                                                setAnchorEl(null);
                                                                setActiveMenu(null);
                                                            }}
                                                            sx={{
                                                                display: 'inline-flex',
                                                                alignItems: 'center',
                                                                gap: 1,
                                                                textDecoration: 'none',
                                                                color: 'var(--primary)',
                                                                fontFamily: 'var(--font-prompt)',
                                                                fontWeight: 600,
                                                                fontSize: '0.9rem',
                                                                py: 1,
                                                                px: 3,
                                                                borderRadius: 2,
                                                                bgcolor: 'rgba(10, 92, 90, 0.08)',
                                                                transition: 'all 0.2s',
                                                                '&:hover': {
                                                                    bgcolor: 'rgba(10, 92, 90, 0.15)',
                                                                    transform: 'translateY(-1px)'
                                                                }
                                                            }}
                                                        >
                                                            ดูสินค้าทั้งหมด
                                                            <ArrowRight2 size="16" color="var(--primary)" />
                                                        </Box>
                                                    </Box>
                                                </Box>
                                            )}
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
                                                '&:hover': { color: 'var(--secondary)' }
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
                    <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: 'center', gap: 2 }}>
                        {/* Theme Toggle Button */}
                        <IconButton
                            onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                            aria-label={!mounted ? 'เปลี่ยนเป็นโหมดมืด' : (resolvedTheme === 'dark' ? 'เปลี่ยนเป็นโหมดสว่าง' : 'เปลี่ยนเป็นโหมดมืด')}
                            sx={{
                                color: isDarkText ? 'var(--foreground)' : 'white',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    bgcolor: 'rgba(128,128,128,0.1)',
                                    transform: 'rotate(15deg)'
                                }
                            }}
                        >
                            {mounted && resolvedTheme === 'dark' ? (
                                <Sun1 size="24" variant="Bold" color="#FDB813" />
                            ) : (
                                <Moon size="24" variant="Bold" color="#4F46E5" />
                            )}
                        </IconButton>

                        <Button
                            variant="outlined"
                            component="a"
                            href="/contact"
                            sx={{
                                color: isDarkText ? 'var(--foreground)' : 'white',
                                borderColor: isDarkText ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.5)',
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
                            ติดต่อเรา
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
                            <MenuItem onClick={handleContactClose} component="a" href={settings.lineUrl} target="_blank" rel="noopener noreferrer" aria-label="ติดต่อเราผ่าน Line Official">
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
                                            {settings.line}
                                        </Typography>
                                        <Typography variant="caption" sx={{ fontFamily: 'var(--font-prompt)', color: 'text.secondary' }}>
                                            Line Official
                                        </Typography>
                                    </Box>
                                </Box>
                            </MenuItem>
                            <MenuItem onClick={handleContactClose} component="a" href={`tel:${settings.phone.replace(/[^0-9]/g, '')}`}>
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
                                            {settings.phone}
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
        </Box >
    );
}
