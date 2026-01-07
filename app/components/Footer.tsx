"use client";

import React, { useState } from "react";
import { Box, Container, Typography, IconButton, Stack, Divider, Collapse, useMediaQuery, useTheme } from "@mui/material";
import { Facebook, Instagram, Youtube, Call, Sms, Location, ArrowDown2, ArrowUp2 } from "iconsax-react";
import Link from "next/link";
import Image from "next/image";

const footerLinks = [
    {
        title: "บริการ",
        links: [
            { label: "เช่าอุปกรณ์เครื่องเสียง", href: "/services/sound" },
            { label: "เช่าระบบไฟ", href: "/services/lighting" },
            { label: "เช่าเวที", href: "/services/stage" },
            { label: "รับจัดงานแต่งงาน", href: "/services/wedding" },
        ],
    },
    {
        title: "บริษัท",
        links: [
            { label: "เกี่ยวกับเรา", href: "/about" },
            { label: "ทีมงาน", href: "/team" },
            { label: "ข่าวสาร", href: "/news" },
            { label: "ร่วมงานกับเรา", href: "/careers" },
        ],
    },
];

// Collapsible Section Component for Mobile
function FooterSection({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    if (!isMobile) {
        return (
            <Box>
                <Typography sx={{
                    color: "var(--foreground)",
                    fontFamily: "var(--font-prompt)",
                    fontWeight: 600,
                    mb: 2,
                    fontSize: '1.1rem'
                }}>
                    {title}
                </Typography>
                {children}
            </Box>
        );
    }

    return (
        <Box sx={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
            <Box
                onClick={() => setIsOpen(!isOpen)}
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    py: 2,
                    cursor: 'pointer',
                    '&:hover': { opacity: 0.8 }
                }}
            >
                <Typography sx={{
                    color: "var(--foreground)",
                    fontFamily: "var(--font-prompt)",
                    fontWeight: 600,
                    fontSize: '1rem'
                }}>
                    {title}
                </Typography>
                {isOpen ? (
                    <ArrowUp2 size="18" color="var(--foreground)" />
                ) : (
                    <ArrowDown2 size="18" color="var(--foreground)" />
                )}
            </Box>
            <Collapse in={isOpen}>
                <Box sx={{ pb: 2 }}>
                    {children}
                </Box>
            </Collapse>
        </Box>
    );
}

