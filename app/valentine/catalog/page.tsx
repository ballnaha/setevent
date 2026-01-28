"use client";

import React, { useState, useEffect, useRef } from "react";
import { Box, Typography, Container, Card, CardMedia, CardContent, Button, Chip, IconButton, Fade, Grow, Badge, Skeleton, Modal, Paper, Stack } from "@mui/material";
import { Heart, ArrowLeft, DirectRight, ShoppingBag, CloseCircle, TickCircle, ArrowLeft2, ArrowRight2 } from "iconsax-react";
import { useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Zoom } from 'swiper/modules';
import type { Swiper as SwiperType } from "swiper";
import Link from "next/link";
import Image from "next/image";

// Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/zoom';

// ==========================================
// � LUXURY COLOR PALETTE
// ==========================================
const THEME = {
    bg: "#FCF9F9",
    primary: "#8B0000", // Deep Blood Red
    accent: "#D4AF37",  // Luxury Gold
    textMain: "#1A0A0B",
    textSub: "#7C6A6B",
    white: "#FFFFFF",
    pinkSoft: "#FFF0F3"
};

export default function ValentineCatalogPage() {
    const router = useRouter();
    const [selectedCategory, setSelectedCategory] = useState(0);
    const [products, setProducts] = useState<any[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
    const [heroIn, setHeroIn] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);
    const lightboxSwiperRef = useRef<SwiperType | null>(null);

    const categories = React.useMemo(() => {
        const cats = Array.from(new Set(products.map(p => p.category))).filter(Boolean);
        return ["ทั้งหมด", ...cats];
    }, [products]);

    useEffect(() => {
        setHeroIn(true);
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/valentine/products");
            const data = await res.json();
            if (Array.isArray(data) && data.length > 0) {
                setProducts(data);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (selectedCategory === 0) {
            setFilteredProducts(products);
        } else {
            const categoryName = categories[selectedCategory];
            setFilteredProducts(products.filter(p => p.category === categoryName));
        }
    }, [selectedCategory, products, categories]);

    const handleProductClick = (product: any, index: number) => {
        setSelectedItemIndex(index);
        setSelectedProduct(product);
        setModalOpen(true);
    };

    const [selectedItemIndex, setSelectedItemIndex] = useState(0);

    return (
        <Box sx={{
            minHeight: '100dvh',
            bgcolor: THEME.bg,
            color: THEME.textMain,
            pb: 12,
            position: 'relative',
            fontFamily: "var(--font-prompt)"
        }}>
            {/* --- TOP BAR --- */}
            <Box sx={{
                position: 'sticky',
                top: 0,
                zIndex: 100,
                bgcolor: 'rgba(252, 249, 249, 0.8)',
                backdropFilter: 'blur(20px)',
                borderBottom: '1px solid rgba(0,0,0,0.03)',
                px: 2,
                py: 1.5,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <IconButton onClick={() => router.back()} sx={{ color: THEME.textMain }}>
                    <ArrowLeft size="24" />
                </IconButton>
                <Typography variant="h6" sx={{ fontWeight: 900, fontSize: '1.2rem', letterSpacing: '-0.02em', fontFamily: 'var(--font-prompt)' }}>
                    ROSÉ <Box component="span" sx={{ color: THEME.primary }}>BOUTIQUE</Box>
                </Typography>
                <Box width={40} /> {/* Empty box for balancing */}
            </Box>

            {/* --- HERO SECTION --- */}
            <Container maxWidth="md" sx={{ mt: { xs: 4, md: 8 }, mb: { xs: 6, md: 10 } }}>
                <Fade in={heroIn} timeout={1000}>
                    <Box textAlign="center">
                        <Typography sx={{
                            textTransform: 'uppercase',
                            letterSpacing: '0.4em',
                            fontSize: { xs: '0.65rem', md: '0.75rem' },
                            color: THEME.accent,
                            fontWeight: 700,
                            mb: 2
                        }}>
                            Exclusive Collection
                        </Typography>
                        <Typography variant="h2" sx={{
                            fontWeight: 900,
                            fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
                            mb: 2,
                            lineHeight: 1.1,
                            fontFamily: 'var(--font-prompt)'
                        }}>
                            Flowers for <br />
                            <Box component="span" sx={{ fontStyle: 'italic', color: THEME.primary }}>Beloved One</Box>
                        </Typography>
                        <Typography sx={{
                            color: THEME.textSub,
                            maxWidth: { xs: '90%', md: '60%' },
                            mx: 'auto',
                            lineHeight: 1.8,
                            fontSize: { xs: '0.9rem', md: '1.1rem' },
                            fontFamily: 'var(--font-prompt)'
                        }}>
                            เปลี่ยนความรู้สึกให้เป็นช่อดอกไม้ที่สวยงามที่สุด <br /> คัดสรรด้วยความประณีตสำหรับฤดูกาลแห่งรัก
                        </Typography>
                    </Box>
                </Fade>
            </Container>

            {/* --- CATEGORIES --- */}
            <Box sx={{
                overflowX: 'auto',
                whiteSpace: 'nowrap',
                px: { xs: 2, md: 10 },
                mb: { xs: 4, md: 8 },
                scrollbarWidth: 'none',
                '&::-webkit-scrollbar': { display: 'none' },
                display: 'flex',
                justifyContent: { xs: 'flex-start', md: 'center' }
            }}>
                <Box sx={{ display: 'inline-flex', gap: { xs: 1.5, md: 3 } }}>
                    {loading ? (
                        Array.from({ length: 5 }).map((_, i) => (
                            <Skeleton
                                key={i}
                                variant="rounded"
                                width={100}
                                height={42}
                                sx={{ borderRadius: '50px' }}
                            />
                        ))
                    ) : (
                        categories.map((cat, i) => (
                            <Box
                                key={i}
                                onClick={() => setSelectedCategory(i)}
                                sx={{
                                    px: { xs: 3, md: 5 },
                                    py: { xs: 1, md: 1.5 },
                                    borderRadius: '50px',
                                    fontSize: { xs: '0.85rem', md: '1rem' },
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    bgcolor: selectedCategory === i ? THEME.primary : 'transparent',
                                    color: selectedCategory === i ? THEME.white : THEME.textSub,
                                    border: selectedCategory === i ? `1px solid ${THEME.primary}` : '1px solid rgba(0,0,0,0.08)',
                                    boxShadow: selectedCategory === i ? `0 8px 16px ${THEME.primary}33` : 'none',
                                    fontFamily: 'var(--font-prompt)',
                                    '&:active': { transform: 'scale(0.95)' },
                                    '&:hover': {
                                        borderColor: THEME.primary,
                                        color: selectedCategory === i ? THEME.white : THEME.primary
                                    }
                                }}
                            >
                                {cat}
                            </Box>
                        ))
                    )}
                </Box>
            </Box>

            {/* --- PRODUCT FEED (2-Column Luxury Grid) --- */}
            <Container maxWidth="xl">
                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)', xl: 'repeat(5, 1fr)' },
                    gap: { xs: 2.5, sm: 4, md: 5 },
                    px: { xs: 0.5, sm: 2, md: 4 }
                }}>
                    {loading ? (
                        Array.from({ length: 6 }).map((_, i) => (
                            <Box key={i}>
                                <Skeleton
                                    variant="rounded"
                                    sx={{
                                        aspectRatio: '1/1.2',
                                        borderRadius: { xs: '20px', md: '30px' },
                                        mb: 2
                                    }}
                                />
                                <Skeleton width="60%" sx={{ mb: 1 }} />
                                <Skeleton width="80%" sx={{ mb: 2 }} />
                                <Skeleton height={40} sx={{ borderRadius: '12px' }} />
                            </Box>
                        ))
                    ) : (
                        filteredProducts.map((product, index) => (
                            <Grow in={true} key={product.id} timeout={500 + index * 100}>
                                <Card
                                    onClick={() => handleProductClick(product, index)}
                                    sx={{
                                        bgcolor: 'transparent',
                                        boxShadow: 'none',
                                        overflow: 'visible',
                                        border: 'none',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        cursor: 'pointer',
                                        '&:hover .detail-link': { color: THEME.primary, transform: 'translateX(4px)' },
                                        '&:hover .product-image': { transform: 'scale(1.08)' }
                                    }}
                                >
                                    <Box sx={{
                                        position: 'relative',
                                        borderRadius: { xs: '20px', md: '30px' },
                                        overflow: 'hidden',
                                        aspectRatio: '1/1.2',
                                        bgcolor: '#eee',
                                        boxShadow: '0 10px 30px rgba(0,0,0,0.04)'
                                    }}>
                                        <CardMedia
                                            component="img"
                                            className="product-image"
                                            image={product.image || (product.images?.[0]?.url) || ''}
                                            alt={product.name}
                                            sx={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                                transition: 'transform 1.2s cubic-bezier(0.2, 0, 0.2, 1)',
                                            }}
                                        />
                                        {/* ... (HOT label and price tag remains same) ... */}
                                    </Box>

                                    <CardContent sx={{ px: 0.5, pt: 2, pb: 0, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                                        {/* ... (Title and Description) ... */}
                                        <Typography
                                            variant="caption"
                                            className="detail-link"
                                            sx={{
                                                mt: 'auto',
                                                color: THEME.textSub,
                                                fontWeight: 700,
                                                fontFamily: 'var(--font-prompt)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 0.5,
                                                transition: 'all 0.3s ease'
                                            }}
                                        >
                                            <DirectRight size="14" /> ดูรายละเอียดเพิ่มเติม
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grow>
                        ))
                    )}
                </Box>
            </Container>

            {/* --- BRANDS / LOGO FOOTER --- */}
            <Box sx={{ textAlign: 'center', py: 8, opacity: 0.4 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: '0.2em' }}>
                    ROSÉ
                </Typography>
            </Box>

            {/* --- PRODUCT DETAIL MODAL --- */}
            <Modal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: { xs: 0, md: 2 }
                }}
            >
                <Fade in={modalOpen}>
                    <Paper
                        sx={{
                            position: 'relative',
                            width: { xs: '100vw', md: '90vw' },
                            maxWidth: '1200px',
                            height: { xs: '100vh', md: '85vh' },
                            bgcolor: 'white',
                            borderRadius: { xs: 0, md: 4 },
                            overflow: 'hidden',
                            outline: 'none',
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                    >
                        {/* Close Button */}
                        <IconButton
                            onClick={() => setModalOpen(false)}
                            sx={{
                                position: 'absolute',
                                top: { xs: 16, md: 24 },
                                right: { xs: 16, md: 24 },
                                zIndex: 100,
                                bgcolor: 'rgba(255,255,255,0.9)',
                                color: THEME.textMain,
                                backdropFilter: 'blur(10px)',
                                '&:hover': { bgcolor: 'white' },
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                            }}
                        >
                            <CloseCircle size="28" variant="Bold" color="#8B0000" />
                        </IconButton>

                        <Box sx={{
                            flex: 1,
                            display: 'grid',
                            gridTemplateColumns: { xs: '1fr', md: '1.2fr 0.8fr' },
                            height: '100%',
                            overflow: 'hidden'
                        }}>
                            {/* Left Side: Premium Swiper with Zoom */}
                            <Box sx={{
                                bgcolor: '#f8f8f8',
                                position: 'relative',
                                height: { xs: '45vh', md: '100%' },
                                order: { xs: 1, md: 1 }
                            }}>
                                <Swiper
                                    onSwiper={(swiper) => { lightboxSwiperRef.current = swiper; }}
                                    initialSlide={selectedItemIndex}
                                    modules={[Navigation, Pagination, Zoom]}
                                    navigation
                                    pagination={{ clickable: true }}
                                    zoom={{ maxRatio: 3 }}
                                    className="product-modal-swiper"
                                    style={{ height: '100%' }}
                                    onSlideChange={(swiper) => {
                                        setSelectedItemIndex(swiper.activeIndex);
                                        const newProduct = filteredProducts[swiper.activeIndex];
                                        if (newProduct) setSelectedProduct(newProduct);
                                    }}
                                >
                                    {filteredProducts.map((p, i) => (
                                        <SwiperSlide key={p.id}>
                                            <Box className="swiper-zoom-container" sx={{ position: 'relative', width: '100%', height: '100%' }}>
                                                <Image
                                                    src={p.image || (p.images?.[0]?.url) || '/images/placeholder.jpg'}
                                                    alt={p.name}
                                                    fill
                                                    priority={Math.abs(i - selectedItemIndex) <= 1}
                                                    style={{ objectFit: 'contain' }}
                                                />
                                            </Box>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            </Box>

                            {/* Right Side: Product Details */}
                            <Box sx={{
                                p: { xs: 3, md: 6 },
                                overflowY: 'auto',
                                display: 'flex',
                                flexDirection: 'column',
                                bgcolor: 'white',
                                order: { xs: 2, md: 2 },
                                height: { xs: '55vh', md: '100%' }
                            }}>
                                {selectedProduct && (
                                    <>
                                        <Box sx={{ mb: 2, pr: { md: 8 } }}>
                                            <Chip
                                                label={selectedProduct.category}
                                                size="medium"
                                                sx={{
                                                    bgcolor: THEME.pinkSoft,
                                                    color: THEME.primary,
                                                    fontWeight: 700,
                                                    borderRadius: '8px',
                                                    fontFamily: 'var(--font-prompt)'
                                                }}
                                            />
                                        </Box>

                                        <Typography variant="h3" sx={{
                                            fontWeight: 900,
                                            mb: 1,
                                            lineHeight: 1.1,
                                            fontSize: { xs: '1.8rem', md: '2.5rem' },
                                            fontFamily: 'var(--font-prompt)',
                                            color: THEME.textMain,
                                            pr: { md: 5 }
                                        }}>
                                            {selectedProduct.name}
                                        </Typography>

                                        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 2, mb: 4 }}>
                                            <Typography variant="h4" sx={{
                                                fontWeight: 900,
                                                color: THEME.primary,
                                                fontFamily: 'var(--font-prompt)',
                                                fontSize: { xs: '1.5rem', md: '2.2rem' }
                                            }}>
                                                ฿{selectedProduct.price.toLocaleString()}
                                            </Typography>
                                            {selectedProduct.originalPrice && (
                                                <Typography sx={{
                                                    textDecoration: 'line-through',
                                                    color: 'text.disabled',
                                                    fontSize: { xs: '1rem', md: '1.2rem' },
                                                    fontFamily: 'var(--font-prompt)',
                                                    fontWeight: 500
                                                }}>
                                                    ฿{selectedProduct.originalPrice.toLocaleString()}
                                                </Typography>
                                            )}
                                        </Box>

                                        <Typography sx={{
                                            fontFamily: 'var(--font-prompt)',
                                            color: THEME.textSub,
                                            lineHeight: 1.8,
                                            mb: 5,
                                            fontSize: '1.05rem',
                                            flex: 1
                                        }}>
                                            {selectedProduct.description}
                                        </Typography>

                                        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 4 }}>
                                            <Box sx={{ p: 2, bgcolor: '#f8f8f8', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                <TickCircle size="24" color={THEME.primary} variant="Bold" />
                                                <Typography sx={{ fontSize: '0.9rem', fontWeight: 700 }}>Exclusive Design</Typography>
                                            </Box>
                                            <Box sx={{ p: 2, bgcolor: '#f8f8f8', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                <TickCircle size="24" color={THEME.primary} variant="Bold" />
                                                <Typography sx={{ fontSize: '0.9rem', fontWeight: 700 }}>Fresh Daily</Typography>
                                            </Box>
                                        </Box>

                                        <Box sx={{
                                            mt: 'auto',
                                            p: 2.5,
                                            borderRadius: 3,
                                            bgcolor: '#fff9fa',
                                            border: '1px dashed #ffdce3',
                                            textAlign: 'center'
                                        }}>
                                            <Typography variant="body2" color="text.disabled" sx={{
                                                fontFamily: 'var(--font-prompt)',
                                                fontStyle: 'italic',
                                                color: THEME.primary,
                                                fontWeight: 600
                                            }}>
                                                * สินค้าชุดนี้มีไว้สำหรับแสดงเพื่อประกอบการตัดสินใจเท่านั้น *
                                            </Typography>
                                        </Box>
                                    </>
                                )}
                            </Box>
                        </Box>
                    </Paper>
                </Fade>
            </Modal>

            <style jsx global>{`
                body {
                    background-color: #FCF9F9;
                    font-family: var(--font-prompt) !important;
                }

                .product-modal-swiper .swiper-button-next,
                .product-modal-swiper .swiper-button-prev {
                    color: ${THEME.primary};
                    background: rgba(255,255,255,0.8);
                    width: 44px;
                    height: 44px;
                    border-radius: 50%;
                    backdrop-filter: blur(4px);
                }

                .product-modal-swiper .swiper-button-next:after,
                .product-modal-swiper .swiper-button-prev:after {
                    font-size: 18px;
                    font-weight: bold;
                }

                .product-modal-swiper .swiper-pagination-bullet-active {
                    background: ${THEME.primary};
                }
            `}</style>
        </Box>
    );
}
