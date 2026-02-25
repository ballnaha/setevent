"use client";

import React, { useState, useEffect, useRef } from "react";
import { Box, Container, Typography, IconButton, Chip, Modal, Paper, Skeleton, Stack, Button } from "@mui/material";
import { CloseCircle, Gallery, ArrowLeft2, ArrowRight2 } from "iconsax-react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectCoverflow, Thumbs, FreeMode } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import "swiper/css/thumbs";
import "swiper/css/free-mode";
import { useTheme as useNextTheme } from 'next-themes';

// Portfolio interface
interface PortfolioItem {
    id: string;
    title: string;
    category: string;
    image: string;
    slug: string;
}

interface PortfolioImageItem {
    id: string;
    url: string;
    caption: string | null;
    order: number;
}

// Categories are now dynamically derived from the database data.
// Empty categories will automatically disappear from the filters.

export default function PortfolioContent({ initialData = [] }: { initialData?: PortfolioItem[] }) {
    const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>(initialData);
    const [loading, setLoading] = useState(initialData.length === 0);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
    const [lightboxIndex, setLightboxIndex] = useState(0);
    const [activeLightboxIndex, setActiveLightboxIndex] = useState(0);
    const [albumImages, setAlbumImages] = useState<PortfolioImageItem[]>([]);
    const [albumLoading, setAlbumLoading] = useState(false);
    const swiperRef = useRef<SwiperType | null>(null);
    const lightboxSwiperRef = useRef<SwiperType | null>(null);
    const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);

    useEffect(() => {
        if (initialData.length === 0) {
            fetchPortfolios();
        }
    }, [initialData]);

    const fetchPortfolios = async () => {
        try {
            const res = await fetch('/api/portfolios', { cache: 'no-store' });
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

    // Get all unique categories from portfolios
    const allCategories = React.useMemo(() => {
        const categoriesFromData = portfolioItems.map(p => p.category);
        const uniqueCategories = Array.from(new Set(categoriesFromData));
        return ["All", ...uniqueCategories.sort()];
    }, [portfolioItems]);

    const filteredItems = selectedCategory === "All"
        ? portfolioItems
        : portfolioItems.filter((d: PortfolioItem) => d.category === selectedCategory);

    const openLightbox = async (item: PortfolioItem, index: number) => {
        setLightboxIndex(index);
        setActiveLightboxIndex(0);
        setSelectedItem(item);
        setAlbumLoading(true);
        try {
            const res = await fetch(`/api/portfolios/${item.id}/images`, { cache: 'no-store' });
            if (res.ok) {
                const data: PortfolioImageItem[] = await res.json();
                // If there are album images, use them; otherwise fallback to single cover
                if (data.length > 0) {
                    setAlbumImages(data);
                } else {
                    setAlbumImages([
                        {
                            id: item.id,
                            url: item.image || '/images/placeholder.jpg',
                            caption: item.title,
                            order: 0
                        }
                    ]);
                }
            } else {
                setAlbumImages([
                    {
                        id: item.id,
                        url: item.image || '/images/placeholder.jpg',
                        caption: item.title,
                        order: 0
                    }
                ]);
            }
        } catch (error) {
            console.error('Error fetching portfolio album images:', error);
            setAlbumImages([
                {
                    id: item.id,
                    url: item.image || '/images/placeholder.jpg',
                    caption: item.title,
                    order: 0
                }
            ]);
        } finally {
            setAlbumLoading(false);
        }
    };

    const closeLightbox = () => {
        setSelectedItem(null);
        setAlbumImages([]);
        setAlbumLoading(false);
        setThumbsSwiper(null);
    };

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
                <Container maxWidth="lg" sx={{ mt: 4 }}>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 4 }}>
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <Box key={i} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                                <Skeleton
                                    variant="rounded"
                                    height={320}
                                    animation="wave"
                                    sx={{
                                        bgcolor: 'var(--border-color)',
                                        opacity: 0.4,
                                        borderRadius: 6
                                    }}
                                />
                                <Box sx={{ px: 1 }}>
                                    <Skeleton variant="text" width="85%" height={32} sx={{ bgcolor: 'var(--border-color)', opacity: 0.7 }} />
                                    <Skeleton variant="text" width="60%" height={24} sx={{ bgcolor: 'var(--border-color)', opacity: 0.4 }} />
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
                    background: 'radial-gradient(circle, var(--decor-emerald) 0%, rgba(0,0,0,0) 70%)',
                    filter: 'blur(60px)',
                    zIndex: 0
                }} />
                <Box sx={{
                    position: 'absolute',
                    bottom: '-10%',
                    left: '-10%',
                    width: '500px',
                    height: '500px',
                    background: 'radial-gradient(circle, var(--decor-ruby) 0%, rgba(0,0,0,0) 70%)',
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
                                letterSpacing: '-1px',
                                textShadow: 'var(--text-glow)'
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
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2 }}>
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <Skeleton key={i} variant="rounded" height={300} sx={{ borderRadius: 3, width: '100%', bgcolor: 'rgba(224,224,224,0.4)', animation: 'pulse 1.5s ease-in-out infinite' }} />
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
                        <Gallery size="64" color="var(--primary)" variant="Bulk" style={{ opacity: 0.3, marginBottom: 20 }} />
                        <Typography variant="h5" sx={{ fontFamily: 'var(--font-prompt)', color: 'var(--foreground)', fontWeight: 600, mb: 1 }}>
                            {selectedCategory !== "All" ? "ไม่พบผลงานในหมวดหมู่นี้" : "ยังไม่มีผลงานในขณะนี้"}
                        </Typography>
                        <Typography sx={{ fontFamily: 'var(--font-prompt)', color: 'var(--foreground)', opacity: 0.6 }}>
                            {selectedCategory !== "All" ? "ลองเลือกหมวดหมู่户外อื่นๆ ดูนะคะ" : "เรากำลังรวบรวมผลงานสวยๆ มาให้ชม เร็วๆ นี้แน่นอนค่ะ"}
                        </Typography>
                        {selectedCategory !== "All" && (
                            <Button
                                onClick={() => setSelectedCategory('All')}
                                sx={{ mt: 3, fontFamily: 'var(--font-prompt)', color: 'var(--primary)' }}
                            >
                                ดูผลงานทั้งหมด
                            </Button>
                        )}
                    </Box>
                ) : (
                    <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
                        gap: 2
                    }}>
                        {filteredItems.map((item, idx) => (
                            <Link
                                key={item.id}
                                href={`/portfolio/${encodeURIComponent(item.slug)}`}
                                style={{ textDecoration: 'none' }}
                            >
                                <Box
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
                                    <Box sx={{
                                        position: 'relative',
                                        width: '100%',
                                        borderRadius: 'inherit',
                                        bgcolor: 'rgba(128,128,128,0.1)',
                                        aspectRatio: 'unset', // Let the image determine height
                                        overflow: 'hidden'
                                    }}>
                                        <Image
                                            src={item.image || '/images/placeholder.jpg'}
                                            alt={item.title}
                                            width={500}
                                            height={500}
                                            priority={idx < 3}
                                            sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
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
                                    </Box>
                                </Box>
                            </Link>
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
                    display: 'flex',
                    flexDirection: 'column',
                    '& .lightbox-main-swiper .swiper-slide:not(.swiper-slide-active)': { visibility: 'hidden' }
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
                        className="lightbox-main-swiper"
                        onSwiper={(swiper) => { lightboxSwiperRef.current = swiper; }}
                        onSlideChange={(swiper) => setActiveLightboxIndex(swiper.realIndex)}
                        modules={[Navigation, Pagination, Thumbs]}
                        initialSlide={lightboxIndex}
                        navigation
                        pagination={{ type: 'fraction' }}
                        thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                        slidesPerView={1}
                        spaceBetween={0}
                        style={{ flex: 1, minHeight: 0, borderRadius: typeof window !== 'undefined' && window.innerWidth < 768 ? 0 : 16 }}
                    >
                        {albumImages.map((img, idx) => (
                            <SwiperSlide key={img.id}>
                                <Box sx={{
                                    position: 'relative',
                                    width: '100%',
                                    height: '100%',
                                    bgcolor: '#000',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    {/* Loading Spinner */}
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            top: '50%',
                                            left: '50%',
                                            transform: 'translate(-50%, -50%)',
                                            zIndex: 0
                                        }}
                                    >
                                        <Box className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" sx={{
                                            borderTopColor: 'var(--primary)',
                                            borderBottomColor: 'transparent',
                                            borderWidth: 4,
                                            borderStyle: 'solid',
                                            borderRadius: '50%',
                                            width: 48,
                                            height: 48,
                                            animation: 'spin 1s linear infinite',
                                            '@keyframes spin': {
                                                '0%': { transform: 'rotate(0deg)' },
                                                '100%': { transform: 'rotate(360deg)' }
                                            }
                                        }} />
                                    </Box>

                                    <Image
                                        src={img.url || '/images/placeholder.jpg'}
                                        alt={img.caption || selectedItem?.title || ''}
                                        fill
                                        priority={Math.abs(idx - activeLightboxIndex) <= 1}
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                                        quality={85}
                                        style={{
                                            objectFit: 'contain',
                                            zIndex: 2,
                                            transition: 'opacity 0.3s ease-in-out'
                                        }}
                                        onLoadingComplete={(imageEl) => {
                                            const parent = imageEl.parentElement;
                                            if (parent) {
                                                const spinner = parent.querySelector('.MuiBox-root');
                                                if (spinner) (spinner as HTMLElement).style.display = 'none';
                                            }
                                        }}
                                    />
                                    {/* Title Overlay */}
                                    <Box sx={{
                                        position: 'absolute',
                                        bottom: 0,
                                        left: 0,
                                        right: 0,
                                        p: { xs: 4, md: 4 },
                                        pb: { xs: 8, md: 4 },
                                        zIndex: 10,
                                        background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)',
                                    }}>
                                        <Typography
                                            sx={{
                                                fontFamily: 'var(--font-prompt)',
                                                fontWeight: 600,
                                                fontSize: '1.5rem',
                                                color: 'white',
                                            }}
                                        >
                                            {selectedItem?.title}
                                        </Typography>
                                        <Chip
                                            label={selectedItem?.category || ''}
                                            size="small"
                                            sx={{
                                                mt: 2,
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

                    {/* Thumbnail Strip */}
                    {albumImages.length > 1 && (
                        <Box sx={{ mt: 1.5, height: { xs: 56, md: 72 }, px: { xs: 1, md: 2 } }}>
                            <Swiper
                                onSwiper={setThumbsSwiper}
                                modules={[FreeMode, Thumbs]}
                                spaceBetween={8}
                                slidesPerView={'auto'}
                                freeMode={true}
                                watchSlidesProgress={true}
                                centerInsufficientSlides={true}
                                style={{ height: '100%' }}
                            >
                                {albumImages.map((img, idx) => (
                                    <SwiperSlide key={`thumb-${img.id}`} style={{ width: 'auto' }}>
                                        <Box
                                            sx={{
                                                width: { xs: 64, md: 96 },
                                                height: '100%',
                                                borderRadius: 1.5,
                                                overflow: 'hidden',
                                                cursor: 'pointer',
                                                border: idx === activeLightboxIndex ? '2px solid var(--primary)' : '2px solid transparent',
                                                opacity: idx === activeLightboxIndex ? 1 : 0.4,
                                                transition: 'all 0.2s',
                                                '&:hover': { opacity: 1 }
                                            }}
                                        >
                                            <Image
                                                src={img.url || '/images/placeholder.jpg'}
                                                alt={`Thumbnail ${idx + 1}`}
                                                width={96}
                                                height={72}
                                                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                                            />
                                        </Box>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </Box>
                    )}
                </Box>
            </Modal>
        </Box>
    );
}
