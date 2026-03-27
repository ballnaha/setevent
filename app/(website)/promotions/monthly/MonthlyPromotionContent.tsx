"use client";

import React, { useMemo } from "react";
import {
    Box,
    Container,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Stack,
    Chip,
    Divider
} from "@mui/material";
import Breadcrumbs from "@/app/components/Breadcrumbs";
import { Monitor, ArrowRight2, Ticket, Calculator, MagicStar } from "iconsax-react";
import Link from "next/link";

const pricelistData = [
    { ph: "PH 2.6 Normal", type: "Indoor", p1: "2,500 บาท", p2: "2,300 บาท", p3: "2,200 บาท" },
    { ph: "PH 2.6 Curve", type: "Indoor", p1: "3,000 บาท", p2: "2,750 บาท", p3: "2,500 บาท" },
    { ph: "PH 3.9", type: "Indoor", p1: "2,200 บาท", p2: "2,000 บาท", p3: "1,750 บาท" },
    { ph: "PH 3.9", type: "Outdoor", p1: "3,000 บาท", p2: "2,700 บาท", p3: "2,500 บาท" },
    { ph: "PH 4.8 Floor", type: "Floor", p1: "3,500 บาท", p2: "3,200 บาท", p3: "3,000 บาท" },
    { ph: "Transparent (จอใส)", type: "Indoor", p1: "3,500 บาท", p2: "3,500 บาท", p3: "3,500 บาท" },
];

