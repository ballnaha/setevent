"use client";

import React from "react";
import { Box, Typography, Container, Paper } from "@mui/material";
import { Monitor, MagicStar, Music } from "iconsax-react";

const services = [
    {
        title: "RENTAL",
        subtitle: "เช่าอุปกรณ์ครบวงจร",
        desc: "บริการให้เช่าเวที แสง สี เสียง และจอ LED คุณภาพสูง พร้อมทีมงานติดตั้งมืออาชีพที่พร้อมดูแลทุกขั้นตอน",
        icon: <Monitor size="50" color="currentColor" variant="Outline" />,
        color: "#E94560", // Secondary
        buttonText: "เช่าอุปกรณ์"
    },
    {
        title: "ORGANIZER",
        subtitle: "รับจัดงาน Event",
        desc: "รับจัดงานอีเว้นท์ งานแต่งงาน งานเปิดตัวสินค้า ดูแลตั้งแต่วางแผนจนจบงาน ให้งานของคุณออกมาสมบูรณ์แบบ",
        icon: <MagicStar size="50" color="currentColor" variant="Outline" />,
        color: "#F2A900", // Tertiary (Gold/Yellow adjusted for visibility)
        buttonText: "บริการจัดงาน"
    },
    {
        title: "PRODUCTION",
        subtitle: "ระบบแสง สี เสียงครบวงจร",
        desc: "ระบบแสง สี เสียงมาตรฐานสากล ผสานเทคโนโลยีทันสมัย ให้ภาพ แสง และเสียงสมจริง คมชัด รองรับทุกประเภทงาน",
        icon: <Music size="50" color="currentColor" variant="Outline" />,
        color: "#00C2CB", // Primary
        buttonText: "ระบบแสง สี เสียง"

    },

];

export default function ServicesSection() {
    return (
        <Box sx={{ py: { xs: 8, md: 15 }, bgcolor: "var(--background)", position: "relative", overflow: "hidden" }}>
            {/* Geometric Decor - Left */}
            <Box sx={{ position: 'absolute', top: '20%', left: 0, zIndex: 0, display: { xs: 'none', lg: 'block' } }}>
                <svg width="150" height="300" viewBox="0 0 150 300" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 0L150 150L0 300V0Z" fill="#E94560" fillOpacity="0.1" />
                    <path d="M0 75L75 150L0 225V75Z" fill="#E94560" />
                </svg>
            </Box>

            {/* Geometric Decor - Right */}
            <Box sx={{ position: 'absolute', top: '40%', right: 0, zIndex: 0, display: { xs: 'none', lg: 'block' } }}>
                <svg width="150" height="300" viewBox="0 0 150 300" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M150 0L0 150L150 300V0Z" fill="#00C2CB" fillOpacity="0.1" />
                    <path d="M150 75L75 150L150 225V75Z" fill="#00C2CB" />
                </svg>
            </Box>

            <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" }, gap: 8, textAlign: "center" }}>
                    {services.map((service, index) => (
                        <Box
                            key={index}
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                transition: 'transform 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-10px)'
                                }
                            }}
                        >
                            {/* Icon */}
                            <Box sx={{
                                mb: 3,
                                color: service.color,
                                '& svg': { strokeWidth: 1.5 }
                            }}>
                                {service.icon}
                            </Box>

                            {/* Title */}
                            <Typography variant="h4" sx={{
                                fontFamily: "var(--font-prompt)",
                                fontWeight: "bold",
                                mb: 1,
                                color: service.color,
                                textTransform: 'uppercase',
                                letterSpacing: 1
                            }}>
                                {service.title}
                            </Typography>

                            {/* Subtitle */}
                            <Typography variant="h6" sx={{
                                fontFamily: "var(--font-prompt)",
                                fontWeight: 600,
                                mb: 3,
                                color: 'var(--foreground)',
                                opacity: 0.8
                            }}>
                                {service.subtitle}
                            </Typography>

                            {/* Description */}
                            <Typography variant="body1" sx={{
                                fontFamily: "var(--font-prompt)",
                                color: 'var(--foreground)',
                                opacity: 0.6,
                                lineHeight: 1.8,
                                mb: 5,
                                maxWidth: '300px'
                            }}>
                                {service.desc}
                            </Typography>

                            {/* Button */}
                            <Box
                                component="button"
                                sx={{
                                    bgcolor: service.color,
                                    color: 'white',
                                    border: 'none',
                                    px: 4,
                                    py: 1.5,
                                    borderRadius: 1,
                                    fontFamily: "var(--font-prompt)",
                                    fontWeight: "bold",
                                    fontSize: '0.9rem',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    boxShadow: `0 4px 15px ${service.color}66`,
                                    '&:hover': {
                                        filter: 'brightness(1.1)',
                                        transform: 'scale(1.05)',
                                        boxShadow: `0 8px 25px ${service.color}88`,
                                    }
                                }}
                            >
                                {service.buttonText}
                            </Box>
                        </Box>
                    ))}
                </Box>
            </Container>
        </Box>
    );
}
