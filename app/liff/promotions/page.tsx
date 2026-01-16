'use client';

import { Container, Typography, Box, TextField, InputAdornment, IconButton, Skeleton, Stack, Button, Chip, Divider } from '@mui/material';
import { useEffect, useState } from 'react';
import { SearchNormal, CloseCircle, Gift, ArrowLeft2, Calendar, Call } from 'iconsax-react';
import { Drawer as VaulDrawer } from 'vaul';
import Link from 'next/link';

interface Promotion {
    id: string;
    title: string;
    description: string;
    image: string;
    price?: string;
    period?: string;
    features?: string;
}

export default function LiffPromotionsPage() {
    const [promotions, setPromotions] = useState<Promotion[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPromo, setSelectedPromo] = useState<Promotion | null>(null);
    const [promoOpen, setPromoOpen] = useState(false);

    useEffect(() => {
        async function loadPromotions() {
            try {
                const res = await fetch('/api/promotions');
                if (res.ok) {
                    const data = await res.json();
                    setPromotions(data);
                }
            } catch (error) {
                console.error('Failed to load promotions:', error);
            } finally {
                setLoading(false);
            }
        }
        loadPromotions();
    }, []);

    const filteredPromotions = promotions.filter(promo =>
        promo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        promo.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleContactClick = () => {
        // Open LINE OA
        window.open('https://line.me/R/ti/p/@setevent', '_blank');
    };

    // Promotion Drawer JSX
    const promotionDrawerJSX = (
        <VaulDrawer.Root open={promoOpen} onOpenChange={setPromoOpen}>
            <VaulDrawer.Portal>
                <VaulDrawer.Overlay
                    style={{
                        position: 'fixed',
                        inset: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.6)',
                        zIndex: 1300,
                    }}
                />
                <VaulDrawer.Content
                    style={{
                        background: 'linear-gradient(180deg, #1E293B 0%, #0F172A 100%)',
                        position: 'fixed',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        borderTopLeftRadius: 28,
                        borderTopRightRadius: 28,
                        maxHeight: '95vh',
                        outline: 'none',
                        zIndex: 1300,
                        color: 'white'
                    }}
                >
                    <VaulDrawer.Title className="sr-only">
                        รายละเอียดโปรโมชั่น
                    </VaulDrawer.Title>
                    <Box sx={{ overflowY: 'auto', maxHeight: '94vh', pb: 4 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 1.5 }}>
                            <Box sx={{ width: 40, height: 4, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.2)' }} />
                        </Box>

                        <Box sx={{ position: 'relative', px: 3, pt: 1, mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="h6" sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 700 }}>
                                โปรโมชั่นพิเศษ
                            </Typography>
                            <IconButton onClick={() => setPromoOpen(false)} size="small" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                                <CloseCircle size={28} />
                            </IconButton>
                        </Box>

                        {selectedPromo && (
                            <Box sx={{ px: 3 }}>
                                {/* Promo Image */}
                                <Box
                                    sx={{
                                        width: '100%',
                                        maxHeight: 450,
                                        borderRadius: 4,
                                        overflow: 'hidden',
                                        mb: 3,
                                        boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
                                        bgcolor: '#0f172a',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <Box
                                        component="img"
                                        src={selectedPromo.image || '/api/placeholder/promo_placeholder.png'}
                                        sx={{
                                            width: '100%',
                                            height: 'auto',
                                            maxHeight: 450,
                                            objectFit: 'contain'
                                        }}
                                    />
                                </Box>

                                {/* Title & Price */}
                                <Box sx={{ mb: 3 }}>
                                    <Box sx={{ display: 'flex', gap: 1, mb: 1.5, flexWrap: 'wrap' }}>
                                        {selectedPromo.period && (
                                            <Chip
                                                label={selectedPromo.period}
                                                size="small"
                                                sx={{
                                                    bgcolor: '#3B82F6',
                                                    color: 'white',
                                                    fontFamily: 'var(--font-prompt)',
                                                    fontWeight: 600
                                                }}
                                            />
                                        )}
                                        <Chip
                                            label="SET EVENT"
                                            size="small"
                                            variant="outlined"
                                            sx={{
                                                color: '#60A5FA',
                                                borderColor: 'rgba(96, 165, 250, 0.3)',
                                                fontFamily: 'var(--font-prompt)',
                                                fontWeight: 500
                                            }}
                                        />
                                    </Box>
                                    <Typography variant="h5" sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 700, mb: 1, lineHeight: 1.3 }}>
                                        {selectedPromo.title}
                                    </Typography>
                                    {selectedPromo.price && (
                                        <Typography sx={{
                                            fontFamily: 'var(--font-prompt)',
                                            fontSize: '1.5rem',
                                            color: '#F59E0B',
                                            fontWeight: 800
                                        }}>
                                            ฿{selectedPromo.price}
                                        </Typography>
                                    )}
                                </Box>

                                <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mb: 3 }} />

                                {/* Description */}
                                <Box sx={{ mb: 4 }}>
                                    <Typography sx={{ fontFamily: 'var(--font-prompt)', color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, fontSize: '1rem' }}>
                                        {selectedPromo.description}
                                    </Typography>
                                </Box>

                                {/* Features Grid */}
                                {selectedPromo.features && (
                                    <Box sx={{ mb: 4 }}>
                                        <Typography sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 600, mb: 2, fontSize: '1rem', color: 'white' }}>
                                            สิ่งที่คุณจะได้รับ ✨
                                        </Typography>
                                        <Box sx={{
                                            display: 'grid',
                                            gridTemplateColumns: '1fr 1fr',
                                            gap: 2
                                        }}>
                                            {(() => {
                                                try {
                                                    const features = typeof selectedPromo.features === 'string'
                                                        ? JSON.parse(selectedPromo.features)
                                                        : selectedPromo.features;

                                                    return Array.isArray(features) && features.map((f: any, idx: number) => (
                                                        <Box
                                                            key={idx}
                                                            sx={{
                                                                bgcolor: 'rgba(255,255,255,0.05)',
                                                                p: 2,
                                                                borderRadius: 3,
                                                                border: '1px solid rgba(255,255,255,0.08)'
                                                            }}
                                                        >
                                                            <Typography sx={{
                                                                fontFamily: 'var(--font-prompt)',
                                                                fontSize: '0.7rem',
                                                                color: 'rgba(255,255,255,0.5)',
                                                                mb: 0.5
                                                            }}>
                                                                {f.label}
                                                            </Typography>
                                                            <Typography sx={{
                                                                fontFamily: 'var(--font-prompt)',
                                                                fontSize: '0.95rem',
                                                                color: 'white',
                                                                fontWeight: 600
                                                            }}>
                                                                {f.value}
                                                            </Typography>
                                                        </Box>
                                                    ));
                                                } catch (e) {
                                                    return null;
                                                }
                                            })()}
                                        </Box>
                                    </Box>
                                )}

                                {/* Call to Action */}
                                <Button
                                    fullWidth
                                    variant="contained"
                                    onClick={() => {
                                        setPromoOpen(false);
                                        handleContactClick();
                                    }}
                                    sx={{
                                        py: 1.8,
                                        borderRadius: 4,
                                        fontFamily: 'var(--font-prompt)',
                                        fontWeight: 700,
                                        fontSize: '1.1rem',
                                        textTransform: 'none',
                                        background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
                                        boxShadow: '0 8px 25px rgba(37, 99, 235, 0.4)',
                                        mt: 2
                                    }}
                                >
                                    สนใจจองโปรโมชั่นนี้
                                </Button>
                            </Box>
                        )}
                    </Box>
                </VaulDrawer.Content>
            </VaulDrawer.Portal>
        </VaulDrawer.Root>
    );

    return (
        <Container maxWidth="sm" sx={{ py: 3, pb: 12, bgcolor: '#FFFFFF', minHeight: '100vh' }}>
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Link href="/liff" style={{ textDecoration: 'none' }}>
                    <IconButton
                        size="small"
                        sx={{
                            bgcolor: '#F1F5F9',
                            '&:hover': { bgcolor: '#E2E8F0' }
                        }}
                    >
                        <ArrowLeft2 size={20} color="#1E293B" />
                    </IconButton>
                </Link>
                <Typography sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 700, fontSize: '1.25rem', color: '#1E293B' }}>
                    🎁 โปรโมชั่นทั้งหมด
                </Typography>
            </Box>

            {/* Search Bar */}
            <TextField
                fullWidth
                placeholder="ค้นหาโปรโมชั่น..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{
                    mb: 3,
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                        bgcolor: '#F8FAFC',
                        fontFamily: 'var(--font-prompt)',
                        color: '#1e293b',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                        '& fieldset': { borderColor: 'rgba(0,0,0,0.08)' },
                        '&:hover fieldset': { borderColor: '#3B82F6' },
                        '&.Mui-focused fieldset': { borderColor: '#3B82F6' },
                    },
                    '& .MuiInputBase-input': { color: '#1e293b' },
                    '& .MuiInputBase-input::placeholder': { color: '#94a3b8', opacity: 1 }
                }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchNormal size={20} color="#94a3b8" />
                        </InputAdornment>
                    ),
                    endAdornment: searchQuery && (
                        <InputAdornment position="end">
                            <IconButton onClick={() => setSearchQuery('')} size="small">
                                <CloseCircle size={18} color="#94a3b8" variant="Bold" />
                            </IconButton>
                        </InputAdornment>
                    )
                }}
            />

            {/* Promotions Grid */}
            {loading ? (
                <Stack spacing={2}>
                    {[1, 2, 3, 4].map((i) => (
                        <Skeleton
                            key={i}
                            variant="rounded"
                            height={200}
                            sx={{ borderRadius: 4, bgcolor: 'rgba(0,0,0,0.06)' }}
                        />
                    ))}
                </Stack>
            ) : filteredPromotions.length === 0 ? (
                <Box sx={{
                    textAlign: 'center',
                    py: 8,
                    px: 3
                }}>
                    <Box sx={{
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        bgcolor: '#FEF3C7',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 3
                    }}>
                        <Gift size={36} color="#F59E0B" variant="Bulk" />
                    </Box>
                    <Typography sx={{
                        fontFamily: 'var(--font-prompt)',
                        fontWeight: 600,
                        fontSize: '1.1rem',
                        color: '#1E293B',
                        mb: 1
                    }}>
                        {searchQuery ? 'ไม่พบโปรโมชั่น' : 'ยังไม่มีโปรโมชั่น'}
                    </Typography>
                    <Typography sx={{
                        fontFamily: 'var(--font-prompt)',
                        fontSize: '0.9rem',
                        color: '#94A3B8'
                    }}>
                        {searchQuery
                            ? `ไม่พบผลลัพธ์สำหรับ "${searchQuery}"`
                            : 'รอติดตามโปรโมชั่นใหม่เร็วๆ นี้'}
                    </Typography>
                </Box>
            ) : (
                <Stack spacing={2.5}>
                    {filteredPromotions.map((promo, idx) => (
                        <Box
                            key={promo.id || idx}
                            onClick={() => {
                                setSelectedPromo(promo);
                                setPromoOpen(true);
                            }}
                            sx={{
                                borderRadius: 5,
                                overflow: 'hidden',
                                boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                position: 'relative',
                                height: 320,
                                '&:active': {
                                    transform: 'scale(0.98)',
                                }
                            }}
                        >
                            {/* Full Background Image */}
                            <Box
                                component="img"
                                src={promo.image || '/api/placeholder/promo_placeholder.png'}
                                sx={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0
                                }}
                            />

                            {/* Period Badge - Top Left */}
                            {promo.period && (
                                <Box sx={{
                                    position: 'absolute',
                                    top: 16,
                                    left: 16,
                                    bgcolor: '#22C55E',
                                    color: 'white',
                                    px: 1.5,
                                    py: 0.6,
                                    borderRadius: 2.5,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.5,
                                    zIndex: 2,
                                    boxShadow: '0 4px 12px rgba(34, 197, 94, 0.4)'
                                }}>
                                    <Calendar size={14} variant="Bold" color="white" />
                                    <Typography sx={{
                                        fontFamily: 'var(--font-prompt)',
                                        fontSize: '0.75rem',
                                        fontWeight: 700
                                    }}>
                                        {promo.period}
                                    </Typography>
                                </Box>
                            )}

                            {/* Bottom Gradient Overlay */}
                            <Box sx={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                height: '70%',
                                background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.7) 40%, rgba(0,0,0,0) 100%)',
                                zIndex: 1
                            }} />

                            {/* Content - Bottom */}
                            <Box sx={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                p: 2.5,
                                zIndex: 2
                            }}>
                                {/* Title & Price Row */}
                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'flex-start',
                                    mb: 1
                                }}>
                                    <Typography sx={{
                                        fontFamily: 'var(--font-prompt)',
                                        fontWeight: 700,
                                        fontSize: '1.25rem',
                                        color: 'white',
                                        lineHeight: 1.3,
                                        textShadow: '0 2px 8px rgba(0,0,0,0.8), 0 1px 3px rgba(0,0,0,0.9)',
                                        flex: 1,
                                        mr: 2
                                    }}>
                                        {promo.title}
                                    </Typography>

                                    {/* Price - Right Side */}
                                    {promo.price && (
                                        <Typography sx={{
                                            fontFamily: 'var(--font-prompt)',
                                            fontSize: '1.4rem',
                                            color: '#FBBF24',
                                            fontWeight: 800,
                                            textShadow: '0 0 20px rgba(251, 191, 36, 0.6)',
                                            whiteSpace: 'nowrap'
                                        }}>
                                            ฿{promo.price}
                                        </Typography>
                                    )}
                                </Box>

                                {/* Description */}
                                <Typography sx={{
                                    fontFamily: 'var(--font-prompt)',
                                    fontSize: '0.9rem',
                                    color: 'rgba(255,255,255,0.95)',
                                    lineHeight: 1.5,
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                    mb: 2,
                                    textShadow: '0 1px 4px rgba(0,0,0,0.7)'
                                }}>
                                    {promo.description}
                                </Typography>

                                {/* Footer - CTA */}
                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    pt: 1.5,
                                    borderTop: '1px solid rgba(255,255,255,0.15)'
                                }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                        <Box sx={{
                                            width: 32,
                                            height: 32,
                                            borderRadius: '50%',
                                            bgcolor: 'transparent',
                                            border: '1px solid rgba(255,255,255,0.2)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            <Gift size={16} variant="Bold" color="white" />
                                        </Box>
                                        <Typography sx={{
                                            fontFamily: 'var(--font-prompt)',
                                            fontSize: '0.85rem',
                                            color: 'white',
                                            fontWeight: 600
                                        }}>
                                            SET EVENT
                                        </Typography>
                                    </Box>
                                    <Box sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 0.5,
                                        color: 'rgba(255,255,255,0.7)',
                                        fontSize: '0.8rem',
                                        fontFamily: 'var(--font-prompt)'
                                    }}>
                                        ดูรายละเอียด →
                                    </Box>
                                </Box>
                            </Box>
                        </Box >
                    ))
                    }
                </Stack >
            )}

            {promotionDrawerJSX}
        </Container >
    );
}
