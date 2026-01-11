"use client";

import React, { useState, useEffect, useRef } from "react";
import { Box, Container, Typography, IconButton, Chip, Modal, Paper, Skeleton } from "@mui/material";
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
            {/* Hero Section - Soft Dark (Same as contact page) */}
            <Box sx={{
                position: 'relative',
                minHeight: { xs: '280px', md: '400px' },
                bgcolor: '#1a1a1a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                py: { xs: 8, md: 0 }
            }}>
                {/* Soft Dark Gradient Background */}
                <Box sx={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)',
                }} />

                {/* Diagonal Lines Pattern */}
                <Box sx={{
                    position: 'absolute',
                    inset: 0,
                    opacity: 0.08,
                    backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.15) 10px, rgba(255,255,255,0.15) 11px)',
                }} />

                {/* Subtle Accent */}
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: { xs: '300px', md: '600px' },
                    height: { xs: '300px', md: '600px' },
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(10, 92, 90, 0.15) 0%, transparent 70%)',
                    filter: 'blur(40px)',
                }} />

                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                    <Typography sx={{
                        fontFamily: 'var(--font-prompt)',
                        fontWeight: 700,
                        color: 'white',
                        fontSize: { xs: '2.5rem', md: '4rem' },
                        lineHeight: 1.2,
                        mb: 2
                    }}>
                        PORTFOLIO
                    </Typography>
                    <Typography sx={{
                        fontFamily: 'var(--font-prompt)',
                        color: 'rgba(255,255,255,0.7)',
                        fontWeight: 300,
                        fontSize: { xs: '1rem', md: '1.25rem' },
                        maxWidth: '500px',
                        mx: 'auto'
                    }}>
                        ผลงานที่ผ่านมาของเรา สะท้อนคุณภาพและความเชี่ยวชาญ
                    </Typography>
                </Container>
            </Box>

            {/* Category Filter */}
            <Container maxWidth="lg" sx={{ mt: 5 }}>
                <Box sx={{
                    display: 'flex',
                    gap: 1.5,
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    mb: 5
                }}>
                    {allCategories.map((cat: string) => (
                        <Chip
                            key={cat}
                            label={cat}
                            onClick={() => setSelectedCategory(cat)}
                            sx={{
                                px: 2,
                                py: 2.5,
                                fontFamily: 'var(--font-prompt)',
                                fontWeight: 500,
                                fontSize: '0.9rem',
                                bgcolor: selectedCategory === cat ? 'var(--primary)' : 'rgba(0,0,0,0.04)',
                                color: selectedCategory === cat ? 'white' : 'text.secondary',
                                border: selectedCategory === cat ? 'none' : '1px solid rgba(0,0,0,0.08)',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    bgcolor: selectedCategory === cat ? 'var(--primary)' : 'rgba(0,0,0,0.08)',
                                    transform: 'translateY(-2px)',
                                }
                            }}
                        />
                    ))}
                </Box>

                {/* Swiper Gallery */}
                {loading ? (
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                        {[1, 2, 3].map((i) => (
                            <Skeleton key={i} variant="rounded" width={350} height={280} sx={{ borderRadius: 3 }} />
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
                    <Box sx={{ position: 'relative', px: { xs: 0, md: 6 } }}>
                        {/* Custom Navigation Buttons */}
                        <IconButton
                            onClick={() => swiperRef.current?.slidePrev()}
                            sx={{
                                position: 'absolute',
                                left: { xs: -8, md: 0 },
                                top: '50%',
                                transform: 'translateY(-50%)',
                                zIndex: 10,
                                bgcolor: 'white',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                                '&:hover': { bgcolor: 'var(--primary)', color: 'white' },
                            }}
                        >
                            <ArrowLeft2 size="24" />
                        </IconButton>
                        <IconButton
                            onClick={() => swiperRef.current?.slideNext()}
                            sx={{
                                position: 'absolute',
                                right: { xs: -8, md: 0 },
                                top: '50%',
                                transform: 'translateY(-50%)',
                                zIndex: 10,
                                bgcolor: 'white',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                                '&:hover': { bgcolor: 'var(--primary)', color: 'white' },
                            }}
                        >
                            <ArrowRight2 size="24" />
                        </IconButton>

                        <Swiper
                            onSwiper={(swiper) => { swiperRef.current = swiper; }}
                            modules={[Navigation, Pagination, Autoplay, EffectCoverflow]}
                            effect="coverflow"
                            grabCursor={true}
                            centeredSlides={true}
                            slidesPerView="auto"
                            coverflowEffect={{
                                rotate: 0,
                                stretch: 0,
                                depth: 100,
                                modifier: 2.5,
                                slideShadows: false,
                            }}
                            autoplay={{
                                delay: 4000,
                                disableOnInteraction: false,
                            }}
                            pagination={{
                                clickable: true,
                                dynamicBullets: true,
                            }}
                            loop={filteredItems.length > 3}
                            spaceBetween={30}
                            style={{ paddingBottom: 50, paddingTop: 20 }}
                        >
                            {filteredItems.map((item, idx) => (
                                <SwiperSlide key={item.id} style={{ width: 350, maxWidth: '90vw' }}>
                                    <Paper
                                        onClick={() => openLightbox(item, idx)}
                                        sx={{
                                            position: 'relative',
                                            height: 280,
                                            borderRadius: 3,
                                            overflow: 'hidden',
                                            cursor: 'pointer',
                                            boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                                            transition: 'all 0.4s ease',
                                            '&:hover': {
                                                transform: 'translateY(-8px)',
                                                boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
                                            },
                                            '&:hover img': {
                                                transform: 'scale(1.1)',
                                            },
                                        }}
                                    >
                                        <Box sx={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
                                            <Image
                                                src={item.image || '/images/placeholder.jpg'}
                                                alt={item.title}
                                                fill
                                                style={{ objectFit: 'cover', transition: 'transform 0.6s ease' }}
                                            />
                                        </Box>

                                        {/* Gradient Overlay */}
                                        <Box sx={{
                                            position: 'absolute',
                                            inset: 0,
                                            background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)',
                                        }} />

                                        {/* Category Badge */}
                                        <Chip
                                            label={item.category}
                                            size="small"
                                            sx={{
                                                position: 'absolute',
                                                top: 16,
                                                left: 16,
                                                bgcolor: 'rgba(255,255,255,0.95)',
                                                color: 'var(--primary)',
                                                fontFamily: 'var(--font-prompt)',
                                                fontWeight: 600,
                                                fontSize: '0.75rem',
                                            }}
                                        />

                                        {/* Content */}
                                        <Box sx={{
                                            position: 'absolute',
                                            bottom: 0,
                                            left: 0,
                                            right: 0,
                                            p: 2.5,
                                        }}>
                                            <Typography
                                                sx={{
                                                    fontFamily: 'var(--font-prompt)',
                                                    fontWeight: 600,
                                                    fontSize: '1.1rem',
                                                    color: 'white',
                                                    mb: 1,
                                                }}
                                            >
                                                {item.title}
                                            </Typography>
                                            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <Heart size="16" color="#ef4444" variant="Bold" />
                                                    <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem' }}>
                                                        {item.likes}
                                                    </Typography>
                                                </Box>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <Eye size="16" color="rgba(255,255,255,0.8)" />
                                                    <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem' }}>
                                                        {item.views}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Paper>
                                </SwiperSlide>
                            ))}
                        </Swiper>
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
                        <CloseCircle size="28" />
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
