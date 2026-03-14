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
    category?: string;
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
        <Box
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={onClick}
            sx={{
                position: 'relative',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
                bgcolor: 'var(--background)',
                '&:hover': {
                    '& .promo-image': {
                        transform: 'scale(1.05)',
                    },
                    '& .promo-title': {
                        color: 'var(--primary)',
                    }
                }
            }}
        >
            {/* Image Container */}
            <Box sx={{
                position: 'relative',
                width: '100%',
                overflow: 'hidden',
                lineHeight: 0,
                borderRadius: 0,
                bgcolor: 'rgba(128,128,128,0.05)',
            }}>
                <Image
                    src={promotion.image}
                    alt={promotion.title}
                    width={800}
                    height={800}
                    priority={priority}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    placeholder="blur"
                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mPo6Oj4HwAE/gLqWTtW2QAAAABJRU5ErkJggg=="
                    className="promo-image"
                    style={{
                        width: '100%',
                        height: 'auto',
                        transition: 'transform 0.8s cubic-bezier(0.2, 0, 0.2, 1)',
                    }}
                />

                {/* Minimal Top Badge */}
                {promotion.period && (
                    <Box sx={{
                        position: 'absolute',
                        top: 12,
                        left: 12,
                        zIndex: 3,
                        bgcolor: 'var(--primary)',
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 1,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                    }}>
                        <Typography sx={{
                            fontFamily: 'var(--font-prompt)',
                            fontSize: '0.65rem',
                            fontWeight: 700,
                            color: 'white',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                        }}>
                            {promotion.period}
                        </Typography>
                    </Box>
                )}
            </Box>

            {/* Content Section - High End Style */}
            <Box sx={{ py: 2.5, px: 0.5 }}>
                <Stack spacing={1.5}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2 }}>
                        <Typography
                            className="promo-title"
                            sx={{
                                fontFamily: 'var(--font-prompt)',
                                fontSize: '1.25rem',
                                fontWeight: 600,
                                color: 'var(--foreground)',
                                lineHeight: 1.3,
                                transition: 'color 0.3s ease',
                                flex: 1
                            }}
                        >
                            {promotion.title}
                        </Typography>
                        {promotion.price && (
                            <Typography sx={{
                                fontFamily: 'var(--font-prompt)',
                                fontSize: '1.1rem',
                                color: 'var(--primary)',
                                fontWeight: 700,
                                whiteSpace: 'nowrap'
                            }}>
                                {formatPrice(promotion.price)}
                            </Typography>
                        )}
                    </Box>

                    <Typography sx={{
                        fontFamily: 'var(--font-prompt)',
                        fontSize: '0.9rem',
                        color: 'var(--foreground)',
                        opacity: 0.6,
                        lineHeight: 1.6,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                    }}>
                        {promotion.description}
                    </Typography>

                    {/* Features Chips */}
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {promotion.features.slice(0, 3).map((feature, idx) => (
                            <Chip
                                key={idx}
                                label={`${feature.label}: ${feature.value}`}
                                size="small"
                                sx={{
                                    fontFamily: 'var(--font-prompt)',
                                    fontSize: '0.7rem',
                                    bgcolor: 'rgba(128,128,128,0.08)',
                                    color: 'var(--foreground)',
                                    borderRadius: 1,
                                    '& .MuiChip-label': { px: 1 }
                                }}
                            />
                        ))}
                        {extraFeaturesCount > 0 && (
                            <Typography sx={{
                                fontFamily: 'var(--font-prompt)',
                                fontSize: '0.7rem',
                                color: 'var(--primary)',
                                fontWeight: 500,
                                display: 'flex',
                                alignItems: 'center'
                            }}>
                                +{extraFeaturesCount} features
                            </Typography>
                        )}
                    </Box>
                </Stack>
            </Box>
        </Box>
    );
}

