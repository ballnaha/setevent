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
import { HambergerMenu, ArrowDown2, ArrowRight2, Call, Message, Add, Minus, Monitor, LampOn, Speaker, Layer, VideoCircle, MagicStar, Sun1, Moon, Map1, Gift, Ticket } from "iconsax-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useMenuData } from "@/app/hooks/useMenuData";
import dynamic from "next/dynamic";

// Dynamic import for Mobile Drawer to reduce initial bundle size
const MobileDrawer = dynamic(() => import("./MobileDrawer"), {
    ssr: false,
    loading: () => <Box sx={{ width: 280, height: '100%', bgcolor: '#0a0a0a' }} />
});

// ---- Data Structures ----

type SubItem = {
    label: string;
    href: string;
    description?: string;
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
import { type MenuSection } from "@/lib/getMenuData";

// Props interface
interface HeaderProps {
    contactSettings?: ContactSettings;
    initialMenuData?: MenuSection[];
    forceDarkText?: boolean;
    forceTransparent?: boolean;
}

const DEFAULT_SETTINGS = {
    phone: "081-234-5678",
    line: "@setevent",
    lineUrl: "https://line.me/ti/p/~@setevent",
};

export default function Header({ contactSettings, initialMenuData, forceDarkText, forceTransparent }: HeaderProps) {
    const { theme, setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    // Use passed contactSettings or fallback to defaults
    const settings = {
        phone: contactSettings?.phone || DEFAULT_SETTINGS.phone,
        line: contactSettings?.line || DEFAULT_SETTINGS.line,
        lineUrl: contactSettings?.lineUrl || DEFAULT_SETTINGS.lineUrl,
    };

    // Fetch product menu from database (using initial data if provided)
    const { sections: productSections } = useMenuData(initialMenuData);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Build navItems dynamically based on fetched sections
    const navItems: NavItem[] = useMemo(() => [
        { label: "HOME", href: "/" },
        { label: "ABOUT US", href: "/about" },
        {
            label: "PRODUCTS",
            href: "/products",
            isMega: true,
            sections: productSections
        },
        {
            label: "PROMOTIONS",
            href: "/promotions",
            children: [
                { 
                    label: "Promotion ทั้งหมด", 
                    href: "/promotions",
                    description: "รวมโปรโมชั่นและดีลพิเศษทั้งหมด",
                    icon: <Ticket size="24" variant="Bulk" color="var(--primary)" />
                },
                { 
                    label: "Promotion ประจำเดือน", 
                    href: "/promotions/monthly",
                    description: "ข้อเสนอสุดพิเศษประจำเดือนนี้เท่านั้น",
                    icon: <MagicStar size="24" variant="Bulk" color="var(--primary)" />
                }
            ]
        },
        { label: "PORTFOLIO", href: "/portfolio" },
        { label: "NEW DESIGN", href: "/designs" },
        {
            label: "WEDDING",
            href: "#",
            children: [
                { 
                    label: "E-CARD", 
                    href: "/wedding-e-card",
                    description: "การ์ดแต่งงานออนไลน์ ทันสมัย ใช้งานง่าย",
                    icon: <Message size="24" variant="Bulk" color="var(--primary)" />
                },
                { 
                    label: "ฤกษ์มงคลสมรส", 
                    href: "/auspicious-dates",
                    description: "เช็คฤกษ์ดี วันมงคลสำหรับการเริ่มต้นชีวิตคู่",
                    icon: <Map1 size="24" variant="Bulk" color="var(--primary)" />
                }
            ]
        },
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


    const pathname = usePathname();
    const decodedPathname = decodeURIComponent(pathname);

    const isHome = forceTransparent ||
        pathname === "/" ||
        pathname === "/about" ||
        pathname === "/contact" ||
        pathname.startsWith("/promotions") ||
        pathname === "/designs" ||
        pathname === "/wedding-e-card" ||
        pathname === "/auspicious-dates" ||
        pathname.startsWith("/portfolio") ||
        decodedPathname.startsWith("/portfolio") ||
        pathname.startsWith("/products") ||
        pathname.startsWith("/blog") ||
        pathname.startsWith("/faq") ||
        pathname === "/privacy-policy" ||
        pathname === "/terms-of-service";

    // Fix: Default to true if forceDarkText is true OR it's a known light-background page, 
    // but ONLY switch to false if we are SURE it's dark mode (after mounting)
    const isDarkText = (forceDarkText ||
        pathname === "/about" ||
        pathname.startsWith("/blog") ||
        pathname.startsWith("/faq") ||
        pathname === "/designs" ||
        pathname === "/wedding-e-card" ||
        pathname === "/auspicious-dates" ||
        pathname.startsWith("/portfolio") ||
        decodedPathname.startsWith("/portfolio") ||
        pathname.startsWith("/promotions") ||
        pathname.startsWith("/products") ||
        pathname === "/contact" ||
        pathname === "/privacy-policy" ||
        pathname === "/terms-of-service")
        ? (!mounted || resolvedTheme !== 'dark')
        : (mounted && resolvedTheme === 'dark');

    // ---- Handlers ----

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };


    // Desktop Hover Handlers
    const handleHoverOpen = (event: React.MouseEvent<HTMLElement>, menuName: string) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        if (activeMenu !== menuName) {
            setActiveMenu(menuName);
        }
        if (anchorEl !== event.currentTarget) {
            setAnchorEl(event.currentTarget);
        }
    };

    const handleHoverClose = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
            setAnchorEl(null);
            setActiveMenu(null);
        }, 300); // Increased for more stability
    };

    const handleMenuEnter = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    };

    const handleMenuLeave = () => {
        handleHoverClose();
    };

    const isActive = (href: string, exact: boolean = false) => {
        if (href === "/") return pathname === "/";
        if (href === "#") return false;
        return exact ? pathname === href : pathname.startsWith(href);
    };

    const isItemActive = (item: NavItem) => {
        if (isActive(item.href)) return true;
        if (item.children) {
            return item.children.some(child => isActive(child.href, true));
        }
        if (item.sections) {
            return item.sections.some(sec => sec.items.some(child => isActive(child.href, true)));
        }
        return false;
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
                                    bgcolor: isActive(child.href, true) ? 'var(--primary)' : 'rgba(0,0,0,0.1)'
                                }} />
                            )}

                            <Box
                                component={hasChildren ? "div" : Link}
                                href={hasChildren ? undefined : child.href}
                                onClick={hasChildren ? (e: React.MouseEvent) => handleDesktopExpand(childId, e) : () => { setAnchorEl(null); setActiveMenu(null); }}
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
                                        transition: 'all 0.2s ease',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        width: '100%',
                                        bgcolor: isActive(child.href, true) ? 'rgba(10, 92, 90, 0.06)' : 'transparent',
                                        border: '1px solid',
                                        borderColor: isActive(child.href, true) ? 'rgba(10, 92, 90, 0.1)' : 'transparent',
                                        '&:hover': {
                                            bgcolor: 'rgba(0,0,0,0.03)',
                                            borderColor: 'rgba(0,0,0,0.05)'
                                        }
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                        {/* Icon Indication based on type or explicit icon */}
                                        {child.icon ? (
                                            <Box sx={{ 
                                                display: 'flex', 
                                                p: 1, 
                                                borderRadius: '12px',
                                                bgcolor: isActive(child.href, true) ? 'rgba(10, 92, 90, 0.1)' : 'rgba(0,0,0,0.03)',
                                                color: isActive(child.href, true) ? 'var(--primary)' : 'inherit',
                                                transition: 'all 0.3s ease'
                                            }}>
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
                                                bgcolor: isActive(child.href, true) ? 'var(--primary)' : 'rgba(0,0,0,0.2)'
                                            }} />
                                        )}

                                        <Stack spacing={0.2}>
                                            <Typography
                                                sx={{
                                                    fontFamily: 'var(--font-prompt)',
                                                    fontSize: level === 0 ? '0.95rem' : '0.9rem',
                                                    fontWeight: isActive(child.href, true) || hasChildren ? 700 : 500,
                                                    color: isActive(child.href, true) ? 'var(--primary)' : 'var(--foreground)',
                                                    letterSpacing: 0.3
                                                }}
                                            >
                                                {child.label}
                                            </Typography>
                                            {child.description && (
                                                <Typography
                                                    sx={{
                                                        fontFamily: 'var(--font-prompt)',
                                                        fontSize: '0.75rem',
                                                        color: 'text.secondary',
                                                        fontWeight: 400,
                                                        opacity: 0.8
                                                    }}
                                                >
                                                    {child.description}
                                                </Typography>
                                            )}
                                        </Stack>
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
                                            transition: 'all 0.2s ease',
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
                                <Collapse in={isExpanded} timeout={200} unmountOnExit>
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
        <MobileDrawer
            navItems={navItems}
            isActive={isActive}
            isItemActive={isItemActive}
            handleDrawerToggle={handleDrawerToggle}
            setTheme={setTheme}
            resolvedTheme={resolvedTheme}
            mounted={mounted}
            settings={settings}
            expandedItems={expandedItems}
            handleMobileExpand={handleMobileExpand}
        />
    );

    return (
        <Box sx={{ display: "flex", position: 'relative', zIndex: 1200 }}>
            <AppBar
                component="nav"
                position={isHome ? "absolute" : "sticky"}
                color="transparent"
                elevation={0}
                sx={{
                    bgcolor: isHome ? "transparent" : (mounted && resolvedTheme === 'dark' ? "#1a1a1a" : "#ffffff"),
                    boxShadow: isHome ? "none" : (mounted && resolvedTheme === 'dark' ? "0 4px 20px -10px rgba(0,0,0,0.3)" : "0 4px 20px -10px rgba(0,0,0,0.1)"),
                    borderBottom: isHome ? "none" : (mounted && resolvedTheme === 'dark' ? "1px solid rgba(255,255,255,0.05)" : "1px solid rgba(0,0,0,0.05)"),
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

                        {/* Tagline - Hide on mobile */}
                        <Box sx={{ 
                            display: { xs: 'none', lg: 'block' }, 
                            ml: 3, 
                            borderLeft: isDarkText ? '1.5px solid var(--primary)' : '1.5px solid rgba(255,255,255,0.5)', 
                            pl: 2.5,
                            opacity: 0.9
                        }}>
                            <Typography variant="caption" sx={{ 
                                color: isDarkText ? 'var(--foreground)' : 'white', 
                                display: 'block', 
                                lineHeight: 1.3, 
                                fontFamily: 'var(--font-prompt)',
                                fontWeight: 700,
                                letterSpacing: '1px',
                                fontSize: '0.75rem',
                                textTransform: 'uppercase'
                            }}>
                                PROFESSIONAL TEAM
                            </Typography>
                            <Typography variant="caption" sx={{ 
                                color: isDarkText ? 'var(--primary)' : 'rgba(255,255,255,0.7)', 
                                display: 'block', 
                                lineHeight: 1.3, 
                                fontFamily: 'var(--font-prompt)',
                                fontWeight: 500,
                                fontSize: '0.7rem',
                                letterSpacing: '0.5px'
                            }}>
                                End-to-End Event Solution
                            </Typography>
                        </Box>
                    </Box>

                    {/* Navigation */}
                    <Box sx={{ display: { xs: "none", md: "flex" }, gap: 4, alignItems: 'center' }}>
                        {navItems.map((item) => {
                            const hasDropdown = !!item.children || !!item.isMega;
                            const active = isItemActive(item);
                            const isDarkTextLocal = isDarkText; // Use parent scope
                            const baseColor = isDarkTextLocal ? 'var(--foreground)' : 'rgba(255,255,255,0.9)';
                            const finalColor = active ? 'var(--secondary)' : baseColor;

                            if (hasDropdown) {
                                return (
                                    <Box
                                        key={item.label}
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
                                            onClose={() => {
                                                setAnchorEl(null);
                                                setActiveMenu(null);
                                            }}
                                            TransitionComponent={Fade}
                                            TransitionProps={{ timeout: 200 }}
                                            disableScrollLock={true}
                                            MenuListProps={{ sx: { py: 0 } }}
                                            PaperProps={{
                                                elevation: 0,
                                                sx: {
                                                    mt: '12px',
                                                    overflow: 'visible',
                                                    filter: 'drop-shadow(0px 30px 60px rgba(0,0,0,0.15))',
                                                    bgcolor: 'var(--card-bg)',
                                                    backdropFilter: 'blur(40px)',
                                                    border: '1px solid var(--border-color)',
                                                    borderRadius: 2,
                                                    minWidth: item.isMega ? 700 : 320,
                                                    // Invisible bridge to prevent closing when moving mouse into menu
                                                    '&::before': {
                                                        content: '""',
                                                        display: 'block',
                                                        position: 'absolute',
                                                        top: '-12px',
                                                        left: 0,
                                                        width: '100%',
                                                        height: '12px',
                                                    }
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
