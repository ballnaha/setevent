"use client";

import React from "react";
import { Box, Container, Stack, Typography } from "@mui/material";
import Image from "next/image";

const works = [
    {
        title: "Neon Light Concert",
        category: "Concert & Festival",
        image: "/images/concert.webp",
        height: { xs: '300px', md: '500px' }
    },
    {
        title: "Private Wedding",
        category: "Wedding & Party",
        image: "/images/wedding.webp",
        height: { xs: '300px', md: '350px' }
    },
    {
        title: "Tech Innovation Summit",
        category: "Corporate Event",
        image: "/images/seminar.webp",
        height: { xs: '300px', md: '450px' }
    },
    {
        title: "Grand Opening Gala",
        category: "Launch Event",
        image: "/images/banner_launch.png",
        height: { xs: '300px', md: '400px' }
    },
    {
        title: "Corporate Seminar",
        category: "Business Meeting",
        image: "/images/banner_event.png",
        height: { xs: '300px', md: '600px' }
    },
    {
        title: "Wedding",
        category: "Entertainment",
        image: "/images/banner1.png",
        height: { xs: '300px', md: '380px' }
    }
];

export default function PortfolioGallery() {
    return (
        <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: "var(--background)" }}>
            <Container maxWidth="lg">
                <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="end" mb={4} spacing={2}>
                    <Box>
                        <Typography variant="h6" sx={{ color: "var(--secondary)", fontFamily: "var(--font-comfortaa)", fontWeight: "bold", mb: 1, letterSpacing: 1.5 }}>
                            PORTFOLIO
                        </Typography>
                        <Typography variant="h3" sx={{ color: "var(--foreground)", fontFamily: "var(--font-prompt)", fontWeight: "bold" }}>
                            ผลงานที่ผ่านมา
                        </Typography>
                    </Box>
                    <Typography variant="body1" sx={{ fontFamily: 'var(--font-prompt)', color: 'var(--primary)', cursor: 'pointer', fontWeight: 'bold' }}>
                        ดูทั้งหมด &rarr;
                    </Typography>
                </Stack>

                <Box sx={{
                    columnCount: { xs: 1, sm: 2, md: 3 },
                    columnGap: 1,
                    '& > div': {
                        breakInside: 'avoid',
                        mb: 1
                    }
                }}>
                    {works.map((work, index) => (
                        <Box
                            key={index}
                            sx={{
                                position: 'relative',
                                height: work.height,
                                borderRadius: 2,
                                overflow: 'hidden',
                                cursor: 'pointer',
                                '&:hover .overlay': {
                                    opacity: 1
                                },
                                '&:hover img': {
                                    transform: 'scale(1.1)'
                                }
                            }}
                        >
                            <Image
                                src={work.image}
                                alt={work.title}
                                fill
                                style={{ objectFit: 'cover', transition: 'transform 0.5s ease' }}
                            />
                            <Box className="overlay" sx={{
                                position: 'absolute',
                                inset: 0,
                                bgcolor: 'rgba(0,0,0,0.6)',
                                opacity: 0,
                                transition: 'opacity 0.3s ease',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'flex-end',
                                p: 4
                            }}>
                                <Typography variant="h5" color="white" sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 'bold', mb: 1 }}>
                                    {work.title}
                                </Typography>
                                <Typography variant="body1" color="rgba(255,255,255,0.8)" sx={{ fontFamily: 'var(--font-prompt)' }}>
                                    {work.category}
                                </Typography>
                            </Box>
                        </Box>
                    ))}
                </Box>
            </Container>
        </Box>
    );
}
