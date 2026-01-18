"use client";

import React, { useState, useEffect } from "react";
import { Box, Container, Typography, IconButton, Stack, Divider, Collapse, useMediaQuery, useTheme, Grid } from "@mui/material";
import { Facebook, Instagram, Youtube, Call, Sms, Location, ArrowDown2, ArrowRight2 } from "iconsax-react";
import Link from "next/link";
import Image from "next/image";
import { useMenuData } from "@/app/hooks/useMenuData";

// Import ContactSettings type from shared utility
import type { ContactSettings } from "@/lib/getContactSettings";

// Props interface
interface FooterProps {
    contactSettings?: ContactSettings;
}

const DEFAULT_SETTINGS = {
    address: "123/45 ถนนนวมินทร์ แขวงนวลจันทร์ เขตบึงกุ่ม กทม. 10240",
    phone: "081-234-5678",
    email: "contact@seteventthailand.com",
    line: "@setevent",
    lineUrl: "https://line.me/ti/p/~@setevent",
    facebook: "",
    instagram: "",
    tiktok: "",
    mapUrl: ""
};

// Move footerLinks definition inside component or split it
const mainLinks = [
    { label: "หน้าแรก", href: "/" },
    { label: "ผลงานของเรา", href: "/portfolio" },
    { label: "โปรโมชั่น", href: "/promotions" },
    { label: "ออกแบบใหม่", href: "/designs" },
    { label: "บทความ", href: "/blog" },
    { label: "ติดต่อเรา", href: "/contact" },
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
                    color: "white",
                    fontFamily: "var(--font-prompt)",
                    fontWeight: 600,
                    mb: 3,
                    fontSize: '1.1rem',
                    position: 'relative',
                    display: 'inline-block',
                    '&::after': {
                        content: '""',
                        position: 'absolute',
                        left: 0,
                        bottom: -8,
                        width: 30,
                        height: 2,
                        bgcolor: 'var(--primary)',
                        borderRadius: 1
                    }
                }}>
                    {title}
                </Typography>
                {children}
            </Box>
        );
    }

    return (
        <Box sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <Box
                onClick={() => setIsOpen(!isOpen)}
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    py: 1.5,
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' }
                }}
            >
                <Typography sx={{
                    color: "white",
                    fontFamily: "var(--font-prompt)",
                    fontWeight: 600,
                    fontSize: '1rem'
                }}>
                    {title}
                </Typography>
                <ArrowDown2
                    size="18"
                    color="rgba(255,255,255,0.7)"
                    style={{
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.3s'
                    }}
                />
            </Box>
            <Collapse in={isOpen}>
                <Box sx={{ pb: 2, pt: 1 }}>
                    {children}
                </Box>
            </Collapse>
        </Box>
    );
}