export default function Footer() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <Box component="footer" sx={{ bgcolor: "var(--background)", borderTop: "1px solid rgba(0,0,0,0.05)", pt: { xs: 4, md: 8 }, pb: { xs: 3, md: 4 }, mt: 'auto' }}>
            <Container maxWidth="lg">
                {/* Desktop Layout */}
                {!isMobile && (
                    <Box sx={{
                        display: "grid",
                        gridTemplateColumns: "2fr 1fr 1fr 1.5fr",
                        gap: 4,
                        mb: 6
                    }}>
                        {/* Brand Column */}
                        <Box>
                            <Box sx={{ position: 'relative', width: 180, height: 70, mb: 2 }}>
                                <Image
                                    src="/images/logo1.png"
                                    alt="SetEvent Logo"
                                    fill
                                    style={{ objectFit: 'contain', objectPosition: 'left center' }}
                                />
                            </Box>
                            <Typography sx={{
                                color: "var(--foreground)",
                                fontFamily: "var(--font-prompt)",
                                opacity: 0.7,
                                maxWidth: 280,
                                mb: 2,
                                fontSize: '0.95rem',
                                lineHeight: 1.7
                            }}>
                                บริการให้เช่าอุปกรณ์จัดงานครบวงจร และรับจัดงานอีเว้นท์ งานแต่งงาน ด้วยทีมงานมืออาชีพ
                            </Typography>
                            <Stack direction="row" spacing={0.5}>
                                <IconButton size="small" sx={{ color: "var(--primary)", '&:hover': { bgcolor: 'rgba(10, 92, 90, 0.1)' } }}>
                                    <Facebook size="20" variant="Bold" />
                                </IconButton>
                                <IconButton size="small" sx={{ color: "var(--primary)", '&:hover': { bgcolor: 'rgba(10, 92, 90, 0.1)' } }}>
                                    <Instagram size="20" variant="Bold" />
                                </IconButton>
                                <IconButton size="small" sx={{ color: "var(--primary)", '&:hover': { bgcolor: 'rgba(10, 92, 90, 0.1)' } }}>
                                    <Youtube size="20" variant="Bold" />
                                </IconButton>
                            </Stack>
                        </Box>

                        {/* Links Columns */}
                        {footerLinks.map((column) => (
                            <FooterSection key={column.title} title={column.title}>
                                <Stack spacing={1.5}>
                                    {column.links.map((link) => (
                                        <Link key={link.label} href={link.href} style={{ textDecoration: 'none' }}>
                                            <Typography
                                                sx={{
                                                    color: "var(--foreground)",
                                                    fontFamily: "var(--font-prompt)",
                                                    opacity: 0.6,
                                                    fontSize: '0.95rem',
                                                    '&:hover': { color: "var(--primary)", opacity: 1 },
                                                    transition: 'all 0.2s'
                                                }}
                                            >
                                                {link.label}
                                            </Typography>
                                        </Link>
                                    ))}
                                </Stack>
                            </FooterSection>
                        ))}

                        {/* Contact Column */}
                        <FooterSection title="ติดต่อเรา">
                            <Stack spacing={1.5}>
                                <Stack direction="row" spacing={1.5} alignItems="flex-start">
                                    <Location size="20" color="var(--secondary)" variant="Bulk" style={{ flexShrink: 0, marginTop: 2 }} />
                                    <Typography sx={{
                                        color: "var(--foreground)",
                                        fontFamily: "var(--font-prompt)",
                                        opacity: 0.6,
                                        fontSize: '0.95rem',
                                        lineHeight: 1.5
                                    }}>
                                        123 ถนนสุขุมวิท เขตคลองเตย กรุงเทพฯ 10110
                                    </Typography>
                                </Stack>
                                <Stack direction="row" spacing={1.5} alignItems="center">
                                    <Call size="20" color="var(--secondary)" variant="Bulk" style={{ flexShrink: 0 }} />
                                    <Typography sx={{
                                        color: "var(--foreground)",
                                        fontFamily: "var(--font-prompt)",
                                        opacity: 0.6,
                                        fontSize: '0.95rem'
                                    }}>
                                        02-123-4567
                                    </Typography>
                                </Stack>
                                <Stack direction="row" spacing={1.5} alignItems="center">
                                    <Sms size="20" color="var(--secondary)" variant="Bulk" style={{ flexShrink: 0 }} />
                                    <Typography sx={{
                                        color: "var(--foreground)",
                                        fontFamily: "var(--font-prompt)",
                                        opacity: 0.6,
                                        fontSize: '0.95rem'
                                    }}>
                                        contact@setevent.com
                                    </Typography>
                                </Stack>
                            </Stack>
                        </FooterSection>
                    </Box>
                )}

                {/* Mobile Layout - Collapsible */}
                {isMobile && (
                    <Box sx={{ mb: 3 }}>
                        {/* Brand - Always Visible */}
                        <Box sx={{ textAlign: 'center', mb: 3 }}>
                            <Box sx={{ position: 'relative', width: 120, height: 50, mx: 'auto', mb: 2 }}>
                                <Image
                                    src="/images/logo1.png"
                                    alt="SetEvent Logo"
                                    fill
                                    style={{ objectFit: 'contain' }}
                                />
                            </Box>
                            <Stack direction="row" spacing={0.5} justifyContent="center">
                                <IconButton size="small" sx={{ color: "var(--primary)" }}>
                                    <Facebook size="20" variant="Bold" />
                                </IconButton>
                                <IconButton size="small" sx={{ color: "var(--primary)" }}>
                                    <Instagram size="20" variant="Bold" />
                                </IconButton>
                                <IconButton size="small" sx={{ color: "var(--primary)" }}>
                                    <Youtube size="20" variant="Bold" />
                                </IconButton>
                            </Stack>
                        </Box>

                        {/* Collapsible Sections */}
                        {footerLinks.map((column) => (
                            <FooterSection key={column.title} title={column.title}>
                                <Stack spacing={1}>
                                    {column.links.map((link) => (
                                        <Link key={link.label} href={link.href} style={{ textDecoration: 'none' }}>
                                            <Typography
                                                sx={{
                                                    color: "var(--foreground)",
                                                    fontFamily: "var(--font-prompt)",
                                                    opacity: 0.6,
                                                    fontSize: '0.875rem',
                                                    py: 0.5,
                                                    '&:hover': { color: "var(--primary)", opacity: 1 }
                                                }}
                                            >
                                                {link.label}
                                            </Typography>
                                        </Link>
                                    ))}
                                </Stack>
                            </FooterSection>
                        ))}

                        {/* Contact Section */}
                        <FooterSection title="ติดต่อเรา">
                            <Stack spacing={1.5}>
                                <Stack direction="row" spacing={1.5} alignItems="flex-start">
                                    <Location size="18" color="var(--secondary)" variant="Bulk" style={{ flexShrink: 0, marginTop: 2 }} />
                                    <Typography sx={{
                                        color: "var(--foreground)",
                                        fontFamily: "var(--font-prompt)",
                                        opacity: 0.6,
                                        fontSize: '0.875rem',
                                        lineHeight: 1.5
                                    }}>
                                        123 ถนนสุขุมวิท เขตคลองเตย กรุงเทพฯ 10110
                                    </Typography>
                                </Stack>
                                <Stack direction="row" spacing={1.5} alignItems="center">
                                    <Call size="18" color="var(--secondary)" variant="Bulk" style={{ flexShrink: 0 }} />
                                    <Typography sx={{
                                        color: "var(--foreground)",
                                        fontFamily: "var(--font-prompt)",
                                        opacity: 0.6,
                                        fontSize: '0.875rem'
                                    }}>
                                        02-123-4567
                                    </Typography>
                                </Stack>
                                <Stack direction="row" spacing={1.5} alignItems="center">
                                    <Sms size="18" color="var(--secondary)" variant="Bulk" style={{ flexShrink: 0 }} />
                                    <Typography sx={{
                                        color: "var(--foreground)",
                                        fontFamily: "var(--font-prompt)",
                                        opacity: 0.6,
                                        fontSize: '0.875rem'
                                    }}>
                                        contact@setevent.com
                                    </Typography>
                                </Stack>
                            </Stack>
                        </FooterSection>
                    </Box>
                )}

                {/* Copyright */}
                <Divider sx={{ borderColor: 'rgba(0,0,0,0.08)', mb: { xs: 2, md: 3 } }} />
                <Typography sx={{
                    color: "var(--foreground)",
                    fontFamily: "var(--font-prompt)",
                    opacity: 0.5,
                    fontSize: { xs: '0.75rem', md: '0.875rem' },
                    textAlign: 'center'
                }}>
                    © {new Date().getFullYear()} SetEvent. All rights reserved.
                </Typography>
            </Container>
        </Box>
    );
}
