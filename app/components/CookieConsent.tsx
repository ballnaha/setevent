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
                    bottom: isMobile ? 8 : 30,
                    left: 0,
                    right: 0,
                    zIndex: 9999,
                    px: isMobile ? 1.5 : 3,
                    pointerEvents: 'none'
                }}
            >
                <Container maxWidth="lg" sx={{ p: 0 }}>
                    <Paper
                        elevation={24}
                        sx={{
                            p: { xs: 2, sm: 2.5, md: 4 },
                            borderRadius: { xs: 3, md: 6 },
                            background: 'var(--card-bg)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid var(--border-color)',
                            pointerEvents: 'auto',
                            boxShadow: 'var(--card-shadow)',
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
                            spacing={{ xs: 1.5, md: 4 }}
                            alignItems={{ xs: 'flex-start', md: 'center' }}
                            justifyContent="space-between"
                        >
                            <Box sx={{ flex: 1, pr: { xs: 3, md: 0 } }}>
                                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 0.5 }}>
                                    <Box
                                        sx={{
                                            p: { xs: 0.6, md: 1 },
                                            borderRadius: 2,
                                            background: `linear-gradient(135deg, ${theme.palette.primary.main}15, ${theme.palette.secondary.main}15)`,
                                            color: theme.palette.primary.main,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        <CookieIcon sx={{ fontSize: { xs: 18, md: 24 } }} />
                                    </Box>
                                    <Typography
                                        variant="h6"
                                        fontWeight={700}
                                        sx={{
                                            color: theme.palette.primary.main,
                                            fontSize: { xs: '0.9rem', sm: '1rem', md: '1.25rem' }
                                        }}
                                    >
                                        นโยบายความเป็นส่วนตัวและคุกกี้
                                    </Typography>
                                </Stack>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: 'var(--foreground)',
                                        opacity: 0.7,
                                        lineHeight: 1.5,
                                        maxWidth: '800px',
                                        fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.875rem' }
                                    }}
                                >
                                    เราใช้คุกกี้เพื่อเพิ่มประสิทธิภาพและประสบการณ์การใช้งานเว็บไซต์
                                    {!isMobile && ' โดยการใช้งานเว็บไซต์นี้ถือว่าท่านยอมรับการใช้งานคุกกี้ของเรา'}
                                    {' '}ดูรายละเอียดที่
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
                                direction="row"
                                spacing={1}
                                sx={{ width: { xs: '100%', md: 'auto' } }}
                            >
                                <Button
                                    variant="outlined"
                                    onClick={handleDecline}
                                    size={isMobile ? 'small' : 'medium'}
                                    sx={{
                                        px: { xs: 2, md: 3 },
                                        py: { xs: 0.8, md: 1.2 },
                                        borderRadius: { xs: '8px', md: '12px' },
                                        color: 'var(--foreground)',
                                        opacity: 0.8,
                                        borderColor: 'var(--border-color)',
                                        fontWeight: 500,
                                        fontSize: { xs: '0.75rem', md: '0.875rem' },
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
                                    size={isMobile ? 'small' : 'medium'}
                                    sx={{
                                        px: { xs: 2, md: 4 },
                                        py: { xs: 0.8, md: 1.2 },
                                        borderRadius: { xs: '8px', md: '12px' },
                                        bgcolor: theme.palette.primary.main,
                                        boxShadow: `0 8px 20px ${theme.palette.primary.main}30`,
                                        fontWeight: 600,
                                        fontSize: { xs: '0.75rem', md: '0.875rem' },
                                        '&:hover': {
                                            bgcolor: theme.palette.primary.dark,
                                            boxShadow: `0 12px 25px ${theme.palette.primary.main}50`,
                                        },
                                        flex: { xs: 1, md: 'none' }
                                    }}
                                >
                                    ยอมรับ
                                </Button>
                            </Stack>
                        </Stack>

                        <IconButton
                            onClick={() => setIsVisible(false)}
                            size={isMobile ? 'small' : 'medium'}
                            sx={{
                                position: 'absolute',
                                top: { xs: 6, md: 12 },
                                right: { xs: 6, md: 12 },
                                color: 'text.disabled',
                                '&:hover': { color: 'text.primary' }
                            }}
                        >
                            <CloseIcon sx={{ fontSize: { xs: 16, md: 20 } }} />
                        </IconButton>
                    </Paper>
                </Container>
            </Box>
        </Slide>
    );
};

export default CookieConsent;
