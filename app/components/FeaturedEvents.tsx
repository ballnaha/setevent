"use client";

import React from "react";
import { Box, Typography, Container, Button, Stack } from "@mui/material";
import { ArrowRight, Map, Calendar, Truck, Gallery, Location, Note, Car, Image as ImageIcon, MedalStar, Monitor } from "iconsax-react";
import Image from "next/image";
import Link from "next/link";

const events = [
    {
        title: "บริการจอ LED คุณภาพสูง",
        items: [
            "จอ LED ภายใน (P1.5 - P3.9)",
            "จอ LED ภายนอก (P3.9 - P10)",
            "จอโค้งและรูปทรงพิเศษ",
            "ปรับจูนสีมาตรฐานระดับโปร",
            "ดูแลระบบครบวงจร"
        ],
        link: "/products/rental/led-screen"
    },
    {
        title: "Visual & Interactive",
        items: [
            "3D Projection Mapping",
            "ระบบ Interactive (Wall/Floor)",
            "ออกแบบ Motion Graphic",
            "Laser และ Special Effects",
            "Immersive Experience"
        ],
        link: "/products/rental/mapping"
    },
    {
        title: "งานติดตั้งและโครงสร้าง",
        items: [
            "ติดตั้งจอ LED (Indoor/Outdoor)",
            "ระบบเสียง (Sound System)",
            "ระบบแสง (Lighting System)",
            "เวทีและสเตจ (Stage Platform)",
            "โครงทรัสและหลังคา (Truss & Roof)",
        ],
        link: "/products/fixed-installation/fixed-led-screen"
    },
    {
        title: "จัดดอกไม้และของชำร่วย",
        items: [
            "ออกแบบและจัดดอกไม้ในงาน",
            "Backdrop และซุ้มถ่ายภาพ",
            "ช่อดอกไม้และพวงมาลัย",
            "ของชำร่วยและกิ๊ฟเซ็ต",
            "การ์ดเชิญและป้ายชื่อ",
            "ตกแต่งสถานที่ตามธีมงาน"
        ],
        link: "/products/rental/flower-souvenirs"
    }
];

const infoBlocks = [
    {
        icon: <Note size="32" color="white" variant="Outline" />,
        title: "ปรึกษาและออกแบบฟรี",
        subtitle: "ประเมินราคาตามงบประมาณ",
        color: "#E94560", // Red
    },
    {
        icon: <MedalStar size="32" color="white" variant="Outline" />,
        title: "ทีมงานมืออาชีพ",
        subtitle: "ประสบการณ์กว่า 10 ปี",
        color: "#F2A900", // Gold/Yellow
    },
    {
        icon: <Monitor size="32" color="white" variant="Outline" />,
        title: "อุปกรณ์มาตรฐานสากล",
        subtitle: "จอ LED และระบบเสียง High-End",
        color: "#00C2CB", // Teal
    },
    {
        icon: <Location size="32" color="white" variant="Outline" />,
        title: "บริการทั่วประเทศ",
        subtitle: "พร้อมทีมติดตั้งหน้างาน",
        color: "#1A5F7A", // Blue
    }
];

