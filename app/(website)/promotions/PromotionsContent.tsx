"use client";

import React, { useState } from "react";
import { Box, Container, Typography, Paper, IconButton, Stack, Chip, Modal, Skeleton } from "@mui/material";
import { Gallery, CloseCircle, Ticket } from "iconsax-react";
import Image from "next/image";

// Parsed interface for display
interface Promotion {
    id: string;
    title: string;
    description: string;
    image: string;
    price?: string;
    period?: string;
    features: { label: string; value: string }[];
    createdAt: string;
}

interface PromotionsContentProps {
    initialPromotions: Promotion[];
}

// Helper function to format price with commas
const formatPrice = (price: string | undefined): string => {
    if (!price) return '';
    // Extract numbers from the price string
    const numericPart = price.replace(/[^0-9]/g, '');
    if (!numericPart) return price;
    // Format with commas
    const formatted = parseInt(numericPart).toLocaleString('en-US');
    // Check if original had currency symbol
    const hasThaiCurrency = price.includes('฿') || price.includes('บาท');
    const hasPrefix = price.toLowerCase().includes('start') || price.toLowerCase().includes('เริ่มต้น');
    if (hasPrefix) {
        return `เริ่มต้น ฿${formatted}`;
    }
    return hasThaiCurrency ? `฿${formatted}` : formatted;
};

