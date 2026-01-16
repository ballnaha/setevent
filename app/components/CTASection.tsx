"use client";

import React from "react";
import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { ArrowRight, Message } from "iconsax-react";
import Image from "next/image";
import Link from "next/link";

export default function CTASection() {
    return (
        <Box component="section" aria-label="ติดต่อขอใบเสนอราคา" sx={{ position: 'relative', py: { xs: 10, md: 16 }, overflow: 'hidden' }}>

            {/* Full Width Background Image */}
            <Box sx={{ position: 'absolute', inset: 0, zIndex: 0 }}>
                <Image
                    src="/images/banner1-2.webp"
                    alt="SET EVENT Thailand - บริการรับจัดงานอีเว้นท์และเช่าอุปกรณ์ครบวงจร"
                    fill
                    style={{ objectFit: 'cover', objectPosition: 'center' }}
                />
                {/* Dark Overlay Gradient for Readability */}
                <Box sx={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0.6) 100%)',
                }} />
            </Box>

            <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>

                {/* Badge */}
                <Box sx={{
                    display: 'inline-block',
                    bgcolor: 'var(--primary)',
                    color: 'white',
                    py: 1,
                    px: 3,
                    borderRadius: '50px',
                    mb: 4,
                    boxShadow: '0 0 20px rgba(0,194,203,0.5)'
                }}>
                    <Typography variant="subtitle2" sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 'bold', letterSpacing: 1 }}>
                        End-to-End Event Solution
                    </Typography>
                </Box>

                <Typography variant="h2" component="h2" sx={{
                    fontFamily: 'var(--font-prompt)',
                    fontWeight: 800,
                    color: 'white',
                    mb: 3,
                    lineHeight: 1.2,
                    fontSize: { xs: '2rem', md: '3.5rem' },
                    textShadow: '0 10px 30px rgba(0,0,0,0.5)'
                }}>
                    รับจัดงานอีเว้นท์ครบวงจร<br />
                    <span style={{ color: 'var(--primary)' }}>ให้เกิดขึ้นจริงกับ SET EVENT</span>
                </Typography>

                <Typography variant="h6" sx={{
                    fontFamily: 'var(--font-prompt)',
                    color: 'rgba(255,255,255,0.8)',
                    fontWeight: 400,
                    lineHeight: 1.8,
                    mb: 6,
                    maxWidth: '800px',
                    mx: 'auto',
                    fontSize: { xs: '1rem', md: '1.5rem' },
                }}>
                    ไม่ว่างานเล็กหรือใหญ่ ทีมงานมืออาชีพของเราพร้อมดูแลทุกขั้นตอน<br className="hidden md:block" />
                    ตั้งแต่การวางแผน ออกแบบ ติดตั้ง จนจบงาน เพื่อให้งานของคุณออกมาสมบูรณ์แบบที่สุด
                </Typography>

                <Stack direction="row" spacing={2} justifyContent="center">
                    <Button
                        component={Link}
                        href="/contact"
                        variant="contained"
                        size="large"
                        endIcon={<ArrowRight />}
                        aria-label="ขอใบเสนอราคาบริการจัดงานอีเว้นท์"
                        sx={{
                            bgcolor: "var(--primary)",
                            color: "white",
                            fontFamily: "var(--font-prompt)",
                            borderRadius: '50px',
                            px: { xs: 2.5, md: 5 },
                            py: { xs: 1.5, md: 2 },
                            fontSize: { xs: "0.9rem", md: "1.1rem" },
                            fontWeight: 600,
                            boxShadow: '0 0 30px rgba(0, 194, 203, 0.4)',
                            border: '2px solid var(--primary)',
                            '&:hover': {
                                bgcolor: "transparent",
                                color: "var(--primary)",
                                boxShadow: '0 0 40px rgba(0, 194, 203, 0.6)',
                                transform: 'scale(1.05)'
                            },
                        }}
                    >
                        ขอใบเสนอราคา
                    </Button>
                    <Button
                        component="a"
                        href="https://line.me/ti/p/~@setevent"
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="outlined"
                        size="large"
                        startIcon={<Message />}
                        aria-label="สอบถามบริการจัดงานอีเว้นท์ผ่าน LINE Official"
                        sx={{
                            borderColor: "white",
                            color: "white",
                            fontFamily: "var(--font-prompt)",
                            borderRadius: '50px',
                            px: { xs: 2.5, md: 5 },
                            py: { xs: 1.5, md: 2 },
                            fontSize: { xs: "0.9rem", md: "1.1rem" },
                            fontWeight: 600,
                            borderWidth: '2px',
                            '&:hover': {
                                borderColor: "#06C755",
                                bgcolor: "#06C755",
                                borderWidth: '2px',
                                transform: 'scale(1.05)'
                            }
                        }}
                    >
                        สอบถามผ่าน LINE
                    </Button>
                </Stack>
            </Container>
        </Box>
    );
}
