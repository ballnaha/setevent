"use client";

import React from "react";
import { Box, Container, Typography, Chip, Stack, Button } from "@mui/material";
import { Calendar, Magicpen, Clock, ShieldTick, MessageAdd1 } from "iconsax-react";
import AuspiciousCalculator from "./AuspiciousCalculator";

export default function AuspiciousDatesContent() {
    return (
        <Box sx={{ bgcolor: 'var(--background)', minHeight: '100vh', pb: 10, overflow: 'hidden' }}>
            {/* Header Section */}
            <Box sx={{
                pt: { xs: 15, md: 22 },
                pb: { xs: 8, md: 10 },
                position: 'relative',
            }}>
                {/* Background Decor - Elegant Gold theme for Auspicious Dates */}
                <Box sx={{
                    position: 'absolute',
                    top: '-20%',
                    right: '-10%',
                    width: '600px',
                    height: '600px',
                    background: 'radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, rgba(212, 175, 55, 0) 70%)',
                    '.dark &': {
                        background: 'radial-gradient(circle, rgba(212, 175, 55, 0.08) 0%, rgba(212, 175, 55, 0) 70%)'
                    },
                    filter: 'blur(60px)',
                    zIndex: 0
                }} />
                <Box sx={{
                    position: 'absolute',
                    bottom: '-10%',
                    left: '-10%',
                    width: '500px',
                    height: '500px',
                    background: 'radial-gradient(circle, rgba(255, 105, 180, 0.1) 0%, rgba(255, 105, 180, 0) 70%)',
                    '.dark &': {
                        background: 'radial-gradient(circle, rgba(255, 105, 180, 0.05) 0%, rgba(255, 105, 180, 0) 70%)'
                    },
                    filter: 'blur(60px)',
                    zIndex: 0
                }} />

                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                    <Stack spacing={3} alignItems="center">
                        <Chip
                            label="Wedding Experience"
                            sx={{
                                bgcolor: 'rgba(212, 175, 55, 0.1)',
                                color: '#D4AF37',
                                border: '1px solid rgba(212, 175, 55, 0.2)',
                                fontFamily: 'var(--font-prompt)',
                                fontWeight: 600
                            }}
                        />
                        <Typography
                            component="h1"
                            sx={{
                                fontFamily: 'var(--font-prompt)',
                                fontWeight: 800,
                                fontSize: { xs: '2.5rem', md: '4.5rem' },
                                color: 'var(--foreground)',
                                lineHeight: 1.1,
                                letterSpacing: '-1px',
                                textShadow: 'var(--text-glow)'
                            }}
                        >
                            AUSPICIOUS <br />
                            <span style={{
                                background: 'linear-gradient(90deg, #D4AF37 0%, #FF69B4 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}>
                                DATES
                            </span>
                        </Typography>
                        <Typography
                            component="h2"
                            sx={{
                                fontFamily: 'var(--font-prompt)',
                                color: 'var(--foreground)',
                                opacity: 0.7,
                                fontSize: { xs: '1rem', md: '1.2rem' },
                                maxWidth: 600,
                                lineHeight: 1.8,
                                mx: 'auto'
                            }}
                        >
                            เริ่มต้นชีวิตคู่อย่างสมบูรณ์แบบ ด้วยการหาฤกษ์แต่งงานที่แม่นยำ วิเคราะห์ดวงชะตาส่วนบุคคล เพื่อให้คุณและคู่รักมีวันเกิดสิริมงคลที่สุด
                        </Typography>
                    </Stack>
                </Container>
            </Box>

            {/* Interactive Calculator Section */}
            <Box sx={{ position: 'relative', zIndex: 10, mt: -8, mb: 10 }}>
                <Container maxWidth="lg">
                    <AuspiciousCalculator />
                </Container>
            </Box>


        </Box>
    );
}
