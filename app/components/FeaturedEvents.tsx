"use client";

import React from "react";
import { Box, Typography, Container, Button, Stack } from "@mui/material";
import { ArrowRight, Map, Calendar, Truck, Gallery, Location, Note, Car, Image as ImageIcon } from "iconsax-react";
import Image from "next/image";
import Link from "next/link";

const events = [
    {
        title: "CONCERTS & FESTIVALS",
        items: [
            "FULL SCALE LIGHTING SYSTEM",
            "PROFESSIONAL SOUND SYSTEM",
            "LED VISUAL & MAPPING",
            "STAGE DESIGN & STRUCTURE",
            "ARTIST MANAGEMENT",
            "LIVE STREAMING PRODUCTION"
        ],
        link: "/services/concert"
    },
    {
        title: "CORPORATE EVENTS",
        items: [
            "PRODUCT LAUNCH",
            "GRAND OPENING",
            "GALA DINNER & PARTY",
            "PRESS CONFERENCE",
            "SEMINAR & WORKSHOP",
            "BOOTH & EXHIBITION"
        ],
        link: "/services/corporate"
    },
    {
        title: "WEDDING & PARTIES",
        items: [
            "WEDDING PLANNER",
            "DECORATION & FLOWER",
            "AFTER PARTY SYSTEM",
            "PRIVATE PARTY",
            "LIGHTING AMBIENCE",
            "SPECIAL EFFECT"
        ],
        link: "/services/wedding"
    }
];

const infoBlocks = [
    {
        icon: <Location size="40" color="white" variant="Outline" />,
        title: "SERVICE AREA",
        subtitle: "ทั่วประเทศไทย",
        color: "#F2A900", // Gold/Yellow
    },
    {
        icon: <Note size="40" color="white" variant="Outline" />,
        title: "BOOKING",
        subtitle: "จองคิวงาน / ปรึกษาฟรี",
        color: "#E94560", // Red
    },
    {
        icon: <Car size="40" color="white" variant="Outline" />,
        title: "LOGISTICS",
        subtitle: "บริการขนส่งติดตั้ง",
        color: "#00C2CB", // Teal
    },
    {
        icon: <ImageIcon size="40" color="white" variant="Outline" />,
        title: "PORTFOLIO",
        subtitle: "ผลงานที่ผ่านมา",
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
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" }, // Keep 1 col for tablet portrait for better readability
                        gap: { xs: 6, sm: 8, md: 4 } // Increase gap on tablet to separate sections clearly
                    }}>
                        {events.map((event, index) => (
                            <Box key={index} sx={{ textAlign: 'left' }}>
                                <Typography variant="h4" sx={{
                                    fontFamily: "var(--font-prompt)",
                                    fontWeight: 800,
                                    color: "white",
                                    mb: 3,
                                    textTransform: 'uppercase',
                                    letterSpacing: 1,
                                    fontSize: { xs: '1.8rem', md: '2rem' }
                                }}>
                                    {event.title}
                                </Typography>

                                <Box component="ul" sx={{
                                    listStyle: 'none',
                                    p: 0,
                                    m: 0,
                                    mb: 4,
                                    minHeight: { md: '180px' }
                                }}>
                                    {event.items.map((item, i) => (
                                        <Box component="li" key={i} sx={{
                                            color: 'rgba(255,255,255,0.7)',
                                            fontFamily: "var(--font-prompt)",
                                            fontSize: '0.9rem',
                                            mb: 1,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1,
                                            fontWeight: 300,
                                            letterSpacing: 0.5
                                        }}>
                                            <Box sx={{ width: 4, height: 4, bgcolor: 'var(--primary)', borderRadius: '50%' }} />
                                            {item}
                                        </Box>
                                    ))}
                                </Box>

                                <Button
                                    variant="outlined"
                                    component={Link}
                                    href={event.link}
                                    sx={{
                                        color: 'white',
                                        borderColor: 'rgba(255,255,255,0.5)',
                                        borderRadius: 0,
                                        px: 4,
                                        py: 1,
                                        fontFamily: "var(--font-prompt)",
                                        fontSize: '0.9rem',
                                        fontWeight: 600,
                                        '&:hover': {
                                            borderColor: 'white',
                                            bgcolor: 'rgba(255,255,255,0.1)'
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
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' } }}>
                {infoBlocks.map((block, index) => (
                    <Box
                        key={index}
                        sx={{
                            bgcolor: block.color,
                            py: 6,
                            px: 3,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textAlign: 'center',
                            transition: 'filter 0.3s ease',
                            cursor: 'pointer',
                            '&:hover': {
                                filter: 'brightness(1.1)'
                            }
                        }}
                    >
                        <Box sx={{ mb: 2 }}>
                            {block.icon}
                        </Box>
                        <Typography variant="h5" sx={{
                            fontFamily: "var(--font-prompt)",
                            fontWeight: 800,
                            color: "white",
                            textTransform: 'uppercase',
                            mb: 0.5
                        }}>
                            {block.title}
                        </Typography>
                        <Typography variant="body1" sx={{
                            fontFamily: "var(--font-prompt)",
                            fontWeight: 400,
                            color: "rgba(255,255,255,0.9)",
                        }}>
                            {block.subtitle}
                        </Typography>
                    </Box>
                ))}
            </Box>

        </Box>
    );
}