function PromotionCard({ promotion, onClick, priority = false }: { promotion: Promotion; onClick: () => void; priority?: boolean }) {
    const [isHovered, setIsHovered] = useState(false);
    const extraFeaturesCount = Math.max(0, promotion.features.length - 2);

    return (
        <Paper
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={onClick}
            sx={{
                position: 'relative',
                borderRadius: 4,
                overflow: 'hidden',
                height: { xs: 400, md: 440 },
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
                boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 24px 48px rgba(0,0,0,0.2)',
                }
            }}
        >
            {/* Background Image */}
            <Box sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: isHovered ? 'scale(1.05)' : 'scale(1)',
            }}>
                <Image
                    src={promotion.image}
                    alt={promotion.title}
                    fill
                    priority={priority}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    placeholder="blur"
                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mPo6Oj4HwAE/gLqWTtW2QAAAABJRU5ErkJggg=="
                    style={{ objectFit: 'cover' }}
                />
            </Box>

            {/* Top Badge - Period/Special */}
            {promotion.period && (
                <Box sx={{
                    position: 'absolute',
                    top: 16,
                    left: 16,
                    zIndex: 3,
                    bgcolor: 'rgba(0,0,0,0.7)',
                    backdropFilter: 'blur(8px)',
                    px: 1.5,
                    py: 0.75,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5
                }}>
                    <Ticket size="14" color="#FFD700" variant="TwoTone" />
                    <Typography sx={{
                        fontFamily: 'var(--font-prompt)',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: 'white',
                    }}>
                        {promotion.period}
                    </Typography>
                </Box>
            )}

            {/* Gradient Overlay */}
            <Box sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '60%',
                background: 'linear-gradient(to top, rgba(15,30,25,0.98) 0%, rgba(15,30,25,0.9) 40%, rgba(15,30,25,0) 100%)',
                zIndex: 1
            }} />

            {/* Content Container */}
            <Box sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                p: 2.5,
                zIndex: 2,
            }}>
                {/* Title as Main Headline */}
                <Typography sx={{
                    fontFamily: 'var(--font-prompt)',
                    fontSize: { xs: '1.5rem', md: '1.75rem' },
                    fontWeight: 500,
                    color: 'white',
                    lineHeight: 1.2,
                    mb: 1.5,
                }}>
                    {promotion.title}
                </Typography>

                {/* Price & Description with Features Row */}
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: 2,
                    mb: 2
                }}>
                    {/* Left: Price & Description */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        {promotion.price && (
                            <Typography sx={{
                                fontFamily: 'var(--font-prompt)',
                                fontSize: '0.95rem',
                                color: 'white',
                                fontWeight: 600,
                                mb: 0.5
                            }}>
                                ฿{formatPrice(promotion.price)}
                            </Typography>
                        )}
                        <Typography sx={{
                            fontFamily: 'var(--font-prompt)',
                            fontSize: '0.8rem',
                            color: 'rgba(255,255,255,0.6)',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                        }}>
                            {promotion.description}
                        </Typography>
                    </Box>

                    {/* Right: Features with Icons */}
                    <Box sx={{
                        display: 'flex',
                        gap: 1,
                        flexShrink: 0
                    }}>
                        {promotion.features.slice(0, 2).map((feature, idx) => (
                            <Box key={idx} sx={{
                                textAlign: 'center',
                                bgcolor: 'rgba(255,255,255,0.08)',
                                px: 1.5,
                                py: 1,
                                borderRadius: 2,
                                minWidth: 55
                            }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                                    <Gallery size="14" color="rgba(255,255,255,0.7)" />
                                    <Typography sx={{
                                        fontFamily: 'var(--font-prompt)',
                                        fontSize: '0.65rem',
                                        color: 'rgba(255,255,255,0.6)',
                                        lineHeight: 1.2
                                    }}>
                                        {feature.value}
                                    </Typography>
                                </Box>
                                <Typography sx={{
                                    fontFamily: 'var(--font-prompt)',
                                    fontSize: '0.95rem',
                                    color: 'white',
                                    fontWeight: 600,
                                    mt: 0.25
                                }}>
                                    {feature.label}
                                </Typography>
                            </Box>
                        ))}
                        {extraFeaturesCount > 0 && (
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                bgcolor: 'rgba(255,255,255,0.08)',
                                borderRadius: 2,
                                width: 40,
                                height: 'auto',
                            }}>
                                <Typography sx={{
                                    fontFamily: 'var(--font-prompt)',
                                    fontSize: '0.9rem',
                                    color: 'white',
                                    fontWeight: 600
                                }}>
                                    +{extraFeaturesCount}
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </Box>

                {/* Footer - "By" with Date + Extra Features Count */}
                <Box sx={{
                    borderTop: '1px solid rgba(255,255,255,0.1)',
                    pt: 1.5,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <Typography sx={{
                        fontFamily: 'var(--font-prompt)',
                        fontSize: '0.75rem',
                        color: 'rgba(255,255,255,0.5)',
                    }}>
                        By • <Box component="span" sx={{ color: 'var(--primary)', fontWeight: 500 }}>SET EVENT</Box>  {promotion.createdAt}
                    </Typography>

                    {/* Show extra features count if more than 2 */}
                    {extraFeaturesCount > 0 && (
                        <Typography sx={{
                            fontFamily: 'var(--font-prompt)',
                            fontSize: '0.7rem',
                            color: 'var(--primary)',
                            fontWeight: 500,
                        }}>
                            +{extraFeaturesCount} เพิ่มเติม
                        </Typography>
                    )}
                </Box>
            </Box>
        </Paper>
    );
}

export default function PromotionsContent({ initialPromotions }: PromotionsContentProps) {
    const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(null);
    const [loading, setLoading] = useState(initialPromotions.length === 0);
    const promotions = initialPromotions;

    if (loading) {
        return (
            <Box sx={{ bgcolor: 'var(--background)', minHeight: '100vh', pb: 10, overflow: 'hidden' }}>
                {/* Hero Skeleton - More Minimal & Beautiful */}
                <Box sx={{
                    pt: { xs: 15, md: 22 },
                    pb: { xs: 8, md: 10 },
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 3
                }}>
                    <Skeleton variant="rounded" width={140} height={32} sx={{ borderRadius: 10, bgcolor: 'var(--border-color)', opacity: 0.5 }} />
                    <Skeleton variant="text" height={60} sx={{ width: { xs: '90%', md: 400 }, bgcolor: 'var(--border-color)', opacity: 0.8 }} />
                    <Skeleton variant="text" height={24} sx={{ width: { xs: '80%', md: 600 }, bgcolor: 'var(--border-color)', opacity: 0.5 }} />
                </Box>

                {/* Grid Skeleton */}
                <Container maxWidth="lg" sx={{ mt: 8 }}>
                    <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
                        gap: 4
                    }}>
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <Box key={i} sx={{
                                borderRadius: 4,
                                overflow: 'hidden',
                                height: { xs: 400, md: 440 },
                                position: 'relative',
                                bgcolor: 'var(--border-color)',
                                opacity: 0.3
                            }}>
                                <Skeleton variant="rectangular" height="100%" animation="wave" />
                                <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, p: 3, zIndex: 1 }}>
                                    <Skeleton variant="text" width="80%" height={40} sx={{ mb: 1, bgcolor: 'rgba(255,255,255,0.2)' }} />
                                    <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                                        <Skeleton variant="text" width="30%" height={20} sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
                                        <Skeleton variant="text" width="40%" height={20} sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
                                    </Stack>
                                    <Skeleton variant="text" width="100%" height={60} sx={{ bgcolor: 'rgba(255,255,255,0.05)' }} />
                                </Box>
                            </Box>
                        ))}
                    </Box>
                </Container>
            </Box>
        );
    }

    return (
        <Box sx={{ bgcolor: "var(--background)", minHeight: "100vh", pb: 10, overflow: 'hidden' }}>
            {/* Header Section with Geometric background */}
            <Box sx={{
                pt: { xs: 15, md: 22 },
                pb: { xs: 8, md: 10 },
                position: 'relative',

            }}>
                {/* Background Decor */}
                <Box sx={{
                    position: 'absolute',
                    top: '-20%',
                    right: '-10%',
                    width: '600px',
                    height: '600px',
                    background: 'radial-gradient(circle, rgba(233, 69, 96, 0.15) 0%, rgba(233, 69, 96, 0) 70%)',
                    filter: 'blur(60px)',
                    zIndex: 0
                }} />
                <Box sx={{
                    position: 'absolute',
                    bottom: '-10%',
                    left: '-10%',
                    width: '500px',
                    height: '500px',
                    background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, rgba(139, 92, 246, 0) 70%)',
                    filter: 'blur(60px)',
                    zIndex: 0
                }} />

                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                    <Stack spacing={3} alignItems="center">
                        <Chip
                            label="Special Deals"
                            sx={{
                                bgcolor: 'rgba(233, 69, 96, 0.1)',
                                color: '#E94560',
                                border: '1px solid rgba(233, 69, 96, 0.2)',
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
                            EXCLUSIVE <br />
                            <span style={{
                                background: 'linear-gradient(90deg, #E94560 0%, #F59E0B 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}>
                                PROMOTIONS
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
                            ดีลพิเศษและโปรโมชั่นสุดคุ้ม สำหรับงานเช่าอุปกรณ์จอ LED แสง สี เสียง และลิฟต์จอ
                        </Typography>
                    </Stack>
                </Container>
            </Box>

            {/* Content List */}
            <Container maxWidth="lg" sx={{ mt: 8 }}>
                {promotions.length === 0 ? (
                    <Box sx={{
                        textAlign: 'center',
                        py: 15,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: 'rgba(255,255,255,0.02)',
                        borderRadius: 4,
                        border: '1px dashed rgba(128,128,128,0.2)'
                    }}>
                        <Ticket size="64" color="var(--primary)" variant="Bulk" style={{ opacity: 0.3, marginBottom: 20 }} />
                        <Typography variant="h5" sx={{ fontFamily: 'var(--font-prompt)', color: 'var(--foreground)', fontWeight: 600, mb: 1 }}>
                            ยังไม่มีโปรโมชั่นในขณะนี้
                        </Typography>
                        <Typography sx={{ fontFamily: 'var(--font-prompt)', color: 'var(--foreground)', opacity: 0.6 }}>
                            เรากำลังจัดเตรียมข้อเสนอสุดพิเศษสำหรับคุณ อดใจรอนิดนะคะ
                        </Typography>
                    </Box>
                ) : (
                    <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
                        gap: 4
                    }}>
                        {promotions.map((promo, index) => (
                            <PromotionCard
                                key={promo.id}
                                promotion={promo}
                                onClick={() => setSelectedPromotion(promo)}
                                priority={index < 3} // First 3 cards get priority loading for LCP
                            />
                        ))}
                    </Box>
                )}
            </Container>

            {/* Details Modal */}
            <Modal
                open={!!selectedPromotion}
                onClose={() => setSelectedPromotion(null)}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 0,
                    '& .MuiBackdrop-root': {
                        bgcolor: 'rgba(0,0,0,0.85)',
                        backdropFilter: 'blur(10px)'
                    }
                }}
            >
                <Paper
                    sx={{
                        position: 'relative',
                        width: '100%',
                        maxWidth: { xs: '100%', md: 1000 },
                        height: { xs: '100vh', md: 'auto' },
                        maxHeight: { xs: '100vh', md: '90vh' },
                        bgcolor: '#1a1a1a',
                        borderRadius: { xs: 0, md: 4 },
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        outline: 'none',
                        boxShadow: '0 24px 48px rgba(0,0,0,0.5)'
                    }}
                >
                    {/* Close Button */}
                    <IconButton
                        onClick={() => setSelectedPromotion(null)}
                        sx={{
                            position: 'absolute',
                            top: { xs: 12, md: 16 },
                            right: { xs: 12, md: 16 },
                            zIndex: 10,
                            color: 'white',
                            bgcolor: 'rgba(0,0,0,0.5)',
                            backdropFilter: 'blur(4px)',
                            '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' }
                        }}
                    >
                        <CloseCircle size="28" color="white" />
                    </IconButton>

                    {selectedPromotion && (
                        <>
                            {/* Desktop Layout - Side by Side */}
                            <Box sx={{
                                display: { xs: 'none', md: 'flex' },
                                flexDirection: 'row',
                                height: '100%'
                            }}>
                                {/* Left: Image */}
                                <Box
                                    sx={{
                                        width: '50%',
                                        position: 'relative',
                                        minHeight: '600px',
                                        bgcolor: '#0f0f0f',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Image
                                        src={selectedPromotion.image}
                                        alt={selectedPromotion.title}
                                        fill
                                        priority
                                        sizes="(max-width: 1200px) 50vw, 500px"
                                        style={{ objectFit: 'contain', padding: '16px' }}
                                    />
                                </Box>

                                {/* Right: Details */}
                                <Box sx={{
                                    width: '50%',
                                    p: 5,
                                    overflowY: 'auto',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 3
                                }}>
                                    {/* Header */}
                                    <Box>
                                        <Chip
                                            label={selectedPromotion.period || "Special Offer"}
                                            sx={{
                                                bgcolor: 'var(--primary)',
                                                color: 'white',
                                                fontWeight: 600,
                                                mb: 2,
                                                fontFamily: 'var(--font-prompt)'
                                            }}
                                        />
                                        <Typography variant="h3" sx={{
                                            fontFamily: 'var(--font-prompt)',
                                            fontWeight: 700,
                                            color: 'white',
                                            fontSize: '2.5rem',
                                            lineHeight: 1.2,
                                            mb: 1
                                        }}>
                                            {selectedPromotion.title}
                                        </Typography>
                                        {selectedPromotion.price && (
                                            <Typography sx={{
                                                fontFamily: 'var(--font-prompt)',
                                                fontSize: '2rem',
                                                color: 'var(--primary)',
                                                fontWeight: 600
                                            }}>
                                                {selectedPromotion.price}
                                            </Typography>
                                        )}
                                    </Box>

                                    {/* Description */}
                                    <Typography sx={{
                                        fontFamily: 'var(--font-prompt)',
                                        color: 'rgba(255,255,255,0.7)',
                                        fontSize: '1rem',
                                        lineHeight: 1.6
                                    }}>
                                        {selectedPromotion.description}
                                    </Typography>

                                    {/* Features Grid */}
                                    <Box sx={{
                                        display: 'grid',
                                        gridTemplateColumns: '1fr 1fr',
                                        gap: 2,
                                        bgcolor: 'rgba(255,255,255,0.03)',
                                        p: 3,
                                        borderRadius: 3,
                                        border: '1px solid rgba(255,255,255,0.05)'
                                    }}>
                                        {selectedPromotion.features.map((feature, idx) => (
                                            <Box key={idx}>
                                                <Typography sx={{
                                                    fontFamily: 'var(--font-prompt)',
                                                    fontSize: '0.8rem',
                                                    color: 'rgba(255,255,255,0.5)',
                                                    mb: 0.5
                                                }}>
                                                    {feature.label}
                                                </Typography>
                                                <Typography sx={{
                                                    fontFamily: 'var(--font-prompt)',
                                                    fontSize: '1.1rem',
                                                    color: 'white',
                                                    fontWeight: 500
                                                }}>
                                                    {feature.value}
                                                </Typography>
                                            </Box>
                                        ))}
                                    </Box>

                                    {/* Footer */}
                                    <Box sx={{ mt: 'auto', pt: 3, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                                        <Typography sx={{
                                            fontFamily: 'var(--font-prompt)',
                                            fontSize: '0.9rem',
                                            color: 'rgba(255,255,255,0.5)',
                                        }}>
                                            ข้อมูล ณ วันที่ {selectedPromotion.createdAt}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>

                            {/* Mobile Layout - Vertical Stack with Large Image */}
                            <Box sx={{
                                display: { xs: 'flex', md: 'none' },
                                flexDirection: 'column',
                                height: '100vh',
                                overflow: 'hidden'
                            }}>
                                {/* Top: Full Width Image */}
                                <Box
                                    sx={{
                                        position: 'relative',
                                        width: '100%',
                                        height: '70vh',
                                        flexShrink: 0,
                                        bgcolor: '#0f0f0f',
                                    }}
                                >
                                    <Image
                                        src={selectedPromotion.image}
                                        alt={selectedPromotion.title}
                                        fill
                                        style={{ objectFit: 'contain' }}
                                        priority
                                        sizes="100vw"
                                    />
                                    {/* Bottom gradient for smooth transition */}
                                    <Box sx={{
                                        position: 'absolute',
                                        bottom: 0,
                                        left: 0,
                                        right: 0,
                                        height: '60px',
                                        background: 'linear-gradient(to top, #1a1a1a 0%, transparent 100%)',
                                        pointerEvents: 'none'
                                    }} />
                                </Box>

                                {/* Bottom: Scrollable Details */}
                                <Box sx={{
                                    flex: 1,
                                    overflowY: 'auto',
                                    p: 3,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 2.5,
                                    bgcolor: '#1a1a1a',
                                    WebkitOverflowScrolling: 'touch'
                                }}>
                                    {/* Header */}
                                    <Box>
                                        <Chip
                                            label={selectedPromotion.period || "Special Offer"}
                                            size="small"
                                            sx={{
                                                bgcolor: 'var(--primary)',
                                                color: 'white',
                                                fontWeight: 600,
                                                mb: 1.5,
                                                fontFamily: 'var(--font-prompt)'
                                            }}
                                        />
                                        <Typography variant="h4" sx={{
                                            fontFamily: 'var(--font-prompt)',
                                            fontWeight: 700,
                                            color: 'white',
                                            fontSize: '1.5rem',
                                            lineHeight: 1.2,
                                            mb: 0.5
                                        }}>
                                            {selectedPromotion.title}
                                        </Typography>
                                        {selectedPromotion.price && (
                                            <Typography sx={{
                                                fontFamily: 'var(--font-prompt)',
                                                fontSize: '1.25rem',
                                                color: 'var(--primary)',
                                                fontWeight: 600
                                            }}>
                                                {selectedPromotion.price}
                                            </Typography>
                                        )}
                                    </Box>

                                    {/* Description */}
                                    <Typography sx={{
                                        fontFamily: 'var(--font-prompt)',
                                        color: 'rgba(255,255,255,0.7)',
                                        fontSize: '0.9rem',
                                        lineHeight: 1.6
                                    }}>
                                        {selectedPromotion.description}
                                    </Typography>

                                    {/* Features Grid */}
                                    <Box sx={{
                                        display: 'grid',
                                        gridTemplateColumns: '1fr 1fr',
                                        gap: 1.5,
                                        bgcolor: 'rgba(255,255,255,0.03)',
                                        p: 2,
                                        borderRadius: 2,
                                        border: '1px solid rgba(255,255,255,0.05)'
                                    }}>
                                        {selectedPromotion.features.map((feature, idx) => (
                                            <Box key={idx}>
                                                <Typography sx={{
                                                    fontFamily: 'var(--font-prompt)',
                                                    fontSize: '0.7rem',
                                                    color: 'rgba(255,255,255,0.5)',
                                                    mb: 0.25
                                                }}>
                                                    {feature.label}
                                                </Typography>
                                                <Typography sx={{
                                                    fontFamily: 'var(--font-prompt)',
                                                    fontSize: '0.95rem',
                                                    color: 'white',
                                                    fontWeight: 500
                                                }}>
                                                    {feature.value}
                                                </Typography>
                                            </Box>
                                        ))}
                                    </Box>

                                </Box>
                            </Box>
                        </>
                    )}
                </Paper>
            </Modal>

        </Box>
    );
}
