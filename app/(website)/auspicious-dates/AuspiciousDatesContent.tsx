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
                                ฤกษ์แต่งงาน
                            </span>
                        </Typography>
                        <Typography
                            component="h2"
                            sx={{
                                fontFamily: 'var(--font-prompt)',
                                color: 'var(--foreground)',
                                opacity: 0.8,
                                fontSize: { xs: '1rem', md: '1.2rem' },
                                maxWidth: 700,
                                lineHeight: 1.8,
                                mx: 'auto'
                            }}
                        >
                            ค้นหา <strong>ฤกษ์มงคลสมรส</strong> ที่เหมาะสมที่สุดสำหรับคุณ วิเคราะห์ตาม <strong>หลักโหราศาสตร์</strong> ที่แม่นยำ เพื่อ <strong>เริ่มต้นชีวิตคู่</strong> ด้วยความสิริมงคลและความเจริญรุ่งเรือง
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

            {/* SEO Content Section with Transition Words */}
            <Container maxWidth="lg">
                <Box sx={{
                    p: { xs: 4, md: 6 },
                    borderRadius: 4,
                    bgcolor: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(212, 175, 55, 0.1)',
                    backdropFilter: 'blur(10px)',
                    mb: 10
                }}>
                    <Typography variant="h4" sx={{ mb: 3, fontWeight: 700, fontFamily: 'var(--font-prompt)', color: '#D4AF37' }}>
                        ความสำคัญของการเลือกฤกษ์แต่งงาน
                    </Typography>

                    <Typography sx={{ mb: 3, lineHeight: 2, opacity: 0.9, fontFamily: 'var(--font-prompt)' }}>
                        การเลือก <strong>ฤกษ์แต่งงาน</strong> ถือเป็นจุดเริ่มต้นที่สำคัญที่สุดสำหรับการใช้ชีวิตคู่ เพราะว่า ตามหลักความเชื่อของไทย การเริ่มต้นในวันและเวลาที่เป็นมงคลจะช่วยส่งเสริมความรัก ความมั่นคง และความเจริญรุ่งเรืองในชีวิตครอบครัว นอกจากนี้ การคำนวณ <strong>ฤกษ์มงคลสมรส</strong> ที่แม่นยำยังต้องพิจารณาจากพื้นดวงชะตาของทั้งเจ้าบ่าวและเจ้าสาวประกอบกัน เพื่อให้ มั่นใจว่าวันดังกล่าวเป็นวันที่ส่งเสริมดวงชะตาของทั้งคู่ได้อย่างดีที่สุด
                    </Typography>

                    <Typography sx={{ mb: 3, lineHeight: 2, opacity: 0.9, fontFamily: 'var(--font-prompt)' }}>
                        อย่างไรก็ตาม การหา <strong>ฤกษ์ดีแต่งงาน</strong> นั้นไม่ได้มีเพียงแค่วันที่สะดวกเท่านั้น แต่ยังรวมถึง การพิจารณา "เวลาดี" หรือ <strong>ยามมงคล</strong> ในการเริ่มต้นพิธีการต่างๆ ตัวอย่างเช่น เวลาแห่ขันหมาก เวลาสวมแหวน หรือเวลาส่งตัวเข้าหอ ดังนั้น การปรึกษาผู้เชี่ยวชาญด้าน <strong>โหราศาสตร์</strong> จึงเป็นทางเลือกที่ดีที่จะช่วยให้คุณเตรียมการทุกอย่างได้อย่างมั่นใจและสมบูรณ์แบบ
                    </Typography>

                    <Typography sx={{ lineHeight: 2, opacity: 0.9, fontFamily: 'var(--font-prompt)' }}>
                        สรุปสุดท้าย การเลือก <strong>ฤกษ์งามยามดี</strong> ที่ <strong>SET EVENT</strong> พรีเซนต์ให้นั้น เป็นการนำ <strong>หลักโหราศาสตร์</strong> มาประยุกต์ใช้ร่วมกับไลฟ์สไตล์ปัจจุบัน ส่งผลให้ คุณได้วันจัดงานที่ไม่เพียงแต่เป็นมงคล แต่ยังเป็น วันที่เหมาะสมกับการเชิญแขกและ <strong>จัดงานแต่งงานในฝัน</strong> ของคุณอีกด้วย
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
}
