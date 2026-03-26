"use client";

import React from 'react';
import { Box, Container, Grid, Typography, Stack, Divider } from '@mui/material';
import { Award, CallCalling, DirectNotification, Global, MagicStar, ShieldTick, Verify, Timer1 } from 'iconsax-react';

export default function StandardServiceInfo() {
    const highlights = [
        {
            icon: <ShieldTick size="32" color="var(--primary)" variant="Bulk" />,
            title: "มาตรฐานอุปกรณ์ระดับสากล",
            desc: "เราใช้จอ LED และระบบเสียงแบรนด์เนมคุณภาพสูง ตรวจเช็คสภาพทุกครั้งก่อนออกงาน เพื่อความสมบูรณ์แบบของงานคุณ"
        },
        {
            icon: <MagicStar size="32" color="var(--primary)" variant="Bulk" />,
            title: "ทีมงานมืออาชีพประสาทงานไว",
            desc: "ทีมเทคนิคที่มีประสบการณ์จัดงานอีเวนต์ระดับประเทศ พร้อมแก้ไขปัญหาเฉพาะหน้าและดูแลคุณตลอดการจัดงาน"
        },
        {
            icon: <Timer1 size="32" color="var(--primary)" variant="Bulk" />,
            title: "ติดตั้งตรงเวลา ไร้กังวล",
            desc: "เราให้ความสำคัญกับเวลาเป็นอันดับหนึ่ง ทีมงานจะเข้าติดตั้งและทดสอบระบบก่อนเริ่มงานอย่างน้อย 2-4 ชั่วโมง"
        },
        {
            icon: <Global size="32" color="var(--primary)" variant="Bulk" />,
            title: "รับงานทั่วประเทศไทย",
            desc: "ไม่ว่างานของคุณจะจัดที่ไหน กรุงเทพฯ ปริมณฑล หรือต่างจังหวัด เราพร้อมเดินทางไปให้บริการคุณถึงที่"
        }
    ];

    const steps = [
        { num: "01", title: "สอบถามและแจ้งรายละเอียด", desc: "ทักไลน์หรือโทรแจ้งประเภทงาน วันที่ และสถานที่จัดงาน" },
        { num: "02", title: "รับใบเสนอราคา", desc: "เราจะส่งใบเสนอราคาเบื้องต้นให้คุณภายใน 15-30 นาที" },
        { num: "03", title: "มัดจำและยืนยันคิวงาน", desc: "ชำระมัดจำเพื่อล็อคคิกงานและอุปกรณ์สำหรับวันสำคัญของคุณ" },
        { num: "04", title: "ติดตั้งและเริ่มงาน", desc: "ทีมงานเข้าเซ็ตระบบและดูแลคุณตั้งแต่นาทีแรกจนจบงาน" }
    ];

    return (
        <Box sx={{ mt: 10, pt: 10, borderTop: '1px solid var(--border-color)', mb: 8 }}>
            <Container maxWidth="lg">
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '7fr 5fr' }, gap: 8 }}>
                    {/* Left Side: Why Choose Us */}
                    <Box>
                        <Stack spacing={4}>
                            <Box>
                                <Typography sx={{
                                    fontFamily: 'var(--font-prompt)',
                                    color: 'var(--primary)',
                                    fontWeight: 700,
                                    letterSpacing: 2,
                                    mb: 1.5,
                                    fontSize: '0.85rem'
                                }}>
                                    WHY CHOOSE SET EVENT
                                </Typography>
                                <Typography component="h3" sx={{
                                    fontFamily: 'var(--font-prompt)',
                                    color: 'var(--foreground)',
                                    fontWeight: 800,
                                    fontSize: { xs: '2rem', md: '2.5rem' },
                                    lineHeight: 1.2
                                }}>
                                    ทำไมต้องเลือกใช้บริการ <br />
                                    <span style={{ color: 'var(--primary)' }}>SET EVENT Thailand</span>
                                </Typography>
                            </Box>

                            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 4, mt: 2 }}>
                                {highlights.map((item, index) => (
                                    <Stack spacing={2} key={index}>
                                        {item.icon}
                                        <Typography sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--foreground)' }}>
                                            {item.title}
                                        </Typography>
                                        <Typography sx={{ fontFamily: 'var(--font-prompt)', color: 'var(--foreground)', opacity: 0.6, fontSize: '0.9rem', lineHeight: 1.7 }}>
                                            {item.desc}
                                        </Typography>
                                    </Stack>
                                ))}
                            </Box>
                        </Stack>
                    </Box>

                    {/* Right Side: Booking Process */}
                    <Box>
                        <Box sx={{
                            p: 4,
                            bgcolor: 'rgba(10, 92, 90, 0.03)',
                            borderRadius: 6,
                            border: '1px solid rgba(10, 92, 90, 0.1)',
                            position: 'relative',
                            overflow: 'hidden',
                            height: '100%'
                        }}>
                            <Box sx={{ position: 'absolute', top: -20, right: -20, opacity: 0.05 }}>
                                <CallCalling size="120" variant="Bulk" color="var(--primary)" />
                            </Box>

                            <Typography sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 800, fontSize: '1.4rem', mb: 4, color: 'var(--foreground)' }}>
                                ขั้นตอนการจองคิวงาน
                            </Typography>

                            <Stack spacing={3}>
                                {steps.map((step, index) => (
                                    <Stack direction="row" spacing={3} key={index} alignItems="flex-start">
                                        <Typography sx={{
                                            fontFamily: 'var(--font-prompt)',
                                            fontWeight: 900,
                                            fontSize: '1.2rem',
                                            color: 'var(--primary)',
                                            opacity: 0.3,
                                            mt: -0.5
                                        }}>
                                            {step.num}
                                        </Typography>
                                        <Stack spacing={0.5}>
                                            <Typography sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 700, fontSize: '1rem', color: 'var(--foreground)' }}>
                                                {step.title}
                                            </Typography>
                                            <Typography sx={{ fontFamily: 'var(--font-prompt)', color: 'var(--foreground)', opacity: 0.5, fontSize: '0.85rem' }}>
                                                {step.desc}
                                            </Typography>
                                        </Stack>
                                    </Stack>
                                ))}
                            </Stack>

                            <Divider sx={{ my: 4, opacity: 0.1 }} />

                            <Typography sx={{ fontFamily: 'var(--font-prompt)', color: 'var(--foreground)', fontSize: '0.9rem', textAlign: 'center', opacity: 0.7 }}>
                                ต้องการปรึกษาหรือขอใบเสนอราคาด่วน? <br />
                                <Box component="span" sx={{ color: 'var(--primary)', fontWeight: 700, fontSize: '1.1rem', mt: 1, display: 'block' }}>
                                    โทร: 093-726-5055
                                </Box>
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                {/* Service Tagline for SEO */}
                <Box sx={{ mt: 8, textAlign: 'center', opacity: 0.4 }}>
                    <Typography sx={{ fontFamily: 'var(--font-prompt)', fontSize: '0.8rem', letterSpacing: 1 }}>
                        เช่าจอ LED • เช่าเครื่องเสียง • เช่าไฟเวที • จัดงานเลี้ยงบริษัท • งานสัมมนา • งานแต่งงาน • อีเวนต์ครบวงจร • SET EVENT THAILAND
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
}
