"use client";

import React from "react";
import { Box, Container, Typography, IconButton } from "@mui/material";
import { Facebook, Instagram, Youtube, Call, Sms, Location } from "iconsax-react";
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

export default function Footer() {
    return (
        <Box component="footer" sx={{ bgcolor: "var(--background)", borderTop: "1px solid rgba(0,0,0,0.05)", pt: 8, pb: 4, mt: 'auto' }}>
            <Container maxWidth="lg">
                <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, justifyContent: "space-between", gap: 4, mb: 6 }}>

                    {/* Brand Column */}
                    <Box sx={{ flex: 1 }}>
                        <Box sx={{ position: 'relative', width: 180, height: 70, mb: 2 }}>
                            <Image
                                src="/images/logo1.png"
                                alt="SetEvent Logo"
                                fill
                                style={{ objectFit: 'contain', objectPosition: 'left center' }}
                            />
                        </Box>
                        <Typography sx={{ color: "var(--foreground)", fontFamily: "var(--font-prompt)", opacity: 0.8, maxWidth: 300, mb: 3 }}>
                            บริการให้เช่าอุปกรณ์จัดงานครบวงจร และรับจัดงานอีเว้นท์ งานแต่งงาน ด้วยทีมงานมืออาชีพและอุปกรณ์คุณภาพสูง
                        </Typography>
                        <Box sx={{ display: "flex", gap: 1 }}>
                            <IconButton sx={{ color: "var(--primary)", '&:hover': { bgcolor: 'rgba(0,194,203,0.1)' } }}>
                                <Facebook size="24" variant="Bold" />
                            </IconButton>
                            <IconButton sx={{ color: "var(--primary)", '&:hover': { bgcolor: 'rgba(0,194,203,0.1)' } }}>
                                <Instagram size="24" variant="Bold" />
                            </IconButton>
                            <IconButton sx={{ color: "var(--primary)", '&:hover': { bgcolor: 'rgba(0,194,203,0.1)' } }}>
                                <Youtube size="24" variant="Bold" />
                            </IconButton>
                        </Box>
                    </Box>

                    {/* Links Columns */}
                    {footerLinks.map((column) => (
                        <Box key={column.title} sx={{ flex: 0.5 }}>
                            <Typography variant="h6" sx={{ color: "var(--foreground)", fontFamily: "var(--font-prompt)", fontWeight: 600, mb: 3 }}>
                                {column.title}
                            </Typography>
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                {column.links.map((link) => (
                                    <Link key={link.label} href={link.href} style={{ textDecoration: 'none' }}>
                                        <Typography
                                            sx={{
                                                color: "var(--foreground)",
                                                fontFamily: "var(--font-prompt)",
                                                opacity: 0.7,
                                                fontSize: '0.95rem',
                                                '&:hover': { color: "var(--primary)", opacity: 1 },
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            {link.label}
                                        </Typography>
                                    </Link>
                                ))}
                            </Box>
                        </Box>
                    ))}

                    {/* Contact Column */}
                    <Box sx={{ flex: 0.8 }}>
                        <Typography variant="h6" sx={{ color: "var(--foreground)", fontFamily: "var(--font-prompt)", fontWeight: 600, mb: 3 }}>
                            ติดต่อเรา
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                <Location size="24" color="var(--secondary)" variant="Bulk" />
                                <Typography sx={{ color: "var(--foreground)", fontFamily: "var(--font-prompt)", opacity: 0.8 }}>
                                    123 ถนนสุขุมวิท เขตคลองเตย กรุงเทพมหานคร 10110
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                <Call size="24" color="var(--secondary)" variant="Bulk" />
                                <Typography sx={{ color: "var(--foreground)", fontFamily: "var(--font-prompt)", opacity: 0.8 }}>
                                    02-123-4567, 089-999-9999
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                <Sms size="24" color="var(--secondary)" variant="Bulk" />
                                <Typography sx={{ color: "var(--foreground)", fontFamily: "var(--font-prompt)", opacity: 0.8 }}>
                                    contact@seteventbkk.com
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Box>

                {/* Copyright */}
                <Box sx={{ borderTop: "1px solid rgba(0,0,0,0.1)", pt: 3, textAlign: 'center' }}>
                    <Typography sx={{ color: "var(--foreground)", fontFamily: "var(--font-prompt)", opacity: 0.6, fontSize: '0.875rem' }}>
                        © {new Date().getFullYear()} SetEvent. All rights reserved.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
}
