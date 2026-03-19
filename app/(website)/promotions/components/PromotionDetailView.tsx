"use client";

import React from "react";
import { Box, Typography, IconButton, Stack, Chip, Paper } from "@mui/material";
import { CloseCircle, MagicStar, NoteText, MessageQuestion } from "iconsax-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@mui/material";

interface Promotion {
    id: string;
    title: string;
    description: string;
    image: string;
    price?: string;
    period?: string;
    features: { label: string; value: string }[];
    category?: string;
    createdAt: string;
}

interface PromotionDetailViewProps {
    promotion: Promotion;
    onClose?: () => void;
    isModal?: boolean;
}

// Helper function to format price with commas
const formatPrice = (price: string | undefined): string => {
    if (!price) return '';
    const numericPart = price.replace(/[^0-9]/g, '');
    if (!numericPart) return price;
    const formatted = parseInt(numericPart).toLocaleString('en-US');
    const hasThaiCurrency = price.includes('฿') || price.includes('บาท');
    const hasPrefix = price.toLowerCase().includes('start') || price.toLowerCase().includes('เริ่มต้น');
    if (hasPrefix) {
        return `เริ่มต้น ฿${formatted}`;
    }
    return hasThaiCurrency ? `฿${formatted}` : formatted;
};

export default function PromotionDetailView({ promotion, onClose, isModal = false }: PromotionDetailViewProps) {
    const router = useRouter();

    const handleClose = () => {
        if (onClose) {
            onClose();
        } else {
            router.back();
        }
    };

    return (
        <Box sx={{
            position: 'relative',
            width: '100%',
            height: isModal ? '100vh' : 'auto',
            minHeight: isModal ? '100vh' : '100vh',
            display: 'flex',
            flexDirection: 'column',
            outline: 'none',
            bgcolor: 'var(--background)',
            overflow: isModal ? 'hidden' : 'visible',
        }}>
            {/* Close Button */}
            <IconButton
                onClick={handleClose}
                aria-label="ปิด"
                sx={{
                    position: 'absolute',
                    top: { xs: 16, md: 24 },
                    right: { xs: 16, md: 24 },
                    zIndex: 100,
                    color: 'var(--foreground)',
                    bgcolor: 'var(--border-color)',
                    backdropFilter: 'blur(4px)',
                    '&:hover': { bgcolor: 'var(--background)', border: '1px solid var(--primary)' }
                }}
            >
                <CloseCircle size="28" color='var(--primary)' variant='Outline' />
            </IconButton>

            <Box sx={{
                display: 'flex',
                flexDirection: { xs: 'column', lg: 'row' },
                flex: 1,
                minHeight: 0,
                overflow: { xs: 'auto', lg: 'hidden' },
            }}>
                {/* Left Side: Image Display */}
                <Box sx={{
                    flex: { xs: '0 0 auto', lg: 1 },
                    height: { xs: '60vh', lg: 'auto' },
                    position: 'relative',
                    minHeight: 0,
                    overflow: 'hidden',
                    borderRight: { lg: '1px solid var(--border-color)' },
                    bgcolor: 'rgba(0,0,0,0.02)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Box sx={{ position: 'relative', width: '100%', height: '100%', p: { xs: 2, md: 6 } }}>
                        <Image
                            src={promotion.image}
                            alt={promotion.title}
                            fill
                            priority
                            style={{
                                objectFit: 'contain',
                                objectPosition: 'center',
                            }}
                            sizes="(max-width: 1024px) 100vw, 80vw"
                        />
                    </Box>
                </Box>

                {/* Right Side: Promotion Details */}
                <Box sx={{
                    width: { xs: '100%', lg: 550 },
                    display: 'flex',
                    flexDirection: 'column',
                    bgcolor: 'var(--card-bg)',
                    flexShrink: 0,
                    overflowY: 'auto',
                    p: { xs: 4, md: 6 },
                    position: 'relative'
                }}>
                    {/* Header/Period Badge */}
                    <Typography sx={{
                        fontFamily: 'var(--font-prompt)',
                        fontSize: '0.8rem',
                        color: 'var(--primary)',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: 2,
                        mb: 1.5,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5
                    }}>
                        <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: 'var(--primary)' }}></span>
                        {promotion.period || "Special Deal"}
                    </Typography>

                    {/* Title */}
                    <Typography sx={{
                        fontFamily: 'var(--font-prompt)',
                        fontWeight: 800,
                        fontSize: { xs: '1.8rem', md: '2.4rem' },
                        color: 'var(--foreground)',
                        lineHeight: 1.1,
                        mb: 4,
                        letterSpacing: '-0.5px'
                    }}>
                        {promotion.title}
                    </Typography>

                    {/* Price Section */}
                    {promotion.price && (
                        <Box sx={{
                            mb: 5,
                            p: 3,
                            bgcolor: 'rgba(10, 92, 90, 0.05)',
                            borderRadius: 4,
                            border: '1px solid rgba(10, 92, 90, 0.1)',
                            position: 'relative',
                        }}>
                            <Box sx={{ position: 'absolute', top: -10, right: -10, width: 60, height: 60, background: 'radial-gradient(circle, var(--primary) 0%, transparent 70%)', opacity: 0.1 }} />
                            <Typography sx={{ fontFamily: 'var(--font-prompt)', color: 'var(--foreground)', opacity: 0.6, fontSize: '0.85rem', fontWeight: 500, mb: 1 }}>
                                ราคาโปรโมชั่น
                            </Typography>
                            <Typography sx={{
                                fontFamily: 'var(--font-prompt)',
                                fontWeight: 800,
                                fontSize: { xs: '2rem', md: '2.4rem' },
                                color: '#E94560',
                                lineHeight: 1
                            }}>
                                {formatPrice(promotion.price)}
                            </Typography>
                        </Box>
                    )}

                    {/* Features/Details Grid */}
                    {promotion.features && promotion.features.length > 0 && (
                        <Box sx={{ mb: 5 }}>
                            <Typography sx={{
                                fontFamily: 'var(--font-prompt)',
                                fontWeight: 700,
                                fontSize: '1.1rem',
                                mb: 2.5,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2,
                                color: 'var(--foreground)'
                            }}>
                                <MagicStar size="24" color="var(--primary)" variant="Bold" />
                                รายละเอียดโปรโมชั่น
                            </Typography>
                            <Stack spacing={2.5}>
                                {promotion.features.map((feature, idx) => (
                                    <Box key={idx} sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 0.5,
                                        p: 1.5,
                                        borderRadius: 2,
                                        transition: 'all 0.2s',
                                        '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' }
                                    }}>
                                        <Typography sx={{
                                            fontFamily: 'var(--font-prompt)',
                                            fontSize: '0.75rem',
                                            color: 'var(--foreground)',
                                            opacity: 0.4,
                                            fontWeight: 600,
                                            textTransform: 'uppercase',
                                            letterSpacing: 1
                                        }}>
                                            {feature.label}
                                        </Typography>
                                        <Typography sx={{
                                            fontFamily: 'var(--font-prompt)',
                                            fontSize: '1.1rem',
                                            color: 'var(--foreground)',
                                            fontWeight: 600
                                        }}>
                                            {feature.value}
                                        </Typography>
                                    </Box>
                                ))}
                            </Stack>
                        </Box>
                    )}

                    {/* Description Section */}
                    <Box sx={{ mb: 6 }}>
                        <Typography sx={{
                            fontFamily: 'var(--font-prompt)',
                            fontWeight: 700,
                            fontSize: '1.1rem',
                            mb: 2.5,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            color: 'var(--foreground)'
                        }}>
                            <NoteText size="24" color="var(--primary)" variant="Bold" />
                            ข้อมูลเพิ่มเติม
                        </Typography>
                        <Typography sx={{
                            fontFamily: 'var(--font-prompt)',
                            fontSize: '1rem',
                            color: 'var(--foreground)',
                            opacity: 0.75,
                            lineHeight: 1.9,
                            whiteSpace: 'pre-line',
                            pl: 0.5
                        }}>
                            {promotion.description}
                        </Typography>
                    </Box>

                    {/* CTA Button (Matches Product Detail) */}
                    <Box sx={{ mt: 'auto', pt: 4 }}>
                        <Button
                            href="https://line.me/ti/p/~@setevent"
                            target="_blank"
                            variant="contained"
                            fullWidth
                            startIcon={<MessageQuestion size="24" variant="Bold" color="white" />}
                            sx={{
                                bgcolor: '#1a1a1a',
                                color: 'white',
                                py: 2.5,
                                borderRadius: 4,
                                fontFamily: 'var(--font-prompt)',
                                fontWeight: 700,
                                fontSize: '1.1rem',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                '&:hover': {
                                    bgcolor: 'var(--primary)',
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 8px 24px rgba(10, 92, 90, 0.25)',
                                }
                            }}
                        >
                            สอบถามโปรโมชั่นนี้
                        </Button>

                        <Typography sx={{
                            mt: 2.5,
                            textAlign: 'center',
                            fontFamily: 'var(--font-prompt)',
                            fontSize: '0.85rem',
                            color: 'var(--foreground)',
                            opacity: 0.5,
                            fontWeight: 300
                        }}>
                            อัปเดตล่าสุดเมื่อ {promotion.createdAt}
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
