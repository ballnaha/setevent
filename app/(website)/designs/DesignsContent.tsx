"use client";

import React, { useState, useEffect, useRef } from "react";
import { Box, Container, Typography, IconButton, Chip, Modal, Paper, Skeleton, Stack, Button } from "@mui/material";
import { CloseCircle, Gallery, Heart, Eye, ArrowLeft2, ArrowRight2 } from "iconsax-react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectCoverflow, Zoom } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import "swiper/css/zoom";

// Design interface
interface Design {
    id: string;
    title: string;
    category: string;
    image: string;
    likes: number;
    views: number;
}

// Categories are now dynamically derived from the database data.
// Empty categories will automatically disappear from the filters.

export default function DesignsContent({ initialData = [] }: { initialData?: Design[] }) {
    const [designs, setDesigns] = useState<Design[]>(initialData);
    const [loading, setLoading] = useState(initialData.length === 0);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedItem, setSelectedItem] = useState<Design | null>(null);
    const [lightboxIndex, setLightboxIndex] = useState(0);
    const [activeLightboxIndex, setActiveLightboxIndex] = useState(0);
    const [likedItems, setLikedItems] = useState<Set<string>>(new Set());
    const swiperRef = useRef<SwiperType | null>(null);
    const lightboxSwiperRef = useRef<SwiperType | null>(null);

    useEffect(() => {
        if (initialData.length === 0) {
            fetchDesigns();
        }
        // Load liked items from local storage
        const savedLikes = localStorage.getItem('likedDesigns');
        if (savedLikes) {
            setLikedItems(new Set(JSON.parse(savedLikes)));
        }
    }, [initialData]);

    const fetchDesigns = async () => {
        try {
            const res = await fetch('/api/designs', { cache: 'no-store' });
            if (res.ok) {
                const data = await res.json();
                setDesigns(data);
            }
        } catch (error) {
            console.error('Error fetching designs:', error);
        } finally {
            setLoading(false);
        }
    };

    // Get all unique categories from designs
    const allCategories = React.useMemo(() => {
        const categoriesFromData = designs.map(d => d.category);
        const uniqueCategories = Array.from(new Set(categoriesFromData));
        return ["All", ...uniqueCategories.sort()];
    }, [designs]);

    const filteredItems = selectedCategory === "All"
        ? designs
        : designs.filter((d: Design) => d.category === selectedCategory);

    const handleView = async (id: string) => {
        try {
            await fetch(`/api/designs/${id}/view`, { method: 'POST' });
            // Update local state for view count
            setDesigns(prev => prev.map(d =>
                d.id === id ? { ...d, views: d.views + 1 } : d
            ));
        } catch (error) {
            console.error("Failed to count view", error);
        }
    };

    const handleLike = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation(); // Prevent opening lightbox

        const isLiked = likedItems.has(id);
        const action = isLiked ? 'unlike' : 'like';
        const incrementValue = isLiked ? -1 : 1;

        // Optimistic update status
        const newLikedItems = new Set(likedItems);
        if (isLiked) {
            newLikedItems.delete(id);
        } else {
            newLikedItems.add(id);
        }
        setLikedItems(newLikedItems);
        localStorage.setItem('likedDesigns', JSON.stringify(Array.from(newLikedItems)));

        // Optimistic update count
        setDesigns(prev => prev.map(d =>
            d.id === id ? { ...d, likes: Math.max(0, d.likes + incrementValue) } : d
        ));

        try {
            await fetch(`/api/designs/${id}/like?action=${action}`, { method: 'POST' });
        } catch (error) {
            console.error("Failed to toggle like", error);
        }
    };

    const openLightbox = (item: Design, index: number) => {
        setLightboxIndex(index);
        setActiveLightboxIndex(index);
        setSelectedItem(item);
        handleView(item.id);
    };

    const closeLightbox = () => {
        setSelectedItem(null);
    };

    return (
        <Box sx={{ bgcolor: 'var(--background)', minHeight: '100vh', pb: 10, overflow: 'hidden' }}>
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
                    background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, rgba(139, 92, 246, 0) 70%)',
                    filter: 'blur(60px)',
                    zIndex: 0
                }} />
                <Box sx={{
                    position: 'absolute',
                    bottom: '-10%',
                    left: '-10%',
                    width: '500px',
                    height: '500px',
                    background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0) 70%)',
                    filter: 'blur(60px)',
                    zIndex: 0
                }} />

                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                    <Stack spacing={3} alignItems="center">
                        <Chip
                            label="SetEvent Gallery"
                            sx={{
                                bgcolor: 'rgba(139, 92, 246, 0.1)',
                                color: '#8B5CF6',
                                border: '1px solid rgba(139, 92, 246, 0.2)',
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
                            CREATIVE <br />
                            <span style={{
                                background: 'linear-gradient(90deg, #8B5CF6 0%, #3B82F6 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}>
                                DESIGNS
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
                            รวบรวมไอเดียการออกแบบเวที แสง สี เสียง และโครงสร้างสำหรับงานอีเวนต์ทุกรูปแบบ เพื่อสร้างแรงบันดาลใจให้กับงานของคุณ
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
                                bgcolor: selectedCategory === cat ? '#8B5CF6' : 'transparent',
                                color: selectedCategory === cat ? 'white' : 'var(--foreground)',
                                border: '1px solid',
                                borderColor: selectedCategory === cat ? '#8B5CF6' : 'rgba(128,128,128,0.4)',
                                boxShadow: selectedCategory === cat ? '0 4px 12px rgba(139, 92, 246, 0.3)' : 'none',
                                transition: 'all 0.3s ease',
                                opacity: selectedCategory === cat ? 1 : 0.8,
                                '&:hover': {
                                    bgcolor: selectedCategory === cat ? '#8B5CF6' : 'rgba(128,128,128,0.15)',
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
                            <Skeleton key={i} variant="rounded" height={300} sx={{ mb: 2, borderRadius: 3, width: '100%', bgcolor: 'rgba(224,224,224,0.4)', animation: 'pulse 1.5s ease-in-out infinite' }} />
                        ))}
                    </Box>
                ) : filteredItems.length === 0 ? (
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
                        <Gallery size="64" color="#8B5CF6" variant="Bulk" style={{ opacity: 0.3, marginBottom: 20 }} />
                        <Typography variant="h5" sx={{ fontFamily: 'var(--font-prompt)', color: 'var(--foreground)', fontWeight: 600, mb: 1 }}>
                            {selectedCategory !== "All" ? "ไม่พบดีไซน์ในหมวดหมู่นี้" : "ยังไม่มีดีไซน์ในขณะนี้"}
                        </Typography>
                        <Typography sx={{ fontFamily: 'var(--font-prompt)', color: 'var(--foreground)', opacity: 0.6 }}>
                            {selectedCategory !== "All" ? "ลองเลือกหมวดหมู่อื่นๆ ดูนะคะ" : "ทีมงานกำลังออกแบบไอเดียใหม่ๆ มาให้ชม เร็วๆ นี้แน่นอนค่ะ"}
                        </Typography>
                        {selectedCategory !== "All" && (
                            <Button
                                onClick={() => setSelectedCategory('All')}
                                sx={{ mt: 3, fontFamily: 'var(--font-prompt)', color: '#8B5CF6' }}
                            >
                                ดูดีไซน์ทั้งหมด
                            </Button>
                        )}
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
                                    '&:hover .design-image': {
                                        transform: 'scale(1.1)',
                                    },
                                    '&:hover .overlay': {
                                        opacity: 1
                                    }
                                }}
                            >
                                <Box sx={{ position: 'relative', width: '100%', borderRadius: 'inherit', bgcolor: '#e0e0e0' }}>
                                    <Image
                                        src={item.image || '/images/placeholder.jpg'}
                                        alt={item.title}
                                        className="design-image"
                                        width={500}
                                        height={500}
                                        loading={idx < 6 ? 'eager' : 'lazy'}
                                        placeholder="blur"
                                        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mPo6Oj4HwAE/gLqWTtW2QAAAABJRU5ErkJggg=="
                                        style={{
                                            width: '100%',
                                            height: 'auto',
                                            display: 'block',
                                            transition: 'transform 0.6s ease'
                                        }}
                                    />
                                </Box>

                                {/* Gradient Overlay - Always Visible */}
                                <Box className="overlay" sx={{
                                    position: 'absolute',
                                    inset: 0,
                                    background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)',
                                    opacity: 1,
                                    transition: 'opacity 0.3s ease',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'flex-end',
                                    p: 2
                                }}>
                                    <Chip
                                        label={item.category}
                                        size="small"
                                        sx={{
                                            alignSelf: 'flex-start',
                                            mb: 1,
                                            bgcolor: '#8B5CF6',
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
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 0.5,
                                                cursor: 'pointer',
                                                transition: 'transform 0.2s',
                                                '&:hover': { transform: 'scale(1.1)' }
                                            }}
                                            onClick={(e) => handleLike(e, item.id)}
                                        >
                                            <Heart
                                                size="16"
                                                color={likedItems.has(item.id) ? "#ef4444" : "white"}
                                                variant={likedItems.has(item.id) ? "Bold" : "Linear"}
                                            />
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
                    width: { xs: '100vw', md: '95vw' },
                    maxWidth: 1200,
                    height: { xs: '100vh', md: '90vh' },
                    bgcolor: 'transparent',
                    outline: 'none',
                }}>
                    {/* Close Button */}
                    <IconButton
                        onClick={closeLightbox}
                        sx={{
                            position: 'absolute',
                            top: { xs: 48, md: 24 },
                            right: { xs: 24, md: 24 },
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
                        onSlideChange={(swiper) => setActiveLightboxIndex(swiper.realIndex)}
                        modules={[Navigation, Pagination, Zoom]}
                        initialSlide={lightboxIndex}
                        navigation
                        pagination={{ clickable: true }}
                        zoom={{ maxRatio: 3 }}
                        loop={filteredItems.length > 1}
                        style={{ height: '100%', borderRadius: typeof window !== 'undefined' && window.innerWidth < 768 ? 0 : 16 }}
                    >
                        {filteredItems.map((item, idx) => (
                            <SwiperSlide key={item.id}>
                                <Box sx={{
                                    position: 'relative',
                                    width: '100%',
                                    height: '100%',
                                    bgcolor: '#000',
                                    overflow: 'hidden'
                                }}>

                                    <div className="swiper-zoom-container" style={{ width: '100%', height: '100%' }}>
                                        <Image
                                            src={item.image || '/images/placeholder.jpg'}
                                            alt={item.title}
                                            fill
                                            priority={Math.abs(idx - activeLightboxIndex) <= 1}
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                                            style={{
                                                objectFit: 'contain',
                                                zIndex: 2
                                            }}
                                            onLoadingComplete={(img) => {
                                                const parent = img.closest('.MuiBox-root');
                                                if (parent) {
                                                    const skeleton = parent.querySelector('.skeleton-loader');
                                                    if (skeleton) (skeleton as HTMLElement).style.display = 'none';
                                                }
                                            }}
                                        />
                                    </div>

                                    {/* Image Loading State - Outside zoom container */}
                                    <Box className="skeleton-loader" sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'rgba(0,0,0,0.1)', zIndex: 1, pointerEvents: 'none' }}>
                                        <Skeleton
                                            variant="rectangular"
                                            width="100%"
                                            height="100%"
                                            sx={{
                                                bgcolor: 'rgba(255,255,255,0.05)',
                                                position: 'absolute'
                                            }}
                                        />
                                        <Typography sx={{ color: 'white', opacity: 0.3, fontFamily: 'var(--font-prompt)', zIndex: 1 }}>
                                            Loading...
                                        </Typography>
                                    </Box>

                                    {/* Title Overlay - Outside zoom container */}
                                    <Box sx={{
                                        position: 'absolute',
                                        bottom: 0,
                                        left: 0,
                                        right: 0,
                                        p: { xs: 4, md: 4 },
                                        pb: { xs: 8, md: 4 },
                                        zIndex: 10,
                                        background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)',
                                        pointerEvents: 'none' // Allow touches to pass through mostly, but maybe we want text selection? Usually for lightbox overlays pointer-events: none is safer for zoom gestures unless it contains buttons.
                                    }}>
                                        <Box sx={{ pointerEvents: 'auto' }}>
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
                                                    mt: 2,
                                                    bgcolor: '#8B5CF6',
                                                    color: 'white',
                                                    fontFamily: 'var(--font-prompt)',
                                                }}
                                            />
                                        </Box>
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
