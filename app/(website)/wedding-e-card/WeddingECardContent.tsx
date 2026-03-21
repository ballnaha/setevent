"use client";

import React from "react";
import { Box, Container, Typography, Chip, Stack, Button } from "@mui/material";
import { Gallery, ArrowCircleRight, Notification as NotificationIcon, MagicStar } from "iconsax-react";
import Image from "next/image";

export default function WeddingECardContent() {
    return (
        <Box sx={{ bgcolor: 'var(--background)', minHeight: '100vh', pb: 10, overflow: 'hidden' }}>
            {/* Header Section */}
            <Box sx={{
                pt: { xs: 15, md: 22 },
                pb: { xs: 8, md: 10 },
                position: 'relative',
            }}>
                {/* Background Decor - Pink/Gold theme for Wedding */}
                <Box sx={{
                    position: 'absolute',
                    top: '-20%',
                    right: '-10%',
                    width: '600px',
                    height: '600px',
                    background: 'radial-gradient(circle, rgba(255, 182, 193, 0.15) 0%, rgba(255, 182, 193, 0) 70%)',
                    '.dark &': {
                        background: 'radial-gradient(circle, rgba(255, 105, 180, 0.08) 0%, rgba(255, 105, 180, 0) 70%)'
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
                    background: 'radial-gradient(circle, rgba(212, 175, 55, 0.1) 0%, rgba(212, 175, 55, 0) 70%)',
                    '.dark &': {
                        background: 'radial-gradient(circle, rgba(212, 175, 55, 0.05) 0%, rgba(212, 175, 55, 0) 70%)'
                    },
                    filter: 'blur(60px)',
                    zIndex: 0
                }} />

                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                    <Stack spacing={3} alignItems="center">
                        <Chip
                            label="Wedding Experience"
                            sx={{
                                bgcolor: 'rgba(255, 105, 180, 0.1)',
                                color: '#FF69B4',
                                border: '1px solid rgba(255, 105, 180, 0.2)',
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
                            WEDDING <br />
                            <span style={{
                                background: 'linear-gradient(90deg, #FF69B4 0%, #D4AF37 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}>
                                ONLINE CARD
                            </span>
                        </Typography>
                        <Typography
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
                            ยกระดับงานแต่งงานของคุณด้วยการ์ดเชิญออนไลน์รูปแบบใหม่
                            ที่มาพร้อมระบบลงทะเบียน แผนที่ และแกลเลอรี่ภาพสุดประทับใจ
                        </Typography>
                    </Stack>
                </Container>
            </Box>

            {/* Benefits & Pricing Section */}
            <Box sx={{ py: 10, bgcolor: 'var(--card-bg)', borderTop: '1px solid var(--border-color)' }}>
                <Container maxWidth="lg">
                    <Stack spacing={10}>
                        {/* Benefits Grid */}
                        <Box>
                            <Typography variant="h3" sx={{
                                fontFamily: 'var(--font-prompt)',
                                fontWeight: 800,
                                textAlign: 'center',
                                mb: 6,
                                fontSize: { xs: '2rem', md: '3rem' },
                                color: 'var(--foreground)'
                            }}>
                                ทำไมต้องมี <span style={{ color: '#FF69B4' }}>E-Card</span> งานแต่งงาน?
                            </Typography>
                            <Box sx={{
                                display: 'grid',
                                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' },
                                gap: 4
                            }}>
                                {[
                                    {
                                        title: 'ประหยัดและรวดเร็ว',
                                        desc: 'ลดค่าใช้จ่ายในการพิมพ์การ์ดกระดาษ และส่งหาแขกได้ทันทีผ่าน Social Media',
                                        icon: <Gallery size="40" color="#FF69B4" variant="Bulk" />
                                    },
                                    {
                                        title: 'จัดการแขกได้ง่าย',
                                        desc: 'มีระบบ RSVP ให้แขกลงทะเบียนตอบรับ ทำให้คุณทราบจำนวนแขกที่แน่นอน',
                                        icon: <NotificationIcon size="40" color="#FF69B4" variant="Bulk" />
                                    },
                                    {
                                        title: 'ฟังก์ชันครบครัน',
                                        desc: 'ไม่เพียงแค่บอกวันเวลา แต่ยังนำทางด้วย Maps และโชว์ภาพพรีเวดดิ้งได้',
                                        icon: <MagicStar size="40" color="#FF69B4" variant="Bulk" />
                                    }
                                ].map((benefit, idx) => (
                                    <Box key={idx} sx={{
                                        p: 4,
                                        bgcolor: 'var(--background)',
                                        borderRadius: 4,
                                        border: '1px solid var(--border-color)',
                                        boxShadow: 'var(--card-shadow)',
                                        transition: 'all 0.3s ease',
                                        '&:hover': { 
                                            transform: 'translateY(-10px)',
                                            borderColor: '#FF69B4',
                                            boxShadow: '0 10px 30px rgba(255, 105, 180, 0.1)'
                                        }
                                    }}>
                                        <Box sx={{ mb: 2 }}>{benefit.icon}</Box>
                                        <Typography variant="h6" sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 700, mb: 1.5, color: 'var(--foreground)' }}>
                                            {benefit.title}
                                        </Typography>
                                        <Typography sx={{ fontFamily: 'var(--font-prompt)', color: 'var(--foreground)', opacity: 0.7, fontSize: '0.95rem', lineHeight: 1.6 }}>
                                            {benefit.desc}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                        </Box>

                        {/* Pricing and Mobile Preview Group */}
                        <Box sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', lg: 'row' },
                            alignItems: { xs: 'center', lg: 'flex-start' },
                            gap: { xs: 8, lg: 4 }
                        }}>
                            {/* Pricing Card Section */}
                            <Box sx={{
                                flex: 1.2,
                                maxWidth: { xs: '100%', lg: 750 },
                                position: 'relative'
                            }}>
                                {/* Decorative Background */}
                                <Box sx={{
                                    position: 'absolute',
                                    inset: -2,
                                    background: 'linear-gradient(90deg, #FF69B4, #D4AF37)',
                                    borderRadius: 8,
                                    opacity: 0.3,
                                    filter: 'blur(20px)',
                                    zIndex: 0
                                }} />

                                <Box sx={{
                                    position: 'relative',
                                    zIndex: 1,
                                    bgcolor: 'var(--background)',
                                    borderRadius: 8,
                                    border: '2px solid rgba(255, 105, 180, 0.2)',
                                    overflow: 'hidden',
                                    boxShadow: 'var(--card-shadow)'
                                }}>
                                    <Box sx={{
                                        p: { xs: 4, md: 5 },
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 4
                                    }}>
                                        {/* Price Info */}
                                        <Box sx={{ textAlign: 'left' }}>
                                            <Chip 
                                                label="Best Value Package"
                                                sx={{
                                                    bgcolor: '#FF69B4',
                                                    color: 'white !important', // Force white for visibility
                                                    fontFamily: 'var(--font-prompt)',
                                                    fontWeight: 700,
                                                    mb: 2,
                                                    '& .MuiChip-label': { color: 'white' }
                                                }}
                                            />
                                            <Typography variant="h4" sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 800, mb: 1, color: 'var(--foreground)' }}>
                                                Professional <br /> Online Wedding Card
                                            </Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'baseline', mt: 3, flexWrap: 'wrap', gap: 2 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
                                                    <Typography variant="h2" sx={{
                                                        fontFamily: 'var(--font-prompt)',
                                                        fontWeight: 900,
                                                        color: '#FF69B4'
                                                    }}>
                                                        3,500
                                                    </Typography>
                                                    <Typography variant="h6" sx={{ ml: 1, fontFamily: 'var(--font-prompt)', opacity: 0.7, color: 'var(--foreground)' }}>
                                                        บาท
                                                    </Typography>
                                                </Box>

                                                <Box sx={{
                                                    px: 2,
                                                    py: 1,
                                                    borderRadius: 2,
                                                    bgcolor: 'rgba(212, 175, 55, 0.15)',
                                                    border: '1px dashed #D4AF37',
                                                    display: 'flex',
                                                    alignItems: 'center'
                                                }}>
                                                    <Typography sx={{
                                                        fontFamily: 'var(--font-prompt)',
                                                        color: '#D4AF37',
                                                        fontWeight: 700,
                                                        fontSize: '0.9rem',
                                                        textShadow: '0 0 10px rgba(212, 175, 55, 0.2)'
                                                    }}>
                                                        หรือรับสิทธิ์ใช้งาน <span style={{ color: '#FF69B4', fontSize: '1.1rem' }}>ฟรี!</span> เมื่อเช่าจอ LED กับเรา
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <Typography sx={{ mt: 2, fontFamily: 'var(--font-prompt)', opacity: 0.7, color: 'var(--foreground)' }}>
                                                ราคาเดียว จบครบทุกฟังก์ชัน <br /> ไม่มีค่าใช้จ่ายแอบแฝง
                                            </Typography>
                                        </Box>

                                        {/* Features List */}
                                        <Box>
                                            <Typography variant="h6" sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 700, mb: 3, color: 'var(--foreground)' }}>
                                                สิ่งที่จะได้รับภายในแพ็คเกจ:
                                            </Typography>
                                            <Box sx={{
                                                display: 'grid',
                                                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                                                gap: 2
                                            }}>
                                                {[
                                                    'ออกแบบการ์ดให้เค้ากับ theme งานของคุณ',
                                                    'ระบบนับถอยหลัง (Countdown Timer)',
                                                    'แกลเลอรี่รูปภาพพรีเวดดิ้ง (สูงสุด 20 รูป)',
                                                    'วิดีโอพรีเวดดิ้งของคุณ (สูงสุด 1 วิดีโอ)',
                                                    'ระบบลงทะเบียนตอบรับ (RSVP System)',
                                                    'แผนที่เดินทางเชื่อมต่อ Google Maps',
                                                    'กล่องรับของขวัญ / เลขบัญชีธนาคาร',
                                                    'ใส่เพลงประกอบพื้นหลัง (Background Music)',
                                                    'ปุ่ม Add to Calendar (Google/Apple)',
                                                    'export data ข้อมูลแขกที่ตอบรับ ไม่ต้องจดเอง',
                                                    'รองรับการใช้งานบนมือถือและคอมพิวเตอร์'
                                                ].map((feature, idx) => (
                                                    <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                        <Box sx={{
                                                            minWidth: 24,
                                                            height: 24,
                                                            borderRadius: '50%',
                                                            bgcolor: 'rgba(255, 105, 180, 0.1)',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center'
                                                        }}>
                                                            <ArrowCircleRight size="16" color="#FF69B4" variant="Bold" />
                                                        </Box>
                                                        <Typography sx={{ fontFamily: 'var(--font-prompt)', fontSize: '0.85rem', color: 'var(--foreground)' }}>
                                                            {feature}
                                                        </Typography>
                                                    </Box>
                                                ))}
                                            </Box>
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>

                            {/* Mobile Preview iPhone Mockup */}
                            <Box sx={{
                                flex: 0.8,
                                display: 'flex',
                                justifyContent: 'center',
                                position: 'relative',
                                width: '100%',
                            }}>
                                <Box sx={{
                                    position: 'relative',
                                    width: { xs: '280px', md: '320px' },
                                    height: { xs: '560px', md: '640px' },
                                    bgcolor: '#1a1a1a',
                                    borderRadius: '40px',
                                    border: '12px solid #2a2a2a',
                                    boxShadow: '0 50px 100px -20px rgba(0,0,0,0.4)',
                                    overflow: 'hidden'
                                }}>
                                    {/* iPhone Notch/Dynamic Island */}
                                    <Box sx={{
                                        position: 'absolute',
                                        top: 15,
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        width: '80px',
                                        height: '22px',
                                        bgcolor: 'black',
                                        borderRadius: '20px',
                                        zIndex: 10
                                    }} />

                                    {/* Mobile Screen Content */}
                                    <Box sx={{
                                        width: '100%',
                                        height: '100%',
                                        position: 'relative',
                                        bgcolor: '#fff',
                                        overflow: 'hidden',
                                        '.dark &': { bgcolor: '#000' }
                                    }}>
                                        {/* Auto-playing video demo of the e-card */}
                                        {/* Auto-playing video demo - Clickable Link */}
                                        <Box
                                            component="a"
                                            href="https://e-card.seteventthailand.com"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            sx={{
                                                display: 'block',
                                                width: '100%',
                                                height: '100%',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <video
                                                autoPlay
                                                loop
                                                muted
                                                playsInline
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover'
                                                }}
                                            >
                                                <source src="/images/e-card.mp4" type="video/mp4" />
                                            </video>
                                        </Box>

                                    </Box>
                                </Box>

                                {/* Background Sparkles around Mockup */}
                                <Box sx={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    width: '120%',
                                    height: '80%',
                                    background: 'radial-gradient(circle, rgba(255, 105, 180, 0.1) 0%, transparent 70%)',
                                    zIndex: -1
                                }} />
                            </Box>
                        </Box>
                    </Stack>
                </Container>
            </Box>

            {/* CTA Section */}
            <Container maxWidth="md" sx={{ mt: 10, mb: 5 }}>
                <Box sx={{
                    p: { xs: 4, md: 6 },
                    borderRadius: 6,
                    background: 'linear-gradient(135deg, rgba(255, 105, 180, 0.08) 0%, rgba(212, 175, 55, 0.08) 100%)',
                    border: '1px solid var(--border-color)',
                    textAlign: 'center',
                    backdropFilter: 'blur(10px)',
                    boxShadow: 'var(--card-shadow)'
                }}>
                    <Typography variant="h4" sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 700, mb: 2, color: 'var(--foreground)' }}>
                        สนใจสร้างการ์ดงานแต่งของคุณ?
                    </Typography>
                    <Typography sx={{ fontFamily: 'var(--font-prompt)', color: 'var(--foreground)', opacity: 0.7, mb: 4, maxWidth: 500, mx: 'auto' }}>
                        ปรึกษาทีมงานของเราเพื่อออกแบบการ์ดออนไลน์ที่โดดเด่นและเป็นเอกลักษณ์สำหรับวันสำคัญของคุณ
                    </Typography>
                    <Button
                        variant="contained"
                        component="a"
                        href="/contact"
                        sx={{
                            bgcolor: '#FF69B4',
                            color: 'white',
                            px: 4,
                            py: 1.5,
                            borderRadius: '12px',
                            fontFamily: 'var(--font-prompt)',
                            fontWeight: 600,
                            textTransform: 'none',
                            '&:hover': {
                                bgcolor: '#ff4da6',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 8px 20px rgba(255, 105, 180, 0.3)'
                            }
                        }}
                    >
                        ติดต่อสอบถามข้อมูล
                    </Button>
                </Box>
            </Container>
        </Box>
    );
}
