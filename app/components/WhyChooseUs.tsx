"use client";

import React from "react";
import { Box, Container, Stack, Typography } from "@mui/material";
import { Medal } from "iconsax-react";
import Image from "next/image";

export default function WhyChooseUs() {

    return (
        <Box component="section" aria-label="ทำไมต้องเลือก SET EVENT" sx={{ py: { xs: 8, md: 12 }, bgcolor: "var(--background)", overflow: 'hidden' }}>
            <Container maxWidth="lg">
                <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    spacing={{ xs: 6, md: 8 }}
                    alignItems="center"
                >
                    {/* Content Section */}
                    <Box sx={{
                        flex: 1,
                        order: { xs: 1, md: 2 }
                    }}>
                        <Typography variant="h6" sx={{
                            color: "var(--secondary)",
                            fontFamily: "var(--font-comfortaa)",
                            fontWeight: "bold",
                            mb: 2,
                            letterSpacing: 1.5,
                            fontSize: { xs: '0.9rem', md: '1.25rem' }
                        }}>
                            WHY CHOOSE US
                        </Typography>
                        <Typography variant="h3" component="h2" sx={{
                            color: "var(--foreground)",
                            fontFamily: "var(--font-prompt)",
                            fontWeight: "bold",
                            mb: 4,
                            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                            textShadow: 'var(--text-glow)'
                        }}>
                            ทำไมต้องเลือก <span style={{ color: 'var(--primary)' }}>SET EVENT Thailand?</span>
                        </Typography>

                        <Stack spacing={4}>
                            {[
                                { title: 'ระบบติดตามงานอัจฉริยะ', desc: 'ตรวจสอบสถานะการจัดงานและการติดตั้งอุปกรณ์ได้แบบ Real-time ผ่าน Web Application ส่วนตัวที่เราพัฒนาขึ้นเพื่อคุณ' },
                                { title: 'ทีมงานมืออาชีพ', desc: 'ประสบการณ์กว่า 10 ปี พร้อมแก้ปัญหาหน้างานได้ทันท่วงที' },
                                { title: 'ราคาที่จับต้องได้', desc: 'บริการคุณภาพระดับพรีเมียม ในราคาที่สมเหตุสมผลและคุ้มค่า' }
                            ].map((item, i) => (
                                <Box key={i} sx={{ borderLeft: '4px solid var(--primary)', pl: 3 }}>
                                    <Typography variant="h6" sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 'bold', color: 'var(--foreground)', mb: 1, fontSize: '1.1rem' }}>
                                        {item.title}
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontFamily: 'var(--font-prompt)', color: 'var(--foreground)', opacity: 0.7, fontSize: '0.95rem' }}>
                                        {item.desc}
                                    </Typography>
                                </Box>
                            ))}
                        </Stack>
                    </Box>

                    {/* Image Section */}
                    <Box sx={{
                        flex: 1,
                        order: { xs: 2, md: 1 },
                        width: '100%'
                    }}>
                        <Box
                            sx={{
                                width: '100%',
                                position: 'relative',
                                bgcolor: '#1a1a1a',
                                borderRadius: 2,
                                overflow: 'hidden',
                                // Use aspect-ratio for stable layout - no JS calculation needed
                                aspectRatio: '4 / 3',
                                // Ensure minimum height on larger screens
                                minHeight: { xs: 280, sm: 350, md: 420 },
                                maxHeight: { xs: 320, sm: 420, md: 480 },
                            }}
                        >
                            {/* Light Mode Image */}
                            <Box sx={{
                                position: 'absolute', inset: 0, width: '100%', height: '100%',
                                transition: 'opacity 0.5s ease-in-out',
                                opacity: 1,
                                'html.dark &': { opacity: 0 }
                            }}>
                                <Image
                                    src="/images/app_screen1.webp"
                                    alt="ระบบติดตามงานอีเว้นท์ SET EVENT Thailand - Web Application สำหรับจัดการงาน"
                                    fill
                                    priority
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    placeholder="blur"
                                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mPo6Oj4HwAE/gLqWTtW2QAAAABJRU5ErkJggg=="
                                    style={{ objectFit: 'cover' }}
                                />
                            </Box>

                            {/* Dark Mode Image */}
                            <Box sx={{
                                position: 'absolute', inset: 0, width: '100%', height: '100%',
                                transition: 'opacity 0.5s ease-in-out',
                                opacity: 0,
                                'html.dark &': { opacity: 1 }
                            }}>
                                <Image
                                    src="/images/app_screen1_dark.webp"
                                    alt="ระบบติดตามงานอีเว้นท์ SET EVENT Thailand - Web Application สำหรับจัดการงาน"
                                    fill
                                    priority
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    placeholder="blur"
                                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mPo6Oj4HwAE/gLqWTtW2QAAAABJRU5ErkJggg=="
                                    style={{ objectFit: 'cover' }}
                                />
                            </Box>
                        </Box>
                    </Box>
                </Stack>
            </Container>
        </Box>
    );
}