export default function FeaturedEvents() {
    return (
        <Box sx={{ position: "relative", width: "100%" }}>

            {/* Top Section with Image Background */}
            <Box sx={{
                position: 'relative',
                bgcolor: '#1a0b2e',
                py: { xs: 10, md: 15 },
                overflow: 'hidden'
            }}>
                {/* Background Image with Overlay */}
                <Box sx={{ position: 'absolute', inset: 0, zIndex: 0 }}>
                    <Image
                        src="/images/concert.png"
                        alt="Background"
                        fill
                        style={{ objectFit: 'cover' }}
                    />
                    <Box sx={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to bottom, rgba(30, 10, 60, 0.9) 0%, rgba(30, 10, 60, 0.8) 100%)',
                        zIndex: 1
                    }} />
                </Box>

                <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
                    <Box sx={{
                        display: { xs: 'flex', md: 'grid' },
                        gridTemplateColumns: { md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
                        gap: { xs: 2, md: 4 },
                        overflowX: { xs: 'auto', md: 'visible' },
                        scrollSnapType: { xs: 'x mandatory', md: 'none' },
                        pb: { xs: 4, md: 0 }, // Add padding bottom for scrollbar space on mobile
                        '::-webkit-scrollbar': { display: 'none' }, // Hide scrollbar
                        mx: { xs: -2, md: 0 }, // Negative margin to allow full-width scroll on mobile
                        px: { xs: 2, md: 0 }, // Padding to compensate negative margin
                    }}>
                        {events.map((event, index) => (
                            <Box key={index} sx={{
                                textAlign: 'left',
                                minWidth: { xs: '85vw', sm: '350px', md: 'auto' }, // Fixed width for mobile cards
                                scrollSnapAlign: 'center',
                                bgcolor: { xs: 'rgba(255,255,255,0.03)', md: 'transparent' }, // Subtle background on mobile
                                p: { xs: 3, md: 0 },
                                borderRadius: { xs: 2, md: 0 },
                                border: { xs: '1px solid rgba(255,255,255,0.1)', md: 'none' }
                            }}>
                                <Typography variant="h4" sx={{
                                    fontFamily: "var(--font-prompt)",
                                    fontWeight: 700,
                                    color: "white",
                                    mb: 2,
                                    textTransform: 'uppercase',
                                    letterSpacing: 0.5,
                                    fontSize: { xs: '1.4rem', md: '1.8rem' }, // Smaller font on mobile
                                    height: { md: '60px' }, // Fixed height for alignment
                                    display: 'flex',
                                    alignItems: 'end'
                                }}>
                                    {event.title}
                                </Typography>

                                <Box component="ul" sx={{
                                    listStyle: 'none',
                                    p: 0,
                                    m: 0,
                                    mb: 3,
                                    minHeight: { md: '180px' }
                                }}>
                                    {event.items.map((item, i) => (
                                        <Box component="li" key={i} sx={{
                                            color: 'rgba(255,255,255,0.7)',
                                            fontFamily: "var(--font-prompt)",
                                            fontSize: { xs: '0.85rem', md: '0.9rem' },
                                            mb: 1,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1.5,
                                            fontWeight: 300,
                                            letterSpacing: 0.3
                                        }}>
                                            <Box sx={{ width: 4, height: 4, bgcolor: 'var(--primary)', borderRadius: '50%', flexShrink: 0 }} />
                                            {item}
                                        </Box>
                                    ))}
                                </Box>

                                <Button
                                    variant="outlined"
                                    component={Link}
                                    href={event.link}
                                    fullWidth={true} // Full width button on mobile
                                    sx={{
                                        color: 'white',
                                        borderColor: 'rgba(255,255,255,0.3)',
                                        borderRadius: 2, // Rounded button
                                        px: 4,
                                        py: 1.2,
                                        fontFamily: "var(--font-prompt)",
                                        fontSize: '0.9rem',
                                        fontWeight: 500,
                                        transition: 'all 0.3s ease',
                                        width: { md: 'auto' }, // Auto width on desktop
                                        '&:hover': {
                                            borderColor: 'white',
                                            bgcolor: 'rgba(255,255,255,0.1)',
                                            transform: 'translateY(-2px)'
                                        }
                                    }}
                                >
                                    ดูรายละเอียด
                                </Button>
                            </Box>
                        ))}
                    </Box>
                </Container>
            </Box>

            {/* Bottom Info Bar */}
            <Box sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' } // 2 columns on mobile
            }}>
                {infoBlocks.map((block, index) => (
                    <Box
                        key={index}
                        sx={{
                            bgcolor: block.color,
                            py: { xs: 4, md: 6 }, // Reduce padding on mobile
                            px: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textAlign: 'center',
                            transition: 'filter 0.3s ease',
                            cursor: 'pointer',
                            minHeight: { xs: '160px', md: 'auto' }, // Ensure touch target size
                            '&:hover': {
                                filter: 'brightness(1.1)'
                            }
                        }}
                    >
                        <Box sx={{ mb: 1.5 }}>
                            {block.icon}
                        </Box>
                        <Typography variant="h6" sx={{
                            fontFamily: "var(--font-prompt)",
                            fontWeight: 700,
                            color: "white",
                            textTransform: 'uppercase',
                            mb: 0.5,
                            fontSize: { xs: '0.9rem', md: '1.1rem' } // Responsive font size
                        }}>
                            {block.title}
                        </Typography>
                        <Typography variant="body2" sx={{
                            fontFamily: "var(--font-prompt)",
                            fontWeight: 400,
                            color: "rgba(255,255,255,0.9)",
                            fontSize: { xs: '0.8rem', md: '1rem' }
                        }}>
                            {block.subtitle}
                        </Typography>
                    </Box>
                ))}
            </Box>

        </Box>
    );
}
