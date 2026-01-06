"use client";

import React from "react";
import { Box, Container, Stack, Typography } from "@mui/material";
import { Medal } from "iconsax-react";

export default function WhyChooseUs() {
    return (
        <Box sx={{ py: 12, bgcolor: "white" }}>
            <Container maxWidth="lg">
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={8} alignItems="center">
                    <Box sx={{ flex: 1 }}>
                        <Box sx={{
                            height: { xs: '300px', sm: '400px', md: '500px' },
                            width: '100%',
                            bgcolor: '#2c3e50',
                            borderRadius: 4,
                            overflow: 'hidden',
                            position: 'relative',
                            boxShadow: '0 30px 60px -15px rgba(0,0,0,0.2)',
                            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)'
                        }}>
                            {/* Decorative Elements */}
                            <Box sx={{
                                position: 'absolute',
                                top: '20%',
                                left: '10%',
                                width: '200px',
                                height: '200px',
                                borderRadius: '50%',
                                bgcolor: 'var(--primary)',
                                filter: 'blur(80px)',
                                opacity: 0.2
                            }} />

                            <Box sx={{ position: 'absolute', bottom: 30, left: 30, right: 30, p: 3, bgcolor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', borderRadius: 2, border: '1px solid rgba(255,255,255,0.2)' }}>
                                <Stack direction="row" alignItems="center" spacing={2}>
                                    <Medal size="40" color="#FFD700" variant="Bold" />
                                    <Box>
                                        <Typography variant="h6" sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 'bold', color: 'white' }}>
                                            การันตีผลงาน
                                        </Typography>
                                        <Typography variant="body2" sx={{ fontFamily: 'var(--font-prompt)', color: 'rgba(255,255,255,0.7)' }}>
                                            ได้รับความไว้วางใจจากบริษัทชั้นนำกว่า 100+ แห่ง
                                        </Typography>
                                    </Box>
                                </Stack>
                            </Box>
                        </Box>
                    </Box>

                    <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" sx={{ color: "var(--secondary)", fontFamily: "var(--font-comfortaa)", fontWeight: "bold", mb: 2, letterSpacing: 1.5 }}>
                            WHY CHOOSE US
                        </Typography>
                        <Typography variant="h3" sx={{ color: "var(--foreground)", fontFamily: "var(--font-prompt)", fontWeight: "bold", mb: 4 }}>
                            ทำไมต้องเลือก <span style={{ color: 'var(--primary)' }}>SetEvent?</span>
                        </Typography>

                        <Stack spacing={4}>
                            {[
                                { title: 'ระบบติดตามงานอัจฉริยะ', desc: 'ตรวจสอบสถานะการจัดงานและการติดตั้งอุปกรณ์ได้แบบ Real-time ผ่าน Web Application ส่วนตัวที่เราพัฒนาขึ้นเพื่อคุณ' },
                                { title: 'ทีมงานมืออาชีพ', desc: 'ประสบการณ์กว่า 10 ปี พร้อมแก้ปัญหาหน้างานได้ทันท่วงที' },
                                { title: 'ราคาที่จับต้องได้', desc: 'บริการคุณภาพระดับพรีเมียม ในราคาที่สมเหตุสมผลและคุ้มค่า' }
                            ].map((item, i) => (
                                <Box key={i} sx={{ borderLeft: '4px solid var(--primary)', pl: 3 }}>
                                    <Typography variant="h6" sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 'bold', color: 'var(--foreground)', mb: 1 }}>
                                        {item.title}
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontFamily: 'var(--font-prompt)', color: 'var(--foreground)', opacity: 0.7 }}>
                                        {item.desc}
                                    </Typography>
                                </Box>
                            ))}
                        </Stack>
                    </Box>
                </Stack>
            </Container>
        </Box>
    );
}