export default function PromotionsContent({ initialPromotions }: PromotionsContentProps) {
    const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(null);
    const [loading, setLoading] = useState(initialPromotions.length === 0);
    const [activeTab, setActiveTab] = useState('ทั้งหมด');

    // Get unique categories and filter out empty ones
    const categories = ['ทั้งหมด', ...Array.from(new Set(initialPromotions.map(p => p.category).filter(Boolean)))];

    // Filter promotions by category
    const filteredPromotions = activeTab === 'ทั้งหมด'
        ? initialPromotions
        : initialPromotions.filter(p => p.category === activeTab);

    React.useEffect(() => {
        // Since we are using SSR, if we have initial data, we stop loading
        if (initialPromotions.length > 0) {
            setLoading(false);
        } else {
            // If truly empty, we still want to stop the skeleton after mount
            // unless we want to fetch more? Promotions currently don't have a fetch more.
            // So we just stop.
            setLoading(false);
        }
    }, [initialPromotions]);

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
                        columnCount: { xs: 1, sm: 2, md: 3 },
                        columnGap: 2,
                        '& > div': {
                            breakInside: 'avoid',
                            mb: 2
                        }
                    }}>
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <Box key={i} sx={{ mb: 4 }}>
                                <Skeleton
                                    variant="rounded"
                                    width="100%"
                                    height={i % 2 === 0 ? 300 : 450}
                                    sx={{ borderRadius: 2, bgcolor: 'var(--border-color)', opacity: 0.3 }}
                                />
                                <Box sx={{ py: 2 }}>
                                    <Skeleton variant="text" width="80%" height={32} sx={{ mb: 1, bgcolor: 'var(--border-color)', opacity: 0.5 }} />
                                    <Skeleton variant="text" width="100%" height={20} sx={{ bgcolor: 'var(--border-color)', opacity: 0.3 }} />
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

            {/* Category Tabs */}
            {categories.length > 1 && (
                <Container maxWidth="lg">
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: 1.5,
                        mt: 4,
                        mb: 2,
                        flexWrap: 'wrap'
                    }}>
                        {categories.map((cat) => (
                            <Box
                                key={cat as string}
                                onClick={() => setActiveTab(cat as string)}
                                sx={{
                                    px: 3,
                                    py: 1,
                                    borderRadius: 10,
                                    cursor: 'pointer',
                                    fontFamily: 'var(--font-prompt)',
                                    fontSize: '0.9rem',
                                    fontWeight: 500,
                                    transition: 'all 0.3s ease',
                                    bgcolor: activeTab === cat ? 'var(--primary)' : 'rgba(128,128,128,0.05)',
                                    color: activeTab === cat ? 'white' : 'var(--foreground)',
                                    border: '1px solid',
                                    borderColor: activeTab === cat ? 'var(--primary)' : 'rgba(128,128,128,0.1)',
                                    '&:hover': {
                                        bgcolor: activeTab === cat ? 'var(--primary)' : 'rgba(128,128,128,0.1)',
                                    }
                                }}
                            >
                                {cat}
                            </Box>
                        ))}
                    </Box>
                </Container>
            )}

            {/* Content List */}
            <Container maxWidth="lg" sx={{ mt: 8 }}>
                {filteredPromotions.length === 0 ? (
                    <Box sx={{
                        textAlign: 'center',
                        py: 15,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: 'rgba(255,255,255,0.02)',
                        borderRadius: 1,
                        border: '1px dashed rgba(128,128,128,0.2)'
                    }}>
                        <Ticket size="64" color="var(--primary)" variant="Bulk" style={{ opacity: 0.3, marginBottom: 20 }} />
                        <Typography variant="h5" sx={{ fontFamily: 'var(--font-prompt)', color: 'var(--foreground)', fontWeight: 600, mb: 1 }}>
                            {activeTab === 'ทั้งหมด' ? 'ยังไม่มีโปรโมชั่นในขณะนี้' : `ยังไม่มีโปรโมชั่นในกลุ่ม ${activeTab}`}
                        </Typography>
                        <Typography sx={{ fontFamily: 'var(--font-prompt)', color: 'var(--foreground)', opacity: 0.6 }}>
                            เรากำลังจัดเตรียมข้อเสนอสุดพิเศษสำหรับคุณ อดใจรอนิดนะคะ
                        </Typography>
                    </Box>
                ) : (
                    <Box sx={{
                        columnCount: { xs: 1, sm: 2, md: 3 },
                        columnGap: 2,
                        '& > div': {
                            breakInside: 'avoid',
                            mb: 2
                        }
                    }}>
                        {filteredPromotions.map((promo, index) => (
                            <Box key={promo.id}>
                                <PromotionCard
                                    promotion={promo}
                                    onClick={() => setSelectedPromotion(promo)}
                                    priority={index < 3} // First 3 cards get priority loading for LCP
                                />
                            </Box>
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
                        height: '100vh',
                        bgcolor: '#1a1a1a',
                        borderRadius: 0,
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        outline: 'none',
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
                                                {formatPrice(selectedPromotion.price)}
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
                                        borderRadius: 1,
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
                                                {formatPrice(selectedPromotion.price)}
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
                                        borderRadius: 1,
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
