"use client";

import React, { useState, useEffect } from "react";
import { Box, Container, Typography, Stack, Chip, Divider, Paper } from "@mui/material";
import {
    DocumentText,
    TickCircle,
    CloseCircle,
    Wallet,
    ShieldTick,
    Message,
    Warning2,
    Receipt
} from "iconsax-react";

export default function TermsOfServiceContent() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <Box sx={{ minHeight: '100vh', bgcolor: 'var(--background)' }} />;
    }

    const sections = [
        {
            icon: <DocumentText size="24" color="var(--primary)" variant="Bulk" />,
            title: "1. ข้อตกลงทั่วไป",
            content: "การใช้บริการของ SET EVENT Thailand ถือว่าท่านยอมรับและตกลงปฏิบัติตามเงื่อนไขการใช้บริการทั้งหมดที่ระบุไว้ในเอกสารนี้ หากท่านไม่ยอมรับเงื่อนไขเหล่านี้ กรุณางดเว้นการใช้บริการของเรา"
        },
        {
            icon: <TickCircle size="24" color="var(--primary)" variant="Bulk" />,
            title: "2. ขอบเขตการให้บริการ",
            content: "เราให้บริการเช่าจอ LED, เครื่องเสียง, เวที และอุปกรณ์จัดงานอีเวนต์ รวมถึงบริการติดตั้ง รื้อถอน และควบคุมระบบ โดยรายละเอียดการให้บริการจะถูกระบุไว้ในใบเสนอราคาที่ทั้งสองฝ่ายตกลงกัน"
        },
        {
            icon: <Receipt size="24" color="var(--primary)" variant="Bulk" />,
            title: "3. การจองและยืนยันบริการ",
            content: "การจองบริการจะถือว่าสมบูรณ์เมื่อท่านได้รับใบเสนอราคาอย่างเป็นทางการ และชำระเงินมัดจำตามที่ตกลง การยืนยันการจองจะถูกส่งไปยังช่องทางการติดต่อที่ท่านได้ให้ไว้"
        },
        {
            icon: <Wallet size="24" color="var(--primary)" variant="Bulk" />,
            title: "4. เงื่อนไขการชำระเงิน",
            content: "ท่านต้องชำระเงินมัดจำอย่างน้อย 50% ของราคาบริการทั้งหมดเพื่อยืนยันการจอง ส่วนที่เหลือต้องชำระก่อนหรือในวันจัดงาน การชำระเงินสามารถทำได้ผ่านการโอนเงินธนาคารหรือช่องทางอื่นตามที่ตกลง"
        },
        {
            icon: <CloseCircle size="24" color="var(--primary)" variant="Bulk" />,
            title: "5. การยกเลิกบริการ",
            content: "กรณียกเลิกบริการก่อน 7 วันทำการ ท่านจะได้รับเงินมัดจำคืน 50% หากยกเลิกน้อยกว่า 7 วันทำการ เงินมัดจำจะไม่สามารถขอคืนได้ ทั้งนี้กรณีพิเศษจะพิจารณาเป็นรายกรณี"
        },
        {
            icon: <Warning2 size="24" color="var(--primary)" variant="Bulk" />,
            title: "6. ข้อจำกัดความรับผิดชอบ",
            content: "เราไม่รับผิดชอบต่อความเสียหายที่เกิดจากเหตุสุดวิสัย เช่น ภัยธรรมชาติ ไฟฟ้าดับ หรือเหตุการณ์ที่อยู่นอกเหนือการควบคุม หากเกิดปัญหาทางเทคนิคระหว่างงาน ทีมของเราจะดำเนินการแก้ไขอย่างเต็มความสามารถ"
        },
        {
            icon: <ShieldTick size="24" color="var(--primary)" variant="Bulk" />,
            title: "7. ความรับผิดชอบต่ออุปกรณ์",
            content: "ลูกค้าต้องรับผิดชอบต่อความเสียหายของอุปกรณ์ที่เกิดจากการใช้งานที่ไม่เหมาะสม หรือการกระทำของบุคคลที่สามในพื้นที่จัดงาน การซ่อมแซมหรือทดแทนจะถูกคิดค่าใช้จ่ายตามมูลค่าจริง"
        },
        {
            icon: <Message size="24" color="var(--primary)" variant="Bulk" />,
            title: "8. การติดต่อและข้อพิพาท",
            content: "หากมีข้อสงสัยหรือปัญหาเกี่ยวกับบริการ สามารถติดต่อเราได้ผ่านช่องทางที่ระบุในหน้าติดต่อเรา กรณีมีข้อพิพาท ทั้งสองฝ่ายจะใช้ความพยายามในการเจรจาไกล่เกลี่ยก่อนใช้กระบวนการทางกฎหมาย"
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
                {/* Background Decor - Blue/Purple gradients */}
                <Box sx={{
                    position: 'absolute',
                    top: '-20%',
                    right: '-10%',
                    width: '600px',
                    height: '600px',
                    background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(99, 102, 241, 0) 70%)',
                    filter: 'blur(60px)',
                    zIndex: 0
                }} />
                <Box sx={{
                    position: 'absolute',
                    bottom: '-10%',
                    left: '-10%',
                    width: '500px',
                    height: '500px',
                    background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, rgba(139, 92, 246, 0) 70%)',
                    filter: 'blur(60px)',
                    zIndex: 0
                }} />

                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                    <Stack spacing={3} alignItems="center">
                        <Chip
                            label="Terms of Service"
                            sx={{
                                bgcolor: 'rgba(99, 102, 241, 0.1)',
                                color: '#6366F1',
                                border: '1px solid rgba(99, 102, 241, 0.2)',
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
                            TERMS OF<br />
                            <span style={{
                                background: 'linear-gradient(90deg, #6366F1 0%, #8B5CF6 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}>SERVICE</span>
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
                            ข้อตกลงและเงื่อนไขในการใช้บริการของ SET EVENT Thailand เพื่อความเข้าใจที่ตรงกันระหว่างเราและลูกค้า
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
                            ปรับปรุงล่าสุดเมื่อวันที่ 15 มกราคม 2569
                        </Typography>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
}
