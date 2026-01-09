"use client";

import Link from "next/link";
import { Box, Typography, Button, Container } from "@mui/material";
import { Home2, Information } from "iconsax-react";
import Header from "./components/Header";
import Footer from "./components/Footer";

export default function NotFound() {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#0a0a0a', color: 'white' }}>
            <Header />

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                    py: 12
                }}
            >
                {/* Background Elements */}
                <Box sx={{
                    position: 'absolute',
                    top: '20%',
                    left: '20%',
                    width: '40vw',
                    height: '40vw',
                    bgcolor: 'var(--primary)',
                    opacity: 0.05,
                    borderRadius: '50%',
                    filter: 'blur(100px)',
                    animation: 'float 10s ease-in-out infinite',
                    zIndex: 0
                }} />
                <Box sx={{
                    position: 'absolute',
                    bottom: '10%',
                    right: '10%',
                    width: '30vw',
                    height: '30vw',
                    bgcolor: 'var(--secondary)',
                    opacity: 0.03,
                    borderRadius: '50%',
                    filter: 'blur(100px)',
                    animation: 'float 8s ease-in-out infinite reverse',
                    zIndex: 0
                }} />

                <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>

                    <Typography
                        variant="h1"
                        sx={{
                            fontSize: { xs: '8rem', md: '12rem' },
                            fontWeight: 900,
                            fontFamily: 'var(--font-prompt)',
                            background: 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.1) 100%)',
                            backgroundClip: 'text',
                            textFillColor: 'transparent',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            lineHeight: 0.8,
                            mb: 2,
                            filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.5))'
                        }}
                    >
                        404
                    </Typography>

                    <Typography
                        variant="h4"
                        sx={{
                            fontFamily: 'var(--font-prompt)',
                            fontWeight: 600,
                            mb: 2,
                            background: 'linear-gradient(90deg, #fff, rgba(255,255,255,0.7))',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}
                    >
                        ขออภัย ไม่พบหน้าที่คุณต้องการ
                    </Typography>

                    <Typography
                        sx={{
                            fontFamily: 'var(--font-prompt)',
                            color: 'rgba(255,255,255,0.6)',
                            mb: 6,
                            maxWidth: '500px',
                            mx: 'auto'
                        }}
                    >
                        หน้าที่คุณและพยายามเข้าถึงอาจถูกย้าย ลบ หรือไม่มีอยู่จริงในระบบ
                        กรุณาตรวจสอบ URL หรือกลับไปที่หน้าหลัก
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Button
                            component={Link}
                            href="/"
                            variant="contained"
                            startIcon={<Home2 size="20" color="white" />}
                            sx={{
                                bgcolor: 'var(--primary)',
                                fontFamily: 'var(--font-prompt)',
                                px: 4,
                                py: 1.5,
                                borderRadius: '50px',
                                fontSize: '1rem',
                                textTransform: 'none',
                                boxShadow: '0 10px 30px -10px var(--primary)',
                                '&:hover': {
                                    bgcolor: '#0d7a78',
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 20px 40px -10px var(--primary)',
                                },
                                transition: 'all 0.3s ease'
                            }}
                        >
                            กลับสู่หน้าหลัก
                        </Button>

                        <Button
                            component={Link}
                            href="/contact"
                            variant="outlined"
                            startIcon={<Information size="20" color="white" />}
                            sx={{
                                borderColor: 'rgba(255,255,255,0.2)',
                                color: 'white',
                                fontFamily: 'var(--font-prompt)',
                                px: 4,
                                py: 1.5,
                                borderRadius: '50px',
                                fontSize: '1rem',
                                textTransform: 'none',
                                backdropFilter: 'blur(10px)',
                                '&:hover': {
                                    borderColor: 'white',
                                    bgcolor: 'rgba(255,255,255,0.05)',
                                    transform: 'translateY(-2px)'
                                },
                                transition: 'all 0.3s ease'
                            }}
                        >
                            ติดต่อเรา
                        </Button>
                    </Box>

                </Container>
            </Box>

            <Footer />
        </Box>
    );
}
