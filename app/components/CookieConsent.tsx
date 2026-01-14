'use client';

import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    Paper,
    Slide,
    Container,
    Stack,
    IconButton,
    Link,
    useTheme,
    useMediaQuery
} from '@mui/material';
import NextLink from 'next/link';
import { Close as CloseIcon, Cookie as CookieIcon } from '@mui/icons-material';

const CookieConsent = () => {
    const [isVisible, setIsVisible] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        // Check if user has already made a choice
        const consent = localStorage.getItem('cookie-consent');
        if (!consent) {
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 1500); // Show after 1.5s delay
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookie-consent', 'accepted');
        setIsVisible(false);
    };

    const handleDecline = () => {
        localStorage.setItem('cookie-consent', 'declined');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <Slide direction="up" in={isVisible} mountOnEnter unmountOnExit>
            <Box
                sx={{
                    position: 'fixed',
                    bottom: isMobile ? 16 : 30,
                    left: 0,
                    right: 0,
                    zIndex: 9999,
                    px: 3,
                    pointerEvents: 'none'
                }}
            >
                <Container maxWidth="lg" sx={{ p: 0 }}>
                    <Paper
                        elevation={24}
                        sx={{
                            p: { xs: 3, md: 4 },
                            borderRadius: { xs: 4, md: 6 },
                            background: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(10, 92, 90, 0.1)',
                            pointerEvents: 'auto',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                            position: 'relative',
                            overflow: 'hidden',
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '4px',
                                height: '100%',
                                background: `linear-gradient(to bottom, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                            }
                        }}
                    >
                        <Stack
                            direction={{ xs: 'column', md: 'row' }}
                            spacing={{ xs: 2, md: 4 }}
                            alignItems={{ xs: 'flex-start', md: 'center' }}
                            justifyContent="space-between"
                        >
                            <Box sx={{ flex: 1 }}>
                                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
                                    <Box
                                        sx={{
                                            p: 1,
                                            borderRadius: 2,
                                            background: `linear-gradient(135deg, ${theme.palette.primary.main}15, ${theme.palette.secondary.main}15)`,
                                            color: theme.palette.primary.main
                                        }}
                                    >
                                        <CookieIcon />
                                    </Box>
                                    <Typography variant="h6" fontWeight={700} sx={{ color: theme.palette.primary.main }}>
                                        นโยบายความเป็นส่วนตัวและคุ้กกี้
                                    </Typography>
                                </Stack>
                                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6, maxWidth: '800px' }}>
                                    เราใช้คุกกี้เพื่อเพิ่มประสิทธิภาพและประสบการณ์ที่ดีในการใช้งานเว็บไซต์
                                    โดยการใช้งานเว็บไซต์นี้ถือว่าท่านยอมรับการใช้งานคุกกี้ของเรา
                                    ท่านสามารถศึกษารายละเอียดเพิ่มเติมได้ที่
                                    <Box
                                        component={NextLink}
                                        href="/privacy-policy"
                                        sx={{
                                            mx: 0.5,
                                            color: theme.palette.primary.main,
                                            textDecoration: 'none',
                                            fontWeight: 600,
                                            '&:hover': { textDecoration: 'underline' }
                                        }}
                                    >
                                        นโยบายความเป็นส่วนตัว
                                    </Box>
                                </Typography>
                            </Box>

                            <Stack
                                direction={{ xs: 'row-reverse', sm: 'row' }}
                                spacing={2}
                                sx={{ width: { xs: '100%', md: 'auto' } }}
                            >
                                <Button
                                    variant="outlined"
                                    onClick={handleDecline}
                                    sx={{
                                        px: 3,
                                        py: 1.2,
                                        borderRadius: '12px',
                                        color: 'text.secondary',
                                        borderColor: 'divider',
                                        fontWeight: 500,
                                        '&:hover': {
                                            borderColor: 'text.primary',
                                            bgcolor: 'transparent'
                                        },
                                        flex: { xs: 1, md: 'none' }
                                    }}
                                >
                                    ปฏิเสธ
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={handleAccept}
                                    sx={{
                                        px: 4,
                                        py: 1.2,
                                        borderRadius: '12px',
                                        bgcolor: theme.palette.primary.main,
                                        boxShadow: `0 8px 20px ${theme.palette.primary.main}30`,
                                        fontWeight: 600,
                                        '&:hover': {
                                            bgcolor: theme.palette.primary.dark,
                                            boxShadow: `0 12px 25px ${theme.palette.primary.main}50`,
                                        },
                                        flex: { xs: 1, md: 'none' }
                                    }}
                                >
                                    ยอมรับทั้งหมด
                                </Button>
                            </Stack>
                        </Stack>

                        <IconButton
                            onClick={() => setIsVisible(false)}
                            sx={{
                                position: 'absolute',
                                top: 12,
                                right: 12,
                                color: 'text.disabled',
                                '&:hover': { color: 'text.primary' }
                            }}
                        >
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </Paper>
                </Container>
            </Box>
        </Slide>
    );
};

export default CookieConsent;
