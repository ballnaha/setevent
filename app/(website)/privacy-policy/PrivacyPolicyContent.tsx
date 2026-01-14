"use client";

import React, { useState, useEffect } from "react";
import { Box, Container, Typography, Stack, Chip, Divider, Paper } from "@mui/material";
import { ShieldTick, InfoCircle, Lock, Eye, SecurityUser, Setting2 } from "iconsax-react";

export default function PrivacyPolicyContent() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <Box sx={{ minHeight: '100vh', bgcolor: 'var(--background)' }} />;
    }

    const sections = [
        {
            icon: <InfoCircle size="24" color="var(--primary)" variant="Bulk" />,
            title: "1. การเก็บรวบรวมข้อมูลส่วนบุคคล",
            content: "เราอาจเก็บรวบรวมข้อมูลส่วนบุคคลของท่านเมื่อท่านติดต่อเรา หรือใช้งานเว็บไซต์ของเรา เช่น ชื่อ-นามสกุล, เบอร์โทรศัพท์, อีเมล, ข้อมูลการติดต่อผ่านช่องทางโซเชียลมีเดีย และข้อมูลเชิงคุณภาพเกี่ยวกับการใช้งานเว็บไซต์ผ่านคุกกี้"
        },
        {
            icon: <Eye size="24" color="var(--primary)" variant="Bulk" />,
            title: "2. วัตถุประสงค์ในการเก็บรวบรวมข้อมูล",
            content: "เราเก็บข้อมูลเพื่อใช้ในการให้บริการ จัดทำใบเสนอราคา ประสานงานการจัดส่งอุปกรณ์ และเพื่อปรับปรุงประสบการณ์การใช้งานเว็บไซต์ให้ดียิ่งขึ้น รวมถึงการแจ้งข้อมูลข่าวสารและโปรโมชั่นต่างๆ ของทางบริษัท"
        },
        {
            icon: <Lock size="24" color="var(--primary)" variant="Bulk" />,
            title: "3. การรักษาความปลอดภัยของข้อมูล",
            content: "เราให้ความสำคัญอย่างยิ่งกับการรักษาความปลอดภัยข้อมูลส่วนบุคคลของท่าน โดยเราใช้มาตรการทางเทคนิคและการจัดการที่เหมาะสมเพื่อป้องกันการเข้าถึง การสูญหาย หรือการใช้ข้อมูลโดยไม่ได้รับอนุญาต"
        },
        {
            icon: <SecurityUser size="24" color="var(--primary)" variant="Bulk" />,
            title: "4. การเปิดเผยข้อมูลแก่บุคคลภายนอก",
            content: "เราจะไม่ขายหรือแลกเปลี่ยนข้อมูลส่วนบุคคลของท่านกับบุคคลภายนอก เว้นแต่จะเป็นไปตามข้อกำหนดทางกฎหมาย หรือเพื่อความจำเป็นในการให้บริการแก่ท่าน (เช่น บริษัทขนส่ง หรือผู้ให้บริการระบบชำระเงิน)"
        },
        {
            icon: <Setting2 size="24" color="var(--primary)" variant="Bulk" />,
            title: "5. สิทธิของเจ้าของข้อมูล",
            content: "ท่านมีสิทธิในการเข้าถึง แก้ไข ลบ หรือคัดค้านการประมวลผลข้อมูลส่วนบุคคลของท่าน โดยสามารถติดต่อเจ้าหน้าที่คุ้มครองข้อมูลส่วนบุคคลของเราได้ตลอดเวลาผ่านช่องทางที่ระบุในหน้าติดต่อเรา"
        },
        {
            icon: <ShieldTick size="24" color="var(--primary)" variant="Bulk" />,
            title: "6. การใช้คุกกี้ (Cookies)",
            content: "เว็บไซต์ของเรามีการใช้คุกกี้เพื่อเก็บข้อมูลการใช้งานและวิเคราะห์สถิติ เพื่อให้นำเสนอเนื้อหาที่ตรงกับความสนใจของท่านมากที่สุด ท่านสามารถตั้งค่าหรือปิดการใช้งานคุกกี้ได้ผ่านการตั้งค่าเบราว์เซอร์ของท่าน"
        }
    ];

    return (
        <Box sx={{ bgcolor: 'var(--background)', minHeight: '100vh', pb: 10, overflow: 'hidden' }}>
            {/* Hero Section */}
            <Box sx={{
                pt: { xs: 15, md: 22 },
                pb: { xs: 8, md: 10 },
                position: 'relative',
                bgcolor: 'var(--background)'
            }}>
                {/* Background Decor - Teal/Emerald gradients */}
                <Box sx={{
                    position: 'absolute',
                    top: '-20%',
                    right: '-10%',
                    width: '600px',
                    height: '600px',
                    background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0) 70%)',
                    filter: 'blur(60px)',
                    zIndex: 0
                }} />
                <Box sx={{
                    position: 'absolute',
                    bottom: '-10%',
                    left: '-10%',
                    width: '500px',
                    height: '500px',
                    background: 'radial-gradient(circle, rgba(10, 92, 90, 0.1) 0%, rgba(10, 92, 90, 0) 70%)',
                    filter: 'blur(60px)',
                    zIndex: 0
                }} />

                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                    <Stack spacing={3} alignItems="center">
                        <Chip
                            label="PDPA Compliance"
                            sx={{
                                bgcolor: 'rgba(16, 185, 129, 0.1)',
                                color: '#10B981',
                                border: '1px solid rgba(16, 185, 129, 0.2)',
                                fontFamily: 'var(--font-prompt)',
                                fontWeight: 500
                            }}
                        />
                        <Typography
                            component="h1"
                            suppressHydrationWarning
                            sx={{
                                fontFamily: 'var(--font-prompt)',
                                fontWeight: 800,
                                fontSize: { xs: '2.5rem', md: '4rem' },
                                color: 'var(--foreground)',
                                lineHeight: 1.1,
                                letterSpacing: '-1px',
                                textShadow: 'var(--text-glow)'
                            }}
                        >
                            PRIVACY<br />
                            <span style={{
                                background: 'linear-gradient(90deg, #10B981 0%, #0A5C5A 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}>POLICY</span>
                        </Typography>
                        <Typography
                            sx={{
                                fontFamily: 'var(--font-prompt)',
                                color: 'var(--foreground)',
                                opacity: 0.7,
                                fontSize: { xs: '1rem', md: '1.2rem' },
                                maxWidth: 500,
                                lineHeight: 1.8
                            }}
                        >
                            เราให้ความสำคัญอย่างสูงสุดกับการคุ้มครองข้อมูลส่วนบุคคลของลูกค้าและผู้เยี่ยมชมเว็บไซต์ทุกท่าน
                        </Typography>
                    </Stack>
                </Container>
            </Box>

            {/* Content Section */}
            <Container maxWidth="md">
                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 3, md: 6 },
                        borderRadius: '32px',
                        bgcolor: 'rgba(128, 128, 128, 0.05)',
                        border: '1px solid rgba(128, 128, 128, 0.1)',
                    }}
                >
                    <Stack spacing={6}>
                        {sections.map((section, index) => (
                            <Box key={index}>
                                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                                    <Box sx={{
                                        p: 1.5,
                                        borderRadius: '12px',
                                        bgcolor: 'var(--background)',
                                        display: 'flex',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                                    }}>
                                        {section.icon}
                                    </Box>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontFamily: 'var(--font-prompt)',
                                            fontWeight: 700,
                                            color: 'var(--foreground)'
                                        }}
                                    >
                                        {section.title}
                                    </Typography>
                                </Stack>
                                <Typography
                                    sx={{
                                        fontFamily: 'var(--font-prompt)',
                                        color: 'var(--foreground)',
                                        opacity: 0.8,
                                        lineHeight: 1.8,
                                        pl: { md: 7.5 }
                                    }}
                                >
                                    {section.content}
                                </Typography>
                            </Box>
                        ))}
                    </Stack>

                    <Divider sx={{ my: 6, opacity: 0.5 }} />

                    <Box sx={{ textAlign: 'center' }}>
                        <Typography
                            sx={{
                                fontFamily: 'var(--font-prompt)',
                                color: 'var(--foreground)',
                                opacity: 0.6,
                                fontSize: '0.9rem'
                            }}
                        >
                            ปรับปรุงล่าสุดเมื่อวันที่ 14 มกราคม 2569
                        </Typography>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
}