export default function MonthlyPromotionContent() {
    const currentMonth = useMemo(() => {
        return new Intl.DateTimeFormat('th-TH', { month: 'long' }).format(new Date());
    }, []);

    const currentYear = useMemo(() => {
        return new Date().getFullYear() + 543; // Buddhist year
    }, []);

    return (
        <Box sx={{ bgcolor: "var(--background)", minHeight: "100vh", pb: 10, overflow: 'hidden', position: 'relative' }}>
            {/* SEO Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "BreadcrumbList",
                        "itemListElement": [
                            {
                                "@type": "ListItem",
                                "position": 1,
                                "name": "หน้าหลัก",
                                "item": "https://seteventthailand.com/"
                            },
                            {
                                "@type": "ListItem",
                                "position": 2,
                                "name": "โปรโมชั่น",
                                "item": "https://seteventthailand.com/promotions"
                            },
                            {
                                "@type": "ListItem",
                                "position": 3,
                                "name": "โปรโมชั่นประจำเดือน",
                                "item": "https://seteventthailand.com/promotions/monthly"
                            }
                        ]
                    })
                }}
            />

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "FAQPage",
                        "mainEntity": [
                            {
                                "@type": "Question",
                                "name": "ราคาเช่าจอ LED ประจำเดือนนี้คุ้มค่าอย่างไร?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "โปรโมชั่นเช่าจอ LED ประจำเดือนนี้ราคาเริ่มต้นเพียง 1,750 - 3,500 บาทต่อตารางเมตร ขึ้นอยู่กับความละเอียดของจอ (PH) และขนาดพื้นที่ติดตั้ง รวมทีมงานติดตั้งและควบคุมมืออาชีพ"
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "แพ็คเกจงานแต่งงานและอีเวนต์ครอบคลุมอะไรบ้าง?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "เรามีแพ็คเกจเริ่มต้นที่ 20,000 บาท ครอบคลุมจอ LED ขนาด 2x4 เมตร พร้อมทีมงาน และแพ็คเกจระดับลักชัวรี่ 60,000 บาท ที่รวมระบบแสง สี เสียง ครบวงจร"
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "มีค่าใช้จ่ายในการขอใบเสนอราคาหรือไม่?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "ไม่มีค่าใช้จ่ายครับ SETEVENT ให้บริการปรึกษาและประเมินราคาฟรี 24 ชั่วโมง พร้อมส่งใบเสนอราคาอย่างรวดเร็วเพื่อให้ท่านนำไปประกอบการตัดสินใจ"
                                }
                            }
                        ]
                    })
                }}
            />

            {/* Dynamic Background Elements */}
            <Box sx={{ position: 'absolute', top: '5%', right: '-5%', width: '500px', height: '500px', background: 'radial-gradient(circle, var(--decor-ruby) 0%, rgba(233, 69, 96, 0) 70%)', filter: 'blur(80px)', zIndex: 0 }} />
            <Box sx={{ position: 'absolute', bottom: '15%', left: '-5%', width: '400px', height: '400px', background: 'radial-gradient(circle, var(--decor-cyan) 0%, rgba(139, 92, 246, 0) 70%)', filter: 'blur(80px)', zIndex: 0 }} />

            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, pt: { xs: 15, md: 22 } }}>

                {/* Breadcrumbs */}
                <Breadcrumbs 
                    center 
                    items={[
                        { label: 'โปรโมชั่น (Promotions)', href: '/promotions' },
                        { label: 'โปรโมชั่นประจำเดือน (Monthly Promotion)' }
                    ]} 
                />

                {/* Hero Header */}
                <Stack spacing={3} alignItems="center" textAlign="center" sx={{ mb: 8 }}>
                    <Chip
                        icon={<Ticket size="18" variant="Bold" color="currentColor" />}
                        label="โปรโมชั่นอัปเดตใหม่ล่าสุด"
                        sx={{
                            bgcolor: 'var(--decor-ruby)',
                            color: 'var(--secondary)',
                            border: '1px solid var(--border-color)',
                            fontFamily: 'var(--font-prompt)',
                            fontWeight: 600,
                            pr: 1
                        }}
                    />
                    <Typography
                        component="h1"
                        sx={{
                            fontFamily: 'var(--font-prompt)',
                            fontWeight: 800,
                            fontSize: { xs: '2.2rem', md: '3.8rem' },
                            color: 'var(--foreground)',
                            lineHeight: 1.2,
                            textTransform: 'uppercase'
                        }}
                    >
                        PROMOTION<br />
                        <span style={{ background: 'linear-gradient(90deg, var(--secondary) 0%, var(--tertiary) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            ประจำเดือน{currentMonth} {currentYear}
                        </span>
                    </Typography>
                    <Typography sx={{ fontFamily: 'var(--font-prompt)', color: 'var(--foreground)', opacity: 0.8, fontSize: { xs: '1rem', md: '1.1rem' }, maxWidth: 800, lineHeight: 1.8 }}>
                        รวมโปรโมชั่นและแพ็คเกจสุดคุ้มประจำเดือนจาก SETEVENT ครบจบในที่เดียว
                        ทั้งงานเช่าจอ LED คมชัดสูง, แพ็คเกจเครื่องเสียงแสงสี และโปรโมชั่นงานแต่งงานสุดพิเศษ
                        เลือกข้อเสนอที่ใช่สำหรับอีเวนต์ของคุณได้ที่นี่
                    </Typography>
                </Stack>

                {/* Data Table Section */}
                <Paper
                    elevation={0}
                    sx={{
                        borderRadius: 4,
                        overflow: 'hidden',
                        border: '1px solid var(--border-color)',
                        bgcolor: 'var(--card-bg)',
                        backdropFilter: 'blur(20px)',
                        boxShadow: 'var(--card-shadow)'
                    }}
                >
                    <Box sx={{ p: 4, display: 'flex', alignItems: 'center', gap: 2, bgcolor: 'var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
                        <Monitor size="32" variant="Bulk" color="var(--primary)" />
                        <Box>
                            <Typography variant="h5" sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 700, color: 'var(--foreground)' }}>
                                1. โปรโมชั่นเช่าจอ LED Screen
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'var(--foreground)', opacity: 0.6, fontFamily: 'var(--font-prompt)' }}>
                                *ราคาต่อตารางเมตร (Price per sq.m.)
                            </Typography>
                        </Box>
                    </Box>

                    <TableContainer>
                        <Table sx={{ minWidth: 650 }}>
                            <TableHead>
                                <TableRow sx={{ bgcolor: 'var(--decor-emerald)' }}>
                                    <TableCell sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 700, p: 3, borderBottom: '1px solid var(--border-color)', color: 'var(--foreground)' }}>PH</TableCell>
                                    <TableCell sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 700, borderBottom: '1px solid var(--border-color)', color: 'var(--foreground)' }}>ประเภท</TableCell>
                                    <TableCell sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 700, borderBottom: '1px solid var(--border-color)', color: 'var(--foreground)' }} align="center">1-20 ตร.ม.</TableCell>
                                    <TableCell sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 700, borderBottom: '1px solid var(--border-color)', color: 'var(--foreground)' }} align="center">21-49 ตร.ม.</TableCell>
                                    <TableCell sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 700, borderBottom: '1px solid var(--border-color)', color: 'var(--foreground)' }} align="center">50 ตร.ม. ขึ้นไป</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {pricelistData.map((row, index) => (
                                    <TableRow
                                        key={index}
                                        sx={{
                                            '&:last-child td, &:last-child th': { border: 0 },
                                            '&:hover': { bgcolor: 'var(--border-color)' },
                                            transition: 'background-color 0.2s'
                                        }}
                                    >
                                        <TableCell component="th" scope="row" sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 600, p: 2.5, color: 'var(--foreground)', borderBottom: '1px solid var(--border-color)' }}>
                                            {row.ph}
                                        </TableCell>
                                        <TableCell sx={{ fontFamily: 'var(--font-prompt)', borderBottom: '1px solid var(--border-color)' }}>
                                            <Chip
                                                label={row.type}
                                                size="small"
                                                sx={{
                                                    borderRadius: 1,
                                                    fontWeight: 600,
                                                    fontFamily: 'var(--font-prompt)',
                                                    bgcolor: row.type === 'Outdoor' ? 'rgba(var(--tertiary-rgb, 245, 158, 11), 0.1)' : 'var(--decor-emerald)',
                                                    color: row.type === 'Outdoor' ? 'var(--tertiary)' : 'var(--primary)'
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 700, color: 'var(--foreground)', borderBottom: '1px solid var(--border-color)' }} align="center">
                                            {row.p1}
                                        </TableCell>
                                        <TableCell sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 700, color: 'var(--foreground)', borderBottom: '1px solid var(--border-color)' }} align="center">
                                            {row.p2}
                                        </TableCell>
                                        <TableCell sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 700, color: 'var(--primary)', borderBottom: '1px solid var(--border-color)' }} align="center">
                                            {row.p3}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Box sx={{ p: 4, bgcolor: 'var(--border-color)', borderTop: '1px solid var(--border-color)', opacity: 0.8 }}>
                        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="space-between" alignItems="center">
                            <Typography sx={{ fontFamily: 'var(--font-prompt)', fontSize: '0.9rem', color: 'var(--foreground)', opacity: 0.8 }}>
                                💡 สนใจจองคิวงานหรือสอบถามราคาพิเศษสำหรับจำนวนมาก ติดต่อเราได้ทันที
                            </Typography>
                            <Link href="/contact" style={{ textDecoration: 'none' }}>
                                <Chip
                                    label="สอบถามข้อมูลเพิ่มเติม"
                                    sx={{
                                        px: 2,
                                        bgcolor: 'var(--primary)',
                                        color: 'white',
                                        fontWeight: 600,
                                        fontFamily: 'var(--font-prompt)',
                                        cursor: 'pointer',
                                        '&:hover': { opacity: 0.9 }
                                    }}
                                />
                            </Link>
                        </Stack>
                    </Box>
                </Paper>

                {/* Wedding & Event Section */}
                <Box sx={{ mt: 10 }}>
                    <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4 }}>
                        <Ticket size="32" variant="Bulk" color="var(--primary)" />
                        <Typography variant="h5" sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 700, color: 'var(--foreground)' }}>
                            2. แพ็คเกจงานแต่งและอีเวนต์ (Wedding & Event)
                        </Typography>
                    </Stack>

                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4 }}>
                        {[
                            {
                                title: "Wedding Package",
                                price: "เริ่มต้น 20,000.-",
                                features: ["จอ LED ขนาด 2x4 เมตร", "ทีมงานติดตั้งและควบคุม"],
                                highlight: false,
                                icon: <Monitor size="24" variant="Bulk" color="var(--primary)" />
                            },
                            {
                                title: "Luxury Wedding Package",
                                price: "60,000.-",
                                features: ["จอ LED ขนาด 2x4 เมตร", "Full Lighting System", "Professional Sound System", "ทีมงาน Support ครบชุดตลอดงาน"],
                                highlight: true,
                                icon: <MagicStar size="24" variant="Bulk" color="var(--primary)" />
                            }
                        ].map((pkg, i) => (
                            <Paper
                                key={i}
                                elevation={0}
                                sx={{
                                    p: 4,
                                    borderRadius: 4,
                                    border: pkg.highlight ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                                    bgcolor: pkg.highlight ? 'var(--decor-ruby)' : 'var(--card-bg)',
                                    position: 'relative',
                                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-5px)',
                                        boxShadow: '0 15px 30px rgba(0,0,0,0.1)'
                                    }
                                }}
                            >
                                {pkg.highlight && (
                                    <Chip
                                        label="LUXURY"
                                        size="small"
                                        sx={{ position: 'absolute', top: 20, right: 20, bgcolor: 'var(--primary)', color: 'white', fontWeight: 800 }}
                                    />
                                )}
                                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                                    <Box sx={{ p: 1, borderRadius: 1.5, bgcolor: 'var(--decor-ruby)', color: 'var(--secondary)', display: 'flex' }}>
                                        {pkg.icon}
                                    </Box>
                                    <Typography variant="h5" sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 800, color: 'var(--foreground)' }}>{pkg.title}</Typography>
                                </Stack>
                                <Typography variant="h4" sx={{ fontFamily: 'var(--font-prompt)', color: 'var(--primary)', fontWeight: 800, mb: 3 }}>
                                    {pkg.price}
                                </Typography>
                                <Stack spacing={1.5} sx={{ mb: 4 }}>
                                    {pkg.features.map((f, idx) => (
                                        <Stack key={idx} direction="row" spacing={1.5} alignItems="center">
                                            <ArrowRight2 size="16" color="var(--primary)" />
                                            <Typography sx={{ fontFamily: 'var(--font-prompt)', fontSize: '0.95rem', color: 'var(--foreground)', opacity: 0.8 }}>{f}</Typography>
                                        </Stack>
                                    ))}
                                </Stack>
                                <Divider sx={{ mb: 3, opacity: 0.1, borderColor: 'var(--border-color)' }} />
                                <Link href="/contact" style={{ textDecoration: 'none' }}>
                                    <Typography sx={{ fontFamily: 'var(--font-prompt)', color: 'var(--primary)', fontWeight: 700, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: 1, '&:hover': { gap: 1.5, transition: 'all 0.2s' } }}>
                                        จองแพ็คเกจนี้ หรือสอบถามข้อมูล <ArrowRight2 size="16" />
                                    </Typography>
                                </Link>
                            </Paper>
                        ))}
                    </Box>
                </Box>

                {/* Additional Info Cards */}
                <Box sx={{ mt: 10, display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 3 }}>
                    {[
                        { icon: <Monitor size="32" color="var(--primary)" />, title: "คุณภาพคมชัด", desc: "จอ LED เทคโนโลยีใหม่ล่าสุด รองรับความละเอียดสูง คมชัดทุกมุมมอง" },
                        { icon: <Calculator size="32" color="var(--primary)" />, title: "ประเมินราคาฟรี", desc: "ไม่มีค่ามัดจำล่วงหน้าสำหรับใบเสนอราคา ปรึกษาฟรี 24 ชม." },
                        { icon: <Ticket size="32" color="var(--primary)" />, title: "ทีมงานติดตั้งมืออาชีพ", desc: "ควบคุมงานโดยวิศวกรผู้เชี่ยวชาญ พร้อมแสตนด์บายตลอดระยะเวลางาน" }
                    ].map((item, i) => (
                        <Paper key={i} elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid var(--border-color)', bgcolor: 'var(--card-bg)', backdropFilter: 'blur(10px)' }}>
                            <Box sx={{ mb: 2 }}>{item.icon}</Box>
                            <Typography variant="h6" sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 700, mb: 1.5, color: 'var(--foreground)' }}>{item.title}</Typography>
                            <Typography variant="body2" sx={{ fontFamily: 'var(--font-prompt)', color: 'var(--foreground)', opacity: 0.8, lineHeight: 1.6 }}>{item.desc}</Typography>
                        </Paper>
                    ))}
                </Box>
            </Container>
        </Box>
    );
}
