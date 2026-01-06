"use client";

import React from "react";
import { Box, Container, Stack, Typography } from "@mui/material";
import { Medal } from "iconsax-react";
import Image from "next/image";

export default function WhyChooseUs() {
    return (
        <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: "var(--background)" }}>
            <Container maxWidth="lg">
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 6, md: 8 }} alignItems="center">
                    <Box sx={{ flex: 1 }}>
                        <Box sx={{
                            height: { xs: '300px', sm: '400px', md: '500px' },
                            width: '100%',
                            borderRadius: 4,
                            overflow: 'hidden',
                            position: 'relative',
                        }}>
                            <Image
                                src="/images/mobileapp.png"
                                alt="Event Management Mockup"
                                fill
                                style={{ objectFit: 'cover' }}
                            />

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
