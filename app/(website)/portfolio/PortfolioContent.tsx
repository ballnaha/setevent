"use client";

import React, { useState, useEffect, useRef } from "react";
import { Box, Container, Typography, IconButton, Chip, Modal, Paper, Skeleton, Stack } from "@mui/material";
import { CloseCircle, Gallery, Heart, Eye, ArrowLeft2, ArrowRight2 } from "iconsax-react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectCoverflow } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";

// Portfolio interface
interface PortfolioItem {
    id: string;
    title: string;
    category: string;
    image: string;
    likes: number;
    views: number;
}

// Default categories - will be merged with categories from DB
const DEFAULT_CATEGORIES = [
    "Marketing Event",
    "Seminar & Conference",
    "Exhibition",
    "Concert",
    "Wedding",
    "Fixed Installation",
];

export default function PortfolioContent() {
    const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
    const [lightboxIndex, setLightboxIndex] = useState(0);
    const swiperRef = useRef<SwiperType | null>(null);
    const lightboxSwiperRef = useRef<SwiperType | null>(null);

    useEffect(() => {
        fetchPortfolios();
    }, []);

    const fetchPortfolios = async () => {
        try {
            const res = await fetch('/api/portfolios');
            if (res.ok) {
                const data = await res.json();
                setPortfolioItems(data);
            }
        } catch (error) {
            console.error('Error fetching portfolios:', error);
        } finally {
            setLoading(false);
        }
    };

    // Get all unique categories from portfolios + default categories
    const allCategories = React.useMemo(() => {
        const categoriesFromData = portfolioItems.map(p => p.category);
        const uniqueCategories = Array.from(new Set([...DEFAULT_CATEGORIES, ...categoriesFromData]));
        return ["All", ...uniqueCategories.sort()];
    }, [portfolioItems]);

    const filteredItems = selectedCategory === "All"
        ? portfolioItems
        : portfolioItems.filter((d: PortfolioItem) => d.category === selectedCategory);

    const openLightbox = (item: PortfolioItem, index: number) => {
        setLightboxIndex(index);
        setSelectedItem(item);
    };

    const closeLightbox = () => {
        setSelectedItem(null);
    };

    return (
        <Box sx={{ bgcolor: "var(--background)", minHeight: "100vh", pb: 10 }}>
            {/* Header Section with Geometric background */}
            <Box sx={{
                pt: { xs: 15, md: 22 },
                pb: { xs: 8, md: 10 },
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Background Decor */}
                <Box sx={{
                    position: 'absolute',
                    top: '-20%',
                    right: '-10%',
                    width: '600px',
                    height: '600px',
                    background: 'radial-gradient(circle, rgba(10, 92, 90, 0.15) 0%, rgba(0,0,0,0) 70%)',
                    filter: 'blur(60px)',
                    zIndex: 0
                }} />
                <Box sx={{
                    position: 'absolute',
                    bottom: '-10%',
                    left: '-10%',
                    width: '500px',
                    height: '500px',
                    background: 'radial-gradient(circle, rgba(233, 69, 96, 0.1) 0%, rgba(0,0,0,0) 70%)',
                    filter: 'blur(60px)',
                    zIndex: 0
                }} />

                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                    <Stack spacing={3} alignItems="center">
                        <Chip
                            label="Our Masterpieces"
                            sx={{
                                bgcolor: 'rgba(10, 92, 90, 0.1)',
                                color: 'var(--primary)',
                                border: '1px solid rgba(10, 92, 90, 0.2)',
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
                                letterSpacing: '-1px'
                            }}
                        >
                            FEATURED <br />
                            <span style={{
                                background: 'linear-gradient(90deg, #0A5C5A 0%, #00C2CB 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}>
                                PORTFOLIO
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
                            ผลงานที่ผ่านมาของเรา สะท้อนคุณภาพและความเชี่ยวชาญในการเนรมิตงานอีเวนต์ทุกรูปแบบให้เป็นจริง
                        </Typography>
                    </Stack>
                </Container>
            </Box>

            {/* Category Filter */}
            <Container maxWidth="lg" sx={{ mt: { xs: 3, md: 5 } }}>
                <Box sx={{
                    display: 'flex',
                    gap: 1.5,
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    mb: { xs: 3, md: 5 }
                }}>
                    {allCategories.map((cat: string) => (
                        <Chip
                            key={cat}
                            label={cat}
                            onClick={() => setSelectedCategory(cat)}
                            sx={{
                                px: 1,
                                py: 2.5,
                                fontFamily: 'var(--font-prompt)',
                                fontWeight: 500,
                                fontSize: '0.9rem',
                                bgcolor: selectedCategory === cat ? 'var(--primary)' : 'transparent',
                                color: selectedCategory === cat ? 'white' : 'var(--foreground)',
                                border: '1px solid',
                                borderColor: selectedCategory === cat ? 'var(--primary)' : 'rgba(128,128,128,0.4)',
                                boxShadow: selectedCategory === cat ? '0 4px 12px rgba(10, 92, 90, 0.3)' : 'none',
                                transition: 'all 0.3s ease',
                                opacity: selectedCategory === cat ? 1 : 0.8,
                                '&:hover': {
                                    bgcolor: selectedCategory === cat ? 'var(--primary)' : 'rgba(128,128,128,0.15)',
                                    transform: 'translateY(-2px)',
                                    opacity: 1
                                }
                            }}
                        />
                    ))}
                </Box>

                {/* Masonry Gallery */}
                {loading ? (
                    <Box sx={{ columnCount: { xs: 1, sm: 2, md: 3 }, gap: 2 }}>
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <Skeleton key={i} variant="rounded" height={300} sx={{ mb: 2, borderRadius: 3, width: '100%' }} />
                        ))}
                    </Box>
                ) : filteredItems.length === 0 ? (
                    <Box sx={{
                        py: 12,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        bgcolor: 'rgba(0,0,0,0.02)',
                        borderRadius: 4,
                    }}>
                        <Gallery size="64" color="rgba(0,0,0,0.15)" variant="Bulk" />
                        <Typography
                            sx={{
                                mt: 2,
                                fontFamily: 'var(--font-prompt)',
                                color: 'text.secondary',
                                fontSize: '1.1rem',
                            }}
                        >
                            ไม่พบผลงานในหมวดหมู่นี้
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
                        {filteredItems.map((item, idx) => (
                            <Box
                                key={item.id}
                                onClick={() => openLightbox(item, idx)}
                                sx={{
                                    position: 'relative',
                                    borderRadius: 3,
                                    overflow: 'hidden',
                                    cursor: 'pointer',
                                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                                    transition: 'all 0.4s ease',
                                    '&:hover': {
                                        transform: 'translateY(-5px)',
                                        boxShadow: '0 12px 30px rgba(0,0,0,0.2)',
                                    },
                                    '&:hover img': {
                                        transform: 'scale(1.1)',
                                    },
                                    '&:hover .overlay': {
                                        opacity: 1
                                    }
                                }}
                            >
                                <Box sx={{ position: 'relative', width: '100%', lineHeight: 0 }}>
                                    <img
                                        src={item.image || '/images/placeholder.jpg'}
                                        alt={item.title}
                                        loading="lazy"
                                        style={{
                                            width: '100%',
                                            height: 'auto',
                                            display: 'block',
                                            transition: 'transform 0.6s ease'
                                        }}
                                    />
                                </Box>

                                {/* Gradient Overlay - Desktop: Hover, Mobile: Gradient */}
                                <Box className="overlay" sx={{
                                    position: 'absolute',
                                    inset: 0,
                                    background: {
                                        xs: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)',
                                        md: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 100%)' // Full overlay on hover for desktop
                                    },
                                    opacity: { xs: 1, md: 0 },
                                    transition: 'opacity 0.3s ease',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'flex-end',
                                    p: { xs: 2, md: 3 }
                                }}>
                                    <Chip
                                        label={item.category}
                                        size="small"
                                        sx={{
                                            alignSelf: 'flex-start',
                                            mb: 1,
                                            bgcolor: 'var(--primary)',
                                            color: 'white',
                                            fontFamily: 'var(--font-prompt)',
                                            fontWeight: 600,
                                            fontSize: { xs: '0.7rem', md: '0.75rem' },
                                            height: { xs: 24, md: 28 }
                                        }}
                                    />
                                    <Typography
                                        sx={{
                                            fontFamily: 'var(--font-prompt)',
                                            fontWeight: 600,
                                            fontSize: { xs: '1rem', md: '1.25rem' },
                                            color: 'white',
                                            lineHeight: 1.3,
                                            mb: 1,
                                            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                                        }}
                                    >
                                        {item.title}
                                    </Typography>

                                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            <Heart size="16" color="#ef4444" variant="Bold" />
                                            <Typography sx={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.85rem' }}>
                                                {item.likes}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            <Eye size="16" color="rgba(255,255,255,0.9)" />
                                            <Typography sx={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.85rem' }}>
                                                {item.views}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                        ))}
                    </Box>
                )}
            </Container>

            {/* Lightbox Modal */}
            <Modal
                open={!!selectedItem}
                onClose={closeLightbox}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Box sx={{
                    position: 'relative',
                    width: '95vw',
                    maxWidth: 1200,
                    height: '90vh',
                    bgcolor: 'transparent',
                    outline: 'none',
                }}>
                    {/* Close Button */}
                    <IconButton
                        onClick={closeLightbox}
                        sx={{
                            position: 'absolute',
                            top: 10,
                            right: 10,
                            zIndex: 100,
                            bgcolor: 'rgba(0,0,0,0.5)',
                            color: 'white',
                            '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' },
                        }}
                    >
                        <CloseCircle size="28" color="white" />
                    </IconButton>

                    {/* Lightbox Swiper */}
                    <Swiper
                        onSwiper={(swiper) => { lightboxSwiperRef.current = swiper; }}
                        modules={[Navigation, Pagination]}
                        initialSlide={lightboxIndex}
                        navigation
                        pagination={{ clickable: true }}
                        loop={filteredItems.length > 1}
                        style={{ height: '100%', borderRadius: 16 }}
                    >
                        {filteredItems.map((item) => (
                            <SwiperSlide key={item.id}>
                                <Box sx={{
                                    position: 'relative',
                                    width: '100%',
                                    height: '100%',
                                    bgcolor: '#000',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    <Image
                                        src={item.image || '/images/placeholder.jpg'}
                                        alt={item.title}
                                        fill
                                        style={{ objectFit: 'contain' }}
                                    />
                                    {/* Title Overlay */}
                                    <Box sx={{
                                        position: 'absolute',
                                        bottom: 0,
                                        left: 0,
                                        right: 0,
                                        p: 3,
                                        background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                                    }}>
                                        <Typography
                                            sx={{
                                                fontFamily: 'var(--font-prompt)',
                                                fontWeight: 600,
                                                fontSize: '1.5rem',
                                                color: 'white',
                                            }}
                                        >
                                            {item.title}
                                        </Typography>
                                        <Chip
                                            label={item.category}
                                            size="small"
                                            sx={{
                                                mt: 1,
                                                bgcolor: 'var(--primary)',
                                                color: 'white',
                                                fontFamily: 'var(--font-prompt)',
                                            }}
                                        />
                                    </Box>
                                </Box>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </Box>
            </Modal>
        </Box>
    );
}
