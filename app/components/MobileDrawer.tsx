"use client";

import React from "react";
import {
    Box,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Collapse,
    Stack,
    Button,
    Typography
} from "@mui/material";
import { Sun1, Moon, ArrowDown2, Message, Call } from "iconsax-react";
import Link from "next/link";
import Image from "next/image";

interface SubItem {
    label: string;
    href: string;
    children?: SubItem[];
}

interface NavItem {
    label: string;
    href: string;
    children?: SubItem[];
    sections?: { title: string; items: SubItem[] }[];
}

interface MobileDrawerProps {
    navItems: NavItem[];
    isActive: (href: string) => boolean;
    handleDrawerToggle: () => void;
    setTheme: (theme: string) => void;
    resolvedTheme: string | undefined;
    mounted: boolean;
    settings: {
        phone: string;
        line: string;
        lineUrl: string;
    };
    expandedItems: string[];
    handleMobileExpand: (id: string, e: React.MouseEvent) => void;
}

export default function MobileDrawer({
    navItems,
    isActive,
    handleDrawerToggle,
    setTheme,
    resolvedTheme,
    mounted,
    settings,
    expandedItems,
    handleMobileExpand
}: MobileDrawerProps) {

    const renderMobileTree = (items: SubItem[] | undefined, level: number = 0, parentId: string) => {
        if (!items) return null;

        return items.map((child) => {
            const childId = `${parentId}-${child.label}`;
            const hasChildren = child.children && child.children.length > 0;
            const isExpanded = expandedItems.includes(childId);

            return (
                <React.Fragment key={childId}>
                    <ListItem disablePadding>
                        <ListItemButton
                            component={hasChildren ? "div" : Link}
                            href={hasChildren ? undefined : child.href}
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

    return (
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
                <Box sx={{ width: 40 }} />
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
                                        href={hasChildren ? undefined : item.href}
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
                        sx={{ bgcolor: '#06C755', fontFamily: 'var(--font-prompt)', fontWeight: 600, py: 1 }}
                    >
                        LINE: {settings.line}
                    </Button>
                    <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<Call size="18" variant="Bold" color="currentColor" />}
                        href={`tel:${settings.phone.replace(/[^0-9]/g, '')}`}
                        sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-prompt)', fontWeight: 600, py: 1 }}
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
}