export default function Footer({ contactSettings }: FooterProps) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [mounted, setMounted] = useState(false);

    // Use passed contactSettings or fallback to defaults
    const settings = {
        address: contactSettings?.address || DEFAULT_SETTINGS.address,
        phone: contactSettings?.phone || DEFAULT_SETTINGS.phone,
        email: contactSettings?.email || DEFAULT_SETTINGS.email,
        line: contactSettings?.line || DEFAULT_SETTINGS.line,
        lineUrl: contactSettings?.lineUrl || DEFAULT_SETTINGS.lineUrl,
        facebook: contactSettings?.facebook || DEFAULT_SETTINGS.facebook,
        instagram: contactSettings?.instagram || DEFAULT_SETTINGS.instagram,
        tiktok: contactSettings?.tiktok || DEFAULT_SETTINGS.tiktok,
        mapUrl: contactSettings?.mapUrl || DEFAULT_SETTINGS.mapUrl,
    };

    // Fetch dynamic product menu
    const { sections: productSections } = useMenuData();

    useEffect(() => {
        setMounted(true);
    }, []);

    // Flatten product links from sections (take up to 5-6 items)
    const productLinks = React.useMemo(() => {
        const links: { label: string; href: string }[] = [];
        if (productSections) {
            productSections.forEach(section => {
                section.items.forEach(item => {
                    if (links.length < 6) {
                        links.push({ label: item.label, href: item.href });
                    }
                });
            });
        }
        return links;
    }, [productSections]);

    if (!mounted) return null;

    return (
        <Box component="footer" sx={{
            bgcolor: "#0a0a0a",
            color: "rgba(255,255,255,0.8)",
            pt: { xs: 3, md: 10 },
            pb: { xs: 3, md: 5 },
            mt: 'auto',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background Decorations */}
            <Box sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '1px',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)'
            }} />

            <Container maxWidth="lg">
                <Box sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: '1fr', md: '1.5fr 1fr 1fr 1.2fr' },
                    gap: { xs: 2.5, md: 6 },
                    mb: { xs: 4, md: 8 }
                }}>
                    {/* Brand Column */}
                    <Box>
                        <Box sx={{ position: 'relative', width: { xs: 140, md: 160 }, height: { xs: 50, md: 60 }, mb: { xs: 2, md: 3 } }}>
                            <Image
                                src="/images/logo_white.png"
                                alt="SetEvent Logo"
                                fill
                                style={{ objectFit: 'contain', objectPosition: 'left center' }}
                            />
                        </Box>
                        <Typography sx={{
                            color: "rgba(255,255,255,0.6)",
                            fontFamily: "var(--font-prompt)",
                            maxWidth: 300,
                            mb: { xs: 3, md: 4 },
                            fontSize: '0.95rem',
                            lineHeight: 1.8
                        }}>
                            ผู้นำด้านการให้บริการเช่าอุปกรณ์จัดงานครบวงจร ระบบแสง สี เสียง และโครงสร้างเวที พร้อมทีมงานมืออาชีพที่มีประสบการณ์
                        </Typography>
                        <Stack direction="row" spacing={1.5}>
                            {settings.facebook && (
                                <IconButton
                                    component="a"
                                    href={settings.facebook}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    size="small"
                                    aria-label="ติดตามเราบน Facebook"
                                    sx={{
                                        color: "white",
                                        bgcolor: 'rgba(255,255,255,0.05)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        '&:hover': { bgcolor: 'var(--primary)', borderColor: 'var(--primary)' }
                                    }}
                                >
                                    <Facebook size="20" variant="Bold" color="white" />
                                </IconButton>
                            )}
                            {settings.instagram && (
                                <IconButton
                                    component="a"
                                    href={settings.instagram}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    size="small"
                                    aria-label="ติดตามเราบน Instagram"
                                    sx={{
                                        color: "white",
                                        bgcolor: 'rgba(255,255,255,0.05)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        '&:hover': { bgcolor: 'var(--primary)', borderColor: 'var(--primary)' }
                                    }}
                                >
                                    <Instagram size="20" variant="Bold" color="white" />
                                </IconButton>
                            )}
                            {settings.tiktok && (
                                <IconButton
                                    component="a"
                                    href={settings.tiktok}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    size="small"
                                    aria-label="ติดตามเราบน TikTok"
                                    sx={{
                                        color: "white",
                                        bgcolor: 'rgba(255,255,255,0.05)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        '&:hover': { bgcolor: 'var(--primary)', borderColor: 'var(--primary)' }
                                    }}
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" /></svg>
                                </IconButton>
                            )}
                        </Stack>
                    </Box>

                    {/* Main Menu Column */}
                    <FooterSection title="เมนูหลัก">
                        <Stack spacing={2}>
                            {mainLinks.map((link) => (
                                <Link key={link.label} href={link.href} style={{ textDecoration: 'none' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <ArrowRight2 size="14" color="var(--primary)" variant="Linear" />
                                        <Typography sx={{
                                            color: "rgba(255,255,255,0.7)",
                                            fontFamily: "var(--font-prompt)",
                                            fontSize: '0.95rem',
                                            transition: 'all 0.2s',
                                            '&:hover': { color: "var(--primary)", transform: 'translateX(4px)' }
                                        }}>
                                            {link.label}
                                        </Typography>
                                    </Box>
                                </Link>
                            ))}
                        </Stack>
                    </FooterSection>

                    {/* Products Column (Dynamic) */}
                    <FooterSection title="สินค้าและบริการ">
                        <Stack spacing={2}>
                            {productLinks.length > 0 ? (
                                productLinks.map((link) => (
                                    <Link key={link.href} href={link.href} style={{ textDecoration: 'none' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <ArrowRight2 size="14" color="var(--primary)" variant="Linear" />
                                            <Typography sx={{
                                                color: "rgba(255,255,255,0.7)",
                                                fontFamily: "var(--font-prompt)",
                                                fontSize: '0.95rem',
                                                transition: 'all 0.2s',
                                                '&:hover': { color: "var(--primary)", transform: 'translateX(4px)' }
                                            }}>
                                                {link.label}
                                            </Typography>
                                        </Box>
                                    </Link>
                                ))
                            ) : (
                                <Typography sx={{ color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-prompt)", fontSize: '0.9rem' }}>
                                    กำลังโหลด...
                                </Typography>
                            )}
                        </Stack>
                    </FooterSection>

                    {/* Contact Column */}
                    <FooterSection title="ติดต่อเรา">
                        <Stack spacing={2.5}>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Box sx={{
                                    width: 36, height: 36,
                                    borderRadius: '50%',
                                    bgcolor: 'rgba(255,255,255,0.05)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    flexShrink: 0
                                }}>
                                    <Location size="18" color="var(--primary)" variant="Bulk" />
                                </Box>
                                <Typography sx={{
                                    color: "rgba(255,255,255,0.7)",
                                    fontFamily: "var(--font-prompt)",
                                    fontSize: '0.95rem',
                                    lineHeight: 1.6
                                }}>
                                    {settings.address}
                                </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Box sx={{
                                    width: 36, height: 36,
                                    borderRadius: '50%',
                                    bgcolor: 'rgba(255,255,255,0.05)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    flexShrink: 0
                                }}>
                                    <Call size="18" color="var(--primary)" variant="Bulk" />
                                </Box>
                                <Box>
                                    <Typography component="a" href={`tel:${settings.phone}`} sx={{
                                        color: "rgba(255,255,255,0.7)",
                                        fontFamily: "var(--font-prompt)",
                                        fontSize: '0.95rem',
                                        textDecoration: 'none',
                                        display: 'block',
                                        mb: 0.5,
                                        '&:hover': { color: 'var(--primary)' }
                                    }}>
                                        {settings.phone}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-prompt)" }}>
                                        จันทร์ - อาทิตย์ (9.00 - 18.00)
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Box sx={{
                                    width: 36, height: 36,
                                    borderRadius: '50%',
                                    bgcolor: 'rgba(255,255,255,0.05)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    flexShrink: 0
                                }}>
                                    <Sms size="18" color="var(--primary)" variant="Bulk" />
                                </Box>
                                <Typography component="a" href={`mailto:${settings.email}`} sx={{
                                    color: "rgba(255,255,255,0.7)",
                                    fontFamily: "var(--font-prompt)",
                                    fontSize: '0.95rem',
                                    textDecoration: 'none',
                                    '&:hover': { color: 'var(--primary)' }
                                }}>
                                    {settings.email}
                                </Typography>
                            </Box>
                        </Stack>
                    </FooterSection>
                </Box>

                {/* Copyright */}
                <Box sx={{
                    pt: { xs: 3, md: 4 },
                    borderTop: '1px solid rgba(255,255,255,0.05)',
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 2
                }}>
                    <Typography sx={{
                        color: "rgba(255,255,255,0.4)",
                        fontFamily: "var(--font-prompt)",
                        fontSize: '0.875rem',
                        textAlign: { xs: 'center', md: 'left' }
                    }}>
                        © {new Date().getFullYear()} SetEvent Thailand. All rights reserved.
                    </Typography>
                    <Stack direction="row" spacing={3} sx={{ mt: { xs: 1, md: 0 } }}>
                        <Link href="/privacy-policy" style={{ textDecoration: 'none' }}>
                            <Typography sx={{ color: "rgba(255,255,255,0.4)", fontSize: '0.875rem', fontFamily: "var(--font-prompt)", '&:hover': { color: 'white' } }}>
                                นโยบายความเป็นส่วนตัว
                            </Typography>
                        </Link>
                        <Link href="/terms-of-service" style={{ textDecoration: 'none' }}>
                            <Typography sx={{ color: "rgba(255,255,255,0.4)", fontSize: '0.875rem', fontFamily: "var(--font-prompt)", '&:hover': { color: 'white' } }}>
                                เงื่อนไขการใช้บริการ
                            </Typography>
                        </Link>
                    </Stack>
                </Box>
            </Container>
        </Box>
    );
}
