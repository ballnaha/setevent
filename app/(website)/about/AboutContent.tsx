"use client";

import React, { useState, useEffect } from "react";
import { Box, Container, Typography, Stack, Button, Skeleton, Chip, Grid } from "@mui/material";
import { ArrowRight, MagicStar, StatusUp, People, Award } from "iconsax-react";
import Link from "next/link";
import Image from "next/image";

export default function AboutContent() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const values = [
        {
            icon: <MagicStar size="32" variant="Bulk" color="var(--primary)" />,
            title: "Event Organizing",
            desc: "บริการรับจัดงานอีเวนต์ครบวงจร ตั้งแต่การวางกลยุทธ์ ออกแบบธีมงาน ไปจนถึงการรันคิวอย่างราบรื่น"
        },
        {
            icon: <StatusUp size="32" variant="Bulk" color="var(--primary)" />,
            title: "Wedding & Party",
            desc: "เนรมิตงานแต่งงานและงานเลี้ยงสังสรรค์ในฝันของคุณให้เป็นจริง ด้วยทีมงานมืออาชีพที่ใส่ใจทุกรายละเอียด"
        },
        {
            icon: <People size="32" variant="Bulk" color="var(--primary)" />,
            title: "Corporate Seminar",
            desc: "จัดการงานสัมมนา ประชุมวิชาการ และเวิร์กชอปธุรกิจ ด้วยระบบภาพและเสียงที่ได้มาตรฐานระดับสากล"
        },
        {
            icon: <Award size="32" variant="Bulk" color="var(--primary)" />,
            title: "Production Excellence",
            desc: "สนับสนุนด้วยจอ LED คุณภาพสูง ระบบแสง สี เสียง และโครงสร้างเวทีที่ล้ำสมัยที่สุด"
        }
    ];

    if (!mounted) {
        return <Box sx={{ minHeight: '100vh', bgcolor: 'var(--background)' }} />;
    }

    return (
        <Box sx={{ bgcolor: 'var(--background)', minHeight: '100vh', overflow: 'hidden', pb: 10 }}>
            {/* Hero Section */}
            <Box sx={{
                pt: { xs: 15, md: 22 },
                pb: { xs: 8, md: 12 },
                position: 'relative',
                bgcolor: 'var(--background)'
            }}>
                {/* Background Decor */}
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

                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                    <Stack spacing={3} alignItems="center">
                        <Chip
                            label="Our Expertise"
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
                                letterSpacing: '-1px'
                            }}
                        >
                            ABOUT<br />
                            <span style={{
                                background: 'linear-gradient(90deg, #10B981 0%, #0A5C5A 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}>US</span>
                        </Typography>
                        <Typography
                            sx={{
                                fontFamily: 'var(--font-prompt)',
                                color: 'var(--foreground)',
                                opacity: 0.7,
                                fontSize: { xs: '1rem', md: '1.2rem' },
                                maxWidth: 800,
                                lineHeight: 1.8
                            }}
                        >
                            SET EVENT Thailand - เราคือคู่คิดในการสร้างสรรค์ประสบการณ์ที่เหนือระดับ
                            ด้วยบริการรับจัดงานอีเวนต์ครบวงจร ครอบคลุมตั้งแต่งานแต่งงาน งานสัมมนา และงาน Production
                            ที่มาพร้อมกับเทคโนโลยีล้ำสมัยเพื่อความสำเร็จของทุกโปรเจกต์
                        </Typography>
                    </Stack>
                </Container>
            </Box>

            {/* Content Section */}
            <Container maxWidth="lg">
                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                    gap: 8,
                    alignItems: 'center'
                }}>
                    <Box sx={{ position: 'relative' }}>
                        <Box sx={{
                            position: 'relative',
                            borderRadius: '30px',
                            overflow: 'hidden',
                            boxShadow: 'var(--card-shadow)',
                            aspectRatio: '4/5',
                            bgcolor: 'var(--card-bg)',
                            border: '1px solid var(--border-color)'
                        }}>
                            <Image
                                src="/images/about-us1.webp"
                                alt="SET EVENT Thailand Team"
                                fill
                                style={{ objectFit: 'cover' }}
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                            <Box sx={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                height: '50%',
                                background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                                display: 'flex',
                                alignItems: 'flex-end',
                                p: 4
                            }}>
                                <Box>
                                    <Typography sx={{ color: 'white', fontWeight: 900, fontSize: '2rem', lineHeight: 1 }}>10+</Typography>
                                    <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', textTransform: 'uppercase' }}>Years of Experience</Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Box>

                    <Stack spacing={4}>
                        <Box>
                            <Typography sx={{ color: 'var(--primary)', fontWeight: 700, letterSpacing: 2, mb: 1 }}>OUR SERVICES & STORY</Typography>
                            <Typography variant="h3" sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 800, mb: 3, color: 'var(--foreground)' }}>ผู้ช่วยมือโปรสำหรับ<br />ทุกโอกาสสำคัญของคุณ</Typography>
                            <Typography sx={{ color: 'var(--foreground)', opacity: 0.8, lineHeight: 1.8, fontSize: '1.1rem', fontFamily: 'var(--font-prompt)' }}>
                                จากจุดเริ่มต้นในการเป็นผู้เชี่ยวชาญด้าน Production เราได้เติบโตสู่การเป็นผู้ให้บริการจัดงานอีเวนต์แบบเต็มรูปแบบ
                                ไม่ว่าจะเป็นงานแต่งงานที่ต้องการความละเอียดอ่อน งานสัมมนาที่ต้องการความเป็นมืออาชีพ
                                หรืองานอีเวนต์ระดับประเทศ เราพร้อมดูแลคุณในทุกย่างก้าว
                            </Typography>
                        </Box>

                        <Stack spacing={3}>
                            {values.map((val, idx) => (
                                <Stack key={idx} direction="row" spacing={2.5}>
                                    <Box sx={{
                                        width: 56,
                                        height: 56,
                                        borderRadius: '16px',
                                        bgcolor: 'var(--card-bg)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0,
                                        border: '1px solid var(--border-color)',
                                        boxShadow: 'var(--card-shadow)'
                                    }}>
                                        {val.icon}
                                    </Box>
                                    <Box>
                                        <Typography sx={{ fontWeight: 700, fontSize: '1.1rem', mb: 0.5, color: 'var(--foreground)' }}>{val.title}</Typography>
                                        <Typography variant="body2" sx={{ color: 'var(--foreground)', opacity: 0.7, lineHeight: 1.6 }}>{val.desc}</Typography>
                                    </Box>
                                </Stack>
                            ))}
                        </Stack>
                    </Stack>
                </Box>

                {/* Vision & Mission Section */}
                <Box sx={{ mt: { xs: 10, md: 20 } }}>
                    <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                        gap: 4
                    }}>
                        <Box sx={{
                            p: { xs: 4, md: 6 },
                            height: '100%',
                            borderRadius: '40px',
                            bgcolor: 'var(--decor-emerald)',
                            border: '1px solid var(--border-color)',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            <Typography variant="h4" sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 800, mb: 3, color: 'var(--foreground)' }}>วิสัยทัศน์ (Vision)</Typography>
                            <Typography sx={{ fontSize: '1.25rem', lineHeight: 1.8, color: 'var(--foreground)', opacity: 0.9, fontWeight: 500 }}>
                                "มุ่งมั่นเป็นผู้เนรมิตประสบการณ์อีเวนต์ที่สมบูรณ์แบบ ผ่านการผสานความคิดสร้างสรรค์อันไร้ขีดจำกัด เข้ากับเทคโนโลยีโปรดักชั่นระดับสากล เพื่อส่งมอบความสำเร็จที่น่าจดจำและทรงคุณค่าให้กับลูกค้าทุกระดับ"
                            </Typography>
                        </Box>
                        <Box sx={{
                            p: { xs: 4, md: 6 },
                            height: '100%',
                            borderRadius: '40px',
                            bgcolor: 'var(--card-bg)',
                            border: '1px solid var(--border-color)',
                            boxShadow: 'var(--card-shadow)'
                        }}>
                            <Typography variant="h4" sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 800, mb: 3, color: 'var(--foreground)' }}>พันธกิจ (Mission)</Typography>
                            <Stack spacing={2.5}>
                                {[
                                    "มอบโซลูชันการจัดอีเวนต์และโปรดักชั่นแบบครบวงจร (One-Stop Service) ที่มีคุณภาพระดับสากล",
                                    "ขับเคลื่อนทุกผลงานด้วยความคิดสร้างสรรค์ที่แปลกใหม่และเทคโนโลยีล้ำสมัย",
                                    "ยกระดับการบริการด้วยทีมงานมืออาชีพที่เป็นคู่คิดและพร้อมเคียงข้างลูกค้าในทุกขั้นตอน",
                                    "สร้างมาตรฐานใหม่ในอุตสาหกรรมอีเวนต์ไทย ด้วยความซื่อสัตย์ ความประณีต และความรับผิดชอบที่เป็นเลิศ"
                                ].map((text, i) => (
                                    <Stack key={i} direction="row" spacing={2} alignItems="flex-start">
                                        <Box sx={{
                                            width: 24,
                                            height: 24,
                                            borderRadius: '50%',
                                            bgcolor: 'var(--primary)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexShrink: 0,
                                            mt: 0.5
                                        }}>
                                            <Typography sx={{ color: 'white', fontSize: '0.75rem', fontWeight: 'bold' }}>{i + 1}</Typography>
                                        </Box>
                                        <Typography sx={{ color: 'var(--foreground)', opacity: 0.8, lineHeight: 1.6 }}>{text}</Typography>
                                    </Stack>
                                ))}
                            </Stack>
                        </Box>
                    </Box>
                </Box>

                {/* Core Values Section */}
                <Box sx={{ mt: { xs: 10, md: 15 } }}>
                    <Box sx={{ textAlign: 'center', mb: 6 }}>
                        <Typography variant="overline" sx={{ color: 'var(--primary)', fontWeight: 700, letterSpacing: 3, fontFamily: 'var(--font-prompt)' }}>CORE VALUES</Typography>
                        <Typography variant="h3" sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 800, color: 'var(--foreground)', mt: 1 }}>หัวใจสำคัญในการบริการ</Typography>
                    </Box>
                    <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' },
                        gap: 3
                    }}>
                        {[
                            { icon: <MagicStar size="40" variant="Bulk" color="var(--primary)" />, title: "Creativity", desc: "สร้างสรรค์ไอเดียที่แปลกใหม่และแตกต่างในทุกผลงาน" },
                            { icon: <StatusUp size="40" variant="Bulk" color="var(--primary)" />, title: "Quality", desc: "รักษามาตรฐานโปรดักชั่นระดับสากลด้วยอุปกรณ์ที่ทันสมัย" },
                            { icon: <Award size="40" variant="Bulk" color="var(--primary)" />, title: "Reliability", desc: "เชื่อใจได้ด้วยความตรงต่อเวลาและการจัดการแบบมืออาชีพ" },
                            { icon: <People size="40" variant="Bulk" color="var(--primary)" />, title: "Service", desc: "ดูแลด้วยใจและเป็นคู่คิดให้กับลูกค้าในทุกขั้นตอนสำคัญ" }
                        ].map((item, i) => (
                            <Box key={i} sx={{
                                p: 4,
                                textAlign: 'center',
                                bgcolor: 'var(--card-bg)',
                                borderRadius: '30px',
                                border: '1px solid var(--border-color)',
                                boxShadow: 'var(--card-shadow)',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-10px)',
                                    borderColor: 'var(--primary)',
                                    bgcolor: 'rgba(10, 92, 90, 0.02)'
                                }
                            }}>
                                <Box sx={{ mb: 2, display: 'inline-flex' }}>{item.icon}</Box>
                                <Typography sx={{ fontWeight: 800, fontSize: '1.25rem', mb: 1, color: 'var(--foreground)', fontFamily: 'var(--font-prompt)' }}>{item.title}</Typography>
                                <Typography variant="body2" sx={{ color: 'var(--foreground)', opacity: 0.7, lineHeight: 1.6, fontFamily: 'var(--font-prompt)' }}>{item.desc}</Typography>
                            </Box>
                        ))}
                    </Box>
                </Box>

                {/* Final Call to Action */}
                <Box sx={{
                    mt: { xs: 8, md: 10 },
                    p: { xs: 4, md: 6 },
                    textAlign: 'center',
                    borderRadius: '30px',
                    background: 'linear-gradient(135deg, rgba(10, 92, 90, 0.05) 0%, rgba(10, 92, 90, 0.1) 100%)',
                }}>
                    <Typography variant="h5" sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 700, mb: 3, color: 'var(--foreground)' }}>
                        ให้ SET EVENT Thailand ร่วมเป็นส่วนหนึ่งในความสำเร็จของคุณ
                    </Typography>
                    <Button
                        component={Link}
                        href="/contact"
                        variant="contained"
                        endIcon={<ArrowRight />}
                        sx={{
                            bgcolor: 'var(--primary)',
                            color: 'white',
                            px: 5,
                            py: 2,
                            borderRadius: '50px',
                            fontSize: '1rem',
                            fontWeight: 700,
                            boxShadow: 'var(--primary-glow)',
                            '&:hover': { bgcolor: 'var(--primary)', opacity: 0.9, boxShadow: 'var(--primary-glow)' }
                        }}
                    >
                        เริ่มต้นโครงการของคุณ
                    </Button>
                </Box>
            </Container>
        </Box>
    );
}
