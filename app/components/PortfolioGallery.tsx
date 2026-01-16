"use client";

import React, { useState } from "react";
import { Box, Container, Stack, Typography } from "@mui/material";
import { Gallery } from "iconsax-react";
import Image from "next/image";

const works = [
    {
        title: "ให้เช่าอุปกรณ์จัดงาน",
        category: "แสง สี เสียง ครบวงจร",
        image: "/images/concert.webp",
        height: { xs: '300px', md: '500px' }
    },
    {
        title: "รับจัดงานแต่งงาน",
        category: "เนรมิตงานฝันให้เป็นจริง",
        image: "/images/wedding.webp",
        height: { xs: '300px', md: '350px' }
    },
    {
        title: "งานสัมมนาและประชุม",
        category: "พร้อมอุปกรณ์ทันสมัย",
        image: "/images/seminar.webp",
        height: { xs: '300px', md: '450px' }
    },
    {
        title: "งานจัดเลี้ยงอาหาร",
        category: "สร้างภาพลักษณ์ที่โดดเด่น",
        image: "/images/launch.webp",
        height: { xs: '300px', md: '400px' }
    },
    {
        title: "ของชำร่วยงานแต่งงาน",
        category: "สร้างความประทับใจให้จดจำ",
        image: "/images/gift.webp",
        height: { xs: '300px', md: '600px' }
    },
    {
        title: "ปาร์ตี้และงานเลี้ยง",
        category: "สนุกสุดเหวี่ยงทุกโจทย์",
        image: "/images/party.webp",
        height: { xs: '300px', md: '250px' }
    }
];

// Premium Skeleton Component
function ImageSkeleton() {
    return (
        <Box
            sx={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #1a1a2e 100%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
                overflow: 'hidden',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)',
                    animation: 'shimmer 2s infinite',
                    transform: 'translateX(-100%)',
                },
                '@keyframes shimmer': {
                    '0%': { transform: 'translateX(-100%)' },
                    '100%': { transform: 'translateX(100%)' },
                },
            }}
        >
            {/* Icon */}
            <Box
                sx={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    animation: 'pulse 2s ease-in-out infinite',
                    '@keyframes pulse': {
                        '0%, 100%': { opacity: 0.4, transform: 'scale(1)' },
                        '50%': { opacity: 0.7, transform: 'scale(1.05)' },
                    },
                }}
            >
                <Gallery size={28} color="rgba(255,255,255,0.3)" variant="Bulk" />
            </Box>

            {/* Text placeholders */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                <Box
                    sx={{
                        width: 120,
                        height: 12,
                        borderRadius: 1,
                        background: 'rgba(255,255,255,0.08)',
                        animation: 'pulse 2s ease-in-out infinite 0.2s',
                    }}
                />
                <Box
                    sx={{
                        width: 80,
                        height: 8,
                        borderRadius: 1,
                        background: 'rgba(255,255,255,0.05)',
                        animation: 'pulse 2s ease-in-out infinite 0.4s',
                    }}
                />
            </Box>
        </Box>
    );
}

// Component สำหรับแต่ละ Work Card พร้อม Skeleton
function WorkCard({ work, index }: { work: typeof works[0]; index: number }) {
    const [isLoaded, setIsLoaded] = useState(false);

    return (
        <Box
            sx={{
                position: 'relative',
                height: work.height,
                overflow: 'hidden',
                cursor: 'pointer',
                borderRadius: { xs: 2, md: 0 },
                '&:hover img': {
                    transform: isLoaded ? 'scale(1.1)' : 'none'
                }
            }}
        >
            {/* Premium Skeleton - แสดงจนกว่ารูปจะโหลดเสร็จ */}
            {!isLoaded && <ImageSkeleton />}

            {/* Image */}
            <Image
                src={work.image}
                alt={work.title}
                fill
                loading="lazy"
                sizes="(max-width: 768px) 85vw, 33vw"
                onLoad={() => setIsLoaded(true)}
                style={{
                    objectFit: 'cover',
                    transition: 'transform 0.5s ease, opacity 0.4s ease',
                    opacity: isLoaded ? 1 : 0
                }}
            />

            {/* Overlay - แสดงเมื่อรูปโหลดเสร็จ */}
            <Box
                className="overlay"
                sx={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)',
                    opacity: isLoaded ? 1 : 0,
                    transition: 'opacity 0.4s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    p: 4
                }}
            >
                <Typography variant="h5" component="h3" color="white" sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 'bold', mb: 1 }}>
                    {work.title}
                </Typography>
                <Typography variant="body1" color="rgba(255,255,255,0.8)" sx={{ fontFamily: 'var(--font-prompt)' }}>
                    {work.category}
                </Typography>
            </Box>
        </Box>
    );
}

export default function PortfolioGallery() {
    return (
        <Box component="section" aria-label="บริการรับจัดงานอีเว้นท์" sx={{ pt: { xs: 8, md: 12 }, pb: { xs: 8, md: 0 }, bgcolor: "var(--background)" }}>
            <Container maxWidth="lg">
                <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="end" mb={{ xs: 4, md: 4 }} spacing={2}>
                    <Box>
                        <Typography variant="h6" sx={{ color: "var(--secondary)", fontFamily: "var(--font-comfortaa)", fontWeight: "bold", mb: 1, letterSpacing: 1.5, fontSize: { xs: '0.9rem', md: '1.25rem' } }}>
                            OUR SERVICES
                        </Typography>
                        <Typography variant="h3" component="h2" sx={{ color: "var(--foreground)", fontFamily: "var(--font-prompt)", fontWeight: "bold", fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' } }}>
                            บริการรับจัดงานอีเว้นท์ครบวงจร
                        </Typography>
                    </Box>
                    <Typography variant="body1" sx={{ fontFamily: 'var(--font-prompt)', color: 'var(--primary)', cursor: 'pointer', fontWeight: 'bold' }}>
                        ดูทั้งหมด &rarr;
                    </Typography>
                </Stack>

                <Box sx={{
                    display: { xs: 'flex', md: 'block' },
                    overflowX: { xs: 'auto', md: 'visible' },
                    scrollSnapType: { xs: 'x mandatory', md: 'none' },
                    columnCount: { md: 3 },
                    columnGap: 0,
                    gap: { xs: 2, md: 0 },
                    mx: { xs: -2, md: 0 },
                    px: { xs: 2, md: 0 },
                    pb: { xs: 2, md: 0 },
                    '::-webkit-scrollbar': { display: 'none' },
                    '& > div': {
                        breakInside: 'avoid',
                        mb: { xs: 0, md: 0 },
                        minWidth: { xs: '85vw', sm: '350px', md: 'auto' },
                        scrollSnapAlign: { xs: 'center', md: 'none' }
                    }
                }}>
                    {works.map((work, index) => (
                        <WorkCard key={index} work={work} index={index} />
                    ))}
                </Box>
            </Container>
        </Box>
    );
}
