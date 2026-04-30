"use client";

import React from "react";
import Link from "next/link";
import { Box, Typography, Container, Button } from "@mui/material";
import { Monitor, MagicStar, Music } from "iconsax-react";

const services = [
    {
        title: "บริการเช่าอุปกรณ์",
        subtitle: "All-in-One Rental Solutions",
        desc: "บริการ<strong>เช่าจอ LED งานแต่ง ราคาถูก</strong> กทม. นำเข้าเกรดพรีเมียม พร้อมทั้ง TV, Pointer และอุปกรณ์จัดงานคุณภาพสูง ดูแลโดยทีมงานติดตั้งมืออาชีพ ในราคาที่คุณพึงพอใจ",
        icon: <Monitor size="50" color="currentColor" variant="Outline" />,
        color: "#E94560", // Secondary
        buttonText: "เช่าอุปกรณ์",
        linkText: "เช่าจอ LED กรุงเทพ",
        linkHref: "/led-screen-rental-bangkok"
    },
    {
        title: "บริการรับจัดงานอีเว้นท์",
        subtitle: "Event Organizing & Planning",
        desc: "บริการ<strong>จัดงานแต่ง หรือ งานสัมมนา ราคาประหยัด</strong> ครบจบในที่เดียว ดังนั้น เราพร้อมเนรมิตงานในฝันของคุณให้ออกมาสมบูรณ์แบบและคุ้มค่าที่สุดในงบประมาณที่กำหนด",
        icon: <MagicStar size="50" color="currentColor" variant="Outline" />,
        color: "#F2A900", // Tertiary (Gold/Yellow adjusted for visibility)
        buttonText: "บริการจัดงาน"
    },
    {
        title: "ระบบแสงสีเสียง",
        subtitle: "Lighting & Sound Production",
        desc: "บริการเช่าเครื่องเสียง เพราะว่า เราจัดเต็มด้วย<strong>ระบบแสงสีเสียงมาตรฐานระดับสากล</strong> นอกจากนี้ ยังผสานเทคโนโลยีทันสมัยเพื่อสร้างบรรยากาศงานให้โดดเด่นที่สุด",
        icon: <Music size="50" color="currentColor" variant="Outline" />,
        color: "#00C2CB", // Primary
        buttonText: "ระบบแสง สี เสียง"
    },
];

export default function ServicesSection() {
    return (
        <Box component="section" aria-label="บริการของ SET EVENT Thailand" sx={{ py: { xs: 8, md: 15 }, bgcolor: "var(--background)", position: "relative", overflow: "hidden" }}>
            {/* Section Heading for SEO */}
            <Typography
                variant="h2"
                component="h2"
                sx={{
                    position: 'absolute',
                    width: '1px',
                    height: '1px',
                    padding: 0,
                    margin: '-1px',
                    overflow: 'hidden',
                    clip: 'rect(0, 0, 0, 0)',
                    whiteSpace: 'nowrap',
                    border: 0,
                }}
            >
                บริการเช่าจอ LED ราคาถูก งานแต่ง งานสัมมนา เช่าเครื่องเสียง และอุปกรณ์จัดงานอีเว้นท์ครบวงจร กทม. ปริมณฑล - SET EVENT Thailand
            </Typography>
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
                <Box sx={{
                    display: { xs: 'flex', md: 'grid' },
                    gridTemplateColumns: { md: '1fr 1fr 1fr' },
                    gap: { xs: 2, md: 8 },
                    textAlign: "center",
                    overflowX: { xs: 'auto', md: 'visible' },
                    scrollSnapType: { xs: 'x mandatory', md: 'none' },
                    scrollPaddingLeft: { xs: '16px', md: 0 },
                    pb: { xs: 2, md: 0 },
                    mx: { xs: -2, md: 0 },
                    px: { xs: 2, md: 0 },
                    scrollbarWidth: 'none', // Hide scrollbar Firefox
                    '&::-webkit-scrollbar': { display: 'none' } // Hide scrollbar Chrome/Safari
                }}>
                    {services.map((service, index) => (
                        <Box
                            key={index}
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                transition: 'transform 0.3s ease',
                                minWidth: { xs: '80vw', sm: '350px', md: 'auto' }, // Card width for overflow
                                scrollSnapAlign: { xs: 'start', md: 'center' },
                                position: 'relative',
                                '&:hover': {
                                    transform: { md: 'translateY(-10px)' }
                                }
                            }}
                        >
                            {/* Icon */}
                            <Box sx={{
                                mb: { xs: 2, md: 3 },
                                color: service.color,
                                '& svg': { strokeWidth: 1.5 },
                                transform: { xs: 'scale(0.9)', md: 'scale(1)' }
                            }}>
                                {service.icon}
                            </Box>

                            {/* Title */}
                            <Typography variant="h4" component="h3" sx={{
                                fontFamily: "var(--font-prompt)",
                                fontWeight: "bold",
                                mb: 1,
                                color: service.color,
                                textTransform: 'uppercase',
                                letterSpacing: 0.5,
                                fontSize: { xs: '1.5rem', md: '2rem' }
                            }}>
                                {service.title}
                            </Typography>

                            {/* Subtitle */}
                            <Typography variant="h6" sx={{
                                fontFamily: "var(--font-prompt)",
                                fontWeight: 600,
                                mb: { xs: 1.5, md: 3 },
                                color: 'var(--foreground)',
                                opacity: 0.8,
                                fontSize: { xs: '1rem', md: '1.25rem' }
                            }}>
                                {service.subtitle}
                            </Typography>

                            {/* Description */}
                             <Typography 
                                variant="body1" 
                                dangerouslySetInnerHTML={{ __html: service.desc }}
                                sx={{
                                    fontFamily: "var(--font-prompt)",
                                    color: 'var(--foreground)',
                                    opacity: 0.6,
                                    lineHeight: 1.6,
                                    mb: { xs: 3, md: 5 },
                                    maxWidth: '300px',
                                    fontSize: { xs: '0.9rem', md: '1rem' },
                                    display: '-webkit-box',
                                    WebkitLineClamp: { xs: 3, md: 'unset' }, // Limit lines on mobile
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden'
                                }}
                            />

                            {service.linkHref && (
                                <Button
                                    component={Link}
                                    href={service.linkHref}
                                    variant="outlined"
                                    aria-label={service.linkText}
                                    sx={{
                                        mt: 'auto',
                                        borderColor: service.color,
                                        color: service.color,
                                        borderRadius: '6px',
                                        px: 2.5,
                                        py: 1,
                                        fontFamily: "var(--font-prompt)",
                                        fontWeight: 700,
                                        textTransform: 'none',
                                        '&:hover': {
                                            borderColor: service.color,
                                            bgcolor: `${service.color}14`,
                                        }
                                    }}
                                >
                                    {service.linkText}
                                </Button>
                            )}

                        </Box>
                    ))}
                </Box>
            </Container>
        </Box>
    );
}
