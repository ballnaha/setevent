"use client";

import Link from "next/link";
import { Box, Typography, Button, Container } from "@mui/material";
import { Home2, Information } from "iconsax-react";

export default function NotFoundContent() {
    return (
        <Box sx={{
            bgcolor: 'var(--background)',
            minHeight: '100vh',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
        }}>
            {/* Hero Section - matching About page pt values */}
            <Box
                sx={{
                    pt: { xs: 15, md: 22 },
                    pb: { xs: 8, md: 12 },
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden',
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
                    opacity: 0.1,
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
                    opacity: 0.08,
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
                            background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
                            backgroundClip: 'text',
                            textFillColor: 'transparent',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            lineHeight: 0.8,
                            mb: 2,
                            filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.1))'
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
                            color: 'var(--foreground)',
                        }}
                    >
                        ขออภัย ไม่พบหน้าที่คุณต้องการ
                    </Typography>

                    <Typography
                        sx={{
                            fontFamily: 'var(--font-prompt)',
                            color: 'var(--foreground)',
                            opacity: 0.7,
                            mb: 6,
                            maxWidth: '500px',
                            mx: 'auto'
                        }}
                    >
                        หน้าที่คุณพยายามเข้าถึงอาจถูกย้าย ลบ หรือไม่มีอยู่จริงในระบบ
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
                                color: 'white',
                                fontFamily: 'var(--font-prompt)',
                                px: 4,
                                py: 1.5,
                                borderRadius: '50px',
                                fontSize: '1rem',
                                textTransform: 'none',
                                boxShadow: '0 10px 30px -10px var(--primary)',
                                '&:hover': {
                                    bgcolor: 'var(--primary)',
                                    opacity: 0.9,
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
                            startIcon={<Information size="20" />}
                            sx={{
                                borderColor: 'var(--border-color)',
                                color: 'var(--foreground)',
                                fontFamily: 'var(--font-prompt)',
                                px: 4,
                                py: 1.5,
                                borderRadius: '50px',
                                fontSize: '1rem',
                                textTransform: 'none',
                                backdropFilter: 'blur(10px)',
                                '&:hover': {
                                    borderColor: 'var(--primary)',
                                    bgcolor: 'rgba(var(--primary-rgb), 0.05)',
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
        </Box>
    );
}
