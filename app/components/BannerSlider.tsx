"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import { Box, Typography, Button, Container, Stack } from "@mui/material";
import { ArrowRight, Star1 } from "iconsax-react";
import Image from "next/image";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";



const slides = [
    {
        titlePart1: "SET",
        titlePart2: "EVENT",
        titlePart3: "",
        subtitle: "AND EQUIPMENT",
        button1: "TICKETS KAUFEN", // Keeping reference text for now, should likely be "OUR SERVICES" or similar
        button2: "ZUM LINE UP",
        image: "/images/banner1-2.webp", // Reusing an existing image as placeholder, or could use new one
    }
];

export default function BannerSlider() {
    return (
        <Box sx={{ width: "100%", minHeight: { xs: '60vh', md: '100vh' }, position: "relative", top: 0, left: 0, overflow: 'hidden' }}>
            {/* Background Image - Static for Single Hero Look */}
            <Box sx={{
                position: 'absolute',
                inset: 0,
                zIndex: 0,
                bgcolor: '#000',
                '& img': {
                    objectFit: { xs: 'contain', md: 'cover' },
                    objectPosition: 'center',
                }
            }}>
                <Image
                    src="/images/banner1-4.webp"
                    alt="SET EVENT Thailand - บริการเช่าจอ LED เวที แสง เสียง และจัดงานอีเว้นท์ครบวงจร"
                    fill
                    priority
                    style={{ filter: 'grayscale(100%) brightness(0.4)' }} // Darkened grayscale as per ref
                />

                {/* Dot Pattern Overlay for Mobile */}
                <Box sx={{
                    position: 'absolute',
                    inset: 0,
                    zIndex: 1,
                    display: { xs: 'block', md: 'none' },
                    backgroundImage: 'radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)',
                    backgroundSize: '24px 24px',
                }} />
            </Box>

            {/* Geometric Decor - Left Bottom */}
            <Box sx={{ position: 'absolute', bottom: 0, left: 0, zIndex: 1, display: { xs: 'none', md: 'block' } }}>
                <svg width="400" height="400" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 400V200L200 400H0Z" fill="#E94560" /> {/* Red Triangle */}
                    <path d="M0 200V0L200 200H0Z" fill="#0F3460" /> {/* Blue Triangle */}
                    <path d="M200 400L400 400L200 200L200 400Z" fill="#C29B40" /> {/* Gold Triangle */}
                    <rect x="50" y="250" width="100" height="100" fill="white" fillOpacity="0.1" />
                </svg>
            </Box>

            {/* Geometric Decor - Right Bottom */}
            <Box sx={{ position: 'absolute', bottom: 0, right: 0, zIndex: 1, display: { xs: 'none', md: 'block' } }}>
                <svg width="400" height="400" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M400 400V200L200 400H400Z" fill="#E94560" />
                    <path d="M400 200V0L200 200H400Z" fill="#0F3460" />
                    <path d="M200 400L0 400L200 200L200 400Z" fill="#C29B40" />
                </svg>
            </Box>

            {/* Main Center Content */}
            <Box sx={{
                position: 'relative',
                zIndex: 2,
                minHeight: { xs: '60vh', md: '100vh' },
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                pt: { xs: 12, md: 15 },
                pb: { xs: 6, md: 4 }
            }}>
                {/* Hidden H1 for SEO - visually hidden but accessible */}
                <Typography
                    component="h1"
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
                    SET EVENT Thailand - บริการให้เช่าจอ LED เวที แสง เสียง และอุปกรณ์จัดงานอีเว้นท์ครบวงจร
                </Typography>

                <Typography variant="h2" component="div" sx={{
                    fontFamily: 'var(--font-prompt)',
                    fontWeight: 900,
                    color: 'white',
                    fontSize: { xs: '3.5rem', sm: '5rem', md: '7rem', lg: '8.5rem' },
                    lineHeight: 0.85,
                    letterSpacing: -2,
                    textTransform: 'uppercase',
                    textShadow: 'none',
                    WebkitTextStroke: { xs: '0.5px rgba(255,255,255,0.2)', md: '1px rgba(255,255,255,0.1)' },
                    '.dark &': {
                        WebkitTextStroke: { xs: '1px rgba(255,255,255,0.4)', md: '1.5px rgba(255,255,255,0.5)' },
                        textShadow: { xs: '0 0 8px var(--primary)', md: 'none' },
                        animation: { xs: 'none', md: 'neon-pulse 4s ease-in-out infinite' }
                    }
                }}>
                    EVENT<br />RENTAL<br />SERVICE
                </Typography>

                <Typography variant="h3" sx={{
                    fontFamily: 'var(--font-prompt)',
                    fontWeight: 700,
                    color: 'white',
                    fontSize: { xs: '1.2rem', sm: '1.8rem', md: '2.2rem' },
                    mt: { xs: 2, md: 2 },
                    letterSpacing: { xs: 3, sm: 5, md: 8 },
                    textTransform: 'uppercase',
                    textAlign: 'center'
                }}>
                    PROFESSIONAL TEAM
                </Typography>

                <Typography variant="h6" sx={{
                    fontFamily: 'var(--font-prompt)',
                    color: 'rgba(255,255,255,0.9)',
                    mt: { xs: 1.5, md: 2 },
                    maxWidth: '800px',
                    fontWeight: 300,
                    fontSize: { xs: '0.85rem', sm: '1rem', md: '1.2rem' },
                    px: 2
                }}>
                    รับจัดงานอีเว้นท์ · เช่าอุปกรณ์ครบวงจร · งานแต่งงาน · งานสัมมนา
                </Typography>

                <Stack direction="row" spacing={2} mt={{ xs: 3, md: 4 }} justifyContent="center">
                    <Button
                        variant="contained"
                        href="/products"
                        sx={{
                            bgcolor: '#E94560',
                            color: 'white',
                            fontWeight: 700,
                            fontFamily: 'var(--font-prompt)',
                            px: { xs: 2, md: 4 },
                            py: { xs: 1, md: 1.5 },
                            borderRadius: 1,
                            fontSize: { xs: '0.85rem', md: '1rem' },
                            boxShadow: 'var(--primary-glow)',
                            '&:hover': { bgcolor: '#c32f4b' }
                        }}
                    >
                        บริการของเรา
                    </Button>
                    <Button
                        variant="contained"
                        href="/contact"
                        sx={{
                            bgcolor: '#1A5F7A',
                            color: 'white',
                            fontWeight: 700,
                            fontFamily: 'var(--font-prompt)',
                            px: { xs: 2, md: 4 },
                            py: { xs: 1, md: 1.5 },
                            borderRadius: 1,
                            fontSize: { xs: '0.85rem', md: '1rem' },
                            boxShadow: 'var(--primary-glow)',
                            '&:hover': { bgcolor: '#134b61' }
                        }}
                    >
                        ติดต่อสอบถาม
                    </Button>
                </Stack>

                {/* Bottom Date/Location */}
                <Box sx={{ mt: { xs: 4, md: 6 }, color: 'white', textAlign: 'center' }}>
                    <Typography variant="h4" sx={{
                        fontFamily: 'var(--font-prompt)',
                        fontSize: { xs: '1.2rem', md: '1.8rem' },
                        fontWeight: 600,
                        letterSpacing: 1
                    }}>
                        End-to-End Event Solution
                    </Typography>
                    <Typography variant="body1" sx={{
                        fontFamily: 'var(--font-prompt)',
                        fontSize: { xs: '0.9rem', md: '1.1rem' },
                        opacity: 0.8,
                        mt: 0.5
                    }}>
                        ดูแลครบทุกขั้นตอน พร้อมอุปกรณ์ทันสมัย
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
}
