"use client";

import React from "react";
import { Box, Container, Stack, Typography } from "@mui/material";
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

export default function PortfolioGallery() {
    return (
        <Box sx={{ pt: { xs: 8, md: 12 }, pb: { xs: 8, md: 0 }, bgcolor: "var(--background)" }}>
            <Container maxWidth="lg">
                <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="end" mb={{ xs: 4, md: 4 }} spacing={2}>
                    <Box>
                        <Typography variant="h6" sx={{ color: "var(--secondary)", fontFamily: "var(--font-comfortaa)", fontWeight: "bold", mb: 1, letterSpacing: 1.5, fontSize: { xs: '0.9rem', md: '1.25rem' } }}>
                            OUR SERVICES
                        </Typography>
                        <Typography variant="h3" sx={{ color: "var(--foreground)", fontFamily: "var(--font-prompt)", fontWeight: "bold", fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' } }}>
                            บริการของเรา
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
                    pb: { xs: 2, md: 0 }, // Space for potential scrollbar
                    '::-webkit-scrollbar': { display: 'none' },
                    '& > div': {
                        breakInside: 'avoid',
                        mb: { xs: 0, md: 0 },
                        minWidth: { xs: '85vw', sm: '350px', md: 'auto' },
                        scrollSnapAlign: { xs: 'center', md: 'none' }
                    }
                }}>
                    {works.map((work, index) => (
                        <Box
                            key={index}
                            sx={{
                                position: 'relative',
                                height: work.height,
                                overflow: 'hidden',
                                cursor: 'pointer',
                                borderRadius: { xs: 2, md: 0 },
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
                                background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)',
                                opacity: 1,
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
